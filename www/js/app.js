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

//    alert(cordova.file.applicationDirectory);


  });
});


app.controller('HomeCtrl',  function($scope, $ionicPlatform, ngAudio, $http, $q, x2js, $cordovaFileTransfer, $cordovaFile) {

    $scope.errorPln = false;
    $scope.testPln = false;
    $scope.player = null;
    $scope.onAirUrl = null;
    $scope.playerStatus = 'stop';

    $scope.newsList = [];

//    var feedRss = function(rssUrl) {
//
//        $http.get(rssUrl)
//            .success(function(data, status, headers, config) {
//
//                // data example
////                var data = '<?xml version="1.0" encoding="UTF-8"?><rss xmlns:media="http://search.yahoo.com/mrss/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:ppg="http://bbc.co.uk/2009/01/ppgRss" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title>Six O\'Clock News</title><link>http://www.bbc.co.uk/programmes/b006qjxt</link><description>Thirty minutes of news and analysis from Radio 4, featuring the BBC’s top correspondents.</description><itunes:summary>Thirty minutes of news and analysis from Radio 4, featuring the BBC’s top correspondents.</itunes:summary><itunes:author>BBC Radio 4</itunes:author><itunes:owner><itunes:name>BBC</itunes:name><itunes:email>podcast.support@bbc.co.uk</itunes:email></itunes:owner><language>en-gb</language><ppg:systemRef systemId="pid.brand" key="b006qjxt" /><ppg:systemRef systemId="pid.format" key="PT003" /><ppg:systemRef systemId="pid.genre" key="C00079" /><ppg:systemRef systemId="pid.genre" key="C00045" /><ppg:network id="radio4" name="BBC Radio 4" /><ppg:seriesDetails typicalDuration="PT26M" active="true" public="true" region="all" launchDate="2015-03-13" frequency="daily" daysLive="7" liveItems="7" /><image><url>http://www.bbc.co.uk/podcasts/assets/artwork/r4six.jpg</url><title>Six O\'Clock News</title><link>http://www.bbc.co.uk/programmes/b006qjxt</link></image><itunes:image href="http://www.bbc.co.uk/podcasts/assets/artwork/r4six.jpg" /><copyright>(C) BBC 2015</copyright><pubDate>Wed, 22 Apr 2015 18:45:39 +0100</pubDate><itunes:category text="News &amp; Politics" /><itunes:keywords>News, Radio 4, Radio4, Radio Four, BBC, politics, correspondent, corespondent, world, foreign, sport</itunes:keywords><media:keywords>News, Radio 4, Radio4, Radio Four, BBC, politics, correspondent, corespondent, world, foreign, sport</media:keywords><itunes:explicit>no</itunes:explicit><media:rating scheme="urn:simple">nonadult</media:rating><atom:link href="http://downloads.bbc.co.uk/podcasts/radio4/r4six/rss.xml" rel="self" type="application/rss+xml" /><item><title>r4six: 22 Apr 15: Tesco reveals record losses</title><description>The Tesco chief executive insists the company is showing signs of recovery, despite annual losses of nearly six and a half billion pounds.  A share trader is accused of helping to trigger a stock market crash on Wall Street from his home in West London.  And the English National Opera is cutting ticket prices - and turning to some old favourites.</description><itunes:subtitle>The Tesco chief executive insists the company is showing signs of recovery, despite annual losses of nearly six and a half billion pounds. A share trader is accused of helping to trigger a stock market crash on Wall Street from his home in West...</itunes:subtitle><itunes:summary>The Tesco chief executive insists the company is showing signs of recovery, despite annual losses of nearly six and a half billion pounds.  A share trader is accused of helping to trigger a stock market crash on Wall Street from his home in West London.  And the English National Opera is cutting ticket prices - and turning to some old favourites.</itunes:summary><pubDate>Wed, 22 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:37</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150422-1800a.mp3" length="14698808" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150422-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150422-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150422-1800a.mp3" fileSize="14698808" type="audio/mpeg" medium="audio" expression="full" duration="1837" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 21 Apr 15: Former Auschwitz guard on trial</title><description>A former Nazi SS guard -- known as the "bookkeeper of Auschwitz" - tells a court in Germany that he accepts moral guilt for what happened at the concentration camp.  Survivors from one of the boats which sank in the Mediterranean yesterday tell their stories as Europe weighs up how to respond to the unfolding tragedy.  And the first democratically elected President of Egypt, Mohammed Morsi, is jailed for twenty years for ordering the arrest and torture of protesters in 2012.</description><itunes:subtitle>A former Nazi SS guard -- known as the "bookkeeper of Auschwitz" - tells a court in Germany that he accepts moral guilt for what happened at the concentration camp. Survivors from one of the boats which sank in the Mediterranean yesterday tell their...</itunes:subtitle><itunes:summary>A former Nazi SS guard -- known as the "bookkeeper of Auschwitz" - tells a court in Germany that he accepts moral guilt for what happened at the concentration camp.  Survivors from one of the boats which sank in the Mediterranean yesterday tell their stories as Europe weighs up how to respond to the unfolding tragedy.  And the first democratically elected President of Egypt, Mohammed Morsi, is jailed for twenty years for ordering the arrest and torture of protesters in 2012.</itunes:summary><pubDate>Tue, 21 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:35</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150421-1800a.mp3" length="14687064" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150421-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150421-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150421-1800a.mp3" fileSize="14687064" type="audio/mpeg" medium="audio" expression="full" duration="1835" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 20 Apr 15: SNP launches election manifesto</title><description>The Scottish National Party launches its manifesto - insisting it wants to work for the benefit of voters across the UK.  Rescuers are trying to save hundreds more migrants whose boats have foundered off the coast of Libya.  And a convicted fraudster is sentenced after escaping from prison by setting up a fake court website - and issuing instructions for his release.</description><itunes:subtitle>The Scottish National Party launches its manifesto - insisting it wants to work for the benefit of voters across the UK. Rescuers are trying to save hundreds more migrants whose boats have foundered off the coast of Libya. And a convicted fraudster is...</itunes:subtitle><itunes:summary>The Scottish National Party launches its manifesto - insisting it wants to work for the benefit of voters across the UK.  Rescuers are trying to save hundreds more migrants whose boats have foundered off the coast of Libya.  And a convicted fraudster is sentenced after escaping from prison by setting up a fake court website - and issuing instructions for his release.</itunes:summary><pubDate>Mon, 20 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:32</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150420-1800a.mp3" length="14662041" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150420-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150420-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150420-1800a.mp3" fileSize="14662041" type="audio/mpeg" medium="audio" expression="full" duration="1832" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 19 Apr 15: Hundreds of migrants feared drowned in the Mediterranean</title><description>Up to seven-hundred people are feared to have died when a fishing boat packed with migrants capsized off the coast of Libya. David Cameron has intensified his warnings about a post-election deal between Labour and the SNP. Main parties clash over plans to sell off Lloyds bank shares. Aston Villa upset Liverpool in the second FA Cup semi-final.</description><itunes:subtitle>Up to seven-hundred people are feared to have died when a fishing boat packed with migrants capsized off the coast of Libya. David Cameron has intensified his warnings about a post-election deal between Labour and the SNP. Main parties clash over...</itunes:subtitle><itunes:summary>Up to seven-hundred people are feared to have died when a fishing boat packed with migrants capsized off the coast of Libya. David Cameron has intensified his warnings about a post-election deal between Labour and the SNP. Main parties clash over plans to sell off Lloyds bank shares. Aston Villa upset Liverpool in the second FA Cup semi-final.</itunes:summary><pubDate>Sun, 19 Apr 2015 18:26:00 +0100</pubDate><itunes:duration>15:35</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150419-1826a.mp3" length="7487616" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150419-1826.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150419-1826a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150419-1826a.mp3" fileSize="7487616" type="audio/mpeg" medium="audio" expression="full" duration="935" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 18 Apr 15: Labour on immigration</title><description>Labour tries to neutralise criticism of its record on immigration. The HOme Secretary says she\'s concerned about the decision not to prosecute Lord Janner. Five members of a Rochdale family arrested on the Syrian border are released without charge. And should relatives of Joseph Goebbels get royalties for extracts from his diary?</description><itunes:subtitle>Labour tries to neutralise criticism of its record on immigration. The HOme Secretary says she\'s concerned about the decision not to prosecute Lord Janner. Five members of a Rochdale family arrested on the Syrian border are released without charge....</itunes:subtitle><itunes:summary>Labour tries to neutralise criticism of its record on immigration. The HOme Secretary says she\'s concerned about the decision not to prosecute Lord Janner. Five members of a Rochdale family arrested on the Syrian border are released without charge. And should relatives of Joseph Goebbels get royalties for extracts from his diary?</itunes:summary><pubDate>Sat, 18 Apr 2015 18:31:00 +0100</pubDate><itunes:duration>15:40</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150418-1831a.mp3" length="7526528" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150418-1831.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150418-1831a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150418-1831a.mp3" fileSize="7526528" type="audio/mpeg" medium="audio" expression="full" duration="940" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 17 Apr 15: Journalists see charges dropped</title><description>Nine newspaper journalists accused of illegal payments to public officials under Operation Elveden have had the charges against them dropped.  There\'s been another fall in unemployment -- combined with a rise in pay.  And Iraqi officials say government forces have killed Saddam Hussein\'s former deputy, Izzat Ibrahim al-Douri.</description><itunes:subtitle>Nine newspaper journalists accused of illegal payments to public officials under Operation Elveden have had the charges against them dropped. There\'s been another fall in unemployment -- combined with a rise in pay. And Iraqi officials say government...</itunes:subtitle><itunes:summary>Nine newspaper journalists accused of illegal payments to public officials under Operation Elveden have had the charges against them dropped.  There\'s been another fall in unemployment -- combined with a rise in pay.  And Iraqi officials say government forces have killed Saddam Hussein\'s former deputy, Izzat Ibrahim al-Douri.</itunes:summary><pubDate>Fri, 17 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:41</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150417-1800a.mp3" length="14732539" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150417-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150417-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150417-1800a.mp3" fileSize="14732539" type="audio/mpeg" medium="audio" expression="full" duration="1841" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six:16 April 15 Controversy over Lord Janner</title><description>The police have publicly criticised the decision not to prosecute the former Labour MP, Lord Greville Janner, who is suspected of sexually abusing vulnerable children in care homes over three decades.&#xD; Detectives have confirmed that a body found on farmland on the outskirts of Glasgow is that of the missing student Karen Buckley.&#xD;Italian police say they have arrested 15 people over allegations that Christians have been thrown from a migrant boat in the Mediterranean. &#xD;The Chairman of Express Newspapers, Richard Desmond, has announced he\'s giving UKIP more than a million pounds.</description><itunes:subtitle>The police have publicly criticised the decision not to prosecute the former Labour MP, Lord Greville Janner, who is suspected of sexually abusing vulnerable children in care homes over three decades. Detectives have confirmed that a body found on...</itunes:subtitle><itunes:summary>The police have publicly criticised the decision not to prosecute the former Labour MP, Lord Greville Janner, who is suspected of sexually abusing vulnerable children in care homes over three decades.&#xD;Detectives have confirmed that a body found on farmland on the outskirts of Glasgow is that of the missing student Karen Buckley.&#xD;Italian police say they have arrested 15 people over allegations that Christians have been thrown from a migrant boat in the Mediterranean. &#xD;The Chairman of Express Newspapers, Richard Desmond, has announced he\'s giving UKIP more than a million pounds.</itunes:summary><pubDate>Thu, 16 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:40</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150416-1800a.mp3" length="14726755" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150416-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150416-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150416-1800a.mp3" fileSize="14726755" type="audio/mpeg" medium="audio" expression="full" duration="1840" /><itunes:author>BBC Radio 4</itunes:author></item></channel></rss>';
//
//                var rssObj = x2js.xml_str2json( data );
//                console.log(rssObj);
//
//
//                var items = rssObj.rss.channel.item;
//
//                for (var itemPos = 0; itemPos < items.length; itemPos++) {
//                    var item = items[itemPos];
//                    var link = item.link;
//                    var theDate = new Date();
//                    theDate.setTime(Date.parse(item.pubDate));
//                    $scope.newsList.push(
//                        {
//                            theDate: theDate,
//                            url: link
//                        }
//                    )
//                }
//            })
//            .error(function(data, status, headers, config) {
//                $scope.errorPln = data + status + headers;
//            });
//
//    }
//    feedRss('http://downloads.bbc.co.uk/podcasts/radio4/r4six/rss.xml');



//    for(var rssFlowPosition = 0; rssFlowPosition < rssFlow.length; rssFlowPosition ++) {
//
//        feedRss(rssFlow[rssFlowPosition]);
//    }

    var permanentStorage = window.localStorage;
    permanentStorage.setItem('news', '');

    console.log(permanentStorage);

    var encodedNews = permanentStorage.getItem('news');
    if (typeof encodedNews != 'undefined' && encodedNews != null && encodedNews.length != 0)
        if ( encodedNews !== 'undefined') {
            $scope.newsList = JSON.parse(encodedNews);
    }

    var merge = function(existingList, list) {
        var update = false;
        list.map(function(item) {
            // search time and  url in the existing list
            var found = false;
            for (var posList = 0; posList <existingList.length; posList++) {
                var candidate = existingList[posList];
                if ((candidate.theDate.getTime() == item.theDate.getTime())
                    && (candidate.url === item.url)) {
                    found = true;
                }
            }
            if (found === false) {
                existingList.push(item);
                update = true;
            }
        });

        return {update: update, list:existingList};
    }

    $scope.plnCount = 0;

//    permanentStorage.setItem('news', "");




    var fs = CordovaPromiseFS({
      persistent: true, // or false
      storageSize: 20*1024*1024, // storage size in bytes, default 20MB
      concurrency: 3, // how many concurrent uploads/downloads?
      Promise: $q // Your favorite Promise/A+ library!
    });


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

    $scope.refresh = function()
    {

        console.log('refresh');

        var rssFlow = [
            '/programmes/b006qjxt/episodes/downloads.rss', // The six o'clock
//            '/programmes/b006qtl3/episodes/downloads.rss', // The world tonight
//            '/programmes/b006qptc/episodes/downloads.rss' // World at one
//            'http://www.bbc.co.uk/programmes/b006qjxt/episodes/downloads.rss', // The six o'clock
//            'http://www.bbc.co.uk/programmes/b006qtl3/episodes/downloads.rss', // The world tonight
//            'http://www.bbc.co.uk/programmes/b006qptc/episodes/downloads.rss' // World at one
        ];

        var newsList = [];

        var promises = rssFlow.map(function(rssUrl) {

            return $http.get(rssUrl).then(
                // Success
                function(result) {

                    // data example
                    // var data = '<?xml version="1.0" encoding="UTF-8"?><rss xmlns:media="http://search.yahoo.com/mrss/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:ppg="http://bbc.co.uk/2009/01/ppgRss" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"><channel><title>Six O\'Clock News</title><link>http://www.bbc.co.uk/programmes/b006qjxt</link><description>Thirty minutes of news and analysis from Radio 4, featuring the BBC’s top correspondents.</description><itunes:summary>Thirty minutes of news and analysis from Radio 4, featuring the BBC’s top correspondents.</itunes:summary><itunes:author>BBC Radio 4</itunes:author><itunes:owner><itunes:name>BBC</itunes:name><itunes:email>podcast.support@bbc.co.uk</itunes:email></itunes:owner><language>en-gb</language><ppg:systemRef systemId="pid.brand" key="b006qjxt" /><ppg:systemRef systemId="pid.format" key="PT003" /><ppg:systemRef systemId="pid.genre" key="C00079" /><ppg:systemRef systemId="pid.genre" key="C00045" /><ppg:network id="radio4" name="BBC Radio 4" /><ppg:seriesDetails typicalDuration="PT26M" active="true" public="true" region="all" launchDate="2015-03-13" frequency="daily" daysLive="7" liveItems="7" /><image><url>http://www.bbc.co.uk/podcasts/assets/artwork/r4six.jpg</url><title>Six O\'Clock News</title><link>http://www.bbc.co.uk/programmes/b006qjxt</link></image><itunes:image href="http://www.bbc.co.uk/podcasts/assets/artwork/r4six.jpg" /><copyright>(C) BBC 2015</copyright><pubDate>Wed, 22 Apr 2015 18:45:39 +0100</pubDate><itunes:category text="News &amp; Politics" /><itunes:keywords>News, Radio 4, Radio4, Radio Four, BBC, politics, correspondent, corespondent, world, foreign, sport</itunes:keywords><media:keywords>News, Radio 4, Radio4, Radio Four, BBC, politics, correspondent, corespondent, world, foreign, sport</media:keywords><itunes:explicit>no</itunes:explicit><media:rating scheme="urn:simple">nonadult</media:rating><atom:link href="http://downloads.bbc.co.uk/podcasts/radio4/r4six/rss.xml" rel="self" type="application/rss+xml" /><item><title>r4six: 22 Apr 15: Tesco reveals record losses</title><description>The Tesco chief executive insists the company is showing signs of recovery, despite annual losses of nearly six and a half billion pounds.  A share trader is accused of helping to trigger a stock market crash on Wall Street from his home in West London.  And the English National Opera is cutting ticket prices - and turning to some old favourites.</description><itunes:subtitle>The Tesco chief executive insists the company is showing signs of recovery, despite annual losses of nearly six and a half billion pounds. A share trader is accused of helping to trigger a stock market crash on Wall Street from his home in West...</itunes:subtitle><itunes:summary>The Tesco chief executive insists the company is showing signs of recovery, despite annual losses of nearly six and a half billion pounds.  A share trader is accused of helping to trigger a stock market crash on Wall Street from his home in West London.  And the English National Opera is cutting ticket prices - and turning to some old favourites.</itunes:summary><pubDate>Wed, 22 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:37</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150422-1800a.mp3" length="14698808" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150422-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150422-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150422-1800a.mp3" fileSize="14698808" type="audio/mpeg" medium="audio" expression="full" duration="1837" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 21 Apr 15: Former Auschwitz guard on trial</title><description>A former Nazi SS guard -- known as the "bookkeeper of Auschwitz" - tells a court in Germany that he accepts moral guilt for what happened at the concentration camp.  Survivors from one of the boats which sank in the Mediterranean yesterday tell their stories as Europe weighs up how to respond to the unfolding tragedy.  And the first democratically elected President of Egypt, Mohammed Morsi, is jailed for twenty years for ordering the arrest and torture of protesters in 2012.</description><itunes:subtitle>A former Nazi SS guard -- known as the "bookkeeper of Auschwitz" - tells a court in Germany that he accepts moral guilt for what happened at the concentration camp. Survivors from one of the boats which sank in the Mediterranean yesterday tell their...</itunes:subtitle><itunes:summary>A former Nazi SS guard -- known as the "bookkeeper of Auschwitz" - tells a court in Germany that he accepts moral guilt for what happened at the concentration camp.  Survivors from one of the boats which sank in the Mediterranean yesterday tell their stories as Europe weighs up how to respond to the unfolding tragedy.  And the first democratically elected President of Egypt, Mohammed Morsi, is jailed for twenty years for ordering the arrest and torture of protesters in 2012.</itunes:summary><pubDate>Tue, 21 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:35</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150421-1800a.mp3" length="14687064" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150421-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150421-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150421-1800a.mp3" fileSize="14687064" type="audio/mpeg" medium="audio" expression="full" duration="1835" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 20 Apr 15: SNP launches election manifesto</title><description>The Scottish National Party launches its manifesto - insisting it wants to work for the benefit of voters across the UK.  Rescuers are trying to save hundreds more migrants whose boats have foundered off the coast of Libya.  And a convicted fraudster is sentenced after escaping from prison by setting up a fake court website - and issuing instructions for his release.</description><itunes:subtitle>The Scottish National Party launches its manifesto - insisting it wants to work for the benefit of voters across the UK. Rescuers are trying to save hundreds more migrants whose boats have foundered off the coast of Libya. And a convicted fraudster is...</itunes:subtitle><itunes:summary>The Scottish National Party launches its manifesto - insisting it wants to work for the benefit of voters across the UK.  Rescuers are trying to save hundreds more migrants whose boats have foundered off the coast of Libya.  And a convicted fraudster is sentenced after escaping from prison by setting up a fake court website - and issuing instructions for his release.</itunes:summary><pubDate>Mon, 20 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:32</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150420-1800a.mp3" length="14662041" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150420-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150420-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150420-1800a.mp3" fileSize="14662041" type="audio/mpeg" medium="audio" expression="full" duration="1832" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 19 Apr 15: Hundreds of migrants feared drowned in the Mediterranean</title><description>Up to seven-hundred people are feared to have died when a fishing boat packed with migrants capsized off the coast of Libya. David Cameron has intensified his warnings about a post-election deal between Labour and the SNP. Main parties clash over plans to sell off Lloyds bank shares. Aston Villa upset Liverpool in the second FA Cup semi-final.</description><itunes:subtitle>Up to seven-hundred people are feared to have died when a fishing boat packed with migrants capsized off the coast of Libya. David Cameron has intensified his warnings about a post-election deal between Labour and the SNP. Main parties clash over...</itunes:subtitle><itunes:summary>Up to seven-hundred people are feared to have died when a fishing boat packed with migrants capsized off the coast of Libya. David Cameron has intensified his warnings about a post-election deal between Labour and the SNP. Main parties clash over plans to sell off Lloyds bank shares. Aston Villa upset Liverpool in the second FA Cup semi-final.</itunes:summary><pubDate>Sun, 19 Apr 2015 18:26:00 +0100</pubDate><itunes:duration>15:35</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150419-1826a.mp3" length="7487616" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150419-1826.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150419-1826a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150419-1826a.mp3" fileSize="7487616" type="audio/mpeg" medium="audio" expression="full" duration="935" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 18 Apr 15: Labour on immigration</title><description>Labour tries to neutralise criticism of its record on immigration. The HOme Secretary says she\'s concerned about the decision not to prosecute Lord Janner. Five members of a Rochdale family arrested on the Syrian border are released without charge. And should relatives of Joseph Goebbels get royalties for extracts from his diary?</description><itunes:subtitle>Labour tries to neutralise criticism of its record on immigration. The HOme Secretary says she\'s concerned about the decision not to prosecute Lord Janner. Five members of a Rochdale family arrested on the Syrian border are released without charge....</itunes:subtitle><itunes:summary>Labour tries to neutralise criticism of its record on immigration. The HOme Secretary says she\'s concerned about the decision not to prosecute Lord Janner. Five members of a Rochdale family arrested on the Syrian border are released without charge. And should relatives of Joseph Goebbels get royalties for extracts from his diary?</itunes:summary><pubDate>Sat, 18 Apr 2015 18:31:00 +0100</pubDate><itunes:duration>15:40</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150418-1831a.mp3" length="7526528" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150418-1831.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150418-1831a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150418-1831a.mp3" fileSize="7526528" type="audio/mpeg" medium="audio" expression="full" duration="940" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six: 17 Apr 15: Journalists see charges dropped</title><description>Nine newspaper journalists accused of illegal payments to public officials under Operation Elveden have had the charges against them dropped.  There\'s been another fall in unemployment -- combined with a rise in pay.  And Iraqi officials say government forces have killed Saddam Hussein\'s former deputy, Izzat Ibrahim al-Douri.</description><itunes:subtitle>Nine newspaper journalists accused of illegal payments to public officials under Operation Elveden have had the charges against them dropped. There\'s been another fall in unemployment -- combined with a rise in pay. And Iraqi officials say government...</itunes:subtitle><itunes:summary>Nine newspaper journalists accused of illegal payments to public officials under Operation Elveden have had the charges against them dropped.  There\'s been another fall in unemployment -- combined with a rise in pay.  And Iraqi officials say government forces have killed Saddam Hussein\'s former deputy, Izzat Ibrahim al-Douri.</itunes:summary><pubDate>Fri, 17 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:41</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150417-1800a.mp3" length="14732539" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150417-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150417-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150417-1800a.mp3" fileSize="14732539" type="audio/mpeg" medium="audio" expression="full" duration="1841" /><itunes:author>BBC Radio 4</itunes:author></item><item><title>r4six:16 April 15 Controversy over Lord Janner</title><description>The police have publicly criticised the decision not to prosecute the former Labour MP, Lord Greville Janner, who is suspected of sexually abusing vulnerable children in care homes over three decades.&#xD; Detectives have confirmed that a body found on farmland on the outskirts of Glasgow is that of the missing student Karen Buckley.&#xD;Italian police say they have arrested 15 people over allegations that Christians have been thrown from a migrant boat in the Mediterranean. &#xD;The Chairman of Express Newspapers, Richard Desmond, has announced he\'s giving UKIP more than a million pounds.</description><itunes:subtitle>The police have publicly criticised the decision not to prosecute the former Labour MP, Lord Greville Janner, who is suspected of sexually abusing vulnerable children in care homes over three decades. Detectives have confirmed that a body found on...</itunes:subtitle><itunes:summary>The police have publicly criticised the decision not to prosecute the former Labour MP, Lord Greville Janner, who is suspected of sexually abusing vulnerable children in care homes over three decades.&#xD;Detectives have confirmed that a body found on farmland on the outskirts of Glasgow is that of the missing student Karen Buckley.&#xD;Italian police say they have arrested 15 people over allegations that Christians have been thrown from a migrant boat in the Mediterranean. &#xD;The Chairman of Express Newspapers, Richard Desmond, has announced he\'s giving UKIP more than a million pounds.</itunes:summary><pubDate>Thu, 16 Apr 2015 18:00:00 +0100</pubDate><itunes:duration>30:40</itunes:duration><enclosure url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150416-1800a.mp3" length="14726755" type="audio/mpeg" /><guid isPermaLink="false">http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150416-1800.mp3</guid><link>http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150416-1800a.mp3</link><media:content url="http://downloads.bbc.co.uk/podcasts/radio4/r4six/r4six_20150416-1800a.mp3" fileSize="14726755" type="audio/mpeg" medium="audio" expression="full" duration="1840" /><itunes:author>BBC Radio 4</itunes:author></item></channel></rss>';

                    var rssObj = x2js.xml_str2json( result.data );

                    var items = rssObj.rss.channel.item;

                    for (var itemPos = 0; itemPos < items.length; itemPos++) {
                        var item = items[itemPos];
                        var link = item.link;
                        var theDate = new Date();
                        theDate.setTime(Date.parse(item.pubDate));
                        newsList.push(
                            {
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

            if ($scope.plnCount == 0) {
                newsList.shift();
                $scope.plnCount++;
            }

            // merge result with news from the scope
            result = merge($scope.newsList, newsList);

            if (result.update) {
                // Sort list by date desc
                newList = newsList.sort(function(a,b) {
                    return new Date(b.theDate).getTime() - new Date(a.theDate).getTime();
                });

                var permanentStorage = window.localStorage;
                permanentStorage.setItem('news', JSON.stringify($scope.newsList));

                $scope.newsList = newList;
            }


        });

    }


    $scope.plnProgress = 'no';
    $scope.download = function () {



        // Todo check free space -> alert($cordovaFile.getFreeDiskSpace());


        var directory = 'audioFiles';

        var filename = this.news.url.split(/[\\/]/).pop();

//        $cordovaFile.createDir(directory, false);
//        var newFile = $cordovaFile.createFile(directory + '/' + filename, false);

        var filePath = cordova.file.dataDirectory + '/download/' + filename;
        var options = {};
        var trustHosts = true;

        var theNews = this.news;
        theNews.progress = 'start';

        $cordovaFileTransfer.download(this.news.url, filePath, options, trustHosts)
            .then(
                function(result) {
                    alert('downloaded');
                },
                function(err) {
                    alert('error');
                },
                function(progress) {
                    theNews.progress = parseInt((progress.loaded / progress.total) * 100);
                }
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

        // Internal function

//        // Function init with argument from backend to init the application
//        $scope.initDocument = function(clientid, scorecardversionId, existingDocument) {
//
//            $scope.client = {id: clientid };
//            $scope.selectedScorecardVersionId = scorecardversionId;
//
//            if (typeof existingDocument == 'undefined' || existingDocument == null) {
//                existingDocument = {
//                    parameters: new ParameterData(),
//                    reports: []
//                }
//            }
//            $scope.document = existingDocument;
//
//        }
//

//        // Fire by a click on an element
//        $scope.edit = function(scope) {
//            $scope.currentReport = scope.$modelValue;
//
//        };


//        $scope.addReport = function(name)
//        {
//            var report = $scope.reportFactory.createReport(name);
//            $scope.document.reports.push(report);
//        }
//
//    }])

//        // Get parameter from backend
//        $scope.updateParameters = function(type) {
//
//            var selection = {
//                clientId: $scope.client.id,
//                scorecardVersionId: $scope.selectedScorecardVersionId,
//                manufacturerId: $scope.selectedManufacturerId,
//                countryId: $scope.selectedCountryId,
//                regionId: $scope.selectedRegionId,
//                areaId: $scope.selectedAreaId,
//                departmentId: $scope.selectedDepartmentId,
//                clientBranchId: $scope.selectedBranchId
//            };
//
//            $http({
//                url: '/app_dev.php/api/parameter',
//                method: "GET",
//                params: selection
//            }).success(function(data, status, headers, config) {
//                $scope.scorecardVersions = data.scorecardVersions;
//                $scope.manufacturers = data.manufacturers;
//                $scope.countries = data.countries;
//                $scope.regions = data.regions;
//                $scope.areas = data.areas;
//                $scope.departments = data.departments;
//                $scope.branches = data.branches;
//            }).error(function(data, status, headers, config) {
//                console.log('error');
//            });
//
//        }
//

//        var findById = function(aArray, aId) {
//            var aObject = null;
//            for (var i = 0; i < aArray.length; i++) {
//                if (aArray[i].id === aId) {
//                    aObject = aArray[i];
//                    break;
//                }
//            }
//            return aObject;
//        }

