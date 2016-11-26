var Application = Backbone.View.extend({

	el: '.application',

	initialize: function() {

		var elCarousel = this.el.querySelector('.js-carousel');
		var elCarouselItems = this.el.querySelectorAll('.js-carousel-item');

		var carousel = new Carousel({
			el: elCarousel,
			numItems: elCarouselItems.length
		});

		setInterval(function() {
			carousel.tweenToNextIndex();
		}, 1000);

	}

});

var application = new Application();