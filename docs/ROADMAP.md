# Project Evolution Roadmap

A phased plan to evolve this portfolio into an enterprise‑grade, atomic, design‑system–driven, scalable codebase.

## Phase 0 – Audit & Baseline

**Goals:** Understand current surface area and set measurable baselines.

- Inventory components (map to Atomic: span badge → Atom, ProjectCard → Molecule, Details panel → Organism, Page template → Template).
- Capture bundle size (initial + after optimization).
- Enable metrics: Web Vitals (temporary console logger).
- Identify style duplication (Tailwind class repetition).

## Phase 1 – Tooling & Quality Gates

**Goals:** Enforce consistency and shift-left quality.

- Enable `"strict": true` in `tsconfig.json`.
- Add ESLint (next + a11y + import/order + unused imports) & Prettier.
- Add Stylelint if custom CSS extracted later.
- Husky + lint-staged: run type-check, eslint, prettier, unit tests on staged files.
- Conventional Commits (commitlint + config-conventional).
- GitHub Actions workflow: install, type-check, lint, test, build.

## Phase 2 – Architectural Restructure (Layered + Atomic)

**Goals:** Introduce stable directories without breaking features.

```
/src
  /app                (Next.js routing)
  /config             (runtime/env schemas)
  /types              (global domain & utility types)
  /lib                (pure utilities + adapters)
  /services           (API/repository modules)
  /state              (React Query + Zustand slices)
  /design-system
    /tokens           (color, spacing, radii, typography)
    /foundations      (Theme provider, CSS vars, Tailwind plugin)
    /primitives       (Atoms)
    /components       (Molecules/Organisms - generic)
    /icons            (central icon exports)
    /utilities        (a11y & polymorphic helpers)
  /features
    /projects         (feature-scoped components, hooks, api)
    /freelance
    /payments
  /shared             (cross-feature helpers/components)
  /test               (test utils, mocks)
```

- Migrate incrementally: create new directories; copy, then refactor references.
- Add path aliases in `tsconfig.json` (`@/design-system/*`, `@/features/*`, etc.).

## Phase 3 – Design Tokens & Theming

**Goals:** Replace ad-hoc Tailwind clusters with semantic tokens.

- Create `tokens/tokens.json` (colors, spacing, radii, font, z-index, shadows).
- Generate CSS variables in `:root` + `[data-theme]` (dark/light or future themes).
- Extend `tailwind.config.ts` programmatically from tokens.
- Build primitives: `Button`, `Badge`, `Card`, `Stack`, `Heading`, `Text`.
- Document in Storybook (MDX + Controls for tokens).

## Phase 4 – Domain Modeling & Validation

**Goals:** Make data reliable and typed across layers.

- Zod schemas: `ProjectSchema`, `FreelanceProjectSchema` → runtime validation.
- Repositories: `projectRepository.getFeatured()`, `projectRepository.getFreelance()`.
- Map raw constants to domain models (future API adaptability).

## ✅ Phase 5 – State & Side Effects Discipline [COMPLETE]

**Goals:** Predictable data + UI state boundaries.

- ✅ Introduce React Query for server/cache state (even if static now → future ready).
- ✅ Zustand slice for UI (modals, theme, ephemeral selections).
- ✅ Razorpay integration refactor: `PaymentService` + `usePayment()` hook.

**Completed:**

- QueryProvider with 5-minute caching strategy
- Comprehensive UI store with modals, theme, navigation, filters
- PaymentService class with full error handling
- usePayment hook with mutations and status tracking
- Full TypeScript integration with no compilation errors

## Phase 6 – Testing Strategy Rollout

**Goals:** Confidence for refactors.

- Unit (atoms/primitives) with Vitest + React Testing Library.
- Interaction tests in Storybook (play functions).
- Accessibility: automated axe pass in CI Storybook build.
- Feature tests: project selection panel behavior.
- E2E: Playwright flows (open projects page, open payment modal).
- Coverage thresholds (lines 80%, critical paths >90%).

## Phase 7 – Performance & DX Enhancements

**Goals:** Keep app fast & maintainable at scale.

- Bundle analysis (code splitting per feature; dynamic import heavy panels).
- Tree-shake icon exports (barrel re-exports with explicit paths).
- Use `next/font` for typography control.
- Avoid deep relative imports (ESLint boundaries rule).
- Plop generator for new feature scaffolds + atom templates.

## Phase 8 – Accessibility & Internationalization

**Goals:** Global readiness & usability.

- Semantic lists for project grids (`<ul><li>`).
- Focus management + aria attributes for modals.
- Color contrast audit vs WCAG AA (adjust light yellows/cyans).
- i18n scaffold via `next-intl` (namespaces: `common`, `projects`, `payments`).

## Phase 9 – Documentation & Governance

**Goals:** Onboarding at scale.

- `CONTRIBUTING.md` with workflow (branch naming, commit prefixes).
- CODEOWNERS for `/design-system`, `/features/payments`.
- ADR template + first ADRs (state mgmt choice, theming approach).
- Storybook as single source of truth for components.

## Phase 10 – Security & Reliability

**Goals:** Reduce operational risk.

- Zod env schema gate at startup.
- Dependabot + `npm audit` CI step.
- Basic rate limiting (middleware) if APIs expand.
- Central logging util (wrap console, future instrument).
- Error Boundary for organisms that fetch/load.

## Phase 11 – Incremental Migration Plan

1. Freeze net-new styling outside tokens once tokens exist.
2. Introduce Badge atom; swap all tech tag spans.
3. Migrate Button usage (demo links etc.).
4. Extract ProjectCard molecule into `/features/projects/components`.
5. Move freelance details panel → organism.
6. Convert pages to templates referencing organisms.
7. Remove deprecated `/components/sections` after parity.

## Phase 12 – Quality Metrics & Enforcement

**Goals:** Continuous feedback loop.

- CI fails on: lint errors, type errors, test failures, coverage drop, bundle over budget.
- Add size-limit or webpack-bundle-analyzer artifact.
- Track Core Web Vitals (log to console first, later remote endpoint).
- Add circular dependency detection (madge in CI).

## Quick Start Checklist (First 7 Days)

Day 1–2: TS strict, ESLint+Prettier, path aliases, initial tokens.
Day 3: Badge + Button primitives, Storybook setup.
Day 4: Replace tech tags; extract ProjectCard.
Day 5: Zod schemas + repository layer; payment service refactor.
Day 6: Add unit + Storybook interaction tests; CI pipeline.
Day 7: Accessibility pass + ADRs + CONTRIBUTING draft.

## Success Criteria

- New atom creation <10 min using generator.
- 0 untyped `any` in `/features` & `/design-system`.
- All UI primitives have Storybook stories & a11y pass.
- CI green in <5 min average.
- Adding a new project requires only editing data layer, not UI code.

---

Iterate per phase; do not attempt a big-bang rewrite. Embrace branch-by-abstraction with high test coverage for safety.
