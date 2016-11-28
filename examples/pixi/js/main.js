var throwObj = { cur:0 };
var mousedown = false;

var colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00];

var numItems = 4;
var slides = [];
var slidesTweens = [];

var elCarousel = document.querySelector('.js-carousel');

var renderer = new PIXI.WebGLRenderer(400, 200, {view:elCarousel, transparent:true, resolution:1, antialias:true});
var stage = new PIXI.Container();
stage.interactive = true;

this.createCarouselItems();
var elCarouselNavigationButtons = document.querySelectorAll('.js-carousel-navigation-button');

var carousel = new Carousel({
	el: elCarousel,
	numItems: numItems,
	concurrent: true,
	tweenEase: Power4.easeInOut,
	onUpdateIndexActive: indexActiveHandler,
	onUpdateIndexProgress: indexProgressHandler
});
// var slides = [];

setupEventListeners();
setupSlides();

carousel.index(0);

function setupEventListeners() {
		
	elCarousel.addEventListener('mousedown', mousedownHandler);
	document.addEventListener('mousemove', mousemoveHandler);
	document.addEventListener('mouseup', mouseupHandler);
	elCarousel.addEventListener('touchstart', touchstartHandler);
	elCarousel.addEventListener('touchmove', touchmoveHandler);
	elCarousel.addEventListener('touchend', touchendHandler);

	for(var i=0; i<elCarouselNavigationButtons.length; i++) {
		elCarouselNavigationButtons[i].addEventListener('click', buttonNavigationClickHandler);
	}

}


function createCarouselItems() {

	var slide;
	for(var i=0; i<numItems; i++) {
		slide = new PIXI.Sprite();

		var graphics = new PIXI.Graphics();
		graphics.beginFill(colors[i], 1);
		graphics.drawRect(0, 0, 400, 300);
		graphics.endFill();
		
		slide.addChild(graphics);
		slide.anchor.x = 0.5;
		slide.anchor.y = 0.5;
	
		slides.push(slide);
		stage.addChild(slide);
	}

	render();

}


function setupSlides() {

	var timeline;
	for(var i=0; i<numItems; i++) {
		timeline = new TimelineMax({paused:true});
		timeline.fromTo(slides[i], 0.5, {x:400}, {x:0, ease:Power0.easeNone}, 0);
		timeline.fromTo(slides[i], 0.5, {x:0}, {x:-400, ease:Power0.easeNone}, 0.5);

		slidesTweens.push(timeline);
	}

}

function render() {

	renderer.render(stage);

}

function indexActiveHandler(e) {

	for(var j=0; j<elCarouselNavigationButtons.length; j++) {
		if(parseInt(elCarouselNavigationButtons[j].dataset.index, 10) === e.index) {
			elCarouselNavigationButtons[j].classList.add('is-active');
		}
		else {
			elCarouselNavigationButtons[j].classList.remove('is-active');
		}
	}

}

function indexProgressHandler(e) {

	slidesTweens[e.index].progress(e.progress);

	render();

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





