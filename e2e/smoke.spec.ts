import { expect, test, type Page } from '@playwright/test'

const loginEmail = process.env.E2E_LOGIN_EMAIL
const loginPassword = process.env.E2E_LOGIN_PASSWORD
const listingText =
  process.env.E2E_LISTING_TEXT ??
  'Apple iPhone 14 Pro 256GB, excellent condition, includes box and charger.'

const missingLoginEnv = !loginEmail || !loginPassword

async function login(page: Page) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(loginEmail ?? '')
  await page.getByLabel('Password').fill(loginPassword ?? '')
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveURL(/\/app(?:\/)?$/)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
}

test.describe('Smoke', () => {
  test('login flow', async ({ page }) => {
    test.skip(
      missingLoginEnv,
      'Set E2E_LOGIN_EMAIL and E2E_LOGIN_PASSWORD to run smoke login test.',
    )

    await login(page)
  })

  test('generate, save, and view listing', async ({ page }) => {
    test.skip(
      missingLoginEnv,
      'Set E2E_LOGIN_EMAIL and E2E_LOGIN_PASSWORD to run listing smoke test.',
    )

    await login(page)

    await page.getByRole('button', { name: 'Text' }).click()
    await page.getByLabel('Product details').fill(listingText)
    await page.getByRole('button', { name: 'Generate listing' }).click()

    await expect(page.getByRole('heading', { name: 'Listing preview' })).toBeVisible({
      timeout: 90_000,
    })

    await page.getByRole('button', { name: 'Save listing' }).click()
    await expect(page.getByText('Listing saved')).toBeVisible({ timeout: 30_000 })

    const openListingLink = page.getByRole('link', { name: 'Open listing' }).first()
    await expect(openListingLink).toBeVisible({ timeout: 30_000 })
    await openListingLink.click()

    await expect(page).toHaveURL(/\/app\/listings\/[^/]+$/)
    await expect(page.getByRole('heading', { name: 'Listing details' })).toBeVisible()
  })
})
