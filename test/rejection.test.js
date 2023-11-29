import { test, expect } from '@playwright/test';
import { injectEarlyErrors, triggerRejection } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.addScriptTag({ url: 'inject.js' });
});

test('onunhandledrejection', async ({ page }) => {
  await injectEarlyErrors(page);
  await triggerRejection(page, 'foo');
  await triggerRejection(page, 'bar');
  const messages = await page.evaluate(() => {
    const messages = [];
    window.onunhandledrejection = (event) => messages.push(event.reason.message);
    return messages;
  });
  expect(messages).toEqual(['foo', 'bar']);
});

test('addEventListener unhandledrejection', async ({ page }) => {
  await injectEarlyErrors(page);
  await triggerRejection(page, 'foo');
  await triggerRejection(page, 'bar');
  const messages = await page.evaluate(() => {
    const messages = [];
    window.addEventListener('unhandledrejection', (event) => messages.push(event.reason.message));
    return messages;
  });
  expect(messages).toEqual(['foo', 'bar']);
});
