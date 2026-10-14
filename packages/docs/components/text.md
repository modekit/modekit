# Text

`MkText` is the general-purpose inline typography primitive for labels, metadata, and short interface copy. It renders a `span` by default and can render a `p`, `div`, `label`, or custom component when the surrounding semantics require it.

## Usage

<ComponentPreview name="typography/TextPlayground" />

The `label` variant adds compact tracking and medium weight while preserving the selected semantic element.

## API

| Prop      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `as`      | `span`, `p`, `div`, `label`, or a component       | `span`    |
| `variant` | `default`, `label`                                | `default` |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`                      | `md`      |
| `primary` | `boolean`                                         | `false`   |
| `weight`  | `inherit`, `normal`, `medium`, `semibold`, `bold` | `normal`  |
| `align`   | `inherit`, `left`, `center`, `right`, `justify`   | `inherit` |
| `ui`      | `{ base?: ModeKitClassValue }`                    | —         |

Text uses neutral-500 by default. Set `primary` to use the configured theme-primary color.

Native attributes and `class` are forwarded. Configure global defaults through `createModeKit({ ui: { text } })`.

## Accessibility

Prefer dedicated semantic components for headings, paragraphs, links, and form labels. Use `MkText` when inline or neutral text semantics are appropriate.
