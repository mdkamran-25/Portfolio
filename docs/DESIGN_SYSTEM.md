# Design System

## Objectives

- Consistency across all features
- Clear, themeable primitives
- Accessible by default
- Token-driven styling (single source of truth)

## Token Categories

| Category   | Examples                               | Notes                                         |
| ---------- | -------------------------------------- | --------------------------------------------- |
| Color      | `color.bg.primary`, `color.text.muted` | Represent semantic meaning, not raw hex names |
| Spacing    | `space.xs` → 4, `space.md` → 16        | 4px baseline scale                            |
| Radii      | `radius.sm`, `radius.full`             | Primitives only consume semantic tokens       |
| Typography | `font.family.base`, `font.size.sm`     | Use CSS variables + Tailwind mapping          |
| Shadows    | `shadow.sm`, `shadow.lg`               | For elevation system                          |
| Z Index    | `z.modal`, `z.dropdown`                | Keep small, meaningful set                    |

## File Structure

```
/design-system
  /tokens
    tokens.json          (authoritative raw tokens)
    build.ts             (optional: transform tokens → css vars)
  /foundations
    ThemeProvider.tsx
    tailwind-plugin.ts   (inject token-based utilities)
  /primitives
    Button.tsx
    Badge.tsx
    Card.tsx
    Typography.tsx
    Modal.tsx
  /components (generic molecules)
  /icons
  /utilities (polymorphic + a11y helpers)
```

## Naming Conventions

- Use semantic names: `bg.surface`, `bg.inverse`, `text.accent`, `border.subtle`.
- Avoid raw color names (no `blue-500` outside token definitions).

## Theming Strategy

- CSS variables under `:root` for default theme.
- Override set under `[data-theme="dark"]`, `[data-theme="light"]`, future `[data-theme="high-contrast"]`.
- User preference persisted (localStorage) + OS preference fallback.

## Primitive Requirements

Each primitive must document:

- Props (with JSDoc)
- Variants (e.g. Button: `variant = solid | outline | subtle`, `tone = primary | neutral | danger`)
- Sizes (`sm`, `md`, `lg` scale mapped to spacing tokens)
- Accessibility contract (role, keyboard)
- States: hover, active, focus-visible, disabled, loading

## Example: Button Variant Mapping

```
const buttonVariants = {
  solid: {
    primary: 'bg-accent text-onAccent hover:bg-accentHover disabled:bg-accentDisabled',
    neutral: 'bg-surface-strong text-text hover:bg-surface-strongHover',
  },
  outline: {
    primary: 'border border-accent text-accent hover:bg-accent/10',
  },
  subtle: {
    primary: 'text-accent hover:bg-accent/10',
  }
};
```

## Accessibility

- Focus ring: consistent token (e.g. `--focus-ring: 0 0 0 3px var(--color-focus);`).
- Contrast check automated in Storybook.
- Motion preferences respected (reduce transitions if `prefers-reduced-motion`).

## Storybook Standards

- Every primitive: Docs tab (Overview, Props table, Accessibility notes).
- Tokens page: auto-generated from `tokens.json`.
- Interaction tests for critical behaviors (Button loading disables click, Modal focus trap).

## Icon Strategy

- Single `index.ts` re-export; tree-shakeable named exports.
- Use `<Icon name="github" size={20} />` wrapper for consistent sizing.

## Badge (Tech Tag) Example

```
<Badge label="TypeScript" tone="tech" />
<Badge label="Production" tone="neutral" />
```

## Change Management

- Any token change requires a visual regression (Chromatic) review.
- Breaking changes documented in CHANGELOG + migration snippet.

## Future Enhancements

- Figma → tokens sync (Style Dictionary).
- Automated dark/light algorithmic derivations.
- Theme packs for organizations (plugin system).
