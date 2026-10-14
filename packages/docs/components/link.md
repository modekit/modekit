# Link

`MkLink` provides consistent palette-aware link treatments while retaining native anchor behavior and attributes.

## Usage

<ComponentPreview name="typography/LinkPlayground" />

`underline` keeps decoration visible, `hover` reveals it on hover and focus, and `plain` removes decoration while retaining color and focus treatment. ModeKit never infers `target="_blank"` or `rel`; consumers retain that navigation policy.

## API

| Prop      | Values                                            | Default     |
| --------- | ------------------------------------------------- | ----------- |
| `as`      | `a` or a component                                | `a`         |
| `variant` | `underline`, `hover`, `plain`                     | `underline` |
| `size`    | `inherit`, `xs`, `sm`, `md`, `lg`, `xl`           | `inherit`   |
| `primary` | `boolean`                                         | `false`     |
| `weight`  | `inherit`, `normal`, `medium`, `semibold`, `bold` | `medium`    |
| `ui`      | `{ base?: ModeKitClassValue }`                    | —           |

Link uses neutral-500 by default. Set `primary` to use the configured theme-primary color.

Native anchor attributes such as `href`, `target`, `rel`, `download`, and `aria-current` are forwarded. Configure global defaults through `createModeKit({ ui: { link } })`.

## Accessibility

Use descriptive link text that makes sense out of context. Preserve a visible focus state, and combine `target="_blank"` with an appropriate `rel` value when opening an untrusted destination in a new tab.
