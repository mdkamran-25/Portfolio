# Testing Strategy

## Overview

Our testing strategy follows a comprehensive pyramid approach with multiple layers of testing to ensure code quality, functionality, and user experience. We use industry-standard tools and practices to maintain enterprise-grade quality.

## Testing Pyramid

1. **Unit Tests** (atoms, pure utils) - 70%
2. **Integration Tests** (Storybook play functions, molecules) - 20%
3. **Feature Tests** (organisms + hooks) - 8%
4. **E2E Tests** (critical user flows) - 2%

## Tools & Technologies

- **Unit Testing**: Vitest + React Testing Library
- **Component Documentation**: Storybook with interaction tests
- **E2E Testing**: Playwright (cross-browser)
- **Accessibility**: axe-core integration
- **Coverage**: V8 coverage provider

## Quick Start

```bash
# Run all tests in sequence
npm run test:all

# Individual test commands
npm run test              # Unit tests
npm run test:coverage     # Unit tests with coverage
npm run test:e2e          # E2E tests
npm run test:e2e:ui       # E2E tests with UI
```

## E2E Testing Implementation

### Test Scenarios Covered

✅ **Navigation & Page Loading**

- Home page loads with all sections
- Navigation between all main pages
- Responsive design across devices
- Basic accessibility compliance
- SEO meta tags validation

✅ **Payment Flow (Razorpay Integration)**

- Payment modal opening/closing
- Amount selection functionality
- Razorpay script loading
- API integration (mocked)
- Error handling scenarios
- Multiple payment attempts

✅ **Contact Form**

- Form validation (client-side)
- Successful form submission
- API error handling
- Network timeout scenarios
- Special characters handling
- Keyboard accessibility

### E2E Test Structure

```
tests/e2e/
├── fixtures/
│   └── test-data.ts          # Test data and mocks
├── utils/
│   └── page-objects.ts       # Page Object Models
├── navigation.spec.ts        # Core navigation tests
├── payment.spec.ts           # Payment flow tests
└── contact.spec.ts           # Contact form tests
```

### Page Object Models

We use the Page Object Model pattern for maintainable E2E tests:

```typescript
// Example usage
const homePage = new HomePage(page);
await homePage.goto();
await homePage.verifyAllSectionsVisible();
await homePage.clickBuyMeCoffee();
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with browser UI (for debugging)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug specific test
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Minimum Coverage Targets

| Layer      | Lines |
| ---------- | ----- |
| Primitives | 90%   |
| Features   | 85%   |
| Overall    | 80%   |

## Unit Tests

- Test pure logic (formatters, mappers, repositories).
- Avoid mocking for simple data; use inline fixtures.

## Component Tests

- Atoms: render + variant snapshot + a11y role expectations.
- Molecules: behavior (e.g. selecting a project highlights card).

## Interaction Tests (Storybook)

- Use play functions for: hover states, focus rings, keyboard navigation.
- Auto-run with `@storybook/test-runner`.

## Feature Tests

- Combine repository mocks + hooks to test organism state transitions: loading → success → error.

## E2E

Scenarios:

- Navigate to Projects page → see list.
- Open payment modal → Razorpay script loads.
- Submit payment mock → success state.

## Mocks & Fixtures

- `/test/mocks/` for network/service mocks.
- `/test/fixtures/` for static JSON samples.

## Accessibility

- axe run on Storybook build.
- Fail build if critical violations found (configurable severity).

## Performance Budgets (Test Adjacent)

- Optional: Lighthouse CI for main pages (score thresholds).

## CI Workflow Steps

1. Install deps
2. Type-check
3. Lint
4. Unit + interaction tests
5. Build Storybook (and run a11y tests)
6. Build Next.js app
7. (Optional) Playwright against preview

## Test Data Guidelines

- Prefer factories (small helpers) over giant JSON dumps.
- Use realistic but minimal data shapes.

## Flaky Test Mitigation

- Retry logic for E2E only (2 retries max).
- Quarantine tag for unstable tests (`test.skipIfFlaky`).

## Adding New Tests Checklist

- Does it cover a user-visible behavior?
- Is the assertion resilient (no brittle DOM structure dependence)?
- Are accessibility roles included where relevant?
