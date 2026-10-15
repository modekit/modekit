<script setup lang="ts">
import {
  MkButton,
  MkCallout,
  MkDialog,
  MkDropdown,
  MkInput,
  MkSelect,
  MkSheet,
  MkTooltip,
} from '@modekit/vue'
import type { DropdownItem, SelectItem } from '@modekit/vue'
import { ref } from 'vue'

const selectedStatus = ref('backlog')
const lastAction = ref('No action selected')

const statuses = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
] satisfies readonly SelectItem[]

const actions = [
  { label: 'Edit project', onSelect: () => (lastAction.value = 'Edit project selected') },
  { label: 'Archive project', onSelect: () => (lastAction.value = 'Archive project selected') },
] satisfies readonly DropdownItem[]

const nestedActions = [
  { label: 'Duplicate project', onSelect: () => (lastAction.value = 'Duplicate project selected') },
] satisfies readonly DropdownItem[]
</script>

<template>
  <main id="browser-fixture" class="fixture-shell">
    <header>
      <p class="eyebrow">Browser verification fixture</p>
      <h1>Modekit interaction laboratory</h1>
      <p>Built from the packaged library exports and packaged stylesheet.</p>
    </header>

    <button id="outside-action" type="button">Outside action</button>

    <section aria-labelledby="overlay-heading" class="fixture-section">
      <h2 id="overlay-heading">Overlays</h2>
      <div class="fixture-row">
        <MkDialog title="Edit project" description="Update the project details.">
          <MkButton id="dialog-trigger">Open dialog</MkButton>
          <template #content>
            <label for="dialog-name">Project name</label>
            <input id="dialog-name" value="Modekit" />
            <MkDropdown :items="nestedActions">
              <MkButton id="nested-menu-trigger" variant="outline">More actions</MkButton>
            </MkDropdown>
          </template>
          <template #footer="{ close }">
            <MkButton id="dialog-save" @click="close">Save changes</MkButton>
          </template>
        </MkDialog>

        <MkSheet title="Project settings" description="Adjust the active project." side="right">
          <MkButton id="sheet-trigger" variant="outline">Open sheet</MkButton>
          <template #content>
            <label for="sheet-name">Display name</label>
            <input id="sheet-name" value="Modekit" />
          </template>
          <template #footer="{ close }">
            <MkButton id="sheet-save" @click="close">Apply settings</MkButton>
          </template>
        </MkSheet>
      </div>
    </section>

    <section aria-labelledby="choices-heading" class="fixture-section">
      <h2 id="choices-heading">Choices and menus</h2>
      <div class="fixture-grid">
        <div>
          <label for="status-select">Project status</label>
          <MkSelect
            id="status-select"
            v-model="selectedStatus"
            :items="statuses"
            placeholder="Choose status"
          />
          <output id="selected-status">{{ selectedStatus ?? 'Nothing selected' }}</output>
        </div>

        <div>
          <span id="disabled-status-label">Unavailable status</span>
          <MkSelect
            aria-labelledby="disabled-status-label"
            :items="statuses"
            disabled
            placeholder="Unavailable"
          />
        </div>

        <div>
          <MkDropdown :items="actions">
            <MkButton id="actions-trigger" variant="outline">Project actions</MkButton>
          </MkDropdown>
          <output id="last-action">{{ lastAction }}</output>
        </div>

        <div>
          <MkTooltip :delay-duration="0">
            <MkButton id="tooltip-trigger" variant="ghost">Project help</MkButton>
            <template #content>Open the project handbook</template>
          </MkTooltip>
          <MkTooltip :delay-duration="0" disabled>
            <MkButton id="disabled-tooltip-trigger" disabled>Disabled help</MkButton>
            <template #content>This must not open</template>
          </MkTooltip>
        </div>
      </div>
    </section>

    <section id="visual-gallery" aria-labelledby="visual-heading" class="fixture-section">
      <h2 id="visual-heading">Visual states</h2>
      <div class="fixture-row">
        <MkButton size="sm">Small action</MkButton>
        <MkButton>Primary action</MkButton>
        <MkButton size="lg" variant="outline">Large outline</MkButton>
        <MkButton disabled>Disabled action</MkButton>
      </div>
      <div class="fixture-grid">
        <MkInput aria-label="Default input" placeholder="Default input" />
        <MkInput aria-label="Invalid input" invalid model-value="Invalid value" />
        <MkInput aria-label="Disabled input" disabled model-value="Disabled value" />
      </div>
      <MkCallout
        title="Verification notice"
        description="Stable data makes visual checks useful."
      />
    </section>
  </main>
</template>
