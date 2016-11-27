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
    
    slides.push(new TimelineMax({paused:true}));

}

function indexProgressHandler(e) {
    
    slides[e.index].progress(e.progress);

}
```