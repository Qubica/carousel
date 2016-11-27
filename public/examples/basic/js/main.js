var throwObj = { cur:0 };
var mousedown = false;

var elCarousel = document.querySelector('.js-carousel');
var elCarouselItems = document.querySelectorAll('.js-carousel-item');

var carousel = new Carousel({
	el: elCarousel,
	numItems: elCarouselItems.length,
	concurrent: true
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
carousel.el.addEventListener('mousemove', mousemoveHandler);
carousel.el.addEventListener('mouseup', mouseupHandler);
carousel.el.addEventListener('touchstart', touchstartHandler);
carousel.el.addEventListener('touchmove', touchmoveHandler);
carousel.el.addEventListener('touchend', touchendHandler);

// show frist
carousel.index(0);


function indexActiveHandler(e) {

	// console.log('active', e.detail.index);

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

	throwObj.x = (e.originalEvent.touches[0].clientX / 10);
	throwObj.prevX = (e.originalEvent.touches[0].clientX / 10);

}

function touchmoveHandler(e) {
	
	e.preventDefault();
	throwObj.x = (e.originalEvent.touches[0].clientX / 10);
    throwIt();

}

function touchendHandler(e) {
	
	throwObj.x = null;

}


