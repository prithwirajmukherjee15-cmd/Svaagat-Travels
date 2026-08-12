# Contributing to Svaagat Travels

First off, thank you for taking the time to contribute! 🎉 This guide explains how to
propose changes so we can keep the codebase clean and consistent.

## Getting started

1. **Fork** the repository and clone your fork.
2. Follow the **[Quick Start](./README.md#-quick-start-local)** to run the backend and
   frontend locally.
3. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development guidelines

- **Backend (FastAPI):** keep all routes prefixed with `/api`, use Pydantic models for
  responses, and prefer async handlers. Identifiers are UUID strings; datetimes are
  timezone-aware (UTC).
- **Frontend (React):** reuse the shadcn/ui primitives in `src/components/ui/`, keep
  components small and composable, and use the design tokens (Tailwind theme) rather than
  hard-coded colors. Follow the guidelines in [`docs/DESIGN.md`](./docs/DESIGN.md).
- **State:** use the Zustand store in `src/lib/store.js` for shared/session state.
- **API calls:** go through the shared Axios client in `src/api/client.js`.

## Commit messages

Use clear, conventional commit prefixes:

| Prefix | Use for |
|--------|---------|
| `feat:` | a new feature |
| `fix:` | a bug fix |
| `docs:` | documentation only |
| `refactor:` | code change that neither fixes a bug nor adds a feature |
| `style:` | formatting, no code-logic change |
| `chore:` | tooling, deps, housekeeping |

Example: `feat(hotels): add room-tier comparison table`

## Pull requests

1. Ensure the app builds and runs locally.
2. Update documentation in `/docs` or the README if your change affects usage.
3. Keep PRs focused and reasonably small.
4. Open the PR against `main` with a clear description of **what** and **why**.

## Reporting bugs / requesting features

Please open a GitHub Issue with:
- A clear title and description
- Steps to reproduce (for bugs) and expected vs actual behavior
- Screenshots or console errors where helpful

Thanks again for helping make Svaagat Travels better! 🙏
