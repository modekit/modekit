# About ModeKit

ModeKit is a Vue component library for applications that run on more than one kind of device.

The basic idea is simple: a button should still be a button everywhere, but it does not need to
look or feel exactly the same on an iPhone, an Android phone, and a regular web browser. ModeKit
keeps the component API consistent while allowing presentation and interaction details to adapt.

ModeKit is built for Vue 3 and TypeScript.

## Why build this?

Most component libraries provide one visual language and ask applications to make it responsive.
That is often enough, but it does not account for the conventions people already know from the
device they use.

ModeKit goes further. A platform mode can affect:

- typography and spacing;
- control size and shape;
- hover, touch, and pressed feedback;
- navigation patterns;
- animation and motion;
- sensible defaults for pointer and touch input.

This does not mean copying native controls pixel for pixel. The goal is to make the interface feel
familiar while keeping a recognizable product identity.

## Who is it for?

- Vue application teams
- TypeScript-first projects
- Product teams serving phones, tablets, and larger browser layouts from one application
- Teams that want an accessible design system instead of copying component markup between projects

## What we care about

- **A predictable API.** Changing the platform mode should not require rewriting the template.
- **Good defaults with an escape hatch.** Applications can choose every mode explicitly.
- **Accessibility in the component itself.** Consumers should not need to repair basic keyboard or
  screen-reader behavior.
- **Useful customization.** Common design choices should be available through documented tokens
  instead of fragile selectors.
- **Small releases.** We will prove a few components properly before building a large catalogue.

## What makes ModeKit useful?

ModeKit is successful when:

1. The same Vue template works in all three platform modes.
2. Each mode feels intentional rather than recolored.
3. Keyboard, screen-reader, reduced-motion, and high-contrast behavior are covered by tests and
   manual review.
4. Consumers can customize semantic tokens without forking components.
5. Components are typed, documented, and easy to import without unnecessary code.
