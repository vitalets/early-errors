import { test } from '@playwright/test';
import { injectEarlyErrors, triggerRejection, expectMessages } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.addScriptTag({ url: 'inject.js' });
});

test('onunhandledrejection', async ({ page }) => {
  await injectEarlyErrors(page);
  await triggerRejection(page, 'foo');
  await triggerRejection(page, 'bar');
  await page.evaluate(() => {
    window.onunhandledrejection = (event) => messages.push(event.reason.message);
  });
  await triggerRejection(page, 'baz');
  await expectMessages(page, ['foo', 'bar', 'baz']);
});

test('addEventListener unhandledrejection', async ({ page }) => {
  await injectEarlyErrors(page);
  await triggerRejection(page, 'foo');
  await triggerRejection(page, 'bar');
  await page.evaluate(() => {
    window.addEventListener('unhandledrejection', (event) => messages.push(event.reason.message));
  });
  await triggerRejection(page, 'baz');
  await expectMessages(page, ['foo', 'bar', 'baz']);
});
