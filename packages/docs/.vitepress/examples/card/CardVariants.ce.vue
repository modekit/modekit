<script lang="ts">
import { cardSizes, cardVariants } from '@modekit/vue'

import { definePreview, selectOptions } from '../../components/preview.js'

export const preview = definePreview({
  componentName: 'MkCard',
  content: '',
  controls: [
    {
      prop: 'variant',
      label: 'Variant',
      defaultValue: 'shadow',
      options: selectOptions(cardVariants),
    },
    {
      prop: 'size',
      label: 'Size',
      defaultValue: 'md',
      options: selectOptions(cardSizes),
    },
  ],
  code: (values) => `<template>
  <MkCard
    description="Sign in to continue to your account."
    title="Welcome back"
    variant="${String(values.variant)}"
    size="${String(values.size)}"
    style="width: min(100%, 24rem)"
  >
    <MkGrid as="form" gap="l" @submit.prevent>
      <MkGrid gap="s">
        <MkLabel for="login-email">Email address</MkLabel>
        <MkInput
          id="login-email"
          autocomplete="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </MkGrid>

      <MkGrid gap="s">
        <MkLabel for="login-password">Password</MkLabel>
        <MkInput
          id="login-password"
          autocomplete="current-password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </MkGrid>

      <MkCheckbox label="Remember me" />
      <MkButton type="submit">Sign in</MkButton>
    </MkGrid>

    <template #footer>
      <MkText as="p" size="sm">
        New to ModeKit?
        <MkLink href="#create-account" primary weight="semibold">Create an account</MkLink>
      </MkText>
    </template>
  </MkCard>
</template>`,
})
</script>

<script setup lang="ts">
import {
  MkButton,
  MkCard,
  MkCheckbox,
  MkGrid,
  MkInput,
  MkLabel,
  MkLink,
  MkText,
} from '@modekit/vue'
import type { CardSize, CardVariant } from '@modekit/vue'

const props = withDefaults(
  defineProps<{
    size?: CardSize
    variant?: CardVariant
  }>(),
  {
    size: 'md',
    variant: 'shadow',
  },
)
</script>

<template>
  <MkCard
    description="Sign in to continue to your account."
    :size="props.size"
    style="width: min(100%, 24rem)"
    title="Welcome back"
    :variant="props.variant"
  >
    <MkGrid as="form" gap="l" @submit.prevent>
      <MkGrid gap="s">
        <MkLabel for="login-email">Email address</MkLabel>
        <MkInput
          id="login-email"
          autocomplete="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </MkGrid>

      <MkGrid gap="s">
        <MkLabel for="login-password">Password</MkLabel>
        <MkInput
          id="login-password"
          autocomplete="current-password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </MkGrid>

      <MkCheckbox label="Remember me" />
      <MkButton type="submit">Sign in</MkButton>
    </MkGrid>

    <template #footer>
      <MkText as="p" size="sm">
        New to ModeKit?
        <MkLink href="#create-account" primary weight="semibold">Create an account</MkLink>
      </MkText>
    </template>
  </MkCard>
</template>
