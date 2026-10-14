# Ellipsis Text

`MkEllipsisText` composes `MkText` and constrains long interface copy to a predictable number of visible lines while preserving the original text in the DOM.

## Usage

<ComponentPreview name="typography/EllipsisTextPlayground" />

One line uses native overflow ellipsis. Two through four lines use a CSS line clamp. The component does not invent a tooltip or accessible description because applications must choose the disclosure pattern that fits their interaction.

## API

| Prop      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `as`      | `span`, `p`, `div`, or a component                | `span`    |
| `lines`   | `1`, `2`, `3`, `4`                                | `1`       |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`                      | `md`      |
| `primary` | `boolean`                                         | `false`   |
| `weight`  | `inherit`, `normal`, `medium`, `semibold`, `bold` | `normal`  |
| `align`   | `inherit`, `left`, `center`, `right`, `justify`   | `inherit` |
| `ui`      | `{ base?: ModeKitClassValue }`                    | —         |

Ellipsis Text inherits `MkText`'s neutral-500 default and boolean `primary` treatment.

Native attributes and `class` are forwarded. Configure global defaults through `createModeKit({ ui: { ellipsisText } })`.

## Accessibility

When truncation can hide meaningful content, provide access to the complete value through a native `title`, an explicit disclosure, or another accessible detail view. Do not rely on visual clipping alone for essential information.
