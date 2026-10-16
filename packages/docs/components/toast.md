# Toast

Toast delivers brief, time-limited feedback without interrupting the current task. `MkToastProvider`
owns the accessible viewport, timing, keyboard shortcut, stacking, and swipe policy; each `MkToast`
owns one notification's content, state, actions, and dismissal controls.

## Usage

<ComponentPreview name="toast/ToastBasic" />

Use the preview controls to test every `ModeKitColor`, the retained `variant` treatments, and viewport
`position`. Repeated **Add toast** calls append notifications to the visible stack.

Place one provider near the application root. Any descendant can then call `useToast()` without
managing a root component or `v-model` for each notification. The viewport is portalled to
`document.body` by default.

```vue [App.vue]
<template>
  <MkToastProvider>
    <RouterView />
  </MkToastProvider>
</template>
```

```vue [SaveButton.vue]
<script setup lang="ts">
import { useToast } from '@modekit/vue'

const toast = useToast()

function save() {
  toast.add({
    title: 'Changes saved',
    description: 'Your workspace settings are up to date.',
    color: 'neutral',
    variant: 'solid',
  })
}
</script>

<template>
  <MkButton @click="save">Save changes</MkButton>
</template>
```

`toast.add()` returns `{ id }`. Use that id with `update()` or `remove()`; `clear()` dismisses the
whole stack. Supplying an existing id updates and reopens that notification instead of duplicating it.
Manual `MkToast` roots remain available for controlled or deeply customized cases.

## Treatments and colors

<ComponentPreview name="toast/ToastVariants" />

`color` communicates meaning independently from `variant`. Toast defaults to `neutral` and `solid`
for a prominent application notification. Use `soft` for restrained semantic feedback and `outline`
for a neutral surface with a semantic edge. Unlike the shared translucent
soft treatment used by inline controls, Toast composites its tint over an opaque light or dark surface
so underlying page text never shows through the floating notification. Toast intentionally has no size
axis: notifications keep one compact, predictable reading and interaction target.

## Actions

<ComponentPreview name="toast/ToastAction" />

The `actions` prop and `ToastData.actions` accept multiple accessible actions. Each action supplies a
renderable `label`, `altText`, optional click handler, and optional `closeOnClick`; actions close the
toast by default. The `action` slot remains available for one fully custom action. Supply
`actionAltText` whenever that slot is present, and set `actionCloseOnClick="false"` when the custom
action must keep the notification visible.

The built-in close control uses Reka UI Toast close behavior and defaults to the accessible name
`Dismiss notification`. Customize `closeLabel` for context or replace only its graphic through the
`close` slot.

## Provider behavior

`MkToastProvider` defaults to a five-second duration, an F8 viewport shortcut, rightward swipe
dismissal, and a top-right viewport. Composable notifications accumulate in the viewport stack by
default. Hovering or focusing the viewport pauses timers; leaving it resumes them. Use
`type="background"` on background-task messages so their live-region announcement is polite rather
than assertive.

Set `limit` only when the application needs to cap simultaneous visible notifications. Change
`position` on the provider rather than individually positioning roots. Set `portal="false"` only for
deliberate inline layouts; pass a selector or `HTMLElement` for a custom overlay target.

## API

### `useToast()`

| Member                    | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| `toasts`                  | Read-only computed list of provider-managed notifications.                  |
| `add(data)`               | Adds a notification and returns `{ id }`; an existing id is updated/reused. |
| `update(id, partialData)` | Updates a notification and returns `{ id }`, or `undefined` when absent.    |
| `remove(id)`              | Dismisses one notification with its close animation.                        |
| `clear()`                 | Dismisses every provider-managed notification.                              |

`ToastData` accepts `id`, `title`, `description`, `icon`, `actions`, `duration`, `type`, `color`,
`variant`, close-control options, and `onUpdateOpen`. Title, description, icon, and action labels may
be text, VNodes, or render functions. Every action contains `label`, accessible `altText`, optional
`closeOnClick`, and an optional click handler.

### `MkToastProvider` props

| Prop             | Type                                                           | Default                      | Description                                                                 |
| ---------------- | -------------------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------- |
| `label`          | `string`                                                       | `'Notification'`             | Localized label used in toast announcements.                                |
| `duration`       | `number`                                                       | `5000`                       | Default visible duration in milliseconds; `0` disables automatic dismissal. |
| `disableSwipe`   | `boolean`                                                      | `false`                      | Disables swipe dismissal.                                                   |
| `swipeDirection` | `'up' \| 'down' \| 'left' \| 'right'`                          | `'right'`                    | Selects the accepted dismiss gesture.                                       |
| `swipeThreshold` | `number`                                                       | `50`                         | Required swipe distance in pixels.                                          |
| `limit`          | `number`                                                       | —                            | Limits simultaneous visible and interactive toasts.                         |
| `hotkey`         | `string[]`                                                     | `['F8']`                     | Focuses the viewport for keyboard users.                                    |
| `viewportLabel`  | `string \| (hotkey) => string`                                 | `'Notifications ({hotkey})'` | Labels the viewport region.                                                 |
| `position`       | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'top-right'`                | Positions the viewport.                                                     |
| `portal`         | `boolean \| string \| HTMLElement`                             | `true`                       | Portals to body, renders inline, or selects a target.                       |
| `ui`             | `{ viewport? }`                                                | —                            | Adds classes to the viewport.                                               |

Native attributes and `class` are forwarded to the viewport. The default slot contains application
content and Toast roots.

### `MkToast` props

| Prop                 | Type                             | Default                  | Description                                                    |
| -------------------- | -------------------------------- | ------------------------ | -------------------------------------------------------------- |
| `as`                 | `string \| Component`            | `'li'`                   | Changes the Toast root element.                                |
| `open`               | `boolean`                        | —                        | Controls visibility.                                           |
| `defaultOpen`        | `boolean`                        | `true`                   | Sets initial uncontrolled visibility.                          |
| `forceMount`         | `boolean`                        | `false`                  | Keeps the primitive mounted for external animation control.    |
| `duration`           | `number`                         | provider value           | Overrides this Toast's duration.                               |
| `type`               | `'foreground' \| 'background'`   | `'foreground'`           | Selects assertive or polite announcement priority.             |
| `color`              | `ModeKitColor`                   | `'neutral'`              | Sets semantic color.                                           |
| `variant`            | `'solid' \| 'soft' \| 'outline'` | `'solid'`                | Sets surface treatment.                                        |
| `title`              | `string`                         | —                        | Supplies the concise Toast title.                              |
| `description`        | `string`                         | —                        | Supplies supporting content when the default slot is not used. |
| `actions`            | `readonly ToastActionData[]`     | —                        | Renders any number of accessible actions.                      |
| `actionAltText`      | `string`                         | —                        | Required accessible alternative when `action` is rendered.     |
| `actionCloseOnClick` | `boolean`                        | `true`                   | Closes after action activation.                                |
| `closeButton`        | `boolean`                        | `true`                   | Renders the built-in close control.                            |
| `closeLabel`         | `string`                         | `'Dismiss notification'` | Labels the close control.                                      |
| `ui`                 | `ToastUI`                        | —                        | Adds classes to the root and named slots.                      |

All other attributes and native `class` apply to the Toast root.

### Events

| Event                                                   | Payload           | Description                                                        |
| ------------------------------------------------------- | ----------------- | ------------------------------------------------------------------ |
| `update:open`                                           | `boolean`         | Emitted for timer, Escape, action, close, and swipe state changes. |
| `action`                                                | `MouseEvent`      | Emitted when the built-in action is activated.                     |
| `escapeKeyDown`                                         | `KeyboardEvent`   | Emitted before Escape dismisses the focused Toast.                 |
| `pause` / `resume`                                      | —                 | Emitted when the dismissal timer pauses or resumes.                |
| `swipeStart` / `swipeMove` / `swipeCancel` / `swipeEnd` | `ToastSwipeEvent` | Exposes preventable swipe lifecycle events and pointer deltas.     |

### Slots

Toast content slots receive `{ open, remaining, duration }`. `title` also receives the `title` prop,
the default slot receives `description`, `action` receives `altText`, and `close` receives `label`.
The `icon` wrapper is decorative and hidden from assistive technology.

## Styling

`ToastUI` exposes `base`, `body`, `icon`, `content`, `title`, `description`, `action`, and `close`.
`ToastProviderUI` exposes `viewport`. Resolution follows ModeKit conventions: built-in CVA recipe →
global configuration → local `ui` → native root or viewport `class`.

```ts
app.use(
  createModeKit({
    ui: {
      toast: {
        base: 'shadow-xl',
        slots: { title: 'tracking-tight' },
        variants: { variant: { outline: 'border-2' } },
        defaultVariants: { color: 'blue', variant: 'soft' },
      },
      toastProvider: {
        base: 'p-6',
        variants: { position: { 'bottom-right': 'max-w-lg' } },
        defaultVariants: { position: 'bottom-right' },
      },
    },
  }),
)
```

Toast roots include open, close, swipe-move, swipe-cancel, and swipe-end styling driven by Reka UI data
attributes and swipe variables. Enter, exit, and completed-swipe animations are disabled under
`prefers-reduced-motion`; direct pointer movement remains responsive.

## Accessibility

Keep titles concise and reinforce color or icons with text. Use `foreground` only for feedback caused
by an immediate user action; choose `background` for asynchronous updates. The provider exposes the
viewport as a labelled region and lets keyboard users focus it with F8 by default. Timer dismissal
pauses while users hover or focus the viewport. Every action needs meaningful `actionAltText`, and a
custom close graphic remains decorative because the button keeps `closeLabel` as its accessible name.
