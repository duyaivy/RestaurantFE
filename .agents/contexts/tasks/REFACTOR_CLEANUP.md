# Task — Thin Pages and Clean Route Ownership After Feature-First Refactor

**Task Type:** Architecture Cleanup / Post-Refactor Hardening  
**Priority:** High  
**Source of Truth:** `OVERVIEW.md`, `REFACTOR_FOLDER.md`  
**Related Scope:** Frontend Foundation / Feature-First Architecture  
**Status:** Todo

---

## 1. Task Goal

Refine the codebase after the initial feature-first folder migration so that the architecture is not only visually reorganized, but also **functionally correct**.

This task focuses on:

- making `app/` route files truly thin
- moving route-owned business UI out of `app/` when appropriate
- cleaning feature ownership
- reducing architectural leftovers from the original technical-type grouping
- aligning the actual implementation with the intent of `OVERVIEW.md`

---

## 2. Why This Task Exists

The initial refactor successfully introduced:

- `features/`
- `entities/`
- `shared/`

and preserved the route model:

- `app/manage/*`
- `app/guest/*`
- `app/api/*` 

However, the current codebase still shows signs that the refactor is only partially complete:

- some route folders inside `app/` still contain many components, utils, constants, and types
- some `page.tsx` files may still be too heavy
- some old ownership patterns were moved instead of truly refactored
- some `context/` files were relocated into features, but not necessarily redesigned
- some route folders still behave like mini-features inside `app/`

This means the codebase has completed the **folder migration phase**, but not yet the **ownership cleanup phase**.

---

## 3. Task Objective

By the end of this task:

- `app/` should mostly contain route shells, layouts, and composition logic
- feature-owned business logic should live in `features/`
- reusable domain building blocks should live in `entities/`
- generic cross-feature code should live in `shared/`
- route folders should stop acting as hidden feature modules
- `page.tsx` files should be thin and focused

---

## 4. In Scope

This task includes:

- auditing all route folders under `app/guest/*` and `app/manage/*`
- thinning `page.tsx` files
- moving route-scoped business UI out of `app/` where appropriate
- moving local `types.ts`, `constants.ts`, and `utils.ts` out of route folders if they belong to features/shared/entities
- reviewing feature contexts and deciding whether they should remain as Context or become hooks/store
- clarifying ownership boundaries after the initial migration

---

## 5. Out of Scope

This task does **not** include:

- introducing new product features
- redesigning screens
- changing route URLs
- rewriting backend APIs
- large behavior changes unrelated to architecture cleanup
- deleting valid route-shell components that truly belong in `app/`

---

## 6. Problem Statement

The current state suggests that the project now has the **new folders**, but not all code has been fully **re-owned**.

Examples of likely issues:

- `app/guest/menu/*` still contains local components and page orchestration
- `app/guest/order-confirmation/*` still contains route-level `components/`, `constants.ts`, `types.ts`, and `utils.ts`
- `app/manage/tables/*` still contains multiple route-local components that may actually belong to `features/tables`
- some files were moved into `features/*/context`, but may still be better represented as Zustand store or feature hook

This task exists to fix those structural leftovers.

---

## 7. Target Outcome

After this task, the architecture should behave like this:

### `app/`
Owns only:

- `page.tsx`
- `layout.tsx`
- route wrappers
- route composition
- route params reading
- route guards
- very small route-local shell components only when truly necessary

### `features/`
Owns:

- business UI
- feature hooks
- mutations/query logic
- feature state
- feature schemas
- feature services
- feature-level helper logic
- feature constants/types when feature-specific

### `entities/`
Owns:

- domain-oriented reusable UI
- entity types
- entity helpers

### `shared/`
Owns:

- truly generic utilities
- common hooks
- config
- app-wide providers
- global UI primitives
- generic validators
- shared types

---

## 8. Main Refactor Rules

### Rule 1 — `page.tsx` must stay thin

A `page.tsx` file should mainly do these things:

- read params
- read search params
- import feature entry components
- compose screen sections
- pass route-level props only

A `page.tsx` file should **not** do these things unless absolutely necessary:

- define large business mapping logic
- contain multiple inline helper functions
- define feature-specific constants
- contain local schema definitions
- hold long UI sections that belong to feature components
- call many APIs directly

---

### Rule 2 — Route folder does not equal feature folder

Just because a page lives in:

- `app/guest/menu`
- `app/guest/order-confirmation`
- `app/manage/tables`

does **not** mean all related logic should stay in that route folder.

If the code represents feature behavior rather than route shell behavior, it should move to `features/`.

---

### Rule 3 — Route-local files must justify their existence

A file may stay inside `app/...` only if it is truly route-local and mostly shell/composition related.

Examples that may stay in `app/...`:

- route-only navigation shell
- tiny page-specific wrapper
- very small layout composition helper

Examples that usually should **not** stay in `app/...`:

- `types.ts`
- `constants.ts`
- `utils.ts`
- business sections
- reusable feature components
- query/mutation hooks
- feature state

---

### Rule 4 — Do not preserve old patterns blindly

Moving an old `Context`, `types.ts`, or helper into a new folder is **not enough** if the ownership is still wrong.

The goal is not only to move files.  
The goal is to make the new boundaries actually correct.

---

## 9. Required Deliverables

### 9.1 Audit all route folders

Review all route folders under:

- `src/app/guest/*`
- `src/app/manage/*`

For each folder, identify:

- which files are true route-shell files
- which files are actually feature files
- which files belong in `entities/`
- which files belong in `shared/`

Document or apply the moves clearly.

---

### 9.2 Thin all heavy `page.tsx` files

For each heavy page:

- extract large UI blocks into feature components
- extract business logic into feature hooks/services
- remove feature constants/types/utils from route folders
- keep the page focused on composition

---

### 9.3 Clean route folders that still act like mini-features

Focus especially on folders like:

- `app/guest/menu`
- `app/guest/order-confirmation`
- `app/manage/tables`

These folders should be reviewed first because they are likely to contain business UI and local helper files that belong elsewhere.

---

### 9.4 Normalize feature ownership

Review each feature folder and verify that it truly owns its use case.

Expected examples:

- `features/menu/*` owns menu business UI and logic
- `features/orders/*` owns order-related sections and logic
- `features/tables/*` owns table management UI and logic
- `features/auth/*` owns auth flow/state/components

---

### 9.5 Review all feature contexts

Audit current feature contexts such as:

- `features/auth/context/UserContext.tsx`
- `features/cart/context/CartContext.tsx`
- any order-related context

For each one, decide whether it should remain:

- Context
- Zustand store
- React Query + derived hook
- shared provider

If provider scoping is not truly needed, prefer hook/store over Context. This follows the architecture direction in `OVERVIEW.md`. :contentReference[oaicite:1]{index=1}

---

### 9.6 Clean route-local helper files

Move route-level helper files out of `app/...` when they are not truly route-shell concerns.

Examples:

- `constants.ts`
- `types.ts`
- `utils.ts`

Possible destinations:

- `features/<feature>/types`
- `features/<feature>/constants`
- `features/<feature>/lib`
- `entities/<entity>/types`
- `shared/types`
- `shared/lib`

---

## 10. Route Audit Checklist

For every route page, check the following:

### A. Page size
- Is `page.tsx` too large?
- Is it doing too much work?

### B. Business logic
- Does it contain business mapping or transformation logic?
- Does it build feature-specific state inline?

### C. UI ownership
- Are there multiple sections inside route folder that really belong to a feature?
- Are those sections reusable within the same feature?

### D. Local support files
- Does the route folder contain `types.ts`, `constants.ts`, or `utils.ts`?
- If yes, do those files belong to a feature or shared layer instead?

### E. Data fetching
- Does the page call query/mutation logic directly instead of consuming feature hooks/components?

### F. Context usage
- Does the route depend on Context that should actually be store/hook based?

If a route folder fails multiple points above, it needs cleanup.

---

## 11. Suggested Execution Plan

### Step 1 — Audit `app/guest/order-confirmation`
Review and move:

- route `components/`
- `constants.ts`
- `types.ts`
- `utils.ts`

Likely destinations:
- `features/orders/components`
- `features/orders/types`
- `features/orders/lib`
- `features/orders/constants`

Refactor `page.tsx` so it becomes a composition entry only.

---

### Step 2 — Audit `app/guest/menu`
Review and move:

- `components/`
- `Menupage.tsx`
- any menu-specific helper logic

Likely destinations:
- `features/menu/components`
- `features/menu/hooks`
- `features/menu/types`

Make `page.tsx` mostly delegate to a feature entry component.

---

### Step 3 — Audit `app/manage/tables`
Review and move:

- `add-table.tsx`
- `edit-table.tsx`
- `table-table.tsx`

If these are business UI and not route-shell-only files, move them to:

- `features/tables/components`

Keep `page.tsx` thin.

---

### Step 4 — Review `auth`, `cart`, and `orders` contexts
For each context, decide whether it should remain Context or be refactored to:

- feature store
- feature hook
- shared provider

Do not keep Context by default just because it existed before.

---

### Step 5 — Clean `shared/`
Check everything inside `shared/` and ask:

- is this truly generic?
- or was it moved here because ownership was unclear?

If it belongs to one feature only, move it back to that feature.

---

### Step 6 — Re-check all pages
After cleanup, verify that route pages are mostly composition only.

---

## 12. Acceptance Criteria

This task is complete only if:

- `app/` no longer behaves like a hidden feature layer
- heavy `page.tsx` files are thinned down
- route folders no longer contain unnecessary business `types.ts`, `constants.ts`, `utils.ts`
- major business UI has been moved into `features/`
- `features/*/context` is reviewed and only kept when justified
- route-local shell files that truly belong in `app/` remain there
- `shared/` contains only truly shared modules
- the application still behaves the same after cleanup
- imports are updated correctly
- `pnpm lint` passes
- `pnpm type-check` passes
- `pnpm build` passes

---

## 13. Definition of Done

This task is done only when:

- the codebase is not only folder-migrated, but also ownership-correct
- `app/` is mostly route shell and composition
- feature boundaries are clearer than before
- route-level clutter is reduced
- page complexity is lower
- context usage is intentional, not inherited accidentally
- business logic is closer to the feature that owns it
- shared code is truly shared
- the project remains stable and understandable

---

## 14. Commands

```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm build  
```

---

## 15. Notes for Implementation

- This is phase 2 of the refactor, not a brand-new migration.
- The goal now is quality of ownership, not just folder movement.
- Prefer moving code based on business ownership rather than based on where it was originally imported from.
- If a route folder contains too many supporting files, it probably still owns too much.
- If a page is hard to read, it is probably not thin enough.
- If a module is only used by one feature, it probably should not be in shared/.
- If a context exists only because it existed before, it should be re-evaluated.

---

## 16. Expected Result

After this task, the project should feel structurally cleaner in practice, not just in appearance:

- route folders stay small
- pages are easier to read
- features truly own their business logic
- shared code becomes more trustworthy
- future development becomes faster and safer