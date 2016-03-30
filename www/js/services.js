/**
 * A key value storage
 */
app.service('store', function() {

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


app.service('pullToRefreshService', ['$timeout', '$ionicScrollDelegate', function($timeout, $ionicScrollDelegate) {

    /**
     * Trigger the pull-to-refresh on a specific scroll view delegate handle.
     * @param {string} delegateHandle - The `delegate-handle` assigned to the `ion-content` in the view.
     */
    this.triggerPtr = function(delegateHandle) {

        $timeout(function() {

            var scrollView = $ionicScrollDelegate.$getByHandle(delegateHandle).getScrollView();

            if (!scrollView) return;

            scrollView.__publish(
                scrollView.__scrollLeft, -scrollView.__refreshHeight,
                scrollView.__zoomLevel, true);

            var d = new Date();

            scrollView.refreshStartTime = d.getTime();

            scrollView.__refreshActive = true;
            scrollView.__refreshHidden = false;
            if (scrollView.__refreshShow) {
                scrollView.__refreshShow();
            }
            if (scrollView.__refreshActivate) {
                scrollView.__refreshActivate();
            }
            if (scrollView.__refreshStart) {
                scrollView.__refreshStart();
            }

        });

    }
}]);

app.service('appConfig', ['store', function(store) {

    var prefix = '';
    if (false === develop) {
        prefix = 'http://www.bbc.co.uk';
    }

    var defaultConfig =  {
        version : '1.0',
        podcasts : [
            {
                source : 'BBC Radio 4',
                rssFlows : [
                    { url : prefix + '/programmes/b006qtl3/episodes/downloads.rss', max: 4, label: "The world tonight", dayWeight: 124, enabled: true },
                    { url : prefix + '/programmes/b006qjxt/episodes/downloads.rss', max: 4, label: "The six o'clock", dayWeight: 118, enabled: true },
                    { url : prefix + '/programmes/b006qptc/episodes/downloads.rss', max: 4, label: "World at one", dayWeight: 113, enabled: true },
                    { url : prefix + '/programmes/p02nrtvg/episodes/downloads.rss', max: 4, label: "Best of today", dayWeight: 105, enabled: true },
                ]
            },
            {
                source : 'Global News Podcast',
                rssFlows : [
                    { url : prefix + '/programmes/p02nq0gn/episodes/downloads.rss', max: 8, label: "Global news podcast", dayWeight: 105, enabled: true },
                    { url : prefix + '/programmes/p02nrsmt/episodes/downloads.rss', max: 4, label: "Daily commute", dayWeight: 105, enabled: true },
                    { url : prefix + '/programmes/p0299wgd/episodes/downloads.rss', max: 1, label: "The world this week", dayWeight: 105, enabled: true },
                ]
            }
        ]
    };

    this.config = {};

    this.load = function() {
        this.config = defaultConfig;
        //var config = store.load('config');
        //if (config === null) {
        //    this.config = defaultConfig;
        //    store.save('config', this.config);
        //} else {
        //    this.config = config;
        //}
    }

}]);

app.service('newsProvider', ['$timeout', '$http', 'x2js', '$q', 'store', 'appConfig', '$rootScope', 'httpThrottler', function($timeout, $http, x2js, $q, store, appConfig, $rootScope, httpThrottler) {

    // Load from storage
    var news = store.load('news');
    if (null === news) {
        news = [];
    }
    this.newsContainer = {
        news: news
    };

    this.refresh = function(auto) {

        var newsList = [];
        var promises = [];

        // The app need some air to breath
        // Will be revert at the end of the refresh
        httpThrottler.setMaxConcurrentRequests(2);

        if (typeof analytics !== 'undefined') {
            analytics.trackEvent('User', 'Refresh')
        }

        // Create a closure to embed the rss and source in the response
        var success = function (rss, source, theRss) {

            var localRss = rss;
            var localSource = source;

            return function (result, source) {

                var rssObj = x2js.xml_str2json(result.data);
                var items = rssObj.rss.channel.item;

                for (var itemPos = 0; itemPos < items.length; itemPos++) {

                    // keep only the max
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
                            downloaded: false,
                            progress: 0
                        })
                }
            }
        };

        var podcasts = appConfig.config.podcasts;
        for (var podCastEnum = 0; podCastEnum < podcasts.length; podCastEnum++) {

            var podcast = podcasts[podCastEnum];

            for (var rssFlowEnum = 0; rssFlowEnum < podcast.rssFlows.length; rssFlowEnum++) {

                var theRss = podcast.rssFlows[rssFlowEnum];

                if (theRss.enabled) {
                    promises.push(
                        $http.get(theRss.url).then(
                            // Success
                            success(theRss, podcast.source),
                            // Error
                            function (error) {

                                if (typeof analytics !== 'undefined') {
                                    analytics.trackEvent('Error', 'Refresh', theRss.label, error.status);
                                }

                            }
                        )
                    );
                }
            }

        }

        var newsContainer = this.newsContainer;
        $q.all(promises).then(function () {

            $rootScope.$broadcast('scroll.refreshComplete');

            // Sort list by date desc
            var newList = newsList.sort(function (a, b) {
                var aDate = new Date(a.theDate).getTime();
                var bDate = new Date(b.theDate).getTime();
                if (aDate == bDate) {
                    return b.dayWeight - a.dayWeight;
                }
                return bDate - aDate;
            });

            newsContainer.news = newList;

            store.save('news', newList);

        });

        // Disable the throttler
        httpThrottler.setMaxConcurrentRequests(25);
    }


}]);




