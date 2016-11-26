var Application = Backbone.View.extend({

	el: '.application',

	events: {
		'mousedown' : '_mousedownHandler',
        'mousemove' : '_mousemoveHandler',
        'mouseup' : '_mouseupHandler',
		'touchstart' : '_touchstartHandler',
        'touchmove' : '_touchmoveHandler',
        'touchend' : '_touchendHandler'
	},

	initialize: function() {

		_.bindAll(
			this,
			'_indexProgressHandler',
			'_indexActiveHandler',
			'_keydownHandler'
		);

		// setup carousel

		var elCarousel = this.el.querySelector('.js-carousel');
		var elCarouselItems = this.el.querySelectorAll('.js-carousel-item');

		this._carousel = new Carousel({
			el: elCarousel,
			numItems: elCarouselItems.length,
			concurrent: true
		});

		this._slides = [];
		var timeline;
		for(var i=0; i<elCarouselItems.length; i++) {
			timeline = new TimelineMax({paused:true});
			timeline.fromTo(elCarouselItems[i], 0.5, {y:100, rotation:-10}, {y:0, rotation:0, ease:Power0.easeNone}, 0);
			timeline.fromTo(elCarouselItems[i], 0.5, {alpha:0}, {alpha:1, yoyo:true, repeat:1, ease:Power1.easeIn}, 0);
			timeline.fromTo(elCarouselItems[i], 0.5, {x:0, rotation:0}, {x:-400, rotation:10, ease:Power0.easeNone}, 0.5);

			this._slides.push(timeline);
		}

		this._carousel.setIndex(0);

		// event stuff

		this._throwObj = { cur:0 };
		this._setupEventListener();

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

	// input stuff for testing

	_keydownHandler: function(e) {

		if(e.keyCode == 37) {
			this._carousel.tweenToPreviousIndex(0.5);
  		}
  		else if(e.keyCode == 39) {
			this._carousel.tweenToNextIndex(0.5);
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

	_throw: function () {

		if(this._throwObj.x === null) return;

        var deltaX = this._throwObj.x - this._throwObj.prevX;
		this._throwObj.prevX = this._throwObj.x;
        
        if(isNaN(deltaX)) return;
        TweenMax.to(this._carousel, 0.7, {throwProps:{index:{velocity:-deltaX, end:function(n) { return Math.round(n); } }}});

    },

	_mousedownHandler: function(e) {

		this._mousedown = true;
		this._throwObj.x = (e.clientX / 10);
		this._throwObj.prevX = (e.clientX / 10);

	},

	_mousemoveHandler: function(e) {
		
		e.preventDefault();

		if(!this._mousedown) return;

		this._throwObj.x = (e.clientX / 10);

        this._throw();

	},

	_mouseupHandler: function(e) {
		
		this._mousedown = false;

		this._throwObj.x = null;

	},

	_touchstartHandler: function(e) {

		this._throwObj.x = (e.originalEvent.touches[0].clientX / 10);
		this._throwObj.prevX = (e.originalEvent.touches[0].clientX / 10);

	},

	_touchmoveHandler: function(e) {
		
		e.preventDefault();

		this._throwObj.x = (e.originalEvent.touches[0].clientX / 10);

        this._throw();

	},

	_touchendHandler: function(e) {
		
		this._throwObj.x = null;

	}


});

var application = new Application();

