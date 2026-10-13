<script lang="ts">
import { tabsSizes, tabsVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

const scriptEnd = ['</scr', 'ipt>'].join('')

export const preview = definePreview({
  componentName: 'MkTabs',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'line',
      options: selectOptions(tabsVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(tabsSizes),
    },
  ],
  code: (values) => `<script setup lang="ts">
import { ref } from 'vue'
import type { TabsItem } from '@modekit/vue'

const activeTab = ref('overview')
const items: readonly TabsItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
]
${scriptEnd}

<template>
  <MkTabs
    v-model="activeTab"
    :items="items"
    variant="${String(values.variant)}"
    size="${String(values.size)}"
  >
    <template #content="{ item }">
      {{ item.label }} content
    </template>
  </MkTabs>
</template>`,
})
</script>

<script setup lang="ts">
import { MkTabs } from '@modekit/vue'
import type { TabsItem, TabsSize, TabsVariant } from '@modekit/vue'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: TabsSize
    variant?: TabsVariant
  }>(),
  {
    size: 'md',
    variant: 'line',
  },
)

const activeTab = ref('overview')
const items: readonly TabsItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
]
</script>

<template>
  <MkTabs v-model="activeTab" :items="items" :size="props.size" :variant="props.variant">
    <template #content="{ item }">
      <p class="mk:m-0 mk:text-sm mk:text-neutral-600 mk:dark:text-neutral-400">
        This panel contains the {{ item.label.toLowerCase() }} content.
      </p>
    </template>
  </MkTabs>
</template>
