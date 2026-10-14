# Caption

`MkCaption` presents subordinate metadata, timestamps, labels, and supporting context on a compact scale.

## Usage

<ComponentPreview name="typography/CaptionPlayground" />

The `uppercase` variant adds uppercase transformation and wider tracking for compact category or eyebrow labels.

## API

| Prop      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `as`      | `span`, `p`, `div`, or a component                | `span`    |
| `variant` | `default`, `uppercase`                            | `default` |
| `size`    | `xs`, `sm`, `md`                                  | `sm`      |
| `primary` | `boolean`                                         | `false`   |
| `weight`  | `inherit`, `normal`, `medium`, `semibold`, `bold` | `medium`  |
| `align`   | `inherit`, `left`, `center`, `right`, `justify`   | `inherit` |
| `ui`      | `{ base?: ModeKitClassValue }`                    | —         |

Caption uses the same neutral-500 body treatment by default. Set `primary` to use the configured theme-primary color.

Native attributes and `class` are forwarded. Configure global defaults through `createModeKit({ ui: { caption } })`.

## Accessibility

A smaller visual treatment does not define semantics. Choose `as` based on whether the caption is inline or forms its own text block, and maintain sufficient contrast for essential metadata.
