# Testing Strategy for Enterprise Applications 🧪

## The Testing Pyramid for React/Next.js

```
                    🔺
                 E2E Tests
              (5% - Slow, Expensive)
                    |
              Integration Tests
           (15% - Medium Speed/Cost)
                    |
               Unit Tests
         (80% - Fast, Cheap, Reliable)
```

## Level 1: Unit Testing (Foundation)

### Testing Primitives with Vitest

```typescript
// src/design-system/primitives/Button/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  // Basic rendering
  it('renders with default props', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-blue-500') // Default variant
  })

  // Variant testing
  it('applies correct variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-500')
  })

  // Interaction testing
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Accessibility testing
  it('is accessible', () => {
    render(<Button disabled>Disabled button</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  // Edge cases
  it('handles children correctly', () => {
    render(
      <Button>
        <span>Icon</span>
        Text content
      </Button>
    )

    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Text content')).toBeInTheDocument()
  })

  // Polymorphic component testing
  it('renders as different elements when using "as" prop', () => {
    render(<Button as="a" href="/link">Link button</Button>)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/link')
    expect(link).toHaveClass('bg-blue-500') // Still has button styles
  })
})
```

### Testing Custom Hooks

```typescript
// src/shared/hooks/useToggle.test.ts
import { renderHook, act } from "@testing-library/react";
import { useToggle } from "./useToggle";

describe("useToggle", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useToggle(false));

    expect(result.current.value).toBe(false);
  });

  it("toggles value", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);
  });

  it("sets specific values", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current.setTrue();
    });
    expect(result.current.value).toBe(true);

    act(() => {
      result.current.setFalse();
    });
    expect(result.current.value).toBe(false);
  });
});
```

### Testing Utilities and Pure Functions

```typescript
// src/lib/utils/formatters.test.ts
import { formatCurrency, formatDate, truncateText } from "./formatters";

describe("formatters", () => {
  describe("formatCurrency", () => {
    it("formats currency correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
      expect(formatCurrency(0)).toBe("$0.00");
      expect(formatCurrency(-100)).toBe("-$100.00");
    });

    it("handles different locales", () => {
      expect(formatCurrency(1234.56, "EUR", "de-DE")).toBe("1.234,56 €");
    });
  });

  describe("formatDate", () => {
    it("formats dates correctly", () => {
      const date = new Date("2024-01-15");
      expect(formatDate(date)).toBe("January 15, 2024");
    });

    it("handles invalid dates", () => {
      expect(formatDate(null)).toBe("Invalid date");
    });
  });

  describe("truncateText", () => {
    it("truncates long text", () => {
      const longText = "This is a very long text that should be truncated";
      expect(truncateText(longText, 20)).toBe("This is a very long...");
    });

    it("returns original text if shorter than limit", () => {
      expect(truncateText("Short text", 20)).toBe("Short text");
    });
  });
});
```

## Level 2: Integration Testing (Component Interactions)

### Testing Feature Components

```typescript
// src/features/projects/components/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectCard } from './ProjectCard'
import { mockProject } from '@/test/fixtures/project'

// Mock child components to focus on integration
vi.mock('@/design-system/primitives/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  )
}))

describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />)

    expect(screen.getByText(mockProject.title)).toBeInTheDocument()
    expect(screen.getByText(mockProject.description)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', mockProject.title)
  })

  it('renders technology badges', () => {
    render(<ProjectCard project={mockProject} />)

    mockProject.technologies.forEach(tech => {
      const badge = screen.getByText(tech.name)
      expect(badge).toBeInTheDocument()
      expect(badge.closest('[data-testid="badge"]')).toHaveAttribute(
        'data-variant',
        'tech'
      )
    })
  })

  it('handles favorite toggle', async () => {
    const onFavoriteToggle = vi.fn()
    render(
      <ProjectCard
        project={mockProject}
        onFavoriteToggle={onFavoriteToggle}
      />
    )

    const favoriteButton = screen.getByRole('button', { name: /favorite/i })
    await userEvent.click(favoriteButton)

    expect(onFavoriteToggle).toHaveBeenCalledWith(mockProject.id)
  })

  it('shows loading state during favorite toggle', async () => {
    render(<ProjectCard project={mockProject} isUpdatingFavorite />)

    const favoriteButton = screen.getByRole('button', { name: /favorite/i })
    expect(favoriteButton).toBeDisabled()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })
})
```

### Testing Forms with Complex Logic

```typescript
// src/features/projects/components/ProjectForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectForm } from './ProjectForm'

const mockSubmit = vi.fn()

describe('ProjectForm', () => {
  beforeEach(() => {
    mockSubmit.mockClear()
  })

  it('submits form with valid data', async () => {
    render(<ProjectForm onSubmit={mockSubmit} />)

    // Fill out form
    await userEvent.type(
      screen.getByLabelText(/title/i),
      'My Awesome Project'
    )
    await userEvent.type(
      screen.getByLabelText(/description/i),
      'This is a great project'
    )
    await userEvent.selectOptions(
      screen.getByLabelText(/category/i),
      'web-app'
    )

    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'My Awesome Project',
        description: 'This is a great project',
        category: 'web-app'
      })
    })
  })

  it('shows validation errors for empty required fields', async () => {
    render(<ProjectForm onSubmit={mockSubmit} />)

    // Try to submit empty form
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('disables submit button while submitting', async () => {
    render(<ProjectForm onSubmit={mockSubmit} isSubmitting />)

    const submitButton = screen.getByRole('button', { name: /creating/i })
    expect(submitButton).toBeDisabled()
  })

  it('resets form after successful submission', async () => {
    const { rerender } = render(<ProjectForm onSubmit={mockSubmit} />)

    // Fill and submit form
    await userEvent.type(screen.getByLabelText(/title/i), 'Test Project')
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    // Simulate successful submission
    rerender(<ProjectForm onSubmit={mockSubmit} isSubmitted />)

    expect(screen.getByLabelText(/title/i)).toHaveValue('')
  })
})
```

## Level 3: API Testing (Next.js Routes)

### Testing API Routes

```typescript
// src/app/api/projects/route.test.ts
import { GET, POST } from "./route";
import { NextRequest } from "next/server";
import { mockProject } from "@/test/fixtures/project";

// Mock database
vi.mock("@/lib/db", () => ({
  project: {
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
}));

describe("/api/projects", () => {
  describe("GET", () => {
    it("returns paginated projects", async () => {
      const mockProjects = [mockProject];
      vi.mocked(db.project.findMany).mockResolvedValue(mockProjects);
      vi.mocked(db.project.count).mockResolvedValue(1);

      const request = new NextRequest("http://localhost:3000/api/projects?page=1&limit=10");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.projects).toEqual(mockProjects);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it("filters projects by category", async () => {
      const request = new NextRequest("http://localhost:3000/api/projects?filter=web-app");

      await GET(request);

      expect(db.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: "web-app" },
        })
      );
    });

    it("handles database errors", async () => {
      vi.mocked(db.project.findMany).mockRejectedValue(new Error("DB Error"));

      const request = new NextRequest("http://localhost:3000/api/projects");
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe("Failed to fetch projects");
    });
  });

  describe("POST", () => {
    it("creates a new project", async () => {
      const newProject = { ...mockProject, id: "new-id" };
      vi.mocked(db.project.create).mockResolvedValue(newProject);

      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: "New Project",
          description: "Project description",
          category: "web-app",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(newProject);
    });

    it("validates request body", async () => {
      const request = new NextRequest("http://localhost:3000/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title: "", // Invalid: empty title
          description: "Valid description",
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Validation failed");
    });
  });
});
```

## Level 4: E2E Testing with Playwright

### Critical User Journeys

```typescript
// tests/e2e/project-creation.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Project Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated state
    await page.goto("/login");
    await page.fill('[data-testid="email"]', "test@example.com");
    await page.fill('[data-testid="password"]', "password");
    await page.click('[data-testid="login-button"]');
  });

  test("creates a new project successfully", async ({ page }) => {
    // Navigate to create project page
    await page.goto("/dashboard/projects/new");

    // Fill out the form
    await page.fill('[data-testid="project-title"]', "E2E Test Project");
    await page.fill('[data-testid="project-description"]', "Created by E2E test");
    await page.selectOption('[data-testid="project-category"]', "web-app");

    // Upload an image
    await page.setInputFiles('[data-testid="project-image"]', "tests/fixtures/test-image.jpg");

    // Add technologies
    await page.click('[data-testid="add-tech-button"]');
    await page.fill('[data-testid="tech-input"]', "React");
    await page.press('[data-testid="tech-input"]', "Enter");

    // Submit form
    await page.click('[data-testid="create-project-button"]');

    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/projects\/[\w-]+/);

    // Verify project appears in list
    await page.goto("/dashboard/projects");
    await expect(page.locator("text=E2E Test Project")).toBeVisible();
  });

  test("shows validation errors for invalid data", async ({ page }) => {
    await page.goto("/dashboard/projects/new");

    // Try to submit empty form
    await page.click('[data-testid="create-project-button"]');

    // Check for validation errors
    await expect(page.locator("text=Title is required")).toBeVisible();
    await expect(page.locator("text=Description is required")).toBeVisible();
  });

  test("saves draft automatically", async ({ page }) => {
    await page.goto("/dashboard/projects/new");

    // Start filling form
    await page.fill('[data-testid="project-title"]', "Draft Project");

    // Wait for auto-save
    await expect(page.locator('[data-testid="auto-save-indicator"]')).toHaveText("Saved");

    // Refresh page
    await page.reload();

    // Verify draft is restored
    await expect(page.locator('[data-testid="project-title"]')).toHaveValue("Draft Project");
  });
});
```

### Visual Regression Testing

```typescript
// tests/e2e/visual-regression.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Visual Regression Tests", () => {
  test("homepage looks correct", async ({ page }) => {
    await page.goto("/");

    // Wait for all images to load
    await page.waitForLoadState("networkidle");

    // Take screenshot
    await expect(page).toHaveScreenshot("homepage.png");
  });

  test("project card variations", async ({ page }) => {
    await page.goto("/projects");

    // Test different states
    const projectCard = page.locator('[data-testid="project-card"]').first();

    // Normal state
    await expect(projectCard).toHaveScreenshot("project-card-normal.png");

    // Hover state
    await projectCard.hover();
    await expect(projectCard).toHaveScreenshot("project-card-hover.png");

    // Favorited state
    await page.click('[data-testid="favorite-button"]');
    await expect(projectCard).toHaveScreenshot("project-card-favorited.png");
  });
});
```

## Test Configuration & Setup

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/*.stories.{ts,tsx}",
        "src/app/**", // Next.js app directory
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Test Setup File

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
import { beforeAll, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## Testing Best Practices

### 1. **Test Behavior, Not Implementation**

```typescript
// ❌ Testing implementation details
expect(component.state.isLoading).toBe(true);

// ✅ Testing user-visible behavior
expect(screen.getByTestId("spinner")).toBeInTheDocument();
```

### 2. **Use Data-Testid Strategically**

```typescript
// ✅ For complex selectors or dynamic content
<Button data-testid="submit-project-form">Submit</Button>

// ✅ Prefer semantic queries when possible
screen.getByRole('button', { name: /submit/i })
```

### 3. **Mock External Dependencies**

```typescript
// ✅ Mock API calls
vi.mock("@/lib/api", () => ({
  projectApi: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));
```

### 4. **Test Error States**

```typescript
it('handles API errors gracefully', async () => {
  vi.mocked(projectApi.create).mockRejectedValue(new Error('API Error'))

  render(<ProjectForm onSubmit={handleSubmit} />)
  // ... fill form and submit

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

### 5. **Use Factory Functions for Test Data**

```typescript
// src/test/factories/project.ts
export const createMockProject = (overrides = {}) => ({
  id: "project-1",
  title: "Test Project",
  description: "Test description",
  status: "published",
  createdAt: new Date().toISOString(),
  ...overrides,
});
```

Remember: **Good tests give you confidence to refactor and deploy!** 🎯
