<script setup lang="ts">
import { Check, Info, Search, Sparkles } from '@lucide/vue'
import {
  MkAvatar,
  MkAvatarGroup,
  MkBadge,
  MkButton,
  MkButtonGroup,
  MkCallout,
  MkCard,
  MkCheckbox,
  MkInput,
  MkLabel,
  MkSpinner,
  MkTabs,
} from '@modekit/vue'

const props = defineProps<{
  kind: string
}>()

const tabItems = [
  { value: 'preview', label: 'Preview' },
  { value: 'code', label: 'Code' },
  { value: 'usage', label: 'Usage' },
] as const
</script>

<template>
  <div class="overview-preview">
    <MkAvatar
      v-if="props.kind === 'avatar'"
      fallback="MK"
      color="primary"
      size="xl"
      aria-label="ModeKit"
    />

    <MkAvatarGroup
      v-else-if="props.kind === 'avatar-group'"
      size="lg"
      spacing="normal"
      aria-label="Project members"
    >
      <MkAvatar fallback="AN" color="primary" aria-label="Ana" />
      <MkAvatar fallback="BO" color="neutral" aria-label="Bo" />
      <MkAvatar fallback="CY" color="primary" aria-label="Cy" />
      <MkAvatar fallback="DI" color="neutral" aria-label="Di" />
    </MkAvatarGroup>

    <div v-else-if="props.kind === 'badge'" class="overview-preview__badges">
      <MkBadge color="primary">New</MkBadge>
      <MkBadge color="primary" variant="soft">
        <template #leading><Check aria-hidden="true" /></template>
        Ready
      </MkBadge>
      <MkBadge color="neutral" variant="outline">v1.0</MkBadge>
    </div>

    <MkButton v-else-if="props.kind === 'button'">
      <template #leading><Sparkles aria-hidden="true" /></template>
      Create project
    </MkButton>

    <MkButtonGroup v-else-if="props.kind === 'button-group'" aria-label="Report period">
      <MkButton variant="outline" size="sm">Day</MkButton>
      <MkButton variant="outline" size="sm">Week</MkButton>
      <MkButton variant="outline" size="sm">Month</MkButton>
    </MkButtonGroup>

    <MkCallout
      v-else-if="props.kind === 'callout'"
      class="overview-preview__fill"
      color="primary"
      size="sm"
      title="Changes saved"
    >
      <template #icon><Info aria-hidden="true" /></template>
      Your workspace is up to date.
    </MkCallout>

    <MkCard
      v-else-if="props.kind === 'card'"
      class="overview-preview__card"
      variant="outline"
      size="sm"
    >
      <template #header>
        <span class="overview-preview__card-title">Weekly overview</span>
      </template>
      <strong>2,480</strong>
      <span>active users</span>
    </MkCard>

    <MkCheckbox
      v-else-if="props.kind === 'checkbox'"
      :default-value="true"
      label="Email notifications"
      description="Receive important updates."
    />

    <MkInput
      v-else-if="props.kind === 'input'"
      class="overview-preview__fill"
      aria-label="Search projects"
      placeholder="Search projects"
    >
      <template #leading><Search aria-hidden="true" /></template>
    </MkInput>

    <div v-else-if="props.kind === 'label'" class="overview-preview__label-demo">
      <MkLabel for="overview-workspace" required>Workspace name</MkLabel>
      <input
        id="overview-workspace"
        class="overview-preview__label-field"
        value="ModeKit Studio"
        readonly
      />
    </div>

    <div v-else-if="props.kind === 'spinner'" class="overview-preview__spinners">
      <MkSpinner size="sm" aria-label="Loading" />
      <MkSpinner size="md" aria-label="Loading" />
      <MkSpinner size="lg" aria-label="Loading" />
    </div>

    <MkTabs
      v-else-if="props.kind === 'tabs'"
      :items="tabItems"
      default-value="preview"
      variant="segmented"
      size="sm"
    />
  </div>
</template>

<style>
.overview-preview {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: center;
  color: var(--mk-neutral-950);
}

.overview-preview__badges,
.overview-preview__spinners {
  display: flex;
  gap: 0.55rem;
  align-items: center;
}

.overview-preview__fill {
  width: 100%;
}

.overview-preview__card {
  width: min(100%, 13rem);
}

.overview-preview__card-title {
  font-size: 0.75rem;
  font-weight: 650;
}

.overview-preview__card strong,
.overview-preview__card span {
  display: block;
}

.overview-preview__card strong {
  font-size: 1.25rem;
  line-height: 1.1;
}

.overview-preview__card span:last-child {
  margin-top: 0.2rem;
  color: var(--mk-neutral-600);
  font-size: 0.7rem;
}

.overview-preview__label-demo {
  width: min(100%, 13rem);
}

.overview-preview__label-field {
  box-sizing: border-box;
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--mk-neutral-300);
  border-radius: 0.45rem;
  background: var(--mk-color-white);
  color: var(--mk-neutral-600);
  font: inherit;
  font-size: 0.75rem;
  outline: none;
}

.dark .overview-preview {
  color: var(--mk-neutral-50);
}

.dark .overview-preview__card span:last-child,
.dark .overview-preview__label-field {
  color: var(--mk-neutral-400);
}

.dark .overview-preview__label-field {
  border-color: var(--mk-neutral-700);
  background: color-mix(in oklab, var(--mk-color-white) 10%, transparent);
}
</style>
