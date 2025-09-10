# Tailwind CSS Class Analysis - Phase 0

**Generated:** 2025-09-10T21:47:20.917Z

## Summary
- **Total Unique Classes:** 317
- **Files Analyzed:** 39

## Most Common Classes
| Class | Count | Files |
|-------|-------|-------|
| `flex` | 94 | 21 |
| `mb-4` | 88 | 15 |
| `text-white` | 79 | 19 |
| `font-semibold` | 79 | 17 |
| `text-sm` | 62 | 10 |
| `text-neutral-400` | 54 | 7 |
| `font-medium` | 51 | 7 |
| `mb-2` | 47 | 6 |
| `hover:text-orange-500` | 43 | 5 |
| `gap-2` | 40 | 14 |
| `items-center` | 38 | 15 |
| `block` | 37 | 3 |
| `transition-colors` | 37 | 15 |
| `mb-8` | 37 | 11 |
| `text-xl` | 35 | 11 |
| `text-xs` | 33 | 10 |
| `px-4` | 29 | 20 |
| `text-2xl` | 28 | 6 |
| `flex-col` | 27 | 11 |
| `w-full` | 26 | 15 |

## Optimization Opportunities

### Color System (High Impact)
Frequently used colors that should become design tokens

**Recommendation:** Extract to semantic color tokens

| Class | Usage Count |
|-------|-------------|
| `text-white` | 79 |
| `text-sm` | 62 |
| `text-neutral-400` | 54 |
| `hover:text-orange-500` | 43 |
| `text-xl` | 35 |

### Spacing System (Medium Impact)
Repeated spacing patterns

**Recommendation:** Standardize spacing scale

| Class | Usage Count |
|-------|-------------|
| `gap-2` | 40 |
| `gap-4` | 24 |
| `p-6` | 17 |
| `p-4` | 13 |
| `p-3` | 9 |

### Component Patterns (High Impact)
Class combinations that appear multiple times

**Recommendation:** Extract to reusable components

