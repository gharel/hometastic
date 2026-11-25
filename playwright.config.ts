import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT_E2E ?? 4183);
const ADRESSE = `http://localhost:${PORT}/nid/`;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: ADRESSE, trace: 'retain-on-failure', locale: 'fr-FR' },
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: ADRESSE,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'telephone',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
    { name: 'bureau', use: { ...devices['Desktop Chrome'] }, testMatch: /ecrans/ },
  ],
});
