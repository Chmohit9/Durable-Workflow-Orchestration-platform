# Progress Log

## Phase 0: Environment + Repo Scaffold

- Created monorepo folder structure: `apps/api`, `apps/worker`, `packages/sdk`, `packages/shared-types`
- Set up root `package.json` with npm workspaces (`apps/*`, `packages/*`)
- Initialized `package.json` for each of the 4 workspaces, scoped under `@orchestrator/*`
- Verified workspace symlinks in `node_modules/@orchestrator/` (api, worker, sdk, shared-types all correctly linked)
- Added `.gitignore` (node_modules, build output, env files, logs, OS/editor junk)
- Committed and pushed: `chore: scaffold monorepo workspace structure (apps/api, apps/worker, packages/sdk, packages/shared-types)`

**Concept learned:** Why a monorepo with workspaces — one shared source of truth for types (e.g. `WorkflowEvent`) instead of copy-pasted definitions across API/worker/UI that drift out of sync. Workspaces create real symlinks on disk, not published packages.

- Added `docker-compose.yml`: Postgres 16 (with named volume `postgres_data` for persistance) + Redis 7, both version-pinned
-Verified Postgres reachable via `psql` (`SELECT version()` succeeded)
-Verified Redis reachable via `redis-cli PING` (`PONG`)
- Committed and pushed: `feat: add docker-compose for local Postgres 16 + Redis 7`

**Concept learned:** Docker image (blueprints) vs. containers (running,isolated instances); why version-pinning images matters for reproduciblity; port mapping (`host:container`) to reach a sealed container from the host machine; named volumes to persist Postgres data across container restarts (deliberately skipped for Redis, since it's just a task queue, not our source of truth).


### `workflows` table migration

Installed `node-pg-migrate`, `pg`, `dotenv` in `apps/api`; created `.env` (gitignored) + `.env.example`
- Wrote and applied first migration: `workflows` table (workflow_id UUID PK w/ gen_random_uuid, tenant_id NOT NULL, type VARCHAR unconstrained, status VARCHAR w/ CHECK constraint + default 'running', current_state JSONB, created_at/updated_at)
- Verified schema directly via `psql \d workflows` — confirmed columns, types, nullability, defaults, PK index, and CHECK constraint all match design
- Committed and pushed: `feat: add workflows table migration (tenant_id, type, status, current_state snapshot)`

**Concepts learned (re-taught in depth after initial confusion, now solid):**
- Event sourcing core idea: `workflow_events` = source of truth (append-only), `current_state` = derived cache for fast reads
- Why cache-ahead-of-truth (current_state updated, event not written) is a real corruption bug — but truth-ahead-of-cache (event written, cache not yet updated) is always safely recoverable by replay. Core principle: *it's always safe to lose a cache; never safe to lose the source of truth.*
- Why append-only matters: editing old events doesn't crash anything — it silently corrupts future replays with no visible error, which is worse than a crash
- Index on `(workflow_id, timestamp)`: speeds up *locating and ordering* a workflow's events, does not let replay skip reading any events
- Row-Level Security (RLS): policies filter per-row directly at the DB level; `tenant_id` is duplicated onto every tenant-scoped table (not looked up via JOIN) so per-row security checks stay simple, fast, and hard to implement incorrectly — a deliberate denormalization trade-off for security
- Schema design judgment call: `status` is a small closed set intrinsic to the engine → CHECK constraint justified. `type` is open-ended business content that should grow without schema migrations → left unconstrained at the DB level, validated in application code instead

**What I can explain unprompted:** why current_state is a cache and not the truth; the crash-recovery asymmetry between cache and event log; why append-only protects the audit trail; why tenant_id is duplicated per table.

**What's still theoretical (not yet built/tested):** RLS policies themselves (declared conceptually, not implemented — that's Phase 4); append-only enforcement (no DB-level trigger blocking UPDATE/DELETE yet, currently just a convention); the actual replay/reconstruction logic (no code written yet — only the table exists).

**Next up:** `workflow_events` table migration — the actual append-only event log.