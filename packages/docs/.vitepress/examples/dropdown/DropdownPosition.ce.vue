<script lang="ts">
import { dropdownAlignments, dropdownSides, dropdownSizes } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDropdown',
  content: '',
  teleport: true,
  controls: [
    {
      prop: 'side',
      label: 'Side',
      defaultValue: 'bottom',
      options: selectOptions(dropdownSides),
    },
    {
      prop: 'align',
      label: 'Align',
      defaultValue: 'start',
      options: selectOptions(dropdownAlignments),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(dropdownSizes),
    },
    {
      prop: 'arrow',
      label: 'Arrow',
      defaultValue: true,
      options: [
        { label: 'true', value: true },
        { label: 'false', value: false },
      ],
    },
  ],
  code: (previewState) => `<template>
  <MkDropdown
    side="${String(previewState.side)}"
    align="${String(previewState.align)}"
    size="${String(previewState.size)}"
    :arrow="${String(previewState.arrow)}"
  >
    <MkButton>Position menu</MkButton>
    <template #content>
      <MkDropdownItem>First action</MkDropdownItem>
      <MkDropdownItem>Second action</MkDropdownItem>
    </template>
  </MkDropdown>
</template>`,
})
</script>

<script setup lang="ts">
import {
  MkButton,
  MkDropdown,
  MkDropdownItem,
  type DropdownAlign,
  type DropdownSide,
  type DropdownSize,
} from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
const props = withDefaults(
  defineProps<{
    side?: DropdownSide
    align?: DropdownAlign
    size?: DropdownSize
    arrow?: boolean
  }>(),
  {
    side: 'bottom',
    align: 'start',
    size: 'md',
    arrow: true,
  },
)
</script>

<template>
  <MkDropdown
    :align="props.align"
    :arrow="props.arrow"
    :portal="portalTarget"
    :side="props.side"
    :size="props.size"
  >
    <MkButton>Position menu</MkButton>
    <template #content>
      <MkDropdownItem>First action</MkDropdownItem>
      <MkDropdownItem>Second action</MkDropdownItem>
    </template>
  </MkDropdown>
</template>
