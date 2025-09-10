# 🤖 AI AGENT STRICT GUIDE - ENTERPRISE PORTFOLIO CODEBASE

> **CRITICAL**: This guide MUST be read and followed by ANY AI agent working on this codebase. No exceptions.

## 📋 MANDATORY CHECKLIST - COMPLETE EVERY QUERY

Before considering ANY task complete, the AI agent MUST verify ALL of these items:

### ✅ **1. DOCUMENTATION UPDATE REQUIREMENTS**

- [ ] Updated relevant files in `/docs/` folder if architecture changed
- [ ] Updated `/learning/` files if patterns were used or modified
- [ ] Added or updated component documentation in Storybook
- [ ] Updated `ROADMAP.md` if new phase items were completed
- [ ] Updated `PHASE_X_COMPLETE.md` files when phases finish

### ✅ **2. CODE QUALITY GATES**

- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] All ESLint errors resolved (`npm run lint`)
- [ ] All tests passing (`npm run test`)
- [ ] Code coverage above 80% for new components
- [ ] Prettier formatting applied (`npm run format`)

### ✅ **3. ARCHITECTURE COMPLIANCE**

- [ ] Follows layered architecture (design-system → shared → features)
- [ ] No upward imports (features importing from design-system ❌)
- [ ] Uses design tokens for all styling
- [ ] Components use CVA for variants when applicable
- [ ] Proper TypeScript types with no `any` usage

### ✅ **4. TESTING REQUIREMENTS**

- [ ] Unit tests for all new components (minimum 80% coverage)
- [ ] Integration tests for complex features
- [ ] Storybook stories for all UI components
- [ ] Tests follow testing strategy in `/learning/implementation/testing-strategy.md`

### ✅ **5. COMPONENT STANDARDS**

- [ ] Uses `React.forwardRef` for all interactive components
- [ ] Proper `displayName` set for debugging
- [ ] Exports types alongside components
- [ ] Uses compound component pattern when appropriate
- [ ] Accessibility attributes included (aria-\*, role, etc.)

---

## 🎯 ARCHITECTURAL RULES - NEVER VIOLATE

### **Layer Dependency Rules (CRITICAL)**

```
✅ ALLOWED IMPORTS:
Features       → Shared, Design-System
Shared         → Design-System
Design-System  → (only external libraries)

❌ FORBIDDEN IMPORTS:
Design-System  → Shared or Features
Shared         → Features
```

### **File Organization Rules**

```
src/
├── design-system/          # Pure UI components, tokens
│   ├── primitives/         # Button, Badge, Card, etc.
│   ├── tokens/             # Colors, spacing, typography
│   └── foundations/        # Base styles, utilities
├── features/               # Business logic boundaries
│   ├── projects/           # Project-related components
│   ├── payments/           # Payment-related components
│   └── profile/            # User profile components
├── shared/                 # Cross-feature utilities
│   ├── hooks/              # Reusable hooks
│   ├── components/         # Generic components
│   └── types/              # Shared TypeScript types
└── lib/                    # Utilities, configurations
```

### **Naming Conventions (STRICT)**

```typescript
// ✅ Component files
ComponentName.tsx           # Main component
ComponentName.test.tsx      # Tests
ComponentName.stories.tsx   # Storybook
index.ts                    # Barrel export

// ✅ Hook files
useHookName.ts              # Custom hooks
useHookName.test.ts         # Hook tests

// ✅ Type files
types.ts                    # TypeScript definitions
constants.ts                # Component constants
```

---

## 📚 DOCUMENTATION MAINTENANCE RULES

### **When to Update `/docs/` Files**

#### **ARCHITECTURE.md** - Update if:

- New layer added to the system
- Dependency rules change
- Major architectural decisions made
- New patterns introduced

#### **ROADMAP.md** - Update if:

- Phase completed
- New phase added
- Timeline changes
- Dependencies between phases change

#### **CODING_STANDARDS.md** - Update if:

- New ESLint rules added
- TypeScript configuration changes
- Code formatting rules change
- New quality gates introduced

#### **DESIGN_SYSTEM.md** - Update if:

- New primitives added
- Token system changes
- Component patterns change
- Styling approach modified

#### **TESTING.md** - Update if:

- New testing tools added
- Testing patterns change
- Coverage requirements change
- Test organization changes

### **When to Update `/learning/` Files**

#### **Update Required When:**

- Implementing patterns described in learning files
- Finding better ways to implement existing patterns
- Discovering anti-patterns to avoid
- Adding real-world examples from this codebase

#### **Learning File Maintenance:**

```typescript
// ✅ When adding a new component, update relevant learning file
// Example: Adding Button component

// 1. Update learning/patterns/component-design.md
// Add real example from your codebase:

// Real Implementation from Our Codebase:
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
)

// 2. Update learning/implementation/testing-strategy.md
// Add real test example:

// Our Button Test Strategy:
describe('Button', () => {
  it('applies correct variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-500')
  })
})
```

---

## 🚀 TASK COMPLETION WORKFLOW

### **For Every Single Query, Follow This Exact Sequence:**

#### **PHASE 1: ANALYSIS** (2 minutes)

1. Read the user request completely
2. Identify which layers of architecture are affected
3. Determine which documentation files need updates
4. Check if existing patterns can be reused
5. Plan the implementation approach

#### **PHASE 2: IMPLEMENTATION** (Main work)

1. **Write Code Following Standards**

   - Use existing patterns from `/learning/` files
   - Follow architecture rules strictly
   - Implement with TypeScript strict mode
   - Add proper error handling

2. **Write Tests First (TDD)**

   - Unit tests for logic
   - Integration tests for user flows
   - Storybook stories for UI components

3. **Update Documentation in Real-Time**
   - Update relevant `/docs/` files as you code
   - Add examples to `/learning/` files
   - Update Storybook documentation

#### **PHASE 3: QUALITY ASSURANCE** (5 minutes)

1. **Run All Quality Checks**

   ```bash
   npm run type-check    # TypeScript
   npm run lint         # ESLint
   npm run test         # All tests
   npm run build        # Build check
   ```

2. **Verify Documentation**
   - All affected docs files updated
   - Learning files have new examples
   - Storybook builds successfully

#### **PHASE 4: COMPLETION VERIFICATION** (2 minutes)

1. **Check Against Mandatory Checklist** (top of this file)
2. **Verify No Architectural Rules Violated**
3. **Confirm All Tests Pass**
4. **Validate Documentation Completeness**

---

## ⚠️ CRITICAL ERROR PREVENTION

### **Common Mistakes to Avoid**

#### **❌ NEVER DO THESE:**

```typescript
// ❌ Violating layer dependencies
// In design-system/primitives/Button.tsx
import { useUser } from '@/features/auth/hooks' // FORBIDDEN!

// ❌ Using any type
const handleClick = (data: any) => { } // FORBIDDEN!

// ❌ Not using design tokens
const styles = { color: '#3B82F6' } // FORBIDDEN! Use tokens.color.primary[500]

// ❌ Creating components without tests
export const NewComponent = () => <div>Hello</div>
// Missing: NewComponent.test.tsx

// ❌ Not updating documentation
// Adding new component but not updating DESIGN_SYSTEM.md

// ❌ Inconsistent naming
export const project_card = () => {} // Should be ProjectCard
```

#### **✅ ALWAYS DO THESE:**

```typescript
// ✅ Proper layer dependencies
// In features/projects/components/ProjectCard.tsx
import { Button } from '@/design-system/primitives/Button'
import { useToggle } from '@/shared/hooks/useToggle'

// ✅ Strict TypeScript
interface ProjectCardProps {
  project: Project
  onFavorite: (id: string) => void
}

// ✅ Using design tokens
const styles = {
  backgroundColor: tokens.color.primary[500],
  padding: tokens.spacing.md
}

// ✅ Complete component implementation
export const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, onFavorite }, ref) => {
    return (
      <Card ref={ref}>
        <Button
          variant="ghost"
          onClick={() => onFavorite(project.id)}
        >
          ❤️
        </Button>
      </Card>
    )
  }
)

ProjectCard.displayName = 'ProjectCard'
```

---

## 📖 QUICK REFERENCE COMMANDS

### **Quality Check Commands** (Run Before Completing Any Task)

```bash
# TypeScript check
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm run test
npm run test:coverage
npm run test:watch

# Storybook
npm run storybook

# Build verification
npm run build
```

### **File Generation Templates**

#### **New Component Template:**

```typescript
// src/design-system/primitives/ComponentName/ComponentName.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const componentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-classes'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default'
}

export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ variant, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ComponentName.displayName = 'ComponentName'
```

#### **Test Template:**

```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders with default props', () => {
    render(<ComponentName>Test content</ComponentName>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies correct variant styles', () => {
    render(<ComponentName variant="default">Test</ComponentName>)
    expect(screen.getByText('Test')).toHaveClass('default-classes')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<ComponentName ref={ref}>Test</ComponentName>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
```

#### **Storybook Template:**

```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'Design System/Primitives/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: 'Description of the component'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default component'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <ComponentName variant="default">Default variant</ComponentName>
    </div>
  )
}
```

---

## 🎯 SUCCESS CRITERIA

### **A Task is Complete When:**

1. **✅ All Code Requirements Met**

   - Functionality works as requested
   - All tests pass
   - TypeScript compiles without errors
   - ESLint passes without warnings

2. **✅ All Documentation Updated**

   - Relevant `/docs/` files updated
   - Learning files contain new examples
   - Storybook documentation complete

3. **✅ Architecture Compliance Verified**

   - No layer violations
   - Proper file organization
   - Consistent naming conventions

4. **✅ Quality Gates Passed**
   - Code coverage above thresholds
   - Build succeeds
   - All automated checks pass

### **User Should Never Need to:**

- Ask for documentation updates
- Request test writing
- Remind about architecture rules
- Ask for type safety improvements
- Request error handling
- Ask for accessibility improvements

---

## 💡 FINAL REMINDER

**This codebase represents enterprise-grade architecture that could scale to thousands of developers. Every decision should reflect billion-dollar company standards. When in doubt, refer to the `/learning/` folder for proven patterns and anti-patterns to avoid.**

**The goal is autonomous AI development that maintains the highest quality standards without constant human oversight.**

---

_Last Updated: September 2025_
_Version: 1.0_
_Status: Mandatory for all AI agents_
