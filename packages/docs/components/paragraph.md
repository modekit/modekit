# Paragraph

`MkParagraph` renders readable body copy with size-aware line height and a controlled text measure supplied by the surrounding layout.

## Usage

<ComponentPreview name="typography/ParagraphPlayground" />

Use the `lead` variant for introductory copy that needs a more spacious rhythm. Paragraph margins are reset so layout containers retain responsibility for vertical spacing.

## API

| Prop      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `as`      | `p`, `div`, or a component                        | `p`       |
| `variant` | `default`, `lead`                                 | `default` |
| `size`    | `xs`, `sm`, `md`, `lg`, `xl`                      | `md`      |
| `primary` | `boolean`                                         | `false`   |
| `weight`  | `inherit`, `normal`, `medium`, `semibold`, `bold` | `normal`  |
| `align`   | `inherit`, `left`, `center`, `right`, `justify`   | `inherit` |
| `ui`      | `{ base?: ModeKitClassValue }`                    | —         |

Paragraph uses neutral-500 by default. Set `primary` to use the configured theme-primary color.

Native attributes and `class` are forwarded. Configure global defaults through `createModeKit({ ui: { paragraph } })`.

## Accessibility

Keep body copy in semantic paragraphs. Use `as="div"` only when paragraph semantics would be incorrect, not as a styling shortcut.
