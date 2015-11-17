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


app.controller('HomeCtrl',  function($scope, $ionicPlatform, ngAudio, $http, $q, x2js, $cordovaFileTransfer, $cordovaFile) {

    $scope.errorPln = false;
    $scope.testPln = false;
    $scope.player = null;
    $scope.onAirUrl = null;
    $scope.playerStatus = 'stop';

    $scope.newsList = [];


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
        var rssFlow = [
            { url : '/programmes/b006qtl3/episodes/downloads.rss', label: "The world tonight", dayWeight: 124 },
            { url : '/programmes/b006qjxt/episodes/downloads.rss', label: "The six o'clock", dayWeight: 118 },
            { url : '/programmes/b006qptc/episodes/downloads.rss', label: "World at one", dayWeight: 113}
//            { url : 'http://www.bbc.co.uk/programmes/b006qjxt/episodes/downloads.rss', label: "The world tonight", dayWeight: 124 },
//            { url : 'http://www.bbc.co.uk/programmes/b006qtl3/episodes/downloads.rss', label: "The six o'clock", dayWeight: 118 },
//            { url : 'http://www.bbc.co.uk/programmes/b006qptc/episodes/downloads.rss', label: "World at one", dayWeight: 113}
        ];


//        var rssFlow = [
//            '/programmes/b006qjxt/episodes/downloads.rss', // The six o'clock
//            '/programmes/b006qtl3/episodes/downloads.rss', // The world tonight
//            '/programmes/b006qptc/episodes/downloads.rss' // World at one
//            'http://www.bbc.co.uk/programmes/b006qjxt/episodes/downloads.rss', // The six o'clock
//            'http://www.bbc.co.uk/programmes/b006qtl3/episodes/downloads.rss', // The world tonight
//            'http://www.bbc.co.uk/programmes/b006qptc/episodes/downloads.rss' // World at one
//        ];

        var newsList = [];

        var promises = rssFlow.map(function(rss) {

            console.log(rss.url);

            return $http.get(rss.url).then(
                // Success
                function(result) {

                    var rssObj = x2js.xml_str2json( result.data );
                    var items = rssObj.rss.channel.item;

                    for (var itemPos = 0; itemPos < items.length; itemPos++) {
                        var item = items[itemPos];
                        var link = item.link;
                        var theDate = new Date();
                        theDate.setTime(Date.parse(item.pubDate));
                        newsList.push(
                            {
                                dayWeight: rss.dayWeight,
                                rssLabel: rss.label,
                                theDate: theDate,
                                url: link,
                                progress: 0
                            }
                        )
                    }
                },
                // Error
                function(error) {
                    // todo
                }
            );
        })

        $q.all(promises).then(function() {

            // Sort list by date desc
            newList = newsList.sort(function(a,b) {
                aDate = new Date(a.theDate).getTime();
                bDate = new Date(b.theDate).getTime();
                if (aDate == bDate) {
                    return b.dayWeight - a.dayWeight;
                }
                return bDate - aDate;
            });

            $scope.newsList = newList;

        });

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