/*jshint browser:true */
/*!
* FitVids 1.2 (modernized)
*
* Originally: FitVids 1.1 — Copyright 2013, Chris Coyier (css-tricks.com)
* and Dave Rupert (daverupert.com). Credit to Thierry Koblentz for the
* original Intrinsic Ratio technique.
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* This version modernizes the original plugin:
*  - Uses the native CSS `aspect-ratio` property instead of the old
*    padding-top percentage hack (with the padding-top hack kept as an
*    automatic fallback for any browser that doesn't support
*    `aspect-ratio`, which is effectively none in 2026, but it's free
*    insurance).
*  - Compatible with jQuery 3.x and jQuery 4.x (no use of any APIs
*    removed in jQuery 4.0, e.g. no $.isArray/$.now/deprecated internals).
*  - Still works with Zepto, same as before.
*  - Public API (`$.fn.fitVids(options)`, `customSelector`, `ignore`) is
*    unchanged, so this is a drop-in replacement for existing code.
*/

;(function( $ ){

  'use strict';

  // Detect native aspect-ratio support once.
  var supportsAspectRatio = typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('aspect-ratio: 1 / 1');

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if (!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}' +
        '.fluid-width-video-wrapper iframe,' +
        '.fluid-width-video-wrapper object,' +
        '.fluid-width-video-wrapper embed{position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if (options) {
      $.extend(settings, options);
    }

    return this.each(function () {
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if (settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function (count) {
        var $this = $(this);

        if ($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (
          (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length) ||
          $this.parent('.fluid-width-video-wrapper').length
        ) {
          return;
        }

        var hasWidthOrHeight = $this.css('height') || $this.css('width');
        var widthAttr = parseInt($this.attr('width'), 10);
        var heightAttr = parseInt($this.attr('height'), 10);

        if (!hasWidthOrHeight && (isNaN(heightAttr) || isNaN(widthAttr))) {
          $this.attr('height', 9);
          $this.attr('width', 16);
          heightAttr = 9;
          widthAttr = 16;
        }

        var height = (this.tagName.toLowerCase() === 'object' || !isNaN(heightAttr))
          ? (isNaN(heightAttr) ? $this.height() : heightAttr)
          : $this.height();
        var width = !isNaN(widthAttr) ? widthAttr : $this.width();

        if (!width || !height) {
          // Can't compute a sane ratio — leave the element untouched
          // rather than wrapping it with a broken/zero aspect ratio.
          return;
        }

        if (!$this.attr('id')) {
          $this.attr('id', 'fitvid' + count);
        }

        var $wrapper = $this
          .wrap('<div class="fluid-width-video-wrapper"></div>')
          .parent('.fluid-width-video-wrapper');

        if (supportsAspectRatio) {
          $wrapper.css('aspect-ratio', width + ' / ' + height);
        } else {
          // Fallback for any environment without aspect-ratio support.
          $wrapper.css('padding-top', ((height / width) * 100) + '%');
        }

        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );