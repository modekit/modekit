<script setup lang="ts">
import { Palette } from '@lucide/vue'
import {
  MkDropdown,
  MkDropdownLabel,
  MkDropdownRadioGroup,
  MkDropdownRadioItem,
  MkDropdownSeparator,
  MkDropdownSub,
  MkDropdownSubContent,
  MkDropdownSubTrigger,
  modeKitNeutralColors,
  modeKitPrimaryColors,
  type ModeKitNeutralColor,
  type ModeKitPrimaryColor,
} from '@modekit/vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type ContentFont =
  'dm-sans' | 'inter' | 'manrope' | 'plus-jakarta-sans' | 'space-grotesk' | 'system'
type ThemeColor = ModeKitPrimaryColor | ModeKitNeutralColor

interface ColorOption<T extends ThemeColor> {
  value: T
  label: string
  swatch?: string
}

interface FontOption {
  value: ContentFont
  label: string
  family: string
}

interface ThemeSettingsDetail {
  primary?: ModeKitPrimaryColor
  neutral?: ModeKitNeutralColor
  font?: ContentFont
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

function createColorOptions<T extends ThemeColor>(
  values: readonly T[],
  shade: 400 | 500,
): readonly ColorOption<T>[] {
  return values.map((value) => ({
    value,
    label: labelFor(value),
    ...(value === 'black' ? {} : { swatch: `var(--mk-color-${value}-${String(shade)})` }),
  }))
}

const primaryOptions = createColorOptions(modeKitPrimaryColors, 400)
const neutralOptions = createColorOptions(modeKitNeutralColors, 500)
const fontOptions = [
  {
    value: 'dm-sans',
    label: 'DM Sans',
    family: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: 'inter',
    label: 'Inter',
    family: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: 'manrope',
    label: 'Manrope',
    family: "'Manrope', ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: 'plus-jakarta-sans',
    label: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: 'space-grotesk',
    label: 'Space Grotesk',
    family: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  },
  {
    value: 'system',
    label: 'System',
    family: 'ui-sans-serif, system-ui, sans-serif',
  },
] as const satisfies readonly FontOption[]

const primaryStorageKey = 'modekit-primary-color'
const neutralStorageKey = 'modekit-neutral-color'
const fontStorageKey = 'modekit-content-font'
const themeChangeEvent = 'modekit:theme-settings-change'
const selectedPrimary = ref<ModeKitPrimaryColor>('black')
const selectedNeutral = ref<ModeKitNeutralColor>('zinc')
const selectedFont = ref<ContentFont>('dm-sans')
const compact = computed(() => props.menu || props.screenMenu)
const selectedPrimaryOption = computed(
  () =>
    primaryOptions.find((option) => option.value === selectedPrimary.value) ?? primaryOptions[0],
)
const selectedNeutralOption = computed(
  () =>
    neutralOptions.find((option) => option.value === selectedNeutral.value) ?? neutralOptions[0],
)
const selectedFontOption = computed(
  () => fontOptions.find((option) => option.value === selectedFont.value) ?? fontOptions[0],
)

function isPrimaryColor(value: string | undefined | null): value is ModeKitPrimaryColor {
  return primaryOptions.some((option) => option.value === value)
}

function isNeutralColor(value: string | undefined | null): value is ModeKitNeutralColor {
  return neutralOptions.some((option) => option.value === value)
}

function isContentFont(value: string | undefined | null): value is ContentFont {
  return fontOptions.some((option) => option.value === value)
}

function syncPrimary(color: ModeKitPrimaryColor): void {
  selectedPrimary.value = color
  document.documentElement.dataset.mkPrimary = color
}

function syncNeutral(color: ModeKitNeutralColor): void {
  selectedNeutral.value = color
  document.documentElement.dataset.mkNeutral = color
}

function syncFont(font: ContentFont): void {
  selectedFont.value = font
  document.documentElement.dataset.mkFont = font
}

function announceChange(detail: ThemeSettingsDetail): void {
  window.dispatchEvent(new CustomEvent<ThemeSettingsDetail>(themeChangeEvent, { detail }))
}

function selectPrimary(value: unknown): void {
  const color = String(value)
  if (!isPrimaryColor(color)) return

  syncPrimary(color)
  localStorage.setItem(primaryStorageKey, color)
  announceChange({ primary: color })
}

function selectNeutral(value: unknown): void {
  const color = String(value)
  if (!isNeutralColor(color)) return

  syncNeutral(color)
  localStorage.setItem(neutralStorageKey, color)
  announceChange({ neutral: color })
}

function selectFont(value: unknown): void {
  const font = String(value)
  if (!isContentFont(font)) return

  syncFont(font)
  localStorage.setItem(fontStorageKey, font)
  announceChange({ font })
}

function handleThemeChange(event: Event): void {
  const detail = (event as CustomEvent<ThemeSettingsDetail>).detail
  if (isPrimaryColor(detail.primary)) syncPrimary(detail.primary)
  if (isNeutralColor(detail.neutral)) syncNeutral(detail.neutral)
  if (isContentFont(detail.font)) syncFont(detail.font)
}

function handleStorage(event: StorageEvent): void {
  if (event.key === primaryStorageKey) {
    syncPrimary(isPrimaryColor(event.newValue) ? event.newValue : 'black')
  }
  if (event.key === neutralStorageKey) {
    syncNeutral(isNeutralColor(event.newValue) ? event.newValue : 'zinc')
  }
  if (event.key === fontStorageKey) {
    syncFont(isContentFont(event.newValue) ? event.newValue : 'dm-sans')
  }
}

onMounted(() => {
  const { mkPrimary, mkNeutral, mkFont } = document.documentElement.dataset
  syncPrimary(isPrimaryColor(mkPrimary) ? mkPrimary : 'black')
  syncNeutral(isNeutralColor(mkNeutral) ? mkNeutral : 'zinc')
  syncFont(isContentFont(mkFont) ? mkFont : 'dm-sans')
  window.addEventListener(themeChangeEvent, handleThemeChange)
  window.addEventListener('storage', handleStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener(themeChangeEvent, handleThemeChange)
  window.removeEventListener('storage', handleStorage)
})
</script>

<template>
  <div class="theme-switcher" :class="{ 'is-compact': compact }">
    <MkDropdown
      align="end"
      class="theme-switcher__menu"
      :collision-padding="12"
      :modal="false"
      :side-offset="10"
    >
      <button
        class="theme-switcher__trigger"
        type="button"
        aria-label="Customize preview theme"
        title="Customize preview theme"
      >
        <Palette :size="19" :stroke-width="1.9" aria-hidden="true" />
        <span class="theme-switcher__trigger-label">Customize theme</span>
      </button>

      <template #content>
        <MkDropdownLabel>Preview theme</MkDropdownLabel>
        <MkDropdownSeparator />

        <MkDropdownSub>
          <MkDropdownSubTrigger>
            <span class="theme-switcher__category">
              <span>Primary</span>
              <span class="theme-switcher__current">
                <span
                  class="theme-switcher__swatch"
                  :class="{ 'is-black': selectedPrimary === 'black' }"
                  :style="{ backgroundColor: selectedPrimaryOption?.swatch }"
                />
                {{ selectedPrimaryOption?.label }}
              </span>
            </span>
          </MkDropdownSubTrigger>
          <MkDropdownSubContent class="theme-switcher__submenu">
            <MkDropdownRadioGroup
              :model-value="selectedPrimary"
              @update:model-value="selectPrimary"
            >
              <MkDropdownRadioItem
                v-for="option in primaryOptions"
                :key="option.value"
                :value="option.value"
              >
                <span class="theme-switcher__option">
                  <span
                    class="theme-switcher__swatch"
                    :class="{ 'is-black': option.value === 'black' }"
                    :style="{ backgroundColor: option.swatch }"
                  />
                  {{ option.label }}
                </span>
              </MkDropdownRadioItem>
            </MkDropdownRadioGroup>
          </MkDropdownSubContent>
        </MkDropdownSub>

        <MkDropdownSub>
          <MkDropdownSubTrigger>
            <span class="theme-switcher__category">
              <span>Neutral</span>
              <span class="theme-switcher__current">
                <span
                  class="theme-switcher__swatch"
                  :style="{ backgroundColor: selectedNeutralOption?.swatch }"
                />
                {{ selectedNeutralOption?.label }}
              </span>
            </span>
          </MkDropdownSubTrigger>
          <MkDropdownSubContent class="theme-switcher__submenu">
            <MkDropdownRadioGroup
              :model-value="selectedNeutral"
              @update:model-value="selectNeutral"
            >
              <MkDropdownRadioItem
                v-for="option in neutralOptions"
                :key="option.value"
                :value="option.value"
              >
                <span class="theme-switcher__option">
                  <span
                    class="theme-switcher__swatch"
                    :style="{ backgroundColor: option.swatch }"
                  />
                  {{ option.label }}
                </span>
              </MkDropdownRadioItem>
            </MkDropdownRadioGroup>
          </MkDropdownSubContent>
        </MkDropdownSub>

        <MkDropdownSub>
          <MkDropdownSubTrigger>
            <span class="theme-switcher__category">
              <span>Font</span>
              <span class="theme-switcher__current">{{ selectedFontOption?.label }}</span>
            </span>
          </MkDropdownSubTrigger>
          <MkDropdownSubContent class="theme-switcher__submenu">
            <MkDropdownRadioGroup :model-value="selectedFont" @update:model-value="selectFont">
              <MkDropdownRadioItem
                v-for="option in fontOptions"
                :key="option.value"
                :value="option.value"
              >
                <span :style="{ fontFamily: option.family }">
                  {{ option.label }}
                </span>
              </MkDropdownRadioItem>
            </MkDropdownRadioGroup>
          </MkDropdownSubContent>
        </MkDropdownSub>
      </template>
    </MkDropdown>
  </div>
</template>

<style>
.theme-switcher {
  display: flex;
  align-items: center;
}

.theme-switcher__trigger {
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

.theme-switcher__trigger:hover,
.theme-switcher__trigger[aria-expanded='true'] {
  background: var(--vp-c-bg-soft);
  color: var(--mk-primary);
}

.theme-switcher__trigger:focus-visible {
  outline: 2px solid var(--mk-primary);
  outline-offset: 2px;
}

.theme-switcher__trigger-label {
  display: none;
}

.theme-switcher__menu,
.theme-switcher__submenu {
  font-family: var(--vp-font-family-base);
}

.theme-switcher__menu {
  width: 15rem;
}

.theme-switcher__submenu {
  width: 13.5rem;
}

.theme-switcher__category {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.theme-switcher__current,
.theme-switcher__option {
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
}

.theme-switcher__current {
  color: var(--mk-neutral-500);
}

.theme-switcher__swatch {
  display: block;
  width: 0.625rem;
  height: 0.625rem;
  flex: 0 0 auto;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.08);
}

.theme-switcher__swatch.is-black {
  background: var(--mk-neutral-900);
}

.dark .theme-switcher__swatch.is-black {
  background: var(--mk-neutral-50);
}

.theme-switcher.is-compact {
  display: block;
  width: 100%;
}

.theme-switcher.is-compact .theme-switcher__trigger {
  width: 100%;
  height: auto;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  justify-content: flex-start;
  gap: 0.625rem;
}

.theme-switcher.is-compact .theme-switcher__trigger-label {
  display: inline;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
}
</style>
