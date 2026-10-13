<script setup lang="ts">
import { Check, ChevronRight, Palette } from '@lucide/vue'
import {
  modeKitNeutralColors,
  modeKitPrimaryColors,
  type ModeKitNeutralColor,
  type ModeKitPrimaryColor,
} from '@modekit/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

type ThemeMenu = 'primary' | 'neutral'
type ThemeColor = ModeKitPrimaryColor | ModeKitNeutralColor

interface ColorOption<T extends ThemeColor> {
  value: T
  label: string
  swatch?: string
}

interface ThemeChangeDetail {
  primary?: ModeKitPrimaryColor
  neutral?: ModeKitNeutralColor
}

const props = withDefaults(
  defineProps<{
    menu?: boolean
    screenMenu?: boolean
  }>(),
  {
    menu: false,
    screenMenu: false,
  },
)

function labelFor(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

function createOptions<T extends ThemeColor>(values: readonly T[]): readonly ColorOption<T>[] {
  return values.map((value) => ({
    value,
    label: labelFor(value),
    ...(value === 'black' ? {} : { swatch: `var(--mk-swatch-${value})` }),
  }))
}

const primaryOptions = createOptions(modeKitPrimaryColors)
const neutralOptions = createOptions(modeKitNeutralColors)
const primaryStorageKey = 'modekit-primary-color'
const neutralStorageKey = 'modekit-neutral-color'
const themeChangeEvent = 'modekit:theme-color-change'
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const menuElement = ref<HTMLElement>()
const open = ref(false)
const activeMenu = ref<ThemeMenu>()
const selectedPrimary = ref<ModeKitPrimaryColor>('black')
const selectedNeutral = ref<ModeKitNeutralColor>('zinc')
const id = useId()
const menuId = `modekit-theme-colors-${id}`
const primaryMenuId = `${menuId}-primary`
const neutralMenuId = `${menuId}-neutral`
const compact = computed(() => props.menu || props.screenMenu)
const selectedPrimaryOption = computed(
  () =>
    primaryOptions.find((option) => option.value === selectedPrimary.value) ?? primaryOptions[0],
)
const selectedNeutralOption = computed(
  () =>
    neutralOptions.find((option) => option.value === selectedNeutral.value) ?? neutralOptions[0],
)

function isPrimaryColor(value: string | undefined | null): value is ModeKitPrimaryColor {
  return primaryOptions.some((option) => option.value === value)
}

function isNeutralColor(value: string | undefined | null): value is ModeKitNeutralColor {
  return neutralOptions.some((option) => option.value === value)
}

function syncPrimary(color: ModeKitPrimaryColor): void {
  selectedPrimary.value = color
  document.documentElement.dataset.mkPrimary = color
}

function syncNeutral(color: ModeKitNeutralColor): void {
  selectedNeutral.value = color
  document.documentElement.dataset.mkNeutral = color
}

function finishSelection(): void {
  activeMenu.value = undefined
  open.value = false
  trigger.value?.focus()
}

function selectPrimary(color: ModeKitPrimaryColor): void {
  syncPrimary(color)
  localStorage.setItem(primaryStorageKey, color)
  window.dispatchEvent(
    new CustomEvent<ThemeChangeDetail>(themeChangeEvent, { detail: { primary: color } }),
  )
  finishSelection()
}

function selectNeutral(color: ModeKitNeutralColor): void {
  syncNeutral(color)
  localStorage.setItem(neutralStorageKey, color)
  window.dispatchEvent(
    new CustomEvent<ThemeChangeDetail>(themeChangeEvent, { detail: { neutral: color } }),
  )
  finishSelection()
}

async function openMenu(menu: ThemeMenu, focusOption = false): Promise<void> {
  activeMenu.value = menu
  if (!focusOption) return

  await nextTick()
  const submenu = menuElement.value?.querySelector<HTMLElement>(`#${menuId}-${menu}`)
  const selected = submenu?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
  const first = submenu?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')
  ;(selected ?? first)?.focus()
}

async function openAndFocus(): Promise<void> {
  open.value = true
  activeMenu.value = undefined
  await nextTick()
  menuElement.value?.querySelector<HTMLButtonElement>('[data-theme-menu]')?.focus()
}

function closeMenu(): void {
  activeMenu.value = undefined
  open.value = false
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (!root.value?.contains(event.target as Node)) closeMenu()
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !open.value) return

  if (activeMenu.value) {
    const menu = activeMenu.value
    activeMenu.value = undefined
    menuElement.value?.querySelector<HTMLButtonElement>(`[data-theme-menu="${menu}"]`)?.focus()
    return
  }

  closeMenu()
  trigger.value?.focus()
}

function moveFocus(event: KeyboardEvent, selector: string): void {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

  const items = Array.from(menuElement.value?.querySelectorAll<HTMLButtonElement>(selector) ?? [])
  if (!items.length) return

  const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement)
  const offset = event.key === 'ArrowDown' ? 1 : -1
  const nextIndex = (currentIndex + offset + items.length) % items.length

  event.preventDefault()
  items[nextIndex]?.focus()
}

function handleCategoryKeydown(event: KeyboardEvent, menu: ThemeMenu): void {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    void openMenu(menu, true)
    return
  }

  moveFocus(event, '[data-theme-menu]')
}

function handleSubmenuKeydown(event: KeyboardEvent, menu: ThemeMenu): void {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    activeMenu.value = undefined
    menuElement.value?.querySelector<HTMLButtonElement>(`[data-theme-menu="${menu}"]`)?.focus()
    return
  }

  moveFocus(event, `#${menuId}-${menu} [role="menuitemradio"]`)
}

function handleThemeChange(event: Event): void {
  const detail = (event as CustomEvent<ThemeChangeDetail>).detail
  if (isPrimaryColor(detail.primary)) syncPrimary(detail.primary)
  if (isNeutralColor(detail.neutral)) syncNeutral(detail.neutral)
}

function handleStorage(event: StorageEvent): void {
  if (event.key === primaryStorageKey && isPrimaryColor(event.newValue)) {
    syncPrimary(event.newValue)
  }
  if (event.key === neutralStorageKey && isNeutralColor(event.newValue)) {
    syncNeutral(event.newValue)
  }
}

onMounted(() => {
  const primary = document.documentElement.dataset.mkPrimary
  const neutral = document.documentElement.dataset.mkNeutral
  syncPrimary(isPrimaryColor(primary) ? primary : 'black')
  syncNeutral(isNeutralColor(neutral) ? neutral : 'zinc')
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleDocumentKeydown)
  window.addEventListener(themeChangeEvent, handleThemeChange)
  window.addEventListener('storage', handleStorage)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
  window.removeEventListener(themeChangeEvent, handleThemeChange)
  window.removeEventListener('storage', handleStorage)
})
</script>

<template>
  <div ref="root" class="primary-color-switcher" :class="{ 'is-compact': compact }">
    <button
      ref="trigger"
      class="primary-color-switcher__trigger"
      type="button"
      aria-haspopup="menu"
      :aria-controls="menuId"
      :aria-expanded="open"
      aria-label="Choose theme colors"
      title="Choose theme colors"
      @click="open ? closeMenu() : (open = true)"
      @keydown.down.prevent="openAndFocus"
    >
      <Palette :size="19" :stroke-width="1.9" aria-hidden="true" />
      <span class="primary-color-switcher__trigger-label">Theme colors</span>
    </button>

    <div
      v-if="open"
      :id="menuId"
      ref="menuElement"
      class="primary-color-switcher__menu"
      role="menu"
      aria-label="Theme colors"
    >
      <button
        class="primary-color-switcher__category"
        type="button"
        role="menuitem"
        data-theme-menu="primary"
        aria-haspopup="menu"
        :aria-controls="primaryMenuId"
        :aria-expanded="activeMenu === 'primary'"
        @click="activeMenu === 'primary' ? (activeMenu = undefined) : openMenu('primary')"
        @keydown="handleCategoryKeydown($event, 'primary')"
        @pointerenter="!compact && openMenu('primary')"
      >
        <span>Primary</span>
        <span class="primary-color-switcher__current">
          <span
            class="primary-color-switcher__swatch"
            :class="{ 'is-black': selectedPrimary === 'black' }"
            :style="{ backgroundColor: selectedPrimaryOption?.swatch }"
          />
          {{ selectedPrimaryOption?.label }}
        </span>
        <ChevronRight :size="17" aria-hidden="true" />
      </button>

      <button
        class="primary-color-switcher__category"
        type="button"
        role="menuitem"
        data-theme-menu="neutral"
        aria-haspopup="menu"
        :aria-controls="neutralMenuId"
        :aria-expanded="activeMenu === 'neutral'"
        @click="activeMenu === 'neutral' ? (activeMenu = undefined) : openMenu('neutral')"
        @keydown="handleCategoryKeydown($event, 'neutral')"
        @pointerenter="!compact && openMenu('neutral')"
      >
        <span>Neutral</span>
        <span class="primary-color-switcher__current">
          <span
            class="primary-color-switcher__swatch"
            :style="{ backgroundColor: selectedNeutralOption?.swatch }"
          />
          {{ selectedNeutralOption?.label }}
        </span>
        <ChevronRight :size="17" aria-hidden="true" />
      </button>

      <div
        v-if="activeMenu === 'primary'"
        :id="primaryMenuId"
        class="primary-color-switcher__submenu"
        role="menu"
        aria-label="Primary colors"
        @keydown="handleSubmenuKeydown($event, 'primary')"
      >
        <button
          v-for="option in primaryOptions"
          :key="option.value"
          class="primary-color-switcher__option"
          :class="{ 'is-selected': option.value === selectedPrimary }"
          type="button"
          role="menuitemradio"
          :aria-checked="option.value === selectedPrimary"
          @click="selectPrimary(option.value)"
        >
          <span
            class="primary-color-switcher__swatch"
            :class="{ 'is-black': option.value === 'black' }"
            :style="{ backgroundColor: option.swatch }"
          />
          <span>{{ option.label }}</span>
          <Check
            v-if="option.value === selectedPrimary"
            class="primary-color-switcher__check"
            :size="17"
            :stroke-width="2.25"
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        v-if="activeMenu === 'neutral'"
        :id="neutralMenuId"
        class="primary-color-switcher__submenu"
        role="menu"
        aria-label="Neutral colors"
        @keydown="handleSubmenuKeydown($event, 'neutral')"
      >
        <button
          v-for="option in neutralOptions"
          :key="option.value"
          class="primary-color-switcher__option"
          :class="{ 'is-selected': option.value === selectedNeutral }"
          type="button"
          role="menuitemradio"
          :aria-checked="option.value === selectedNeutral"
          @click="selectNeutral(option.value)"
        >
          <span
            class="primary-color-switcher__swatch"
            :style="{ backgroundColor: option.swatch }"
          />
          <span>{{ option.label }}</span>
          <Check
            v-if="option.value === selectedNeutral"
            class="primary-color-switcher__check"
            :size="17"
            :stroke-width="2.25"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.primary-color-switcher {
  --mk-swatch-slate: var(--mk-color-slate-500);
  --mk-swatch-gray: var(--mk-color-gray-500);
  --mk-swatch-zinc: var(--mk-color-zinc-500);
  --mk-swatch-stone: var(--mk-color-stone-500);
  --mk-swatch-red: var(--mk-color-red-500);
  --mk-swatch-orange: var(--mk-color-orange-500);
  --mk-swatch-amber: var(--mk-color-amber-500);
  --mk-swatch-yellow: var(--mk-color-yellow-500);
  --mk-swatch-lime: var(--mk-color-lime-500);
  --mk-swatch-green: var(--mk-color-green-500);
  --mk-swatch-emerald: var(--mk-color-emerald-500);
  --mk-swatch-teal: var(--mk-color-teal-500);
  --mk-swatch-cyan: var(--mk-color-cyan-500);
  --mk-swatch-sky: var(--mk-color-sky-500);
  --mk-swatch-blue: var(--mk-color-blue-500);
  --mk-swatch-indigo: var(--mk-color-indigo-500);
  --mk-swatch-violet: var(--mk-color-violet-500);
  --mk-swatch-purple: var(--mk-color-purple-500);
  --mk-swatch-fuchsia: var(--mk-color-fuchsia-500);
  --mk-swatch-pink: var(--mk-color-pink-500);
  --mk-swatch-rose: var(--mk-color-rose-500);
  position: relative;
  display: flex;
  align-items: center;
}

.primary-color-switcher__trigger {
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.primary-color-switcher__trigger:hover,
.primary-color-switcher__trigger[aria-expanded='true'] {
  background: var(--vp-c-bg-soft);
  color: var(--mk-primary);
}

.primary-color-switcher__trigger:focus-visible,
.primary-color-switcher__category:focus-visible,
.primary-color-switcher__option:focus-visible {
  outline: 2px solid var(--mk-primary);
  outline-offset: 2px;
}

.primary-color-switcher__trigger-label {
  display: none;
}

.primary-color-switcher__menu,
.primary-color-switcher__submenu {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.75rem;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
}

.primary-color-switcher__menu {
  position: absolute;
  z-index: 100;
  top: calc(100% + 0.625rem);
  right: 0;
  width: 15rem;
  padding: 0.375rem;
}

.primary-color-switcher__category {
  display: grid;
  width: 100%;
  min-height: 2.75rem;
  margin: 0;
  padding: 0.5rem 0.625rem;
  grid-template-columns: 1fr auto 1rem;
  gap: 0.625rem;
  align-items: center;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.primary-color-switcher__category:hover,
.primary-color-switcher__category[aria-expanded='true'],
.primary-color-switcher__option:hover,
.primary-color-switcher__option.is-selected {
  background: var(--vp-c-bg-soft);
}

.primary-color-switcher__current {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
}

.primary-color-switcher__submenu {
  position: absolute;
  top: 0;
  right: calc(100% + 0.5rem);
  width: 13.5rem;
  max-height: min(70vh, 31rem);
  padding: 0.375rem;
  overflow-y: auto;
}

.primary-color-switcher__option {
  display: grid;
  width: 100%;
  min-height: 2.25rem;
  margin: 0;
  padding: 0.375rem 0.625rem;
  grid-template-columns: 0.75rem 1fr 1.125rem;
  gap: 0.625rem;
  align-items: center;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
}

.primary-color-switcher__swatch {
  display: block;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.08);
}

.primary-color-switcher__swatch.is-black {
  background: var(--mk-neutral-900);
}

.dark .primary-color-switcher__swatch.is-black {
  background: var(--mk-neutral-50);
}

.primary-color-switcher__check {
  color: var(--vp-c-text-1);
}

.primary-color-switcher.is-compact {
  display: block;
  width: 100%;
}

.primary-color-switcher.is-compact .primary-color-switcher__trigger {
  width: 100%;
  height: auto;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  justify-content: flex-start;
  gap: 0.625rem;
}

.primary-color-switcher.is-compact .primary-color-switcher__trigger-label {
  display: inline;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
}

.primary-color-switcher.is-compact .primary-color-switcher__menu,
.primary-color-switcher.is-compact .primary-color-switcher__submenu {
  position: static;
  width: 100%;
  max-height: 18rem;
  margin-top: 0.25rem;
  border-radius: 0.5rem;
  box-shadow: none;
}

@media (max-width: 767px) {
  .primary-color-switcher:not(.is-compact) .primary-color-switcher__menu {
    right: -3rem;
  }
}
</style>
