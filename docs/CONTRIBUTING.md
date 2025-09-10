# Contributing Guide

## Workflow

1. Fork & clone (or branch within mono-repo permissions).
2. Create branch: `feat/feature-name`.
3. Run setup (install deps, bootstrap Storybook, run tests).
4. Make focused changes + add tests.
5. Run `pnpm lint && pnpm test && pnpm build` (or npm/yarn equivalent).
6. Commit using Conventional Commits.
7. Open PR with description + screenshots (UI changes).

## Commit Message Format

`<type>(scope): <subject>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Examples:

- `feat(projects): add project repository with Zod validation`
- `refactor(ds): extract Badge primitive`

## Pull Request Checklist

- [ ] Tests added/updated
- [ ] Storybook stories updated (if UI)
- [ ] No ESLint warnings
- [ ] No type errors
- [ ] Updated docs / ADR if architectural shift
- [ ] Accessible (focus, roles, labels)

## Branch Naming

- `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`, `perf/`

## Code Review Guidelines

Reviewer looks for:

- Clarity & simplicity
- Correct layering (no primitives importing feature code)
- Test adequacy
- Performance implications
- Accessibility compliance

## Dependency Policy

- Prefer zero/low dependency solutions for small utilities.
- Justify large dependencies in PR description.
- Lock versions; avoid wildcards.

## ADRs (Architecture Decision Records)

- New architectural direction → create `docs/adr/NNN-title.md`.
- Template: Context, Decision, Alternatives, Consequences.

## Issue Reporting

Include: steps to reproduce, expected, actual, environment.

## Security

Report sensitive issues privately (create SECURITY.md later).

## Local Commands (to be added)

- `pnpm dev` – run dev server
- `pnpm storybook` – component explorer
- `pnpm test` – run unit + interaction tests
- `pnpm lint` – linting

## Release Process (Future)

1. PRs merged into `main`.
2. Semantic release generates changelog + version.
3. Deploy preview → production.

---

Thanks for contributing! Keep changes small and purposeful.
