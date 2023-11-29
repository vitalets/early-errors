((win, cfg) => {
  // avoid second execution
  if (win.__earlyerrors__) return;
  win.__earlyerrors__ = true;

  cfg = Object.assign({ max: 50 }, cfg);

  var flushErrors = listen('error');
  var flushRejections = listen('unhandledrejection');

  var addEventListenerOrig = win.addEventListener;
  win.addEventListener = (type, handler, options) => {
    if (type === 'error') flushErrors(handler);
    if (type === 'unhandledrejection') flushRejections(handler);
    return addEventListenerOrig.call(win, type, handler, options);
  };

  function listen(eventName) {
    var queue = [];
    var flushed = false;
    var propHandler;

    // listen for events
    win.addEventListener(eventName, (event) => {
      if (!flushed && queue.length < cfg.max) queue.push(event);
    });

    // overwrite window.onerror / window.onunhandledrejection to hook on setter
    var propName = 'on' + eventName;
    win[propName] = function () {
      if (propHandler) return propHandler.apply(win, arguments);
    };
    Object.defineProperty(win, propName, {
      get: () => propHandler,
      set: (fn) => {
        propHandler = fn;
        flush(fn);
      },
    });

    // flush all queued errors
    function flush(handler) {
      flushed = true;
      while (queue.length) {
        try {
          var e = queue.shift();
          // for window.onerror pass 5 arguments
          if (eventName === 'error' && handler === propHandler) {
            handler(e.message, e.filename, e.lineno, e.colno, e.error);
          } else {
            handler(e);
          }
        } catch (oops) {
          console.error(oops);
        }
      }
    }

    return flush;
  }
})(window);
