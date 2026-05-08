# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Next.js dev server (port 3000)
npm run build     # Production build
npm run lint      # ESLint via next lint
npm test          # Run all Jest tests
npm test -- --testPathPattern=<path>  # Run a single test file
npm test -- --coverage                # Run with coverage report
```

Coverage thresholds are enforced at 70% (branches, functions, lines, statements).

## Architecture

The app uses a strict **Repository Pattern** with dependency injection. The layers are:

```
React Components
    ↓ (custom hooks)
Hooks (useAuth, useAlbums, useStorage)
    ↓ (repository methods)
Repositories (Auth, Album, Image, Storage)
    ↓ (adapter interface)
Adapters (Amplify*, Mock*, LocalStorage*, etc.)
    ↓
AWS Backend (Cognito, AppSync/GraphQL, S3, CloudFront)
```

### Adapters (`src/adapters/`)

Three adapter families, each with an interface + real + mock implementation:

- **Auth** — `IAuthAdapter` / `AmplifyAuthAdapter` / `MockAuthAdapter`: user sessions, Cognito group membership
- **API** — `IApiAdapter` / `AmplifyApiAdapter` / `MockApiAdapter`: AppSync GraphQL queries/mutations and S3 operations
- **Storage** — `IStorageAdapter` / `LocalStorageAdapter` / `SessionStorageAdapter` / `MemoryStorageAdapter`: key-value persistence

`AmplifyAuthAdapter` caches user tokens for 1 minute. Public GraphQL queries use `authMode: 'apiKey'`; admin mutations use `authMode: 'userPool'`.

### Repositories (`src/repositories/`)

Business logic lives here, not in components or hooks.

- **AuthRepository**: authentication state, admin privilege check (`portfolio_admin` Cognito group)
- **AlbumRepository**: CRUD, public/private filtering, featured flag, tags
- **ImageRepository**: upload, retrieval, deletion via S3
- **StorageRepository**: namespaced JSON storage with TTL (album cache = 5 min)

### Providers & Hooks

`RepositoryProvider` (`src/providers/`) initializes all repositories by injecting concrete adapters and exposes them via React context. It automatically uses `MemoryStorageAdapter` during SSR. Tests inject mock adapters here instead of real ones.

Custom hooks (`src/hooks/`) consume the context: `useRepositories()` → specific repository → business method. Hooks own React state; repositories own data logic.

### Pages & Components

Next.js App Router at `src/app/`. Key routes: `/`, `/albums`, `/albums/[album_url]`, `/new`, `/account`, `/signin`.

Components under `src/components/` are presentation-only — they read state from hooks and call hook callbacks; they do not call repository or adapter methods directly.

## Testing

Tests live in `src/__tests__/` mirroring `adapters/`, `repositories/`, and `hooks/` subdirectories. All tests use mock adapters — no real AWS calls are made. `jest.setup.js` stubs `localStorage`, `sessionStorage`, and `matchMedia`.

When writing tests for hooks, wrap with `RepositoryProvider` and pass mock adapters via props. Use Jest fake timers when testing cache TTL or interval behavior.

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.