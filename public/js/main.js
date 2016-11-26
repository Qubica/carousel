var Application = Backbone.View.extend({

	el: '.application',

	initialize: function() {

		_.bindAll(
			this,
			'_indexProgressHandler',
			'_indexActiveHandler'
		);

		var elCarousel = this.el.querySelector('.js-carousel');
		var elCarouselItems = this.el.querySelectorAll('.js-carousel-item');

		this._carousel = new Carousel({
			el: elCarousel,
			numItems: elCarouselItems.length
		});

		// auto play
		setInterval(function() {
			this._carousel.tweenToNextIndex();
		}.bind(this), 1500);

		this._setupEventListener();

		// setup animations

		this._slides = [];
		var timeline;
		for(var i=0; i<elCarouselItems.length; i++) {
			timeline = new TimelineMax({paused:true});
			timeline.from(elCarouselItems[i], 0.5, {x:-50, ease:Power1.easeOut}, 0);
			timeline.fromTo(elCarouselItems[i], 0.5, {alpha:0}, {alpha:1, yoyo:true, repeat:1}, 0);
			timeline.to(elCarouselItems[i], 0.5, {x:50, ease:Power1.easeIn}, 0.5);

			this._slides.push(timeline);
		}

	},

	_setupEventListener: function() {

		this.listenTo(this._carousel, 'index:active', this._indexActiveHandler);
		this.listenTo(this._carousel, 'index:progress', this._indexProgressHandler);

	},

	_indexActiveHandler: function(e) {

		console.log('active', e.index);

	},

	_indexProgressHandler: function(e) {

		this._slides[e.index].progress(e.progress);

	},

});

var application = new Application();