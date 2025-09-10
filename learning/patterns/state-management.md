# State Management Mastery 🔄

## The State Management Hierarchy

### Level 1: Component State (80% of cases)

```typescript
// ✅ Perfect for simple, local state
const ToggleButton = () => {
  const [isActive, setIsActive] = useState(false)

  return (
    <Button
      variant={isActive ? 'primary' : 'secondary'}
      onClick={() => setIsActive(!isActive)}
    >
      {isActive ? 'Active' : 'Inactive'}
    </Button>
  )
}
```

### Level 2: URL State (For navigation-related state)

```typescript
// ✅ Perfect for filters, pagination, tabs
const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') || 'all'
  const page = Number(searchParams.get('page')) || 1

  const updateFilter = (newFilter: string) => {
    setSearchParams(prev => {
      prev.set('filter', newFilter)
      prev.set('page', '1') // Reset page when filtering
      return prev
    })
  }

  return (
    <div>
      <FilterTabs value={filter} onChange={updateFilter} />
      <ProjectList filter={filter} page={page} />
    </div>
  )
}
```

### Level 3: Context State (For component trees)

```typescript
// ✅ Perfect for theme, user preferences, form state
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
```

### Level 4: Server State (For API data)

```typescript
// ✅ Perfect for data fetching with React Query
const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectApi.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

const ProjectPage = ({ id }) => {
  const { data: project, isLoading, error } = useProject(id)

  if (isLoading) return <ProjectSkeleton />
  if (error) return <ErrorCard />
  if (!project) return <NotFound />

  return <ProjectDetails project={project} />
}
```

### Level 5: Global State (For app-wide state)

```typescript
// ✅ Only for truly global state (user auth, app config)
const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    const user = await authApi.login(credentials);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
```

## State Management Decision Tree

### Question 1: "Is this state used by only one component?"

→ **YES**: Use `useState` in that component
→ **NO**: Continue to Question 2

### Question 2: "Should this state persist across page reloads?"

→ **YES**: Use URL params or localStorage
→ **NO**: Continue to Question 3

### Question 3: "Is this data from an API?"

→ **YES**: Use React Query/SWR
→ **NO**: Continue to Question 4

### Question 4: "Do components 2+ levels apart need this state?"

→ **YES**: Use Context or global state
→ **NO**: Lift state up to common parent

### Question 5: "Is this truly global app state?"

→ **YES**: Use Zustand/Redux
→ **NO**: Use Context

## Pattern 1: The Compound State Hook

### Problem: Related State Values

```typescript
// ❌ Multiple useState calls for related data
const ProjectForm = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tech, setTech] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Lots of individual setters...
}

// ✅ useReducer for complex related state
const projectFormReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' }
      }
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.value }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors, isSubmitting: false }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const ProjectForm = () => {
  const [state, dispatch] = useReducer(projectFormReducer, initialState)

  const setField = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }

  const submit = async () => {
    dispatch({ type: 'SET_SUBMITTING', value: true })
    try {
      await projectApi.create(state)
      dispatch({ type: 'RESET' })
    } catch (error) {
      dispatch({ type: 'SET_ERRORS', errors: error.fieldErrors })
    }
  }

  return (
    <form onSubmit={submit}>
      <input
        value={state.title}
        onChange={e => setField('title', e.target.value)}
      />
      {/* More fields... */}
    </form>
  )
}
```

## Pattern 2: The Optimistic Update Pattern

### Make UI Feel Instant

```typescript
// ✅ Optimistic updates with React Query
const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectApi.toggleFavorite,

    // Optimistically update UI
    onMutate: async (projectId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(["projects"]);

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData(["projects"]);

      // Optimistically update
      queryClient.setQueryData(["projects"], (old: Project[]) =>
        old.map((project) =>
          project.id === projectId ? { ...project, isFavorite: !project.isFavorite } : project
        )
      );

      return { previousProjects };
    },

    // Rollback on error
    onError: (err, projectId, context) => {
      queryClient.setQueryData(["projects"], context.previousProjects);
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });
};
```

## Pattern 3: The Derived State Pattern

### Don't Store What You Can Calculate

```typescript
// ❌ Storing derived state
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState("all");

  // Bug-prone: Forgetting to update derived state
  useEffect(() => {
    setFilteredProjects(projects.filter((p) => filter === "all" || p.status === filter));
  }, [projects, filter]);
};

// ✅ Calculate derived state
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");

  // Always in sync, no bugs possible
  const filteredProjects = useMemo(
    () => projects.filter((p) => filter === "all" || p.status === filter),
    [projects, filter]
  );

  const projectsByStatus = useMemo(() => groupBy(filteredProjects, "status"), [filteredProjects]);
};
```

## Pattern 4: The State Machine Pattern

### For Complex State Logic

```typescript
// ✅ State machine for complex flows
type FormState =
  | { status: 'idle' }
  | { status: 'validating' }
  | { status: 'submitting' }
  | { status: 'success'; data: Project }
  | { status: 'error'; error: string }

const formMachine = createMachine({
  id: 'projectForm',
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: 'validating'
      }
    },
    validating: {
      on: {
        VALID: 'submitting',
        INVALID: 'idle'
      }
    },
    submitting: {
      on: {
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: {
      on: {
        RESET: 'idle'
      }
    },
    error: {
      on: {
        RETRY: 'validating',
        RESET: 'idle'
      }
    }
  }
})

const ProjectForm = () => {
  const [state, send] = useMachine(formMachine)

  const handleSubmit = () => {
    send('SUBMIT')

    if (validateForm()) {
      send('VALID')
      submitForm()
        .then(() => send('SUCCESS'))
        .catch(() => send('ERROR'))
    } else {
      send('INVALID')
    }
  }

  return (
    <form>
      {state.matches('submitting') && <Spinner />}
      {state.matches('error') && <ErrorMessage />}
      {state.matches('success') && <SuccessMessage />}

      <Button
        disabled={!state.matches('idle')}
        onClick={handleSubmit}
      >
        {state.matches('submitting') ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
```

## Pattern 5: The Global Event Pattern

### For Loosely Coupled Communication

```typescript
// ✅ Event emitter for cross-component communication
type AppEvents = {
  "project:created": Project;
  "user:logout": void;
  "notification:show": { message: string; type: "success" | "error" };
};

const eventBus = new EventEmitter<AppEvents>();

// Component A: Emit event
const ProjectForm = () => {
  const createProject = async (data) => {
    const project = await projectApi.create(data);
    eventBus.emit("project:created", project);
    eventBus.emit("notification:show", {
      message: "Project created successfully!",
      type: "success",
    });
  };
};

// Component B: Listen to event
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const handleProjectCreated = (project: Project) => {
      setProjects((prev) => [...prev, project]);
    };

    eventBus.on("project:created", handleProjectCreated);
    return () => eventBus.off("project:created", handleProjectCreated);
  }, []);
};

// Component C: Listen to event
const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (notification) => {
      setNotifications((prev) => [...prev, notification]);
    };

    eventBus.on("notification:show", handleNotification);
    return () => eventBus.off("notification:show", handleNotification);
  }, []);
};
```

## Pattern 6: The Persistence Pattern

### Sync State with Storage

```typescript
// ✅ Custom hook for persistent state
const usePersistedState = <T>(
  key: string,
  defaultValue: T,
  storage: Storage = localStorage
) => {
  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = typeof value === 'function'
        ? (value as (prev: T) => T)(prev)
        : value

      try {
        storage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.warn('Failed to save to storage:', error)
      }

      return newValue
    })
  }, [key, storage])

  return [state, setValue] as const
}

// Usage
const UserPreferences = () => {
  const [theme, setTheme] = usePersistedState('theme', 'light')
  const [language, setLanguage] = usePersistedState('language', 'en')

  return (
    <div>
      <Select value={theme} onChange={setTheme}>
        <Option value="light">Light</Option>
        <Option value="dark">Dark</Option>
      </Select>
    </div>
  )
}
```

## Common State Management Anti-Patterns

### ❌ Over-Engineering Simple State

```typescript
// ❌ Redux for simple toggle
const useModalRedux = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);

  const openModal = () => dispatch({ type: "MODAL_OPEN" });
  const closeModal = () => dispatch({ type: "MODAL_CLOSE" });

  return { isOpen, openModal, closeModal };
};

// ✅ Simple useState for simple state
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};
```

### ❌ Putting Everything in Global State

```typescript
// ❌ Global state for component-specific state
const useGlobalState = create((set) => ({
  modalIsOpen: false,
  formData: {},
  hoveredProject: null,
  dropdownExpanded: false,
  // ... 50 more component-specific states
}));
```

### ❌ Not Normalizing API Data

```typescript
// ❌ Nested data structures
const projects = [
  {
    id: 1,
    author: { id: 5, name: "John", avatar: "..." },
    tags: [
      { id: 10, name: "React", color: "blue" },
      { id: 11, name: "TypeScript", color: "blue" },
    ],
  },
];

// ✅ Normalized data structures
const entities = {
  projects: {
    1: { id: 1, authorId: 5, tagIds: [10, 11] },
  },
  authors: {
    5: { id: 5, name: "John", avatar: "..." },
  },
  tags: {
    10: { id: 10, name: "React", color: "blue" },
    11: { id: 11, name: "TypeScript", color: "blue" },
  },
};
```

## State Management Best Practices

### 1. **Start Small, Scale Up**

- Begin with useState
- Move to useReducer for complex related state
- Add React Query for server state
- Use global state only when necessary

### 2. **Separate Concerns**

- UI state vs Server state vs App state
- Temporary state vs Persistent state
- Local state vs Shared state

### 3. **Optimize Performance**

- Use useMemo for expensive calculations
- Use useCallback for stable references
- Split context providers to prevent unnecessary re-renders
- Normalize data structures

### 4. **Make State Predictable**

- Prefer immutable updates
- Use TypeScript for state shape validation
- Keep state flat when possible
- Avoid storing derived state

Remember: **The best state management is the least state management!** 🎯
