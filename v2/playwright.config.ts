import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    // NEXT_PUBLIC_BASE_PATH="" força basePath vazio mesmo dentro do CI (onde
    // GITHUB_ACTIONS=true faria o build normal usar "/tech-learn/v2") — o e2e
    // testa o app em si, não o prefixo de deploy (isso já foi validado à parte).
    command: 'NEXT_PUBLIC_BASE_PATH="" npm run build && npx serve out -l 4173',
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
