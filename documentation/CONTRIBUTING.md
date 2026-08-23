# Contributing to Password Generator

Thank you for considering contributing! This document outlines the process for submitting improvements.

## Code Standards

- **Language:** Vanilla JavaScript (ES5-compatible). No TypeScript, no ES modules, no transpilation.
- **Dependencies:** None. Do not introduce npm packages, CDN links, or external libraries.
- **Global scope:** The app uses global `var` declarations. Do not introduce `let`, `const`, or block-scoped variables — the codebase must work in older browsers without a build step.
- **Security:** All random values must use `crypto.getRandomValues()`. Never use `Math.random()`.
- **i18n:** All user-facing strings must use the `t()` function with translation keys. Add translations to both `I18N.da` and `I18N.en`.
- **CSS:** Use CSS custom properties from `:root`. Do not hardcode color values. Follow the existing dark theme palette.
- **HTML:** Valid HTML5. No frameworks. Semantic elements where appropriate.
- **Accessibility:** All interactive elements must be keyboard-navigable.

## Adding a New Password Type

1. Add the type definition to `TYPES` in `types.js` following the existing schema.
2. Add translations (name, popup, settings labels/options) to both `I18N.da` and `I18N.en` in `i18n.js`.
3. Add the type ID to the appropriate category in `CATEGORIES`.
4. If the type supports QR codes, add `supportsQR: true` and a `getQRData()` method.
5. The `generate()` method must accept a settings object and return `string[]`.

## Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Test your changes in a browser — open `index.html` directly and verify all types still generate correctly.
3. Ensure the UI is responsive (test at different viewport widths).
4. Update documentation if you change behavior or add features.
5. Submit a pull request with a clear description of changes and motivation.

## Testing Checklist

Before submitting, verify:
- [ ] All 18 password types generate values without JavaScript errors
- [ ] Copy button works for all types
- [ ] History shows and restores previous settings
- [ ] Toggle switches render and function correctly
- [ ] Docker/.env-safe mode excludes `$'"\`!&#*?=:`
- [ ] UUID v4 generates valid RFC 4122 format
- [ ] OTP Base32 output contains only A-Z and 2-7
- [ ] Language switching works (Dansk ↔ English)
- [ ] Favorites persist across page reloads
- [ ] Bulk generation produces the correct count
- [ ] Export (.txt, .csv) produces valid files
- [ ] QR code renders for OTP type (SVG)
- [ ] Responsive layout at 768px breakpoint
- [ ] Ctrl+Enter / Cmd+Enter triggers generation

## Questions?

Open an issue on GitHub with the `question` label.