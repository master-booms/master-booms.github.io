// Sticky Plugin v1.0.4 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var slice = Array.prototype.slice; // save ref to original slice()
    var splice = Array.prototype.splice; // save ref to original slice()

  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: '',
      widthFromWrapper: true, // works only when .getWidthFrom is empty
      responsiveWidth: false,
      zIndex: 'inherit'
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

        //update height in case of dynamic content
        s.stickyWrapper.css('height', s.stickyElement.outerHeight());

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'z-index': ''
              });
            s.stickyElement.parent().removeClass(s.className);
            s.stickyElement.trigger('sticky-end', [s]);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop !== newTop) {
            var newWidth;
            if (s.getWidthFrom) {
                padding =  s.stickyElement.innerWidth() - s.stickyElement.width();
                newWidth = $(s.getWidthFrom).width() - padding || null;
            } else if (s.widthFromWrapper) {
                newWidth = s.stickyWrapper.width();
            }
            if (newWidth == null) {
                newWidth = s.stickyElement.width();
            }
            s.stickyElement
              .css('width', newWidth)
              .css('position', 'fixed')
              .css('top', newTop)
              .css('z-index', s.zIndex);

            s.stickyElement.parent().addClass(s.className);

            if (s.currentTop === null) {
              s.stickyElement.trigger('sticky-start', [s]);
            } else {
              // sticky is started but it have to be repositioned
              s.stickyElement.trigger('sticky-update', [s]);
            }

            if (s.currentTop === s.topSpacing && s.currentTop > newTop || s.currentTop === null && newTop < s.topSpacing) {
              // just reached bottom || just started to stick but bottom is already reached
              s.stickyElement.trigger('sticky-bottom-reached', [s]);
            } else if(s.currentTop !== null && newTop === s.topSpacing && s.currentTop < newTop) {
              // sticky is started && sticked at topSpacing && overflowing from top just finished
              s.stickyElement.trigger('sticky-bottom-unreached', [s]);
            }

            s.currentTop = newTop;
          }

          // Check if sticky has reached end of container and stop sticking
          var stickyWrapperContainer = s.stickyWrapper.parent();
          var unstick = (s.stickyElement.offset().top + s.stickyElement.outerHeight() >= stickyWrapperContainer.offset().top + stickyWrapperContainer.outerHeight()) && (s.stickyElement.offset().top <= s.topSpacing);

          if( unstick ) {
            s.stickyElement
              .css('position', 'absolute')
              .css('top', '')
              .css('bottom', 0)
              .css('z-index', '');
          } else {
            s.stickyElement
              .css('position', 'fixed')
              .css('top', newTop)
              .css('bottom', '')
              .css('z-index', s.zIndex);
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();

      for (var i = 0, l = sticked.length; i < l; i++) {
        var s = sticked[i];
        var newWidth = null;
        if (s.getWidthFrom) {
            if (s.responsiveWidth) {
                newWidth = $(s.getWidthFrom).width();
            }
        } else if(s.widthFromWrapper) {
            newWidth = s.stickyWrapper.width();
        }
        if (newWidth != null) {
            s.stickyElement.css('width', newWidth);
        }
      }
    },
    methods = {
      init: function(options) {
        return this.each(function() {
          var o = $.extend({}, defaults, options);
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName;
          var wrapper = $('<div></div>')
            .attr('id', wrapperId)
            .addClass(o.wrapperClassName);

          stickyElement.wrapAll(function() {
            if ($(this).parent("#" + wrapperId).length == 0) {
                    return wrapper;
            }
});

          var stickyWrapper = stickyElement.parent();

          if (o.center) {
            stickyWrapper.css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") === "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          o.stickyElement = stickyElement;
          o.stickyWrapper = stickyWrapper;
          o.currentTop    = null;

          sticked.push(o);

          methods.setWrapperHeight(this);
          methods.setupChangeListeners(this);
        });
      },

      setWrapperHeight: function(stickyElement) {
        var element = $(stickyElement);
        var stickyWrapper = element.parent();
        if (stickyWrapper) {
          stickyWrapper.css('height', element.outerHeight());
        }
      },

      setupChangeListeners: function(stickyElement) {
        if (window.MutationObserver) {
          var mutationObserver = new window.MutationObserver(function(mutations) {
            if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
              methods.setWrapperHeight(stickyElement);
            }
          });
          mutationObserver.observe(stickyElement, {subtree: true, childList: true});
        } else {
          if (window.addEventListener) {
            stickyElement.addEventListener('DOMNodeInserted', function() {
              methods.setWrapperHeight(stickyElement);
            }, false);
            stickyElement.addEventListener('DOMNodeRemoved', function() {
              methods.setWrapperHeight(stickyElement);
            }, false);
          } else if (window.attachEvent) {
            stickyElement.attachEvent('onDOMNodeInserted', function() {
              methods.setWrapperHeight(stickyElement);
            });
            stickyElement.attachEvent('onDOMNodeRemoved', function() {
              methods.setWrapperHeight(stickyElement);
            });
          }
        }
      },
      update: scroller,
      unstick: function(options) {
        return this.each(function() {
          var that = this;
          var unstickyElement = $(that);

          var removeIdx = -1;
          var i = sticked.length;
          while (i-- > 0) {
            if (sticked[i].stickyElement.get(0) === that) {
                splice.call(sticked,i,1);
                removeIdx = i;
            }
          }
          if(removeIdx !== -1) {
            unstickyElement.unwrap();
            unstickyElement
              .css({
                'width': '',
                'position': '',
                'top': '',
                'float': '',
                'z-index': ''
              })
            ;
          }
        });
      }
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };

  $.fn.unstick = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.unstick.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };
  $(function() {
    setTimeout(scroller, 0);
  });
}));

/**
 * bxSlider v4.2.12
 * Copyright 2013-2015 Steven Wanderski
 * Written while drinking Belgian ales and listening to jazz
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

;(function($) {

  var defaults = {

    // GENERAL
    mode: 'horizontal',
    slideSelector: '',
    infiniteLoop: true,
    hideControlOnEnd: false,
    speed: 500,
    easing: null,
    slideMargin: 0,
    startSlide: 0,
    randomStart: false,
    captions: false,
    ticker: false,
    tickerHover: false,
    adaptiveHeight: false,
    adaptiveHeightSpeed: 500,
    video: false,
    useCSS: true,
    preloadImages: 'visible',
    responsive: true,
    slideZIndex: 50,
    wrapperClass: 'bx-wrapper',

    // TOUCH
    touchEnabled: true,
    swipeThreshold: 50,
    oneToOneTouch: true,
    preventDefaultSwipeX: true,
    preventDefaultSwipeY: false,

    // ACCESSIBILITY
    ariaLive: true,
    ariaHidden: true,

    // KEYBOARD
    keyboardEnabled: false,

    // PAGER
    pager: true,
    pagerType: 'full',
    pagerShortSeparator: ' / ',
    pagerSelector: null,
    buildPager: null,
    pagerCustom: null,

    // CONTROLS
    controls: true,
    nextText: 'Next',
    prevText: 'Prev',
    nextSelector: null,
    prevSelector: null,
    autoControls: false,
    startText: 'Start',
    stopText: 'Stop',
    autoControlsCombine: false,
    autoControlsSelector: null,

    // AUTO
    auto: false,
    pause: 4000,
    autoStart: true,
    autoDirection: 'next',
    stopAutoOnClick: false,
    autoHover: false,
    autoDelay: 0,
    autoSlideForOnePage: false,

    // CAROUSEL
    minSlides: 1,
    maxSlides: 1,
    moveSlides: 0,
    slideWidth: 0,
    shrinkItems: false,

    // CALLBACKS
    onSliderLoad: function() { return true; },
    onSlideBefore: function() { return true; },
    onSlideAfter: function() { return true; },
    onSlideNext: function() { return true; },
    onSlidePrev: function() { return true; },
    onSliderResize: function() { return true; }
  };

  $.fn.bxSlider = function(options) {

    if (this.length === 0) {
      return this;
    }

    // support multiple elements
    if (this.length > 1) {
      this.each(function() {
        $(this).bxSlider(options);
      });
      return this;
    }

    // create a namespace to be used throughout the plugin
    var slider = {},
    // set a reference to our slider element
    el = this,
    // get the original window dimens (thanks a lot IE)
    windowWidth = $(window).width(),
    windowHeight = $(window).height();

    // Return if slider is already initialized
    if ($(el).data('bxSlider')) { return; }

    /**
     * ===================================================================================
     * = PRIVATE FUNCTIONS
     * ===================================================================================
     */

    /**
     * Initializes namespace settings to be used throughout plugin
     */
    var init = function() {
      // Return if slider is already initialized
      if ($(el).data('bxSlider')) { return; }
      // merge user-supplied options with the defaults
      slider.settings = $.extend({}, defaults, options);
      // parse slideWidth setting
      slider.settings.slideWidth = parseInt(slider.settings.slideWidth);
      // store the original children
      slider.children = el.children(slider.settings.slideSelector);
      // check if actual number of slides is less than minSlides / maxSlides
      if (slider.children.length < slider.settings.minSlides) { slider.settings.minSlides = slider.children.length; }
      if (slider.children.length < slider.settings.maxSlides) { slider.settings.maxSlides = slider.children.length; }
      // if random start, set the startSlide setting to random number
      if (slider.settings.randomStart) { slider.settings.startSlide = Math.floor(Math.random() * slider.children.length); }
      // store active slide information
      slider.active = { index: slider.settings.startSlide };
      // store if the slider is in carousel mode (displaying / moving multiple slides)
      slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1 ? true : false;
      // if carousel, force preloadImages = 'all'
      if (slider.carousel) { slider.settings.preloadImages = 'all'; }
      // calculate the min / max width thresholds based on min / max number of slides
      // used to setup and update carousel slides dimensions
      slider.minThreshold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
      slider.maxThreshold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
      // store the current state of the slider (if currently animating, working is true)
      slider.working = false;
      // initialize the controls object
      slider.controls = {};
      // initialize an auto interval
      slider.interval = null;
      // determine which property to use for transitions
      slider.animProp = slider.settings.mode === 'vertical' ? 'top' : 'left';
      // determine if hardware acceleration can be used
      slider.usingCSS = slider.settings.useCSS && slider.settings.mode !== 'fade' && (function() {
        // create our test div element
        var div = document.createElement('div'),
        // css transition properties
        props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
        // test for each property
        for (var i = 0; i < props.length; i++) {
          if (div.style[props[i]] !== undefined) {
            slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
            slider.animProp = '-' + slider.cssPrefix + '-transform';
            return true;
          }
        }
        return false;
      }());
      // if vertical mode always make maxSlides and minSlides equal
      if (slider.settings.mode === 'vertical') { slider.settings.maxSlides = slider.settings.minSlides; }
      // save original style data
      el.data('origStyle', el.attr('style'));
      el.children(slider.settings.slideSelector).each(function() {
        $(this).data('origStyle', $(this).attr('style'));
      });

      // perform all DOM / CSS modifications
      setup();
    };

    /**
     * Performs all DOM and CSS modifications
     */
    var setup = function() {
      var preloadSelector = slider.children.eq(slider.settings.startSlide); // set the default preload selector (visible)

      // wrap el in a wrapper
      el.wrap('<div class="' + slider.settings.wrapperClass + '"><div class="bx-viewport"></div></div>');
      // store a namespace reference to .bx-viewport
      slider.viewport = el.parent();

      // add aria-live if the setting is enabled and ticker mode is disabled
      if (slider.settings.ariaLive && !slider.settings.ticker) {
        slider.viewport.attr('aria-live', 'polite');
      }
      // add a loading div to display while images are loading
      slider.loader = $('<div class="bx-loading" />');
      slider.viewport.prepend(slider.loader);
      // set el to a massive width, to hold any needed slides
      // also strip any margin and padding from el
      el.css({
        width: slider.settings.mode === 'horizontal' ? (slider.children.length * 1000 + 215) + '%' : 'auto',
        position: 'relative'
      });
      // if using CSS, add the easing property
      if (slider.usingCSS && slider.settings.easing) {
        el.css('-' + slider.cssPrefix + '-transition-timing-function', slider.settings.easing);
      // if not using CSS and no easing value was supplied, use the default JS animation easing (swing)
      } else if (!slider.settings.easing) {
        slider.settings.easing = 'swing';
      }
      // make modifications to the viewport (.bx-viewport)
      slider.viewport.css({
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      });
      slider.viewport.parent().css({
        maxWidth: getViewportMaxWidth()
      });
      // apply css to all slider children
      slider.children.css({
        float: slider.settings.mode === 'horizontal' ? 'left' : 'none',
        listStyle: 'none',
        position: 'relative'
      });
      // apply the calculated width after the float is applied to prevent scrollbar interference
      slider.children.css('width', getSlideWidth());
      // if slideMargin is supplied, add the css
      if (slider.settings.mode === 'horizontal' && slider.settings.slideMargin > 0) { slider.children.css('marginRight', slider.settings.slideMargin); }
      if (slider.settings.mode === 'vertical' && slider.settings.slideMargin > 0) { slider.children.css('marginBottom', slider.settings.slideMargin); }
      // if "fade" mode, add positioning and z-index CSS
      if (slider.settings.mode === 'fade') {
        slider.children.css({
          position: 'absolute',
          zIndex: 0,
          display: 'none'
        });
        // prepare the z-index on the showing element
        slider.children.eq(slider.settings.startSlide).css({zIndex: slider.settings.slideZIndex, display: 'block'});
      }
      // create an element to contain all slider controls (pager, start / stop, etc)
      slider.controls.el = $('<div class="bx-controls" />');
      // if captions are requested, add them
      if (slider.settings.captions) { appendCaptions(); }
      // check if startSlide is last slide
      slider.active.last = slider.settings.startSlide === getPagerQty() - 1;
      // if video is true, set up the fitVids plugin
      if (slider.settings.video) { el.fitVids(); }
      if (slider.settings.preloadImages === 'all' || slider.settings.ticker) { preloadSelector = slider.children; }
      // only check for control addition if not in "ticker" mode
      if (!slider.settings.ticker) {
        // if controls are requested, add them
        if (slider.settings.controls) { appendControls(); }
        // if auto is true, and auto controls are requested, add them
        if (slider.settings.auto && slider.settings.autoControls) { appendControlsAuto(); }
        // if pager is requested, add it
        if (slider.settings.pager) { appendPager(); }
        // if any control option is requested, add the controls wrapper
        if (slider.settings.controls || slider.settings.autoControls || slider.settings.pager) { slider.viewport.after(slider.controls.el); }
      // if ticker mode, do not allow a pager
      } else {
        slider.settings.pager = false;
      }
      loadElements(preloadSelector, start);
    };

    var loadElements = function(selector, callback) {
      var total = selector.find('img:not([src=""]), iframe').length,
      count = 0;
      if (total === 0) {
        callback();
        return;
      }
      selector.find('img:not([src=""]), iframe').each(function() {
        $(this).one('load error', function() {
          if (++count === total) { callback(); }
        }).each(function() {
          if (this.complete) { $(this).trigger('load'); }
        });
      });
    };

    /**
     * Start the slider
     */
    var start = function() {
      // if infinite loop, prepare additional slides
      if (slider.settings.infiniteLoop && slider.settings.mode !== 'fade' && !slider.settings.ticker) {
        var slice    = slider.settings.mode === 'vertical' ? slider.settings.minSlides : slider.settings.maxSlides,
        sliceAppend  = slider.children.slice(0, slice).clone(true).addClass('bx-clone'),
        slicePrepend = slider.children.slice(-slice).clone(true).addClass('bx-clone');
        if (slider.settings.ariaHidden) {
          sliceAppend.attr('aria-hidden', true);
          slicePrepend.attr('aria-hidden', true);
        }
        el.append(sliceAppend).prepend(slicePrepend);
      }
      // remove the loading DOM element
      slider.loader.remove();
      // set the left / top position of "el"
      setSlidePosition();
      // if "vertical" mode, always use adaptiveHeight to prevent odd behavior
      if (slider.settings.mode === 'vertical') { slider.settings.adaptiveHeight = true; }
      // set the viewport height
      slider.viewport.height(getViewportHeight());
      // make sure everything is positioned just right (same as a window resize)
      el.redrawSlider();
      // onSliderLoad callback
      slider.settings.onSliderLoad.call(el, slider.active.index);
      // slider has been fully initialized
      slider.initialized = true;
      // bind the resize call to the window
      if (slider.settings.responsive) { $(window).bind('resize', resizeWindow); }
      // if auto is true and has more than 1 page, start the show
      if (slider.settings.auto && slider.settings.autoStart && (getPagerQty() > 1 || slider.settings.autoSlideForOnePage)) { initAuto(); }
      // if ticker is true, start the ticker
      if (slider.settings.ticker) { initTicker(); }
      // if pager is requested, make the appropriate pager link active
      if (slider.settings.pager) { updatePagerActive(slider.settings.startSlide); }
      // check for any updates to the controls (like hideControlOnEnd updates)
      if (slider.settings.controls) { updateDirectionControls(); }
      // if touchEnabled is true, setup the touch events
      if (slider.settings.touchEnabled && !slider.settings.ticker) { initTouch(); }
      // if keyboardEnabled is true, setup the keyboard events
      if (slider.settings.keyboardEnabled && !slider.settings.ticker) {
        $(document).keydown(keyPress);
      }
    };

    /**
     * Returns the calculated height of the viewport, used to determine either adaptiveHeight or the maxHeight value
     */
    var getViewportHeight = function() {
      var height = 0;
      // first determine which children (slides) should be used in our height calculation
      var children = $();
      // if mode is not "vertical" and adaptiveHeight is false, include all children
      if (slider.settings.mode !== 'vertical' && !slider.settings.adaptiveHeight) {
        children = slider.children;
      } else {
        // if not carousel, return the single active child
        if (!slider.carousel) {
          children = slider.children.eq(slider.active.index);
        // if carousel, return a slice of children
        } else {
          // get the individual slide index
          var currentIndex = slider.settings.moveSlides === 1 ? slider.active.index : slider.active.index * getMoveBy();
          // add the current slide to the children
          children = slider.children.eq(currentIndex);
          // cycle through the remaining "showing" slides
          for (i = 1; i <= slider.settings.maxSlides - 1; i++) {
            // if looped back to the start
            if (currentIndex + i >= slider.children.length) {
              children = children.add(slider.children.eq(i - 1));
            } else {
              children = children.add(slider.children.eq(currentIndex + i));
            }
          }
        }
      }
      // if "vertical" mode, calculate the sum of the heights of the children
      if (slider.settings.mode === 'vertical') {
        children.each(function(index) {
          height += $(this).outerHeight();
        });
        // add user-supplied margins
        if (slider.settings.slideMargin > 0) {
          height += slider.settings.slideMargin * (slider.settings.minSlides - 1);
        }
      // if not "vertical" mode, calculate the max height of the children
      } else {
        height = Math.max.apply(Math, children.map(function() {
          return $(this).outerHeight(false);
        }).get());
      }

      if (slider.viewport.css('box-sizing') === 'border-box') {
        height += parseFloat(slider.viewport.css('padding-top')) + parseFloat(slider.viewport.css('padding-bottom')) +
              parseFloat(slider.viewport.css('border-top-width')) + parseFloat(slider.viewport.css('border-bottom-width'));
      } else if (slider.viewport.css('box-sizing') === 'padding-box') {
        height += parseFloat(slider.viewport.css('padding-top')) + parseFloat(slider.viewport.css('padding-bottom'));
      }

      return height;
    };

    /**
     * Returns the calculated width to be used for the outer wrapper / viewport
     */
    var getViewportMaxWidth = function() {
      var width = '100%';
      if (slider.settings.slideWidth > 0) {
        if (slider.settings.mode === 'horizontal') {
          width = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
        } else {
          width = slider.settings.slideWidth;
        }
      }
      return width;
    };

    /**
     * Returns the calculated width to be applied to each slide
     */
    var getSlideWidth = function() {
      var newElWidth = slider.settings.slideWidth, // start with any user-supplied slide width
      wrapWidth      = slider.viewport.width();    // get the current viewport width
      // if slide width was not supplied, or is larger than the viewport use the viewport width
      if (slider.settings.slideWidth === 0 ||
        (slider.settings.slideWidth > wrapWidth && !slider.carousel) ||
        slider.settings.mode === 'vertical') {
        newElWidth = wrapWidth;
      // if carousel, use the thresholds to determine the width
      } else if (slider.settings.maxSlides > 1 && slider.settings.mode === 'horizontal') {
        if (wrapWidth > slider.maxThreshold) {
          return newElWidth;
        } else if (wrapWidth < slider.minThreshold) {
          newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
        } else if (slider.settings.shrinkItems) {
          newElWidth = Math.floor((wrapWidth + slider.settings.slideMargin) / (Math.ceil((wrapWidth + slider.settings.slideMargin) / (newElWidth + slider.settings.slideMargin))) - slider.settings.slideMargin);
        }
      }
      return newElWidth;
    };

    /**
     * Returns the number of slides currently visible in the viewport (includes partially visible slides)
     */
    var getNumberSlidesShowing = function() {
      var slidesShowing = 1,
      childWidth = null;
      if (slider.settings.mode === 'horizontal' && slider.settings.slideWidth > 0) {
        // if viewport is smaller than minThreshold, return minSlides
        if (slider.viewport.width() < slider.minThreshold) {
          slidesShowing = slider.settings.minSlides;
        // if viewport is larger than maxThreshold, return maxSlides
        } else if (slider.viewport.width() > slider.maxThreshold) {
          slidesShowing = slider.settings.maxSlides;
        // if viewport is between min / max thresholds, divide viewport width by first child width
        } else {
          childWidth = slider.children.first().width() + slider.settings.slideMargin;
          slidesShowing = Math.floor((slider.viewport.width() +
            slider.settings.slideMargin) / childWidth);
        }
      // if "vertical" mode, slides showing will always be minSlides
      } else if (slider.settings.mode === 'vertical') {
        slidesShowing = slider.settings.minSlides;
      }
      return slidesShowing;
    };

    /**
     * Returns the number of pages (one full viewport of slides is one "page")
     */
    var getPagerQty = function() {
      var pagerQty = 0,
      breakPoint = 0,
      counter = 0;
      // if moveSlides is specified by the user
      if (slider.settings.moveSlides > 0) {
        if (slider.settings.infiniteLoop) {
          pagerQty = Math.ceil(slider.children.length / getMoveBy());
        } else {
          // when breakpoint goes above children length, counter is the number of pages
          while (breakPoint < slider.children.length) {
            ++pagerQty;
            breakPoint = counter + getNumberSlidesShowing();
            counter += slider.settings.moveSlides <= getNumberSlidesShowing() ? slider.settings.moveSlides : getNumberSlidesShowing();
          }
        }
      // if moveSlides is 0 (auto) divide children length by sides showing, then round up
      } else {
        pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
      }
      return pagerQty;
    };

    /**
     * Returns the number of individual slides by which to shift the slider
     */
    var getMoveBy = function() {
      // if moveSlides was set by the user and moveSlides is less than number of slides showing
      if (slider.settings.moveSlides > 0 && slider.settings.moveSlides <= getNumberSlidesShowing()) {
        return slider.settings.moveSlides;
      }
      // if moveSlides is 0 (auto)
      return getNumberSlidesShowing();
    };

    /**
     * Sets the slider's (el) left or top position
     */
    var setSlidePosition = function() {
      var position, lastChild, lastShowingIndex;
      // if last slide, not infinite loop, and number of children is larger than specified maxSlides
      if (slider.children.length > slider.settings.maxSlides && slider.active.last && !slider.settings.infiniteLoop) {
        if (slider.settings.mode === 'horizontal') {
          // get the last child's position
          lastChild = slider.children.last();
          position = lastChild.position();
          // set the left position
          setPositionProperty(-(position.left - (slider.viewport.width() - lastChild.outerWidth())), 'reset', 0);
        } else if (slider.settings.mode === 'vertical') {
          // get the last showing index's position
          lastShowingIndex = slider.children.length - slider.settings.minSlides;
          position = slider.children.eq(lastShowingIndex).position();
          // set the top position
          setPositionProperty(-position.top, 'reset', 0);
        }
      // if not last slide
      } else {
        // get the position of the first showing slide
        position = slider.children.eq(slider.active.index * getMoveBy()).position();
        // check for last slide
        if (slider.active.index === getPagerQty() - 1) { slider.active.last = true; }
        // set the respective position
        if (position !== undefined) {
          if (slider.settings.mode === 'horizontal') { setPositionProperty(-position.left, 'reset', 0); }
          else if (slider.settings.mode === 'vertical') { setPositionProperty(-position.top, 'reset', 0); }
        }
      }
    };

    /**
     * Sets the el's animating property position (which in turn will sometimes animate el).
     * If using CSS, sets the transform property. If not using CSS, sets the top / left property.
     *
     * @param value (int)
     *  - the animating property's value
     *
     * @param type (string) 'slide', 'reset', 'ticker'
     *  - the type of instance for which the function is being
     *
     * @param duration (int)
     *  - the amount of time (in ms) the transition should occupy
     *
     * @param params (array) optional
     *  - an optional parameter containing any variables that need to be passed in
     */
    var setPositionProperty = function(value, type, duration, params) {
      var animateObj, propValue;
      // use CSS transform
      if (slider.usingCSS) {
        // determine the translate3d value
        propValue = slider.settings.mode === 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
        // add the CSS transition-duration
        el.css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
        if (type === 'slide') {
          // set the property value
          el.css(slider.animProp, propValue);
          if (duration !== 0) {
            // bind a callback method - executes when CSS transition completes
            el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
              //make sure it's the correct one
              if (!$(e.target).is(el)) { return; }
              // unbind the callback
              el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
              updateAfterSlideTransition();
            });
          } else { //duration = 0
            updateAfterSlideTransition();
          }
        } else if (type === 'reset') {
          el.css(slider.animProp, propValue);
        } else if (type === 'ticker') {
          // make the transition use 'linear'
          el.css('-' + slider.cssPrefix + '-transition-timing-function', 'linear');
          el.css(slider.animProp, propValue);
          if (duration !== 0) {
            el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
              //make sure it's the correct one
              if (!$(e.target).is(el)) { return; }
              // unbind the callback
              el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
              // reset the position
              setPositionProperty(params.resetValue, 'reset', 0);
              // start the loop again
              tickerLoop();
            });
          } else { //duration = 0
            setPositionProperty(params.resetValue, 'reset', 0);
            tickerLoop();
          }
        }
      // use JS animate
      } else {
        animateObj = {};
        animateObj[slider.animProp] = value;
        if (type === 'slide') {
          el.animate(animateObj, duration, slider.settings.easing, function() {
            updateAfterSlideTransition();
          });
        } else if (type === 'reset') {
          el.css(slider.animProp, value);
        } else if (type === 'ticker') {
          el.animate(animateObj, duration, 'linear', function() {
            setPositionProperty(params.resetValue, 'reset', 0);
            // run the recursive loop after animation
            tickerLoop();
          });
        }
      }
    };

    /**
     * Populates the pager with proper amount of pages
     */
    var populatePager = function() {
      var pagerHtml = '',
      linkContent = '',
      pagerQty = getPagerQty();
      // loop through each pager item
      for (var i = 0; i < pagerQty; i++) {
        linkContent = '';
        // if a buildPager function is supplied, use it to get pager link value, else use index + 1
        if (slider.settings.buildPager && $.isFunction(slider.settings.buildPager) || slider.settings.pagerCustom) {
          linkContent = slider.settings.buildPager(i);
          slider.pagerEl.addClass('bx-custom-pager');
        } else {
          linkContent = i + 1;
          slider.pagerEl.addClass('bx-default-pager');
        }
        // var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i) : i + 1;
        // add the markup to the string
        pagerHtml += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a></div>';
      }
      // populate the pager element with pager links
      slider.pagerEl.html(pagerHtml);
    };

    /**
     * Appends the pager to the controls element
     */
    var appendPager = function() {
      if (!slider.settings.pagerCustom) {
        // create the pager DOM element
        slider.pagerEl = $('<div class="bx-pager" />');
        // if a pager selector was supplied, populate it with the pager
        if (slider.settings.pagerSelector) {
          $(slider.settings.pagerSelector).html(slider.pagerEl);
        // if no pager selector was supplied, add it after the wrapper
        } else {
          slider.controls.el.addClass('bx-has-pager').append(slider.pagerEl);
        }
        // populate the pager
        populatePager();
      } else {
        slider.pagerEl = $(slider.settings.pagerCustom);
      }
      // assign the pager click binding
      slider.pagerEl.on('click touchend', 'a', clickPagerBind);
    };

    /**
     * Appends prev / next controls to the controls element
     */
    var appendControls = function() {
      slider.controls.next = $('<a class="bx-next" href="">' + slider.settings.nextText + '</a>');
      slider.controls.prev = $('<a class="bx-prev" href="">' + slider.settings.prevText + '</a>');
      // bind click actions to the controls
      slider.controls.next.bind('click touchend', clickNextBind);
      slider.controls.prev.bind('click touchend', clickPrevBind);
      // if nextSelector was supplied, populate it
      if (slider.settings.nextSelector) {
        $(slider.settings.nextSelector).append(slider.controls.next);
      }
      // if prevSelector was supplied, populate it
      if (slider.settings.prevSelector) {
        $(slider.settings.prevSelector).append(slider.controls.prev);
      }
      // if no custom selectors were supplied
      if (!slider.settings.nextSelector && !slider.settings.prevSelector) {
        // add the controls to the DOM
        slider.controls.directionEl = $('<div class="bx-controls-direction" />');
        // add the control elements to the directionEl
        slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
        // slider.viewport.append(slider.controls.directionEl);
        slider.controls.el.addClass('bx-has-controls-direction').append(slider.controls.directionEl);
      }
    };

    /**
     * Appends start / stop auto controls to the controls element
     */
    var appendControlsAuto = function() {
      slider.controls.start = $('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + slider.settings.startText + '</a></div>');
      slider.controls.stop = $('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + slider.settings.stopText + '</a></div>');
      // add the controls to the DOM
      slider.controls.autoEl = $('<div class="bx-controls-auto" />');
      // bind click actions to the controls
      slider.controls.autoEl.on('click', '.bx-start', clickStartBind);
      slider.controls.autoEl.on('click', '.bx-stop', clickStopBind);
      // if autoControlsCombine, insert only the "start" control
      if (slider.settings.autoControlsCombine) {
        slider.controls.autoEl.append(slider.controls.start);
      // if autoControlsCombine is false, insert both controls
      } else {
        slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
      }
      // if auto controls selector was supplied, populate it with the controls
      if (slider.settings.autoControlsSelector) {
        $(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
      // if auto controls selector was not supplied, add it after the wrapper
      } else {
        slider.controls.el.addClass('bx-has-controls-auto').append(slider.controls.autoEl);
      }
      // update the auto controls
      updateAutoControls(slider.settings.autoStart ? 'stop' : 'start');
    };

    /**
     * Appends image captions to the DOM
     */
    var appendCaptions = function() {
      // cycle through each child
      slider.children.each(function(index) {
        // get the image title attribute
        var title = $(this).find('img:first').attr('title');
        // append the caption
        if (title !== undefined && ('' + title).length) {
          $(this).append('<div class="bx-caption"><span>' + title + '</span></div>');
        }
      });
    };

    /**
     * Click next binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickNextBind = function(e) {
      e.preventDefault();
      if (slider.controls.el.hasClass('disabled')) { return; }
      // if auto show is running, stop it
      if (slider.settings.auto && slider.settings.stopAutoOnClick) { el.stopAuto(); }
      el.goToNextSlide();
    };

    /**
     * Click prev binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickPrevBind = function(e) {
      e.preventDefault();
      if (slider.controls.el.hasClass('disabled')) { return; }
      // if auto show is running, stop it
      if (slider.settings.auto && slider.settings.stopAutoOnClick) { el.stopAuto(); }
      el.goToPrevSlide();
    };

    /**
     * Click start binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickStartBind = function(e) {
      el.startAuto();
      e.preventDefault();
    };

    /**
     * Click stop binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickStopBind = function(e) {
      el.stopAuto();
      e.preventDefault();
    };

    /**
     * Click pager binding
     *
     * @param e (event)
     *  - DOM event object
     */
    var clickPagerBind = function(e) {
      var pagerLink, pagerIndex;
      e.preventDefault();
      if (slider.controls.el.hasClass('disabled')) {
        return;
      }
      // if auto show is running, stop it
      if (slider.settings.auto  && slider.settings.stopAutoOnClick) { el.stopAuto(); }
      pagerLink = $(e.currentTarget);
      if (pagerLink.attr('data-slide-index') !== undefined) {
        pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
        // if clicked pager link is not active, continue with the goToSlide call
        if (pagerIndex !== slider.active.index) { el.goToSlide(pagerIndex); }
      }
    };

    /**
     * Updates the pager links with an active class
     *
     * @param slideIndex (int)
     *  - index of slide to make active
     */
    var updatePagerActive = function(slideIndex) {
      // if "short" pager type
      var len = slider.children.length; // nb of children
      if (slider.settings.pagerType === 'short') {
        if (slider.settings.maxSlides > 1) {
          len = Math.ceil(slider.children.length / slider.settings.maxSlides);
        }
        slider.pagerEl.html((slideIndex + 1) + slider.settings.pagerShortSeparator + len);
        return;
      }
      // remove all pager active classes
      slider.pagerEl.find('a').removeClass('active');
      // apply the active class for all pagers
      slider.pagerEl.each(function(i, el) { $(el).find('a').eq(slideIndex).addClass('active'); });
    };

    /**
     * Performs needed actions after a slide transition
     */
    var updateAfterSlideTransition = function() {
      // if infinite loop is true
      if (slider.settings.infiniteLoop) {
        var position = '';
        // first slide
        if (slider.active.index === 0) {
          // set the new position
          position = slider.children.eq(0).position();
        // carousel, last slide
        } else if (slider.active.index === getPagerQty() - 1 && slider.carousel) {
          position = slider.children.eq((getPagerQty() - 1) * getMoveBy()).position();
        // last slide
        } else if (slider.active.index === slider.children.length - 1) {
          position = slider.children.eq(slider.children.length - 1).position();
        }
        if (position) {
          if (slider.settings.mode === 'horizontal') { setPositionProperty(-position.left, 'reset', 0); }
          else if (slider.settings.mode === 'vertical') { setPositionProperty(-position.top, 'reset', 0); }
        }
      }
      // declare that the transition is complete
      slider.working = false;
      // onSlideAfter callback
      slider.settings.onSlideAfter.call(el, slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
    };

    /**
     * Updates the auto controls state (either active, or combined switch)
     *
     * @param state (string) "start", "stop"
     *  - the new state of the auto show
     */
    var updateAutoControls = function(state) {
      // if autoControlsCombine is true, replace the current control with the new state
      if (slider.settings.autoControlsCombine) {
        slider.controls.autoEl.html(slider.controls[state]);
      // if autoControlsCombine is false, apply the "active" class to the appropriate control
      } else {
        slider.controls.autoEl.find('a').removeClass('active');
        slider.controls.autoEl.find('a:not(.bx-' + state + ')').addClass('active');
      }
    };

    /**
     * Updates the direction controls (checks if either should be hidden)
     */
    var updateDirectionControls = function() {
      if (getPagerQty() === 1) {
        slider.controls.prev.addClass('disabled');
        slider.controls.next.addClass('disabled');
      } else if (!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd) {
        // if first slide
        if (slider.active.index === 0) {
          slider.controls.prev.addClass('disabled');
          slider.controls.next.removeClass('disabled');
        // if last slide
        } else if (slider.active.index === getPagerQty() - 1) {
          slider.controls.next.addClass('disabled');
          slider.controls.prev.removeClass('disabled');
        // if any slide in the middle
        } else {
          slider.controls.prev.removeClass('disabled');
          slider.controls.next.removeClass('disabled');
        }
      }
    };

    /**
     * Initializes the auto process
     */
    var initAuto = function() {
      // if autoDelay was supplied, launch the auto show using a setTimeout() call
      if (slider.settings.autoDelay > 0) {
        var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
      // if autoDelay was not supplied, start the auto show normally
      } else {
        el.startAuto();

        //add focus and blur events to ensure its running if timeout gets paused
        $(window).focus(function() {
          el.startAuto();
        }).blur(function() {
          el.stopAuto();
        });
      }
      // if autoHover is requested
      if (slider.settings.autoHover) {
        // on el hover
        el.hover(function() {
          // if the auto show is currently playing (has an active interval)
          if (slider.interval) {
            // stop the auto show and pass true argument which will prevent control update
            el.stopAuto(true);
            // create a new autoPaused value which will be used by the relative "mouseout" event
            slider.autoPaused = true;
          }
        }, function() {
          // if the autoPaused value was created be the prior "mouseover" event
          if (slider.autoPaused) {
            // start the auto show and pass true argument which will prevent control update
            el.startAuto(true);
            // reset the autoPaused value
            slider.autoPaused = null;
          }
        });
      }
    };

    /**
     * Initializes the ticker process
     */
    var initTicker = function() {
      var startPosition = 0,
      position, transform, value, idx, ratio, property, newSpeed, totalDimens;
      // if autoDirection is "next", append a clone of the entire slider
      if (slider.settings.autoDirection === 'next') {
        el.append(slider.children.clone().addClass('bx-clone'));
      // if autoDirection is "prev", prepend a clone of the entire slider, and set the left position
      } else {
        el.prepend(slider.children.clone().addClass('bx-clone'));
        position = slider.children.first().position();
        startPosition = slider.settings.mode === 'horizontal' ? -position.left : -position.top;
      }
      setPositionProperty(startPosition, 'reset', 0);
      // do not allow controls in ticker mode
      slider.settings.pager = false;
      slider.settings.controls = false;
      slider.settings.autoControls = false;
      // if autoHover is requested
      if (slider.settings.tickerHover) {
        if (slider.usingCSS) {
          idx = slider.settings.mode === 'horizontal' ? 4 : 5;
          slider.viewport.hover(function() {
            transform = el.css('-' + slider.cssPrefix + '-transform');
            value = parseFloat(transform.split(',')[idx]);
            setPositionProperty(value, 'reset', 0);
          }, function() {
            totalDimens = 0;
            slider.children.each(function(index) {
              totalDimens += slider.settings.mode === 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
            });
            // calculate the speed ratio (used to determine the new speed to finish the paused animation)
            ratio = slider.settings.speed / totalDimens;
            // determine which property to use
            property = slider.settings.mode === 'horizontal' ? 'left' : 'top';
            // calculate the new speed
            newSpeed = ratio * (totalDimens - (Math.abs(parseInt(value))));
            tickerLoop(newSpeed);
          });
        } else {
          // on el hover
          slider.viewport.hover(function() {
            el.stop();
          }, function() {
            // calculate the total width of children (used to calculate the speed ratio)
            totalDimens = 0;
            slider.children.each(function(index) {
              totalDimens += slider.settings.mode === 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
            });
            // calculate the speed ratio (used to determine the new speed to finish the paused animation)
            ratio = slider.settings.speed / totalDimens;
            // determine which property to use
            property = slider.settings.mode === 'horizontal' ? 'left' : 'top';
            // calculate the new speed
            newSpeed = ratio * (totalDimens - (Math.abs(parseInt(el.css(property)))));
            tickerLoop(newSpeed);
          });
        }
      }
      // start the ticker loop
      tickerLoop();
    };

    /**
     * Runs a continuous loop, news ticker-style
     */
    var tickerLoop = function(resumeSpeed) {
      var speed = resumeSpeed ? resumeSpeed : slider.settings.speed,
      position = {left: 0, top: 0},
      reset = {left: 0, top: 0},
      animateProperty, resetValue, params;

      // if "next" animate left position to last child, then reset left to 0
      if (slider.settings.autoDirection === 'next') {
        position = el.find('.bx-clone').first().position();
      // if "prev" animate left position to 0, then reset left to first non-clone child
      } else {
        reset = slider.children.first().position();
      }
      animateProperty = slider.settings.mode === 'horizontal' ? -position.left : -position.top;
      resetValue = slider.settings.mode === 'horizontal' ? -reset.left : -reset.top;
      params = {resetValue: resetValue};
      setPositionProperty(animateProperty, 'ticker', speed, params);
    };

    /**
     * Check if el is on screen
     */
    var isOnScreen = function(el) {
      var win = $(window),
      viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
      },
      bounds = el.offset();

      viewport.right = viewport.left + win.width();
      viewport.bottom = viewport.top + win.height();
      bounds.right = bounds.left + el.outerWidth();
      bounds.bottom = bounds.top + el.outerHeight();

      return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
    };

    /**
     * Initializes keyboard events
     */
    var keyPress = function(e) {
      var activeElementTag = document.activeElement.tagName.toLowerCase(),
      tagFilters = 'input|textarea',
      p = new RegExp(activeElementTag,['i']),
      result = p.exec(tagFilters);

      if (result == null && isOnScreen(el)) {
        if (e.keyCode === 39) {
          clickNextBind(e);
          return false;
        } else if (e.keyCode === 37) {
          clickPrevBind(e);
          return false;
        }
      }
    };

    /**
     * Initializes touch events
     */
    var initTouch = function() {
      // initialize object to contain all touch values
      slider.touch = {
        start: {x: 0, y: 0},
        end: {x: 0, y: 0}
      };
      slider.viewport.bind('touchstart MSPointerDown pointerdown', onTouchStart);

      //for browsers that have implemented pointer events and fire a click after
      //every pointerup regardless of whether pointerup is on same screen location as pointerdown or not
      slider.viewport.on('click', '.bxslider a', function(e) {
        if (slider.viewport.hasClass('click-disabled')) {
          e.preventDefault();
          slider.viewport.removeClass('click-disabled');
        }
      });
    };

    /**
     * Event handler for "touchstart"
     *
     * @param e (event)
     *  - DOM event object
     */
    var onTouchStart = function(e) {
      //disable slider controls while user is interacting with slides to avoid slider freeze that happens on touch devices when a slide swipe happens immediately after interacting with slider controls
      slider.controls.el.addClass('disabled');

      if (slider.working) {
        e.preventDefault();
        slider.controls.el.removeClass('disabled');
      } else {
        // record the original position when touch starts
        slider.touch.originalPos = el.position();
        var orig = e.originalEvent,
        touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig];
        // record the starting touch x, y coordinates
        slider.touch.start.x = touchPoints[0].pageX;
        slider.touch.start.y = touchPoints[0].pageY;

        if (slider.viewport.get(0).setPointerCapture) {
          slider.pointerId = orig.pointerId;
          slider.viewport.get(0).setPointerCapture(slider.pointerId);
        }
        // bind a "touchmove" event to the viewport
        slider.viewport.bind('touchmove MSPointerMove pointermove', onTouchMove);
        // bind a "touchend" event to the viewport
        slider.viewport.bind('touchend MSPointerUp pointerup', onTouchEnd);
        slider.viewport.bind('MSPointerCancel pointercancel', onPointerCancel);
      }
    };

    /**
     * Cancel Pointer for Windows Phone
     *
     * @param e (event)
     *  - DOM event object
     */
    var onPointerCancel = function(e) {
      /* onPointerCancel handler is needed to deal with situations when a touchend
      doesn't fire after a touchstart (this happens on windows phones only) */
      setPositionProperty(slider.touch.originalPos.left, 'reset', 0);

      //remove handlers
      slider.controls.el.removeClass('disabled');
      slider.viewport.unbind('MSPointerCancel pointercancel', onPointerCancel);
      slider.viewport.unbind('touchmove MSPointerMove pointermove', onTouchMove);
      slider.viewport.unbind('touchend MSPointerUp pointerup', onTouchEnd);
      if (slider.viewport.get(0).releasePointerCapture) {
        slider.viewport.get(0).releasePointerCapture(slider.pointerId);
      }
    };

    /**
     * Event handler for "touchmove"
     *
     * @param e (event)
     *  - DOM event object
     */
    var onTouchMove = function(e) {
      var orig = e.originalEvent,
      touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig],
      // if scrolling on y axis, do not prevent default
      xMovement = Math.abs(touchPoints[0].pageX - slider.touch.start.x),
      yMovement = Math.abs(touchPoints[0].pageY - slider.touch.start.y),
      value = 0,
      change = 0;

      // x axis swipe
      if ((xMovement * 3) > yMovement && slider.settings.preventDefaultSwipeX) {
        e.preventDefault();
      // y axis swipe
      } else if ((yMovement * 3) > xMovement && slider.settings.preventDefaultSwipeY) {
        e.preventDefault();
      }
      if (slider.settings.mode !== 'fade' && slider.settings.oneToOneTouch) {
        // if horizontal, drag along x axis
        if (slider.settings.mode === 'horizontal') {
          change = touchPoints[0].pageX - slider.touch.start.x;
          value = slider.touch.originalPos.left + change;
        // if vertical, drag along y axis
        } else {
          change = touchPoints[0].pageY - slider.touch.start.y;
          value = slider.touch.originalPos.top + change;
        }
        setPositionProperty(value, 'reset', 0);
      }
    };

    /**
     * Event handler for "touchend"
     *
     * @param e (event)
     *  - DOM event object
     */
    var onTouchEnd = function(e) {
      slider.viewport.unbind('touchmove MSPointerMove pointermove', onTouchMove);
      //enable slider controls as soon as user stops interacing with slides
      slider.controls.el.removeClass('disabled');
      var orig    = e.originalEvent,
      touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig],
      value       = 0,
      distance    = 0;
      // record end x, y positions
      slider.touch.end.x = touchPoints[0].pageX;
      slider.touch.end.y = touchPoints[0].pageY;
      // if fade mode, check if absolute x distance clears the threshold
      if (slider.settings.mode === 'fade') {
        distance = Math.abs(slider.touch.start.x - slider.touch.end.x);
        if (distance >= slider.settings.swipeThreshold) {
          if (slider.touch.start.x > slider.touch.end.x) {
            el.goToNextSlide();
          } else {
            el.goToPrevSlide();
          }
          el.stopAuto();
        }
      // not fade mode
      } else {
        // calculate distance and el's animate property
        if (slider.settings.mode === 'horizontal') {
          distance = slider.touch.end.x - slider.touch.start.x;
          value = slider.touch.originalPos.left;
        } else {
          distance = slider.touch.end.y - slider.touch.start.y;
          value = slider.touch.originalPos.top;
        }
        // if not infinite loop and first / last slide, do not attempt a slide transition
        if (!slider.settings.infiniteLoop && ((slider.active.index === 0 && distance > 0) || (slider.active.last && distance < 0))) {
          setPositionProperty(value, 'reset', 200);
        } else {
          // check if distance clears threshold
          if (Math.abs(distance) >= slider.settings.swipeThreshold) {
            if (distance < 0) {
              el.goToNextSlide();
            } else {
              el.goToPrevSlide();
            }
            el.stopAuto();
          } else {
            // el.animate(property, 200);
            setPositionProperty(value, 'reset', 200);
          }
        }
      }
      slider.viewport.unbind('touchend MSPointerUp pointerup', onTouchEnd);
      if (slider.viewport.get(0).releasePointerCapture) {
        slider.viewport.get(0).releasePointerCapture(slider.pointerId);
      }
    };

    /**
     * Window resize event callback
     */
    var resizeWindow = function(e) {
      // don't do anything if slider isn't initialized.
      if (!slider.initialized) { return; }
      // Delay if slider working.
      if (slider.working) {
        window.setTimeout(resizeWindow, 10);
      } else {
        // get the new window dimens (again, thank you IE)
        var windowWidthNew = $(window).width(),
        windowHeightNew = $(window).height();
        // make sure that it is a true window resize
        // *we must check this because our dinosaur friend IE fires a window resize event when certain DOM elements
        // are resized. Can you just die already?*
        if (windowWidth !== windowWidthNew || windowHeight !== windowHeightNew) {
          // set the new window dimens
          windowWidth = windowWidthNew;
          windowHeight = windowHeightNew;
          // update all dynamic elements
          el.redrawSlider();
          // Call user resize handler
          slider.settings.onSliderResize.call(el, slider.active.index);
        }
      }
    };

    /**
     * Adds an aria-hidden=true attribute to each element
     *
     * @param startVisibleIndex (int)
     *  - the first visible element's index
     */
    var applyAriaHiddenAttributes = function(startVisibleIndex) {
      var numberOfSlidesShowing = getNumberSlidesShowing();
      // only apply attributes if the setting is enabled and not in ticker mode
      if (slider.settings.ariaHidden && !slider.settings.ticker) {
        // add aria-hidden=true to all elements
        slider.children.attr('aria-hidden', 'true');
        // get the visible elements and change to aria-hidden=false
        slider.children.slice(startVisibleIndex, startVisibleIndex + numberOfSlidesShowing).attr('aria-hidden', 'false');
      }
    };

    /**
     * Returns index according to present page range
     *
     * @param slideOndex (int)
     *  - the desired slide index
     */
    var setSlideIndex = function(slideIndex) {
      if (slideIndex < 0) {
        if (slider.settings.infiniteLoop) {
          return getPagerQty() - 1;
        }else {
          //we don't go to undefined slides
          return slider.active.index;
        }
      // if slideIndex is greater than children length, set active index to 0 (this happens during infinite loop)
      } else if (slideIndex >= getPagerQty()) {
        if (slider.settings.infiniteLoop) {
          return 0;
        } else {
          //we don't move to undefined pages
          return slider.active.index;
        }
      // set active index to requested slide
      } else {
        return slideIndex;
      }
    };

    /**
     * ===================================================================================
     * = PUBLIC FUNCTIONS
     * ===================================================================================
     */

    /**
     * Performs slide transition to the specified slide
     *
     * @param slideIndex (int)
     *  - the destination slide's index (zero-based)
     *
     * @param direction (string)
     *  - INTERNAL USE ONLY - the direction of travel ("prev" / "next")
     */
    el.goToSlide = function(slideIndex, direction) {
      // onSlideBefore, onSlideNext, onSlidePrev callbacks
      // Allow transition canceling based on returned value
      var performTransition = true,
      moveBy = 0,
      position = {left: 0, top: 0},
      lastChild = null,
      lastShowingIndex, eq, value, requestEl;
      // store the old index
      slider.oldIndex = slider.active.index;
      //set new index
      slider.active.index = setSlideIndex(slideIndex);

      // if plugin is currently in motion, ignore request
      if (slider.working || slider.active.index === slider.oldIndex) { return; }
      // declare that plugin is in motion
      slider.working = true;

      performTransition = slider.settings.onSlideBefore.call(el, slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);

      // If transitions canceled, reset and return
      if (typeof (performTransition) !== 'undefined' && !performTransition) {
        slider.active.index = slider.oldIndex; // restore old index
        slider.working = false; // is not in motion
        return;
      }

      if (direction === 'next') {
        // Prevent canceling in future functions or lack there-of from negating previous commands to cancel
        if (!slider.settings.onSlideNext.call(el, slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index)) {
          performTransition = false;
        }
      } else if (direction === 'prev') {
        // Prevent canceling in future functions or lack there-of from negating previous commands to cancel
        if (!slider.settings.onSlidePrev.call(el, slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index)) {
          performTransition = false;
        }
      }

      // check if last slide
      slider.active.last = slider.active.index >= getPagerQty() - 1;
      // update the pager with active class
      if (slider.settings.pager || slider.settings.pagerCustom) { updatePagerActive(slider.active.index); }
      // // check for direction control update
      if (slider.settings.controls) { updateDirectionControls(); }
      // if slider is set to mode: "fade"
      if (slider.settings.mode === 'fade') {
        // if adaptiveHeight is true and next height is different from current height, animate to the new height
        if (slider.settings.adaptiveHeight && slider.viewport.height() !== getViewportHeight()) {
          slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
        }
        // fade out the visible child and reset its z-index value
        slider.children.filter(':visible').fadeOut(slider.settings.speed).css({zIndex: 0});
        // fade in the newly requested slide
        slider.children.eq(slider.active.index).css('zIndex', slider.settings.slideZIndex + 1).fadeIn(slider.settings.speed, function() {
          $(this).css('zIndex', slider.settings.slideZIndex);
          updateAfterSlideTransition();
        });
      // slider mode is not "fade"
      } else {
        // if adaptiveHeight is true and next height is different from current height, animate to the new height
        if (slider.settings.adaptiveHeight && slider.viewport.height() !== getViewportHeight()) {
          slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
        }
        // if carousel and not infinite loop
        if (!slider.settings.infiniteLoop && slider.carousel && slider.active.last) {
          if (slider.settings.mode === 'horizontal') {
            // get the last child position
            lastChild = slider.children.eq(slider.children.length - 1);
            position = lastChild.position();
            // calculate the position of the last slide
            moveBy = slider.viewport.width() - lastChild.outerWidth();
          } else {
            // get last showing index position
            lastShowingIndex = slider.children.length - slider.settings.minSlides;
            position = slider.children.eq(lastShowingIndex).position();
          }
          // horizontal carousel, going previous while on first slide (infiniteLoop mode)
        } else if (slider.carousel && slider.active.last && direction === 'prev') {
          // get the last child position
          eq = slider.settings.moveSlides === 1 ? slider.settings.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (slider.children.length - slider.settings.maxSlides);
          lastChild = el.children('.bx-clone').eq(eq);
          position = lastChild.position();
        // if infinite loop and "Next" is clicked on the last slide
        } else if (direction === 'next' && slider.active.index === 0) {
          // get the last clone position
          position = el.find('> .bx-clone').eq(slider.settings.maxSlides).position();
          slider.active.last = false;
        // normal non-zero requests
        } else if (slideIndex >= 0) {
          //parseInt is applied to allow floats for slides/page
          requestEl = slideIndex * parseInt(getMoveBy());
          position = slider.children.eq(requestEl).position();
        }

        /* If the position doesn't exist
         * (e.g. if you destroy the slider on a next click),
         * it doesn't throw an error.
         */
        if (typeof (position) !== 'undefined') {
          value = slider.settings.mode === 'horizontal' ? -(position.left - moveBy) : -position.top;
          // plugin values to be animated
          setPositionProperty(value, 'slide', slider.settings.speed);
        } else {
          slider.working = false;
        }
      }
      if (slider.settings.ariaHidden) { applyAriaHiddenAttributes(slider.active.index * getMoveBy()); }
    };

    /**
     * Transitions to the next slide in the show
     */
    el.goToNextSlide = function() {
      // if infiniteLoop is false and last page is showing, disregard call
      if (!slider.settings.infiniteLoop && slider.active.last) { return; }
      var pagerIndex = parseInt(slider.active.index) + 1;
      el.goToSlide(pagerIndex, 'next');
    };

    /**
     * Transitions to the prev slide in the show
     */
    el.goToPrevSlide = function() {
      // if infiniteLoop is false and last page is showing, disregard call
      if (!slider.settings.infiniteLoop && slider.active.index === 0) { return; }
      var pagerIndex = parseInt(slider.active.index) - 1;
      el.goToSlide(pagerIndex, 'prev');
    };

    /**
     * Starts the auto show
     *
     * @param preventControlUpdate (boolean)
     *  - if true, auto controls state will not be updated
     */
    el.startAuto = function(preventControlUpdate) {
      // if an interval already exists, disregard call
      if (slider.interval) { return; }
      // create an interval
      slider.interval = setInterval(function() {
        if (slider.settings.autoDirection === 'next') {
          el.goToNextSlide();
        } else {
          el.goToPrevSlide();
        }
      }, slider.settings.pause);
      // if auto controls are displayed and preventControlUpdate is not true
      if (slider.settings.autoControls && preventControlUpdate !== true) { updateAutoControls('stop'); }
    };

    /**
     * Stops the auto show
     *
     * @param preventControlUpdate (boolean)
     *  - if true, auto controls state will not be updated
     */
    el.stopAuto = function(preventControlUpdate) {
      // if no interval exists, disregard call
      if (!slider.interval) { return; }
      // clear the interval
      clearInterval(slider.interval);
      slider.interval = null;
      // if auto controls are displayed and preventControlUpdate is not true
      if (slider.settings.autoControls && preventControlUpdate !== true) { updateAutoControls('start'); }
    };

    /**
     * Returns current slide index (zero-based)
     */
    el.getCurrentSlide = function() {
      return slider.active.index;
    };

    /**
     * Returns current slide element
     */
    el.getCurrentSlideElement = function() {
      return slider.children.eq(slider.active.index);
    };

    /**
     * Returns a slide element
     * @param index (int)
     *  - The index (zero-based) of the element you want returned.
     */
    el.getSlideElement = function(index) {
      return slider.children.eq(index);
    };

    /**
     * Returns number of slides in show
     */
    el.getSlideCount = function() {
      return slider.children.length;
    };

    /**
     * Return slider.working variable
     */
    el.isWorking = function() {
      return slider.working;
    };

    /**
     * Update all dynamic slider elements
     */
    el.redrawSlider = function() {
      // resize all children in ratio to new screen size
      slider.children.add(el.find('.bx-clone')).outerWidth(getSlideWidth());
      // adjust the height
      slider.viewport.css('height', getViewportHeight());
      // update the slide position
      if (!slider.settings.ticker) { setSlidePosition(); }
      // if active.last was true before the screen resize, we want
      // to keep it last no matter what screen size we end on
      if (slider.active.last) { slider.active.index = getPagerQty() - 1; }
      // if the active index (page) no longer exists due to the resize, simply set the index as last
      if (slider.active.index >= getPagerQty()) { slider.active.last = true; }
      // if a pager is being displayed and a custom pager is not being used, update it
      if (slider.settings.pager && !slider.settings.pagerCustom) {
        populatePager();
        updatePagerActive(slider.active.index);
      }
      if (slider.settings.ariaHidden) { applyAriaHiddenAttributes(slider.active.index * getMoveBy()); }
    };

    /**
     * Destroy the current instance of the slider (revert everything back to original state)
     */
    el.destroySlider = function() {
      // don't do anything if slider has already been destroyed
      if (!slider.initialized) { return; }
      slider.initialized = false;
      $('.bx-clone', this).remove();
      slider.children.each(function() {
        if ($(this).data('origStyle') !== undefined) {
          $(this).attr('style', $(this).data('origStyle'));
        } else {
          $(this).removeAttr('style');
        }
      });
      if ($(this).data('origStyle') !== undefined) {
        this.attr('style', $(this).data('origStyle'));
      } else {
        $(this).removeAttr('style');
      }
      $(this).unwrap().unwrap();
      if (slider.controls.el) { slider.controls.el.remove(); }
      if (slider.controls.next) { slider.controls.next.remove(); }
      if (slider.controls.prev) { slider.controls.prev.remove(); }
      if (slider.pagerEl && slider.settings.controls && !slider.settings.pagerCustom) { slider.pagerEl.remove(); }
      $('.bx-caption', this).remove();
      if (slider.controls.autoEl) { slider.controls.autoEl.remove(); }
      clearInterval(slider.interval);
      if (slider.settings.responsive) { $(window).unbind('resize', resizeWindow); }
      if (slider.settings.keyboardEnabled) { $(document).unbind('keydown', keyPress); }
      //remove self reference in data
      $(this).removeData('bxSlider');
    };

    /**
     * Reload the slider (revert all DOM changes, and re-initialize)
     */
    el.reloadSlider = function(settings) {
      if (settings !== undefined) { options = settings; }
      el.destroySlider();
      init();
      //store reference to self in order to access public functions later
      $(el).data('bxSlider', this);
    };

    init();

    $(el).data('bxSlider', this);

    // returns the current jQuery object
    return this;
  };

})(jQuery);

/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
;(function (factory) { 
if (typeof define === 'function' && define.amd) { 
 // AMD. Register as an anonymous module. 
 define(['jquery'], factory); 
 } else if (typeof exports === 'object') { 
 // Node/CommonJS 
 factory(require('jquery')); 
 } else { 
 // Browser globals 
 factory(window.jQuery || window.Zepto); 
 } 
 }(function($) { 

/*>>core*/
/**
 * 
 * Magnific Popup Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing',
	PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars 
 */
/*jshint -W079 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
	MagnificPopup = function(){},
	_isJQ = !!(window.jQuery),
	_prevStatus,
	_window = $(window),
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'mfp-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_mfpTrigger = function(e, data) {
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts "mfpEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
			}
		}
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
			_currPopupType = type;
		}
		return mfp.currTemplate.closeBtn;
	},
	// Initialize Magnific Popup only when called at least once
	_checkInstance = function() {
		if(!$.magnificPopup.instance) {
			/*jshint -W020 */
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true; 
		}
			
		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}
				
		return false;
	};



/**
 * Public functions
 */
MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin. 
	 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_document = $(document);

		mfp.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) { 
			// convert jQuery collection to array to avoid conflicts later
			mfp.items = data.items.toArray();

			mfp.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}
		} else {
			mfp.items = $.isArray(data.items) ? data.items : [data.items];
			mfp.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(mfp.isOpen) {
			mfp.updateItemHTML();
			return;
		}
		
		mfp.types = []; 
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq(0);
		} else {
			mfp.ev = _document;
		}

		if(data.key) {
			if(!mfp.popupsCache[data.key]) {
				mfp.popupsCache[data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache[data.key];
		} else {
			mfp.currTemplate = {};
		}



		mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

		if(mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}
		

		// Building markup
		// main containers are created only once
		if(!mfp.bgOverlay) {

			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				mfp.close();
			});

			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(mfp._checkIfClose(e.target)) {
					mfp.close();
				}
			});

			mfp.container = _getEl('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl('content');
		if(mfp.st.preloader) {
			mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
		}


		// Initializing modules
		var modules = $.magnificPopup.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			mfp['init'+n].call(mfp);
		}
		_mfpTrigger('BeforeOpen');


		if(mfp.st.showCloseBtn) {
			// Close button
			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( _getCloseBtn() );
			} else {
				_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' mfp-close-btn-in';
			}
		}

		if(mfp.st.alignTop) {
			_wrapClasses += ' mfp-align-top';
		}

	

		if(mfp.fixedContentPos) {
			mfp.wrap.css({
				overflow: mfp.st.overflowY,
				overflowX: 'hidden',
				overflowY: mfp.st.overflowY
			});
		} else {
			mfp.wrap.css({ 
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
			mfp.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}

		

		if(mfp.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			mfp.updateSize();
		});


		if(!mfp.st.closeOnContentClick) {
			_wrapClasses += ' mfp-auto-cursor';
		}
		
		if(_wrapClasses)
			mfp.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = mfp.wH = _window.height();

		
		var windowStyles = {};

		if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if(mfp.fixedContentPos) {
			if(!mfp.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}

		
		
		var classesToadd = mfp.st.mainClass;
		if(mfp.isIE7) {
			classesToadd += ' mfp-ie7';
		}
		if(classesToadd) {
			mfp._addClassToMFP( classesToadd );
		}

		// add content
		mfp.updateItemHTML();

		_mfpTrigger('BuildControls');

		// remove scrollbar, add margin e.t.c
		$('html').css(windowStyles);
		
		// add everything to DOM
		mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

		// Save last focused element
		mfp._lastFocusedEl = document.activeElement;
		
		// Wait for next cycle to allow CSS transition
		setTimeout(function() {
			
			if(mfp.content) {
				mfp._addClassToMFP(READY_CLASS);
				mfp._setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				mfp.bgOverlay.addClass(READY_CLASS);
			}
			
			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

		}, 16);

		mfp.isOpen = true;
		mfp.updateSize(windowHeight);
		_mfpTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!mfp.isOpen) return;
		_mfpTrigger(BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// for CSS3 animation
		if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
			mfp._addClassToMFP(REMOVING_CLASS);
			setTimeout(function() {
				mfp._close();
			}, mfp.st.removalDelay);
		} else {
			mfp._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_mfpTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		mfp.bgOverlay.detach();
		mfp.wrap.detach();
		mfp.container.empty();

		if(mfp.st.mainClass) {
			classesToRemove += mfp.st.mainClass + ' ';
		}

		mfp._removeClassFromMFP(classesToRemove);

		if(mfp.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if(mfp.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}
		
		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		mfp.ev.off(EVENT_NS);

		// clean up DOM elements that aren't removed
		mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
		mfp.bgOverlay.attr('class', 'mfp-bg');
		mfp.container.attr('class', 'mfp-container');

		// remove close button from target element
		if(mfp.st.showCloseBtn &&
		(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
			if(mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach();
		}


		if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
			$(mfp._lastFocusedEl).focus(); // put tab focus back
		}
		mfp.currItem = null;	
		mfp.content = null;
		mfp.currTemplate = null;
		mfp.prevHeight = 0;

		_mfpTrigger(AFTER_CLOSE_EVENT);
	},
	
	updateSize: function(winHeight) {

		if(mfp.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css('height', height);
			mfp.wH = height;
		} else {
			mfp.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!mfp.fixedContentPos) {
			mfp.wrap.css('height', mfp.wH);
		}

		_mfpTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = mfp.items[mfp.index];

		// Detach and perform modifications
		mfp.contentContainer.detach();

		if(mfp.content)
			mfp.content.detach();

		if(!item.parsed) {
			item = mfp.parseEl( mfp.index );
		}

		var type = item.type;

		_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _mfpOn('BeforeChange', function(e, prevType, newType) { });

		mfp.currItem = item;

		if(!mfp.currTemplate[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;

			// allows to modify markup
			_mfpTrigger('FirstMarkupParse', markup);

			if(markup) {
				mfp.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				mfp.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
		}

		var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
		mfp.appendContent(newContent, type);

		item.preloaded = true;

		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Append container back after its content changed
		mfp.container.prepend(mfp.contentContainer);

		_mfpTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		mfp.content = newContent;

		if(newContent) {
			if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!mfp.content.find('.mfp-close').length) {
					mfp.content.append(_getCloseBtn());
				}
			} else {
				mfp.content = newContent;
			}
		} else {
			mfp.content = '';
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);
		mfp.container.addClass('mfp-'+type+'-holder');

		mfp.contentContainer.append(mfp.content);
	},


	/**
	 * Creates Magnific Popup data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = mfp.items[index],
			type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			type = item.type;
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = mfp.types;

			// check for 'mfp-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('mfp-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-mfp-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || mfp.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);

		return mfp.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.mfpEl = this;
			mfp._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		}

		var eName = 'click.magnificPopup';
		options.mainEl = el;

		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

		if(disableOn) {
			if($.isFunction(disableOn)) {
				if( !disableOn.call(mfp) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}

		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(mfp.isOpen) {
				e.stopPropagation();
			}
		}

		options.el = $(e.mfpEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		mfp.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_mfpTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			mfp.preloader.html(text);

			mfp.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose: function(target) {

		if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
			return;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	_addClassToMFP: function(cName) {
		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_setFocus: function() {
		(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
	},
	_onFocusIn: function(e) {
		if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
			mfp._setFocus();
			return false;
		}
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				template.find(EVENT_NS + '-'+key).html(value);
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.magnificPopup.instance && $.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);
		this.modules.push(name);
	},

	defaults: {

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

		tClose: 'Close (Esc)',

		tLoading: 'Loading...',

		autoFocusLast: true

	}
};



$.fn.magnificPopup = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			mfp._openClick({mfpEl:items}, jqEl, itemOpts);
		} else {
			if(mfp.isOpen)
				mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);

		/*
		 * As Zepto doesn't support .data() method for objects
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('magnificPopup', options);
		} else {
			jqEl[0].magnificPopup = options;
		}

		mfp.addGroup(jqEl, options);

	}
	return jqEl;
};

/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder,
	_lastInlineElement,
	_putInlineElementsBack = function() {
		if(_lastInlineElement) {
			_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
			_lastInlineElement = null;
		}
	};

$.magnificPopup.registerModule(INLINE_NS, {
	options: {
		hiddenClass: 'hide', // will be appended with `mfp-` prefix
		markup: '',
		tNotFound: 'Content not found'
	},
	proto: {

		initInline: function() {
			mfp.types.push(INLINE_NS);

			_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				_putInlineElementsBack();
			});
		},

		getInline: function(item, template) {

			_putInlineElementsBack();

			if(item.src) {
				var inlineSt = mfp.st.inline,
					el = $(item.src);

				if(el.length) {

					// If target element has parent - we replace it with placeholder and put it back after popup is closed
					var parent = el[0].parentNode;
					if(parent && parent.tagName) {
						if(!_inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl(_hiddenClass);
							_hiddenClass = 'mfp-'+_hiddenClass;
						}
						// replace target inline element with placeholder
						_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
					}

					mfp.updateStatus('ready');
				} else {
					mfp.updateStatus('error', inlineSt.tNotFound);
					el = $('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			mfp.updateStatus('ready');
			mfp._parseMarkup(template, {}, item);
			return template;
		}
	}
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			$(document.body).removeClass(_ajaxCur);
		}
	},
	_destroyAjaxRequest = function() {
		_removeAjaxCursor();
		if(mfp.req) {
			mfp.req.abort();
		}
	};

$.magnificPopup.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%">The content</a> could not be loaded.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push(AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
			_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		},
		getAjax: function(item) {

			if(_ajaxCur) {
				$(document.body).addClass(_ajaxCur);
			}

			mfp.updateStatus('loading');

			var opts = $.extend({
				url: item.src,
				success: function(data, textStatus, jqXHR) {
					var temp = {
						data:data,
						xhr:jqXHR
					};

					_mfpTrigger('ParseAjax', temp);

					mfp.appendContent( $(temp.data), AJAX_NS );

					item.finished = true;

					_removeAjaxCursor();

					mfp._setFocus();

					setTimeout(function() {
						mfp.wrap.addClass(READY_CLASS);
					}, 16);

					mfp.updateStatus('ready');

					_mfpTrigger('AjaxContentAdded');
				},
				error: function() {
					_removeAjaxCursor();
					item.finished = item.loadError = true;
					mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
				}
			}, mfp.st.ajax.settings);

			mfp.req = $.ajax(opts);

			return '';
		}
	}
});

/*>>ajax*/

/*>>image*/
var _imgInterval,
	_getTitle = function(item) {
		if(item.data && item.data.title !== undefined)
			return item.data.title;

		var src = mfp.st.image.titleSrc;

		if(src) {
			if($.isFunction(src)) {
				return src.call(mfp, item);
			} else if(item.el) {
				return item.el.attr(src) || '';
			}
		}
		return '';
	};

$.magnificPopup.registerModule('image', {

	options: {
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<figure>'+
						'<div class="mfp-img"></div>'+
						'<figcaption>'+
							'<div class="mfp-bottom-bar">'+
								'<div class="mfp-title"></div>'+
								'<div class="mfp-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title',
		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.'
	},

	proto: {
		initImage: function() {
			var imgSt = mfp.st.image,
				ns = '.image';

			mfp.types.push('image');

			_mfpOn(OPEN_EVENT+ns, function() {
				if(mfp.currItem.type === 'image' && imgSt.cursor) {
					$(document.body).addClass(imgSt.cursor);
				}
			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					$(document.body).removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_mfpOn('Resize'+ns, mfp.resizeImage);
			if(mfp.isLowIE) {
				_mfpOn('AfterChange', mfp.resizeImage);
			}
		},
		resizeImage: function() {
			var item = mfp.currItem;
			if(!item || !item.img) return;

			if(mfp.st.image.verticalFit) {
				var decr = 0;
				// fix box-sizing in ie7/8
				if(mfp.isLowIE) {
					decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
				}
				item.img.css('max-height', mfp.wH-decr);
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {

				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}

				item.isCheckingImgSize = false;

				_mfpTrigger('ImageHasSize', item);

				if(item.imgHidden) {
					if(mfp.content)
						mfp.content.removeClass('mfp-loading');

					item.imgHidden = false;
				}

			}
		},

		/**
		 * Function that loops until the image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {

			var counter = 0,
				img = item.img[0],
				mfpSetInterval = function(delay) {

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							mfp._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 40) {
							mfpSetInterval(50);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};

			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');

							if(item === mfp.currItem){
								mfp._onImageHasSize(item);

								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_mfpTrigger('ImageLoadComplete');

						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				},

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.mfploader');
						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},
				imgSt = mfp.st.image;


			var el = template.find('.mfp-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'mfp-img';
				if(item.el && item.el.find('img').length) {
					img.alt = item.el.find('img').attr('alt');
				}
				item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}

				img = item.img[0];
				if(img.naturalWidth > 0) {
					item.hasSize = true;
				} else if(!img.width) {
					item.hasSize = false;
				}
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus('ready');
				}
				return template;
			}

			mfp.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			}

			return template;
		}
	}
});

/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery';

			mfp.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						mfp.prev();
					} else if (e.keyCode === 39) {
						mfp.next();
					}
				});
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
					var markup = gSt.arrowMarkup,
						arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
						arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					arrowLeft.click(function() {
						mfp.prev();
					});
					arrowRight.click(function() {
						mfp.next();
					});

					mfp.container.append(arrowLeft.add(arrowRight));
				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		},
		next: function() {
			mfp.direction = true;
			mfp.index = _getLoopedId(mfp.index + 1);
			mfp.updateItemHTML();
		},
		prev: function() {
			mfp.direction = false;
			mfp.index = _getLoopedId(mfp.index - 1);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		}
	}
});

/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = mfp.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/
 _checkInstance(); }));
/*===================================================================================================================
 * @name: bPopup
 * @type: jQuery
 * @author: (c) Bjoern Klinggaard - @bklinggaard
 * @demo: http://dinbror.dk/bpopup
 * @version: 0.11.0
 * @requires jQuery 1.4.3
 *==================================================================================================================*/
;(function($) {
	'use strict';
	
    $.fn.bPopup = function(options, callback) {
        
    	if ($.isFunction(options)) {
            callback 		= options;
            options 		= null;
        }

		// OPTIONS
        var o 				= $.extend({}, $.fn.bPopup.defaults, options);
		
		// HIDE SCROLLBAR?  
        if (!o.scrollBar)
            $('html').css('overflow', 'hidden');
        
		// VARIABLES	
        var $popup 			= this
          , d 				= $(document)
          , w 				= window
		  , $w				= $(w)
          , wH				= windowHeight()
		  , wW				= windowWidth()
          , prefix			= '__b-popup'
		  , isIOS6X			= (/OS 6(_\d)+/i).test(navigator.userAgent) // Used for a temporary fix for ios6 timer bug when using zoom/scroll 
          , buffer			= 200
		  , popups			= 0
          , id
          , inside
          , fixedVPos
          , fixedHPos
          , fixedPosStyle
		  , vPos
          , hPos
		  , height
		  , width
		  , debounce
		  , autoCloseTO
		;

		////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // PUBLIC FUNCTION - call it: $(element).bPopup().close();
		////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $popup.close = function() {
            close();
        };
		
        $popup.reposition = function(animateSpeed) {
            reposition(animateSpeed);
        };

        return $popup.each(function() {
            if ($(this).data('bPopup')) return; //POPUP already exists?
            init();
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // HELPER FUNCTIONS - PRIVATE
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function init() {
            triggerCall(o.onOpen);
			popups = ($w.data('bPopup') || 0) + 1, id = prefix + popups + '__',fixedVPos = o.position[1] !== 'auto', fixedHPos = o.position[0] !== 'auto', fixedPosStyle = o.positionStyle === 'fixed', height = $popup.outerHeight(true), width = $popup.outerWidth(true);
            o.loadUrl ? createContent() : open();
        };
		
		function createContent() {
            o.contentContainer = $(o.contentContainer || $popup);
            switch (o.content) {
                case ('iframe'):
					var iframe = $('<iframe class="b-iframe" ' + o.iframeAttr +'></iframe>');
					iframe.appendTo(o.contentContainer);
					height = $popup.outerHeight(true);
					width = $popup.outerWidth(true);
					open();
					iframe.attr('src', o.loadUrl); // setting iframe src after open due IE9 bug
					triggerCall(o.loadCallback);
                    break;
				case ('image'):
					open();
					$('<img />')
						.load(function() {
						    triggerCall(o.loadCallback);
							recenter($(this));
					    }).attr('src', o.loadUrl).hide().appendTo(o.contentContainer);
					break;
                default:
					open();
					$('<div class="b-ajax-wrapper"></div>')
                    	.load(o.loadUrl, o.loadData, function(response, status, xhr) {
						    triggerCall(o.loadCallback, status);
							recenter($(this));
						}).hide().appendTo(o.contentContainer);
                    break;
            }
        };

		function open(){
			// MODAL OVERLAY
            if (o.modal) {
                $('<div class="b-modal '+id+'"></div>')
                .css({backgroundColor: o.modalColor, position: 'fixed', top: 0, right:0, bottom:0, left: 0, opacity: 0, zIndex: o.zIndex + popups})
                .appendTo(o.appendTo)
                .fadeTo(o.speed, o.opacity);
            }
			
			// POPUP
			calcPosition();
            $popup
				.data('bPopup', o).data('id',id)
				.css({ 
					  'left': o.transition == 'slideIn' || o.transition == 'slideBack' ? (o.transition == 'slideBack' ? d.scrollLeft() + wW : (hPos + width) *-1) : getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle))
					, 'position': o.positionStyle || 'absolute'
					, 'top': o.transition == 'slideDown' || o.transition == 'slideUp' ? (o.transition == 'slideUp' ? d.scrollTop() + wH : vPos + height * -1) : getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle))
					, 'z-index': o.zIndex + popups + 1 
				}).each(function() {
            		if(o.appending) {
                		$(this).appendTo(o.appendTo);
            		}
        		});
			doTransition(true);	
		};
		
        function close() {
            if (o.modal) {
                $('.b-modal.'+$popup.data('id'))
	                .fadeTo(o.speed, 0, function() {
	                    $(this).remove();
	                });
            }
			// Clean up
			unbindEvents();	
			clearTimeout(autoCloseTO);
			// Close trasition
            doTransition();
            
			return false; // Prevent default
        };
		
		function reposition(animateSpeed){
            wH = windowHeight();
  		    wW = windowWidth();
			inside = insideWindow();
           	if(inside.x || inside.y){
				clearTimeout(debounce);
				debounce = setTimeout(function(){
					calcPosition();
					animateSpeed = animateSpeed || o.followSpeed;
					var css = {};
					if(inside.x)
						css.left = o.follow[0] ? getLeftPos(true) : 'auto';
					if(inside.y)
						css.top = o.follow[1] ? getTopPos(true) : 'auto';
					$popup
                       	.dequeue()
                       	.each(function() {
                           	if(fixedPosStyle) {
                            	$(this).css({ 'left': hPos, 'top': vPos });
                           	}
                           	else {
                               	$(this).animate(css, animateSpeed, o.followEasing);
                           	}
                       	});
				}, 50);					
           	}
		};
		
		//Eksperimental
		function recenter(content){
			var _width = content.width(), _height = content.height(), css = {};
			o.contentContainer.css({height:_height,width:_width});

			if (_height >= $popup.height()){
				css.height = $popup.height();
			}
			if(_width >= $popup.width()){
				css.width = $popup.width();
			}
			height = $popup.outerHeight(true)
			, width = $popup.outerWidth(true);
				
			calcPosition();
			o.contentContainer.css({height:'auto',width:'auto'});		
			
			css.left = getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle)),
			css.top = getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle));

			$popup
				.animate(
					css
					, 250
					, function() { 
						content.show();
						inside = insideWindow();
					}
				);
		};
		
        function bindEvents() {
            $w.data('bPopup', popups);
			$popup.delegate('.bClose, .' + o.closeClass, 'click.'+id, close); // legacy, still supporting the close class bClose
            
            if (o.modalClose) {
                $('.b-modal.'+id).css('cursor', 'pointer').bind('click', close);
            }
			
			// Temporary disabling scroll/resize events on devices with IOS6+
			// due to a bug where events are dropped after pinch to zoom
            if (!isIOS6X && (o.follow[0] || o.follow[1])) {
               $w.bind('scroll.'+id, function() {
                	if(inside.x || inside.y){
						var css = {};
						if(inside.x)
							css.left =  o.follow[0] ? getLeftPos(!fixedPosStyle) : 'auto';
						if(inside.y)
							css.top = o.follow[1] ? getTopPos(!fixedPosStyle) : 'auto';
                    	$popup
                        	.dequeue()
                            .animate(css, o.followSpeed, o.followEasing);
					 }  
            	}).bind('resize.'+id, function() {
		            reposition();
                });
            }
            if (o.escClose) {
                d.bind('keydown.'+id, function(e) {
                    if (e.which == 27) {  //escape
                        close();
                    }
                });
            }
        };
		
        function unbindEvents() {
            if (!o.scrollBar) {
                $('html').css('overflow', 'auto');
            }
            $('.b-modal.'+id).unbind('click');
            d.unbind('keydown.'+id);
            $w.unbind('.'+id).data('bPopup', ($w.data('bPopup')-1 > 0) ? $w.data('bPopup')-1 : null);
            $popup.undelegate('.bClose, .' + o.closeClass, 'click.'+id, close).data('bPopup', null);
        };
		
		function doTransition(open) {
			switch (open ? o.transition : o.transitionClose || o.transition) {
			   case "slideIn":
				   	animate({
				   		left: open ? getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle)) : d.scrollLeft() - (width || $popup.outerWidth(true)) - buffer
				   	});
			      	break;
			   case "slideBack":
				   	animate({
				   		left: open ? getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle)) : d.scrollLeft() + wW + buffer
				   	});
			      	break;
			   case "slideDown":
				   	animate({
				   		top: open ? getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle)) : d.scrollTop() - (height || $popup.outerHeight(true)) - buffer
				   	});
			      	break;
		   		case "slideUp":
					animate({
						top: open ? getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle)) : d.scrollTop() + wH + buffer
					});
		      	  	break;
			   default:
			   	  	//Hardtyping 1 and 0 to ensure opacity 1 and not 0.9999998
				  	$popup.stop().fadeTo(o.speed, open ? 1 : 0, function(){onCompleteCallback(open);});
			}
			
			function animate(css){
			  	$popup
					.css({display: 'block',opacity: 1})
					.animate(css, o.speed, o.easing, function(){ onCompleteCallback(open); });
			};
		};
		
		
		function onCompleteCallback(open){
			if(open){
				bindEvents();
	            triggerCall(callback);
				if(o.autoClose){
					autoCloseTO = setTimeout(close, o.autoClose);
				}
			} else {
				$popup.hide();
				triggerCall(o.onClose);
				if (o.loadUrl) {
                    o.contentContainer.empty();
					$popup.css({height: 'auto', width: 'auto'});
                }		
			}
		};
		
		function getLeftPos(includeScroll){
			return includeScroll ? hPos + d.scrollLeft() : hPos;
		};
		
		function getTopPos(includeScroll){
			return includeScroll ? vPos + d.scrollTop() : vPos;
		};
		
		function triggerCall(func, arg) {
			$.isFunction(func) && func.call($popup, arg);
		};
		
       	function calcPosition(){
			vPos 		= fixedVPos ? o.position[1] : Math.max(0, ((wH- $popup.outerHeight(true)) / 2) - o.amsl)
			, hPos 		= fixedHPos ? o.position[0] : (wW - $popup.outerWidth(true)) / 2
			, inside 	= insideWindow();
		};
		
        function insideWindow(){
            return {  
				x: wW > $popup.outerWidth(true),
				y: wH > $popup.outerHeight(true)	
			}
        };
		
		function windowHeight(){
			return $w.height();
		};
		
		function windowWidth(){
			return $w.width();
		};
    };

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// DEFAULT VALUES
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $.fn.bPopup.defaults = {
          amsl: 			50
        , appending: 		true
        , appendTo: 		'body'
		, autoClose:		false
        , closeClass: 		'b-close'
        , content: 			'ajax' // ajax, iframe or image
        , contentContainer: false
		, easing: 			'swing'
        , escClose: 		true
        , follow: 			[true, true] // x, y
		, followEasing: 	'swing'
        , followSpeed: 		500
		, iframeAttr: 		'scrolling="no" frameborder="0"'
		, loadCallback: 	false
		, loadData: 		false
        , loadUrl: 			false
        , modal: 			true
        , modalClose: 		true
        , modalColor: 		'#000'
        , onClose: 			false
        , onOpen: 			false
        , opacity: 			0.7
        , position: 		['auto', 'auto'] // x, y,
        , positionStyle: 	'absolute'// absolute or fixed
        , scrollBar: 		true
		, speed: 			250 // open & close speed
		, transition:		'fadeIn' //transitions: fadeIn, slideDown, slideIn, slideBack
		, transitionClose:	false
        , zIndex: 			9997 // popup gets z-index 9999, modal overlay 9998
    };
})(jQuery);

/* == Page scroll to id == Version: 1.5.8, License: MIT License (MIT) */
!function(e,t,a){var n,l,s,i,o,r,c,u,h,g,f,d,p="mPageScroll2id",_="mPS2id",C=".m_PageScroll2id,a[rel~='m_PageScroll2id'],.page-scroll-to-id,a[rel~='page-scroll-to-id'],._ps2id",v={scrollSpeed:1e3,autoScrollSpeed:!0,scrollEasing:"easeInOutQuint",scrollingEasing:"easeOutQuint",pageEndSmoothScroll:!0,layout:"vertical",offset:0,highlightSelector:!1,clickedClass:_+"-clicked",targetClass:_+"-target",highlightClass:_+"-highlight",forceSingleHighlight:!1,keepHighlightUntilNext:!1,highlightByNextTarget:!1,disablePluginBelow:!1,clickEvents:!0,appendHash:!1,onStart:function(){},onComplete:function(){},defaultSelector:!1,live:!0,liveSelector:!1},m=0,S={init:function(r){var r=e.extend(!0,{},v,r);if(e(a).data(_,r),l=e(a).data(_),!this.selector){var c="__"+_;this.each(function(){var t=e(this);t.hasClass(c)||t.addClass(c)}),this.selector="."+c}l.liveSelector&&(this.selector+=","+l.liveSelector),n=n?n+","+this.selector:this.selector,l.defaultSelector&&("object"==typeof e(n)&&0!==e(n).length||(n=C)),l.clickEvents&&e(a).undelegate("."+_).delegate(n,"click."+_,function(t){if(I._isDisabled.call(null))return void I._removeClasses.call(null);var a=e(this),n=a.attr("href"),l=a.prop("href");n&&-1!==n.indexOf("#/")||(I._reset.call(null),g=a.data("ps2id-offset")||0,I._isValid.call(null,n,l)&&I._findTarget.call(null,n)&&(t.preventDefault(),i="selector",o=a,I._setClasses.call(null,!0),I._scrollTo.call(null)))}),e(t).unbind("."+_).bind("scroll."+_+" resize."+_,function(){if(I._isDisabled.call(null))return void I._removeClasses.call(null);var t=e("._"+_+"-t");t.each(function(a){var n=e(this),l=n.attr("id"),s=I._findHighlight.call(null,l);I._setClasses.call(null,!1,n,s),a==t.length-1&&I._extendClasses.call(null)})}),s=!0,I._setup.call(null),I._live.call(null)},scrollTo:function(t,a){if(I._isDisabled.call(null))return void I._removeClasses.call(null);if(t&&"undefined"!=typeof t){I._isInit.call(null);var n={layout:l.layout,offset:l.offset,clicked:!1},a=e.extend(!0,{},n,a);I._reset.call(null),u=a.layout,h=a.offset,t=-1!==t.indexOf("#")?t:"#"+t,I._isValid.call(null,t)&&I._findTarget.call(null,t)&&(i="scrollTo",o=a.clicked,o&&I._setClasses.call(null,!0),I._scrollTo.call(null))}},destroy:function(){e(t).unbind("."+_),e(a).undelegate("."+_).removeData(_),e("._"+_+"-t").removeData(_),I._removeClasses.call(null,!0)}},I={_isDisabled:function(){var e=t,n="inner",s=l.disablePluginBelow instanceof Array?[l.disablePluginBelow[0]||0,l.disablePluginBelow[1]||0]:[l.disablePluginBelow||0,0];return"innerWidth"in t||(n="client",e=a.documentElement||a.body),e[n+"Width"]<=s[0]||e[n+"Height"]<=s[1]},_isValid:function(e,a){if(e){a=a?a:e;var n=-1!==a.indexOf("#/")?a.split("#/")[0]:a.split("#")[0],l=t.location.toString().split("#")[0];return"#"!==e&&-1!==e.indexOf("#")&&(""===n||decodeURIComponent(n)===decodeURIComponent(l))}},_setup:function(){var t=I._highlightSelector(),a=1,n=0;return e(t).each(function(){var s=e(this),i=s.attr("href"),o=s.prop("href");if(I._isValid.call(null,i,o)){var r=-1!==i.indexOf("#/")?i.split("#/")[1]:i.split("#")[1],c=e("#"+r);if(c.length>0){l.highlightByNextTarget&&c!==n&&(n?n.data(_,{tn:c}):c.data(_,{tn:"0"}),n=c),c.hasClass("_"+_+"-t")||c.addClass("_"+_+"-t"),c.data(_,{i:a}),s.hasClass("_"+_+"-h")||s.addClass("_"+_+"-h");var u=I._findHighlight.call(null,r);I._setClasses.call(null,!1,c,u),m=a,a++,a==e(t).length&&I._extendClasses.call(null)}}})},_highlightSelector:function(){return l.highlightSelector&&""!==l.highlightSelector?l.highlightSelector:n},_findTarget:function(t){var a=-1!==t.indexOf("#/")?t.split("#/")[1]:t.split("#")[1],n=e("#"+a);if(n.length<1||"fixed"===n.css("position")){if("top"!==a)return;n=e("body")}return r=n,u||(u=l.layout),h=I._setOffset.call(null),c=[(n.offset().top-h[0]).toString(),(n.offset().left-h[1]).toString()],c[0]=c[0]<0?0:c[0],c[1]=c[1]<0?0:c[1],c},_setOffset:function(){h||(h=l.offset?l.offset:0),g&&(h=g);var t,a,n,s;switch(typeof h){case"object":case"string":t=[h.y?h.y:h,h.x?h.x:h],a=[t[0]instanceof jQuery?t[0]:e(t[0]),t[1]instanceof jQuery?t[1]:e(t[1])],a[0].length>0?(n=a[0].height(),"fixed"===a[0].css("position")&&(n+=a[0][0].offsetTop)):n=!isNaN(parseFloat(t[0]))&&isFinite(t[0])?parseInt(t[0]):0,a[1].length>0?(s=a[1].width(),"fixed"===a[1].css("position")&&(s+=a[1][0].offsetLeft)):s=!isNaN(parseFloat(t[1]))&&isFinite(t[1])?parseInt(t[1]):0;break;case"function":t=h.call(null),t instanceof Array?(n=t[0],s=t[1]):n=s=t;break;default:n=s=parseInt(h)}return[n,s]},_findHighlight:function(a){var n=t.location,l=n.toString().split("#")[0],s=n.pathname;return e("._"+_+"-h[href='#"+a+"'],._"+_+"-h[href='"+l+"#"+a+"'],._"+_+"-h[href='"+s+"#"+a+"'],._"+_+"-h[href='#/"+a+"'],._"+_+"-h[href='"+l+"#/"+a+"'],._"+_+"-h[href='"+s+"#/"+a+"']")},_setClasses:function(t,a,n){var s=l.clickedClass,i=l.targetClass,r=l.highlightClass;t&&s&&""!==s?(e("."+s).removeClass(s),o.addClass(s)):a&&i&&""!==i&&n&&r&&""!==r&&(I._currentTarget.call(null,a)?(a.addClass(i),n.addClass(r)):(!l.keepHighlightUntilNext||e("."+r).length>1)&&(a.removeClass(i),n.removeClass(r)))},_extendClasses:function(){var t=l.targetClass,a=l.highlightClass,n=e("."+t),s=e("."+a),i=t+"-first",o=t+"-last",r=a+"-first",c=a+"-last";e("._"+_+"-t").removeClass(i+" "+o),e("._"+_+"-h").removeClass(r+" "+c),l.forceSingleHighlight?l.keepHighlightUntilNext&&n.length>1?(n.slice(0,1).removeClass(t),s.slice(0,1).removeClass(a)):(n.slice(1).removeClass(t),s.slice(1).removeClass(a)):(n.slice(0,1).addClass(i).end().slice(-1).addClass(o),s.slice(0,1).addClass(r).end().slice(-1).addClass(c))},_removeClasses:function(t){e("."+l.clickedClass).removeClass(l.clickedClass),e("."+l.targetClass).removeClass(l.targetClass+" "+l.targetClass+"-first "+l.targetClass+"-last"),e("."+l.highlightClass).removeClass(l.highlightClass+" "+l.highlightClass+"-first "+l.highlightClass+"-last"),t&&(e("._"+_+"-t").removeClass("_"+_+"-t"),e("._"+_+"-h").removeClass("_"+_+"-h"))},_currentTarget:function(a){var n=l["target_"+a.data(_).i],s=a.data("ps2id-target"),i=s&&e(s)[0]?e(s)[0].getBoundingClientRect():a[0].getBoundingClientRect();if("undefined"!=typeof n){var o=a.offset().top,r=a.offset().left,c=n.from?n.from+o:o,u=n.to?n.to+o:o,h=n.fromX?n.fromX+r:r,g=n.toX?n.toX+r:r;return i.top>=u&&i.top<=c&&i.left>=g&&i.left<=h}var f=e(t).height(),d=e(t).width(),p=s?e(s).height():a.height(),C=s?e(s).width():a.width(),v=1+p/f,m=v,S=f>p?v*(f/p):v,I=1+C/d,O=I,M=d>C?I*(d/C):I,b=[i.top<=f/m,i.bottom>=f/S,i.left<=d/O,i.right>=d/M];if(l.highlightByNextTarget){var y=a.data(_).tn;if(y){var w=y[0].getBoundingClientRect();"vertical"===l.layout?b=[i.top<=f/2,w.top>f/2,1,1]:"horizontal"===l.layout&&(b=[1,1,i.left<=d/2,w.left>d/2])}}return b[0]&&b[1]&&b[2]&&b[3]},_scrollTo:function(){d=I._scrollSpeed.call(null),c=l.pageEndSmoothScroll?I._pageEndSmoothScroll.call(null):c;var a=e("html,body"),n=l.autoScrollSpeed?I._autoScrollSpeed.call(null):d,s=a.is(":animated")?l.scrollingEasing:l.scrollEasing,i=e(t).scrollTop(),o=e(t).scrollLeft();switch(u){case"horizontal":o!=c[1]&&(I._callbacks.call(null,"onStart"),a.stop().animate({scrollLeft:c[1]},n,s).promise().then(function(){I._callbacks.call(null,"onComplete")}));break;case"auto":if(i!=c[0]||o!=c[1])if(I._callbacks.call(null,"onStart"),navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)){var r;a.stop().animate({pageYOffset:c[0],pageXOffset:c[1]},{duration:n,easing:s,step:function(e,a){"pageXOffset"==a.prop?r=e:"pageYOffset"==a.prop&&t.scrollTo(r,e)}}).promise().then(function(){I._callbacks.call(null,"onComplete")})}else a.stop().animate({scrollTop:c[0],scrollLeft:c[1]},n,s).promise().then(function(){I._callbacks.call(null,"onComplete")});break;default:i!=c[0]&&(I._callbacks.call(null,"onStart"),a.stop().animate({scrollTop:c[0]},n,s).promise().then(function(){I._callbacks.call(null,"onComplete")}))}},_pageEndSmoothScroll:function(){var n=e(a).height(),l=e(a).width(),s=e(t).height(),i=e(t).width();return[n-c[0]<s?n-s:c[0],l-c[1]<i?l-i:c[1]]},_scrollSpeed:function(){var t=l.scrollSpeed;return o&&o.length&&o.add(o.parent()).each(function(){var a=e(this);if(a.attr("class")){var n=a.attr("class").split(" ");for(var l in n)if(String(n[l]).match(/^ps2id-speed-\d+$/)){t=n[l].split("ps2id-speed-")[1];break}}}),parseInt(t)},_autoScrollSpeed:function(){var n=e(t).scrollTop(),l=e(t).scrollLeft(),s=e(a).height(),i=e(a).width(),o=[d+d*Math.floor(Math.abs(c[0]-n)/s*100)/100,d+d*Math.floor(Math.abs(c[1]-l)/i*100)/100];return Math.max.apply(Math,o)},_callbacks:function(e){if(l)switch(this[_]={trigger:i,clicked:o,target:r,scrollTo:{y:c[0],x:c[1]}},e){case"onStart":if(l.appendHash&&t.history&&t.history.pushState&&o&&o.length){var a="#"+o.attr("href").split("#")[1];a!==t.location.hash&&history.pushState("","",a)}l.onStart.call(null,this[_]);break;case"onComplete":l.onComplete.call(null,this[_])}},_reset:function(){u=h=g=!1},_isInit:function(){s||S.init.apply(this)},_live:function(){f=setTimeout(function(){l.live?e(I._highlightSelector()).length!==m&&I._setup.call(null):f&&clearTimeout(f),I._live.call(null)},1e3)},_easing:function(){function t(e){var t=7.5625,a=2.75;return 1/a>e?t*e*e:2/a>e?t*(e-=1.5/a)*e+.75:2.5/a>e?t*(e-=2.25/a)*e+.9375:t*(e-=2.625/a)*e+.984375}e.easing.easeInQuad=e.easing.easeInQuad||function(e){return e*e},e.easing.easeOutQuad=e.easing.easeOutQuad||function(e){return 1-(1-e)*(1-e)},e.easing.easeInOutQuad=e.easing.easeInOutQuad||function(e){return.5>e?2*e*e:1-Math.pow(-2*e+2,2)/2},e.easing.easeInCubic=e.easing.easeInCubic||function(e){return e*e*e},e.easing.easeOutCubic=e.easing.easeOutCubic||function(e){return 1-Math.pow(1-e,3)},e.easing.easeInOutCubic=e.easing.easeInOutCubic||function(e){return.5>e?4*e*e*e:1-Math.pow(-2*e+2,3)/2},e.easing.easeInQuart=e.easing.easeInQuart||function(e){return e*e*e*e},e.easing.easeOutQuart=e.easing.easeOutQuart||function(e){return 1-Math.pow(1-e,4)},e.easing.easeInOutQuart=e.easing.easeInOutQuart||function(e){return.5>e?8*e*e*e*e:1-Math.pow(-2*e+2,4)/2},e.easing.easeInQuint=e.easing.easeInQuint||function(e){return e*e*e*e*e},e.easing.easeOutQuint=e.easing.easeOutQuint||function(e){return 1-Math.pow(1-e,5)},e.easing.easeInOutQuint=e.easing.easeInOutQuint||function(e){return.5>e?16*e*e*e*e*e:1-Math.pow(-2*e+2,5)/2},e.easing.easeInExpo=e.easing.easeInExpo||function(e){return 0===e?0:Math.pow(2,10*e-10)},e.easing.easeOutExpo=e.easing.easeOutExpo||function(e){return 1===e?1:1-Math.pow(2,-10*e)},e.easing.easeInOutExpo=e.easing.easeInOutExpo||function(e){return 0===e?0:1===e?1:.5>e?Math.pow(2,20*e-10)/2:(2-Math.pow(2,-20*e+10))/2},e.easing.easeInSine=e.easing.easeInSine||function(e){return 1-Math.cos(e*Math.PI/2)},e.easing.easeOutSine=e.easing.easeOutSine||function(e){return Math.sin(e*Math.PI/2)},e.easing.easeInOutSine=e.easing.easeInOutSine||function(e){return-(Math.cos(Math.PI*e)-1)/2},e.easing.easeInCirc=e.easing.easeInCirc||function(e){return 1-Math.sqrt(1-Math.pow(e,2))},e.easing.easeOutCirc=e.easing.easeOutCirc||function(e){return Math.sqrt(1-Math.pow(e-1,2))},e.easing.easeInOutCirc=e.easing.easeInOutCirc||function(e){return.5>e?(1-Math.sqrt(1-Math.pow(2*e,2)))/2:(Math.sqrt(1-Math.pow(-2*e+2,2))+1)/2},e.easing.easeInElastic=e.easing.easeInElastic||function(e){return 0===e?0:1===e?1:-Math.pow(2,10*e-10)*Math.sin((10*e-10.75)*(2*Math.PI/3))},e.easing.easeOutElastic=e.easing.easeOutElastic||function(e){return 0===e?0:1===e?1:Math.pow(2,-10*e)*Math.sin((10*e-.75)*(2*Math.PI/3))+1},e.easing.easeInOutElastic=e.easing.easeInOutElastic||function(e){return 0===e?0:1===e?1:.5>e?-(Math.pow(2,20*e-10)*Math.sin((20*e-11.125)*(2*Math.PI/4.5)))/2:Math.pow(2,-20*e+10)*Math.sin((20*e-11.125)*(2*Math.PI/4.5))/2+1},e.easing.easeInBack=e.easing.easeInBack||function(e){return 2.70158*e*e*e-1.70158*e*e},e.easing.easeOutBack=e.easing.easeOutBack||function(e){return 1+2.70158*Math.pow(e-1,3)+1.70158*Math.pow(e-1,2)},e.easing.easeInOutBack=e.easing.easeInOutBack||function(e){return.5>e?Math.pow(2*e,2)*(7.189819*e-2.5949095)/2:(Math.pow(2*e-2,2)*(3.5949095*(2*e-2)+2.5949095)+2)/2},e.easing.easeInBounce=e.easing.easeInBounce||function(e){return 1-t(1-e)},e.easing.easeOutBounce=e.easing.easeOutBounce||t,e.easing.easeInOutBounce=e.easing.easeInOutBounce||function(e){return.5>e?(1-t(1-2*e))/2:(1+t(2*e-1))/2}}};I._easing.call(),e.fn[p]=function(t){return S[t]?S[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):S.init.apply(this,arguments)},e[p]=function(t){return S[t]?S[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):S.init.apply(this,arguments)},e[p].defaults=v}(jQuery,window,document);