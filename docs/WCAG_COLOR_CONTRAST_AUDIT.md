# WCAG 2.1 AA Color Contrast Audit Report

**Generated:** 2025-09-12T12:11:06.798Z

## Summary

- **Total combinations tested:** 16
- **✅ Passing (AA compliant):** 12
- **⚠️ Warning (large text only):** 1
- **❌ Failing (non-compliant):** 3

**Overall compliance rate:** 75%

## WCAG 2.1 AA Standards

- **Normal text:** Minimum contrast ratio of 4.5:1
- **Large text (18pt+/14pt bold+):** Minimum contrast ratio of 3:1

## ❌ Failing Combinations (Require Fixes)

### Orange-500 text on neutral-800/50
- **Context:** Action buttons
- **Colors:** #f97316 on rgba(38, 38, 38, 0.5)
- **Normal text ratio:** 0:1 (FAIL)
- **Large text ratio:** 0:1 (FAIL)
- **Required:** 4.5:1 for normal text, 3:1 for large text

### White text on orange-500
- **Context:** Primary buttons
- **Colors:** #ffffff on #f97316
- **Normal text ratio:** 2.8:1 (FAIL)
- **Large text ratio:** 2.8:1 (FAIL)
- **Required:** 4.5:1 for normal text, 3:1 for large text

### Neutral-600 on neutral-900
- **Context:** Empty stars
- **Colors:** #525252 on #171717
- **Normal text ratio:** 2.29:1 (FAIL)
- **Large text ratio:** 2.29:1 (FAIL)
- **Required:** 4.5:1 for normal text, 3:1 for large text

## ⚠️ Warning Combinations (Large Text Only)

### Orange-600 text on white
- **Context:** Payment dialog
- **Colors:** #ea580c on #ffffff
- **Normal text ratio:** 3.56:1 (FAIL)
- **Large text ratio:** 3.56:1 (AA)
- **Recommendation:** Use only for large text (18pt+ or 14pt bold+)

## ✅ Passing Combinations (WCAG AA Compliant)

### White text on black background
- **Context:** Main headings
- **Colors:** #ffffff on #000000
- **Normal text ratio:** 21:1 (AAA)
- **Large text ratio:** 21:1 (AAA)

### White text on neutral-900
- **Context:** Content cards
- **Colors:** #ffffff on #171717
- **Normal text ratio:** 17.93:1 (AAA)
- **Large text ratio:** 17.93:1 (AAA)

### Neutral-300 text on neutral-900
- **Context:** Body text
- **Colors:** #d4d4d4 on #171717
- **Normal text ratio:** 12.09:1 (AAA)
- **Large text ratio:** 12.09:1 (AAA)

### Neutral-400 text on neutral-900
- **Context:** Secondary text
- **Colors:** #a3a3a3 on #171717
- **Normal text ratio:** 7.11:1 (AAA)
- **Large text ratio:** 7.11:1 (AAA)

### White text on neutral-800
- **Context:** Secondary buttons
- **Colors:** #ffffff on #262626
- **Normal text ratio:** 15.13:1 (AAA)
- **Large text ratio:** 15.13:1 (AAA)

### Blue-600 text on white
- **Context:** Links
- **Colors:** #2563eb on #ffffff
- **Normal text ratio:** 5.17:1 (AA)
- **Large text ratio:** 5.17:1 (AAA)

### White text on blue-600
- **Context:** Primary actions
- **Colors:** #ffffff on #2563eb
- **Normal text ratio:** 5.17:1 (AA)
- **Large text ratio:** 5.17:1 (AAA)

### Red-600 text on white
- **Context:** Error messages
- **Colors:** #dc2626 on #ffffff
- **Normal text ratio:** 4.83:1 (AA)
- **Large text ratio:** 4.83:1 (AAA)

### Yellow-400 on neutral-900
- **Context:** Rating stars
- **Colors:** #facc15 on #171717
- **Normal text ratio:** 11.71:1 (AAA)
- **Large text ratio:** 11.71:1 (AAA)

### Gray-600 text on white
- **Context:** Form labels
- **Colors:** #4b5563 on #ffffff
- **Normal text ratio:** 7.56:1 (AAA)
- **Large text ratio:** 7.56:1 (AAA)

### Gray-500 text on white
- **Context:** Helper text
- **Colors:** #6b7280 on #ffffff
- **Normal text ratio:** 4.83:1 (AA)
- **Large text ratio:** 4.83:1 (AAA)

### Black text on white
- **Context:** Form inputs
- **Colors:** #000000 on #ffffff
- **Normal text ratio:** 21:1 (AAA)
- **Large text ratio:** 21:1 (AAA)

## Recommendations

### Immediate Actions Required

1. **Review failing combinations** and consider:
   - Darkening light colors or lightening dark colors
   - Using alternative color combinations from the passing list
   - Adding background colors or borders to improve contrast

### Best Practices

1. **For warning combinations:** Ensure they're only used for large text
2. **Consider alternative colors** for better accessibility
3. **Test with actual users** who have visual impairments

### General Recommendations

1. **Use high contrast mode testing** to verify readability
2. **Test with screen readers** to ensure compatibility
3. **Consider color blindness** - don't rely solely on color for information
4. **Provide focus indicators** with sufficient contrast
5. **Regular audits** as the design system evolves

