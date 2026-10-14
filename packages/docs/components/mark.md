# Mark

`MkMark` composes `MkText` to highlight inline content while preserving the semantic HTML `mark` element by default. Its inherited size and weight keep emphasis aligned with surrounding text.

## Usage

<ComponentPreview name="typography/MarkPlayground" />

Choose `soft` for subtle highlighting, `solid` for stronger emphasis, or `outline` when the surrounding surface already carries color.

## API

| Prop      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `as`      | `mark`, `span`, or a component                    | `mark`    |
| `variant` | `soft`, `solid`, `outline`                        | `soft`    |
| `size`    | `inherit`, `xs`, `sm`, `md`, `lg`, `xl`           | `inherit` |
| `primary` | `boolean`                                         | `false`   |
| `weight`  | `inherit`, `normal`, `medium`, `semibold`, `bold` | `inherit` |
| `ui`      | `{ base?: ModeKitClassValue }`                    | —         |

Mark uses `MkText`'s neutral treatment by default. Set `primary` to apply the configured theme-primary treatment to both text and decoration.

Native attributes and `class` are forwarded. Configure global defaults through `createModeKit({ ui: { mark } })`.

## Accessibility

Use semantic marking for content that is relevant in the current context, such as a search match. Use ordinary emphasis or weight when the content is merely visually prominent.
