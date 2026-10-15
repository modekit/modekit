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

Current automated evidence includes:

1. static linting and type checks;
2. fast component behavior tests in jsdom;
3. Chromium interaction tests against the built package and packaged stylesheet;
4. keyboard, focus, dismissal, disabled-state, nested-overlay, and portal checks for Sheet, Dialog,
   Select, Dropdown, and Tooltip;
5. automated WCAG A/AA scans of the fixture and its active overlay surfaces; and
6. reviewed Chromium snapshots for selected light, dark, size, error, disabled, and reduced-motion
   states.

The portalled Select and Dropdown surfaces are scanned at the active listbox or menu while their
modal behavior intentionally hides the application root. Idle, Dialog, Sheet, and Tooltip states
receive full-page scans.

The browser suite currently runs only in Chromium. Firefox, WebKit, touch interaction, increased or
forced contrast, zoom, and screen-reader combinations are not yet release-tested. Do not describe
those environments as supported based on the current suite.

Automated tools catch useful problems, but a passing scan does not prove that a component is
accessible. Dialogs, menus, selects, and tabs still need manual keyboard and screen-reader testing.

## Manual release checklist

Before expanding browser-support claims or promoting a prerelease, record the reviewer, date,
browser, operating system, assistive technology, result, and any issue link for each relevant item:

- [ ] Complete a keyboard-only pass: logical tab order, visible focus, operation, dismissal, and
      focus return.
- [ ] Review Dialog, Sheet, Select, Dropdown, Tooltip, and Tabs with at least one desktop screen
      reader and browser combination.
- [ ] Check content and controls at 200% browser zoom without loss of information or operation.
- [ ] Check increased/forced-contrast rendering, including focus and disabled states.
- [ ] Check touch operation and target sizing on a real or emulated touch viewport.
- [ ] Confirm reduced-motion behavior for overlays and other animated components.

### Current review record

As of 2026-10-15, the automated Chromium interaction, accessibility-scan, and snapshot checks above
pass locally. No manual screen-reader, forced-contrast, zoom, or touch review has been recorded yet.
The current evidence is therefore not an accessibility certification or a blanket WCAG conformance
claim.

## Component documentation

Each component page should tell developers:

- its semantic purpose;
- its keyboard behavior;
- accessible naming guidance;
- known constraints;
- examples of good and bad usage.
