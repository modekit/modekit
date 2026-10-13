<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkCallout',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { Clock3 } from '@lucide/vue'
import { MkCallout, MkButton } from '@modekit/vue'
import { ref } from 'vue'

const visible = ref(true)
${scriptEnd}

<template>
  <MkCallout
    v-if="visible"
    color="amber"
    title="Session expires soon"
    dismissible
    dismiss-label="Dismiss session warning"
    @close="visible = false"
  >
    <template #icon>
      <Clock3 aria-hidden="true" :stroke-width="1.75" />
    </template>

    Save your work or extend the session to avoid losing changes.

    <template #actions>
      <MkButton size="sm" variant="soft">Extend session</MkButton>
    </template>
  </MkCallout>

  <MkButton v-else size="sm" @click="visible = true">Show callout</MkButton>
</template>`,
})
</script>

<script setup lang="ts">
import { Clock3 } from '@lucide/vue'
import { MkCallout, MkButton } from '@modekit/vue'
import { ref } from 'vue'

const visible = ref(true)
</script>

<template>
  <div style="width: min(100%, 36rem)">
    <MkCallout
      v-if="visible"
      color="amber"
      title="Session expires soon"
      dismissible
      dismiss-label="Dismiss session warning"
      @close="visible = false"
    >
      <template #icon>
        <Clock3 aria-hidden="true" :stroke-width="1.75" />
      </template>

      Save your work or extend the session to avoid losing changes.

      <template #actions>
        <MkButton size="sm" variant="soft">Extend session</MkButton>
      </template>
    </MkCallout>

    <MkButton v-else size="sm" @click="visible = true">Show callout</MkButton>
  </div>
</template>
