<script lang="ts">
import { definePreview } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkDialog',
  content: '',
  teleport: true,
  controls: [],
  code: () => `<template>
  <MkDialog
    title="Edit profile"
    description="Make changes to the public details shown on your profile."
  >
    <MkButton>Edit profile</MkButton>

    <template #content>
      <MkGrid gap="l">
        <MkGrid gap="s">
          <MkLabel for="profile-name">Display name</MkLabel>
          <MkInput id="profile-name" default-value="Maya Chen" />
        </MkGrid>
        <MkGrid gap="s">
          <MkLabel for="profile-handle">Handle</MkLabel>
          <MkInput id="profile-handle" default-value="@maya" />
        </MkGrid>
      </MkGrid>
    </template>

    <template #footer="{ close }">
      <MkButton variant="ghost" @click="close">Cancel</MkButton>
      <MkButton @click="close">Save changes</MkButton>
    </template>
  </MkDialog>
</template>`,
})
</script>

<script setup lang="ts">
import { MkButton, MkDialog, MkGrid, MkInput, MkLabel } from '@modekit/vue'

import { usePreviewPortalTarget } from '../../components/preview-portal.js'

const portalTarget = usePreviewPortalTarget()
</script>

<template>
  <MkDialog
    description="Make changes to the public details shown on your profile."
    :portal="portalTarget"
    title="Edit profile"
  >
    <MkButton>Edit profile</MkButton>

    <template #content>
      <MkGrid gap="l">
        <MkGrid gap="s">
          <MkLabel for="profile-name">Display name</MkLabel>
          <MkInput id="profile-name" default-value="Maya Chen" />
        </MkGrid>
        <MkGrid gap="s">
          <MkLabel for="profile-handle">Handle</MkLabel>
          <MkInput id="profile-handle" default-value="@maya" />
        </MkGrid>
      </MkGrid>
    </template>

    <template #footer="{ close }">
      <MkButton variant="ghost" @click="close">Cancel</MkButton>
      <MkButton @click="close">Save changes</MkButton>
    </template>
  </MkDialog>
</template>
