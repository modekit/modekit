# Dialog

Dialog presents a focused workflow above the application. It manages modal focus, background
interaction, Escape and outside-pointer dismissal, focus restoration, scroll locking, portal
rendering, accessible labelling, and responsive panel sizing while keeping the body and actions
composable.

## Usage

<ComponentPreview name="dialog/DialogBasic" />

The default slot supplies the optional trigger and must contain exactly one interactive element.
Dialog augments that element directly rather than adding a wrapper. `title` and `description` create
the accessible header, `content` creates the independently scrollable body, and `footer` creates the
action row. Body and footer slots receive `open` and `close`, so actions can complete the workflow
without owning external state.

Dialog is intended for blocking tasks that require deliberate focus. Use Popover for lightweight
anchored interaction, Hover Card for supplementary hover or focus details, and Tooltip for concise
non-interactive labels.

## Sizes

<ComponentPreview name="dialog/DialogSize" />

`size` selects a curated maximum width while the panel remains one viewport gutter from every edge.
All sizes collapse fluidly on narrow screens. The default is `md`; choose `sm` for brief tasks, `lg`
for denser forms, and `xl` only for workflows that genuinely need more horizontal structure.

## Animation

<ComponentPreview name="dialog/DialogAnimation" />

`animation` controls how the panel enters and leaves. The default `scale` animation uses a deliberate
size change from the panel's visual center, making the transition clearly visible without changing
its centered position. Use `fade` for the quietest transition, `slide-up` or `slide-down` for more
pronounced directional movement, and `none` to disable both panel and overlay animation. All animated
variants continue to honor the user's reduced-motion preference.

## Controlled and programmatic state

<ComponentPreview name="dialog/DialogControlled" />

Use `v-model:open` when application state owns visibility. A controlled Dialog does not require a
trigger slot, which supports route, command, or application-event driven workflows. Use
`default-open` for an initially open otherwise uncontrolled Dialog. The trigger, built-in close
button, Escape key, outside interaction, and `close` slot action all request state changes through
`update:open`.

## Dismissal behavior

<ComponentPreview name="dialog/DialogBehavior" />

Dialog is modal and dismissible by default. Set `dismissible` to `false` when Escape and outside
pointer or focus interaction must not abandon the workflow. If `close-button` is also false, provide
an obvious action that calls the `close` slot function. Do not create a workflow with no reachable
way to leave it.

`modal="false"` permits interaction outside the Dialog and disables modal focus containment and
background hiding. This is an advanced behavior; use Popover instead when content is naturally
anchored to a trigger.

## Long content

<ComponentPreview name="dialog/DialogScrollable" />

The panel never exceeds the viewport. The body owns vertical scrolling while the title,
description, close control, and footer remain visible. Keep the primary action in `footer` so it
does not disappear inside a long form.

## Persistent content

<ComponentPreview name="dialog/DialogPersistent" />

Dialog content unmounts after closing by default. Set `unmount-on-hide` to `false` when local DOM or
component state must survive repeated openings. Hidden persistent content remains in the DOM, so use
this only when preserving state is more valuable than releasing the subtree.

## Features

- Controlled, uncontrolled, and triggerless programmatic open state
- Modal focus trapping, background interaction blocking, and document scroll locking
- Escape and outside-interaction dismissal with a complete opt-out
- Focus restoration to the trigger and preventable focus lifecycle events
- Accessible title and description relationships
- Four responsive panel sizes with viewport-safe width and height
- Five animation modes with centered scale motion and a no-animation option
- Independently scrollable body with persistent header and footer regions
- Body portal by default, inline rendering, and custom portal targets
- Built-in accessible close button with custom label and graphic
- Optional persistent mounting for local state retention
- Light and dark surfaces, reduced-motion handling, and coordinated panel/overlay transitions
- Global configuration, local slot classes, and native content-class overrides

## API

### Props

| Prop            | Type                                                        | Default          | Description                                                      |
| --------------- | ----------------------------------------------------------- | ---------------- | ---------------------------------------------------------------- |
| `as`            | `string \| Component`                                       | `'div'`          | Changes the dialog content element.                              |
| `title`         | `string`                                                    | —                | Supplies the accessible dialog title.                            |
| `description`   | `string`                                                    | —                | Supplies supporting text associated with the dialog.             |
| `open`          | `boolean`                                                   | —                | Controls the open state.                                         |
| `defaultOpen`   | `boolean`                                                   | `false`          | Sets the initial uncontrolled open state.                        |
| `modal`         | `boolean`                                                   | `true`           | Traps focus and blocks background interaction while open.        |
| `dismissible`   | `boolean`                                                   | `true`           | Allows Escape and outside-interaction dismissal.                 |
| `unmountOnHide` | `boolean`                                                   | `true`           | Unmounts dialog content after its close transition.              |
| `size`          | `'sm' \| 'md' \| 'lg' \| 'xl'`                              | `'md'`           | Selects the responsive maximum panel width.                      |
| `animation`     | `'scale' \| 'fade' \| 'slide-up' \| 'slide-down' \| 'none'` | `'scale'`        | Selects the coordinated panel and overlay transition.            |
| `closeButton`   | `boolean`                                                   | `true`           | Renders the built-in top-right close control.                    |
| `closeLabel`    | `string`                                                    | `'Close dialog'` | Sets the built-in close control's accessible name.               |
| `portal`        | `boolean \| string \| HTMLElement`                          | `true`           | Portals to the body, renders inline, or selects a custom target. |
| `ui`            | `DialogUI`                                                  | —                | Adds classes to the panel and its structural slots.              |

Native attributes and listeners apply to the dialog content element. Native `class` resolves after
built-in, global, and local panel classes. The trigger remains consumer-owned and receives only the
state and relationship attributes required by the dialog primitive.

### Events

| Event                | Payload         | Description                                                |
| -------------------- | --------------- | ---------------------------------------------------------- |
| `update:open`        | `boolean`       | Emitted whenever the requested open state changes.         |
| `escapeKeyDown`      | `KeyboardEvent` | Emitted when Escape is pressed while the dialog is active. |
| `pointerDownOutside` | `Event`         | Emitted for pointer interaction outside the panel.         |
| `focusOutside`       | `Event`         | Emitted when focus attempts to move outside the panel.     |
| `interactOutside`    | `Event`         | Emitted for either outside pointer or focus interaction.   |
| `openAutoFocus`      | `Event`         | Emitted before initial dialog focus is selected.           |
| `closeAutoFocus`     | `Event`         | Emitted before focus is restored after closing.            |

Preventing a lifecycle event customizes its corresponding behavior. When `dismissible` is false,
Dialog emits and then prevents Escape and outside-interaction dismissal.

### Slots

| Slot          | Props                              | Description                                            |
| ------------- | ---------------------------------- | ------------------------------------------------------ |
| `default`     | —                                  | Supplies the optional single trigger element.          |
| `title`       | `{ title, open, close() }`         | Replaces title content inside the semantic title.      |
| `description` | `{ description, open, close() }`   | Replaces content inside the semantic description.      |
| `content`     | `{ open: boolean, close(): void }` | Supplies the independently scrollable body.            |
| `footer`      | `{ open: boolean, close(): void }` | Supplies the persistent action row.                    |
| `close`       | —                                  | Replaces the graphic inside the built-in close button. |

The `title` and `description` props remain available to their slots as fallback data, making it
possible to add rich markup without moving copy into a second source of truth.

## Portal behavior

The default body portal keeps the modal clear of clipping, transformed ancestors, and local stacking
contexts. Set `:portal="false"` only when inline rendering is intentionally required. Pass a selector
or `HTMLElement` when an application owns a dedicated overlay container.

```vue
<!-- Body portal (default) -->
<MkDialog title="Preferences">...</MkDialog>

<!-- Inline layer -->
<MkDialog title="Preview" :portal="false">...</MkDialog>

<!-- Application overlay container -->
<MkDialog title="Preferences" portal="#app-overlays">...</MkDialog>
<MkDialog title="Preferences" :portal="overlayElement">...</MkDialog>
```

Because portalled content leaves its source subtree, application selectors that depend on that
subtree do not apply to it. Import `@modekit/vue/styles.css` in document scope and prefer ModeKit
configuration, `ui`, native panel classes, CSS variables, or selectors attached directly to the
panel.

When ModeKit is rendered inside a Shadow DOM and its stylesheet exists only in that shadow root,
pass an element inside the styled shadow root as the portal target, or load ModeKit CSS in both the
document and shadow scopes.

## Focus lifecycle

On open, Dialog moves focus to the first suitable control and traps Tab navigation inside modal
content. On close, focus returns to the trigger when one exists. Prevent `open-auto-focus` to place
initial focus yourself, or prevent `close-auto-focus` when the application must restore focus to a
different control.

```vue
<MkDialog
  title="Create project"
  @open-auto-focus="onOpenAutoFocus"
  @close-auto-focus="onCloseAutoFocus"
>
  <MkButton>New project</MkButton>
  <template #content>...</template>
</MkDialog>
```

## Accessibility

Every Dialog must have an accessible title. Supply `title` or the `title` slot; the resulting
semantic title is automatically connected through `aria-labelledby`. Supply `description` or its
slot when supporting context helps users understand the task. Keep the built-in close button's
`close-label` specific when multiple modal concepts exist, and ensure a custom close graphic remains
decorative.

Modal Dialog handles focus containment, background hiding, scroll locking, Escape, and focus
restoration. Do not manually add competing focus traps or global keyboard listeners. Destructive
confirmation belongs in a dedicated Alert Dialog rather than relying on `dismissible="false"` alone.

## Styling

`DialogUI` exposes `base`, `overlay`, `header`, `title`, `description`, `body`, `footer`, and `close`.
The panel uses the shared neutral surface, radius, and highest elevation scales. The overlay and
panel coordinate their transitions and honor reduced-motion preferences.

```vue
<MkDialog
  title="Branded workflow"
  :ui="{
    base: 'max-w-3xl',
    overlay: 'bg-indigo-950/60',
    body: 'px-8',
    footer: 'justify-between',
  }"
>
  ...
</MkDialog>
```

Global configuration supports the same structural boundaries plus size and animation defaults:

```ts
app.use(
  createModeKit({
    ui: {
      dialog: {
        base: 'border-neutral-300',
        variants: {
          size: { lg: 'max-w-3xl' },
          animation: { fade: 'duration-200' },
        },
        slots: {
          overlay: 'bg-black/60',
          footer: 'border-t border-neutral-200 pt-4',
        },
        defaultVariants: { size: 'lg', animation: 'fade' },
      },
    },
  }),
)
```

Arbitrary Tailwind classes passed through configuration, `ui`, or native `class` must be generated
by the consuming application. Ordinary CSS classes work without consumer Tailwind.
