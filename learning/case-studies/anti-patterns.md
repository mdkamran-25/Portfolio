# Anti-Patterns: Learning from Billion-Dollar Mistakes 💸

## The Million-Dollar Refactor: When "Good Enough" Becomes Technical Debt

### Anti-Pattern #1: The Monolithic Component Monster

#### What Companies Do Wrong

```typescript
// ❌ Real example from a $2B startup (anonymized)
export const UserDashboard = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [notifications, setNotifications] = useState([])
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  // ... 50 more state variables

  const handleSearch = (query) => {
    setSearchQuery(query)
    // 100 lines of search logic
  }

  const handleFilter = (filter) => {
    setFilterBy(filter)
    // 80 lines of filter logic
  }

  const handleSort = (sort) => {
    setSortBy(sort)
    // 60 lines of sort logic
  }

  // ... 15 more massive functions

  return (
    <div>
      {/* 500+ lines of JSX */}
      <Header user={user} notifications={notifications} />
      <Sidebar settings={settings} />
      <main>
        <SearchBar value={searchQuery} onChange={handleSearch} />
        <FilterTabs value={filterBy} onChange={handleFilter} />
        <SortDropdown value={sortBy} onChange={handleSort} />
        <ProjectsList
          projects={projects.filter(/* complex filter logic */)}
        />
        {showModal && (
          <Modal>
            <ProjectDetails project={selectedProject} />
            <CommentsList projectId={selectedProject?.id} />
            <TasksList projectId={selectedProject?.id} />
            {/* More nested components */}
          </Modal>
        )}
      </main>
    </div>
  )
}
```

#### The Real Cost

- **Development Time**: 3-4 days to make simple changes
- **Bug Risk**: Changing one feature breaks unrelated features
- **Onboarding**: New developers take 2+ weeks to understand this component
- **Testing**: Impossible to test thoroughly - too many edge cases
- **Reusability**: Zero - everything is coupled together

#### The Enterprise Solution

```typescript
// ✅ How billion-dollar companies actually structure this

// 1. Feature-based architecture
features/
  dashboard/
    components/
      DashboardLayout.tsx
      DashboardHeader.tsx
    hooks/
      useDashboardData.ts

  projects/
    components/
      ProjectsList.tsx
      ProjectCard.tsx
      ProjectFilters.tsx
    hooks/
      useProjectFilters.ts
      useProjectSearch.ts

  notifications/
    components/
      NotificationCenter.tsx

// 2. Composed implementation
export const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <ProjectsSection />
      <NotificationsSection />
    </DashboardLayout>
  )
}

const ProjectsSection = () => {
  const { projects, isLoading, error } = useProjects()
  const { filters, search, sort } = useProjectFilters()

  if (isLoading) return <ProjectsSkeleton />
  if (error) return <ProjectsError error={error} />

  return (
    <section>
      <ProjectFilters {...filters} />
      <ProjectSearch {...search} />
      <ProjectSort {...sort} />
      <ProjectsList projects={projects} />
    </section>
  )
}
```

---

### Anti-Pattern #2: CSS Chaos - The Styling Nightmare

#### What Went Wrong at Scale

```css
/* ❌ Real CSS from a billion-dollar company (before refactor) */

/* 2014: First developer */
.button {
  background: blue;
  padding: 10px;
}

/* 2015: Second developer adds variation */
.button-large {
  background: blue;
  padding: 15px;
  font-size: 18px;
}

/* 2016: Third developer needs red button */
.button-red {
  background: red;
  padding: 10px;
}

/* 2017: Fourth developer needs large red button */
.button-large-red {
  background: red;
  padding: 15px;
  font-size: 18px;
}

/* 2018: Designer changes blue to a different blue */
.button {
  background: #007bff;
}
.button-large {
  background: #007bff;
} /* Forgot to update this one! */

/* 2019: Product manager wants all buttons slightly bigger */
.button {
  padding: 12px;
} /* Updated one */
.button-large {
  padding: 15px;
} /* Didn't update this */
.button-red {
  padding: 10px;
} /* Or this */
.button-large-red {
  padding: 15px;
} /* Or this */

/* 2020: CSS file is now 50,000 lines with 847 different button styles */
```

#### The Real Cost

- **Bundle Size**: 2.3MB of CSS (should be <200KB)
- **Performance**: 3-second load times due to CSS size
- **Consistency**: 847 different button styles across the app
- **Maintenance**: Afraid to delete any CSS - might break something
- **Development**: 2-3 hours to style a simple feature

#### The Billion-Dollar Solution

```typescript
// ✅ How enterprises actually handle this

// 1. Design tokens (single source of truth)
export const tokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem'
  }
}

// 2. Component variants (systematic approach)
const buttonVariants = cva(
  'font-medium rounded transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

// 3. Usage - impossible to create inconsistent styles
<Button variant="primary" size="lg">Large Primary</Button>
<Button variant="secondary" size="sm">Small Secondary</Button>
```

---

### Anti-Pattern #3: State Management Anarchy

#### The Real Disaster

```typescript
// ❌ How a $5B company's codebase looked before refactor

// Global state for EVERYTHING
const globalStore = {
  // User data
  currentUser: null,
  userPreferences: {},
  userSettings: {},

  // UI state (why is this global?!)
  modalIsOpen: false,
  dropdownExpanded: false,
  tooltipVisible: false,
  sidebarCollapsed: false,

  // Form data (different forms!)
  loginForm: { email: '', password: '' },
  profileForm: { name: '', avatar: '' },
  projectForm: { title: '', description: '' },

  // Cached API data
  projects: [],
  users: [],
  notifications: [],

  // Derived data (redundant!)
  filteredProjects: [],
  sortedProjects: [],
  favoriteProjects: [],

  // Random stuff
  lastClickedButton: null,
  mousePosition: { x: 0, y: 0 },
  timeSpentOnPage: 0
}

// Component trying to use this mess
const ProjectCard = ({ projectId }) => {
  const dispatch = useDispatch()
  const {
    projects,
    filteredProjects,
    sortedProjects,
    currentUser,
    modalIsOpen,
    tooltipVisible
  } = useSelector(state => state.everything) // Takes entire state!

  const project = projects.find(p => p.id === projectId)

  const handleClick = () => {
    dispatch({ type: 'SET_LAST_CLICKED_BUTTON', payload: 'project-card' })
    dispatch({ type: 'SET_MODAL_OPEN', payload: true })
    dispatch({ type: 'SET_SELECTED_PROJECT', payload: project })
    dispatch({ type: 'UPDATE_FILTERED_PROJECTS' }) // Why?
    dispatch({ type: 'TRACK_USER_ACTION', payload: 'clicked_project' })
  }

  // Component re-renders when ANYTHING in global state changes
  return <div onClick={handleClick}>{project.title}</div>
}
```

#### The Real Cost

- **Performance**: Every component re-renders on any state change
- **Memory**: 15MB of state for a simple todo app
- **Bugs**: Changing modal state breaks project filters
- **Testing**: Impossible - need entire global state for every test
- **Development**: 30-minute debugging sessions for simple changes

#### The Enterprise Solution

```typescript
// ✅ How billion-dollar companies organize state

// 1. Server state (React Query)
const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.getById(id),
    staleTime: 5 * 60 * 1000
  })
}

// 2. Component state (useState)
const ProjectCard = ({ projectId }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { data: project, isLoading } = useProject(projectId)

  if (isLoading) return <ProjectSkeleton />

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {project.title}
    </div>
  )
}

// 3. Global state (only for truly global things)
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    const user = await authApi.login(credentials)
    set({ user, isAuthenticated: true })
  }
}))

// 4. URL state (for shareable state)
const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') || 'all'
  const page = Number(searchParams.get('page')) || 1

  const updateFilter = (newFilter: string) => {
    setSearchParams(prev => {
      prev.set('filter', newFilter)
      prev.set('page', '1')
      return prev
    })
  }
}
```

---

### Anti-Pattern #4: The API Nightmare

#### Real-World API Disaster

```typescript
// ❌ How a unicorn startup's API looked (before $10M refactor)

// Inconsistent naming
GET /api/users          // users
GET /api/getProjects    // projects (why "get"?)
GET /api/data/comments  // comments (why "data"?)

// Inconsistent response formats
// Users endpoint:
{ success: true, data: [{ id: 1, name: "John" }] }

// Projects endpoint:
{ projects: [{ _id: "abc", title: "Project" }] }

// Comments endpoint:
[{ commentId: 123, text: "Hello" }] // No wrapper object!

// No error standards
// Sometimes: { error: "User not found" }
// Sometimes: { message: "Invalid request", code: 400 }
// Sometimes: { success: false, errors: ["Field required"] }

// API client code was a nightmare
const fetchData = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint)
    const data = await response.json()

    // Need different logic for each endpoint!
    if (endpoint.includes('/users')) {
      return data.success ? data.data : null
    } else if (endpoint.includes('/projects')) {
      return data.projects || []
    } else if (endpoint.includes('/comments')) {
      return Array.isArray(data) ? data : []
    }

    // No one knows what format this endpoint returns
    return data.results || data.items || data.content || data
  } catch (error) {
    // Error handling is inconsistent too
    if (error.message.includes('404')) {
      return null
    } else if (error.status === 400) {
      throw new Error('Bad request')
    }
    throw error
  }
}
```

#### The Billion-Dollar Solution

```typescript
// ✅ How enterprises structure APIs

// 1. Consistent REST patterns
GET    /api/v1/projects          // List projects
POST   /api/v1/projects          // Create project
GET    /api/v1/projects/:id      // Get project
PATCH  /api/v1/projects/:id      // Update project
DELETE /api/v1/projects/:id      // Delete project

// 2. Consistent response format
interface ApiResponse<T> {
  data: T
  meta: {
    total?: number
    page?: number
    limit?: number
  }
  links?: {
    next?: string
    prev?: string
  }
}

interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

// 3. Type-safe API client
class ApiClient {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`/api/v1${endpoint}`)

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new ApiError(error.error.message, error.error.code)
    }

    return response.json()
  }

  async post<T, U>(endpoint: string, data: T): Promise<ApiResponse<U>> {
    const response = await fetch(`/api/v1${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new ApiError(error.error.message, error.error.code)
    }

    return response.json()
  }
}

// 4. React Query integration
const useProjects = (filters: ProjectFilters) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => apiClient.get<Project[]>('/projects', { params: filters }),
    select: (response) => response.data // Extract data automatically
  })
}
```

---

### Anti-Pattern #5: Testing Disasters

#### What Companies Get Wrong

```typescript
// ❌ Real testing code from a $3B company

// Testing implementation details
it('updates state correctly', () => {
  const wrapper = mount(<ProjectForm />)
  const instance = wrapper.instance()

  instance.setState({ title: 'New Title' })
  expect(instance.state.title).toBe('New Title')
  // What if we refactor to use hooks? This test breaks!
})

// Testing with shallow rendering
it('renders correctly', () => {
  const wrapper = shallow(<ProjectCard project={mockProject} />)
  expect(wrapper.find('.project-title')).toHaveLength(1)
  // Doesn't test if user can actually interact with it
})

// Mocking everything
it('submits form', () => {
  const mockSetState = jest.fn()
  const mockUseState = jest.fn(() => ['', mockSetState])
  React.useState = mockUseState

  const mockSubmit = jest.fn()
  const mockApi = { submit: mockSubmit }
  jest.mock('../api', () => mockApi)

  // Test is so mocked it doesn't test anything real
})

// Integration tests that are actually unit tests
it('integrates with API', async () => {
  const mockFetch = jest.fn().mockResolvedValue({
    json: () => ({ data: mockProject })
  })
  global.fetch = mockFetch

  render(<ProjectPage />)

  expect(mockFetch).toHaveBeenCalledWith('/api/projects/123')
  // This is testing the mock, not the real integration
})
```

#### The Enterprise Solution

```typescript
// ✅ How billion-dollar companies test

// 1. Test behavior, not implementation
it('creates a new project when form is submitted', async () => {
  const user = userEvent.setup()

  render(<ProjectForm onSubmit={mockSubmit} />)

  // Test what the user does
  await user.type(screen.getByLabelText(/project title/i), 'My Project')
  await user.type(screen.getByLabelText(/description/i), 'Great project')
  await user.click(screen.getByRole('button', { name: /create project/i }))

  // Test what the user sees
  expect(mockSubmit).toHaveBeenCalledWith({
    title: 'My Project',
    description: 'Great project'
  })
})

// 2. Integration tests with MSW
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/projects/:id', (req, res, ctx) => {
    return res(ctx.json({ data: mockProject }))
  })
)

it('displays project details', async () => {
  render(<ProjectPage projectId="123" />)

  // Test real API integration (with mock server)
  expect(await screen.findByText('My Project')).toBeInTheDocument()
  expect(screen.getByText('Project description')).toBeInTheDocument()
})

// 3. E2E tests for critical paths
test('user can create and view a project', async ({ page }) => {
  await page.goto('/projects/new')

  await page.fill('[data-testid="title"]', 'E2E Test Project')
  await page.fill('[data-testid="description"]', 'Created by test')
  await page.click('[data-testid="submit"]')

  await expect(page).toHaveURL(/\/projects\/\w+/)
  await expect(page.locator('h1')).toHaveText('E2E Test Project')
})
```

## Key Lessons from These Disasters

### 1. **Start with Good Patterns Early**

It's easier to start right than to refactor wrong patterns at scale:

```typescript
// Good from day 1
const Button = ({ variant, size, children, ...props }) => (
  <button className={buttonVariants({ variant, size })} {...props}>
    {children}
  </button>
)

// Rather than refactoring this later
const BlueButton = ({ children }) => <button style={{background: 'blue'}}>{children}</button>
const RedButton = ({ children }) => <button style={{background: 'red'}}>{children}</button>
// ... 47 more button components
```

### 2. **Invest in Architecture Early**

The companies that succeeded invested in good architecture before they needed it:

- Design systems before they had design inconsistency
- State management patterns before state became chaotic
- Testing strategies before bugs became expensive

### 3. **Learn from Others' Mistakes**

Every billion-dollar company made these mistakes and paid millions to fix them. You can learn from their pain without experiencing it yourself.

### 4. **Quality Gates Prevent Technical Debt**

```typescript
// ESLint rules that prevent anti-patterns
{
  "rules": {
    "react/jsx-props-no-spreading": "error", // Prevents prop spreading chaos
    "complexity": ["error", 10], // Prevents monster functions
    "max-lines": ["error", 300], // Prevents monster components
    "@typescript-eslint/no-any": "error" // Prevents type safety escape hatches
  }
}
```

Remember: **These anti-patterns destroyed productivity at billion-dollar companies. Learn from their expensive mistakes!** 💰
