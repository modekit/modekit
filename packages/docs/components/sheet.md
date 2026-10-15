# Sheet <Badge type="warning" text="Alpha" />

Sheet presents a focused panel from a viewport edge. It combines Dialog-grade focus management and
accessible labelling with touch and pointer swipe dismissal, direction-aware motion, responsive
axis-based sizing, and composable content regions.

::: warning Alpha
`MkSheet` is built on Reka UI's alpha Drawer primitive. ModeKit pins the exact Reka UI version and
exposes a narrower, ModeKit-owned API, but Sheet behavior or API may still change before it is
promoted to stable. Avoid using it where minor-version API stability is mandatory.
:::

## Usage

<ComponentPreview name="sheet/SheetBasic" />

The default slot supplies an optional trigger and must contain exactly one interactive element.
`title` and `description` provide the accessible header, `content` creates the independently
scrollable body, and `footer` creates the persistent action row. Body and footer slots receive
`open` and `close` so they can complete a workflow without separately owning visibility state.

Every Sheet must have an accessible title. Supply the `title` prop or `title` slot.

## Placement, size, and surface variant

<ComponentPreview name="sheet/SheetPlacement" />

`side` chooses the attached viewport edge and swipe-dismiss direction. The default is `right`.
`size` follows the active axis:

- Left and right sheets use responsive widths.
- Top and bottom sheets use maximum viewport heights.

`variant="edge"` attaches the panel directly to its selected viewport edge. `variant="inset"`
adds a consistent gutter, full border, and radius on every corner. Both variants stay within the
viewport and use the same gesture, focus, and accessibility behavior.

## Swipe dismissal and handle

<ComponentPreview name="sheet/SheetSwipe" />

Sheet content can be swiped toward its attached edge to dismiss it. Set `handle` to render a
visual, direction-aware drag affordance. The handle is decorative: the complete panel remains
swipeable, so do not describe the handle as the only draggable area.

The swipe engine publishes movement through Reka UI's internal CSS custom properties. ModeKit
composes those values with enter and exit motion rather than replacing them, keeping the panel
attached to the pointer while dragging.

## Header actions

<ComponentPreview name="sheet/SheetHeaderActions" />

The `actions` slot adds compact controls beside the semantic title and description without replacing
the accessible header structure. It receives the same `open` and `close` helpers as body and footer
content. Use it for secondary actions; keep the workflow's primary action in `footer`.

## Controlled state and dismissal policy

<ComponentPreview name="sheet/SheetControlled" />

Use `v-model:open` when application state owns visibility. A controlled Sheet does not require a
trigger. Use `default-open` for initially open uncontrolled state.

Sheet is dismissible by default. Set `dismissible` to `false` to block passive closure from:

- Swipe dismissal
- Escape
- Outside press

An attempted passive close emits `close-prevented` with its reason. Explicit close controls,
including the built-in close button and the slot `close()` action, remain available. This prevents
applications from accidentally creating a panel with no reachable exit.

`after-open` and `after-close` fire only after the primitive reports that its enter or exit transition
has completed. Use them for post-transition measurement or cleanup instead of guessing animation
durations.

## Nested sheets

<ComponentPreview name="sheet/SheetNested" />

Sheets can be composed inside another Sheet's slots. Reka UI context automatically coordinates
nested swipe state and suppresses duplicate nested overlays, so no `nested` prop is required. Keep
nesting shallow and use it only when the secondary task is subordinate to the first.

## Responsive Dialog and Sheet

A common pattern is a centered Dialog on larger screens and a bottom Sheet on smaller screens. Keep
one state owner and reuse the same form content; choose the overlay component at the responsive
boundary rather than duplicating business logic.

```vue
<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { ref } from 'vue'

const open = ref(false)
const isDesktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <MkButton @click="open = true">Edit profile</MkButton>

  <MkDialog
    v-if="isDesktop"
    v-model:open="open"
    title="Edit profile"
    description="Update the public details shown on your profile."
  >
    <template #content><ProfileForm /></template>
  </MkDialog>

  <MkSheet
    v-else
    v-model:open="open"
    side="bottom"
    title="Edit profile"
    description="Update the public details shown on your profile."
  >
    <template #content><ProfileForm /></template>
  </MkSheet>
</template>
```

## Features

- Explicitly Alpha with an exact pinned Reka UI dependency
- ModeKit-owned public types instead of re-exported alpha primitive contracts
- Controlled, uncontrolled, and triggerless programmatic open state
- Top, right, bottom, and left placement with matching swipe direction
- Axis-aware responsive size scale
- Edge and inset surface variants
- Touch and pointer swipe-to-dismiss behavior
- Optional direction-aware visual handle
- Semantic header actions and nested Sheet composition
- Transition-complete lifecycle events
- Modal focus trapping, background hiding, scroll locking, and focus restoration
- Optional non-modal operation
- Passive dismissal opt-out with a typed prevention reason
- Accessible title and optional description relationships
- Custom initial and final focus targets
- Independently scrollable body with persistent header and footer regions
- Body portal by default, inline rendering, and custom portal targets
- Built-in accessible close control with custom label and graphic
- Optional persistent mounting
- Light and dark surfaces, reduced-motion handling, and coordinated overlay motion
- Global configuration, local slot classes, and native panel-class overrides

## API

### Props

| Prop            | Type                                     | Default         | Description                                                        |
| --------------- | ---------------------------------------- | --------------- | ------------------------------------------------------------------ |
| `as`            | `string \| Component`                    | `'div'`         | Changes the sheet content element.                                 |
| `title`         | `string`                                 | —               | Supplies the required accessible title.                            |
| `description`   | `string`                                 | —               | Supplies optional supporting text.                                 |
| `open`          | `boolean`                                | —               | Controls the open state.                                           |
| `defaultOpen`   | `boolean`                                | `false`         | Sets the initial uncontrolled open state.                          |
| `modal`         | `boolean`                                | `true`          | Traps focus and blocks background interaction while open.          |
| `dismissible`   | `boolean`                                | `true`          | Allows swipe, Escape, and outside-press dismissal.                 |
| `unmountOnHide` | `boolean`                                | `true`          | Unmounts sheet content after its close transition.                 |
| `side`          | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'`       | Selects the attached edge and swipe direction.                     |
| `size`          | `'sm' \| 'md' \| 'lg' \| 'xl'`           | `'md'`          | Selects width for side sheets or maximum height for vertical ones. |
| `variant`       | `'edge' \| 'inset'`                      | `'edge'`        | Attaches to the edge or adds a viewport gutter and full radius.    |
| `handle`        | `boolean`                                | `false`         | Renders a decorative direction-aware drag affordance.              |
| `overlay`       | `boolean`                                | `true`          | Renders the modal backdrop.                                        |
| `closeButton`   | `boolean`                                | `true`          | Renders the built-in top-right close control.                      |
| `closeLabel`    | `string`                                 | `'Close sheet'` | Sets the close control's accessible name.                          |
| `initialFocus`  | `boolean \| HTMLElement \| null`         | `true`          | Selects automatic focus behavior when opening.                     |
| `finalFocus`    | `boolean \| HTMLElement \| null`         | `true`          | Selects focus restoration behavior when closing.                   |
| `portal`        | `boolean \| string \| HTMLElement`       | `true`          | Portals to body, renders inline, or selects a custom target.       |
| `ui`            | `SheetUI`                                | —               | Adds classes to the panel and structural slots.                    |

Native attributes and listeners apply to the sheet content element. Native `class` resolves after
built-in, global, and local panel classes. The trigger remains consumer-owned.

### Events

| Event                | Payload            | Description                                                  |
| -------------------- | ------------------ | ------------------------------------------------------------ |
| `update:open`        | `boolean`          | Emitted when an accepted open-state change is requested.     |
| `afterOpen`          | —                  | Emitted after the opening transition completes.              |
| `afterClose`         | —                  | Emitted after the closing transition completes.              |
| `closePrevented`     | `SheetCloseReason` | Emitted when non-dismissible policy rejects passive closure. |
| `escapeKeyDown`      | `KeyboardEvent`    | Emitted when Escape is pressed while the Sheet is active.    |
| `pointerDownOutside` | `Event`            | Emitted for a pointer press outside the panel.               |
| `focusOutside`       | `Event`            | Emitted when focus attempts to leave the panel.              |
| `interactOutside`    | `Event`            | Emitted for outside pointer or focus interaction.            |
| `openAutoFocus`      | `Event`            | Emitted before initial focus is selected.                    |
| `closeAutoFocus`     | `Event`            | Emitted before focus is restored.                            |

`SheetCloseReason` is a ModeKit-owned union. Passive prevention currently reports `swipe`,
`escape-key`, or `outside-press`; the wider union leaves explicit state-change reasons typed without
exporting Reka UI's alpha types.

### Slots

| Slot          | Props                              | Description                                       |
| ------------- | ---------------------------------- | ------------------------------------------------- |
| `default`     | —                                  | Supplies the optional single trigger element.     |
| `title`       | `{ title, open, close() }`         | Replaces title content inside the semantic title. |
| `description` | `{ description, open, close() }`   | Replaces semantic description content.            |
| `actions`     | `{ open: boolean, close(): void }` | Adds controls beside the semantic header text.    |
| `content`     | `{ open: boolean, close(): void }` | Supplies the independently scrollable body.       |
| `footer`      | `{ open: boolean, close(): void }` | Supplies the persistent action row.               |
| `close`       | —                                  | Replaces the built-in close graphic.              |

## Focus behavior

By default, Sheet focuses the first suitable element when opening and restores focus to its trigger
when closing. Pass `initial-focus="false"` or `final-focus="false"` to disable one stage, or pass an
`HTMLElement` to choose an explicit target.

Modal Sheet traps focus, hides background content from assistive technology, blocks outside pointer
interaction, and locks document scrolling. With `modal="false"`, outside content remains interactive
and the overlay is not rendered by the primitive.

## Portal behavior

Sheet uses a body portal by default. Pass `:portal="false"` for deliberate inline rendering, a CSS
selector for an application overlay root, or an `HTMLElement` for Shadow DOM placement.

Because portalled content leaves its source subtree, load `@modekit/vue/styles.css` in the portal's
document or shadow scope. Do not rely on ancestor-dependent application selectors for the panel.

## Accessibility

Every Sheet needs a meaningful title. Description is optional and is removed from the accessibility
relationship when omitted. The built-in close control has an accessible label and custom graphics
remain decorative.

Do not add a second focus trap, global Escape listener, or manual background-hiding implementation.
The underlying primitive already owns those responsibilities.

## Styling

`SheetUI` exposes `base`, `overlay`, `handle`, `container`, `header`, `wrapper`, `title`,
`description`, `actions`, `body`, `footer`, and `close`.

```vue
<MkSheet
  title="Workspace settings"
  :ui="{
    base: 'border-primary/30',
    overlay: 'bg-indigo-950/60',
    body: 'px-8',
    footer: 'justify-between',
  }"
>
  ...
</MkSheet>
```

Global configuration supports the same slots plus side and size defaults:

```ts
app.use(
  createModeKit({
    ui: {
      sheet: {
        base: 'border-neutral-300',
        variants: {
          side: { left: 'shadow-raised-lg' },
          size: { lg: 'w-[34rem]' },
          variant: { inset: 'ring-1 ring-primary/20' },
        },
        slots: {
          overlay: 'bg-black/60',
          footer: 'border-t border-neutral-200 pt-4',
        },
        defaultVariants: { side: 'left', size: 'lg', variant: 'inset' },
      },
    },
  }),
)
```

Arbitrary Tailwind classes passed through configuration, `ui`, or native `class` must be generated
by the consuming application. Ordinary CSS classes work without consumer Tailwind.

## Deferred alpha features

ModeKit deliberately does not expose Reka Drawer's snap points, swipe-to-open area, background
indentation, handle-only dragging, or virtual-keyboard provider configuration yet. Those interfaces
remain more likely to change while the upstream primitive is Alpha. They can be added as ModeKit-owned
contracts after focused validation.
