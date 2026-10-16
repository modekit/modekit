<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkTextarea',
  content: '',
  controls: [],
  code: () => `<MkGrid :columns="2" gap="l">
  <div>
    <MkLabel for="required-note" required>Required</MkLabel>
    <MkTextarea id="required-note" required :rows="3" />
  </div>
  <div>
    <MkLabel for="invalid-note">Invalid</MkLabel>
    <MkTextarea id="invalid-note" invalid :rows="3" aria-describedby="note-error" />
    <MkCaption id="note-error">Add at least ten characters.</MkCaption>
  </div>
  <div>
    <MkLabel for="readonly-note">Readonly</MkLabel>
    <MkTextarea id="readonly-note" readonly default-value="Published note" :rows="3" />
  </div>
  <div>
    <MkLabel for="disabled-note">Disabled</MkLabel>
    <MkTextarea id="disabled-note" disabled default-value="Unavailable" :rows="3" />
  </div>
</MkGrid>`,
})
</script>

<script setup lang="ts">
import { MkCaption, MkGrid, MkLabel, MkTextarea } from '@modekit/vue'
</script>

<template>
  <MkGrid style="width: min(100%, 40rem)" :columns="2" gap="l">
    <div style="display: grid; gap: 0.5rem">
      <MkLabel for="textarea-required" required>Required</MkLabel>
      <MkTextarea id="textarea-required" required :rows="3" />
    </div>
    <div style="display: grid; gap: 0.5rem">
      <MkLabel for="textarea-invalid">Invalid</MkLabel>
      <MkTextarea id="textarea-invalid" aria-describedby="textarea-error" invalid :rows="3" />
      <MkCaption id="textarea-error">Add at least ten characters.</MkCaption>
    </div>
    <div style="display: grid; gap: 0.5rem">
      <MkLabel for="textarea-readonly">Readonly</MkLabel>
      <MkTextarea id="textarea-readonly" default-value="Published note" readonly :rows="3" />
    </div>
    <div style="display: grid; gap: 0.5rem">
      <MkLabel for="textarea-disabled">Disabled</MkLabel>
      <MkTextarea id="textarea-disabled" default-value="Unavailable" disabled :rows="3" />
    </div>
  </MkGrid>
</template>
