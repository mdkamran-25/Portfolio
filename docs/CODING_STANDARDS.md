# Coding Standards

## General Principles

- Readability > Cleverness
- Small, pure functions / components
- Favor composition over inheritance
- Strong typing everywhere (no `any` unless justified with comment)

## TypeScript

- Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- Use discriminated unions for variant-like props.
- Prefer `type` aliases for unions; `interface` for object extension intended for public consumption.
- Export minimal surface from feature barrels.

## React

- Functional components only.
- No side effects in render path.
- Hooks naming: `useX` returns stable API; side-effect hooks encapsulate effects.
- Derive props locally instead of passing deep prop chains.
- Memoize only when perf profiling shows need.

## File Naming

- Components: `PascalCase.tsx`
- Hooks: `useThing.ts`
- Types: `thing.types.ts` or in `types.ts` inside feature.
- Tests: `Component.test.tsx` adjacent or in `__tests__`.

## Imports Order

1. React & core libs
2. Third-party packages
3. Absolute internal aliases
4. Relative paths (shortest to longest)

Enforce with ESLint `import/order`.

## Styling

- Prefer design-system primitives.
- Avoid inline arbitrary class sets if a primitive exists.
- Tailwind utility grouping order (suggested): layout → box model → typography → visual → state.

## Accessibility

- Every interactive element is a native element or has role + keyboard handlers.
- `aria-*` attributes only when necessary.
- Labels: explicit `<label>` or `aria-label` for icon buttons.

## Error Handling

- Throw domain-specific errors (`ProjectNotFoundError`).
- Catch at organism boundary; render fallback UI.
- Log unexpected errors centrally.

## Testing

- Test behavior, not implementation details.
- RTL queries: prefer role/text over test ids.
- Snapshot tests only for simple pure markup.

## Git Hygiene

- Branch naming: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`.
- Commits: Conventional (e.g. `feat(projects): add project repository`).
- One logical change per PR.

## Performance

- Avoid unnecessary providers at root.
- Dynamic import rarely needed for small atoms.
- Use `React.lazy`/`next/dynamic` for large, below-the-fold modules.

## Security

- Never expose secrets in client components.
- Validate all env vars before usage.

## Documentation

- JSDoc for public functions & complex logic blocks.
- Update relevant ADR or create new one when architecture shifts.

## Deprecated Code

- Mark with `/** @deprecated Reason. Use X instead */`.
- Remove after two minor versions or when unused.
