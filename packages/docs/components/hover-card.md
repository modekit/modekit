# Hover Card

Hover Card reveals supplementary, preview-style content when a pointer rests on a trigger or the
trigger receives keyboard focus. It keeps the content available while the pointer crosses into the
panel and avoids turning a lightweight preview into a click-driven workflow.

## Usage

<ComponentPreview name="hover-card/HoverCardBasic" />

The default slot must contain exactly one trigger element. Links are the most common trigger because
Hover Card previews the destination without replacing its native navigation. The component augments
that element directly with hover and focus behavior instead of adding a wrapper. Native attributes
and listeners apply to the floating content element.

Use Hover Card for optional previews such as people, projects, definitions, and linked resources.
Use Tooltip for a short accessible name or description. Use Popover when opening is deliberate,
content drives a task, or touch users must always reach it.

## Open and close timing

<ComponentPreview name="hover-card/HoverCardDelay" />

`open-delay` prevents cards from flashing while a pointer moves across the page. `close-delay` gives
the pointer time to cross from the trigger into the content without losing the preview. The defaults
are `700ms` and `300ms`, respectively. Both accept non-negative millisecond values.

Avoid removing the open delay from dense interfaces: immediately opening every crossed trigger
creates distracting motion. A shorter delay can fit a sparse discovery surface, while a longer close
delay helps when content contains selectable text or links.

## Position and alignment

<ComponentPreview name="hover-card/HoverCardPosition" />

`side` selects the preferred edge and `align` positions the card along that edge. Collision handling
may change the resolved placement to keep the card visible. `side-offset` controls the trigger gap,
and `align-offset` shifts the panel along the alignment axis.

`collision-padding` accepts one number or a per-side object. `hide-when-detached` hides content when
its trigger is fully clipped. The default `fixed` strategy fits most application shells; use
`absolute` only when document-relative positioning is intentional.

## Controlled state

<ComponentPreview name="hover-card/HoverCardControlled" />

Use `v-model:open` when application state must coordinate the card with another interface. Use
`default-open` for an initially open, otherwise uncontrolled card. Pointer and focus interactions
still emit `update:open` requests in controlled mode.

## Composition

<ComponentPreview name="hover-card/HoverCardComposition" />

Hover Card owns the floating surface rather than prescribing its internal layout. Compose Avatar,
Badge, typography, and layout primitives inside the `content` slot. The slot receives the current
`open` state when content needs to reflect visibility.

Keep the card supplementary. Essential instructions, validation, and controls must remain available
without hover. If the panel becomes a multi-step or state-changing workflow, use Popover or Dialog.

## Touch behavior

Touch interactions are ignored by default because a hover preview must not intercept a trigger's
primary action. Set `enable-touch` only when tapping the trigger may intentionally toggle the card
and the trigger's own activation semantics remain understandable. For essential touch content,
prefer a visible layout or a click-triggered Popover.

## Features

- Controlled and uncontrolled open state
- Delayed pointer opening and closing
- Keyboard-focus opening and blur closing
- Pointer grace area between trigger and content
- Optional touch toggling
- Trigger augmentation without an extra DOM wrapper
- Four sides, three alignments, offsets, collision handling, and detached-trigger hiding
- Body portal by default, optional inline rendering, and custom portal targets
- Optional position-aware arrow with custom content
- Origin-aware open and close animation with reduced-motion support
- Global configuration, local slot classes, and native content-class overrides

## API

### Props

| Prop               | Type                                               | Default    | Description                                                      |
| ------------------ | -------------------------------------------------- | ---------- | ---------------------------------------------------------------- |
| `as`               | `string \| Component`                              | `'div'`    | Changes the floating content element.                            |
| `open`             | `boolean`                                          | —          | Controls the open state.                                         |
| `defaultOpen`      | `boolean`                                          | `false`    | Sets the initial uncontrolled open state.                        |
| `openDelay`        | `number`                                           | `700`      | Delays opening after pointer entry or focus, in milliseconds.    |
| `closeDelay`       | `number`                                           | `300`      | Delays closing after pointer leave or blur, in milliseconds.     |
| `enableTouch`      | `boolean`                                          | `false`    | Allows touch pointer release to toggle the card.                 |
| `side`             | `'top' \| 'right' \| 'bottom' \| 'left'`           | `'bottom'` | Sets the preferred side of the trigger.                          |
| `align`            | `'start' \| 'center' \| 'end'`                     | `'center'` | Aligns content along the selected side.                          |
| `sideOffset`       | `number`                                           | `8`        | Sets the trigger-to-content distance in pixels.                  |
| `alignOffset`      | `number`                                           | `0`        | Shifts content along the alignment axis in pixels.               |
| `avoidCollisions`  | `boolean`                                          | `true`     | Adjusts the resolved position to remain in bounds.               |
| `collisionPadding` | `number \| Partial<Record<HoverCardSide, number>>` | `8`        | Reserves space between content and collision boundaries.         |
| `hideWhenDetached` | `boolean`                                          | `false`    | Hides content when its trigger is fully occluded.                |
| `positionStrategy` | `'absolute' \| 'fixed'`                            | `'fixed'`  | Selects the CSS positioning strategy.                            |
| `arrow`            | `boolean`                                          | `false`    | Renders a position-aware pointing arrow.                         |
| `portal`           | `boolean \| string \| HTMLElement`                 | `true`     | Portals to the body, renders inline, or selects a custom target. |
| `ui`               | `HoverCardUI`                                      | —          | Adds classes to the content and arrow.                           |

Native attributes and listeners apply to the floating content element. Native `class` is resolved
after built-in, global, and local content classes.

### Events

| Event                | Payload         | Description                                              |
| -------------------- | --------------- | -------------------------------------------------------- |
| `update:open`        | `boolean`       | Emitted whenever the requested open state changes.       |
| `escapeKeyDown`      | `KeyboardEvent` | Emitted when Escape is pressed while the card is active. |
| `pointerDownOutside` | `Event`         | Emitted for pointer interaction outside the card.        |
| `focusOutside`       | `Event`         | Emitted when focus moves outside the card.               |
| `interactOutside`    | `Event`         | Emitted for either outside pointer or focus interaction. |

Prevent a lifecycle event when application behavior must replace the corresponding default.

### Slots

| Slot      | Props               | Description                                                 |
| --------- | ------------------- | ----------------------------------------------------------- |
| `default` | —                   | Supplies the single hover/focus trigger element.            |
| `content` | `{ open: boolean }` | Supplies the floating preview content and visibility state. |
| `arrow`   | —                   | Replaces the default arrow graphic when `arrow` is enabled. |

## Portal behavior

The default body portal keeps content clear of clipping and stacking contexts. Set `:portal="false"`
only for intentionally inline rendering. Pass a selector or `HTMLElement` when an application owns
a dedicated overlay container.

```vue
<!-- Body portal (default) -->
<MkHoverCard>...</MkHoverCard>

<!-- Inline content -->
<MkHoverCard :portal="false">...</MkHoverCard>

<!-- Application overlay container -->
<MkHoverCard portal="#app-overlays">...</MkHoverCard>
<MkHoverCard :portal="overlayElement">...</MkHoverCard>
```

Because portalled content leaves its source subtree, application selectors depending on that subtree
do not apply. Import `@modekit/vue/styles.css` in document scope and prefer ModeKit configuration,
`ui`, native content classes, CSS variables, or selectors attached directly to the card.

When ModeKit is rendered inside Shadow DOM and its stylesheet exists only in that shadow root, pass
an element inside the styled shadow root as the portal target, or load ModeKit CSS in both document
and shadow scopes.

## Accessibility

The trigger opens the card on keyboard focus as well as pointer hover. Escape dismisses an open card.
Hover Card content is supplementary and does not replace the trigger's accessible name, visible
label, destination, or surrounding instructions. Users must be able to complete the primary task
without discovering the card.

Use a semantic, focusable trigger—usually a link—or a component that forwards DOM attributes and its
root reference. Do not place Hover Card on disabled controls. Text selection inside the card is
preserved, and pointer movement between trigger and content uses a grace area to avoid accidental
closure.

## Styling

`HoverCardUI` exposes `base` for floating content and `arrow` for the optional arrow. Hover Card uses
the neutral surface palette, shared radius and elevation scales, and a responsive viewport-aware
width.

```vue
<MkHoverCard
  arrow
  :ui="{
    base: 'w-96 p-5',
    arrow: 'fill-primary stroke-primary',
  }"
>
  <MkLink href="/profiles/maya">@maya</MkLink>
  <template #content>Custom content</template>
</MkHoverCard>
```

Global configuration supports the same boundaries:

```ts
app.use(
  createModeKit({
    ui: {
      hoverCard: {
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
