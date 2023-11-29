import { test } from '@playwright/test';
import { injectEarlyErrors, triggerError, expectMessages } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.addScriptTag({ url: 'inject.js' });
});

test('onerror', async ({ page }) => {
  await injectEarlyErrors(page);
  await triggerError(page, 'foo');
  await triggerError(page, 'bar');
  await page.evaluate(() => {
    window.onerror = (event, source, lineno, colno, error) => {
      messages.push({ event, source, lineno, colno, error: error.message });
    };
  });
  await triggerError(page, 'baz');

  const isChrome = test.info().project.name === 'chromium';
  const isWebkit = test.info().project.name === 'webkit';
  const lineno = 6;
  const colno = isWebkit ? 31 : 13;
  await expectMessages(page, [
    {
      event: isChrome ? 'Uncaught Error: foo' : 'Error: foo',
      source: 'http://localhost:8080/inject.js',
      lineno,
      colno,
      error: 'foo',
    },
    {
      event: isChrome ? 'Uncaught Error: bar' : 'Error: bar',
      source: 'http://localhost:8080/inject.js',
      lineno,
      colno,
      error: 'bar',
    },
    {
      event: isChrome ? 'Uncaught Error: baz' : 'Error: baz',
      source: 'http://localhost:8080/inject.js',
      lineno,
      colno,
      error: 'baz',
    },
  ]);
});

test('addEventListener error', async ({ page }) => {
  await injectEarlyErrors(page);
  await triggerError(page, 'foo');
  await triggerError(page, 'bar');
  await page.evaluate(() => {
    window.addEventListener('error', (event) => messages.push(event.error.message));
  });
  await triggerError(page, 'baz');
  await expectMessages(page, ['foo', 'bar', 'baz']);
});
