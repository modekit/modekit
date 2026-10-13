# Tabs

Tabs organize related sections and let users move between them without leaving the current view.
`MkTabs` uses Reka UI for selection, keyboard navigation, focus management, and the relationship
between each tab and panel.

## Usage

<ComponentPreview name="tabs/TabsBasic" />

## Features

- Controlled and uncontrolled selection
- Automatic first-enabled-item selection
- Line, segmented, and pill presentations
- Three shared component sizes
- Disabled items
- Automatic or manual keyboard activation
- Horizontal overflow for narrow containers
- Optional panels with configurable mounting behavior
- Typed slots for labels, leading content, trailing content, and panels
- Global and local slot-class configuration

## API

### Props

| Prop             | Type                              | Default       | Description                                      |
| ---------------- | --------------------------------- | ------------- | ------------------------------------------------ |
| `items`          | `readonly TabsItem[]`             | —             | Defines tab values, labels, and disabled states. |
| `modelValue`     | `string \| number`                | —             | Controls the active tab with `v-model`.          |
| `defaultValue`   | `string \| number`                | first enabled | Sets the initial uncontrolled tab.               |
| `variant`        | `'line' \| 'segmented' \| 'pill'` | `'line'`      | Sets the visual presentation.                    |
| `size`           | `'sm' \| 'md' \| 'lg'`            | `'md'`        | Sets trigger height, spacing, and typography.    |
| `activationMode` | `'automatic' \| 'manual'`         | `'automatic'` | Controls whether focus also selects a tab.       |
| `loop`           | `boolean`                         | `true`        | Lets arrow-key focus wrap between the ends.      |
| `unmountOnHide`  | `boolean`                         | `true`        | Unmounts inactive panel content.                 |
| `ui`             | `TabsUI`                          | —             | Adds classes to the root and named parts.        |

`TabsItem` contains `value`, `label`, and an optional `disabled` property. Native attributes and
listeners are forwarded to the root element.

### Events

| Event               | Payload            | Description                          |
| ------------------- | ------------------ | ------------------------------------ |
| `update:modelValue` | `string \| number` | Emitted when the active tab changes. |

### Slots

Every slot receives `{ item, active }`.

| Slot       | Description                                  |
| ---------- | -------------------------------------------- |
| `tab`      | Replaces the item's visible label.           |
| `leading`  | Adds content before each label.              |
| `trailing` | Adds content after each label.               |
| `content`  | Renders the panel associated with each item. |

## Variants

Use `line` for navigation that should blend into its surrounding layout. Use `segmented` for a
contained control with one moving selected segment. Use `pill` for independent rounded badge-like
tabs.

```vue
<MkTabs :items="items" variant="line" />
<MkTabs :items="items" variant="segmented" />
<MkTabs :items="items" variant="pill" />
```

## Controlled and uncontrolled use

Bind `v-model` when another part of the application needs to control the active value. Omit it for
uncontrolled use; ModeKit selects `defaultValue`, or otherwise the first enabled item.

```vue
<MkTabs :items="items" default-value="activity" />
```

## Custom tab content

Leading and trailing slots make icons, counters, and status indicators possible without changing
the item model.

```vue
<MkTabs :items="items">
  <template #leading="{ item }">
    <AppIcon :name="item.value" aria-hidden="true" />
  </template>

  <template #trailing="{ item }">
    <span v-if="item.value === 'activity'">12</span>
  </template>
</MkTabs>
```

## Styling

Tabs use the neutral scale and white for their surfaces, text, and borders, and primary for selected
and focus states. Use `ui` for a local adjustment:

```vue
<MkTabs
  :items="items"
  :ui="{
    base: 'w-full',
    list: 'justify-center',
    trigger: 'font-semibold',
  }"
/>
```

Global configuration supports the root, every named slot, both variants, all sizes, and their
defaults:

```ts
app.use(
  createModeKit({
    ui: {
      tabs: {
        slots: {
          trigger: 'font-semibold',
        },
        defaultVariants: {
          variant: 'segmented',
          size: 'md',
        },
      },
    },
  }),
)
```

## Accessibility

`MkTabs` renders the standard tablist, tab, and tabpanel roles through Reka UI. Each tab is linked
to its panel with `aria-controls` and `aria-labelledby`. Left and Right Arrow move focus, Home and
End move to the first and last available tab, and disabled items are skipped. In automatic mode,
moving focus selects the tab. In manual mode, press Enter or Space to select it.

Pass `aria-label` or `aria-labelledby` to `MkTabs` to name the semantic tablist. ModeKit forwards
those naming attributes to the element with `role="tablist"` rather than the visual root wrapper.
