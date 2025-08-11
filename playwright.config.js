import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0, // Sin retries para acelerar
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  timeout: 30000, // Aumentar timeout global a 30 segundos
  expect: {
    timeout: 10000, // Timeout para expectaciones más razonable
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'off', // Desactivar trace para mejorar rendimiento
    screenshot: 'only-on-failure',
    video: 'off', // Desactivar video para mejorar rendimiento
    actionTimeout: 10000, // Timeout para acciones más razonable
    navigationTimeout: 15000, // Timeout para navegación más razonable
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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60000, // Aumentar timeout del servidor a 60 segundos
  },
}) 