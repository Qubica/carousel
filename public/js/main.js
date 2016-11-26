var Application = Backbone.View.extend({

	el: '.application',

	initialize: function() {

		_.bindAll(
			this,
			'_indexProgressHandler',
			'_indexActiveHandler',
			'_keydownHandler'
		);

		var elCarousel = this.el.querySelector('.js-carousel');
		var elCarouselItems = this.el.querySelectorAll('.js-carousel-item');

		this._carousel = new Carousel({
			el: elCarousel,
			numItems: elCarouselItems.length,
			concurrent: true
		});

		this._setupEventListener();

		// setup animations
		// 0 - 0.5 is in animation
		// 0.5 - 1 is out animations

		this._slides = [];
		var timeline;
		for(var i=0; i<elCarouselItems.length; i++) {
			timeline = new TimelineMax({paused:true});
			timeline.from(elCarouselItems[i], 0.5, {x:400, ease:Power0.easeNone}, 0);
			timeline.fromTo(elCarouselItems[i], 0.5, {alpha:0}, {alpha:1, yoyo:true, repeat:1, ease:Power1.easeIn}, 0);
			timeline.to(elCarouselItems[i], 0.5, {x:-400, ease:Power0.easeNone}, 0.5);

			this._slides.push(timeline);
		}

		this._carousel.setIndex(0);

	},

	_setupEventListener: function() {

		this.listenTo(this._carousel, 'index:active', this._indexActiveHandler);
		this.listenTo(this._carousel, 'index:progress', this._indexProgressHandler);

		window.addEventListener('keydown', this._keydownHandler);  			

	},

	_indexActiveHandler: function(e) {

		// console.log('active', e.index);

	},

	_indexProgressHandler: function(e) {

		this._slides[e.index].progress(e.progress);

	},

	_keydownHandler: function(e) {

		if(e.keyCode == 37) {
			this._carousel.tweenToPreviousIndex();
  		}
  		else if(e.keyCode == 39) {
			this._carousel.tweenToNextIndex();
  		}

  		// 1
  		if(e.keyCode == 48) {
			this._carousel.setIndex(0);
  		}
  		// 2
  		if(e.keyCode == 49) {
			this._carousel.setIndex(1);
  		}
  		// 3
  		if(e.keyCode == 50) {
			this._carousel.setIndex(2);
  		}
  		// 4
  		if(e.keyCode == 51) {
			this._carousel.setIndex(3);
  		}

  		// 5
  		if(e.keyCode == 52) {
			this._carousel.setIndex(1.2);
  		}
  		// 6
  		if(e.keyCode == 53) {
			this._carousel.setIndex(1.4);
  		}
  		// 7
  		if(e.keyCode == 54) {
			this._carousel.setIndex(1.6);
  		}
  		// 8
  		if(e.keyCode == 55) {
			this._carousel.setIndex(1.8);
  		}
  		// 9
  		if(e.keyCode == 56) {
			this._carousel.setIndex(2);
  		}

	},

});

var application = new Application();