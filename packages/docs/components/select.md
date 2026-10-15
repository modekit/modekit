# Select

Select lets users choose one or more values from a finite list. It combines a form-compatible
combobox trigger with keyboard navigation, typeahead, grouped options, responsive positioning, and
composable option presentation.

## Usage

<ComponentPreview name="select/SelectBasic" />

Pass a typed `items` array and bind `v-model`. `placeholder` is shown until a value is selected.
Use `MkLabel` with the trigger's `id`, or provide `aria-label` when no visible label is present.

```ts
const items = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'Todo', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
] satisfies readonly SelectItem[]
```

Values are deliberately limited to strings and finite numbers. Keep values unique and do not use an
empty string: Reka UI reserves it for clearing a selection and restoring the placeholder.

## Multiple selection

<ComponentPreview name="select/SelectMultiple" />

Set `multiple` and bind an array to select several options. Selecting an active option again removes
it. Multiple Select remains open between choices and presents selected labels in model order.

Use a single value when `multiple` is false and an array when it is true. ModeKit does not silently
convert between those state shapes.

## Groups, descriptions, and separators

<ComponentPreview name="select/SelectGroups" />

Use `type: 'group'` for a labelled option group and `type: 'separator'` between related sections.
Option descriptions add visual context without changing the option's label or typeahead text.
Disabled options remain visible but cannot be selected.

```ts
const items: readonly SelectItem[] = [
  {
    type: 'group',
    label: 'Active work',
    items: [
      { label: 'Backlog', value: 'backlog', description: 'Not started yet' },
      { label: 'In progress', value: 'in-progress' },
    ],
  },
  { type: 'separator' },
  {
    type: 'group',
    label: 'Closed',
    items: [{ label: 'Done', value: 'done' }],
  },
]
```

`textValue` can supply dedicated typeahead text when custom item content is not adequately textual.

## Custom option presentation

<ComponentPreview name="select/SelectSlots" />

Trigger and option slots receive resolved item and state data. Use them for icons, avatars, badges,
or supporting metadata while Reka UI retains the option semantics and selection behavior.

The `item` slot replaces only the visible option label inside `SelectItemText`. `item-leading` and
`item-trailing` stay outside that label. This preserves native form option registration and
accessible labelling without undocumented wrappers around consumer output.

## Positioning

<ComponentPreview name="select/SelectPositioning" />

`position="popper"` is the ModeKit default and supports side, alignment, offsets, collision handling,
and an optional arrow. `position="item-aligned"` places the menu relative to the selected option,
similar to a native macOS menu; popper side and alignment options do not apply in that mode.

Select uses fixed positioning by default so transformed ancestors do not unexpectedly move the
popup. Choose `position-strategy="absolute"` only when the containing layout intentionally owns its
coordinate system.

## Features

- Controlled and uncontrolled value state
- Controlled and uncontrolled open state
- Single and multiple selection
- String and numeric values
- Semantic groups, labels, separators, disabled options, and descriptions
- Arrow-key navigation, Home/End movement, typeahead, Enter/Space selection, and Escape dismissal
- Native form participation through a hidden select when `name` is supplied
- Required, disabled, autocomplete, loading, and invalid states
- Matching Input sizes and surface variants
- Popper and selected-item-aligned positioning
- Collision avoidance, detached-trigger handling, fixed/absolute strategies, and optional arrow
- Body, inline, and custom portal targets
- Persistent content mounting for animation or state preservation
- Single-level item schema with custom trigger and item presentation slots
- Global configuration, local slot classes, and native trigger-class overrides
- Light/dark surfaces, reduced-motion handling, and scroll controls for long lists

## API

### Props

| Prop               | Type                                                    | Default        | Description                                                         |
| ------------------ | ------------------------------------------------------- | -------------- | ------------------------------------------------------------------- |
| `modelValue`       | `string \| number \| readonly (string \| number)[]`     | —              | Controls the selected value or values.                              |
| `defaultValue`     | `string \| number \| readonly (string \| number)[]`     | —              | Sets the initial uncontrolled selection.                            |
| `open`             | `boolean`                                               | —              | Controls whether the listbox is open.                               |
| `defaultOpen`      | `boolean`                                               | `false`        | Sets the initial uncontrolled open state.                           |
| `items`            | `readonly SelectItem[]`                                 | `[]`           | Supplies options, groups, and separators.                           |
| `multiple`         | `boolean`                                               | `false`        | Enables array-based multiple selection.                             |
| `placeholder`      | `string`                                                | —              | Text shown while there is no selection.                             |
| `emptyText`        | `string`                                                | `'No options'` | Fallback shown when no selectable options exist.                    |
| `name`             | `string`                                                | —              | Enables native form participation under this field name.            |
| `autocomplete`     | `string`                                                | —              | Sets autocomplete on the hidden native select.                      |
| `required`         | `boolean`                                               | `false`        | Marks the form control as required.                                 |
| `disabled`         | `boolean`                                               | `false`        | Disables the trigger and native form control.                       |
| `invalid`          | `boolean`                                               | `false`        | Applies invalid visuals and `aria-invalid="true"`.                  |
| `loading`          | `boolean`                                               | `false`        | Shows a decorative, size-matched spinner and `aria-busy`.           |
| `dir`              | `'ltr' \| 'rtl'`                                        | inherited      | Sets reading and navigation direction.                              |
| `size`             | `'sm' \| 'md' \| 'lg'`                                  | `'md'`         | Coordinates trigger, option, icon, and spinner sizing.              |
| `variant`          | `'outline' \| 'soft' \| 'subtle' \| 'ghost' \| 'plain'` | `'outline'`    | Selects trigger chrome.                                             |
| `position`         | `'popper' \| 'item-aligned'`                            | `'popper'`     | Chooses anchored or selected-item-aligned positioning.              |
| `side`             | `'top' \| 'right' \| 'bottom' \| 'left'`                | `'bottom'`     | Preferred popper side.                                              |
| `align`            | `'start' \| 'center' \| 'end'`                          | `'start'`      | Preferred popper alignment.                                         |
| `sideOffset`       | `number`                                                | `6`            | Distance from the trigger on the side axis.                         |
| `alignOffset`      | `number`                                                | `0`            | Offset along the alignment axis.                                    |
| `avoidCollisions`  | `boolean`                                               | `true`         | Allows repositioning to remain visible.                             |
| `collisionPadding` | `number \| Partial<Record<SelectSide, number>>`         | `8`            | Keeps content away from collision boundaries.                       |
| `hideWhenDetached` | `boolean`                                               | `false`        | Hides popper content when its trigger leaves the clipping boundary. |
| `positionStrategy` | `'absolute' \| 'fixed'`                                 | `'fixed'`      | Chooses the popper CSS positioning strategy.                        |
| `bodyLock`         | `boolean`                                               | `true`         | Locks body scrolling while the listbox is open.                     |
| `loop`             | `boolean`                                               | `true`         | Wraps keyboard navigation from last option to first and vice versa. |
| `unmountOnHide`    | `boolean`                                               | `true`         | Unmounts content after its closing transition.                      |
| `arrow`            | `boolean`                                               | `false`        | Renders a popper arrow; ignored for item-aligned content.           |
| `portal`           | `boolean \| string \| HTMLElement`                      | `true`         | Portals to body, renders inline, or selects a custom target.        |
| `ui`               | `SelectUI`                                              | —              | Adds classes to the trigger and structural slots.                   |

Native attributes and listeners apply to the combobox trigger. Native `class` resolves after
built-in, global, and local trigger classes.

### Item schema

```ts
interface SelectOption {
  type?: 'item'
  label: string
  value: string | number
  description?: string
  disabled?: boolean
  textValue?: string
}

interface SelectGroup {
  type: 'group'
  label?: string
  items: readonly SelectOption[]
}

interface SelectSeparator {
  type: 'separator'
}

type SelectItem = SelectOption | SelectGroup | SelectSeparator
```

Groups are intentionally one level deep. Select is a finite form control, not a hierarchical menu;
use Dropdown for nested actions and Combobox for searchable or dynamic collections.

### Events

| Event                | Payload                       | Description                                                |
| -------------------- | ----------------------------- | ---------------------------------------------------------- |
| `update:modelValue`  | `SelectModelValue`            | Emitted when the requested selection changes.              |
| `update:open`        | `boolean`                     | Emitted when the requested open state changes.             |
| `itemSelect`         | `SelectOption, number, Event` | Emitted before an option is committed; preventable.        |
| `escapeKeyDown`      | `KeyboardEvent`               | Emitted when Escape is pressed inside the listbox.         |
| `pointerDownOutside` | `Event`                       | Emitted for an outside pointer press.                      |
| `closeAutoFocus`     | `Event`                       | Emitted before focus returns to the trigger after closing. |

Calling `preventDefault()` on the `itemSelect` event keeps the current value and leaves the listbox
open. The index is the option's flattened position across top-level options and groups; separators
do not consume an index.

### Slots

| Slot            | Props                             | Description                                              |
| --------------- | --------------------------------- | -------------------------------------------------------- |
| `leading`       | `SelectSlotProps`                 | Adds selected-value decoration before the trigger value. |
| `value`         | `SelectValueSlotProps`            | Replaces trigger value or placeholder presentation.      |
| `trailing`      | `SelectSlotProps`                 | Replaces the default chevron.                            |
| `loader`        | `SelectSlotProps`                 | Replaces the loading spinner.                            |
| `item`          | `{ item, index, selected, size }` | Replaces an option's visible label.                      |
| `item-leading`  | `{ item, index, selected, size }` | Adds content before an option label.                     |
| `item-trailing` | `{ item, index, selected, size }` | Adds content after an option label.                      |
| `indicator`     | `{ item, index, selected, size }` | Replaces the selected checkmark.                         |
| `empty`         | `SelectSlotProps`                 | Replaces `emptyText`.                                    |
| `arrow`         | —                                 | Replaces the default popper arrow graphic.               |

`SelectSlotProps` contains `modelValue`, `selectedItems`, `open`, `size`, `variant`, `disabled`, and
`loading`.

## State ownership

Use `v-model` for controlled selection and `default-value` for uncontrolled selection. Use
`v-model:open` and `default-open` independently for listbox visibility.

A controlled Select emits requested changes but does not mutate its displayed state until its owner
updates the corresponding prop. Do not pass both `model-value` and `default-value` for the same state.

## Form behavior

Supplying `name` registers an accessible hidden native `<select>` so values participate in form
submission and browser autofill. `required`, `disabled`, and `autocomplete` are forwarded to that
control. Place Select inside its owning form for native association.

For multiple selection, servers receive repeated values under the same field name according to
native select submission semantics.

## Keyboard behavior

- Arrow Up/Down opens the listbox and moves between enabled options.
- Home and End move to the first and last enabled options.
- Typing printable characters performs option-label typeahead.
- Enter and Space select the focused option.
- Escape closes and restores focus to the trigger.
- Tab is contained while the listbox is open, matching native Select behavior.

Do not add a second roving-focus, typeahead, or global Escape implementation. Reka UI already owns
those interaction boundaries.

## Portal behavior

Select portals to `document.body` by default. Pass `:portal="false"` for deliberate inline rendering,
a CSS selector for an application overlay root, or an `HTMLElement` for Shadow DOM placement.

Because portalled content leaves its source subtree, load `@modekit/vue/styles.css` in the portal's
document or shadow scope. The ModeKit documentation preview harness demonstrates this boundary.

## Styling

`SelectUI` exposes `base`, `leading`, `value`, `placeholder`, `trailing`, `triggerIcon`, `spinner`,
`content`, `viewport`, `scrollButton`, `group`, `label`, `separator`, `item`, `itemLeading`,
`itemText`, `itemLabel`, `itemDescription`, `itemTrailing`, `indicator`, `indicatorIcon`, `empty`, and
`arrow`.

```vue
<MkSelect
  :items="items"
  :ui="{
    base: 'max-w-sm',
    content: 'border-primary/30',
    item: 'data-[highlighted]:bg-primary/10',
    itemDescription: 'text-xs',
  }"
/>
```

Global configuration supports trigger size and variant defaults plus all structural slots:

```ts
app.use(
  createModeKit({
    ui: {
      select: {
        base: 'max-w-sm',
        variants: {
          size: { lg: 'min-w-72' },
          variant: { soft: 'ring-1 ring-neutral-200' },
        },
        slots: {
          content: 'shadow-raised-xl',
          item: 'data-[highlighted]:bg-primary/10',
        },
        defaultVariants: { size: 'md', variant: 'outline' },
      },
    },
  }),
)
```

Arbitrary Tailwind classes passed through configuration, `ui`, or native `class` must be generated
by the consuming application. Ordinary CSS classes work without consumer Tailwind.
