# Avatar

Avatars represent people, teams, and entities with an image or a dependable fallback. `MkAvatar`
composes Reka UI's Avatar root, image, and fallback primitives so failed and pending images switch to
fallback content without application-side loading state.

## Usage

### Image and fallback

Provide `src` and `alt` for an image, and `fallback` for initials or another short label. If `src` is
omitted or the image cannot load, Reka renders the fallback. Use `size` to keep image and fallback
geometry aligned; it defaults to `md`.

<ComponentPreview name="avatar/AvatarBasic" />

Available sizes are `xs`, `sm`, `md`, `lg`, and `xl`.

### Icon

The default slot replaces fallback text, making icons and other compact custom fallback content
possible without `src`, `alt`, or `fallback`. Direct SVG children inherit the selected Avatar size.
The example uses Lucide's `UserRound` icon.

<ComponentPreview name="avatar/AvatarIcon" />

### Color

Use `color` to set the semantic fallback surface and foreground. It defaults to `secondary` and is
independent from the optional status badge. Available colors are `primary`, `secondary`, `success`,
`warning`, `info`, and `destructive`.

### Square

Avatar is circular by default. Use `square` for size-appropriate rounded square corners.

<ComponentPreview name="avatar/AvatarSquare" />

### Status badge

Use `badge` to add a decorative status dot. `badgeColor` controls the dot independently from the
Avatar fallback and defaults to `success`. `badgePosition` accepts `top-left`, `top-right`,
`bottom-left`, and `bottom-right`, and defaults to `bottom-right`.

<ComponentPreview name="avatar/AvatarBadge" />

### Groups

Use [Avatar Group](/components/avatar-group) to arrange multiple Avatars with shared sizing,
overlap, and an optional `+N` overflow indicator.

### Root element

Avatar renders a `<span>` by default. Use `as` to render another HTML element or Vue component. Root
attributes such as `aria-label`, `role`, `title`, and `data-*` are forwarded to that element.

```vue
<MkAvatar as="div" fallback="MK" role="img" aria-label="ModeKit" />
```

## API

### Props

| Prop             | Type                                                                            | Default          | Description                                                   |
| ---------------- | ------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------- |
| `as`             | `AsTag \| Component`                                                            | `'span'`         | Changes the rendered root element or component.               |
| `src`            | `string`                                                                        | —                | Image source; omit it to render only fallback content.        |
| `alt`            | `string`                                                                        | `''`             | Native alternative text forwarded to the image.               |
| `fallback`       | `string`                                                                        | —                | Short fallback content, usually initials.                     |
| `delayMs`        | `number`                                                                        | —                | Delays fallback rendering through Reka's fallback primitive.  |
| `color`          | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'info' \| 'destructive'` | `'secondary'`    | Sets fallback semantic color.                                 |
| `size`           | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                          | `'md'`           | Sets root, fallback text, icon, and badge dimensions.         |
| `square`         | `boolean`                                                                       | `false`          | Replaces the circular shape with rounded square corners.      |
| `badge`          | `boolean`                                                                       | `false`          | Renders a decorative status badge.                            |
| `badgeColor`     | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'info' \| 'destructive'` | `'success'`      | Sets the badge color independently from `color`.              |
| `badgePosition`  | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'`                  | `'bottom-right'` | Positions the status badge.                                   |
| `referrerPolicy` | `ImgHTMLAttributes['referrerpolicy']`                                           | —                | Controls referrer information for the image request.          |
| `crossOrigin`    | `ImgHTMLAttributes['crossorigin']`                                              | —                | Configures the image's CORS request mode.                     |
| `loading`        | `ImgHTMLAttributes['loading']`                                                  | —                | Forwards native eager or lazy loading behavior.               |
| `decoding`       | `ImgHTMLAttributes['decoding']`                                                 | —                | Forwards the native image decoding hint.                      |
| `ui`             | `{ base?, image?, fallback?, badge? }`                                          | —                | Adds or overrides classes for this Avatar instance and slots. |

### Events

| Event                 | Payload                                      | Description                              |
| --------------------- | -------------------------------------------- | ---------------------------------------- |
| `loadingStatusChange` | `'idle' \| 'loading' \| 'loaded' \| 'error'` | Forwards Reka's image loading lifecycle. |

### Slots

| Slot      | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| `default` | Replaces `fallback` text inside Reka's fallback layer, often with an icon. |

## Styling

Avatar is circular by default and clips its image with `overflow-hidden`. The image fills the root
with `object-cover`; fallback and status badge colors use ModeKit's semantic theme roles.

### Local overrides

```vue
<MkAvatar
  src="/avatar.jpg"
  alt="John Doe"
  fallback="JD"
  badge
  color="secondary"
  badge-color="success"
  :ui="{
    base: 'ring-2 ring-primary/30',
    image: 'grayscale',
    fallback: 'font-bold tracking-wide',
    badge: 'ring-4',
  }"
/>
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
      avatar: {
        base: 'ring-1 ring-border',
        slots: {
          image: 'saturate-90',
          fallback: 'tracking-wide',
          badge: 'ring-4',
        },
        variants: {
          color: {
            info: 'ring-info/30',
          },
          badgeColor: {
            warning: 'outline outline-warning/30',
          },
          size: {
            xl: 'ring-2',
          },
          square: {
            true: 'shadow-raised-sm',
          },
          badgePosition: {
            'top-right': 'm-0.5',
          },
        },
        defaultVariants: {
          color: 'secondary',
          badgeColor: 'success',
          size: 'md',
          square: false,
          badgePosition: 'bottom-right',
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

Use meaningful `alt` text when the image conveys information not already present nearby. Use
`alt=""` for a decorative avatar next to the same visible name. Initials and decorative icons do not
always provide an unambiguous accessible name, so add `aria-label` to the root when the avatar stands
alone. The status badge is decorative and hidden from assistive technology; when it communicates a
real state, include that state in the root's accessible label or adjacent visible text. Keep text
fallbacks short enough to fit at every supported size.
