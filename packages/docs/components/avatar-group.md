# Avatar Group

Avatar Groups arrange related Avatars into a compact, accessible stack. `MkAvatarGroup` owns layout,
shared sizing, overlap, and overflow while each `MkAvatar` continues to own its image, fallback,
shape, color, and status.

## Usage

### Shared size and overlap

Place direct `MkAvatar` children in the default slot. The group provides its `size` to every Avatar
that does not set an explicit size. `spacing` controls overlap with `tight`, `normal`, and `loose`
options and defaults to `normal`.

<ComponentPreview name="avatar-group/AvatarGroupBasic" />

A child can opt out of shared sizing when a deliberate exception is needed:

```vue
<MkAvatarGroup size="lg" aria-label="Project members">
  <MkAvatar fallback="JD" aria-label="John Doe" />
  <MkAvatar fallback="JS" size="sm" aria-label="Jane Smith" />
</MkAvatarGroup>
```

### Overflow

Use `max` to set how many member Avatars remain visible. When more members exist, the group appends a
same-size `+N` Avatar. `overflowColor` changes only that indicator and defaults to `secondary`.

<ComponentPreview name="avatar-group/AvatarGroupOverflow" />

`max` counts visible member Avatars; the generated overflow indicator is additional. It accepts any
non-negative integer, so `max="0"` can represent the entire collection through one overflow Avatar.

### Custom overflow content

The `overflow` slot replaces `+N` inside the generated overflow Avatar and receives the hidden
`count`. Its geometry, inherited size, semantic color, and group overlap remain intact.

```vue
<MkAvatarGroup :max="2" overflow-label="Additional reviewers" aria-label="Reviewers">
  <MkAvatar fallback="JD" aria-label="John Doe" />
  <MkAvatar fallback="JS" aria-label="Jane Smith" />
  <MkAvatar fallback="AB" aria-label="Alice Brown" />

  <template #overflow="{ count }">
    <span>{{ count }} more</span>
  </template>
</MkAvatarGroup>
```

### Root element

Avatar Group renders a `<div role="group">` by default. Use `as` to select another root element or
component. Native attributes and an explicit `role` are forwarded.

```vue
<MkAvatarGroup as="section" role="region" aria-label="Project members">
  <!-- Avatars -->
</MkAvatarGroup>
```

## API

### Props

| Prop            | Type                                                                            | Default         | Description                                                    |
| --------------- | ------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------- |
| `as`            | `AsTag \| Component`                                                            | `'div'`         | Changes the rendered root element or component.                |
| `size`          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                          | `'md'`          | Provides a shared size to Avatar descendants.                  |
| `spacing`       | `'tight' \| 'normal' \| 'loose'`                                                | `'normal'`      | Controls overlap between direct Avatar children.               |
| `max`           | `number`                                                                        | —               | Limits visible members before a `+N` indicator is appended.    |
| `overflowColor` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'info' \| 'destructive'` | `'secondary'`   | Sets the overflow Avatar's semantic color.                     |
| `overflowLabel` | `string`                                                                        | Generated count | Overrides the overflow Avatar's accessible label.              |
| `ui`            | `{ base?, item?, overflow? }`                                                   | —               | Adds or overrides classes for the root, members, and overflow. |

### Slots

| Slot       | Props               | Description                                                    |
| ---------- | ------------------- | -------------------------------------------------------------- |
| `default`  | —                   | Direct Avatar children to arrange, size, and optionally limit. |
| `overflow` | `{ count: number }` | Replaces `+N` inside the generated overflow Avatar.            |

## Styling

The root uses an isolated inline flex stacking context. Every direct Avatar receives a two-pixel
`background` ring so overlapping faces remain distinct. Hovered and focused Avatars rise above their
neighbors without changing layout.

### Local overrides

```vue
<MkAvatarGroup
  size="lg"
  spacing="tight"
  :max="3"
  :ui="{
    base: 'rounded-lg bg-muted p-2',
    item: 'shadow-sm',
    overflow: 'font-bold',
  }"
>
  <!-- Avatars -->
</MkAvatarGroup>
```

### Global component configuration

```ts
import { createApp } from 'vue'
import { createModeKit } from '@modekit/vue'
import App from './App.vue'

const app = createApp(App)

app.use(
  createModeKit({
    ui: {
      avatarGroup: {
        base: 'rounded-lg',
        slots: {
          item: 'shadow-sm',
          overflow: 'font-semibold',
        },
        variants: {
          size: {
            xl: 'p-1',
          },
          spacing: {
            loose: 'gap-px',
          },
          overflowColor: {
            warning: 'outline outline-warning/30',
          },
        },
        defaultVariants: {
          size: 'md',
          spacing: 'normal',
          overflowColor: 'secondary',
        },
      },
    },
  }),
)

app.mount('#app')
```

Resolution order is: built-in recipe → global base/axis/slot config → local `ui` → native root
`class`.

ModeKit ships the utilities used by its built-in recipe. Additional Tailwind utilities supplied by
an application require that application's own Tailwind build; ordinary CSS classes remain supported.

## Accessibility

Give the group an `aria-label` when its surrounding content does not already identify the collection.
Keep each meaningful Avatar labeled through image `alt`, root `aria-label`, or adjacent visible text.
The generated overflow Avatar announces its hidden count as `1 more member` or `N more members`; use
`overflowLabel` to localize or provide more specific context. Hidden members are not rendered when `max` applies, so the
overflow label should communicate that additional people exist.
