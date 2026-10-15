# Dropdown

Dropdown presents actions and choices from a button using the WAI-ARIA menu-button pattern. It
manages focus, roving keyboard navigation, typeahead, selection, nested submenus, collision handling,
and portal rendering while ModeKit parts keep the content composable.

## Usage

<ComponentPreview name="dropdown/DropdownBasic" />

The default slot must contain exactly one trigger element. Dropdown augments that element with its
menu relationship and expanded state without adding a wrapper. The recursive `items` prop renders
actions, checkboxes, radio groups, submenus, groups, labels, and separators. Action items omit
`type`; other shapes use a discriminating `type`. The root emits `itemSelect` for action, checkbox,
and radio selections with the selected item, its index within the containing array, and the original
event.

```vue
<script setup lang="ts">
import type { DropdownItem, DropdownSelectableItem } from '@modekit/vue'

function editProject() {}
function deleteProject() {}
function trackSelection(item: DropdownSelectableItem, index: number, event: Event) {}

const items = [
  { label: 'Edit project', color: 'blue', onSelect: editProject },
  { label: 'Delete project', color: 'red', onSelect: deleteProject },
] satisfies readonly DropdownItem[]
</script>

<template>
  <MkDropdown :items="items" @item-select="trackSelection">
    <MkButton>Actions</MkButton>
  </MkDropdown>
</template>
```

Use the `item` slot to replace a declarative action item's label while retaining menu semantics.
Use the `content` slot and compound parts when rows need custom leading, trailing, or indicator
content, filtering, native attributes, or per-part slots. `items` and `content` can be combined;
declarative items render first. `MkDropdownItem` emits `select` for pointer and keyboard activation,
and the menu closes unless the event is prevented.

## Rich items and groups

<ComponentPreview name="dropdown/DropdownComposition" />

Use `leading` for an icon or avatar and `trailing` for a shortcut, status, or other subordinate
metadata. ModeKit owns the wrappers that align these slots while preserving the supplied nodes.
`MkDropdownGroup` provides semantic grouping, `MkDropdownLabel` names a section without
joining keyboard navigation, and `MkDropdownSeparator` divides related groups.

Set `disabled` on an item when the action is temporarily unavailable. Use `text-value` when complex
slot content does not expose a useful text label for typeahead. Item `color` accepts every
`ModeKitColor` and uses the same semantic color variables as Button, Badge, and Callout. Reserve red
for destructive actions; color does not replace confirmation for irreversible operations.

## Checkbox and radio choices

<ComponentPreview name="dropdown/DropdownSelection" />

The preview uses `type: 'checkbox'` with `checked` and `onCheckedChange`, plus a
`type: 'radio-group'` item with `value`, `onValueChange`, and nested radio options. Build the array
with `computed` when those controlled values are reactive. The equivalent compound parts are
`MkDropdownCheckboxItem`, `MkDropdownRadioGroup`, and `MkDropdownRadioItem`; they expose checked
state to slots when custom indicators or trailing content are required.

Use checkable menu items for compact preferences related to the current context. Use normal form
controls when the choices belong to a form, need descriptions or validation, or must remain visible.

## Submenus

<ComponentPreview name="dropdown/DropdownSubmenu" />

Use `type: 'submenu'` with a nested `items` array for declarative submenus. The equivalent compound
parts are `MkDropdownSub`, `MkDropdownSubTrigger`, and `MkDropdownSubContent`. Both forms inherit the
root size, portal target, global configuration, and local `ui` overrides. They manage directional
arrow keys according to `dir` and give the pointer a short grace period to cross from trigger to
panel.

Prefer one submenu level. Deep nesting increases pointer travel, keyboard effort, and mobile
friction; use a dialog or dedicated screen for complex workflows.

## Filtering

<ComponentPreview name="dropdown/DropdownFilter" />

`MkDropdownFilter` integrates a text input with menu navigation. The application owns filtering:
bind `v-model`, derive the visible items, and render an explicit empty state. Set `auto-focus` when
opening the menu should place focus directly in the filter.

While focus remains in the filter, Arrow Up and Arrow Down change the highlighted menu item, Home
and End move to the first or last enabled item, Enter selects the highlighted item, and Escape first
clears a non-empty query before closing an empty filter.

## Size and position

<ComponentPreview name="dropdown/DropdownPosition" />

`size` controls the menu width, item height, text scale, spacing, labels, filters, and inherited
submenu treatment. `side` and `align` are preferred positions: collision handling may change the
resolved placement to keep content visible. `side-offset` controls the trigger gap, while
`align-offset` shifts the panel along its alignment axis.

`collision-padding` accepts one number or a per-side object. `hide-when-detached` hides the menu when
its trigger is fully clipped. The default `fixed` strategy is appropriate for most application
shells; choose `absolute` only when document-relative positioning is intentional.

## Controlled state

Use `v-model:open` when application state owns visibility. Use `default-open` for an initially open,
otherwise uncontrolled menu. Omit both for the normal closed, uncontrolled state.

```vue
<MkDropdown v-model:open="open" @close-auto-focus="afterClose">
  <MkButton>Actions</MkButton>
  <template #content>...</template>
</MkDropdown>
```

`modal` defaults to `true`, matching standard dropdown behavior: outside interaction is blocked
while the menu is open and assistive technology is limited to the active layer. Set `modal="false"`
only when the surrounding interface must remain interactive.

## Features

- Controlled and uncontrolled open state
- Trigger augmentation without extra DOM wrappers
- Menu-button semantics, managed focus, roving focus, typeahead, and focus restoration
- Declarative `items` plus composable action items with leading, label, trailing, disabled, and inset treatments
- The complete shared `ModeKitColor` palette for action, checkbox, and radio items
- Semantic groups, labels, and separators
- Checkbox items with boolean and indeterminate state
- Radio groups with string or numeric values
- Filter input integrated with menu keyboard navigation
- Controlled and uncontrolled nested submenus with pointer grace behavior
- LTR and RTL directional navigation
- Three coordinated sizes
- Four sides, three alignments, offsets, collision handling, and detached-trigger hiding
- Body portal by default, optional inline rendering, and custom portal targets
- Optional position-aware arrow with custom content
- Origin-aware open and close animation with reduced-motion support
- Global configuration, local multi-slot classes, and native per-part class overrides

## API

### `MkDropdown`

#### Props

| Prop               | Type                                              | Default    | Description                                                      |
| ------------------ | ------------------------------------------------- | ---------- | ---------------------------------------------------------------- |
| `open`             | `boolean`                                         | —          | Controls the open state.                                         |
| `defaultOpen`      | `boolean`                                         | `false`    | Sets the initial uncontrolled open state.                        |
| `modal`            | `boolean`                                         | `true`     | Blocks outside interaction and hides outside content while open. |
| `disabled`         | `boolean`                                         | `false`    | Prevents trigger interaction.                                    |
| `dir`              | `'ltr' \| 'rtl'`                                  | inherited  | Sets reading direction and submenu arrow behavior.               |
| `loop`             | `boolean`                                         | `true`     | Wraps keyboard navigation between the first and last items.      |
| `items`            | `readonly DropdownItem[]`                         | `[]`       | Renders recursive declarative menu structures before `content`.  |
| `size`             | `'sm' \| 'md' \| 'lg'`                            | `'md'`     | Sets coordinated menu and item sizing.                           |
| `side`             | `'top' \| 'right' \| 'bottom' \| 'left'`          | `'bottom'` | Sets the preferred side of the trigger.                          |
| `align`            | `'start' \| 'center' \| 'end'`                    | `'start'`  | Aligns content along the selected side.                          |
| `sideOffset`       | `number`                                          | `6`        | Sets the trigger-to-content distance in pixels.                  |
| `alignOffset`      | `number`                                          | `0`        | Shifts content along the alignment axis in pixels.               |
| `avoidCollisions`  | `boolean`                                         | `true`     | Adjusts resolved placement to remain within bounds.              |
| `collisionPadding` | `number \| Partial<Record<DropdownSide, number>>` | `8`        | Reserves space between content and collision boundaries.         |
| `hideWhenDetached` | `boolean`                                         | `false`    | Hides content when its trigger is fully occluded.                |
| `positionStrategy` | `'absolute' \| 'fixed'`                           | `'fixed'`  | Selects the CSS positioning strategy.                            |
| `arrow`            | `boolean`                                         | `false`    | Renders a position-aware pointing arrow.                         |
| `portal`           | `boolean \| string \| HTMLElement`                | `true`     | Portals to the body, renders inline, or selects a custom target. |
| `ui`               | `DropdownUI`                                      | —          | Adds classes to the content and every styled compound part.      |

Native attributes and listeners apply to the floating content element. Native `class` is resolved
after built-in, global, and local content classes.

#### Events

| Event                | Payload                                 | Description                                              |
| -------------------- | --------------------------------------- | -------------------------------------------------------- |
| `update:open`        | `boolean`                               | Emitted whenever the requested open state changes.       |
| `itemSelect`         | `DropdownSelectableItem, number, Event` | Emitted when a declarative selectable item is selected.  |
| `escapeKeyDown`      | `KeyboardEvent`                         | Emitted when Escape is pressed while the menu is active. |
| `pointerDownOutside` | `Event`                                 | Emitted for pointer interaction outside the menu.        |
| `focusOutside`       | `Event`                                 | Emitted when focus moves outside the menu.               |
| `interactOutside`    | `Event`                                 | Emitted for either outside pointer or focus interaction. |
| `openAutoFocus`      | `Event`                                 | Emitted before automatic focus is applied on open.       |
| `closeAutoFocus`     | `Event`                                 | Emitted before focus is restored on close.               |

Preventing a lifecycle event customizes its corresponding Reka UI behavior.

#### Slots

| Slot      | Props                                         | Description                                               |
| --------- | --------------------------------------------- | --------------------------------------------------------- |
| `default` | —                                             | Supplies the single menu-trigger element.                 |
| `content` | `{ open: boolean }`                           | Supplies labels, groups, items, separators, and submenus. |
| `item`    | `{ item: DropdownActionItem, index: number }` | Replaces a declarative action item's rendered label.      |
| `arrow`   | —                                             | Replaces the default arrow path when `arrow` is enabled.  |

### Declarative item types

| `type`          | Required fields                  | State and callbacks                                           |
| --------------- | -------------------------------- | ------------------------------------------------------------- |
| omitted, `item` | `label`                          | `color`, `disabled`, `inset`, `textValue`, `onSelect`         |
| `checkbox`      | `label`                          | `checked`, `onCheckedChange`, `onSelect`, item options        |
| `radio-group`   | `items: DropdownRadioItem[]`     | `value`, `onValueChange`; options accept item callbacks       |
| `submenu`       | `label`, `items: DropdownItem[]` | `open`, `defaultOpen`, `onOpenChange`, trigger/offset options |
| `group`         | `items: DropdownItem[]`          | Optional `label` and label `inset`                            |
| `label`         | `label`                          | Optional `inset`                                              |
| `separator`     | —                                | —                                                             |

Groups and submenus recurse through the same `DropdownItem` union. Controlled checkbox, radio, and
submenu values are never written back into the supplied objects; update application state in their
callbacks and pass the new values on the next render.

### Menu parts

| Component                | Purpose                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `MkDropdownItem`         | Selectable command that closes unless `select` is prevented. |
| `MkDropdownGroup`        | Semantic group for related menu items.                       |
| `MkDropdownLabel`        | Non-focusable heading for a group.                           |
| `MkDropdownSeparator`    | Semantic visual divider.                                     |
| `MkDropdownCheckboxItem` | Independent boolean or indeterminate choice.                 |
| `MkDropdownRadioGroup`   | Owns one selected radio value.                               |
| `MkDropdownRadioItem`    | One value inside a radio group.                              |
| `MkDropdownFilter`       | Search input integrated with menu navigation.                |
| `MkDropdownSub`          | Owns controlled or uncontrolled submenu state.               |
| `MkDropdownSubTrigger`   | Item that opens a submenu.                                   |
| `MkDropdownSubContent`   | Positioned submenu panel inheriting root styling and portal. |

#### Item props and slots

`DropdownItem` is the recursive declarative union documented above. `DropdownActionItem`,
`DropdownCheckboxItem`, `DropdownRadioGroupItem`, `DropdownRadioItem`, `DropdownSubmenuItem`,
`DropdownGroupItem`, `DropdownLabelItem`, and `DropdownSeparatorItem` are exported for narrower
contracts. `MkDropdownItem` accepts `as`, `disabled`, `textValue`, `color?: ModeKitColor`, and
`inset`. Its `default`, `leading`, and `trailing` slots compose the row. The `select` event receives
the original `Event`; call `preventDefault()` to keep the menu open.

`MkDropdownCheckboxItem` accepts `as`, `modelValue`, `disabled`, `textValue`, and
`color?: ModeKitColor`. It
emits `update:modelValue` with a boolean and `select` with the original event. Its `default`,
`indicator`, and `trailing` slots receive `{ checked: boolean | 'indeterminate' }`.

`MkDropdownRadioGroup` accepts `as` and `modelValue`, then emits `update:modelValue` with a string
or number. `MkDropdownRadioItem` requires `value` and also accepts `as`, `disabled`, `textValue`,
and `color?: ModeKitColor`; its `default`, `indicator`, and `trailing` slots receive
`{ checked: boolean }`.

#### Structural-part props

- `MkDropdownGroup`: `as`
- `MkDropdownLabel`: `as`, `inset`
- `MkDropdownSeparator`: native attributes
- `MkDropdownFilter`: `as`, `modelValue`, `autoFocus`, `disabled`, and native input attributes
- `MkDropdownSub`: `open`, `defaultOpen`, `update:open`
- `MkDropdownSubTrigger`: `as`, `disabled`, `textValue`, `inset`, `graceDuration`; slots are
  `default`, `leading`, and `trailing`
- `MkDropdownSubContent`: `as`, `sideOffset`, `alignOffset`, `avoidCollisions`,
  `collisionPadding`, `hideWhenDetached`, `positionStrategy`, `loop`, and `portal`; it exposes the
  same lifecycle events as root content plus `entryFocus`

## Portal behavior

The root menu portals to `document.body` by default. Set `:portal="false"` only for intentionally
inline rendering, or pass a selector or element for an application overlay container. Submenus
inherit the root portal target unless their `portal` prop overrides it.

Because portalled content leaves its source subtree, application selectors that depend on that
subtree do not apply. Import `@modekit/vue/styles.css` in document scope and prefer ModeKit global
configuration, root `ui`, native per-part classes, CSS variables, or selectors attached directly to
the part.

When ModeKit runs inside Shadow DOM and its stylesheet exists only in that shadow root, pass a styled
shadow-root element as `portal`; the root and all inherited submenus will remain in that scope.

## Accessibility

Dropdown follows the WAI-ARIA menu-button pattern. Enter, Space, and Arrow Down open from the
trigger. Arrow keys move between enabled items, Home and End jump to boundaries, printable
characters perform typeahead, and Escape closes the current layer and restores focus. Directional
keys open and close submenus according to `dir`.

Use Dropdown for actions and compact choices. Use navigation links when the primary behavior is
navigation, Select for choosing a form value, Popover for arbitrary interactive content, and Dialog
for blocking workflows. Every icon-only trigger still needs an accessible name.

## Styling

`DropdownUI` exposes `base`, `arrow`, `group`, `label`, `separator`, `item`, `itemLeading`,
`itemLabel`, `itemTrailing`, `indicator`, `indicatorIcon`, `filter`, `subTrigger`, `subContent`, and
`subIndicator`. Root `ui` values flow through every compound part, including portalled submenus.
Native `class` on each part is merged last.

```vue
<MkDropdown
  :ui="{
    base: 'min-w-64',
    item: 'rounded-lg',
    itemTrailing: 'font-mono',
    subContent: 'min-w-56',
  }"
>
  ...
</MkDropdown>
```

Global configuration supports the same slot boundaries and a default size:

```ts
app.use(
  createModeKit({
    ui: {
      dropdown: {
        base: 'min-w-56',
        slots: {
          item: 'rounded-lg',
          separator: 'my-2',
        },
        defaultVariants: {
          size: 'sm',
        },
      },
    },
  }),
)
```

Arbitrary Tailwind classes passed through configuration, `ui`, or native `class` must be generated
by the consuming application. Ordinary CSS classes work without consumer Tailwind.
