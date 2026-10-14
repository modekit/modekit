<script lang="ts">
import { definePreview } from '../../components/preview.js'

const scriptEnd = ['<', '/script>'].join('')

export const preview = definePreview({
  componentName: 'MkCard',
  content: '',
  controls: [],
  code: () => `<script setup lang="ts">
import { Ellipsis } from '@lucide/vue'
import { MkButton, MkCard, MkFlex, MkGrid, MkInput, MkLabel, MkText } from '@modekit/vue'
${scriptEnd}

<template>
  <MkCard
    body="inset"
    description="Keep team-facing details up to date."
    size="md"
    title="Workspace profile"
    variant="muted"
    style="width: min(100%, 24rem)"
  >
    <template #header-actions>
      <MkButton aria-label="More options" size="sm" square variant="ghost">
        <Ellipsis aria-hidden="true" />
      </MkButton>
    </template>

    <MkGrid gap="l">
      <MkGrid gap="s">
        <MkLabel for="profile-name">Display name</MkLabel>
        <MkInput id="profile-name" model-value="Avery Stone" />
      </MkGrid>

      <MkGrid gap="s">
        <MkLabel for="profile-summary">Role summary</MkLabel>
        <textarea
          id="profile-summary"
          class="mk:box-border mk:min-h-20 mk:w-full mk:resize-y mk:rounded-lg mk:border mk:border-solid mk:border-neutral-300 mk:bg-white mk:px-3 mk:py-2 mk:text-sm mk:text-neutral-950 mk:outline-none mk:placeholder:text-neutral-600/60 mk:focus-visible:border-primary mk:dark:border-neutral-700 mk:dark:bg-white/10 mk:dark:text-neutral-50"
          placeholder="Describe your responsibilities"
          rows="2"
        ></textarea>
      </MkGrid>
    </MkGrid>

    <template #footer>
      <MkFlex align="center" gap="l" justify="space-between" style="width: 100%">
        <MkText size="sm">Draft saved just now</MkText>
        <MkFlex gap="s">
          <MkButton variant="ghost">Discard</MkButton>
          <MkButton>Publish</MkButton>
        </MkFlex>
      </MkFlex>
    </template>
  </MkCard>
</template>`,
})
</script>

<script setup lang="ts">
import { Ellipsis } from '@lucide/vue'
import { MkButton, MkCard, MkFlex, MkGrid, MkInput, MkLabel, MkText } from '@modekit/vue'
</script>

<template>
  <MkCard
    body="inset"
    description="Keep team-facing details up to date."
    size="md"
    style="width: min(100%, 24rem)"
    title="Workspace profile"
    variant="muted"
  >
    <template #header-actions>
      <MkButton aria-label="More options" size="sm" square variant="ghost">
        <Ellipsis aria-hidden="true" />
      </MkButton>
    </template>

    <MkGrid gap="l">
      <MkGrid gap="s">
        <MkLabel for="profile-name">Display name</MkLabel>
        <MkInput id="profile-name" model-value="Avery Stone" />
      </MkGrid>

      <MkGrid gap="s">
        <MkLabel for="profile-summary">Role summary</MkLabel>
        <textarea
          id="profile-summary"
          class="mk:box-border mk:min-h-20 mk:w-full mk:resize-y mk:rounded-lg mk:border mk:border-solid mk:border-neutral-300 mk:bg-white mk:px-3 mk:py-2 mk:text-sm mk:text-neutral-950 mk:outline-none mk:placeholder:text-neutral-600/60 mk:focus-visible:border-primary mk:dark:border-neutral-700 mk:dark:bg-white/10 mk:dark:text-neutral-50"
          placeholder="Describe your responsibilities"
          rows="2"
        ></textarea>
      </MkGrid>
    </MkGrid>

    <template #footer>
      <MkFlex align="center" gap="l" justify="space-between" style="width: 100%">
        <MkText size="sm">Draft saved just now</MkText>
        <MkFlex gap="s">
          <MkButton variant="ghost">Discard</MkButton>
          <MkButton>Publish</MkButton>
        </MkFlex>
      </MkFlex>
    </template>
  </MkCard>
</template>
