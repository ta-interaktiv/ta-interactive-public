var undef;
var $ = jQuery = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

// Load D3JS
var d3 = require('d3-browserify'); // ~150KB !!

// Backbone Views
var Sprint = require('./sprint');

// Don't forget to 

var App = require('../../../system/src/js/app');

window.InteractiveApp = App.extend({

	events: {
		'click .restart': 'reload',
		'click .play': 'playAnimation',
		'click .sound-switch': 'switchSound'
	},

	render: function(callback){
		var self = this;

		self.play = false;

		self.decimal = 0;
		self.seconds = 0;
		self.minutes = 0;
		self.t = undef;

		self.$el.append(templates['index']({
			title: 'Titel für Testprojekt',
			lead: 'Hier kommt der Lead der Story rein.'
		}));

		self.sprint = new Sprint({
			width: self.$el.width(),
			height: 560
		});

		self.$el.find('.play-button').append(templates['playbutton']({
			title: '2,5 seconds faster than 120 years ago',
			lead: 'All Olympic gold medal winners in the 100m sprint compared in one race. Click Start to play the animation in realtime.<br/>The sprints are based on the linear time difference between 0 and 100 meter.',
			parent: self
		}))
		
		self.pistol = self.$el.find('audio.pistol')[0];
		self.pistol.muted = true;

		self.cheer = self.$el.find('audio.cheer')[0];
		self.cheer.muted = true;

		self.$el.find('.noise-warning').hide();

		self.$el.find('.sprint-container').append(self.sprint.render().$el);

		// No sound on mobile devices
		if(window.isMobile) {
			self.$el.find('.sound-switch').hide();
			self.pistol.muted = true;
			self.cheer.muted = true;
		}

		callback.call();
	},

	switchSound: function(e) {
		var self = this;

		var button = self.$el.find('.sound-switch');
		var icon = self.$el.find('.sound-icon');

		if(self.pistol.muted) {
			self.pistol.muted = false;
			self.cheer.muted = false;
			button.removeClass('red');
			// icon.removeClass('off');
			button.addClass('green');
			// icon.addClass('up');
			self.$el.find('.noise-warning').fadeIn();
		} else {
			self.pistol.muted = true;
			self.cheer.muted = true;
			button.removeClass('green');
			// icon.addClass('off');
			button.addClass('red');
			// icon.removeClass('up');
			self.$el.find('.noise-warning').fadeOut();
		}

	},

	playAnimation: function(e) {
		var self = this;

		self.state = ($(e.currentTarget).attr('id'))

		var audio = self.$el.find('audio');

		audio[0].play();

		if(self.state == 'play') {
			self.$el.find('.play-button').addClass('disabled')
			self.$el.find('.play-button').removeClass('play')
		}


		self.sprint.playAnimation();

		// self.timer();

	},

	playCheers: function(e) {
		var self = this;

		self.cheer.play();

	},

	timer: function(e) {
		var self = this;

		var t = setInterval(function() {
			self.decimal = self.decimal + 10;
			if(self.decimal >= 100) {
				self.decimal = 0;
				self.seconds++;
				if(self.seconds >= 12) {
					self.seconds = 12;
					clearInterval(t);
				}
			}

			// Make time look nice

			if(self.seconds < 10) {
				var showSeconds = '0'+self.seconds;
			} else {
				var showSeconds = self.seconds;
			}

			if(self.decimal < 10) {
				var showDecimal = '0'+self.decimal;
			} else {
				var showDecimal = self.decimal;
			}

			// self.sprint.moveRunner(100*self.seconds+self.decimal);

			$('.time').text(showSeconds+':'+showDecimal);

			// console.log(self.seconds+':'+self.decimal)
		}, 100)

	},

	reload: function(e) {
		var self = this;

		location.reload();
	}
});