import { defineConfig, devices } from '@playwright/test';

const PORT = 8080;

export default defineConfig({
  testDir: 'test',
  fullyParallel: true,
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    // see: https://github.com/http-party/http-server/issues/537
    command: 'NODE_NO_WARNINGS=1 npx http-server -c-1 test',
    port: PORT,
  },
});
