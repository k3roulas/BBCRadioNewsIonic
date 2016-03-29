var app = angular.module('BBCRadioNews', ['ionic', 'ngAudio', 'xml', 'ngCordova', 'http-throttler']);
var develop = false;

app.run(function($ionicPlatform, TrackingCode) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    //if(window.cordova && window.cordova.plugins.Keyboard) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //}
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (typeof analytics !== 'undefined'){
        analytics.startTrackerWithId(TrackingCode);
        analytics.analytics.trackView('home');
    } else {
        analytics = {
            trackView: function(view) {
                console.log('trackView ' + view);
            },
            trackEvent: function(a, b, c, d) {
                c = c || '';
                d = d || '';
                console.log('trackEvent ' + a + ' ' + b + ' ' + c + ' ' + d);
            }
        }
    }

  });

});


app.config(
    function($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'home.html',
            onEnter: function() {
                if (typeof analytics !== 'undefined') {
                    analytics.trackView('home');
                }
            }
        });
        $stateProvider.state('config', {
            url: '/config',
            templateUrl: 'config.html',
            onEnter: function() {
                if (typeof analytics !== 'undefined') {
                    analytics.trackView('config');
                }
            }
        });

        $httpProvider.interceptors.push('httpThrottler');

    });


app.controller('BBCCtrl',  function($scope, $timeout, $ionicPlatform, ngAudio, $http, $q, x2js, $cordovaFileTransfer, $cordovaFile, store, pullToRefreshService, $ionicScrollDelegate, $cordovaMedia, newsProvider, appConfig) {

    $scope.player = null;
    $scope.onAirUrl = null;
    $scope.playerStatus = 'stop';

    // todo move load in .config ?
    appConfig.load();

    $scope.newsContainer = newsProvider.newsContainer;


    // Load application configuration
    $scope.config = appConfig.config;


    // Watch the configuration, and save it when it's changed
    $scope.$watch('config', function(newVal, oldVal){
        if (newVal !== 'undefined') {
            store.save('config', newVal);
            if(typeof analytics !== 'undefined') {
                analytics.trackEvent('Config', 'Change');
            }
        }
    }, true);


    // On loading, refresh news
    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            if (toState.url == '/') {
                // Schedule 1/4 second the use a service to force the usage of the ionic pull to refresh feature
                $timeout(function() {pullToRefreshService.triggerPtr('pullToRefreshContent')}, 210);
            }
        }
    );

    $scope.refresh = function(auto) {
        newsProvider.refresh(auto);
    };

    $scope.isOnAir = function(news) {
        return (news.url === $scope.onAirUrl);
    };

    $scope.isPlayerAway = function() {
        return ($scope.playerStatus == 'stop');
    };

    $scope.play = function(news) {
        $scope.playerStatus = 'play';
        $scope.onAirUrl = news.url;
        if ($scope.player != null) {
            $scope.player.pause();
        }
        $scope.player = ngAudio.load(news.url);
        $scope.player.play();
        analytics.trackEvent('Player', 'Play Remote', news.flow);
    };


    $scope.pause = function() {
        $scope.playerStatus = 'pause';
        if ($scope.player != null) {
            $scope.player.pause();
        }
    };

    $scope.unPause = function() {
        $scope.playerStatus = 'play';
        if ($scope.player != null) {
            $scope.player.play();
        }
    };

    $scope.stop = function() {
        $scope.onAirUrl = null;
        $scope.playerStatus = 'stop';
        if ($scope.player != null) {
            $scope.player.pause();
        }
    };

    $scope.rewind = function() {
        if ($scope.player != null) {
            $scope.player.setCurrentTime(
                Math.max($scope.player.currentTime - 30, 0)
            );
        }
    };

    $scope.forward = function() {
        if ($scope.player != null) {
            $scope.player.setCurrentTime(
                Math.min($scope.player.currentTime + 30, $scope.player.duration)
            );
        }
    };

    $scope.canPlay = function() {
        if ($scope.player) {
            return $scope.player.canPlay && ($scope.player.duration != 0);
        }
    };


});
