import { defineConfig, devices } from '@playwright/test'

const browserPort = '4174'

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 2 } : {}),
  reporter: process.env.CI ? 'line' : 'list',
  outputDir: '../../test-results/modekit-browser',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL: `http://127.0.0.1:${browserPort}`,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `pnpm exec vite --config tests/browser/fixture/vite.config.ts --host 127.0.0.1 --port ${browserPort}`,
    url: `http://127.0.0.1:${browserPort}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
