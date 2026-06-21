/*!
 * jQuery throttle / debounce - v2.0 (modernized drop-in replacement)
 * Originally: jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 * Original Copyright (c) 2010 "Cowboy" Ben Alman, MIT/GPL licensed.
 *
 * This file is a modern, dependency-free reimplementation that preserves
 * the exact same public API ($.throttle / $.debounce, or Cowboy.throttle /
 * Cowboy.debounce if jQuery is not present), so existing calling code does
 * not need to change. Internals were rewritten using plain ES2015+ JS —
 * no reliance on jQuery internals (the original never used any either).
 *
 * Usage (unchanged from the original plugin):
 *
 *   var throttled = jQuery.throttle( delay, [ no_trailing, ] callback );
 *   jQuery('selector').on( 'someevent', throttled );
 *
 *   var debounced = jQuery.debounce( delay, [ at_begin, ] callback );
 *   jQuery('selector').on( 'someevent', debounced );
 *
 * If jQuery isn't loaded, the same methods are exposed under `Cowboy`:
 *
 *   var throttled = Cowboy.throttle( delay, callback );
 */

(function (window) {
  'use strict';

  // Use jQuery as the namespace if present, otherwise fall back to the
  // `Cowboy` namespace (creating it if necessary), exactly like the
  // original plugin did.
  var $ = window.jQuery || window.Cowboy || (window.Cowboy = {});

  /**
   * jQuery.throttle( delay, [ no_trailing, ] callback )
   *
   * Throttle execution of `callback`. Useful for rate-limiting handlers on
   * events like `resize` or `scroll`.
   *
   * @param {number} delay - Milliseconds to throttle invocations to.
   * @param {boolean} [no_trailing=false] - If true, callback fires only on
   *   the leading edge of each `delay`-ms window (no extra trailing call).
   * @param {Function} callback - Function to throttle.
   * @returns {Function} The throttled function.
   */
  function throttle(delay, no_trailing, callback) {
    // Support the original signature shuffle: throttle(delay, callback)
    if (typeof no_trailing !== 'boolean') {
      callback = no_trailing;
      no_trailing = false;
    }

    var lastExec = 0;
    var timer = null;

    function wrapper() {
      var context = this;
      var args = arguments;
      var elapsed = Date.now() - lastExec;

      function exec() {
        lastExec = Date.now();
        callback.apply(context, args);
      }

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      if (elapsed > delay) {
        exec();
      } else if (!no_trailing) {
        timer = setTimeout(exec, delay - elapsed);
      }
    }

    // Preserve the guid bookkeeping the original used so jQuery's
    // .off()/.unbind() can still find the wrapper via the original callback.
    if ($.guid) {
      wrapper.guid = callback.guid = callback.guid || $.guid++;
    }

    return wrapper;
  }

  /**
   * jQuery.debounce( delay, [ at_begin, ] callback )
   *
   * Debounce execution of `callback` so it only runs once per burst of
   * calls — either at the start of the burst (`at_begin: true`) or after
   * the burst settles (default).
   *
   * @param {number} delay - Milliseconds of quiet time required.
   * @param {boolean} [at_begin=false] - Fire on the leading edge instead
   *   of the trailing edge.
   * @param {Function} callback - Function to debounce.
   * @returns {Function} The debounced function.
   */
  function debounce(delay, at_begin, callback) {
    if (callback === undefined) {
      callback = at_begin;
      at_begin = false;
    }

    var timer = null;

    function wrapper() {
      var context = this;
      var args = arguments;

      if (at_begin && !timer) {
        callback.apply(context, args);
      }

      clearTimeout(timer);

      timer = setTimeout(function () {
        timer = null;
        if (!at_begin) {
          callback.apply(context, args);
        }
      }, delay);
    }

    if ($.guid) {
      wrapper.guid = callback.guid = callback.guid || $.guid++;
    }

    return wrapper;
  }

  $.throttle = throttle;
  $.debounce = debounce;

})(this);