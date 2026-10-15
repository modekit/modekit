<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDropdownFilter',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<script setup lang="ts">
const query = ref('')
const actions = ['Create project', 'Invite member', 'Open settings']
const filteredActions = computed(() =>
  actions.filter((action) => action.toLowerCase().includes(query.value.toLowerCase())),
)
<\x2Fscript>

<template>
  <MkDropdown>
    <MkButton>Quick actions</MkButton>

    <template #content>
      <MkDropdownFilter
        v-model="query"
        auto-focus
        aria-label="Filter actions"
        placeholder="Filter actions…"
      />
      <MkDropdownItem v-for="action in filteredActions" :key="action">
        {{ action }}
      </MkDropdownItem>
      <MkText v-if="filteredActions.length === 0" class="empty-state" size="sm">
        No actions found.
      </MkText>
    </template>
  </MkDropdown>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDropdown, MkDropdownFilter, MkDropdownItem, MkText } from '@modekit/vue'
import { computed, ref } from 'vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const query = ref('')
const actions = ['Create project', 'Invite member', 'Open settings']
const filteredActions = computed(() =>
  actions.filter((action) => action.toLowerCase().includes(query.value.toLowerCase())),
)
</script>

<template>
  <MkDropdown :portal="portalTarget">
    <MkButton>Quick actions</MkButton>

    <template #content>
      <MkDropdownFilter
        v-model="query"
        auto-focus
        aria-label="Filter actions"
        placeholder="Filter actions…"
      />
      <MkDropdownItem v-for="action in filteredActions" :key="action">
        {{ action }}
      </MkDropdownItem>
      <MkText v-if="filteredActions.length === 0" class="empty-state" size="sm">
        No actions found.
      </MkText>
    </template>
  </MkDropdown>
</template>

<style>
.empty-state {
  display: block;
  padding: 0.75rem;
  color: var(--mk-neutral-500);
  text-align: center;
}
</style>
