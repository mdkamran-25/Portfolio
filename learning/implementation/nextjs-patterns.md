# Next.js 14+ Enterprise Implementation Guide 🚀

## The Modern Next.js Stack (2024)

### App Router Architecture

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page
├── loading.tsx            # Loading UI
├── error.tsx              # Error handling
├── not-found.tsx          # 404 pages
├── global-error.tsx       # Global error boundary
├── (auth)/                # Route groups (URL structure)
│   ├── login/
│   └── register/
├── dashboard/
│   ├── page.tsx
│   ├── layout.tsx         # Nested layout
│   └── settings/
│       └── page.tsx
└── api/                   # API routes
    ├── auth/
    │   └── route.ts
    └── projects/
        ├── route.ts       # GET/POST /api/projects
        └── [id]/
            └── route.ts   # GET/PUT/DELETE /api/projects/[id]
```

## Pattern 1: Server Components + Client Components Strategy

### The 80/20 Rule

- **80% Server Components**: Static content, data fetching, SEO-critical parts
- **20% Client Components**: Interactive UI, state management, event handlers

```typescript
// ✅ Server Component (Default)
export default async function ProjectsPage() {
  // Direct database access - no API needed!
  const projects = await db.project.findMany({
    where: { published: true },
    include: { author: true, tags: true }
  })

  return (
    <div>
      <ProjectsHeader />
      <ProjectsList projects={projects} />
      <PaginationControls />
    </div>
  )
}

// ✅ Client Component (Only when needed)
'use client'

export function ProjectsList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => filter === 'all' || p.category === filter)
      .sort((a, b) => sortBy === 'date'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : a.title.localeCompare(b.title)
      )
  }, [projects, filter, sortBy])

  return (
    <div>
      <ProjectFilters filter={filter} onFilterChange={setFilter} />
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```

### When to Use Each:

#### Server Components ✅

- Static content and layouts
- Data fetching from databases/APIs
- SEO-critical content
- Environment variables access
- Large dependencies (Markdown parsers, image processors)

#### Client Components ✅

- User interactions (clicks, forms, inputs)
- State management (useState, useReducer)
- Browser APIs (localStorage, geolocation)
- Event listeners
- Custom hooks

## Pattern 2: Data Fetching Strategies

### Strategy 1: Server Components (Preferred)

```typescript
// ✅ Direct database access in Server Components
export default async function ProjectPage({ params }) {
  const project = await db.project.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      tags: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!project) notFound()

  return (
    <div>
      <ProjectHeader project={project} />
      <ProjectContent content={project.content} />
      <CommentsList comments={project.comments} />
    </div>
  )
}
```

### Strategy 2: React Query for Client-Side

```typescript
// ✅ React Query for dynamic data in Client Components
'use client'

export function ProjectComments({ projectId }: { projectId: string }) {
  const {
    data: comments,
    isLoading,
    error
  } = useQuery({
    queryKey: ['project-comments', projectId],
    queryFn: () => api.projects.getComments(projectId),
    refetchInterval: 30000, // Real-time updates
  })

  const { mutate: addComment } = useMutation({
    mutationFn: api.projects.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(['project-comments', projectId])
    }
  })

  if (isLoading) return <CommentsSkeleton />
  if (error) return <ErrorMessage />

  return (
    <div>
      <CommentForm onSubmit={addComment} />
      <CommentsList comments={comments} />
    </div>
  )
}
```

### Strategy 3: Hybrid Approach

```typescript
// ✅ Server Component for initial data + Client Component for updates
export default async function ProjectPage({ params }) {
  // Server-side: Initial data for fast loading
  const initialProject = await getProject(params.id)

  return (
    <div>
      <ProjectHeader project={initialProject} />
      <ProjectContent project={initialProject} />
      {/* Client Component for real-time features */}
      <ProjectInteractions
        projectId={params.id}
        initialLikes={initialProject.likes}
        initialViews={initialProject.views}
      />
    </div>
  )
}

'use client'
function ProjectInteractions({ projectId, initialLikes, initialViews }) {
  const [likes, setLikes] = useState(initialLikes)
  const [views, setViews] = useState(initialViews)

  // Real-time updates with optimistic UI
  const { mutate: toggleLike } = useMutation({
    mutationFn: () => api.projects.toggleLike(projectId),
    onMutate: () => {
      setLikes(prev => prev + 1) // Optimistic update
    }
  })

  return (
    <div>
      <Button onClick={toggleLike}>❤️ {likes}</Button>
      <span>👀 {views}</span>
    </div>
  )
}
```

## Pattern 3: Route Organization & Layouts

### Nested Layouts for Common UI

```typescript
// app/layout.tsx - Root layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

// app/dashboard/layout.tsx - Dashboard layout
export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// app/(marketing)/layout.tsx - Marketing layout with route groups
export default function MarketingLayout({ children }) {
  return (
    <div>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  )
}
```

### Route Groups for Organization

```
app/
├── (marketing)/         # Route group - doesn't affect URL
│   ├── page.tsx        # → /
│   ├── about/
│   │   └── page.tsx    # → /about
│   └── contact/
│       └── page.tsx    # → /contact
├── (app)/              # Another route group
│   ├── dashboard/
│   │   └── page.tsx    # → /dashboard
│   └── projects/
│       └── page.tsx    # → /projects
└── api/
    └── route.ts
```

## Pattern 4: Advanced API Routes

### RESTful API with Proper HTTP Methods

```typescript
// app/api/projects/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const filter = searchParams.get("filter");

  try {
    const projects = await db.project.findMany({
      where: filter ? { category: filter } : {},
      skip: (page - 1) * limit,
      take: limit,
      include: { author: true, tags: true },
    });

    const total = await db.project.count({
      where: filter ? { category: filter } : {},
    });

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }

    const project = await db.project.create({
      data: {
        ...validation.data,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
```

### Dynamic API Routes with Validation

```typescript
// app/api/projects/[id]/route.ts
import { z } from "zod";

const updateProjectSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
      include: { author: true, tags: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error },
        { status: 400 }
      );
    }

    // Check ownership
    const existingProject = await db.project.findUnique({
      where: { id: params.id },
    });

    if (!existingProject || existingProject.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedProject = await db.project.update({
      where: { id: params.id },
      data: validation.data,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
```

## Pattern 5: Performance Optimization

### Streaming with Suspense

```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />

      {/* Fast-loading content renders immediately */}
      <QuickStats />

      {/* Slow content streams in */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <RecentProjects />
      </Suspense>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  )
}

// Slow component that fetches data
async function RecentProjects() {
  // Simulated slow API call
  const projects = await getRecentProjects()

  return (
    <div>
      <h2>Recent Projects</h2>
      <ProjectGrid projects={projects} />
    </div>
  )
}
```

### Image Optimization

```typescript
import Image from 'next/image'

// ✅ Optimized images with proper sizing
export function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <Image
        src={project.image}
        alt={project.title}
        width={400}
        height={300}
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <h3>{project.title}</h3>
    </div>
  )
}
```

### Metadata for SEO

```typescript
// app/projects/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await getProject(params.id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Your Portfolio`,
    description: project.description,
    keywords: project.tags.map((tag) => tag.name),
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}
```

## Pattern 6: Error Handling & Loading States

### Granular Error Boundaries

```typescript
// app/dashboard/error.tsx
'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="error-boundary">
      <h2>Something went wrong in the dashboard!</h2>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}

// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-stats" />
      <div className="skeleton-charts" />
    </div>
  )
}
```

## Next.js 14+ Best Practices

### 1. **Server-First Architecture**

- Default to Server Components
- Use Client Components only when needed
- Leverage server-side data fetching

### 2. **Progressive Enhancement**

- Core functionality works without JavaScript
- Enhanced experience with client-side features
- Graceful degradation for older browsers

### 3. **Performance by Default**

- Use Next.js Image component
- Implement proper loading states
- Optimize bundle splitting with dynamic imports

### 4. **Type Safety Everywhere**

- TypeScript for all components and API routes
- Zod for runtime validation
- Proper error handling with typed responses

### 5. **Caching Strategy**

- Leverage Next.js automatic caching
- Use React Query for client-side caching
- Implement proper cache invalidation

## Common Next.js Anti-Patterns

### ❌ Using Client Components Everywhere

```typescript
// ❌ Unnecessary 'use client'
'use client'
export default function HomePage() {
  return <div>Static content</div> // No interactivity needed!
}
```

### ❌ Fetching Data in Client Components When Server Would Work

```typescript
// ❌ Client-side fetching for static data
"use client";
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects").then(/* ... */); // Should be server-side!
  }, []);
}
```

### ❌ Not Using Layouts for Common UI

```typescript
// ❌ Repeating header/footer in every page
export default function AboutPage() {
  return (
    <div>
      <Header /> {/* Repeated everywhere */}
      <main>About content</main>
      <Footer /> {/* Repeated everywhere */}
    </div>
  )
}
```

Remember: **Next.js 14+ is designed for server-first, performance-optimized applications!** 🚀
