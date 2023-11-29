# early-errors

A tiny script for capturing **unhandled errors** and **rejections** from the very beginning of a web app initialization. 

## Description

Most of the errors occur on a web page during the initialization. Browser needs to load and evaluate all the JavaScript bundles, fetch data from API and build the UI. The problem is that you may attach [`window.onerror`](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event) handler too late and miss the errors. Or even don't attach that handler at all because of syntax errors in your bundle.

Now **early-errors** comes into play. When inlined into the html before any other scripts, it collects all futher errors and rejections. Once error handler is attached, early-errors passes all the queued items to the handler. No special API needed, you just use `window.onerror` or `window.addEventListener('error', ...)` in a regular way. Compatible with any analytics solution, e.g. Sentry, Datadog, AppInsights.

## Usage
Inline the following code before any scripts in your html file:
```html
<script>

</script>
```

