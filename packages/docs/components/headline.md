# Headline

`MkHeadline` creates semantic headings with a visual scale that stays independent from the document outline. Choose `as` from the page structure and `size` from the interface hierarchy.

## Usage

<ComponentPreview name="typography/HeadlinePlayground" />

The `display` variant tightens line height and tracking for prominent dashboard or marketing titles. It does not change the rendered heading level.

Headline size names map directly to Tailwind's text scale: `xs` uses `text-xs`, `sm` uses `text-sm`,
`md` uses `text-base`, and `lg` through `9xl` use their matching `text-*` utilities.

## API

| Prop      | Values                                            | Default   |
| --------- | ------------------------------------------------- | --------- |
| `as`      | `h1`–`h6` or a component                          | `h2`      |
| `variant` | `default`, `display`                              | `default` |
| `size`    | `xs`–`9xl`                                        | `md`      |
| `primary` | `boolean`                                         | `false`   |
| `weight`  | `inherit`, `normal`, `medium`, `semibold`, `bold` | `bold`    |
| `align`   | `inherit`, `left`, `center`, `right`, `justify`   | `inherit` |
| `ui`      | `{ base?: ModeKitClassValue }`                    | —         |

Headline uses neutral-800 by default. Set `primary` to use the configured theme-primary color.

Native HTML attributes and `class` are forwarded to the rendered element. Global defaults and axis overrides live at `createModeKit({ ui: { headline } })`.

## Accessibility

Use heading levels in a logical sequence. Change `size` rather than choosing an incorrect heading element to achieve a visual treatment.
