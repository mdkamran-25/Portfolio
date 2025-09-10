# Component Design Patterns 🎨

## The Evolution of Component Thinking

### Level 1: Basic Components (Where most developers stop)

```typescript
// ❌ Inflexible, hard to maintain
export const Button = () => (
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Click me
  </button>
)
```

### Level 2: Props-Based Components

```typescript
// ✅ Better, but still limited
export const Button = ({ children, color, size }) => (
  <button className={`bg-${color}-500 px-${size} py-2 rounded`}>
    {children}
  </button>
)
```

### Level 3: Compound Components (Enterprise level)

```typescript
// ✅ Flexible, composable, maintainable
export const Button = ({ variant, size, children, ...props }) => (
  <button
    className={buttonVariants({ variant, size })}
    {...props}
  >
    {children}
  </button>
)
```

### Level 4: Polymorphic Components (Billion-dollar level)

```typescript
// ✅ Ultimate flexibility
export const Button = <T extends ElementType = 'button'>({
  as,
  variant,
  size,
  children,
  ...props
}: ButtonProps<T>) => {
  const Component = as || 'button'
  return (
    <Component
      className={buttonVariants({ variant, size })}
      {...props}
    >
      {children}
    </Component>
  )
}

// Usage:
<Button as="a" href="/link">Link Button</Button>
<Button as={NextLink} to="/route">Router Link</Button>
```

## Pattern 1: The Variant System

### Why Class Variance Authority (CVA)?

```typescript
// ❌ Without CVA - Hard to maintain
const getButtonClasses = (variant, size) => {
  let classes = "font-medium rounded focus:outline-none ";

  if (variant === "primary") {
    classes += "bg-blue-500 text-white hover:bg-blue-600 ";
  } else if (variant === "secondary") {
    classes += "bg-gray-200 text-gray-900 hover:bg-gray-300 ";
  }
  // ... 20 more lines of if/else

  return classes;
};

// ✅ With CVA - Clean and maintainable
import { cva } from "class-variance-authority";

const buttonVariants = cva("font-medium rounded focus:outline-none transition-colors", {
  variants: {
    variant: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      destructive: "bg-red-500 text-white hover:bg-red-600",
    },
    size: {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
```

### CVA Benefits:

1. **Type Safety**: TypeScript knows all possible variants
2. **Default Values**: Sensible defaults prevent missing styles
3. **Compound Variants**: Special combinations handled cleanly
4. **Maintainability**: All styles in one place

## Pattern 2: The Slot System

### Problem: Complex Component Composition

```typescript
// ❌ Props explosion
export const Card = ({
  title,
  subtitle,
  action,
  footerText,
  footerAction,
  headerIcon,
  children
}) => (
  <div className="card">
    <div className="header">
      {headerIcon}
      <h3>{title}</h3>
      <span>{subtitle}</span>
      {action}
    </div>
    <div className="content">{children}</div>
    <div className="footer">
      {footerText}
      {footerAction}
    </div>
  </div>
)
```

### Solution: Compound Components

```typescript
// ✅ Clean composition
export const Card = ({ children, className }) => (
  <div className={cn('card', className)}>
    {children}
  </div>
)

Card.Header = ({ children, className }) => (
  <div className={cn('card-header', className)}>
    {children}
  </div>
)

Card.Title = ({ children, className }) => (
  <h3 className={cn('card-title', className)}>
    {children}
  </h3>
)

Card.Content = ({ children, className }) => (
  <div className={cn('card-content', className)}>
    {children}
  </div>
)

Card.Footer = ({ children, className }) => (
  <div className={cn('card-footer', className)}>
    {children}
  </div>
)

// Usage - Much cleaner!
<Card>
  <Card.Header>
    <Card.Title>Project Title</Card.Title>
    <Button variant="ghost">⋯</Button>
  </Card.Header>
  <Card.Content>
    Project description here...
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">View Project</Button>
  </Card.Footer>
</Card>
```

## Pattern 3: The Render Prop Pattern

### Use Case: Complex State Logic

```typescript
// ✅ Flexible data fetching component
export const ProjectLoader = ({
  projectId,
  children
}: {
  projectId: string
  children: (state: {
    project?: Project
    loading: boolean
    error?: Error
    refetch: () => void
  }) => React.ReactNode
}) => {
  const { data: project, isLoading, error, refetch } = useProject(projectId)

  return children({
    project,
    loading: isLoading,
    error,
    refetch
  })
}

// Usage - Completely customizable
<ProjectLoader projectId="123">
  {({ project, loading, error, refetch }) => {
    if (loading) return <ProjectSkeleton />
    if (error) return <ErrorCard onRetry={refetch} />
    if (!project) return <NotFound />

    return <ProjectCard project={project} />
  }}
</ProjectLoader>
```

## Pattern 4: The ForwardRef Pattern

### Why ForwardRef Matters

```typescript
// ❌ Without forwardRef - Ref doesn't work
export const Button = ({ children, ...props }) => (
  <button {...props}>{children}</button>
)

// ✅ With forwardRef - Ref works perfectly
export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ children, variant, size, className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  >
    {children}
  </button>
))

Button.displayName = 'Button' // Important for debugging!

// Now this works:
const buttonRef = useRef<HTMLButtonElement>(null)
<Button ref={buttonRef}>Click me</Button>
```

## Pattern 5: The As Prop Pattern (Polymorphic)

### Ultimate Flexibility

```typescript
// ✅ One component, infinite possibilities
export const Text = <T extends React.ElementType = 'span'>({
  as,
  variant,
  children,
  ...props
}: TextProps<T>) => {
  const Component = as || 'span'

  return (
    <Component
      className={textVariants({ variant })}
      {...props}
    >
      {children}
    </Component>
  )
}

// Usage examples:
<Text>Default span</Text>
<Text as="h1" variant="heading">Page Title</Text>
<Text as="p" variant="body">Paragraph text</Text>
<Text as={Link} to="/page" variant="link">Navigation</Text>
```

## Pattern 6: The Context Pattern for Complex State

### When Props Drilling Gets Crazy

```typescript
// ✅ Context for complex component trees
const FormContext = createContext<{
  values: Record<string, any>
  errors: Record<string, string>
  setValue: (name: string, value: any) => void
}>()

export const Form = ({ children, onSubmit }) => {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})

  const setValue = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <FormContext.Provider value={{ values, errors, setValue }}>
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

export const FormField = ({ name, label, ...props }) => {
  const { values, errors, setValue } = useContext(FormContext)

  return (
    <div>
      <label>{label}</label>
      <input
        value={values[name] || ''}
        onChange={e => setValue(name, e.target.value)}
        {...props}
      />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </div>
  )
}

// Usage - No prop drilling!
<Form onSubmit={handleSubmit}>
  <FormField name="title" label="Project Title" />
  <FormField name="description" label="Description" />
  <Button type="submit">Create Project</Button>
</Form>
```

## Pattern 7: The Hook Pattern for Logic Reuse

### Extract Logic, Reuse Everywhere

```typescript
// ✅ Custom hook for common patterns
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue
  }
}

// Usage in multiple components
export const Modal = () => {
  const modal = useToggle()

  return (
    <>
      <Button onClick={modal.setTrue}>Open Modal</Button>
      {modal.value && (
        <div onClick={modal.setFalse}>Modal content</div>
      )}
    </>
  )
}
```

## When to Use Which Pattern

### Primitive Components (80% of cases)

- Simple, single-purpose components
- Button, Badge, Avatar, Icon
- Use: CVA + ForwardRef + As prop

### Compound Components (15% of cases)

- Multi-part UI patterns
- Card, Dropdown, Tabs, Form
- Use: Context + Compound pattern

### Render Props (5% of cases)

- Complex state logic
- Data fetching, animations, complex interactions
- Use: Render prop + Custom hooks

## Red Flags: When Your Pattern is Wrong

### ❌ Too Many Props

```typescript
// More than 8-10 props = probably wrong pattern
export const Card = ({
  title, subtitle, image, action, footer, header,
  variant, size, color, shadow, border, padding,
  onClick, onHover, onFocus // 15+ props!
}) => { ... }
```

### ❌ Props Drilling

```typescript
// Passing props through 3+ levels = use context
<Parent someProp={value}>
  <Child someProp={value}>
    <GrandChild someProp={value}>
      <GreatGrandChild someProp={value} />
    </GrandChild>
  </Child>
</Parent>
```

### ❌ Boolean Props Explosion

```typescript
// ❌ Boolean flags everywhere
<Button
  isPrimary={false}
  isSecondary={true}
  isLarge={false}
  isDisabled={false}
  isLoading={true}
/>

// ✅ Use variants instead
<Button
  variant="secondary"
  size="medium"
  disabled={false}
  loading={true}
/>
```

Remember: The best pattern is the one that makes your code **predictable, reusable, and easy to change**! 🎯
