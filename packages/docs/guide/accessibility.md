# Accessibility

People should be able to use ModeKit components with a keyboard, screen reader, touch input, zoom,
increased contrast, or reduced motion without every application team fixing the same problems.

## Baseline

The baseline target is WCAG 2.2 AA where it applies to the component.

For every interactive component we need to answer:

- Which native HTML element should it use?
- How does it receive an accessible name and description?
- Which keys operate it?
- Where does focus move, and how does it return?
- What do disabled and read-only mean for this component?
- How are validation errors announced?
- Is the touch target large enough?
- What changes when reduced motion is enabled?
- Does it remain readable in light, dark, and increased-contrast environments?

## How we test it

1. Static linting and type checks
2. Component behavior tests
3. Automated accessibility checks in a real browser
4. Keyboard interaction tests
5. Manual screen-reader review for complex components
6. Visual regression across component variants, sizes, states, and color schemes

Automated tools catch useful problems, but a passing scan does not prove that a component is
accessible. Dialogs, menus, selects, and tabs still need manual keyboard and screen-reader testing.

## Component documentation

Each component page should tell developers:

- its semantic purpose;
- its keyboard behavior;
- accessible naming guidance;
- known constraints;
- examples of good and bad usage.
