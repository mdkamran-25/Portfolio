# Internationalization (i18n) Implementation Guide

## Overview

This document outlines the internationalization implementation for the portfolio website using `next-intl` framework. The implementation provides a scalable foundation for supporting multiple languages while maintaining type safety and accessibility standards.

## Architecture

### Core Components

1. **Configuration (`src/config/i18n.ts`)**

   - Defines supported locales: English, Spanish, French, Arabic
   - Provides locale labels and flag emojis
   - Type-safe locale definitions

2. **Messages Structure (`messages/`)**

   - JSON files for each supported locale
   - Organized by feature namespaces (nav, hero, common, etc.)
   - Scalable namespace structure

3. **Next.js Integration**
   - Middleware configuration for locale detection
   - next-intl plugin integration in `next.config.ts`
   - Request configuration in `i18n.ts`

## Implementation Details

### Supported Locales

| Locale | Language | Flag |
| ------ | -------- | ---- |
| `en`   | English  | 🇺🇸   |
| `es`   | Español  | 🇪🇸   |
| `fr`   | Français | 🇫🇷   |
| `ar`   | العربية  | 🇸🇦   |

### Message Namespaces

- **nav**: Navigation menu items
- **hero**: Homepage hero section
- **about**: About page content
- **projects**: Projects section
- **freelance**: Freelance services
- **contact**: Contact form and information
- **footer**: Footer content
- **common**: Shared UI elements (loading, error states, etc.)
- **seo**: SEO metadata and descriptions

### Components

#### LanguageSwitcher Component

- Accessible dropdown for language selection
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Visual feedback for current selection

#### TranslationProvider

- React context for accessing translations
- Type-safe translation hooks
- Scoped translation namespaces

## Usage Examples

### Basic Translation

```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('nav');
  return <span>{t('home')}</span>;
}
```

### Scoped Translations

```typescript
import { useI18n } from '@/components/common/TranslationProvider';

function HeroSection() {
  const { hero } = useI18n();
  return (
    <div>
      <h1>{hero('title')}</h1>
      <p>{hero('description')}</p>
    </div>
  );
}
```

### Language Switching

```typescript
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

function Header() {
  return (
    <header>
      <nav>
        {/* Navigation items */}
      </nav>
      <LanguageSwitcher />
    </header>
  );
}
```

## File Structure

```
├── i18n.ts                          # Next-intl configuration
├── middleware.ts                     # Locale detection middleware
├── messages/                         # Translation files
│   ├── en.json                      # English translations
│   ├── es.json                      # Spanish translations
│   ├── fr.json                      # French translations
│   └── ar.json                      # Arabic translations
├── src/
│   ├── config/
│   │   └── i18n.ts                  # Locale configuration
│   └── components/
│       └── common/
│           ├── LanguageSwitcher.tsx  # Language selection component
│           └── TranslationProvider.tsx # Translation context
```

## Configuration

### next.config.ts

```typescript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
```

### middleware.ts

```typescript
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./src/config/i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
```

## Accessibility Features

- **ARIA Labels**: All interactive elements have proper ARIA attributes
- **Keyboard Navigation**: Full keyboard support for language switcher
- **Screen Reader Support**: Proper announcements for locale changes
- **RTL Support**: Ready for right-to-left languages (Arabic)

## Testing Strategy

- Unit tests for translation components
- Integration tests for locale switching
- Accessibility testing with screen readers
- Visual regression testing for RTL layouts

## Future Enhancements

1. **Dynamic Imports**: Lazy load translation files
2. **Pluralization**: Add support for complex plural rules
3. **Date/Number Formatting**: Locale-specific formatting
4. **Currency Support**: Multi-currency pricing display
5. **URL Localization**: Localized route paths

## Performance Considerations

- Translation files are statically imported
- Middleware handles locale detection efficiently
- Client-side locale switching without page reloads
- Optimized bundle splitting per locale

## Best Practices

1. **Namespace Organization**: Group related translations logically
2. **Key Naming**: Use descriptive, hierarchical keys
3. **Fallback Strategy**: Always provide English fallbacks
4. **Context Preservation**: Include context in translation keys
5. **Testing Coverage**: Test all locale combinations

## Maintenance

- Regular translation audits
- Community translation contributions
- Automated translation quality checks
- Performance monitoring for i18n overhead

---

This implementation provides a solid foundation for internationalization while maintaining the portfolio's performance and accessibility standards.
