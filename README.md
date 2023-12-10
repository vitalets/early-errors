# early-errors
[![npm version](https://img.shields.io/npm/v/early-errors)](https://www.npmjs.com/package/early-errors)
[![license](https://img.shields.io/npm/l/early-errors)](https://github.com/vitalets/early-errors/blob/main/LICENSE)

A tiny script to catch webpage errors earlier.

## The problem
Most of the errors occur on a webpage during the initial load. Browser needs to perform a lot of operations that can be broken: 
  - fetch and evaluate JavaScript bundles
  - request data from API
  - modify data due to business logic
  - build the UI

If you attach [error event listener](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event) too late - you may miss these errors and never know that your users have troubles. Especially on mobile devices with slow Internet.

## A solution
Inline a tiny script at the top of a webpage to start collecting errors as early as possible. Once main code is loaded and error handler is attached, flush queued errors to that handler and get out of the game.

## Usage
Inline the following script before any other scripts in your html file:
```html
<script>
/* early-errors v0.1.0 */
(function(r,a){if(r.__earlyerrors__)return;r.__earlyerrors__=!0,a=Object.assign({max:50},a);var c=i("error"),d=i("unhandledrejection"),v=r.addEventListener;r.addEventListener=function(t,e,u){return t==="error"&&c(e),t==="unhandledrejection"&&d(e),v.call(r,t,e,u)};function i(t){var e=[],u=!1,s;r.addEventListener(t,function(n){!u&&e.length<a.max&&e.push(n)});var f="on"+t;r[f]=function(){if(s)return s.apply(r,arguments)},Object.defineProperty(r,f,{get:function(){return s},set:function(n){s=n,l(n)}});function l(n){for(u=!0;e.length;)try{var o=e.shift();t==="error"&&n===s?n(o.message,o.filename,o.lineno,o.colno,o.error):n(o)}catch(h){console.error(h)}}return l}})(window);
</script>
```

Attach errors handler in the main bundle using standard events:

* [`error`](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event)
* [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)

For example:
```js
window.addEventListener('error', event => console.log(event.error));
window.addEventListener('unhandledrejection', event => console.log(event.reason));
``` 

Once you attach a handler, all queued events are flushed to it. Subsequent events come as usual.

## Handled errors
tbd

## Compatibility
Early-errors is compatible with any error-reporting SDK like [Sentry](https://sentry.io), [Datadog](https://www.datadoghq.com/), [Rollbar](https://docs.rollbar.com/docs/browser-js), [AppInsights](https://github.com/microsoft/ApplicationInsights-JS), etc.