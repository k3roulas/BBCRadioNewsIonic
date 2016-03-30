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


    // TODO : define if the initialisation of promiseFS has to be done here
    var fs = CordovaPromiseFS({
        persistent: true, // or false
        storageSize: 50*1024*1024, // storage size in bytes, default 20MB
        concurrency: 4, // how many concurrent uploads/downloads?
        Promise: $q // Your favorite Promise/A+ library!
    });

    fs.ensure('downloads');


    //
    //var merge = function(existingList, list) {
    //
    //    var update = false;
    //    list.map(function(item) {
    //        // search url in the existing list
    //        var found = false;
    //        for (var posList = 0; posList <existingList.length; posList++) {
    //            var candidate = existingList[posList];
    //            if ((candidate.theDate.getTime() == item.theDate.getTime())
    //                && (candidate.url === item.url)) {
    //                found = true;
    //            }
    //        }
    //        if (found === false) {
    //            existingList.push(item);
    //            update = true;
    //        }
    //    });
    //
    //    return {update: update, list:existingList};
    //}
    //
    //
    //var mergeNews = function(oldList, newList) {
    //
    //    var updatedList;
    //    var deletedElements;
    //    var newElements;
    //
    //    var tmpOldList = [];
    //    var tmpNewList = [];
    //
    //    oldList.map(function(item) {
    //        tmpOldList.push(item);
    //    });
    //    newList.map(function(item) {
    //        tmpNewList.push(item);
    //    });
    //
    //    var search = function(list, candidate) {
    //        var foundPos = null;
    //        var posList = null;
    //        for (posList = 0; posList <list.length; posList++) {
    //            var item = list[posList];
    //
    //            // TODO : understand why this one is not a date, probably because it's from a backup
    //            // TODO : May be have a look to http://stackoverflow.com/questions/4511705/how-to-parse-json-to-receive-a-date-object-in-javascript
    //            var theItemDate = new Date();
    //            theItemDate.setTime(Date.parse(item.theDate));
    //
    //            if ((candidate.theDate.getTime() == theItemDate.getTime())
    //                && (candidate.url == item.url)) {
    //                foundPos = posList;
    //                break;
    //            }
    //        }
    //
    //        return foundPos;
    //    };
    //
    //    tmpNewList.map(function(item) {
    //
    //        var posOldList = search(tmpOldList, item);
    //        if (posOldList !== null) {
    //
    //            // Update element
    //            item.downloaded = tmpOldList[posOldList].downloaded;
    //
    //            // Remove element from old list
    //            tmpOldList.splice(posOldList, 1);
    //        }
    //
    //    });
    //
    //    deletedElements = tmpOldList;
    //
    //    console.log('deletedElements');
    //    console.log(deletedElements);
    //
    //    return tmpNewList;
    //
    //};



    // On loading, refresh news
    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            if (toState.url == '/') {
                // Schedule 1/4 second the use a service to force the usage of the ionic pull to refresh feature
                $timeout(function() {pullToRefreshService.triggerPtr('pullToRefreshContent')}, 210);
            }
        }
    );



    $scope.downloaded = function() {
        console.log(this.news);
        this.news.downloaded = !(this.news.downloaded);
    };

    $scope.download = function (news) {

        // Todo check free space -> alert($cordovaFile.getFreeDiskSpace());

        var filename = news.url.split(/[\\/]/).pop();
        var directory = 'audioFiles';
        var destination = 'download/' + filename;
        var source = news.url;
        //var source = this.news.url.replace('http://open.live.bbc.co.uk/mediaselector', '/mediaselector');

        console.log(source, destination);

        var theNews = news;
        var pro = fs.download(
            source,
            destination,
            function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    theNews.downloaded = true;
                    var percentComplete = progressEvent.loaded / progressEvent.total;
                    console.log(percentComplete);
                    theNews.progress = percentComplete * 100;
                    $scope.$apply();
                } else {
                    // Unable to compute progress information since the total size is unknown
                }
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

    };


    $scope.refresh = function(auto) {
        newsProvider.refresh(auto);
    };

    $scope.createFile = function() {
        fs.write("fuck.txt", "what the fuck").then(
            function() {console.log('success'); },
            function() {console.log('error'); }
        );
    };

    $scope.readFile = function() {
        fs.read("fuck.txt").then(
            function(e) {console.log('success');console.log(e); },
            function() {console.log('error'); }
        );
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
