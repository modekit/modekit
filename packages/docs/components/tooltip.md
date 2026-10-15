# Tooltip

Tooltip presents concise, non-interactive context when a trigger receives pointer hover or keyboard
focus. It manages delayed opening, Escape dismissal, accessible description, collision handling, and
portal rendering.

## Usage

<ComponentPreview name="tooltip/TooltipBasic" />

The default slot must contain exactly one interactive trigger that forwards DOM attributes and its
root reference. The `content` slot supplies the description. Keep it short and non-interactive; use
Popover when the floating surface contains controls or requires click activation.

A standalone Tooltip creates its own provider with accessible defaults. Wrap related tooltips in
`MkTooltipProvider` when they should share opening and skip-delay behavior.

## Position and alignment

<ComponentPreview name="tooltip/TooltipPosition" />

`side` selects the preferred edge and `align` positions the tooltip along it. These are preferences:
collision handling may resolve another placement to keep content in the viewport. `side-offset`
controls the trigger gap, while `align-offset` shifts the tooltip along its alignment axis.

For advanced floating behavior, `avoid-collisions`, `collision-padding`, `hide-when-detached`, and
`position-strategy` match Popover’s positioning contract. Per-side collision padding is supported:

```vue
<MkTooltip
  :side-offset="8"
  :align-offset="-4"
  :avoid-collisions="true"
  :collision-padding="{ top: 16, right: 12 }"
  hide-when-detached
  position-strategy="fixed"
>
  <MkButton>Hover or focus</MkButton>
  <template #content>Viewport-aware context</template>
</MkTooltip>
```

## Arrow

<ComponentPreview name="tooltip/TooltipArrow" />

Set `arrow` to visually connect the tooltip to its trigger. The arrow follows the resolved side and
overlaps the surface by one pixel to avoid a visible seam. The `arrow` slot replaces the default
path, while `ui.arrow` controls its visual classes.

```vue
<MkTooltip arrow>
  <MkButton>Hover or focus</MkButton>
  <template #content>Custom arrow</template>
  <template #arrow><path d="M0 0 6 6 12 0" /></template>
</MkTooltip>
```

## Delay and interaction behavior

<ComponentPreview name="tooltip/TooltipBehavior" />

`delay-duration` overrides the provider delay for one tooltip. The standalone default is 700ms.
`disabled` suppresses opening. Keep hoverable content enabled for the WCAG hover persistence
requirement; `disable-hoverable-content` is available only for interfaces that intentionally close as
the pointer leaves the trigger.

`disable-closing-trigger` prevents a trigger click from closing an open tooltip.
`ignore-non-keyboard-focus` opens on focus only when the trigger matches `:focus-visible`, avoiding
unwanted tooltips after pointer-driven focus changes or dialog restoration.

## Controlled state

<ComponentPreview name="tooltip/TooltipControlled" />

Use `v-model:open` when application state must observe or own visibility. Use `default-open` for an
initially open, otherwise uncontrolled Tooltip. Omit both for the default closed state. Controlled
state does not change the component’s hover and focus semantics; it only moves state ownership to
the parent.

## Shared provider

<ComponentPreview name="tooltip/TooltipProvider" />

`MkTooltipProvider` coordinates a group. `delay-duration` sets the initial hover delay and
`skip-delay-duration` defines how long subsequent tooltips may open instantly after one closes.
Provider behavior is inherited unless a Tooltip supplies a local override. Providers can also disable
a whole region or set shared hover, click-closing, and focus-origin behavior.

## Features

- Pointer-hover and keyboard-focus activation
- Controlled and uncontrolled open state
- Standalone defaults with optional shared provider coordination
- Configurable opening and cross-tooltip skip delays
- Escape, pointer-leave, blur, outside interaction, and scroll dismissal
- Four sides, three alignments, offsets, collision handling, and detached-trigger hiding
- Body portal by default, optional inline rendering, and custom portal targets
- Optional position-aware arrow with custom content
- Accessible trigger description without extra wrappers
- Origin-aware open and close animation with reduced-motion support
- Global configuration, local slot classes, and native content-class overrides

## API

### Tooltip props

| Prop                      | Type                                             | Default            | Description                                                                     |
| ------------------------- | ------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------- |
| `as`                      | `string \| Component`                            | `'div'`            | Changes the floating content element.                                           |
| `open`                    | `boolean`                                        | —                  | Controls the open state.                                                        |
| `defaultOpen`             | `boolean`                                        | `false`            | Sets the initial uncontrolled open state.                                       |
| `delayDuration`           | `number`                                         | provider (`700`)   | Overrides the opening delay in milliseconds.                                    |
| `disableHoverableContent` | `boolean`                                        | provider (`false`) | Closes when the pointer leaves the trigger instead of preserving content hover. |
| `disableClosingTrigger`   | `boolean`                                        | provider (`false`) | Prevents trigger clicks from closing the tooltip.                               |
| `disabled`                | `boolean`                                        | provider (`false`) | Prevents the tooltip from opening.                                              |
| `ignoreNonKeyboardFocus`  | `boolean`                                        | provider (`false`) | Requires focus-visible keyboard focus before opening.                           |
| `side`                    | `'top' \| 'right' \| 'bottom' \| 'left'`         | `'top'`            | Sets the preferred side of the trigger.                                         |
| `align`                   | `'start' \| 'center' \| 'end'`                   | `'center'`         | Aligns content along the selected side.                                         |
| `sideOffset`              | `number`                                         | `6`                | Sets the trigger-to-content distance in pixels.                                 |
| `alignOffset`             | `number`                                         | `0`                | Shifts content along the alignment axis in pixels.                              |
| `avoidCollisions`         | `boolean`                                        | `true`             | Adjusts the resolved position to remain in bounds.                              |
| `collisionPadding`        | `number \| Partial<Record<TooltipSide, number>>` | `8`                | Reserves space between content and collision boundaries.                        |
| `hideWhenDetached`        | `boolean`                                        | `false`            | Hides content when its trigger is fully occluded.                               |
| `positionStrategy`        | `'absolute' \| 'fixed'`                          | `'fixed'`          | Selects the CSS positioning strategy.                                           |
| `arrow`                   | `boolean`                                        | `false`            | Renders a position-aware pointing arrow.                                        |
| `portal`                  | `boolean \| string \| HTMLElement`               | `true`             | Portals to the body, renders inline, or selects a custom target.                |
| `ui`                      | `TooltipUI`                                      | —                  | Adds classes to the content and arrow.                                          |

Native attributes and listeners apply to the floating content element. Native `class` is resolved
after built-in, global, and local content classes. Set `aria-label` when the visible slot content is
not an adequate plain-text description.

### Tooltip events

| Event                | Payload         | Description                                               |
| -------------------- | --------------- | --------------------------------------------------------- |
| `update:open`        | `boolean`       | Emitted whenever the requested open state changes.        |
| `escapeKeyDown`      | `KeyboardEvent` | Emitted when Escape is pressed while the tooltip is open. |
| `pointerDownOutside` | `Event`         | Emitted for pointer interaction outside the tooltip.      |

### Tooltip slots

| Slot      | Props               | Description                                              |
| --------- | ------------------- | -------------------------------------------------------- |
| `default` | —                   | Supplies the single interactive trigger element.         |
| `content` | `{ open: boolean }` | Supplies the visible and announced tooltip description.  |
| `arrow`   | —                   | Replaces the default arrow path when `arrow` is enabled. |

### Provider props

| Prop                      | Type      | Default | Description                                                   |
| ------------------------- | --------- | ------- | ------------------------------------------------------------- |
| `delayDuration`           | `number`  | `700`   | Sets the initial pointer-hover opening delay in milliseconds. |
| `skipDelayDuration`       | `number`  | `300`   | Keeps following tooltips delay-free for this period.          |
| `disableHoverableContent` | `boolean` | `false` | Applies trigger-leave closing to every inherited tooltip.     |
| `disableClosingTrigger`   | `boolean` | `false` | Prevents trigger-click closing for inherited tooltips.        |
| `disabled`                | `boolean` | `false` | Disables every inherited tooltip.                             |
| `ignoreNonKeyboardFocus`  | `boolean` | `false` | Requires keyboard-origin focus for inherited tooltips.        |

`MkTooltipProvider` has one `default` slot containing its tooltip group.

## Portal behavior

The default body portal avoids clipping and stacking contexts. Set `:portal="false"` for intentional
inline rendering, or pass a selector or element for an application overlay container.

```vue
<MkTooltip>...</MkTooltip>
<MkTooltip :portal="false">...</MkTooltip>
<MkTooltip portal="#app-overlays">...</MkTooltip>
<MkTooltip :portal="overlayElement">...</MkTooltip>
```

Import `@modekit/vue/styles.css` in document scope. When ModeKit is rendered inside Shadow DOM and
its stylesheet exists only inside that root, pass a styled shadow-root element as the portal target
or load ModeKit CSS in both document and shadow scopes.

## Accessibility

Tooltip associates the trigger with a hidden `role="tooltip"` description through
`aria-describedby`. Pointer hover and keyboard focus open it; leaving, blurring, scrolling the
trigger container, pressing Escape, or opening another tooltip dismisses it. The trigger must be
interactive and remain keyboard reachable.

Do not place buttons, links, fields, or other interactive content in a Tooltip. Use Popover for
interactive floating content. Avoid disabling hoverable content unless the surrounding interaction
still satisfies the requirement that hover-triggered content remains reachable and dismissible.

## Styling

`TooltipUI` exposes `base` for the floating content and `arrow` for the optional arrow. Tooltip uses
an inverse neutral surface by default and automatically reverses it in dark mode.

```vue
<MkTooltip
  arrow
  :ui="{
    base: 'max-w-64 bg-primary text-primary-foreground',
    arrow: 'fill-primary',
  }"
>
  <MkButton>Hover or focus</MkButton>
  <template #content>Customized tooltip</template>
</MkTooltip>
```

Global configuration supports the same content and arrow boundaries:

```ts
app.use(
  createModeKit({
    ui: {
      tooltip: {
        base: 'rounded-lg',
        slots: {
          arrow: 'fill-primary',
        },
      },
    },
  }),
)
```

Arbitrary Tailwind classes passed through configuration, `ui`, or native `class` must be generated
by the consuming application. Ordinary CSS classes work without consumer Tailwind.
