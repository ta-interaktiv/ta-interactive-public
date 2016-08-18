var undef;
var Backbone = require('backbone');
var $ = jQuery = require('jquery');
Backbone.$ = $;

var _ = require('underscore');
window._ = _;

var Overlay = require('./overlay');

module.exports = Overlay.extend({


	initialize: function(options){
  		var self = this;

  		self.$el.addClass('white');
    },

    render: function(){
    	var self = this;

    	self.renderFrame();

    	self.$el.find('.inside-overlay').append($(templates['about']({
  			title: window.app.config.about.title,
  			description: window.app.config.about.description,
            credits: window.app.config.about.credits
  		})));

    	return self;
    }

});