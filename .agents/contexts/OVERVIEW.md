# Layer 1 — Frontend Foundation (Feature-First, Adapted to Current Structure)

**Project:** VietFood Restaurant Management System  
**Type:** Frontend Architecture Specification  
**Scope:** Refactor current Next.js frontend structure toward Feature-First Architecture  
**Status:** Adapted from current real project structure

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

The system has 3 major route groups:

- `app/manage/*` → for **staff/admin**
- `app/guest/*` → for **all users**, including unauthenticated and authenticated guest users
- `app/api/*` → for **Next.js route handlers / proxy / BFF endpoints**

This document defines how to reorganize the current frontend structure into a **feature-first architecture** while still respecting the current route model.

---

## 2. CURRENT STRUCTURE PROBLEM

The current project structure is not unusable, but it has several architectural issues:

### 2.1 Technical-type grouping instead of business grouping

The current folders are grouped by technical concern:

- `components`
- `hooks`
- `context`
- `stores`
- `types`
- `schemaValidations`
- `apiRequests`

This makes the project harder to scale because one feature is spread across many unrelated folders.

---

### 2.2 Global folders are becoming dumping grounds

Folders like these can quickly become overloaded:

- `components`
- `hooks`
- `lib`
- `types`
- `apiRequests`

When feature count grows, developers no longer know:

- which file belongs to which business domain
- where to place new code
- which files can be safely reused
- which files are guest-only vs manage-only

---

### 2.3 Route grouping exists, but business logic boundaries are weak

You already have good route boundaries:

- guest
- manage
- api

But the underlying logic is still too mixed.

The goal is **not** to rewrite the routing model.  
The goal is to make the internal codebase follow **feature-first boundaries**.

---

## 3. TARGET ARCHITECTURE PRINCIPLE

We will keep the route structure:

- `app/manage`
- `app/guest`
- `app/api`

But below the route layer, we will organize code by **feature/domain ownership**.

This means:

- route files remain in `app/`
- business logic moves into `features/`
- reusable domain objects move into `entities/`
- generic shared utilities move into `shared/`

This is a **hybrid architecture**:

- **route-first at the App Router level**
- **feature-first at the business logic level**

This is the best fit for your current project.

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

### 5.1 `app/manage/*`

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

### 5.2 `app/guest/*`

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

### 5.3 `app/api/*`

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

## 6. RECOMMENDED TARGET STRUCTURE

Below is the recommended structure adapted to your current project.

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
├── legacy/
│   ├── apiRequests/
│   ├── context/
│   ├── hooks/
│   ├── schemaValidations/
│   └── types/
│
└── middleware.ts
```

## 7. IMPORTANT DESIGN DECISION

### Keep current route folders

We will keep:

- `app/manage`
- `app/guest`
- `app/api`

because they already match the product routing model.

### Refactor business logic gradually

We will **not** move everything in one shot.

Instead:

- keep existing routes
- create `features/`, `entities/`, `shared/`
- migrate old files gradually
- leave old folders in place temporarily under `legacy/` conceptually, until fully replaced

This prevents project breakage and reduces refactor risk.

---

## 8. HOW TO MAP CURRENT FOLDERS TO NEW ARCHITECTURE

### 8.1 `src/apiRequests`

**Current issue:** likely mixes requests of many unrelated domains.

**New rule:** split by feature.

Move toward:

- `features/auth/api/*`
- `features/menu/api/*`
- `features/orders/api/*`
- `features/tables/api/*`
- `features/accounts/api/*`

Only truly generic request setup should stay in:

- `shared/api/axios.ts`
- `shared/api/endpoints.ts`

---

### 8.2 `src/app/components`

**Current issue:** global component folder can become unbounded.

**New rule:**

- if component belongs to one feature → move into that feature
- if component is reusable app-wide → move into `shared/ui`
- if component is entity-specific → move into `entities/*/ui`

Examples:

- menu card → `features/menu/components`
- order summary → `features/orders/components`
- avatar badge for user → `entities/user/ui`
- generic modal → `shared/ui`

---

### 8.3 `src/app/context`

**Current issue:** too many contexts can make ownership blurry.

Current examples:

- `CartContext`
- `OrderContext`
- `UserContext`
- `socket-provider`
- `theme-provider`
- `app-provider`

**New rule:**

- app-wide providers → `shared/providers`
- feature-specific state should prefer Zustand or feature hooks instead of large context trees
- only keep React Context when it truly needs provider scoping

Recommended mapping:

- `theme-provider.tsx` → `shared/providers/theme-provider.tsx`
- `socket-provider.tsx` → `shared/providers/socket-provider.tsx`
- `app-provider.tsx` → `shared/providers/app-provider.tsx`
- `CartContext.tsx` → refactor toward `features/cart/store` or `features/cart/hooks`
- `OrderContext.tsx` → refactor toward `features/orders/store` or query-based state
- `UserContext.tsx` → refactor toward `features/auth/store`

---

### 8.4 `src/app/hooks`

**Current issue:** mixed hooks with unclear ownership.

**New rule:**

- common generic hooks → `shared/hooks`
- feature hooks → `features/<feature>/hooks`

Examples:

- `useMenu` → `features/menu/hooks`
- `useCart` → `features/cart/hooks`
- `useOrders` → `features/orders/hooks`
- `useDebounce` → `shared/hooks`

---

### 8.5 `src/app/stores`

**New rule:**

- feature-specific store → inside that feature
- global UI/app store → `shared/stores`

Examples:

- auth store → `features/auth/store`
- cart store → `features/cart/store`
- app sidebar state → `shared/stores`

---

### 8.6 `src/schemaValidations`

**Current issue:** all schemas are globally grouped.

**New rule:**

- feature schema → `features/<feature>/schemas`
- common schema → `shared/validators`

Examples:

- login schema → `features/auth/schemas`
- checkout schema → `features/checkout/schemas`
- dish form schema → `features/dishes/schemas`
- generic pagination schema → `shared/validators`

---

### 8.7 `src/types`

**Current issue:** types are centralized but ownership is unclear.

**New rule:**

- feature types → inside feature
- entity types → inside entity
- truly global types → `shared/types`

Examples:

- JWT payload type → `shared/types` or `shared/auth`
- socket base event types → `shared/types`
- dish type → `entities/dish/types` or `features/dishes/types`
- order response type → `features/orders/types`

---

### 8.8 `src/lib`

**New rule:** only generic utilities should live here.

Examples:

- formatter
- query key builders
- helper functions
- date formatters
- number formatters

Do not place feature logic inside `lib`.

---

## 9. FEATURE OWNERSHIP MODEL

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

## 10. APP LAYER RULES

### 10.1 `page.tsx` must stay thin

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

### 10.2 `layout.tsx` is for composition and guards

Use layouts for:

- route wrappers
- staff/admin navigation
- role-based protection
- app shell structure
- common provider wiring

---

### 10.3 App route components can remain local if route-specific

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

## 11. API LAYER RULES

### 11.1 Shared Axios Client

There should be exactly one primary axios client in:

- `shared/api/axios.ts`

It handles:

- base URL
- auth headers
- interceptors
- common error normalization

---

### 11.2 Feature APIs

Feature request functions should live inside each feature.

Examples:

- `features/menu/api/menu.api.ts`
- `features/orders/api/order.api.ts`
- `features/auth/api/auth.api.ts`

---

### 11.3 Next.js route handlers

`app/api/*` should be used when:

- proxying to backend
- composing multiple backend responses
- hiding secrets
- handling secure server-side request logic

Do not use `app/api/*` as a replacement for feature-level API client code.

---

## 12. STATE MANAGEMENT RULES

### 12.1 React Query

Use React Query for all server state:

- lists
- details
- mutations
- invalidation
- background refresh

Do not mirror server state into Zustand without strong reason.

---

### 12.2 Zustand

Use Zustand for:

- auth session
- cart local state
- UI toggles
- current selected branch/table/order if needed
- local draft state
- app preferences

---

### 12.3 Context

Use Context only for:

- provider-scoped app services
- theme
- app shell
- rare cases where component subtree state must be injected

Prefer feature hooks + Zustand over large global contexts.

---

## 13. SOCKET ARCHITECTURE RULES

Socket code must not be scattered across pages.

Recommended placement:

- base socket client → `shared/sockets/socket-client.ts`
- feature socket listeners → `features/orders/socket/*`, `features/tables/socket/*`, `features/messages/socket/*`

Examples:

- order created event → `features/orders/socket`
- new message event → `features/messages/socket`

---

## 14. CLEAN CODE RULES FOR THIS PROJECT

### Rule 1

Feature code belongs to the feature that owns the use case.

### Rule 2

Shared code must be truly shared, not “temporarily shared”.

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
- The code passes linting and build checks.
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
