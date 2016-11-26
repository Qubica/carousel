// Carousel 0.0.1
// 2016 - Peter Coolen

var Carousel = Backbone.View.extend({

    _activeIndex: 0,
    _tweenDuration: 0.3,

    initialize: function(options) {

        _.bindAll(
            this,
            '_tweenToUpdateHandler'
        );

        this._el = options.el;
        this._numItems = options.numItems;

        this._tweenObj = {
            cur: 0
        };

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

    _updateIndexes: function() {

        for(var index = 0; index < this._numItems; index++) {
            this._updateIndex(index);
        }

    },

    _updateIndex: function(index) {

        // TODO cleanup

        var activeIndex = this._modulo(Math.round(this._tweenObj.cur), this._numItems);
        var progress = this._modulo(this._tweenObj.cur, this._numItems);

        var indexProgress;

        if(activeIndex < index) {
            if(activeIndex === 0) {
                indexProgress = 0.5;
            }
            else {
                indexProgress = -0.5;
            }
        }
        else if(activeIndex === index) {
            if(progress > this._numItems-1 && index === 0) {
                indexProgress = -(index-progress)-this._numItems;
            }
            else {
                indexProgress = -(index-progress);
            }
        }
        else if(activeIndex > index) {
            if(activeIndex === this._numItems-1) {
                indexProgress = -0.5;
            }
            else {
                indexProgress = 0.5;
            }
        }

        indexProgress = indexProgress*2;
        
        // if(this._tweenObj.cur < 0) {
        //     indexProgress = indexProgress * -1;
        // }

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

        this._updateIndexes();
        this._updateActiveIndex();

    },

    _short: function(start, end, cap) {
        // calculate shortest distance (use positive values)

        var dif = end - start;

        dif = dif % cap;
        if (dif !== dif % (cap / 2)) {
            dif = (dif < 0) ? dif + cap : dif - cap;
        }

        return start + dif;

    },

    _modulo: function(n, m) {
        // negative modulo fix

        return ((n % m) + m) % m;

    },

});


