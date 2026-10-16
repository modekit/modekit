<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkRadioGroup',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { Eye, Pencil, Wrench } from '@lucide/vue'
import { ref } from 'vue'

const role = ref('viewer')
const roles = [
  { label: 'Admin', value: 'admin', icon: Wrench },
  { label: 'Editor', value: 'editor', icon: Pencil },
  { label: 'Viewer', value: 'viewer', icon: Eye },
]
${scriptEnd}

<template>
  <MkRadioGroup v-model="role" :items="roles" label="Role" orientation="horizontal" variant="segmented">
    <template #icon="{ item }">
      <component :is="item.icon" />
    </template>
  </MkRadioGroup>
</template>`,
})
</script>

<script setup lang="ts">
import { Eye, Pencil, Wrench } from '@lucide/vue'
import { MkRadioGroup } from '@modekit/vue'
import { ref } from 'vue'

const role = ref('viewer')
const roles = [
  { label: 'Admin', value: 'admin', icon: Wrench },
  { label: 'Editor', value: 'editor', icon: Pencil },
  { label: 'Viewer', value: 'viewer', icon: Eye },
]
</script>

<template>
  <MkRadioGroup
    v-model="role"
    :items="roles"
    label="Role"
    orientation="horizontal"
    variant="segmented"
  >
    <template #icon="{ item }">
      <component :is="item.icon" />
    </template>
  </MkRadioGroup>
</template>
