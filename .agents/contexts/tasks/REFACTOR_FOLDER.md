# Task — Refactor Codebase Structure to Feature-First Architecture

**Task Type:** Architecture Refactor  
**Priority:** High  
**Source of Truth:** `OVERVIEW.md`  
**Related Scope:** Frontend Foundation / Layer 1  
**Status:** Todo

---

## 1. Task Goal

Refactor the current frontend codebase structure to follow the agreed **feature-first architecture** defined in `OVERVIEW.md`, while keeping the existing route model unchanged.

The route model must remain:

- `app/manage/*`
- `app/guest/*`
- `app/api/*`

This task focuses on **reorganizing internal code ownership**, not rewriting the routing system.

---

## 2. Why This Task Exists

The current project structure is still too heavily grouped by technical type rather than business ownership.

Examples of current pain points:

- feature logic is spread across `components`, `hooks`, `context`, `stores`, `types`, `schemaValidations`, and `apiRequests`
- global folders are becoming dumping grounds
- ownership is unclear
- route boundaries exist, but business boundaries are weak

This refactor is needed to make the codebase:

- easier to scale
- easier to maintain
- easier to onboard new developers into
- safer to extend without duplicating logic

---

## 3. Task Objective

By the end of this task, the codebase must be prepared to follow this architecture:

- `app/` → routing, layouts, page composition
- `features/` → business use cases and feature-owned code
- `entities/` → reusable domain building blocks
- `shared/` → generic cross-feature infrastructure

This task should establish the **foundation and migration path**, not necessarily migrate 100% of all existing files in one commit.

---

## 4. In Scope

This task includes:

- creating the new architecture skeleton
- defining clear ownership boundaries
- moving or refactoring foundation-level modules first
- preparing old folders for gradual migration
- updating imports for migrated files
- ensuring the app still runs after refactor

---

## 5. Out of Scope

This task does **not** include:

- rewriting all routes
- redesigning UI
- implementing new product features
- changing backend API contracts
- fully deleting all old folders immediately
- large business logic rewrites unrelated to structure

---

## 6. Target Architecture

The target structure follows the overview:

```txt
src/
├── app/
├── features/
├── entities/
├── shared/
├── legacy/
└── middleware.ts
```

### Intended ownership

#### `app/`

Owns:

- page routes
- route layouts
- route grouping
- route-level composition
- guards and wrappers

#### `features/`

Owns:

- feature-specific API calls
- React Query hooks
- feature components
- local feature store
- schemas
- services
- socket listeners per feature

#### `entities/`

Owns:

- reusable domain types
- domain-specific display helpers
- UI primitives per entity

#### `shared/`

Owns:

- axios client
- generic hooks
- config
- common utilities
- app-wide providers
- shared validators
- global UI primitives
- common types

---

## 7. Required Deliverables

### 7.1 Create new top-level folders

Create these folders if they do not exist:

- `src/features`
- `src/entities`
- `src/shared`

Optional transitional folder:

- `src/legacy`

---

### 7.2 Migrate foundation modules first

Move/refactor these categories first:

#### Shared infrastructure

- axios setup → `shared/api`
- endpoints/proxy helpers → `shared/api`
- env/config → `shared/config`
- generic utils → `shared/lib`
- generic hooks → `shared/hooks`
- app-wide providers → `shared/providers`
- common validators → `shared/validators`
- common types → `shared/types`

#### Feature-owned logic

Move feature logic out of global folders into feature folders such as:

- `features/auth`
- `features/menu`
- `features/cart`
- `features/checkout`
- `features/orders`
- `features/tables`
- `features/dashboard`
- `features/accounts`
- `features/messages`
- `features/settings`

---

### 7.3 Define ownership for existing folders

Current folders must be reviewed and mapped as follows:

#### `src/apiRequests`

Split into feature APIs and shared API infrastructure.

#### `src/app/components`

Move into:

- feature components
- entity UI
- or `shared/ui`

#### `src/app/context`

Refactor:

- app-wide providers → `shared/providers`
- feature-specific context → feature store/hooks if more appropriate

#### `src/app/hooks`

Split into:

- `shared/hooks`
- `features/*/hooks`

#### `src/app/stores`

Split into:

- `shared/stores`
- `features/*/store`

#### `src/schemaValidations`

Split into:

- `shared/validators`
- `features/*/schemas`

#### `src/types`

Split into:

- `shared/types`
- `entities/*/types`
- `features/*/types`

#### `src/lib`

Keep only generic utilities.

---

## 8. Migration Rules

The refactor must follow these rules:

- keep `app/manage`, `app/guest`, and `app/api`
- do not perform a destructive rewrite
- migrate incrementally
- preserve application behavior
- avoid mixing business logic into route files
- avoid leaving duplicate logic in both old and new folders
- use import updates as files move
- keep commits logically grouped if possible

---

## 9. Suggested Execution Plan

### Step 1 — Create the new structure

Create:

- `features/`
- `entities/`
- `shared/`

### Step 2 — Move app-wide infrastructure

Refactor first:

- providers
- axios client
- config/env
- shared utilities
- shared hooks

### Step 3 — Migrate by feature

Recommended order:

- auth
- menu
- cart
- checkout
- orders
- tables
- dashboard
- accounts
- messages
- settings

### Step 4 — Clean imports

- update import aliases
- remove dead imports
- verify path consistency

### Step 5 — Stabilize legacy folders

- keep old folders only if still needed temporarily
- mark them as transitional
- avoid placing new code there

### Step 6 — Final cleanup

- remove duplicated code
- delete unused files
- ensure lint/build/type-check pass

---

## 10. Acceptance Criteria

This task is complete only if:

- `features/`, `entities/`, and `shared/` are created and used
- new code is no longer added to dumping-ground folders
- at least the foundation modules are migrated
- route files remain thin
- no new business logic is placed directly inside `page.tsx`
- shared infrastructure has clear ownership
- feature-level code has clear ownership
- imports are updated successfully
- the application still runs correctly
- `pnpm lint` passes
- `pnpm type-check` passes
- `pnpm build` passes

---

## 11. Definition of Done for This Task

- The codebase structure reflects the agreed feature-first direction.
- The project keeps the current route model intact.
- Shared infrastructure is centralized properly.
- Feature logic starts living inside feature folders.
- No critical runtime behavior is broken.
- No new architectural debt is introduced during migration.
- Naming is clear and consistent.
- Dead code and duplicate code are reduced.
- README is updated if setup or folder conventions changed.

---

## 12. Notes for Implementation

- This is a structural refactor, not a product feature task.
- Prefer small, safe migrations over one huge refactor commit.
- When unsure where a file belongs, decide using this order:
  1. route-level?
  2. feature-level?
  3. entity-level?
  4. shared-level?
- If a file does not clearly belong to `shared/`, it probably should not go there.
- If a file is only used by one business domain, move it into that feature.

---

## 13. Expected Result

After this task, the project should be in a much healthier state:

- route structure stays familiar
- business logic becomes feature-owned
- shared infrastructure becomes predictable
- future refactors and feature development become safer and faster
