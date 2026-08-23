# Password Generator

> Cryptographically secure password, token, and secret generator. Single-file HTML app with zero dependencies, powered by vanilla JavaScript and `crypto.getRandomValues()`.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Password Types](#password-types)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)
- [AI & Developer Documentation](#ai--developer-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

**No installation. No build step. No npm. No server.** Just open the file in your browser.

1. Download or clone this repository:
   ```bash
   git clone https://github.com/Mureren94/Password-Generator.git
   ```
2. Open `password-generator/index.html` in any modern browser.
3. Select a password type from the sidebar, configure your settings, and click **Generate**.

> Alternatively, host it on **GitHub Pages** for an always-available online version.

---

## Features

- **18 password & secret types** across 4 categories — from simple PIN codes to JWT secrets and UUIDs.
- **Dark theme UI** — same styling as GitHub's design system. Responsive for desktop and mobile.
- **Cryptographically secure** — all values use `crypto.getRandomValues()`, never `Math.random()`.
- **Copy-to-clipboard** — one click to copy any generated value.
- **Favorites** — star frequently used types for quick access.
- **History** — last 5 generations are saved; click to restore settings and regenerate.
- **Bulk generation** — generate up to 100 values at once.
- **Export** — download generated values as `.txt` or `.csv`.
- **QR code** — OTP/TOTP secrets render as QR codes with SVG/PNG/PDF download.
- **i18n** — built-in Danish and English. Import/export custom language files.
- **Docker/.env-safe mode** — avoids characters that break in `.env` files and Docker Compose (`$'"\`!&#*?=:`).
- **Custom wordlist upload** — upload your own dictionary for passphrase generation.
- **Keyboard shortcut** — `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac) to generate.
- **Zero dependencies** — everything is vanilla HTML, CSS, and JavaScript in a single HTML file plus supporting scripts.

---

## Password Types

### User-facing Passwords

| Type | Description | Key Settings |
|---|---|---|
| **Alphanumeric** | Random characters (a-z, A-Z, 0-9, special chars) | Length (8–128), special chars toggle, Docker/.env-safe |
| **Passphrase / Diceware** | Random dictionary words for memorable master passwords | Word count (3–12), separator, wordlist (Danish/English/Custom) |
| **PIN Code** | Numeric only | Length (4–8) |
| **Pronounceable** | Phonetic syllables that can be spoken aloud | Syllable count (3–8) |
| **OTP / TOTP** | Base32 secret key for authenticator apps | 16/32 characters, QR code output |

### Cryptographic Noise & Hashes

| Type | Description | Key Settings |
|---|---|---|
| **Salt** | Random value added before hashing | Length (16/32/64 bytes), format (Hex/Base64) |
| **Pepper** | Secret system value added during hashing | Length (32/64/128 bytes), format (Hex/Base64) |
| **Nonce / IV** | One-time value for encryption | Length (12/16 bytes), format (Hex/Base64) |
| **Encryption Key** | 256-bit AES key for symmetric encryption | Format (Hex/Base64) |

### API & System Secrets

| Type | Description | Key Settings |
|---|---|---|
| **API Key/Secret** | Key for API access with optional prefix | Prefix (e.g. `sk_live_`), length (32/48/64), format (alphanumeric/hex) |
| **Bearer/Session Token** | URL-safe authentication token | Length (32/64/128), format (Hex/Base64URL) |
| **JWT HMAC Secret** | Secret for signing JSON Web Tokens | Size (256/512 bit), format (Hex/Base64) |
| **OAuth Client Secret** | High-entropy client secret | Length (32/48/64), alphanumeric |
| **Webhook Secret** | HMAC signing key for webhook verification | Length (32/64), format (Hex/Base64) |

### Identifiers & Tokens

| Type | Description | Key Settings |
|---|---|---|
| **UUID v4** | RFC 4122 universally unique identifier | Format (standard/without dashes/uppercase) |
| **Magic Link / Reset Token** | Time-limited token for passwordless login | Length (32/64/128), format (Hex/Base64URL) |
| **Recovery / Backup Codes** | Printable backup codes for account recovery | Count (5–20), format (with/without dashes) |

---

## Architecture

```
password-generator/
├── index.html          # HTML structure + embedded CSS (dark theme)
├── app.js              # State management, UI rendering, event handling
├── types.js            # 18 password type definitions, categories, generators
├── wordlists.js        # ~1000 Danish words + ~1000 English words (Diceware)
├── i18n.js             # Internationalization (da/en) + custom language loader
└── qr.js               # Standalone QR code generator (SVG/PNG/PDF output)
```

**Data flow:**
1. User selects a type in the sidebar → `app.js` reads type definition from `types.js`
2. Settings panel renders dynamically from the type's settings definition
3. User configures settings and clicks "Generate" → type's `generate()` function runs
4. `crypto.getRandomValues()` fills typed arrays with cryptographically secure random bytes
5. Results are displayed with copy buttons, download options, and optional QR code
6. History is stored in `localStorage` (last 5 entries) and rendered at the top of the page

**Design principles:**
- Pure functions for generation — deterministic output given the same RNG state
- No global state mutations outside of `state` object in `app.js`
- All DOM manipulation happens in render functions; no inline event handlers in HTML
- CSS uses CSS custom properties (variables) for theming; single source of truth for colors

---

## Troubleshooting

### The page is blank or doesn't load
- Make sure you're opening `index.html` and all `.js` files are in the same directory.
- Open browser DevTools (F12) and check the Console tab for errors.
- The app requires a modern browser (Chrome, Firefox, Edge, Safari — released 2020 or later).

### Copy button doesn't work
- Clipboard API requires a secure context (HTTPS or `localhost`). When opened via `file://`, the app falls back to `document.execCommand('copy')`.
- Some browsers block clipboard access on `file://` protocol. Host on a local server or GitHub Pages for full clipboard support.

### QR code doesn't render
- QR codes only appear for OTP/TOTP type. Other types won't show QR codes.
- If the QR code is blank, check browser console for SVG rendering errors.

### Custom wordlist upload doesn't work
- Uploaded file must be a `.txt` file with one word per line (newline-separated).
- Empty lines are automatically filtered out.
- The wordlist is stored in memory only; refreshing the page resets it.

### Generated password doesn't appear in history
- History is limited to the last 5 entries. Older entries are automatically pruned.
- History is stored in `localStorage`; clearing browser data will clear it.

---

## AI & Developer Documentation

This repository includes structured documentation optimized for AI coding assistants (Cursor, Copilot, Claude Code, etc.):

- **[llms.txt](llms.txt)** — concise reference with file structure, architecture, and key conventions. Point AI assistants to this file to get context quickly.
- **[llms-full.txt](llms-full.txt)** — complete documentation corpus including all source code. Load this for deep understanding of the entire codebase.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code standards and pull request process.

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
