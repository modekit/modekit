# @modekit/vue

Accessible, typed Vue 3 components with compiled CSS and configurable primary and neutral palettes.
ModeKit is experimental and has not reached a stable public release.

## Requirements

- Vue `^3.5.0`
- Node.js `>=22.22.2` for installation and build tooling
- TypeScript `>=5.0.4` when consuming package declarations

## Install

```sh
pnpm add @modekit/vue
```

Import the compiled component stylesheet once in the application entry:

```ts
import '@modekit/vue/styles.css'
```

Applications using ModeKit as their CSS foundation may opt into Tailwind Preflight. Import it before
the component stylesheet; omit it when another reset already owns global element defaults.

```ts
import '@modekit/vue/preflight.css'
import '@modekit/vue/styles.css'
```

## Usage

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

```vue
<!-- App.vue -->
<script setup lang="ts">
import { MkButton, MkCard } from '@modekit/vue'
</script>

<template>
  <MkCard>
    <template #header>Welcome to ModeKit</template>
    Build the next application screen with documented Vue APIs.
    <template #footer>
      <MkButton>Continue</MkButton>
    </template>
  </MkCard>
</template>
```

`createModeKit()` is optional. Without it, components use the default black primary and zinc neutral
theme. Palette selection is document-global; SSR hosts must put matching theme attributes on the
initial HTML.

## Documentation

- [Getting started](https://github.com/modekit/modekit/blob/main/packages/docs/guide/getting-started.md)
- [Styling and theme behavior](https://github.com/modekit/modekit/blob/main/packages/docs/guide/styling.md)
- [Compatibility contract](https://github.com/modekit/modekit/blob/main/packages/docs/guide/compatibility.md)
- [Components](https://github.com/modekit/modekit/tree/main/packages/docs/components)

Only the package root, `@modekit/vue/styles.css`, and optional `@modekit/vue/preflight.css` are
public import paths. Deep imports are unsupported.

## License

[MIT](LICENSE) © 2026 ModeKit
