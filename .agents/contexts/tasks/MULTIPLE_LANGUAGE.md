# Task — Add Guest Back Button and Internationalization for Public + Guest Routes

**Task Type:** Frontend Feature Enhancement / Architecture-Aligned Refactor  
**Priority:** High  
**Source of Truth:** `OVERVIEW.md`  
**Project:** VietFood Restaurant Management System  
**Status:** Todo

---

## 1. Context

The frontend already follows a feature-first architecture.

Important architecture rules that must continue to be respected:

- route files remain in `app/`
- business logic remains in `features/`
- reusable domain pieces remain in `entities/`
- shared cross-feature infrastructure remains in `shared/`
- `page.tsx` files must stay thin
- route groups must preserve their responsibilities

The current route groups are:

- `app/(public)/*` → public-facing pages
- `app/guest/*` → guest/customer-facing pages
- `app/manage/*` → staff/admin pages
- `app/api/*` → Next.js route handlers / proxy / BFF

This task must **not** rewrite the project from scratch.

It must extend the current architecture cleanly.

---

## 2. Main Goals

Implement the following changes:

1. Add a **back icon button** in the header for pages under `/guest`
2. Add **internationalization (i18n)** support for:
   - `app/(public)/*`
   - `app/guest/*`
3. Do **not** add i18n to `app/manage/*`
4. Make dish/category text fields render dynamically according to the current language when backend values are multilingual objects such as:
   - `name: { vi: string, en: string }`
   - `description: { vi: string, en: string }`
5. Keep the implementation aligned with the feature-first architecture
6. Keep route/page files thin

---

## 3. Important Product Rules

### 3.1 Scope of i18n
Apply i18n only to:

- public-facing routes
- guest-facing routes

Do **not** apply i18n to:

- `app/manage/*`

Reason:
- the admin/staff side is Vietnamese-only for now

### 3.2 Backend multilingual field format
Some backend API values already return multilingual object fields, for example:

```ts
name: {
  vi: string;
  en: string;
}

description: {
  vi: string;
  en: string;
}
```

The frontend must use the current language to select the correct value dynamically.

Do not hardcode Vietnamese-only rendering if multilingual data already exists.

---

## 4. Architecture Requirements

### 4.1 Keep route files thin
Do not place i18n business logic directly inside `page.tsx` if it can be handled more cleanly in:

- feature hooks
- feature components
- shared i18n utilities
- shared providers

### 4.2 Keep feature ownership clear
Examples:
- menu-related multilingual rendering belongs near `features/menu`
- dish/category multilingual formatting belongs near feature/entity/shared helpers depending on reuse
- public/guest language switching infrastructure may belong in `shared/`

### 4.3 Do not pollute `shared/`
Only place code in `shared/` if it is truly cross-feature and reusable.

### 4.4 Follow the existing naming conventions
Continue following the naming conventions in `OVERVIEW.md`:
- React component files → PascalCase
- hook files → kebab-case
- API files → kebab-case with `.api.ts`
- type files → kebab-case with `.types.ts`
- directory names → kebab-case

---

## 5. Functional Requirements

## 5.1 Add back icon button for guest pages

Add a back button in the header of pages under `/guest`.

### Behavior requirements
- show a back icon/button in the guest header UI
- clicking it should navigate to the previous page when possible
- if there is no reliable browser history, provide a safe fallback route
- the button should not appear on pages where going back would create a bad UX if that applies
- keep the implementation reusable rather than duplicating the same button across many guest pages

### Recommended architectural direction
Create a reusable guest header/back component or shared route-shell component if appropriate.

Do not duplicate inline back-button logic in many guest pages.

---

## 5.2 Add i18n for public and guest routes

Implement frontend internationalization support for:

- `app/(public)/*`
- `app/guest/*`

Do not apply it to:

- `app/manage/*`

### Requirements
- support at least:
  - Vietnamese (`vi`)
  - English (`en`)
- the current language must be readable from a central source
- the UI must react correctly when language changes
- public and guest pages must render localized text
- dish/category data from the backend must resolve according to the current language

---

## 5.3 Dynamic multilingual field resolution

Where backend returns multilingual values like:

```ts
{
  name: { vi: "...", en: "..." },
  description: { vi: "...", en: "..." }
}
```

the frontend must resolve them according to the active language.

### Rules
- if the current language is `vi`, render `name.vi`, `description.vi`
- if the current language is `en`, render `name.en`, `description.en`
- if the selected language value is missing, apply a sensible fallback strategy
- do not duplicate this logic in many components

### Recommended approach
Create a shared helper or reusable utility for multilingual field selection, for example:

- `shared/lib/i18n.ts`
- or `shared/lib/resolve-locale-text.ts`

Use it across:
- menu
- categories
- dish detail
- any public/guest display where multilingual backend fields appear

---

## 6. Recommended Technical Direction

### 6.1 i18n approach
Set up a lightweight and maintainable i18n approach that works well with the current Next.js App Router architecture.

You may use a library if it fits the current codebase cleanly.

Recommended options:
- `next-intl`
- or another App Router-compatible i18n solution

Prefer a solution that:
- works well in Next.js App Router
- keeps route boundaries clean
- supports localized UI strings cleanly
- does not require rewriting the entire routing model

### 6.2 Do not localize manage routes
The manage/admin area remains Vietnamese-only.

Do not apply translation wrappers, locale switching, or localization overhead there unless explicitly requested in the future.

---

## 7. Suggested Architecture Placement

Recommended placement for this task:

```txt
src/
├── app/
│   ├── (public)/
│   ├── guest/
│   └── manage/
├── features/
│   ├── menu/
│   ├── dishes/
│   ├── categories/
│   └── ...
├── shared/
│   ├── i18n/
│   ├── providers/
│   ├── hooks/
│   ├── lib/
│   └── types/
```

Possible new modules:

- `shared/i18n/` for locale config/messages/provider integration
- `shared/hooks/use-locale.ts`
- `shared/lib/resolve-locale-text.ts`
- reusable guest header/back button component in:
  - `features/...` if feature-specific
  - or `shared/ui/` if truly reusable across guest pages

Do not introduce unnecessary folder complexity.

---

## 8. Step-by-Step Implementation Plan

### Step 1 — Audit current guest/public route layout
Inspect the current layout structure for:

- `app/(public)/*`
- `app/guest/*`

Determine the best place to introduce:
- language provider
- language switcher if needed
- shared guest header behavior
- back button UI

Do not duplicate setup in each page if a layout-level solution is cleaner.

---

### Step 2 — Add i18n foundation
Set up the i18n infrastructure for public + guest routes.

Requirements:
- define supported locales: `vi`, `en`
- add locale state/source
- expose translation access to UI components
- ensure public and guest trees can read the current locale cleanly

Do not apply this to `manage`.

---

### Step 3 — Add locale-aware text resolver for backend multilingual fields
Create a reusable resolver for multilingual object values such as:

- `name`
- `description`

Example use cases:
- category card title
- dish card name
- dish detail description
- menu sections

The resolver should:
- accept a multilingual object
- accept current locale
- return the correct string
- apply fallback when needed

Do not repeat `field?.vi ?? field?.en` logic all over the codebase.

---

### Step 4 — Refactor public and guest features to use locale-aware rendering
Update relevant features so that:
- UI strings use i18n
- backend multilingual fields use the resolver
- public and guest pages reflect the current locale consistently

Focus especially on:
- menu
- dishes
- categories
- public table pages
- guest-facing informational pages

---

### Step 5 — Add reusable guest back button
Introduce a reusable back icon button for `/guest` pages.

Requirements:
- place it in a proper route-shell or reusable component location
- keep behavior consistent across guest pages
- use router back navigation with a safe fallback
- style it consistently with the guest UI

Do not manually reimplement the same back button in many pages if a reusable abstraction is cleaner.

---

### Step 6 — Keep manage routes untouched
Do not add i18n complexity to:
- `app/manage/*`

Make sure your changes do not accidentally wrap or affect the manage route group.

---

### Step 7 — Verify dynamic backend field rendering
Test that when the locale changes:
- dish names change correctly
- category names change correctly
- descriptions change correctly
- fallback logic works if one language is missing

---

## 9. Fallback Rules for Multilingual Backend Data

Use a safe fallback strategy.

Recommended fallback order:

### If current locale is `vi`
1. `field.vi`
2. `field.en`
3. empty string or safe placeholder

### If current locale is `en`
1. `field.en`
2. `field.vi`
3. empty string or safe placeholder

Keep fallback logic centralized.

---

## 10. Acceptance Criteria

This task is complete only if:

- guest pages have a reusable back icon button in the header where appropriate
- public and guest routes support i18n
- manage routes remain Vietnamese-only and unaffected
- UI strings in public/guest routes are localizable
- backend multilingual fields such as `name` and `description` render according to the current language
- fallback logic works correctly for missing locale values
- no business logic is added unnecessarily to `page.tsx`
- architecture boundaries remain aligned with the overview
- file naming remains consistent with the overview conventions
- `pnpm lint` passes
- `pnpm type-check` passes
- `pnpm build` passes

---

## 11. Definition of Done

This task is done only when:

- i18n is correctly applied to `app/(public)` and `app/guest`
- `app/manage` remains untouched by i18n
- guest header back navigation works and is reusable
- localized backend fields render dynamically and correctly
- locale resolution logic is centralized and not duplicated everywhere
- the implementation follows the feature-first architecture
- the codebase remains maintainable and predictable

---

## 12. Commands

### Development

```bash
pnpm dev
```

### Lint

```bash
pnpm lint
```

### Type check

```bash
pnpm type-check
```

### Build

```bash
pnpm build
```

---

## 13. Skills to Apply

Use these skills selectively.

### From `next-best-practices`
Focus specifically on:

- `file-conventions.md`
- `directives.md`
- `data-patterns.md`
- `error-handling.md`
- `functions.md` (only if needed for route/layout/metadata implications)

Apply them to:
- keep route boundaries clean
- introduce i18n in the correct app/router layer
- avoid pushing logic into the wrong place
- keep route files thin

### From `vercel-react-best-practices`
Focus specifically on:

- `rerender-split-combined-hooks`
- `rerender-derived-state-no-effect`
- `rerender-no-inline-components`
- `rerender-dependencies`
- `rendering-conditional-render`
- `js-early-exit`

Apply them to:
- split locale-aware logic cleanly
- avoid bloated route-level components
- keep multilingual rendering maintainable
- implement guest back button behavior cleanly

---

## 14. Notes for Implementation

- This is an incremental architecture-aligned enhancement, not a full rewrite.
- Follow the current route structure exactly.
- Keep i18n limited to public and guest routes.
- Do not localize the manage/admin area.
- Centralize multilingual backend field resolution.
- Prefer reusable abstractions over duplicated inline locale logic.
- Keep page files thin and keep business logic inside the correct feature/shared layers.