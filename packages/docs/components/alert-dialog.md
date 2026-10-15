# Alert Dialog

Alert Dialog interrupts a workflow to obtain an explicit confirmation. It uses `role="alertdialog"`,
traps focus, focuses the safe cancel action first, blocks outside interaction, and cannot be dismissed
with Escape or an outside click.

## Usage

<ComponentPreview name="alert-dialog/AlertDialogBasic" />

The default slot supplies one trigger element. `title` and `description` establish the accessible
warning, while `action-label` and `cancel-label` provide complete built-in controls. Cancel uses the
quiet `ghost` Button variant and receives initial focus. The action uses the red Button color by
default; choose a different `action-color` when confirmation is important but not destructive.

Use Alert Dialog only when the user must make an explicit consequential choice. Use Dialog for
ordinary modal workflows that may be dismissed, and Callout for information that does not interrupt
the current task.

## Controlled state

<ComponentPreview name="alert-dialog/AlertDialogControlled" />

Use `v-model:open` for application-owned visibility or omit the trigger entirely for programmatic
confirmation. Both action controls request closure through `update:open`. Controlled consumers decide
when to apply that request.

## Custom actions

<ComponentPreview name="alert-dialog/AlertDialogCustomActions" />

The `cancel` and `action` slots accept complete interactive elements. Alert Dialog augments those
elements directly with the required primitive behavior and classes. Keep the safe action first in
the DOM and preserve clear labels that name each outcome.

## Behavior guarantees

- Modal focus trapping, background hiding, and document scroll locking
- Initial focus on the cancel action rather than the consequential action
- No Escape, outside-pointer, or outside-focus dismissal
- Focus restoration to the trigger after either explicit choice
- Controlled, uncontrolled, and triggerless programmatic state
- Accessible alert-dialog title and description relationships
- Built-in cancel and configurable confirmation Buttons
- Custom consumer-owned action controls through semantic slots
- Responsive sizes, persistent mounting, portals, and the same animation modes as Dialog
- Global configuration, local slot classes, and native content attributes

## API

### Props

| Prop            | Type                                                        | Default      | Description                                           |
| --------------- | ----------------------------------------------------------- | ------------ | ----------------------------------------------------- |
| `as`            | `string \| Component`                                       | `'div'`      | Changes the alert-dialog content element.             |
| `title`         | `string`                                                    | —            | Supplies the accessible alert title.                  |
| `description`   | `string`                                                    | —            | Supplies the consequence or supporting context.       |
| `open`          | `boolean`                                                   | —            | Controls the open state.                              |
| `defaultOpen`   | `boolean`                                                   | `false`      | Sets the initial uncontrolled state.                  |
| `unmountOnHide` | `boolean`                                                   | `true`       | Unmounts content after its close transition.          |
| `size`          | `'sm' \| 'md' \| 'lg' \| 'xl'`                              | `'sm'`       | Selects the responsive panel width.                   |
| `animation`     | `'scale' \| 'fade' \| 'slide-up' \| 'slide-down' \| 'none'` | `'scale'`    | Selects panel and overlay motion.                     |
| `cancelLabel`   | `string`                                                    | `'Cancel'`   | Labels the built-in ghost safe action.                |
| `actionLabel`   | `string`                                                    | `'Continue'` | Labels the built-in confirmation action.              |
| `actionColor`   | `ButtonColor`                                               | `'red'`      | Colors the built-in confirmation Button.              |
| `actionVariant` | `ButtonVariant`                                             | `'default'`  | Styles the built-in confirmation Button.              |
| `portal`        | `boolean \| string \| HTMLElement`                          | `true`       | Portals to body, renders inline, or selects a target. |
| `ui`            | `AlertDialogUI`                                             | —            | Adds classes to the panel and structural slots.       |

Native attributes and listeners apply to the alert-dialog content element. Supply a title through the
prop or slot and include a description that explains the consequence before the user chooses.

### Events

| Event            | Payload      | Description                                              |
| ---------------- | ------------ | -------------------------------------------------------- |
| `update:open`    | `boolean`    | Emitted when an explicit action requests a state change. |
| `action`         | `MouseEvent` | Emitted when the confirmation action is activated.       |
| `cancel`         | `MouseEvent` | Emitted when the safe action is activated.               |
| `openAutoFocus`  | `Event`      | Emitted before initial focus moves to cancel.            |
| `closeAutoFocus` | `Event`      | Emitted before focus returns after closing.              |

### Slots

| Slot          | Props                            | Description                                              |
| ------------- | -------------------------------- | -------------------------------------------------------- |
| `default`     | —                                | Supplies the optional trigger element.                   |
| `title`       | `{ title, open, close() }`       | Replaces title content inside the semantic title.        |
| `description` | `{ description, open, close() }` | Replaces semantic description content.                   |
| `content`     | `{ open, close() }`              | Adds supporting content between the warning and actions. |
| `cancel`      | `{ open, close() }`              | Replaces the complete safe action element.               |
| `action`      | `{ open, close() }`              | Replaces the complete confirmation action element.       |

## Accessibility

Alert Dialog deliberately removes implicit dismissal. The user must choose cancel or confirmation,
so every instance must present both reachable actions. Cancel receives initial focus to reduce
accidental confirmation. Do not override open autofocus to target the consequential action.

Use a concise question for the title and describe the irreversible or important consequence in the
description. A destructive confirmation should name the object and action rather than use ambiguous
labels such as “Yes”.

## Styling

`AlertDialogUI` exposes `base`, `overlay`, `header`, `title`, `description`, `body`, `footer`, `cancel`,
and `action`. Size and animation variants can also be configured globally.

```ts
app.use(
  createModeKit({
    ui: {
      alertDialog: {
        base: 'border-red-200',
        slots: { footer: 'border-t border-neutral-200 pt-4' },
        defaultVariants: { size: 'sm', animation: 'scale' },
      },
    },
  }),
)
```

Arbitrary Tailwind classes passed through configuration, `ui`, or native `class` must be generated
by the consuming application. Ordinary CSS classes work without consumer Tailwind.
