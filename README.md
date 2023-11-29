# early-errors

A tiny script for capturing **unhandled errors** and **rejections** from the starting point of webapp. 

## Description

Most of the errors occur on a web page during initialization. Browser needs to load and evaluate all the JavaScript bundles, fetch data from API and build the UI. The problem is that you may attach [`window.onerror`](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event) handler too late and miss the errors.

**Early-errors** script solves that problem. When inlined into the html before any other scripts, it collects all unhandled errors and rejections until you attach the error handler. When handler is attached, it receives all the queued items and then works as usual. No special API needed, you just use existing browser API `window.onerror` or `window.addEventListener('error', ...)`.

## Usage
Inline the following code before any scripts in your html file:
```html
<script>
/* early-errors v0.1.0 */
(function(r,a){if(r.__earlyerrors__)return;r.__earlyerrors__=!0,a=Object.assign({max:50},a);var c=i("error"),d=i("unhandledrejection"),v=r.addEventListener;r.addEventListener=function(t,e,u){return t==="error"&&c(e),t==="unhandledrejection"&&d(e),v.call(r,t,e,u)};function i(t){var e=[],u=!1,s;r.addEventListener(t,function(n){!u&&e.length<a.max&&e.push(n)});var f="on"+t;r[f]=function(){if(s)return s.apply(r,arguments)},Object.defineProperty(r,f,{get:function(){return s},set:function(n){s=n,l(n)}});function l(n){for(u=!0;e.length;)try{var o=e.shift();t==="error"&&n===s?n(o.message,o.filename,o.lineno,o.colno,o.error):n(o)}catch(h){console.error(h)}}return l}})(window);
</script>
```

