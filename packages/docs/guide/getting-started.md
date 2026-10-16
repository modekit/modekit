# Getting started

ModeKit is experimental and has not reached a stable public release. The commands below describe the
consumer setup for `@modekit/vue` once the package is published.

## Requirements

- Vue `^3.5.0`
- Node.js `>=22.22.2` for installation and build tooling
- TypeScript `>=5.0.4` when consuming package declarations

## Install

```sh
pnpm add @modekit/vue
```

Import the compiled stylesheet once in the application entry. Applications do not need Tailwind to
render ModeKit's built-in components.

```ts
// main.ts
import { createApp } from 'vue'
import { createModeKit } from '@modekit/vue'
import '@modekit/vue/styles.css'
import App from './App.vue'

createApp(App)
  .use(
    createModeKit({
      theme: {
        primary: 'green',
        neutral: 'slate',
      },
    }),
  )
  .mount('#app')
```

The plugin is optional. It configures document-global palette families and component defaults. When
it is omitted, ModeKit uses a black primary and zinc neutral theme.

## Render a component

```vue
<script setup lang="ts">
import { MkButton, MkCard } from '@modekit/vue'
</script>

<template>
  <MkCard>
    <template #header>Project ready</template>
    ModeKit is installed and its compiled styles are loaded.
    <template #footer>
      <MkButton>Continue</MkButton>
    </template>
  </MkCard>
</template>
```

## Optional Preflight

Use ModeKit's separate Tailwind Preflight export only when ModeKit should own the application's
global element reset:

```ts
import '@modekit/vue/preflight.css'
import '@modekit/vue/styles.css'
```

Import Preflight first. Do not import it when another framework or application reset already owns
global defaults.

## Next steps

- Review [Styling](./styling) for CSS loading, theming, SSR, and portal behavior.
- Review the [compatibility contract](./compatibility) before depending on customization details.
- Browse the [component documentation](../components/) for typed APIs and examples.
