var undef;
var $ = jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

require('browsernizr/test/history');
var Modernizr = require('browsernizr');

module.exports = Backbone.Router.extend({

    app: undef,

	routes: {
            
		'': 'requestRoot',
        'about': 'requestAbout',
        ':key': 'requestRoot',
        ':key/:value': 'requestRoot'

	},

    initialize: function(options){
        var self = this;
        self.app = options.app;
    },

    requestRoot: function(key, value){
        var self = this;

        self.app.showRoot(key, value);

        // IE9 fallback
        if(!Modernizr.history) {
            var fragment = window.location.href.replace(window.base, '');
            if (fragment.indexOf('#') === -1){
                window.location = window.base + '#' + fragment;
            }
        }
    },

    requestAbout: function(){
        var self = this;
        self.app.showAbout();
    }


});