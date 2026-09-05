# Progress Log

## Phase 0: Environment + Repo Scaffold

### Day 1
- Created monorepo folder structure: `apps/api`, `apps/worker`, `packages/sdk`, `packages/shared-types`
- Set up root `package.json` with npm workspaces (`apps/*`, `packages/*`)
- Initialized `package.json` for each of the 4 workspaces, scoped under `@orchestrator/*`
- Verified workspace symlinks in `node_modules/@orchestrator/` (api, worker, sdk, shared-types all correctly linked)
- Added `.gitignore` (node_modules, build output, env files, logs, OS/editor junk)
- Committed and pushed: `chore: scaffold monorepo workspace structure (apps/api, apps/worker, packages/sdk, packages/shared-types)`

**Concept learned:** Why a monorepo with workspaces — one shared source of truth for types (e.g. `WorkflowEvent`) instead of copy-pasted definitions across API/worker/UI that drift out of sync. Workspaces create real symlinks on disk, not published packages.

**Next up:** Docker Compose for local Postgres + Redis.