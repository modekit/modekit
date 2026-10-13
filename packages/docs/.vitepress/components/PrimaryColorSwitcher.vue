<script setup lang="ts">
import { Check, Palette } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'

type PrimaryColor =
  | 'black'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'

interface PrimaryColorOption {
  value: PrimaryColor
  label: string
  swatch?: string
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

const options: readonly PrimaryColorOption[] = [
  { value: 'black', label: 'Black' },
  { value: 'red', label: 'Red', swatch: 'var(--mk-color-red-500)' },
  { value: 'orange', label: 'Orange', swatch: 'var(--mk-color-orange-500)' },
  { value: 'amber', label: 'Amber', swatch: 'var(--mk-color-amber-500)' },
  { value: 'yellow', label: 'Yellow', swatch: 'var(--mk-color-yellow-500)' },
  { value: 'lime', label: 'Lime', swatch: 'var(--mk-color-lime-500)' },
  { value: 'green', label: 'Green', swatch: 'var(--mk-color-green-500)' },
  { value: 'emerald', label: 'Emerald', swatch: 'var(--mk-color-emerald-500)' },
  { value: 'teal', label: 'Teal', swatch: 'var(--mk-color-teal-500)' },
  { value: 'cyan', label: 'Cyan', swatch: 'var(--mk-color-cyan-500)' },
  { value: 'sky', label: 'Sky', swatch: 'var(--mk-color-sky-500)' },
  { value: 'blue', label: 'Blue', swatch: 'var(--mk-color-blue-500)' },
  { value: 'indigo', label: 'Indigo', swatch: 'var(--mk-color-indigo-500)' },
  { value: 'violet', label: 'Violet', swatch: 'var(--mk-color-violet-500)' },
  { value: 'purple', label: 'Purple', swatch: 'var(--mk-color-purple-500)' },
  { value: 'fuchsia', label: 'Fuchsia', swatch: 'var(--mk-color-fuchsia-500)' },
  { value: 'pink', label: 'Pink', swatch: 'var(--mk-color-pink-500)' },
  { value: 'rose', label: 'Rose', swatch: 'var(--mk-color-rose-500)' },
]

const storageKey = 'modekit-primary-color'
const colorChangeEvent = 'modekit:primary-color-change'
const root = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const menuElement = ref<HTMLElement>()
const open = ref(false)
const selectedColor = ref<PrimaryColor>('black')
const menuId = `modekit-primary-color-${useId()}`
const compact = computed(() => props.menu || props.screenMenu)
const selectedOption = computed(
  () => options.find((option) => option.value === selectedColor.value) ?? options[0],
)

function isPrimaryColor(value: string | undefined | null): value is PrimaryColor {
  return options.some((option) => option.value === value)
}

function syncColor(color: PrimaryColor): void {
  selectedColor.value = color
  document.documentElement.dataset.mkPrimary = color
}

function selectColor(color: PrimaryColor): void {
  syncColor(color)
  localStorage.setItem(storageKey, color)
  window.dispatchEvent(new CustomEvent<PrimaryColor>(colorChangeEvent, { detail: color }))
  open.value = false
  trigger.value?.focus()
}

async function openAndFocus(): Promise<void> {
  open.value = true
  await nextTick()
  menuElement.value?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus()
}

function handleDocumentPointerDown(event: PointerEvent): void {
  if (!root.value?.contains(event.target as Node)) open.value = false
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || !open.value) return

  open.value = false
  trigger.value?.focus()
}

function handleMenuKeydown(event: KeyboardEvent): void {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

  const items = Array.from(
    menuElement.value?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [],
  )
  const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement)
  const offset = event.key === 'ArrowDown' ? 1 : -1
  const nextIndex = (currentIndex + offset + items.length) % items.length

  event.preventDefault()
  items[nextIndex]?.focus()
}

function handleColorChange(event: Event): void {
  const color = (event as CustomEvent<string>).detail
  if (isPrimaryColor(color)) syncColor(color)
}

function handleStorage(event: StorageEvent): void {
  if (event.key === storageKey && isPrimaryColor(event.newValue)) syncColor(event.newValue)
}

onMounted(() => {
  const color = document.documentElement.dataset.mkPrimary
  syncColor(isPrimaryColor(color) ? color : 'black')
  document.addEventListener('pointerdown', handleDocumentPointerDown)
  document.addEventListener('keydown', handleDocumentKeydown)
  window.addEventListener(colorChangeEvent, handleColorChange)
  window.addEventListener('storage', handleStorage)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
  document.removeEventListener('keydown', handleDocumentKeydown)
  window.removeEventListener(colorChangeEvent, handleColorChange)
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
      aria-label="Choose primary color"
      title="Choose primary color"
      @click="open = !open"
      @keydown.down.prevent="openAndFocus"
    >
      <Palette :size="19" :stroke-width="1.9" aria-hidden="true" />
      <span class="primary-color-switcher__trigger-label">
        <span>Primary color</span>
        <span class="primary-color-switcher__current">
          <span
            class="primary-color-switcher__swatch"
            :class="{ 'is-black': selectedColor === 'black' }"
            :style="{ backgroundColor: selectedOption?.swatch }"
          />
          {{ selectedOption?.label }}
        </span>
      </span>
    </button>

    <div
      v-if="open"
      :id="menuId"
      ref="menuElement"
      class="primary-color-switcher__menu"
      role="menu"
      aria-label="Primary colors"
      @keydown="handleMenuKeydown"
    >
      <button
        v-for="option in options"
        :key="option.value"
        class="primary-color-switcher__option"
        :class="{ 'is-selected': option.value === selectedColor }"
        type="button"
        role="menuitemradio"
        :aria-checked="option.value === selectedColor"
        @click="selectColor(option.value)"
      >
        <span
          class="primary-color-switcher__swatch"
          :class="{ 'is-black': option.value === 'black' }"
          :style="{ backgroundColor: option.swatch }"
        />
        <span>{{ option.label }}</span>
        <Check
          v-if="option.value === selectedColor"
          class="primary-color-switcher__check"
          :size="17"
          :stroke-width="2.25"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<style>
:root[data-mk-primary='black'] {
  --mk-primary: var(--mk-neutral-900);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='black'] {
  --mk-primary: var(--mk-neutral-50);
  --mk-primary-foreground: var(--mk-neutral-950);
}

:root[data-mk-primary='red'] {
  --mk-primary: var(--mk-color-red-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='red'] {
  --mk-primary: var(--mk-color-red-400);
  --mk-primary-foreground: var(--mk-color-red-950);
}

:root[data-mk-primary='orange'] {
  --mk-primary: var(--mk-color-orange-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='orange'] {
  --mk-primary: var(--mk-color-orange-400);
  --mk-primary-foreground: var(--mk-color-orange-950);
}

:root[data-mk-primary='amber'] {
  --mk-primary: var(--mk-color-amber-400);
  --mk-primary-foreground: var(--mk-color-amber-950);
}

:root.dark[data-mk-primary='amber'] {
  --mk-primary: var(--mk-color-amber-300);
  --mk-primary-foreground: var(--mk-color-amber-950);
}

:root[data-mk-primary='yellow'] {
  --mk-primary: var(--mk-color-yellow-400);
  --mk-primary-foreground: var(--mk-color-yellow-950);
}

:root.dark[data-mk-primary='yellow'] {
  --mk-primary: var(--mk-color-yellow-300);
  --mk-primary-foreground: var(--mk-color-yellow-950);
}

:root[data-mk-primary='lime'] {
  --mk-primary: var(--mk-color-lime-400);
  --mk-primary-foreground: var(--mk-color-lime-950);
}

:root.dark[data-mk-primary='lime'] {
  --mk-primary: var(--mk-color-lime-300);
  --mk-primary-foreground: var(--mk-color-lime-950);
}

:root[data-mk-primary='green'] {
  --mk-primary: var(--mk-color-green-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='green'] {
  --mk-primary: var(--mk-color-green-400);
  --mk-primary-foreground: var(--mk-color-green-950);
}

:root[data-mk-primary='emerald'] {
  --mk-primary: var(--mk-color-emerald-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='emerald'] {
  --mk-primary: var(--mk-color-emerald-400);
  --mk-primary-foreground: var(--mk-color-emerald-950);
}

:root[data-mk-primary='teal'] {
  --mk-primary: var(--mk-color-teal-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='teal'] {
  --mk-primary: var(--mk-color-teal-400);
  --mk-primary-foreground: var(--mk-color-teal-950);
}

:root[data-mk-primary='cyan'] {
  --mk-primary: var(--mk-color-cyan-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='cyan'] {
  --mk-primary: var(--mk-color-cyan-400);
  --mk-primary-foreground: var(--mk-color-cyan-950);
}

:root[data-mk-primary='sky'] {
  --mk-primary: var(--mk-color-sky-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='sky'] {
  --mk-primary: var(--mk-color-sky-400);
  --mk-primary-foreground: var(--mk-color-sky-950);
}

:root[data-mk-primary='blue'] {
  --mk-primary: var(--mk-color-blue-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='blue'] {
  --mk-primary: var(--mk-color-blue-400);
  --mk-primary-foreground: var(--mk-color-blue-950);
}

:root[data-mk-primary='indigo'] {
  --mk-primary: var(--mk-color-indigo-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='indigo'] {
  --mk-primary: var(--mk-color-indigo-400);
  --mk-primary-foreground: var(--mk-color-indigo-950);
}

:root[data-mk-primary='violet'] {
  --mk-primary: var(--mk-color-violet-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='violet'] {
  --mk-primary: var(--mk-color-violet-400);
  --mk-primary-foreground: var(--mk-color-violet-950);
}

:root[data-mk-primary='purple'] {
  --mk-primary: var(--mk-color-purple-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='purple'] {
  --mk-primary: var(--mk-color-purple-400);
  --mk-primary-foreground: var(--mk-color-purple-950);
}

:root[data-mk-primary='fuchsia'] {
  --mk-primary: var(--mk-color-fuchsia-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='fuchsia'] {
  --mk-primary: var(--mk-color-fuchsia-400);
  --mk-primary-foreground: var(--mk-color-fuchsia-950);
}

:root[data-mk-primary='pink'] {
  --mk-primary: var(--mk-color-pink-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='pink'] {
  --mk-primary: var(--mk-color-pink-400);
  --mk-primary-foreground: var(--mk-color-pink-950);
}

:root[data-mk-primary='rose'] {
  --mk-primary: var(--mk-color-rose-700);
  --mk-primary-foreground: var(--mk-color-white);
}

:root.dark[data-mk-primary='rose'] {
  --mk-primary: var(--mk-color-rose-400);
  --mk-primary-foreground: var(--mk-color-rose-950);
}

.primary-color-switcher {
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
.primary-color-switcher__option:focus-visible {
  outline: 2px solid var(--mk-primary);
  outline-offset: 2px;
}

.primary-color-switcher__trigger-label {
  display: none;
}

.primary-color-switcher__menu {
  position: absolute;
  z-index: 100;
  top: calc(100% + 0.625rem);
  right: 0;
  width: 13.5rem;
  max-height: min(70vh, 31rem);
  padding: 0.375rem;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.75rem;
  background: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
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

.primary-color-switcher__option:hover,
.primary-color-switcher__option.is-selected {
  background: var(--vp-c-bg-soft);
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
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
}

.primary-color-switcher__current {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
}

.primary-color-switcher.is-compact .primary-color-switcher__menu {
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
