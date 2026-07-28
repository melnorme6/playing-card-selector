# Security policy

## Supported versions

Only the current GitHub Pages deployment and the latest published release are supported.

## Reporting a vulnerability

Do not publish vulnerability details in an issue, discussion, or pull request. Use
[GitHub private vulnerability reporting](https://github.com/melnorme6/playing-card-selector/security/advisories/new)
to contact the maintainer privately.

## Security model

This is a static client-side application with no backend and no external dependencies. Imported JSON
is parsed locally, limited to 1 MiB, and validated against the known card identifiers before being
stored. The application contains no analytics, trackers, external scripts, or runtime network
requests. Its Content Security Policy blocks application scripts from opening network connections,
and its referrer policy prevents the application URL from being sent when following external links.
