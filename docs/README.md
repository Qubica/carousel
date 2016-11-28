# Carousel

## Basic usage

```javascript
var carousel = document.querySelector('.carousel');
var carouselItems = document.querySelectorAll('.carousel-item');

var carousel = new Carousel({
    el: carousel,
    numItems: carouselItems.length,
    onUpdateIndexProgress: indexProgressHandler
});

var slides = [];
for(var i=0; i<carouselItems.length; i++) {
    
    var timeline = new TimelineMax({paused:true});
    // ... build your awesome timeline
    // ... the first half is the in animation, the second half the out animation
    // ... and yes! each slide can have his own unique awesome animation
    
    slides.push(timeline);

}

function indexProgressHandler(e) {
    
    slides[e.index].progress(e.progress);

}
```