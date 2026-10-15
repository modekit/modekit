import { expect, test } from '@playwright/test'

test('visual states remain stable in the light color scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.locator('#visual-gallery')).toHaveScreenshot('visual-states-light.png')
})

test('visual states remain stable in the dark color scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('html').evaluate((element) => {
    element.classList.add('dark')
  })

  await expect(page.locator('#visual-gallery')).toHaveScreenshot('visual-states-dark.png')
})

test('open Sheet remains stable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open sheet' }).click()

  await expect(page).toHaveScreenshot('sheet-open-reduced-motion.png')
})
