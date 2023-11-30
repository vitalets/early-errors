# early-errors

A tiny script for capturing **unhandled errors** and **rejections** from the very beginning of web app load. 

## Description

Most of the errors occur on a web page during initialization. Browser needs to load and evaluate JavaScript bundles, fetch data from API and build the UI. The problem is that you may start handling errors too late and miss some of them.

On the other hand, loading error-handling code synchronously will increase page load time and degrade [web vital metrics](https://web.dev/articles/vitals#core-web-vitals). 

**Early-errors** solves that problem. When inlined into the html before any other scripts, it starts collecting  errors on the earliest stage. Once you attach error handler, it flushes all the queued errors and stops. No special API is involved, you just subscribe with `window.onerror` or `window.addEventListener('error', ...)`.

Early-errors is compatible with any error-reporting SDK like [Sentry](https://sentry.io), [Datadog](https://www.datadoghq.com/), [Rollbar](https://docs.rollbar.com/docs/browser-js), [AppInsights](https://github.com/microsoft/ApplicationInsights-JS), etc.

## Usage
Inline the following code before any other scripts in your html file:
```html
<script>
/* early-errors v0.1.0 */
(function(r,a){if(r.__earlyerrors__)return;r.__earlyerrors__=!0,a=Object.assign({max:50},a);var c=i("error"),d=i("unhandledrejection"),v=r.addEventListener;r.addEventListener=function(t,e,u){return t==="error"&&c(e),t==="unhandledrejection"&&d(e),v.call(r,t,e,u)};function i(t){var e=[],u=!1,s;r.addEventListener(t,function(n){!u&&e.length<a.max&&e.push(n)});var f="on"+t;r[f]=function(){if(s)return s.apply(r,arguments)},Object.defineProperty(r,f,{get:function(){return s},set:function(n){s=n,l(n)}});function l(n){for(u=!0;e.length;)try{var o=e.shift();t==="error"&&n===s?n(o.message,o.filename,o.lineno,o.colno,o.error):n(o)}catch(h){console.error(h)}}return l}})(window);
</script>
```
Then in your main bundle attach the error / rejection handlers:
```js
window.addEventListener('error', event => handleError(event.error));
window.addEventListener('unhandledrejection', event => handleError(event.reason));
// OR
window.onerror = (msg, file, line, col, error) => handleError(error);
window.onunhandledrejection = event => handleError(event.reason);
``` 
