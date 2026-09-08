# Usage guide foundation

`guide.css` and `guide.js` are shared by every application usage guide.
Each application keeps only its theme tokens in its own CSS file.

## Add a new application guide

1. Copy an existing guide HTML file and replace its application content.
2. Load `../assets/guide/guide.css` before the application CSS.
3. Add `data-guide-id` and `data-guide-share-text` to `<body>`.
4. Load `../assets/guide/guide.js` at the end of `<body>`.
5. Define every `--guide-*` theme token for the default, light, and dark modes.

```html
<link rel="stylesheet" href="../assets/guide/guide.css">
<link rel="stylesheet" href="NewApp.css">

<body data-guide-id="new-app" data-guide-share-text="NewApp 使い方ガイド">
  <!-- guide content -->
  <script src="../assets/guide/guide.js"></script>
</body>
```

Application-only UI may be added to its CSS, but shared guide components should
be added to `guide.css`. Use semantic `--guide-*` tokens instead of literal app
colors in shared rules.

## Theme token contract

- `--guide-bg`
- `--guide-surface`, `--guide-surface-2`, `--guide-surface-3`
- `--guide-border`, `--guide-border-soft`
- `--guide-text`, `--guide-text-muted`, `--guide-text-faint`
- `--guide-accent`, `--guide-accent-soft`, `--guide-accent-ink`
- `--guide-warning`, `--guide-warning-soft`
- `--guide-danger`, `--guide-danger-soft`
- `--guide-success`, `--guide-success-soft`
- `--guide-shadow`
- `--guide-radius-s`, `--guide-radius-m`
- `--guide-font-sans`, `--guide-font-mono`
- `--guide-sidebar-width`

The shared script expects the existing guide element IDs and classes, including
`themeToggle`, `themeLabel`, `shareBtn`, `shareMenu`, `shareTwitter`, `shareCopy`,
`sidebar`, `scrim`, `navToggle`, `progress`, and `.nav-link`.
