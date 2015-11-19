// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('BBCRadioNews', ['ionic', 'ngAudio', 'xml', 'ngCordova']);


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



var defaultConfig =  {
    podcasts : [
        {
            source : 'BBC Radio 4',
            rssFlows : [
                { url : '/programmes/b006qtl3/episodes/downloads.rss', label: "The world tonight", dayWeight: 124, enabled: true },
                { url : '/programmes/b006qjxt/episodes/downloads.rss', label: "The six o'clock", dayWeight: 118, enabled: true },
                { url : '/programmes/b006qptc/episodes/downloads.rss', label: "World at one", dayWeight: 113, enabled: true },
            ]
        },
        {
            source : 'Global News Podcast',
            rssFlows : [
                { url : '/programmes/p02nq0gn/episodes/downloads.rss', label: "Global News Podcast", dayWeight: 105, enabled: true },
            ]
        }
        ]
}


app.controller('HomeCtrl',  function($scope, $ionicPlatform, ngAudio, $http, $q, x2js, $cordovaFileTransfer, $cordovaFile) {

    $scope.errorPln = false;
    $scope.testPln = false;
    $scope.player = null;
    $scope.onAirUrl = null;
    $scope.playerStatus = 'stop';

    $scope.newsList = [];


    // TODO : encapsulate that
    var storage = window.localStorage;
    var storedConfig =  storage.getItem('config');

    if (storedConfig !== null) {
        $scope.config = JSON.parse(storedConfig);
    } else {
        $scope.config = defaultConfig;
    }

//    $scope.config = defaultConfig;


    $scope.$watch('config', function(newVal, oldVal){
        if (newVal !== 'undefined') {
            storage.setItem('config', JSON.stringify(newVal));
        }
    }, true);


    // TODO : define if the initialisation of promiseFS has to be done here
    var fs = CordovaPromiseFS({
        persistent: true, // or false
        storageSize: 50*1024*1024, // storage size in bytes, default 20MB
        concurrency: 4, // how many concurrent uploads/downloads?
        Promise: $q // Your favorite Promise/A+ library!
    });

    fs.ensure('downloads');


    $scope.loadNews = function() {
        var storedNews =  storage.getItem('news');
        if (storedNews !== null) {
            $scope.newsList = JSON.parse(storedNews);
//            console.log(JSON.parse(storedNews));
        }
    };

    $scope.saveNews = function() {
        console.log($scope.newsList);
        storage.setItem('news', JSON.stringify($scope.newsList));
    };

    var mergeNewOld = function(newList, oldList) {
        var ret = { new: [],  deleted: []};

        return ret;
    }

//    {
//        "name": "BBCRadioNewsIonic",
//        "app_id": "",
//        "proxies": [
//        {
//            "path": "/programmes",
//            "proxyUrl": "http://www.bbc.co.uk/programmes"
//        }
//    ]
//    }


    $scope.refresh = function()
    {
//        var rssFlow = [
//            { url : '/programmes/b006qtl3/episodes/downloads.rss', label: "The world tonight", dayWeight: 124 },
//            { url : '/programmes/b006qjxt/episodes/downloads.rss', label: "The six o'clock", dayWeight: 118 },
//            { url : '/programmes/b006qptc/episodes/downloads.rss', label: "World at one", dayWeight: 113}
//            { url : 'http://www.bbc.co.uk/programmes/b006qjxt/episodes/downloads.rss', label: "The world tonight", dayWeight: 124 },
//            { url : 'http://www.bbc.co.uk/programmes/b006qtl3/episodes/downloads.rss', label: "The six o'clock", dayWeight: 118 },
//            { url : 'http://www.bbc.co.uk/programmes/b006qptc/episodes/downloads.rss', label: "World at one", dayWeight: 113}
//        ];


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
                                // todo
                            }
                        )
                    );
                }
            }

        }

        $q.all(promises).then(function() {

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

        });

    }


    $scope.download = function () {

        // Todo check free space -> alert($cordovaFile.getFreeDiskSpace());


        var filename = this.news.url.split(/[\\/]/).pop();
        var directory = 'audioFiles';
        var destination = 'download/' + filename;
        var source = this.news.url.replace('http://open.live.bbc.co.uk/mediaselector', '/mediaselector');

        console.log(source, destination);

        var pro = fs.download(
            source,
            destination,
            function(progress) {
                console.log('progress');
                console.log(progress);
//                theNews.progress = parseInt((progress.loaded / progress.total) * 100);
            }
        );

        pro.then(
            function() {console.log('success'); },
            function() {console.log('error'); }
        );
//        var promise = fs.download(
//            this.news.url,
//            destination,
//            function(progress) {
//                console.log(progress);
//                theNews.progress = parseInt((progress.loaded / progress.total) * 100);
//            }
//        );
//



        console.log('download  ' + filename);

//        $cordovaFile.createDir(directory, false);
//        var newFile = $cordovaFile.createFile(directory + '/' + filename, false);

//        var filePath = cordova.file.dataDirectory + '/download/' + filename;
//        var options = {};
//        var trustHosts = true;
//
//        var theNews = this.news;
//        theNews.progress = 'start';
//
//        $cordovaFileTransfer.download(this.news.url, filePath, options, trustHosts)
//            .then(
//            function(result) {
//                alert('downloaded');
//            },
//            function(err) {
//                alert('error');
//            },
//            function(progress) {
//                theNews.progress = parseInt((progress.loaded / progress.total) * 100);
//            }
//        );

    }


    $scope.createFile = function() {
        fs.write("fuck.txt", "what the fuck").then(
            function() {console.log('success'); },
            function() {console.log('error'); }
        );
    }

    $scope.readFile = function() {
        fs.read("fuck.txt").then(
            function(e) {console.log('success');console.log(e); },
            function() {console.log('error'); }
        );
    }

    $scope.isOnAir = function(news) {
        return (news.url === $scope.onAirUrl);
    }

    $scope.isPlayerAway = function() {
        return ($scope.playerStatus == 'stop');
    }


    $scope.play = function(url) {
        console.log(url);
        $scope.playerStatus = 'play';
        $scope.onAirUrl = url;
        if ($scope.player != null) {
            $scope.player.pause();
        }
        $scope.player = ngAudio.load(url);
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


});