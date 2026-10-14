# Popover

Popover displays interactive content in a positioned, non-modal dialog next to a trigger. It manages
open state, focus, keyboard dismissal, collision handling, and portal rendering while leaving the
content fully composable.

## Usage

<ComponentPreview name="popover/PopoverBasic" />

The default slot must contain exactly one trigger element. Popover augments that element directly
with its dialog relationship and open state instead of adding a wrapper. The `content` slot receives
`open` and `close`, so actions inside the panel can dismiss it without owning external state.

Popover is intended for click-triggered interactive content. Use a dedicated Tooltip or Hover Card
component for hover-triggered information so pointer, keyboard, focus, and touch behavior remain
appropriate to that interaction.

## Position and alignment

<ComponentPreview name="popover/PopoverPosition" />

`side` selects the preferred edge and `align` positions the panel along that edge. These are
preferences: with collision handling enabled, the resolved position may change to keep content in
the available viewport. `side-offset` controls the gap from the trigger, while `align-offset` shifts
content along the alignment axis.

## Arrow

<ComponentPreview name="popover/PopoverArrow" />

Set `arrow` to visually connect the panel to its trigger. The arrow tracks the resolved side and
alignment after collisions. Use the `arrow` slot only when the default rounded arrow graphic must be
replaced; `ui.arrow` controls its visual classes.

## Controlled state

<ComponentPreview name="popover/PopoverControlled" />

Use `v-model:open` when application state owns visibility. Use `default-open` for an initially open,
otherwise uncontrolled Popover. The `close` slot action works in either mode and emits the same
state update.

## Modal and dismissal behavior

<ComponentPreview name="popover/PopoverBehavior" />

Popover is non-modal and dismissible by default. Modal mode blocks interaction with outside content
and limits assistive technology to the active panel. Set `dismissible` to `false` when Escape,
outside pointer interaction, and outside focus must not close the panel; always provide a visible
close action in that case.

## Composition

<ComponentPreview name="popover/PopoverComposition" />

Popover supplies the floating surface rather than prescribing its internal layout. Compose existing
ModeKit controls and layout primitives inside the content slot. Purpose-built components such as
Dropdown Menu should still own their specialized selection and keyboard semantics.

## Features

- Controlled and uncontrolled open state
- Trigger augmentation without extra DOM wrappers
- Managed focus, Escape dismissal, and focus restoration
- Modal and non-modal behavior
- Outside pointer and focus dismissal with an opt-out
- Four sides, three alignments, offsets, collision handling, and detached-trigger hiding
- Body portal by default, optional inline rendering, and custom portal targets
- Optional position-aware arrow with custom content
- Origin-aware open and close animation with reduced-motion support
- Global configuration, local slot classes, and native content-class overrides

## API

### Props

| Prop               | Type                                             | Default    | Description                                                               |
| ------------------ | ------------------------------------------------ | ---------- | ------------------------------------------------------------------------- |
| `as`               | `string \| Component`                            | `'div'`    | Changes the floating content element.                                     |
| `open`             | `boolean`                                        | —          | Controls the open state.                                                  |
| `defaultOpen`      | `boolean`                                        | `false`    | Sets the initial uncontrolled open state.                                 |
| `modal`            | `boolean`                                        | `false`    | Blocks outside interaction and hides outside content from screen readers. |
| `dismissible`      | `boolean`                                        | `true`     | Allows Escape, outside pointer, and outside focus dismissal.              |
| `side`             | `'top' \| 'right' \| 'bottom' \| 'left'`         | `'bottom'` | Sets the preferred side of the trigger.                                   |
| `align`            | `'start' \| 'center' \| 'end'`                   | `'center'` | Aligns content along the selected side.                                   |
| `sideOffset`       | `number`                                         | `8`        | Sets the trigger-to-content distance in pixels.                           |
| `alignOffset`      | `number`                                         | `0`        | Shifts content along the alignment axis in pixels.                        |
| `avoidCollisions`  | `boolean`                                        | `true`     | Adjusts the resolved position to remain in bounds.                        |
| `collisionPadding` | `number \| Partial<Record<PopoverSide, number>>` | `8`        | Reserves space between content and collision boundaries.                  |
| `hideWhenDetached` | `boolean`                                        | `false`    | Hides content when its trigger is fully occluded.                         |
| `positionStrategy` | `'absolute' \| 'fixed'`                          | `'fixed'`  | Selects the CSS positioning strategy.                                     |
| `arrow`            | `boolean`                                        | `false`    | Renders a position-aware pointing arrow.                                  |
| `portal`           | `boolean \| string \| HTMLElement`               | `true`     | Portals to the body, renders inline, or selects a custom target.          |
| `ui`               | `PopoverUI`                                      | —          | Adds classes to the content and arrow.                                    |

Native attributes and listeners apply to the floating content element. Native `class` is resolved
after built-in, global, and local content classes.

### Events

| Event                | Payload         | Description                                               |
| -------------------- | --------------- | --------------------------------------------------------- |
| `update:open`        | `boolean`       | Emitted whenever the requested open state changes.        |
| `escapeKeyDown`      | `KeyboardEvent` | Emitted when Escape is pressed while the panel is active. |
| `pointerDownOutside` | `Event`         | Emitted for pointer interaction outside the panel.        |
| `focusOutside`       | `Event`         | Emitted when focus moves outside the panel.               |
| `interactOutside`    | `Event`         | Emitted for either outside pointer or focus interaction.  |
| `openAutoFocus`      | `Event`         | Emitted before automatic focus is applied on open.        |
| `closeAutoFocus`     | `Event`         | Emitted before focus is restored on close.                |

Preventing a lifecycle event customizes its corresponding behavior. When `dismissible` is false,
Popover prevents Escape and outside-interaction dismissal after emitting the event.

### Slots

| Slot      | Props                        | Description                                                 |
| --------- | ---------------------------- | ----------------------------------------------------------- |
| `default` | —                            | Supplies the single trigger element.                        |
| `content` | `{ open: boolean, close() }` | Supplies the floating panel content and state actions.      |
| `arrow`   | —                            | Replaces the default arrow graphic when `arrow` is enabled. |

## Portal behavior

The default portal keeps floating content clear of clipping and stacking contexts. Set
`portal="false"` only when inline rendering is intentionally required. A selector or element can be
passed when an application owns a dedicated overlay container.

Because the content leaves its source subtree when portalled, application selectors that depend on
that subtree do not apply to it. Prefer ModeKit configuration, `ui`, native content classes, CSS
variables, or selectors attached directly to the content.

## Accessibility

The trigger exposes expanded state and its relationship to the dialog. Enter, Space, and pointer
activation use native trigger behavior. Escape closes the panel and restores focus to its trigger.
Tab and Shift+Tab move through focusable panel content. Modal mode should be reserved for cases where
outside interaction must be unavailable; use Dialog for blocking tasks that require a dedicated
modal workflow.

The trigger must be an interactive element or a component that forwards DOM attributes and its root
reference. Supply accessible names for icon-only triggers and semantic labels for controls inside the
panel.

## Styling

`PopoverUI` exposes `base` for the floating content and `arrow` for the optional arrow. Popover uses
the neutral surface palette, the shared radius and elevation scales, and a responsive viewport-aware
maximum width.

```vue
<MkPopover
  arrow
  :ui="{
    base: 'w-80 p-0',
    arrow: 'fill-primary stroke-primary',
  }"
>
  <MkButton>Open</MkButton>

  <template #content>Custom content</template>
</MkPopover>
```

Global configuration supports the same content and arrow boundaries:

```ts
app.use(
  createModeKit({
    ui: {
      popover: {
        base: 'max-w-lg',
        slots: {
          arrow: 'stroke-neutral-300',
        },
      },
    },
  }),
)
```

Arbitrary Tailwind classes passed through configuration, `ui`, or native `class` must be generated
by the consuming application. Ordinary CSS classes work without consumer Tailwind.
