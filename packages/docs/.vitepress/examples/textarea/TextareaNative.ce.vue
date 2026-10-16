<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkTextarea',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { computed, ref } from 'vue'

const bio = ref('ModeKit keeps character limits native.')
const remaining = computed(() => 120 - bio.value.length)
${scriptEnd}

<template>
  <MkLabel for="bio">Short bio</MkLabel>
  <MkTextarea
    id="bio"
    v-model="bio"
    name="bio"
    :rows="5"
    :maxlength="120"
    resize="vertical"
    aria-describedby="bio-limit"
  />
  <MkCaption id="bio-limit">{{ remaining }} characters remaining</MkCaption>
</template>`,
})
</script>

<script setup lang="ts">
import { MkCaption, MkLabel, MkTextarea } from '@modekit/vue'
import { computed, ref } from 'vue'

const bio = ref('ModeKit keeps character limits native.')
const remaining = computed(() => 120 - bio.value.length)
</script>

<template>
  <div style="display: grid; width: min(100%, 28rem); gap: 0.5rem">
    <MkLabel for="textarea-bio">Short bio</MkLabel>
    <MkTextarea
      id="textarea-bio"
      v-model="bio"
      aria-describedby="textarea-bio-limit"
      :maxlength="120"
      name="bio"
      resize="vertical"
      :rows="5"
    />
    <MkCaption id="textarea-bio-limit">{{ remaining }} characters remaining</MkCaption>
  </div>
</template>
