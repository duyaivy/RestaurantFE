# Layer 1 — Frontend Foundation (Feature-First Architecture)

**Project:** VietFood Restaurant Management System  
**Type:** Frontend Architecture Specification  
**Scope:** Feature-First Architecture — applied across the entire codebase  
**Status:** Refactor complete — the entire codebase follows Feature-First Architecture

---

## 1. CONTEXT & ROLE

You are a **Senior Frontend Developer (10+ yoe)**.  
You follow:

- Clean Code
- SOLID
- DRY
- Separation of Concerns
- Feature-first thinking
- Scalable App Router structure
- Predictable data flow

We are building **VietFood**, a restaurant management frontend using:

- React 19
- Next.js 16
- Zustand
- Axios
- Socket.IO
- TanStack React Query
- shadcn/ui
- Zod

The system has 4 major route groups:

- `app/(public)/*` → for **public-facing pages** accessible without authentication (login, landing, public table view)
- `app/manage/*` → for **staff/admin**
- `app/guest/*` → for **all users**, including unauthenticated and authenticated guest users
- `app/api/*` → for **Next.js route handlers / proxy / BFF endpoints**

This document defines the **feature-first architecture** that the entire frontend codebase now follows.

---

## 2. ARCHITECTURE OVERVIEW

The entire codebase has been successfully refactored to **Feature-First Architecture**.

There is no longer a distinction between old and new structure. All code now strictly follows the layered architecture principles:

- route files live in `app/`
- business logic lives in `features/`
- reusable domain objects live in `entities/`
- generic shared utilities live in `shared/`

---

## 3. TARGET ARCHITECTURE PRINCIPLE

We keep the route structure:

- `app/(public)`
- `app/manage`
- `app/guest`
- `app/api`

But below the route layer, code is organized by **feature/domain ownership**.

This means:

- route files remain in `app/`
- business logic moves into `features/`
- reusable domain objects move into `entities/`
- generic shared utilities move into `shared/`

This is a **hybrid architecture**:

- **route-first at the App Router level**
- **feature-first at the business logic level**

---

## 4. HIGH-LEVEL ARCHITECTURE

### 4.1 App Layer

Responsible for:

- route entrypoints
- layout composition
- route grouping
- page assembly
- route-level guards
- wiring providers

This includes:

- `app/(public)/*`
- `app/manage/*`
- `app/guest/*`
- `app/api/*`

---

### 4.2 Feature Layer

Responsible for:

- feature-specific API clients
- React Query hooks
- feature UI
- business orchestration logic
- feature socket listeners
- feature form schema
- feature local store when necessary

Examples:

- auth
- cart
- checkout
- dishes
- menu
- orders
- tables
- dashboard
- accounts
- messages
- settings

---

### 4.3 Entity Layer

Responsible for:

- reusable domain types
- entity UI primitives
- entity helpers
- display adapters

Examples:

- user
- dish
- table
- order
- cart-item
- account
- message

---

### 4.4 Shared Layer

Responsible for:

- generic reusable code
- axios instance
- route constants
- common utilities
- app config
- common validators
- shared hooks
- common UI wrappers
- socket bootstrap
- auth/session helpers

---

## 5. ROUTE STRATEGY

### 5.1 `app/(public)/*`

This route group is for **public-facing pages** that do not require authentication.

Typical pages:

- login / register
- landing page
- public table QR entry

Rules:

- route files should stay thin
- page file only assembles UI and calls feature modules
- business UI and logic must move into the appropriate feature module (e.g. `features/auth`)
- must follow the same feature-first rules as `app/manage` and `app/guest` — no exceptions

---

### 5.2 `app/manage/*`

This route group is for **staff/admin side**.

Typical pages:

- dashboard
- tables
- dishes
- accounts
- messages
- settings

Rules:

- route files should stay thin
- page file only assembles UI and calls feature modules
- avoid putting direct axios or socket logic here
- layout here can enforce role-based access

---

### 5.3 `app/guest/*`

This route group is for **public/guest experience**.

This includes:

- unauthenticated visitors
- authenticated customers
- cart
- checkout
- menu browsing
- dish detail
- order confirmation

Rules:

- pages should stay presentation-oriented
- business behavior should belong to feature modules like:
  - `features/menu`
  - `features/cart`
  - `features/checkout`
  - `features/orders`

---

### 5.4 `app/api/*`

This route group is for **Next.js API route handlers**.

Use cases:

- proxy to backend
- hide sensitive endpoints
- normalize response formats
- BFF logic when frontend needs composition
- secure cookie/session-based flows if needed later

Rules:

- do not place frontend business logic in route handlers
- route handlers should stay focused on request/response orchestration
- shared service logic should live outside route files

---

## 6. PROJECT STRUCTURE

```txt
src/
├── app/
│   ├── (public)/
│   ├── api/
│   │   ├── auth/
│   │   ├── dishes/
│   │   ├── guest/
│   │   └── ...
│   ├── guest/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── menu/
│   │   │   ├── [id]/
│   │   │   ├── components/
│   │   │   ├── Menupage.tsx
│   │   │   └── page.tsx
│   │   ├── order-confirmation/
│   │   └── ...
│   ├── manage/
│   │   ├── accounts/
│   │   ├── dashboard/
│   │   ├── dishes/
│   │   ├── messages/
│   │   ├── setting/
│   │   ├── tables/
│   │   ├── layout.tsx
│   │   ├── dropdown-avatar.tsx
│   │   ├── menuItems.ts
│   │   ├── mobile-nav-links.tsx
│   │   └── nav-links.tsx
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── store/
│   │   ├── services/
│   │   ├── components/
│   │   └── types/
│   │
│   ├── menu/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── types/
│   │
│   ├── cart/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── checkout/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── orders/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── socket/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── store/
│   │   └── types/
│   │
│   ├── dishes/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── tables/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── socket/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── dashboard/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── types/
│   │
│   ├── accounts/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── types/
│   │
│   ├── messages/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── socket/
│   │   └── types/
│   │
│   └── settings/
│       ├── api/
│       ├── hooks/
│       ├── components/
│       ├── schemas/
│       └── types/
│
├── entities/
│   ├── user/
│   │   ├── types/
│   │   ├── model/
│   │   └── ui/
│   ├── dish/
│   │   ├── types/
│   │   ├── model/
│   │   └── ui/
│   ├── order/
│   ├── table/
│   ├── cart-item/
│   ├── message/
│   └── account/
│
├── shared/
│   ├── api/
│   │   ├── axios.ts
│   │   ├── endpoints.ts
│   │   ├── response.ts
│   │   └── proxy.ts
│   ├── config/
│   │   ├── env.ts
│   │   ├── app.ts
│   │   └── routes.ts
│   ├── constants/
│   ├── hooks/
│   │   ├── use-debounce.ts
│   │   ├── use-mounted.ts
│   │   └── ...
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── format.ts
│   │   ├── query-client.ts
│   │   └── query-keys.ts
│   ├── providers/
│   │   ├── app-provider.tsx
│   │   ├── socket-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── query-provider.tsx
│   ├── sockets/
│   │   └── socket-client.ts
│   ├── stores/
│   │   └── app.store.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── common.ts
│   │   └── pagination.ts
│   ├── ui/
│   ├── validators/
│   └── auth/
│       ├── session.ts
│       ├── permissions.ts
│       └── guards.ts
│
└── middleware.ts
```

## 7. ARCHITECTURE LAYER RULES

### 7.1 `features/` — Feature Layer

Each feature owns all code related to its domain:

- **API clients** → `features/<feature>/api/`
- **React Query hooks** → `features/<feature>/hooks/`
- **UI components** → `features/<feature>/components/`
- **Schemas (Zod)** → `features/<feature>/schemas/`
- **Zustand store** (when needed) → `features/<feature>/store/`
- **Socket listeners** → `features/<feature>/socket/`
- **Types** → `features/<feature>/types/`

Examples:

- `features/auth/api/auth.api.ts`
- `features/menu/hooks/useMenu.ts`
- `features/orders/socket/order-events.ts`

---

### 7.2 `entities/` — Entity Layer

Contains reusable domain objects shared across features:

- `entities/user/` → types, model helpers, UI primitives
- `entities/dish/` → types, model helpers, UI primitives
- `entities/order/`, `entities/table/`, `entities/cart-item/`, etc.

---

### 7.3 `shared/` — Shared Layer

Contains only code that is **truly shared** and does not belong to any specific feature:

- `shared/api/axios.ts` → single axios instance
- `shared/providers/` → app-wide providers
- `shared/hooks/` → generic hooks (useDebounce, useMounted…)
- `shared/lib/` → utilities, formatters, query-key builders
- `shared/sockets/socket-client.ts` → base socket client
- `shared/stores/` → global UI/app store
- `shared/types/` → shared types (api, common, pagination)
- `shared/auth/` → session, permissions, guards

---

### 7.4 `app/` — Route Layer

Contains route entrypoints, layouts, and page assembly. **Page files must stay thin:**

- import feature components
- read route params
- compose UI sections

Page files must not contain raw axios calls, inline business rules, or large data orchestration logic.

---

## 8. FEATURE OWNERSHIP MODEL

Each feature should own as much of its code as possible.

### Example: `features/menu`

Owns:

- menu list API
- menu detail API
- menu hooks
- menu filtering logic
- menu page components
- menu display schema/types

### Example: `features/cart`

Owns:

- add/remove cart item logic
- cart item calculation
- cart local persistence
- cart summary components

### Example: `features/orders`

Owns:

- order creation
- order tracking
- order status transitions
- realtime order updates
- order confirmation mapping

### Example: `features/tables`

Owns:

- table list
- table status
- table assignment
- realtime occupancy updates

---

## 9. APP LAYER RULES

### 9.1 `page.tsx` must stay thin

A page should:

- import feature components
- read params
- compose UI sections

A page should not:

- perform raw axios calls
- contain large data orchestration
- define business rules inline
- duplicate logic across routes

---

### 9.2 Screen-level view files must stay manageable

In some cases, `page.tsx` delegates to an intermediate screen-level file such as:

- `MenuPage.tsx`
- `DashboardView.tsx`
- `OrderConfirmationView.tsx`

These files are acceptable as an orchestration layer between `page.tsx` and feature components, but they must not become bloated.

If a screen-level file is too large, mixes data logic with presentation, or is hard to scan, split it into named **section components**:

```
header-section.tsx
filters-section.tsx
list-section.tsx
summary-section.tsx
actions-section.tsx
details-section.tsx
```

Rules for section splitting:

- split only when it improves readability, ownership, or maintainability
- do not split blindly into meaningless micro-components
- keep the screen file as a lightweight orchestration layer after splitting
- section components live alongside the screen file inside `features/<feature>/components/`

---

### 9.2 `layout.tsx` is for composition and guards

Use layouts for:

- route wrappers
- staff/admin navigation
- role-based protection
- app shell structure
- common provider wiring

---

### 9.3 App route components can remain local if route-specific

Some files may remain inside `app/manage` or `app/guest` when they are purely route-shell components.

Examples:

- `nav-links.tsx`
- `mobile-nav-links.tsx`
- `dropdown-avatar.tsx`

But if these become feature-aware or reused heavily, move them to:

- `shared/ui`
- `features/auth/components`
- `features/manage-layout/components`

---

## 10. API LAYER RULES

### 10.1 Shared Axios Client

There should be exactly one primary axios client in:

- `shared/api/axios.ts`

It handles:

- base URL
- auth headers
- interceptors
- common error normalization

---

### 10.2 Feature APIs

Feature request functions should live inside each feature.

Examples:

- `features/menu/api/menu.api.ts`
- `features/orders/api/order.api.ts`
- `features/auth/api/auth.api.ts`

---

### 10.3 Next.js route handlers

`app/api/*` should be used when:

- proxying to backend
- composing multiple backend responses
- hiding secrets
- handling secure server-side request logic

Do not use `app/api/*` as a replacement for feature-level API client code.

---

## 11. STATE MANAGEMENT RULES

### 11.1 React Query

Use React Query for all server state:

- lists
- details
- mutations
- invalidation
- background refresh

Do not mirror server state into Zustand without strong reason.

---

### 11.2 Zustand

Use Zustand for:

- auth session
- cart local state
- UI toggles
- current selected branch/table/order if needed
- local draft state
- app preferences

---

### 11.3 Context

Use Context only for:

- provider-scoped app services
- theme
- app shell
- rare cases where component subtree state must be injected

Prefer feature hooks + Zustand over large global contexts.

---

## 12. SOCKET ARCHITECTURE RULES

Socket code must not be scattered across pages.

Recommended placement:

- base socket client → `shared/sockets/socket-client.ts`
- feature socket listeners → `features/orders/socket/*`, `features/tables/socket/*`, `features/messages/socket/*`

Examples:

- order created event → `features/orders/socket`
- new message event → `features/messages/socket`

---

## 13. CLEAN CODE RULES FOR THIS PROJECT

### Rule 1

Feature code belongs to the feature that owns the use case.

### Rule 2

Shared code must be truly shared, not "temporarily shared".

### Rule 3

Do not place business logic in page files.

### Rule 4

Do not place feature-specific code in generic folders.

### Rule 5

Avoid giant folders that collect unrelated files.

### Rule 6

Refactor incrementally, not by destructive rewrite.

### Rule 7

Every new feature must decide first:

- route-level?
- feature-level?
- entity-level?
- shared-level?

## 14. NAMING CONVENTIONS

Consistent naming is critical for readability and navigability across the codebase. All files and components must follow the rules below.

---

### 14.1 React Components

**Rule:** PascalCase for all React component files and their exported function names.

```
// File name
DishCard.tsx
OrderSummary.tsx
CartItemRow.tsx
MenuPage.tsx

// Export
export default function DishCard() {}
export function OrderSummary() {}
```

Do not mix casing styles. A file named `dishCard.tsx` or `dish-card.tsx` must not export a React component.

---

### 14.2 Non-Component TypeScript Files

**Rule:** kebab-case for all non-component `.ts` and `.tsx` files.

```
// API clients
menu.api.ts
order.api.ts
auth.api.ts

// Hooks
use-menu.ts
use-cart.ts
use-debounce.ts

// Stores
use-cart-store.ts
use-app-store.ts

// Schemas
dish.schema.ts
checkout.schema.ts

// Types
order.types.ts
dish.types.ts

// Utilities / helpers
format.ts
query-keys.ts
query-client.ts
```

---

### 14.3 Hooks

**Rule:** Hook function names always start with `use`, exported from a `use-<name>.ts` file.

```
// File: features/menu/hooks/use-menu.ts
export function useMenu() {}

// File: features/cart/hooks/use-cart.ts
export function useCart() {}

// File: shared/hooks/use-debounce.ts
export function useDebounce() {}
```

---

### 14.4 Zustand Stores

**Rule:** Store files follow the `use-<domain>-store.ts` naming pattern — consistent with hook file conventions — because Zustand stores are consumed as hooks. The exported store hook follows `use<Domain>Store` naming.

```
// File: features/auth/store/use-auth-store.ts
export const useAuthStore = create(...)

// File: features/cart/store/use-cart-store.ts
export const useCartStore = create(...)

// File: shared/stores/use-app-store.ts
export const useAppStore = create(...)
```

---

### 14.5 API Client Files

**Rule:** API files use the `.api.ts` suffix. Functions inside follow `<verb><Domain>` naming.

```
// File: features/menu/api/menu.api.ts
export async function getMenuList() {}
export async function getMenuDetail(id: string) {}

// File: features/orders/api/order.api.ts
export async function createOrder(payload: CreateOrderPayload) {}
export async function getOrderById(id: string) {}
```

---

### 14.6 Zod Schemas

**Rule:** Schema files use the `.schema.ts` suffix. Schema variables use `<domain><Action>Schema` naming. Inferred types use `<Domain><Action>Type` naming.

```
// File: features/auth/schemas/auth.schema.ts
export const loginFormSchema = z.object({ ... })
export type LoginFormType = z.infer<typeof loginFormSchema>

// File: features/dishes/schemas/dish.schema.ts
export const createDishSchema = z.object({ ... })
export type CreateDishType = z.infer<typeof createDishSchema>
```

---

### 14.7 Type Files

**Rule:** Type files use the `.types.ts` suffix. Interfaces and types use PascalCase. Types for API response/request payloads follow `<Domain>Response` / `<Domain>Payload` naming.

```
// File: features/orders/types/order.types.ts
export interface OrderItem { ... }
export type OrderStatus = 'pending' | 'confirmed' | 'done'
export type CreateOrderPayload = { ... }
export type OrderResponse = { ... }
```

---

### 14.8 Directories

**Rule:** All directory names use kebab-case.

```
features/cart-item/
features/order-confirmation/
shared/query-keys/
entities/cart-item/
```

Do not use PascalCase or camelCase for folder names.

---

### 14.9 Quick Reference Table

| Type | Convention | Example |
|---|---|---|
| React component file | PascalCase | `DishCard.tsx` |
| React component export | PascalCase | `export default function DishCard()` |
| Hook file | kebab-case | `use-cart.ts` |
| Hook function | camelCase `use` prefix | `useCart()` |
| API client file | kebab-case `.api.ts` | `menu.api.ts` |
| API function | camelCase verb+noun | `getMenuList()` |
| Store file | kebab-case `use-<domain>-store.ts` | `use-cart-store.ts` |
| Store hook | PascalCase `use` prefix | `useCartStore` |
| Schema file | kebab-case `.schema.ts` | `dish.schema.ts` |
| Schema variable | camelCase | `createDishSchema` |
| Type file | kebab-case `.types.ts` | `order.types.ts` |
| Type / Interface | PascalCase | `OrderItem`, `OrderStatus` |
| Directory | kebab-case | `cart-item/`, `order-confirmation/` |

---

## 15. Definition of Done

A task is considered done only when **all** of the following conditions are satisfied:

- The feature works correctly for its intended user flow.
- The code follows the project architecture:
  - routing stays in `app/`
  - business logic stays in `features/`
  - reusable domain parts stay in `entities/`
  - generic utilities stay in `shared/`
- No new business logic is placed directly inside `page.tsx` unless it is truly route-only composition.
- API calls are not written inline inside UI components.
- State management follows the agreed rules:
  - server state uses React Query
  - local/client state uses Zustand only when appropriate
  - Context is used only when provider scoping is truly needed
- Variable names, function names, and file names are meaningful and reflect business intent clearly.
- The implementation does not introduce duplicated logic when an existing shared abstraction is more appropriate.
- Validation is implemented with Zod where needed.
- Error states, loading states, and empty states are handled properly.
- Realtime behavior, if introduced, is placed in the correct socket layer and not scattered across pages.
- Imports are cleaned up and no dead code is left behind.
- Existing related code paths are not broken.
- README must be updated if:
  - environment variables change
  - setup steps change
  - run/build commands change
  - architecture rules or folder conventions change
- The code passes linting, type-checking, and build checks.
- The feature is ready for another developer to understand and continue without guessing project conventions.

### Additional Definition of Done Notes

- "Works on my machine" is **not** enough.
- A feature is not done if it only works visually but breaks architecture boundaries.
- A feature is not done if it adds technical debt by placing code in the wrong layer.
- A feature is not done if naming is vague, misleading, or inconsistent.

---

## 16. Commands

### Install dependencies

Using **pnpm**:

```bash
pnpm install
```

### Build 

```bash
pnpm build
```

### Development 

```bash
pnpm dev
```

### Lint check 

```bash
pnpm lint
```

### Type check

```bash
pnpm type-check
```