/*
 * jQuery Loader plugin 3.00
 *
 * Copyright (c) 2011-2018 Foswiki Contributors http://foswiki.org
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
"use strict";
jQuery(function($) {

  // global defaults
  var defaults = {
    mode: 'auto', // auto, manual
    placeholder: "<img src='"+foswiki.getPreference("PUBURLPATH")+"/System/JQueryPlugin/images/spinner.gif' width='16' height='16' />",
    url: undefined,
    params: undefined,
    topic: undefined,
    section: undefined,
    skin: 'text',
    select: undefined,
    minHeight: 0,
    hideEffect: 'fadeOut', 
    showEffect: 'fadeIn', 
    reloadAfter: 0,
    delay: 0,
    onload: function() {},
    finished: function() {},
    beforeload: function() {}
  };

  // constructor
  function JQLoader(elem, options) {
    var self = this;

    self.element = elem;
    self.options = $.extend({}, defaults, options);

    self.init();

    if (self.options.mode === 'auto') {
      if (self.options.delay) {
        // delayed loading 
        window.setTimeout(function() {
          self.load();
        }, self.options.delay);
      } else {
        // immediate loading
        self.load();
      }
    }
  }

  // init method
  JQLoader.prototype.init = function() {
    var self = this,
        $elem = $(self.element);

    // add refresh listener
    $elem.on("refresh.jqloader", function(e, opts) {
      $.extend(self.options, opts);
      if (self.options.delay) {
        window.setTimeout(function() {
          self.load();
        }, self.options.delay);
      } else  {
        self.load();
      }
    });

    // add onload listener 
    if (typeof(self.options.onload) === 'function') {
      $elem.bind("onload.jqloader", function() {
        self.options.onload.call(self);
      });
    }
    
    // add beforeload listener 
    if (typeof(self.options.beforeload) === 'function') {
      $elem.bind("beforeload.jqloader", function() {
        self.options.beforeload.call(self);
      });
    }
    
    // add finished listener 
    if (typeof(self.options.finished) === 'function') {
      $elem.bind("finished.jqLoader", function() {
        self.options.finished.call(self);
      });
    }

    // add auto-reloader
    if (self.options.reloadAfter) {
      $elem.bind("finished.jqLoader", function() {
        window.setTimeout(function() {
            self.load();
          }, self.options.reloadAfter
        );
      });
    }

    self.prepareContainer();
  };

  // prepares the container
  JQLoader.prototype.prepareContainer = function() {
    var self = this,
        $elem = $(self.element),
        $placeholder;


    if (typeof(self.options.placeholder) !== 'undefined' && self.options.placeholder !== '') {
      $placeholder = $(decodeURI(self.options.placeholder)).hide();
      $placeholder.insertBefore($elem);

      // listen to beforeload event to show the placeholder
      $elem.bind("beforeload.jqloader", function() {
        $placeholder.show();
      });

      // listen to onload event to hide the placeholder
      $elem.bind("onload.jqloader", function() {
        $placeholder.hide();
      });

      // add clickhandler to placeholder when not in auto mode
      if (self.options.mode !== 'auto') {
        $placeholder.click(function() {
          $elem.trigger("refresh.jqloader", self);
        });
      }
    } 
  };

  // load method
  JQLoader.prototype.load = function() {
    var self = this,
        $elem = $(self.element),
        web = self.options.web || foswiki.getPreference("WEB"),
        topic = self.options.topic || foswiki.getPreference("TOPIC"),
        params = $.extend({}, self.options.params);

    // construct url
    if (typeof(self.options.url) === 'undefined') {
      self.options.url = foswiki.getScriptUrl("view", web, topic);
    }

    if (typeof(self.options.section) !== 'undefined') {
      params.section = self.options.section;
    }

    if (typeof(self.options.skin) !== 'undefined' && self.options.skin) {
      params.skin = self.options.skin;
    }

    // trigger beforeload
    $elem.trigger("beforeload.jqloader", self);

    if (self.options.url) {

      if (typeof(self.container) === 'undefined') {
        self.container = $("<div class='jqLoaderContainer' />").insertAfter($elem);

        // apply min height
        if (self.options.minHeight) {
          self.container.css("min-height", self.options.minHeight);
          $(window).trigger("resize");
        }
      }

      var doit = function() {
        $.get(
          self.options.url,
          params,
          function(data) {
            if (typeof(self.options.select) !== 'undefined') {
              data = $(data).find(self.options.select);
            }

            self.container.remove();
            self.container = $("<div class='jqLoaderContainer' />").insertAfter($elem);

            // apply min height
            if (self.options.minHeight) {
              self.container.css("min-height", self.options.minHeight);
              $(window).trigger("resize");
            }

            // insert data
            self.container.append(data);

            $elem.trigger("onload.jqloader", self);

            // show effect
            var effect = self.options.effect || self.options.showEffect;
            if (typeof(effect) !== 'undefined') {
              self.container.animateCSS({
                effect: effect
              }).on("stop.animate", function() {
                $elem.trigger("finished.jqLoader", self);
              });
            } else {
              // trigger finished
              $elem.trigger("finished.jqLoader", self);
            }

          }, 'html');
      };

      // hide effect
      if (typeof(self.options.hideEffect) !== 'undefined') {
        self.container.animateCSS({
          effect: self.options.hideEffect
        })/*.on("stop.animate", function() {
          self.container.css("visibility", "hidden");
          doit();
        })*/;
        doit();
      } else {
        doit();
      }

    } else {
      throw("error: no url");
    }
  };

  // register plugin to jquery core
  $.fn.jqLoader = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_jqLoader')) {
        $.data(this, 'plugin_jqLoader',
          new JQLoader(this, options)
        );
      }
    });
  };

  // register css class 
  $(".jqLoader:not(.jqLoaderInited)").livequery(function() {
    var $this = $(this),
        opts = $.extend({}, $this.data(), $this.metadata());
    $this.addClass("jqLoaderInited").jqLoader(opts);
  });
});
