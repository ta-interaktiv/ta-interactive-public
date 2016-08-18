var undef;
var Backbone = require('backbone');
var $ = jQuery = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({

	className: 'overlay',

    $articleTeaser: undef,

	events: {
		'click .close-icon': 'close',
        'click .arrow.right': 'gotoNext',
        'click .arrow.left': 'gotoPrev'
	},

	
	initialize: function(options){
  		var self = this;

    },
    
    render: function(){
        var self = this;
        return self.renderFrame();
    },

    renderFrame: function(){
    	var self = this;

    	self.$el.append($('<div class="inside-overlay">'+
    		'<div class="close-icon"></div>'+
    	'</div>'));

        return self;
    },

    close: function(){
    	var self = this;
        window.app.router.navigate('', true);
    },

    hide: function(){
    	var self = this;
    	self.remove();
    }

});