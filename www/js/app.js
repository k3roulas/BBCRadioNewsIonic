var app = angular.module('BBCRadioNews', ['ionic', 'ngAudio', 'xml', 'ngCordova']);
var develop = false;

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

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'home.html'
        });
        $stateProvider.state('config', {
            url: '/config',
            templateUrl: 'config.html'
        });
});


app.controller('HomeCtrl',  function($scope, $ionicPlatform, ngAudio, $http, $q, x2js, $cordovaFileTransfer, $cordovaFile, store, pullToRefreshService, $ionicScrollDelegate, $cordovaMedia, newsProvider, appConfig) {

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
        }
    }, true);


    // Load saved news
    var list = store.load('news');
    if (list !== null) {
        $scope.newsList = list;
    }

    // On loading, refresh news
    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            if (toState.url == '/') {
                // Use a service to force the usage of the ionic pull to refresh feature
                pullToRefreshService.triggerPtr('pullToRefreshContent');
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



    // test function todo delete
    $scope.pln = function(src) {

        pullToRefreshService.triggerPtr('pullToRefreshContent');
        $scope.refresh('auto');

    };


});