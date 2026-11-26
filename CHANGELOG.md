# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed

- The default `host` is `https://api.entrolytics.dev`, the production API. Apps that set `host`
  explicitly are unaffected.
- Form tracking maps HTML input types onto the field types the API accepts.
- Declarations are emitted with tsc again, so the published types are complete.

### Changed

- Consumes `@entrolytics/shared` 3.2.1 and `@entrolytics/trpc-client` 3.1.1.
- Dependencies updated to their latest releases (tRPC 11.31, TanStack Query 5.108); the
  toolchain moved to tsdown, the oxc tools and pnpm 12.23.
