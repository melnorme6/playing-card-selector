# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and the project follows Semantic Versioning.

## [1.0.0] - 2026-07-28

### Added

- Initial public project structure.
- Playing-card selection for 52 standard cards and two jokers.
- Grouping, sorting, filtering, localization, themes, persistence, and JSON import/export.
- Responsive and keyboard-accessible controls.
- GitHub Pages deployment workflow.
- Migration support for the original prototype localStorage keys and exported card identifiers.
- Local SVG icons with their respective license notices.
- Icon-only controls with accessible labels and tooltips.
- A responsive value-grouped deck grid, per-group selection counts, and session-preserved collapsed groups.
- A responsive language menu with emoji flags and translations for English, Italian, Brazilian
  Portuguese, Latin American Spanish, German, French, Russian, Turkish, Simplified Chinese,
  Traditional Chinese, Japanese, and Korean.

### Changed

- Refined the collection tracker interface with compact controls, selected-card indicators, and an
  improved responsive layout.
- Limited imported JSON files to 1 MiB and made browser storage failures non-fatal.
- Versioned exported configurations now include selected cards, language, and theme. Legacy
  card-only exports remain importable.
- Improved responsive card grids, keyboard focus handling, localized accessible names, initial
  theme application, and persistence error reporting.
- Added accessible card-size controls using local Tabler zoom icons, reduced the default card size,
  and balanced the visual proportion between card values and suit symbols.
- Integrated the joker group into the regular value-layout grid instead of spanning the full deck.
- Aligned the public documentation with the generic Playing Card Selector product identity.
- Added dependency-free automated tests and made GitHub Pages deployment depend on them.

### Security

- Pinned third-party GitHub Actions to verified commit SHAs.
- Added a restrictive Content Security Policy that prevents application scripts from opening
  network connections.
- Added a no-referrer policy for external navigation.
- Documented hosting metadata, local persistence, and the exact contents of exported backups.
