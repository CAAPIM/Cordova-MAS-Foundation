/*!
 * simple-popup.js
 * https://github.com/Alex1990/simple-popup
 * Under the MIT License | (c) 2015 Alex Chao
 */

!(function(global, factory) {

  // Uses CommonJS, AMD or browser global to create a jQuery plugin.
  // See: https://github.com/umdjs/umd
  if (typeof define === 'function' && define.amd) {
    // Expose this plugin as an AMD module. Register an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS module
    module.exports = Popup = factory();
  } else {
    // Browser globals
    factory(global);
  }

}(this, function(global) {

  'use strict';

  // Shortand
  var win = window;
  var doc = document;
  var docEl = doc.documentElement;

  var defaults = {
    width: 500,
    height: 400,
    offsetX: 0,
    offsetY: 0,
    zIndex: 999,
    closeBtnClass: 'popup-close'
  };

  var extend = function(to, from) {
    for (var p in from) {
      if (from.hasOwnProperty(p)) {
        to[p] = from[p];
      }
    }
    return to;
  };

  // Get the viewport width.
  var winW = function() {
    return win.innerWidth || docEl.clientWidth;
  };

  // Get the viewport height.
  var winH = function() {
    return win.innerHeight || docEl.clientHeight;
  };

  // Get the horizontal scroll offset.
  var scrollX = function() {
    return win.pageXOffset || docEl.scrollLeft;
  };

  // Get the vertical scroll offset.
  var scrollY = function() {
    return win.pageYOffset || docEl.scrollTop;
  };

  // Get elements by className.
  var byClass = function(cls, el) {
    el = el || doc;
    if (el.getElementsByClassName) {
      return el.getElementsByClassName(cls);
    } else {
      var ret = [];
      var re = new RegExp('^|\\s+' + cls + '\\s+|$');
      var tags = el.getElementsByTagName('*');

      for (var i = 0, len = tags.length; i < len; i++) {
        if (re.test(tags[i].className)) {
          ret.push(tags[i]);
        }
      }
      
      return ret;
    }
  };

  // Cross-brower bind event.
  var bind = function(el, type, listener) {
    if (el.addEventListener) {
      el.addEventListener(type, listener, false);
    } else {
      el.attachEvent('on' + type, listener);
    }
  };

  // Popup constructor.
  function Popup(el, opts) {
    if (!(this instanceof Popup)) {
      return new Popup(el, opts);
    }
    this.opts = extend({}, extend(defaults, opts));
    this.el = el;
    this.init();
  }

  // Instance methods.
  extend(Popup.prototype, {

    // Initialize the element's dimension.
    init: function() {
      var opts = this.opts;

      extend(this.el.style, {
        position: 'absolute',
        width: opts.width + 'px',
        height: opts.height + 'px',
        zIndex: opts.zIndex
      });

      this.bindEvent();
    },

    // Bind click events to close button.
    // Press ESC key to close popup.
    bindEvent: function() {
      var closeBtn = byClass(this.opts.closeBtnClass)[0];
      var self = this;

      bind(closeBtn, 'click', function() {
        self.close();
      });
      
      bind(doc, 'keydown', function(e) {
        e = e || window.event;
        var keyCode = e.which || e.keyCode;

        if (keyCode === 27) {
          self.close();
        }
      });

      // When resize the window, reset the element's position.
      bind(win, 'resize', function() {
        self.setPosition();
      });
    },

    // Show the popup element.
    open: function() {
      this.el.style.display = 'block';
      this.setPosition();
    },

    // Hide the popup element.
    close: function() {
      this.el.style.display = 'none';
    },

    // Make the popup element be centered.
    setPosition: function() {
      var opts = this.opts;

      var top = scrollY() + Math.max(0, (winH() - opts.height) / 2);
      var left = scrollX() + Math.max(0, (winW() - opts.width) / 2);

      extend(this.el.style, {
        top: top + opts.offsetY + 'px',
        left: left + opts.offsetX + 'px'
      });
    }

  });

  if (global) {
    // Expose it as a method on global object.
    global.Popup = Popup;
  }

  return Popup;

}));