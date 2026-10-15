import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

async function expectNoAutomaticViolations(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
  ])
  if (include) builder = builder.include(include)

  const results = await builder.analyze()

  expect(results.violations).toEqual([])
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('idle fixture has no detected WCAG A or AA violations', async ({ page }) => {
  await expectNoAutomaticViolations(page)
})

test('open modal surfaces have no detected WCAG A or AA violations', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dialog' }).click()
  await expect(page.getByRole('dialog', { name: 'Edit project' })).toBeVisible()
  await expectNoAutomaticViolations(page)

  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Open sheet' }).click()
  await expect(page.getByRole('dialog', { name: 'Project settings' })).toBeVisible()
  await expectNoAutomaticViolations(page)
})

test('open listbox, menu, and tooltip have no detected WCAG A or AA violations', async ({
  page,
}) => {
  await page.getByRole('combobox', { name: 'Project status' }).click()
  await expect(page.getByRole('listbox')).toBeVisible()
  await expectNoAutomaticViolations(page, '[role="listbox"]')

  await page.reload()

  await page.getByRole('button', { name: 'Project actions' }).click()
  await expect(page.getByRole('menu')).toBeVisible()
  await expectNoAutomaticViolations(page, '[role="menu"]')

  await page.reload()
  await page.getByRole('button', { name: 'Project help' }).focus()
  await expect(page.getByRole('tooltip')).toBeVisible()
  await expectNoAutomaticViolations(page)
})
