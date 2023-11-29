export async function injectEarlyErrors(page, cfg) {
  await page.addScriptTag({ path: './src/index.js' });
}

export async function triggerError(page, message) {
  await page.evaluate((message) => window.triggerError(message), message);
}

export async function triggerRejection(page, message) {
  await page.evaluate((message) => window.triggerRejection(message), message);
}
