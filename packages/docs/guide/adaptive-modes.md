# Adaptive modes

An iOS-style interface is not automatically light, and a web interface is not automatically
compact. ModeKit keeps these choices separate so applications can combine them as needed.

```ts
type Platform = 'ios' | 'android' | 'web'
type ColorScheme = 'light' | 'dark'
type Density = 'comfortable' | 'compact'
type Contrast = 'normal' | 'high'
```

Configure these choices at the application boundary with `ModeKitProvider`:

```vue
<ModeKitProvider platform="ios" color-scheme="dark" density="comfortable" contrast="normal">
  <App />
</ModeKitProvider>
```

Nested providers can apply a different configuration to one section without changing the rest of
the application.

## Platform resolution

ModeKit currently uses explicit provider properties with predictable web, light, comfortable, and
normal defaults. Applications remain free to resolve those values from their own environment or
configuration before passing them to the provider.

Automatic environment detection may be added later as a convenience. It must remain only a
default: applications should always be able to force any mode on any device for embedded apps,
testing, documentation, and products that intentionally use one visual style everywhere.

Viewport width alone is not enough to determine a platform. A narrow browser window may still need
the web appearance, and a large tablet is still a touch device.

## Token layers

ModeKit organizes CSS values in layers. Components normally read component tokens, while
application themes normally override semantic tokens.

```text
primitive tokens
    ↓
semantic tokens
    ↓
component tokens
    ↓
component styles
```

Applications can change a semantic token such as `--mk-color-primary` without depending on the
internal variables used by Button, Switch, or Checkbox.

Primitive values and some component-level tokens may remain internal until there is a demonstrated
reason to expose them. A CSS variable becomes difficult to rename after applications depend on it.

## Rules for adaptive components

- Support light and dark schemes from the first component proof.
- Keep hard-coded colors out of component rules.
- Provide visible focus treatment in every mode and scheme.
- Respect reduced-motion preferences.
- Check contrast automatically where possible and manually where necessary.
- Base future platform detection on capabilities and context, not only viewport width.
