# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [3.0.5] - 2026-11-28

### Changed

- The `react` and `react-dom` peer range is `>=19` (was `>=19.3.0`), so apps on React 19.0 to
  19.2 install without a peer warning.
- Requires `@entrolytics/shared` 3.2.2.
- `@trpc/client` and `@trpc/react-query` 11.32.2.

## [3.0.4] - 2026-11-28

### Changed

- Depends on `@entrolytics/trpc-client` 4.0.0, whose router types describe the API after sign-in
  moved from Clerk to the dashboard itself. Nothing changes at run time.

## [3.0.3] - 2026-11-26

### Changed

- Depends on tRPC 11.31.4.
- Built and released with pnpm 12.24.0.

## [3.0.2] - 2026-11-26

### Fixed

- The default `host` is `https://api.entrolytics.dev`, the production API. Apps that set `host`
  explicitly are unaffected.
- Form tracking maps HTML input types onto the field types the API accepts.
- Declarations are emitted with tsc again, so the published types are complete.

### Changed

- Consumes `@entrolytics/shared` 3.2.1 and `@entrolytics/trpc-client` 3.1.1.
- Dependencies updated to their latest releases (tRPC 11.31, TanStack Query 5.108); the
  toolchain moved to tsdown, the oxc tools and pnpm 12.23.

[Unreleased]: https://github.com/entrolytics/react-sdk/compare/v3.0.5...HEAD
[3.0.5]: https://github.com/entrolytics/react-sdk/compare/v3.0.4...v3.0.5
[3.0.4]: https://github.com/entrolytics/react-sdk/compare/v3.0.3...v3.0.4
[3.0.3]: https://github.com/entrolytics/react-sdk/compare/v3.0.2...v3.0.3
[3.0.2]: https://github.com/entrolytics/react-sdk/releases/tag/v3.0.2
