import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Dialog manages naming, focus, nested overlays, Escape, and focus restoration', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Open dialog' })
  await trigger.click()

  const dialog = page.getByRole('dialog', { name: 'Edit project' })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAccessibleDescription('Update the project details.')
  await expect(page.locator('#dialog-name')).toBeFocused()

  await page.getByRole('button', { name: 'More actions' }).click()
  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Duplicate project' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(dialog).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('Sheet traps focus while open and releases the page after closing', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open sheet' })
  const outside = page.locator('#outside-action')
  await trigger.click()

  const sheet = page.getByRole('dialog', { name: 'Project settings' })
  await expect(sheet).toBeVisible()
  await expect(sheet).toHaveAccessibleDescription('Adjust the active project.')
  await expect(page.locator('#sheet-name')).toBeFocused()
  await expect(page.locator('#app')).toHaveAttribute('aria-hidden', 'true')

  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(page.locator('#app')).not.toHaveAttribute('aria-hidden', 'true')
  await expect
    .poll(() => page.locator('body').evaluate((body) => body.style.pointerEvents))
    .not.toBe('none')

  await outside.click()
  await expect(outside).toBeFocused()
})

test('Select supports keyboard choice and disabled state', async ({ page }) => {
  const select = page.getByRole('combobox', { name: 'Project status' })
  await select.focus()
  await page.keyboard.press('ArrowDown')
  const listbox = page.getByRole('listbox')
  await expect(listbox).toBeVisible()
  await page.keyboard.press('End')
  await expect(page.getByRole('option', { name: 'Done' })).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(page.locator('#selected-status')).toHaveText('done')
  await expect(select).toHaveText(/Done/)

  await page.reload()
  const disabled = page.getByRole('combobox', { name: 'Unavailable status' })
  await expect(disabled).toBeDisabled()
  await disabled.click({ force: true })
  await expect(page.getByRole('listbox')).toHaveCount(0)
})

test('Dropdown supports keyboard actions and restores focus', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Project actions' })
  await trigger.focus()
  await page.keyboard.press('ArrowDown')

  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Edit project' })).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(menu).toBeHidden()
  await expect(page.locator('#last-action')).toHaveText('Edit project selected')
  await expect(trigger).toBeFocused()
})

test('Tooltip describes keyboard focus, closes on Escape, and respects disabled state', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Project help' })
  await trigger.focus()

  const tooltip = page.getByRole('tooltip')
  await expect(tooltip).toHaveText('Open the project handbook')
  const tooltipId = await tooltip.getAttribute('id')
  if (!tooltipId) throw new Error('Expected Tooltip to have an id')
  await expect(trigger).toHaveAttribute('aria-describedby', tooltipId)

  await page.keyboard.press('Escape')
  await expect(tooltip).toBeHidden()

  await page.locator('#disabled-tooltip-trigger').focus()
  await expect(page.getByText('This must not open')).toHaveCount(0)
})
