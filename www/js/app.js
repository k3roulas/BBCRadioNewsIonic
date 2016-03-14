// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('BBCRadioNews', ['ionic', 'ngAudio', 'xml', 'ngCordova']);

var develop = true;

app.service('persister', function() {

    var storage = window.localStorage;

    this.load = function(key) {

        var storedNews =  storage.getItem(key);;
        if (storedNews !== null) {
            return JSON.parse(storedNews);
        }
        return null;
    };

    this.save = function(key, value) {
        storage.setItem(key, JSON.stringify(value));
    };
});


app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
});


app.config(
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/')

        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'home.html'
        })
        $stateProvider.state('config', {
            url: '/config',
            templateUrl: 'config.html'
        })
})

var prefix = '';
if (false === develop) {
    prefix = 'http://www.bbc.co.uk';
}

var defaultConfig =  {
    podcasts : [
        {
            source : 'BBC Radio 4',
            rssFlows : [
                { url : prefix + '/programmes/b006qtl3/episodes/downloads.rss', max: 7, label: "The world tonight", dayWeight: 124, enabled: true },
                { url : prefix + '/programmes/b006qjxt/episodes/downloads.rss', max: 7, label: "The six o'clock", dayWeight: 118, enabled: true },
                { url : prefix + '/programmes/b006qptc/episodes/downloads.rss', max: 7, label: "World at one", dayWeight: 113, enabled: true },
            ]
        },
        {
            source : 'Global News Podcast',
            rssFlows : [
                { url : prefix + '/programmes/p02nq0gn/episodes/downloads.rss', max: 14, label: "Global News Podcast", dayWeight: 105, enabled: true },
            ]
        }
        ]
}

//var defaultConfig =  {
//    podcasts : [
//        {
//            source : 'BBC Radio 4',
//            rssFlows : [
//                { url : '/programmes/b006qtl3/episodes/downloads.rss', label: "The world tonight", dayWeight: 124, enabled: true },
//                { url : '/programmes/b006qjxt/episodes/downloads.rss', label: "The six o'clock", dayWeight: 118, enabled: true },
//                { url : '/programmes/b006qptc/episodes/downloads.rss', label: "World at one", dayWeight: 113, enabled: true },
//            ]
//        },
//        {
//            source : 'Global News Podcast',
//            rssFlows : [
//                { url : '/programmes/p02nq0gn/episodes/downloads.rss', label: "Global News Podcast", dayWeight: 105, enabled: true },
//            ]
//        }
//        ]
//}


app.controller('HomeCtrl',  function($scope, $ionicPlatform, ngAudio, $http, $q, x2js, $cordovaFileTransfer, $cordovaFile, persister, $cordovaMedia) {

    $scope.player = null;
    $scope.onAirUrl = null;
    $scope.playerStatus = 'stop';

    $scope.newsList = [];

    var config = persister.load('config');

    // todo
    //if (config === null) {
        $scope.config = defaultConfig;
        persister.save('config', defaultConfig);;
    //}

    //$scope.config = config;


    $scope.$watch('config', function(newVal, oldVal){
        if (newVal !== 'undefined') {
            persister.save('config', newVal);
        }
    }, true);

    var list = persister.load('news');
    if (list !== null) {
        $scope.newsList = list;
    }


    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            if (toState.url == '/') {
                $scope.refresh('auto');
            }
        }
    )


    $scope.refresh = function(auto)
    {

        if (auto === 'auto') {
            $scope.autoRefresh = true;
            console.log('show');
            $scope.$broadcast('loading.show');
        }

        var newsList = [];

        var promises = [];

        // Create a closure to embed the rss and source in the response
        var success = function(rss, source) {

            var localRss = rss;
            var localSource = source;

            return function(result, source) {

                var rssObj = x2js.xml_str2json( result.data );
                var items = rssObj.rss.channel.item;

                for (var itemPos = 0; itemPos < items.length; itemPos++) {

                    // keep only the first
                    if (itemPos == localRss.max) {
                        break;
                    }

                    var item = items[itemPos];
                    var link = item.link;
                    var theDate = new Date();
                    theDate.setTime(Date.parse(item.pubDate));
                    newsList.push(
                        {
                            dayWeight: localRss.dayWeight,
                            theDate: theDate,
                            url: link,
                            label: item.title,
                            source: localSource,
                            class: localSource.replace(/ /g, ""),
                            flow: localRss.label,
                            progress: 0
                        }
                    )

                }
            }
        };


        for (var podCastEnum =0; podCastEnum < $scope.config.podcasts.length; podCastEnum++) {

            var podcast = $scope.config.podcasts[podCastEnum];

            for (var rssFlowEnum=0; rssFlowEnum < podcast.rssFlows.length; rssFlowEnum++) {

                var theRss = podcast.rssFlows[rssFlowEnum];

                if (theRss.enabled) {
                    promises.push(
                        $http.get(theRss.url).then(
                            // Success
                            success(theRss, podcast.source),
                            // Error
                            function(error) {
                                alert(JSON.stringify(error) );
                                // todo
                            }
                        )
                    );
                }
            }

        }

        $q.all(promises).then(function() {

            $scope.$broadcast('scroll.refreshComplete');

            // Sort list by date desc
            var newList = newsList.sort(function(a,b) {
                var aDate = new Date(a.theDate).getTime();
                var bDate = new Date(b.theDate).getTime();
                if (aDate == bDate) {
                    return b.dayWeight - a.dayWeight;
                }
                return bDate - aDate;
            });

            $scope.newsList = newList;
            persister.save('news', newList);

            if (auto === 'auto') {
                $scope.autoRefresh = false;
                $scope.$broadcast('loading.hide');
                console.log('hide');
            }

        });

    }

    $scope.isOnAir = function(news) {
        return (news.url === $scope.onAirUrl);
    }

    $scope.isPlayerAway = function() {
        return ($scope.playerStatus == 'stop');
    }


    $scope.play = function(news) {
        $scope.playerStatus = 'play';
        $scope.onAirUrl = news.url;
        if ($scope.player != null) {
            $scope.player.pause();
        }
        $scope.player = ngAudio.load(news.url);
        $scope.player.play();
    }


    $scope.pause = function() {
        $scope.playerStatus = 'pause';
        if ($scope.player != null) {
            $scope.player.pause();
        }
    }

    $scope.unPause = function() {
        $scope.playerStatus = 'play';
        if ($scope.player != null) {
            $scope.player.play();
        }
    }

    $scope.stop = function() {
        $scope.onAirUrl = null;
        $scope.playerStatus = 'stop';
        if ($scope.player != null) {
            $scope.player.pause();
        }
    }

    $scope.pln = function(src) {
        $scope.refresh('auto');
    }


});


app.directive('loadingDirective', ['$compile', function($compile) {
        'use strict';

        var loadingTemplate = '<div class="loading-directive"><ion-spinner></ion-spinner></div>';
        var _linker = function(scope, element, attrs) {
            element.html(loadingTemplate);
            $compile(element.contents())(scope);

            scope.$on('loading.hide', function() {
                element.addClass('closing');
            });
            scope.$on('loading.show', function() {
                element.removeClass('closing');
            });
        };

        return {
            restrict: 'E',
            link: _linker,
            scope: {
                content: '='
            }
        };
    }]);