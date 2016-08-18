var undef;
var $ = jQuery = require('jquery');
var Bootstrap = require('bootstrap');
var Backbone = require('backbone');
Backbone.$ = $;

require('browsernizr/test/history');
var Modernizr = require('browsernizr');

var ShareCounter = require('./libs/sharecounter');
var Router = require('./router');
var About = require('./views/about');

module.exports = Backbone.View.extend({

	className: 'interactive-content',

	config: undef,
	rootRequested: false,
	router: undef,
	overlay: undef,

	events: {
		'click a.route': 'linkClick'
	},

	initialize: function(options) {
		var self = this;

	},

	render: function(callback, key){
		var self = this;
		callback.call();
	},

	initRouter: function(){
		var self = this;

		// init the router and push states
	    self.router = new Router({
	    	app: self
	    });

	    // because of IE9 stupidity
	    if (!window.location.origin) {
			window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
		}

	    var root = window.base.replace(window.location.origin, '');

	    // start backbone history
	    Backbone.history.start({
	    	pushState: Modernizr.history,
	    	// pushState: false,
	    	root: root
	    });

	},

	loadConfig: function(callback){
		var self = this;

		if (self.config != undef){
			callback.call();
			return;
		}

		self.showLoading();

		$.ajax({
			dataType: 'json',
			url: 'data/config.json',
		  	success: function(data){
		  		self.config = data;

		  		if (!window.ifInsideIFrame()){

		  			var shareLink = self.config.shareLink == undef ? window.base : self.config.shareLink;

		  			$('#header').html(templates['header']({
		  				shareLink: shareLink,
		  				shareText: self.config.shareText == undef ? self.config.title : self.config.shareText
		  			}));
		  			$('#header').find('a.route').click(function(e){
		  				self.linkClick(e);
		  			});

		  			ShareCounter.count(shareLink, $('.fb-share > .count'), undef, undef, function(){

		  			});
		  		}

		  		callback.call();
		  	}
		});
	},

	showRoot: function(key, value){
		var self = this;

		self.closeOverlay();

		self.loadConfig(function(){
			if (!self.rootRequested){
				self.showLoading();
				self.render(function(){
					self.hideLoading();
				}, key, value);
				self.rootRequested = true;
			}
		});
	},

	showAbout: function(url){
		var self = this;

		self.closeOverlay();

		self.loadConfig(function(){
	    	self.overlay = new About();
	    	self.$el.append(self.overlay.render().$el);
	    	self.hideLoading();	
	    });

	},

	linkClick: function(e){
		var self = this;

        var $a = $(e.currentTarget);

        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }

        var url = $a.attr('href');

        window.app.showLoading();
        window.app.router.navigate(url, true);
	},

	showLoading: function(){
		var self = this;
		$('#loading-overlay').stop().fadeIn(500);
	},

	hideLoading: function(){
		var self = this;
		$('#loading-overlay').stop().fadeOut(500);
	},

	closeOverlay: function(){
		var self = this;

		if (self.overlay != undef){
	    	self.overlay.hide();
	    	self.overlay = undef;
	    }
	}

});