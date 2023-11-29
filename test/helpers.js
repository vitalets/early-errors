import { expect } from '@playwright/test';

export async function injectEarlyErrors(page, cfg) {
  const path = process.env.MINIFIED ? './src/index.min.js' : './src/index.js';
  await page.addScriptTag({ path });
}

export async function triggerError(page, message) {
  await page.evaluate((message) => window.triggerError(message), message);
}

export async function triggerRejection(page, message) {
  await page.evaluate((message) => window.triggerRejection(message), message);
}

export async function expectMessages(page, messages) {
  const actual = await page.evaluate(() => window.messages);
  expect(actual).toEqual(messages);
}
