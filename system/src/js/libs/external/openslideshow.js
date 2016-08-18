!(function() {
    if (typeof console === "undefined") {
        window.console = {
            log: function() {
                alert([].slice.call(arguments).join("::"));
            }
        };
    }

    RSVP.on('error', function(reason) {
        console.assert(false, reason);

        if (reason && reason.stack) {
            console.log(reason.stack);
        }
    });

    // TODO: Remove code above this line since it's only for dev-purposes

    var queryStringTokens = window.location.search.split(/[&?]/),
        queryParams = {};

    for (var i = 0; i < queryStringTokens.length; i++) {
        if (queryStringTokens[i]) {
            queryParams[queryStringTokens[i].split("=")[0]] = queryStringTokens[i].split("=")[1];
        }
    }

    var config = require("framework/config").config,
        translations = require("framework/translations").translations,
        statistics = require("framework/statistics").statistics,
        Slideshow = require("framework/slideshow/slideshow").Slideshow;
    
    config.apiUrl = 'http://tagesanzeiger.ch/api';
    // config.currentCustomer = 'tagesanzeiger';

    translations.configure(config.language);

    var getNavigationsFullPath = function(navigations) {
        if (navigations && navigations.length > 0) {
            return "/" + navigations[navigations.length - 1].path;
        } else {
            return "";
        }
    };

    window.showSlideshow = function(id, options, container, slideshowData) {
        if (! id) return false;

        options = options || {};
        options.ads = typeof options.ads === "undefined" ? true : options.ads;
        container = container || $("#slideshow")[0] || $('<div id="slideshow"></div>').appendTo("body")[0];

        var that = this,
            slideshow,
            slideshowAdData,
            slideshowImages = RSVP.defer();

        var _loadAdData = function(navigations) {
            return new RSVP.Promise(function(resolve, reject) {
                $.getJSON(config.apiUrl + "/navigations/" + navigations[navigations.length - 1].id + "/ads/default").then(function(data) {
                    for (var i = 0; i < data.ads.length; i++) {
                        if (data.ads[i].name === "Billboard") {
                            return resolve(data.ads[i]);
                        }
                    }
                    resolve();
                }, function() {
                    // Since ad-requests can fail very easyly (ad-blocker), and we also want to display the slideshow,
                    // if ads cannot be loaded, just resolve it in case of error
                    resolve();
                });
            });
        };

        var _initStatistics = function(siteData) {
            statistics.init({
                ga: {
                    trackers: siteData.google_analytics_information.trackers
                }
            }, {
                "google_analytics": {
                    "customVars": [{
                        "name": "device_characteristics",
                        "value": "desktop"
                    }, {
                        "name": "app_mode",
                        "value": "browser"
                    }, {
                        "name": "version",
                        "value": config.version
                    }, {
                        "name": "ad_blocker",
                        "value": !window.adblockJsFile
                    }]
                }
            });
        };

        var _trackStatistics = function(e, index, direction) {
            // Since we want to access slideshowData, we have to wait until that data is loaded before
            // tracking statistics
            RSVP.all([ slideshowImages.promise ]).then(function() {
                statistics.trackPageView(window.location.pathname, slideshowData.statistics);
            });
        };

        slideshow = new Slideshow(container, slideshowImages.promise, $.extend({
            getTitle: function() {
                return slideshowData.title;
            },
            getSubtitle: function() {
                return slideshowData.lead;
            },
            getImageUrl: function(obj, index) {
                return obj.url;
            },
            getImageCaption: function(obj, index, template) {
                return $(template({
                    language: config.language,
                    locale: config.locale,
                    slideshowTitle: slideshowData.title,
                    title: obj.title,
                    caption: obj.caption,
                    annotation: (function() {
                        if ((obj.annotation_type === "picture") && (obj.photographer || obj.provider)) {
                            return translations.translate("Bild") + ": " +
                                (obj.photographer || "") +
                                (obj.photographer && obj.provider ? "/" : "") +
                                (obj.provider || "");
                        }
                    })(),
                    isFirstPicture: (index == 0),
                    imageCount: this.getImageCount(),
                    linkUrl: obj.link_url,
                    linkText: obj.link_title,
                    shareUrl: window.encodeURIComponent("http://www." + config.currentCustomer + ".ch/bildstrecke.html?id=" + slideshowData.id + "&p=" + index),
                    shareText: slideshowData.title,
                    shareTwitterVia: config.twitter.accountName
                })).applyTargetToLinks("_blank");
            },
            getLinks: function(obj, index, template) {
                if (slideshowData.article_preview) {
                    return template({
                        articleLinkUri: "/" + slideshowData.article_preview.legacy_id,
                        articleLinkText: slideshowData.article_preview.title,
                        // slideshowOverviewUri: slideshowData.slideshows_overview_uri
                    });
                } else {
                    return template({ /*slideshowOverviewUri: slideshowData.slideshows_overview_uri*/ });
                }
            },
            getAdUrl: function() {
                if (slideshowAdData) {
                    var url = slideshowAdData.url.split(";");
                    url.push("grp=" + window.adgroupid);
                    url.push("misc=" + new Date().getTime());
                    url.push("kvtsize=" + (this._$.width() >= 640 ? "big" : "small"));

                    for (var i = 0; i < url.length; i++) {
                        var key = url[i].split("=")[0];

                        if (key === "key") {
                            url[i] = url[i].split("+");
                            url[i].push("Bildstrecke");
                            if (queryParams.ws) {
                                url[i].push.apply(url[i], queryParams.ws.split(","));
                            }
                            url[i] = url[i].join("+");
                        }
                    }

                    return url.join(";");
                }
            }
        }, options));

        $(slideshow).on("afterTransition", function(e, obj, index, state) {
            if (state === "fullscreen") {
                _trackStatistics(e, index, "start");
            }else if (state === "inline") { // never show inline gallery --> remove it 
                slideshow._$container.remove();
            }
        }).on("afterSlide", function(e, obj, index, direction) {
            _trackStatistics(e, index, direction);
        });

        // Load sites- and slideshow-feed parallel
        RSVP.all([ (function() {
            // Load site data only once, the first time a slideshow is called, since data will
            // not change for this site
            if (that.siteData) {
                return { site: that.siteData };
            } else {
                return $.getJSON(config.apiUrl + "/sites/default");
            }
        })(), (function() {
            // If the user passes slideshowData to the showSlideshow-function, we do not need to
            // make an api-call. Otherwise load the data from the feed
            if (slideshowData) {
                return { slideshow: slideshowData };
            } else {
                return $.getJSON(config.apiUrl + "/slideshows/" + id);
            }
        })() ]).then(function(data) {
            // Init statistics, but only the first time
            if (! that.siteData) {
                _initStatistics(that.siteData = data[0].site);
            }

            // Extend the slideshow data
            slideshowData = $.extend(data[1].slideshow, {
                slideshows_overview_uri: "http://www." + config.currentCustomer + ".ch" + getNavigationsFullPath(data.navigations) + "/bildstrecke.html"
            });

            // Load ads if enabled and available
            if (options.ads && slideshowData.show_ad && slideshowData.navigations.length) {
                return _loadAdData(slideshowData.navigations);
            }
        }).then(function(data) {
            if (! (slideshowAdData = data)) {
                // If loading of ads failed (for example because of an ad-blocker), disable them
                // in the view
                slideshow.disableAds();
            }

            // window.setTimeout(function() {
                slideshowImages.resolve(slideshowData.pictures);
            // }, 2000);
        });

        // window.setTimeout(function() {
            slideshow.show(options);
        // }, 2000);

        return slideshow;
    };

})();