// Carousel 0.0.1
// 2016 - Peter Coolen

var Carousel = Backbone.View.extend({

    _activeIndex: 0,
    _tweenDuration: 0.6,

    initialize: function(options) {

        _.bindAll(
            this,
            '_tweenToUpdateHandler'
        );

        this._el = options.el;
        this._numItems = options.numItems;
        this._concurrent = options.concurrent;

        this._tweenObj = {
            cur: 0
        }; 

    },

    index: function(index) {

        if(index === undefined || index === null) {
            return this._index || 0;
        }

        this._setIndex(index);

    },

    setIndex: function(index) {

        this._setIndex(index);

    },

    tweenToIndex: function(index, duration, ease) {

        this._tweenToIndex(index, duration, ease);

    },

    tweenToPreviousIndex: function(duration, ease) {
        
        var index = this._activeIndex - 1;
        this._tweenToIndex(index, duration, ease);

    },

    tweenToNextIndex: function(duration, ease) {

        var index = this._activeIndex + 1;
        this._tweenToIndex(index, duration, ease);

    },

    _tweenToIndex: function(index, duration, ease) {

        index = this._modulo(index, this._numItems);

        this._tweenTo(index, duration, ease);

    },

    _tweenTo: function(index, duration, ease) {

        index = this._short(this._tweenObj.cur, index, this._numItems);

        duration = (isNaN(duration)) ? this._tweenDuration : duration;

        ease = ease || Power0.easeNone;

        TweenMax.to(this._tweenObj, duration, {
            cur: index,
            onUpdate: this._tweenToUpdateHandler,
            ease: ease
        });

    },

    _setIndex: function(index) {

        this._tweenObj.cur = this._short(this._tweenObj.cur, index, this._numItems);
        this._update();

    },

    _update: function() {

        this._index = this._tweenObj.cur;

        this._updateIndexes();
        this._updateActiveIndex();

    },

    _updateIndexes: function() {

        for(var index = 0; index < this._numItems; index++) {
            if(this._concurrent) {
                this._updateIndexConcurrent(index);
            }
            else {
                this._updateIndex(index);
            }
        }

    },

    _updateIndex: function(index) {

        // TODO: improve

        var activeIndex = this._modulo(Math.round(this._tweenObj.cur), this._numItems);
        var progress = this._modulo(this._tweenObj.cur, this._numItems);

        var indexProgress;
        if(activeIndex < index) {
            indexProgress = (activeIndex === 0) ? 0.5 : -0.5;
        }
        else if(activeIndex === index) {
            indexProgress = (progress > this._numItems-1 && index === 0) ? -(index-progress)-this._numItems : -(index-progress);
        }
        else if(activeIndex > index) {
            indexProgress = (activeIndex === this._numItems-1) ? -0.5 : 0.5;
        }
        indexProgress = indexProgress + 0.5;
        
        this.trigger('index:progress', {index:index, progress:indexProgress});

    },

    _updateIndexConcurrent: function(index) {

        // TODO: improve

        var floorIndex = this._modulo(Math.floor(this._tweenObj.cur), this._numItems);
        var activeIndex = this._modulo(Math.round(this._tweenObj.cur), this._numItems);
        var progress = this._modulo(this._tweenObj.cur, this._numItems);

        var indexProgress;
        if(index < 1) {
            if(progress >= this._numItems-1){
                indexProgress = progress-this._numItems;
            }
            else if(progress <= index+1) {
                indexProgress = progress;
            }            
        }
        else if(index >= this._numItems-1) {
            if(progress <= 1){
                indexProgress = progress+this._numItems;
            }
            else if(progress >= this._numItems-2) {
                indexProgress = progress;
            }
        }
        else if(index >= progress-1 && index < progress+1) {
            indexProgress = progress;
        }
        
        indexProgress = indexProgress - index;
        indexProgress = (indexProgress+1) / 2; 

        if(isNaN(indexProgress)) indexProgress = 1;

        this.trigger('index:progress', {index:index, progress:indexProgress});

    },

    _updateActiveIndex: function() {

        var activeIndex = this._modulo(Math.round(this._tweenObj.cur), this._numItems);

        if(activeIndex !== this._activeIndex) {
            this._activeIndex = Math.min(Math.max(activeIndex, 0), this._numItems);
            this.trigger('index:active', {index:this._activeIndex});
        }

    },

    _tweenToUpdateHandler: function() {

        this._update();

    },

    _short: function(start, end, cap) {

        var dif = end - start;

        dif = dif % cap;
        if (dif !== dif % (cap / 2)) {
            dif = (dif < 0) ? dif + cap : dif - cap;
        }

        return start + dif;

    },

    _modulo: function(n, m) {

        return ((n % m) + m) % m;

    },

});


