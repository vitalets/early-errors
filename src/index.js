(function (win, cfg) {
  // handle second execution
  if (win.__earlyerrors__) return;
  win.__earlyerrors__ = true;

  cfg = Object.assign({ max: 50 }, cfg);

  var errors = [];
  var errorsFlushed = false;
  var onerror;

  var rejections = [];
  var rejectionFlushed = false;
  var onunhandledrejection;

  listenErrors();
  instrumentAddEventListener();
  instrumentOnError();
  instrumentOnUnhandledRejection();

  function listenErrors() {
    win.addEventListener('error', function (event) {
      if (!errorsFlushed && errors.length < cfg.max) errors.push(event);
    });
    win.addEventListener('unhandledrejection', function (event) {
      if (!rejectionFlushed && rejections.length < cfg.max) rejections.push(event);
    });
  }

  function instrumentAddEventListener() {
    var addEventListenerOrig = win.addEventListener;
    win.addEventListener = function (type, handler, options) {
      if (type === 'error') flushErrors(handler);
      if (type === 'unhandledrejection') flushRejections(handler);
      return addEventListenerOrig.call(win, type, handler, options);
    };
  }

  function instrumentOnError() {
    win.onerror = function () {
      if (onerror) return onerror.apply(win, arguments);
    };
    Object.defineProperty(win, 'onerror', {
      get: function () {
        return onerror;
      },
      set: function (fn) {
        onerror = fn;
        flushErrors();
      },
    });
  }

  function instrumentOnUnhandledRejection() {
    win.onunhandledrejection = function () {
      if (onunhandledrejection) onunhandledrejection.apply(win, arguments);
    };
    Object.defineProperty(win, 'onunhandledrejection', {
      get: function () {
        return onunhandledrejection;
      },
      set: function (fn) {
        onunhandledrejection = fn;
        flushRejections();
      },
    });
  }

  function flushErrors(handler) {
    errorsFlushed = true;
    while (errors.length) {
      var e = errors.shift();
      // try catch
      if (onerror) onerror(e.message, e.filename, e.lineno, e.colno, e.error);
      if (handler) handler(e);
    }
  }

  function flushRejections(handler) {
    rejectionFlushed = true;
    while (rejections.length) {
      var e = rejections.shift();
      // try catch
      if (onunhandledrejection) onunhandledrejection(e);
      if (handler) handler(e);
    }
  }
})(window);
