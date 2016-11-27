(function(root, factory) {

    // AMD
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return (root.Carousel = factory(root));
        });
    // NodeJS & CommonJS
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(root);
    // Finally, as a browser global.
    } else {
        root.Carousel = factory(root);
    }

}(this, function(root) {

    'use strict';

    var Carousel = function(options) {

        this._activeIndex = null;
        this._tweenObj = { cur: 0 }; 

        this.el = options.el;
        this._numItems = options.numItems;

        this._tweenEase = options.tweenEase || Power0.easeNone;
        this._tweenDuration = options.tweenDuration || 0.6;
        this._concurrent = options.concurrent;

        this.onUpdateIndexActive = (options.onUpdateIndexActive) ? options.onUpdateIndexActive : function(e){};
        this.onUpdateIndexProgress = (options.onUpdateIndexProgress) ? options.onUpdateIndexProgress : function(e){};

        this.index = function(index) {

            index = this._cleanIndex(index);
            if(index === undefined || index === null) {
                return this._index || 0;
            }
            this._setIndex(index);

        };

        this.tweenToIndex = function(index, duration, ease) {

            index = this._cleanIndex(index);
            this._tweenToIndex(index, duration, ease);

        };

        this.tweenToPreviousIndex = function(duration, ease) {
            
            var index = this._activeIndex - 1;
            this._tweenToIndex(index, duration, ease);

        };

        this.tweenToNextIndex = function(duration, ease) {

            var index = this._activeIndex + 1;
            this._tweenToIndex(index, duration, ease);

        };

        this._tweenToIndex = function(index, duration, ease) {

            index = this._modulo(index, this._numItems);
            this._tweenTo(index, duration, ease);

        };

        this._tweenTo = function(index, duration, ease) {

            index = this._short(this._tweenObj.cur, index, this._numItems);
            duration = (isNaN(duration)) ? this._tweenDuration : duration;
            ease = ease || this._tweenEase;

            TweenMax.to(this._tweenObj, duration, {
                cur: index,
                onUpdate: this._tweenToUpdateHandler.bind(this),
                ease: ease
            });

        };

        this._setIndex = function(index) {

            this._tweenObj.cur = this._short(this._tweenObj.cur, index, this._numItems);
            this._update();

        };

        this._update = function() {

            this._index = this._tweenObj.cur;
            this._updateIndexes();
            this._updateActiveIndex();

        };

        this._updateIndexes = function() {

            for(var index = 0; index < this._numItems; index++) {
                if(this._concurrent) {
                    this._updateIndexConcurrent(index);
                }
                else {
                    this._updateIndex(index);
                }
            }

        };

        this._updateIndex = function(index) {

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
                
            this.onUpdateIndexProgress.call(this, {index:index, progress:indexProgress});

        };

        this._updateIndexConcurrent = function(index) {

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

            this.onUpdateIndexProgress.call(this, {index:index, progress:indexProgress});

        };

        this._updateActiveIndex = function() {

            var activeIndex = this._modulo(Math.round(this._tweenObj.cur), this._numItems);
            if(activeIndex !== this._activeIndex) {
                this._activeIndex = Math.min(Math.max(activeIndex, 0), this._numItems);
                this.onUpdateIndexActive.call(this, {index:this._activeIndex});
            }

        };

        this._tweenToUpdateHandler = function() {

            this._update();

        };

        this._cleanIndex = function(index) {

            if(index === undefined || index === null) {
                return index;
            }
            else if(isNaN(index)) {
                index = parseInt(index, 10);
            }
            return index;

        };

        this._short = function(start, end, cap) {

            var dif = end - start;
            dif = dif % cap;
            if (dif !== dif % (cap / 2)) {
                dif = (dif < 0) ? dif + cap : dif - cap;
            }
            return start + dif;

        };

        this._modulo = function(n, m) {

            return ((n % m) + m) % m;

        };

    };

    return Carousel;

}));


