import { test, expect } from '@playwright/test';
import { injectEarlyErrors, triggerError } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.addScriptTag({ url: 'inject.js' });
});

test('onerror', async ({ page }) => {
  await injectEarlyErrors(page);
  await triggerError(page, 'foo');
  await triggerError(page, 'bar');
  const messages = await page.evaluate(() => {
    const messages = [];
    window.onerror = (event, source, lineno, colno, error) =>
      messages.push({ event, source, lineno, colno, error: error.message });
    return messages;
  });
  const isChrome = test.info().project.name === 'chromium';
  const isWebkit = test.info().project.name === 'webkit';
  expect(messages).toEqual([
    {
      event: isChrome ? 'Uncaught Error: foo' : 'Error: foo',
      source: 'http://localhost:8080/inject.js',
      lineno: 4,
      colno: isWebkit ? 31 : 13,
      error: 'foo',
    },
    {
      event: isChrome ? 'Uncaught Error: bar' : 'Error: bar',
      source: 'http://localhost:8080/inject.js',
      lineno: 4,
      colno: isWebkit ? 31 : 13,
      error: 'bar',
    },
  ]);
});

test('addEventListener error', async ({ page }) => {
  await injectEarlyErrors(page);
  await triggerError(page, 'foo');
  await triggerError(page, 'bar');
  const messages = await page.evaluate(() => {
    const messages = [];
    window.addEventListener('error', (event) => messages.push(event.error.message));
    return messages;
  });
  expect(messages).toEqual(['foo', 'bar']);
});
