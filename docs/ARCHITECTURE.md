# Architecture Overview

## Goals

- Scalable modular feature architecture
- Atomic + feature-sliced hybrid
- Clear separation of design primitives vs feature composition
- Testable, typed, accessible by default

## Layering Model

```
app (Next.js routing & layout shells)
└─ templates (page-level composition; no business logic)
   └─ organisms (data orchestration + composition of molecules)
      └─ molecules (combine atoms with layout logic)
         └─ atoms/primitives (pure, stylized, stateless UI units)

features (domain-oriented modules)
shared (cross-feature generic code)
design-system (tokens + primitives)
services (IO boundaries: API, 3rd-party)
state (global or cross-feature caches)
lib (pure helpers / adapters)
config (static configuration + env)
```

## Directories

| Path                           | Responsibility                              | Notes                                |
| ------------------------------ | ------------------------------------------- | ------------------------------------ |
| `src/app`                      | Routes, metadata, edge/server toggles       | Keep thin; import templates          |
| `src/design-system/tokens`     | JSON/TS tokens (colors, spacing, radii)     | Source of truth consumed by Tailwind |
| `src/design-system/primitives` | Reusable atoms (Button, Badge, Card)        | No feature logic                     |
| `src/features/*`               | Domain-specific logic/components            | Each has its own boundary            |
| `src/services`                 | External API wrappers, payment SDK adaptors | Return typed data only               |
| `src/state`                    | React Query setup, Zustand slices           | Distinguish server cache vs UI state |
| `src/lib`                      | Pure utilities (formatters, mappers)        | No side effects                      |
| `src/shared`                   | Cross-domain components/hooks               | Avoid domain coupling                |
| `src/types`                    | Global domain types & shared interfaces     | Narrow & documented                  |
| `src/test`                     | Test utilities, mocks, fixtures             | Deterministic                        |

## Import Rules

- Upward imports are forbidden (lower layers cannot import higher layers):
  - primitives < molecules < organisms < templates
  - design-system < features (features can consume primitives, not vice versa)
- Use path aliases (configured in `tsconfig.json`):
  - `@/app/*`, `@/design-system/*`, `@/features/*`, `@/services/*`, `@/state/*`, `@/lib/*`, `@/shared/*`, `@/types/*`

## Component Contracts

Each component documents:

- Props (typed & JSDoc)
- Accessibility notes (role, aria-\*, keyboard interactions)
- Visual states (hover, active, disabled, focus)

## Data Flow

- Pages load feature orchestrators (organisms) → use React Query hooks → repositories → services.
- Repositories transform transport DTO → domain models (validated by Zod) → UI.

## Example Flow

1. `ProjectsPage` template asks `ProjectsOrganism` for data.
2. `ProjectsOrganism` uses `useProjects()` hook (React Query).
3. `useProjects` calls `projectRepository.getFeatured()`.
4. Repository fetches (local constant or remote) via `ProjectService`.
5. Service returns raw; repository validates & maps to domain model.
6. Organism renders list using `ProjectCard` molecule composed from primitives.

## State Strategy

- Server/Data: React Query (stale-while-revalidate, caching keys: `projects:featured`, `projects:freelance`).
- UI/Ephemeral: Zustand slices (e.g. `useModalStore`, `useThemeStore`).
- Avoid context for anything other than stable global concerns (theme).

## Error Handling

- Service layer returns `Result<T, E>` or throws controlled errors (ZodValidationError, NetworkError).
- Organisms catch & render error states (retry, fallback copy).

## Theming

- `ThemeProvider` sets `data-theme` and injects CSS variable set.
- Tokens → CSS vars: `--color-bg-primary`, `--radius-sm`, etc.
- Tailwind config maps semantic names to vars: `colors: { bg: 'var(--color-bg-primary)' }`.

## Accessibility Principles

- Interactive primitives handle focus ring & keyboard.
- Modal traps focus & restores on close.
- Lists & grids use correct semantic containers.

## Performance

- Dynamic import organisms that are below the fold.
- Avoid passing large objects through deep trees; derive inside hooks.
- Memoize heavy selectors & computation.

## Security & Config

- All env read through `config/env.ts` with Zod schema.
- Razorpay & 3rd-party keys only on server components / route handlers where possible.

## Extension Guidelines

When adding a feature:

1. Create `src/features/feature-name` folder.
2. Add `types.ts`, `api.ts` (or `service.ts`), `repository.ts`, `hooks/`, `components/`.
3. Expose only necessary surface via `index.ts` barrel.
4. Write Storybook stories for all new primitives/molecules.
5. Add tests (unit + feature scenario).

## Deprecation Process

- Mark legacy components with `/** @deprecated Use NewComponent */`.
- Track removal in an ADR or CHANGELOG.

## ADRs

Architecture decisions recorded in `docs/adr/` with incremental numbering.

---

This document will evolve; propose updates via PR + ADR where architectural impact exists.
