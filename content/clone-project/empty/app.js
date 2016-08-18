var undef;
var $ = jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var d3 = require('d3-browserify'); // ~150KB !!

var App = require('../../../system/src/js/app');
window.InteractiveApp = App.extend({

	render: function(callback){
		var self = this;

		self.$el.append(templates['index']({
			title: 'Titel für Testprojekt',
			lead: 'Hier kommt der Lead der Story rein.',
			data: 
			[
				{
					title: 'Projekt 1',
					text: 'Text1'
				},
				{
					title: 'Projekt 2',
					text: 'Text2'
				}
			]
		}));

		callback.call();
	}
});