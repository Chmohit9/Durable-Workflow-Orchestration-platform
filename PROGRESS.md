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

### Day 1 (continued) 
- Added `docker-compose.yml`: Postgres 16 (with named volume `postgres_data` for persistance) + Redis 7, both version-pinned
-Verified Postgres reachable via `psql` (`SELECT version()` succeeded)
-Verified Redis reachable via `redis-cli PING` (`PONG`)
- Committed and pushed: `feat: add docker-compose for local Postgres 16 + Redis 7`

**Concept learned:** Docker image (blueprints) vs. containers (running,isolated instances); why version-pinning images matters for reproduciblity; port mapping (`host:container`) to reach a sealed container from the host machine; named volumes to persist Postgres data across container restarts (deliberately skipped for Redis, since it's just a task queue, not our source of truth).

**Next up:** Write the first database migration - the `workflows`, `workflow_events`, `activities`, `timers` tables.
