import { defineConfig, devices } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

function loadDotEnv(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    if (separatorIndex <= 0) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()
    if (!key || process.env[key] !== undefined) {
      continue
    }

    process.env[key] = value
  }
}

loadDotEnv(path.resolve(process.cwd(), '.env'))

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:4173'
const shouldStartServer = process.env.E2E_USE_EXISTING_SERVER !== 'true'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: shouldStartServer
    ? {
        command: 'npm run dev -- --host 127.0.0.1 --port 4173',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : undefined,
})
