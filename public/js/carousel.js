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

        ease = ease || Power1.easeInOut;

        TweenMax.to(this._tweenObj, duration, {
            cur: index,
            onUpdate: this._tweenToUpdateHandler,
            ease: ease
        });

    },

    _updateActiveIndex: function() {

        var activeIndex = this._modulo(Math.round(this._tweenObj.cur), this._numItems);
        
        // console.log(activeIndex, this._tweenObj.cur);

        if(activeIndex !== this._activeIndex) {
            this._activeIndex = Math.min(Math.max(activeIndex, 0), this._numItems);
            this.trigger('index:active', {index:this._activeIndex});
        }

    },

    _tweenToUpdateHandler: function() {

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


