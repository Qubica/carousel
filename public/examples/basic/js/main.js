var throwObj = { cur:0 };
var mousedown = false;

var elCarousel = document.querySelector('.js-carousel');
var elCarouselItems = document.querySelectorAll('.js-carousel-item');
var elCarouselNavigationButtons = document.querySelectorAll('.js-carousel-navigation-button');

var carousel = new Carousel({
	el: elCarousel,
	numItems: elCarouselItems.length
});

var slides = [];
var timeline;
for(var i=0; i<elCarouselItems.length; i++) {
	timeline = new TimelineMax({paused:true});
	timeline.fromTo(elCarouselItems[i], 0.5, {y:100, rotation:-10}, {y:0, rotation:0, ease:Power0.easeNone}, 0);
	timeline.fromTo(elCarouselItems[i], 0.5, {alpha:0}, {alpha:1, yoyo:true, repeat:1, ease:Power1.easeIn}, 0);
	timeline.fromTo(elCarouselItems[i], 0.5, {x:0, rotation:0}, {x:-400, rotation:10, ease:Power0.easeNone}, 0.5);

	slides.push(timeline);
}

carousel.el.addEventListener('index:active', indexActiveHandler);
carousel.el.addEventListener('index:progress', indexProgressHandler); 	

carousel.el.addEventListener('mousedown', mousedownHandler);
document.addEventListener('mousemove', mousemoveHandler);
document.addEventListener('mouseup', mouseupHandler);
carousel.el.addEventListener('touchstart', touchstartHandler);
carousel.el.addEventListener('touchmove', touchmoveHandler);
carousel.el.addEventListener('touchend', touchendHandler);

for(var j=0; j<elCarouselNavigationButtons.length; j++) {
	elCarouselNavigationButtons[j].addEventListener('click', buttonNavigationClickHandler);
}

// show frist
carousel.index(0);


function indexActiveHandler(e) {

	for(var j=0; j<elCarouselNavigationButtons.length; j++) {
		if(parseInt(elCarouselNavigationButtons[j].dataset.index, 10) === e.detail.index) {
			elCarouselNavigationButtons[j].classList.add('is-active');
		}
		else {
			elCarouselNavigationButtons[j].classList.remove('is-active');
		}
	}

}

function indexProgressHandler(e) {

	slides[e.detail.index].progress(e.detail.progress);

}

function throwIt () {

	if(throwObj.x === null) return;

    var deltaX = throwObj.x - throwObj.prevX;
	throwObj.prevX = throwObj.x;
    
    if(isNaN(deltaX)) return;
    TweenMax.to(carousel, 0.7, {throwProps:{index:{velocity:-deltaX, end:function(n) { return Math.round(n); } }}});

}

function mousedownHandler(e) {

	mousedown = true;
	throwObj.x = (e.clientX / 10);
	throwObj.prevX = (e.clientX / 10);

}

function mousemoveHandler(e) {
	
	e.preventDefault();
	if(!mousedown) return;
	throwObj.x = (e.clientX / 10);
    throwIt();

}

function mouseupHandler(e) {
	
	mousedown = false;
	throwObj.x = null;

}

function touchstartHandler(e) {

	throwObj.x = (e.changedTouches[0].clientX / 10);
	throwObj.prevX = (e.changedTouches[0].clientX / 10);

}

function touchmoveHandler(e) {
	
	e.preventDefault();
	throwObj.x = (e.changedTouches[0].clientX / 10);
    throwIt();

}

function touchendHandler(e) {
	
	throwObj.x = null;

}

function buttonNavigationClickHandler(e) {

	var index = e.currentTarget.dataset.index;

	if(index === 'previous') {
		carousel.tweenToPreviousIndex();
	}	
	else if(index === 'next') {
		carousel.tweenToNextIndex();
	}
	else {
		carousel.tweenToIndex(index);
	}

}





