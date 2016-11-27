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
			'_indexActiveHandler',
			'_indexProgressHandler'
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

		// event stuff

		this._throwObj = { cur:0 };
		this._setupEventListeners();

		// show frist
		this._carousel.index(0);

	},

	_setupEventListeners: function() {

		this._carousel.el.addEventListener('index:active', this._indexActiveHandler);
		this._carousel.el.addEventListener('index:progress', this._indexProgressHandler); 			

	},

	_indexActiveHandler: function(e) {

		// console.log('active', e.detail.index);

	},

	_indexProgressHandler: function(e) {

		this._slides[e.detail.index].progress(e.detail.progress);

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

