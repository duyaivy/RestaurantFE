# Task — Refine Public Route Group, Thin Views, Normalize Naming, and Clean Empty Generated Folders

**Task Type:** Architecture Cleanup / Post-Refactor Refinement  
**Priority:** High  
**Source of Truth:** `OVERVIEW.md`  
**Related Scope:** Feature-First Architecture Hardening  
**Status:** Todo

---

## 1. Context

The project already completed the initial folder migration toward a feature-first architecture.

The current codebase already has:

- `features/`
- `entities/`
- `shared/`

and keeps the route groups:

- `app/(public)`
- `app/guest`
- `app/manage`
- `app/api`

Do **not** rewrite the architecture from scratch.

This task is a **refinement pass** on top of the existing refactor.

---

## 2. Main Problems to Solve

### 2.1 Public route group was not fully included in the previous cleanup
The route group `app/(public)` still exists and must also follow the same feature-first architecture rules as the rest of the app.

It should remain as the current route group name for now.

Do not rename it unless explicitly required later.

---

### 2.2 Some `page.tsx` files are now acceptable, but the extracted `*View` files are still too large
In many places, `page.tsx` is no longer the main problem.

However, the intermediate screen files such as:

- `MenuPage.tsx`
- `SomePageView.tsx`
- route-level composed view files
- large screen-level presentation files

are still too large and do too much.

These files should be reviewed and, where appropriate, split into smaller **section components** with clearer ownership.

---

### 2.3 File naming is inconsistent
There is inconsistent naming across the codebase, for example:

- PascalCase in some files
- kebab-case in others
- ad-hoc mixed styles
- inconsistent component and helper naming

The codebase needs a naming normalization pass.

---

### 2.4 Some empty generated folders were created incorrectly
The refactor created unnecessary empty folders such as:

- `{schemas}`
- other malformed generated directories
- empty feature subfolders with no ownership value

These should be removed.

---

## 3. Task Goal

Refine the existing refactor so that:

- `app/(public)` also follows the architecture rules
- large `*View` / screen-level files are broken into smaller sections when appropriate
- file naming becomes consistent across the codebase
- malformed or empty generated folders are removed
- the architecture becomes cleaner without changing route behavior

---

## 4. In Scope

This task includes:

- auditing `app/(public)` and its related feature ownership
- reviewing large screen-level files called from `page.tsx`
- splitting large view files into section components where appropriate
- normalizing naming conventions
- cleaning empty, malformed, or useless generated folders
- updating imports after file/folder renames
- preserving runtime behavior

---

## 5. Out of Scope

This task does **not** include:

- rewriting the project from scratch
- changing route URLs
- redesigning the UI
- changing backend contracts
- renaming `app/(public)` unless explicitly requested later
- introducing new features

---

## 6. Requirements

### 6.1 `app/(public)` must follow feature-first rules too

The route group `app/(public)` must be audited the same way as `app/guest` and `app/manage`.

Rules:

- keep route files thin
- keep route-level composition in `app/`
- move business UI and business logic into `features/`
- move generic reusable logic into `shared/`
- move reusable domain pieces into `entities/`

If `app/(public)` currently contains route-local business UI, review whether it should move into a feature module.

---

### 6.2 Review all large `*View` files and split them when appropriate

Many pages may now delegate to files such as:

- `MenuPage.tsx`
- `OrderConfirmationView.tsx`
- `DashboardView.tsx`
- similar screen-level files

These files must be reviewed.

If a screen-level file is too large, too hard to read, or mixes too many concerns, split it into smaller section components such as:

- `header-section.tsx`
- `summary-section.tsx`
- `list-section.tsx`
- `filters-section.tsx`
- `actions-section.tsx`
- `details-section.tsx`

Use section components only when they improve ownership and readability.

Do **not** split blindly into meaningless pieces.

---

### 6.3 Naming convention must be normalized

Apply the following naming rules consistently unless there is a strong existing convention that must remain:

#### Components
Use **PascalCase** for React component file names.

Examples:

- `MenuPage.tsx`
- `OrderSummaryCard.tsx`
- `GuestLoginForm.tsx`

#### Hooks
Use **kebab-case** file names with `use-` prefix or the project’s chosen hook convention consistently.

Examples:

- `use-menu.ts`
- `use-cart.ts`
- `use-order-details.ts`

#### Utilities / helpers
Use **kebab-case**.

Examples:

- `format-currency.ts`
- `build-order-summary.ts`

#### Stores
Use one consistent convention.

Recommended:

- `use-cart-store.ts`
- `use-auth-store.ts`

#### Schemas
Use one consistent convention.

Recommended:

- `auth.schema.ts`
- `order.schema.ts`

#### Types
Use one consistent convention.

Recommended:

- `order.types.ts`
- `menu.types.ts`

Do not leave mixed styles without reason.

---

### 6.4 Clean malformed and empty folders

Remove useless folders such as:

- `{schemas}`
- malformed generated folders with curly braces
- empty directories created by the refactor with no purpose
- empty feature subfolders that are not used

Only keep folders that have a clear ownership purpose.

---

## 7. Required Deliverables

### 7.1 Public route group cleanup

Review:

- `app/(public)`
- nested auth pages
- public tables routes
- public route layout files
- route-level helpers

Make sure public route files are aligned with feature-first rules.

---

### 7.2 View-layer cleanup

Audit all large view/screen-level files that are imported by `page.tsx`.

For each large view file:

- determine whether it is still too large
- determine whether it mixes data logic, business logic, and presentation too heavily
- split it into meaningful section components if that improves readability and ownership

---

### 7.3 Naming normalization

Review the codebase and normalize file naming for:

- components
- hooks
- stores
- schemas
- types
- utilities

Update imports accordingly.

---

### 7.4 Empty-folder cleanup

Delete:

- empty malformed folders
- empty generated folders with no usage
- refactor leftovers that no longer add value

---

## 8. Refactor Rules

### Rule 1 — Do not rewrite from zero
This is an incremental cleanup task on top of the current codebase.

### Rule 2 — Preserve behavior
Route behavior and app behavior must remain unchanged.

### Rule 3 — Split views only when it improves architecture
Do not split files mechanically. Split only when it improves:
- readability
- ownership
- maintainability
- feature separation

### Rule 4 — Naming must be intentional
Do not keep inconsistent naming if it can be normalized safely.

### Rule 5 — Remove garbage folders
Malformed or empty folders must not remain in the final structure.

---

## 9. Suggested Execution Plan

### Step 1 — Audit `app/(public)`
Review all files under `app/(public)` and check whether any route folder still owns business UI or logic that belongs in `features/`.

---

### Step 2 — Audit all `*Page.tsx` / `*View.tsx` screen files
Review any file that acts as an intermediate screen layer between `page.tsx` and smaller UI components.

Focus on files that are:
- too long
- difficult to scan
- mixing layout, orchestration, and presentation

---

### Step 3 — Split large views into meaningful sections
Where appropriate, extract sections such as:
- header
- filters
- list body
- summary
- actions
- details
- footer

Keep the screen file as an orchestration layer if needed, but reduce its size and responsibilities.

---

### Step 4 — Normalize naming
Rename files to follow the chosen naming conventions.

Then update all imports safely.

---

### Step 5 — Remove malformed and empty folders
Delete:
- `{schemas}`
- any empty generated folder
- any dead folder that has no files and no architectural purpose

---

### Step 6 — Run verification
After all cleanup:

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`

Make sure all pass.

---

## 10. Acceptance Criteria

This task is complete only if:

- `app/(public)` is aligned with the same architecture rules as other route groups
- large screen/view files are split where appropriate
- no major `*View` file remains unnecessarily bloated
- naming conventions are consistent across the cleaned areas
- malformed empty folders such as `{schemas}` are removed
- imports are updated correctly after renames/moves
- app behavior remains unchanged
- `pnpm lint` passes
- `pnpm type-check` passes
- `pnpm build` passes

---

## 11. Definition of Done

This task is done only when:

- the public route group is no longer excluded from the architectural cleanup
- large view files are easier to read and maintain
- section-level splitting is meaningful, not artificial
- naming is more consistent than before
- empty malformed directories are gone
- the codebase looks cleaner both structurally and practically
- no unnecessary rewrite was performed

---

## 12. Commands


```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm build
```
## 13. Notes for Implementation
- This is a refinement task, not a full architecture restart.
- The goal is to improve ownership quality, readability, and consistency.
- Keep app/(public) as the current route group for now.
- Prefer meaningful section extraction over arbitrary micro-components.
- If a screen file is hard to scan, it probably needs section-level decomposition.
- If a file name style conflicts with the chosen convention, normalize it.
- If a folder is empty or malformed, remove it.
## 14. Expected Result

After this task, the project should feel much more polished:

- the public route group also follows the architecture rules
- large view files become easier to read and maintain
- screen structure becomes more modular
- file naming becomes more predictable
- malformed empty folders are gone
- the refactor feels complete rather than partial
