# Task — Refactor MikiAssistant into Dual Chat Modes (AI Chatbot via HTTP + Staff Chat via WebSocket)

**Task Type:** Frontend Feature Enhancement / Architecture-Aligned Refactor  
**Priority:** High  
**Source of Truth:** Frontend `OVERVIEW.md` + current `MikiAssistant` implementation  
**Related Feature:** `features/messages`  
**Status:** Todo

---

## 1. Context

The frontend already follows a feature-first architecture:

- route files stay in `app/`
- business logic belongs in `features/`
- reusable domain pieces belong in `entities/`
- shared infrastructure belongs in `shared/`

The architecture also requires:

- route files must stay thin
- socket logic must not be scattered across pages
- feature code must stay inside the owning feature
- shared code must be truly shared
- React Query is used for server state
- Zustand is used only when appropriate
- Context should not be used by default if a hook/store is sufficient

This task must follow that architecture. Do **not** rewrite the app from scratch.

---

## 2. Current Problem

The current `MikiAssistant` component is tightly coupled to WebSocket connectivity.

Right now:

- it imports `useTableChat()` and `useSocket()`
- sending messages depends on the socket connection
- suggestion buttons are disabled when `!isConnected`
- the input is disabled when `!isConnected`
- the send button is disabled when `!isConnected`
- `handleSendMessage()` exits early if the socket is not connected

This means that if WebSocket is unavailable, the user cannot ask anything at all.

That behavior is no longer acceptable.

---

## 3. New Product Requirement

The assistant must support **two explicit chat modes**:

### Mode A — Chat with Miki (AI chatbot)

This mode must use **HTTP** to talk to the backend chatbot API.

It must **not depend on WebSocket connectivity**.

Even if WebSocket is disconnected, the user must still be able to ask Miki questions and receive the HTTP response.

---

### Mode B — Chat directly with staff

This mode continues using **WebSocket** / realtime chat.

This mode **does depend on WebSocket connectivity**.

If WebSocket is disconnected, the user must not be allowed to switch into or use this mode.

---

## 4. Backend API Contract for AI Mode

The backend already provides HTTP endpoints for the chatbot flow.

Relevant chatbot routes:

- `POST /api/chatbot/chat/`
- `GET /api/chatbot/conversations/`
- `GET /api/chatbot/conversations/<id>/messages/`
- `PATCH/DELETE /api/chatbot/conversations/<id>/` if supported by the backend detail view

For the main AI request, use:

- `POST /api/chatbot/chat/`

Expected request body:

```json
{
  "message": "Có món chay không?",
  "conversation_id": 21
}
```

`conversation_id` is optional for the first message and should be reused for later turns once available.

Expected response shape:

```json
{
  "conversation_id": 21,
  "answer": "VietFood được điều hành bởi Nguyễn Quốc Duy...",
  "citations": [
    {
      "source": "faq.md",
      "title": "faq",
      "distance": 0.708365797996521
    }
  ],
  "items": [
    {
      "name": "Rau muống xào tỏi",
      "id": "19",
      "image_url": "https://..."
    }
  ]
}
```

The frontend must integrate with this contract as-is.

Do not invent a different response format.

---

## 5. Main Goal

Refactor the current guest assistant experience so that:

- users can explicitly choose the chat mode
- AI mode works over HTTP without requiring socket connectivity
- staff mode works over WebSocket and is only available when connected
- the UI clearly communicates which mode is active
- the feature still respects the current feature-first architecture
- logic is separated cleanly into feature hooks/services/components instead of bloating one component

---

## 6. Architecture Requirements

### 6.1 Keep route files thin

Do not move this logic into `page.tsx`.

### 6.2 Keep the feature inside `features/messages`

This work belongs to the `messages` feature.

### 6.3 Separate responsibilities

Refactor the current implementation so responsibilities are split clearly:

- UI mode switcher
- AI chat HTTP integration
- staff chat socket integration
- message rendering / mapping
- chatbot-specific response mapping (`answer`, `citations`, `items`)
- conversation id persistence for AI mode

### 6.4 Avoid one giant component

If `MikiAssistant` becomes too large, split it into feature components and hooks.

---

## 7. Required Refactor Outcome

### 7.1 Add a chat mode selector

The user must be able to choose between:

- **Miki AI**
- **Staff**

The default mode should be a sensible product decision. Recommended:

- default to **Miki AI**

because it works even when WebSocket is unavailable.

---

### 7.2 Mode behavior rules

#### When mode = `Miki AI`

- input must remain usable even if `isConnected === false`
- suggestion buttons must remain usable
- sending a message must call the chatbot HTTP endpoint
- the chatbot response must be rendered back into the conversation UI
- citations and recommended items must be preserved in state and displayable

#### When mode = `Staff`

- input/send behavior uses the existing websocket path
- if socket is disconnected, user must not be able to switch into this mode
- if user is already in this mode and socket disconnects, show a clear disabled/unavailable state

---

## 8. State Design Requirements

Introduce a clear mode state, for example:

- `"ai"`
- `"staff"`

This state should live in the appropriate feature layer.

You may use:

- component-local state if the mode is only needed inside `MikiAssistant`
- or feature store if mode/history must be shared more broadly

Do not introduce unnecessary global state.

Also introduce a dedicated AI conversation state for:

- `conversationId`
- loading state
- error state
- optional citations/items for the latest response

---

## 9. Recommended Feature-Level Structure

Refactor toward something like this inside `features/messages`:

```txt
features/messages/
├── api/
│   └── chatbot.api.ts
├── hooks/
│   ├── use-miki-chat.ts
│   ├── use-staff-chat.ts
│   └── use-chat-mode.ts
├── components/
│   ├── MikiAssistant.tsx
│   ├── ChatModeSwitcher.tsx
│   ├── ChatMessagesList.tsx
│   ├── ChatInputBar.tsx
│   ├── ChatSuggestions.tsx
│   ├── ChatConnectionBanner.tsx
│   └── ChatRecommendedItems.tsx
├── store/
│   └── use-chat-store.ts
└── types/
    └── chatbot.types.ts
```

You do not have to follow these exact filenames if a better naming choice fits the codebase conventions, but keep the same separation of concerns.

---

## 10. Step-by-Step Implementation Plan

### Step 1 — Audit the current component

Review the current `MikiAssistant` implementation and identify which parts are:

- shared UI
- staff chat logic
- AI FAQ shortcut logic
- socket state rendering
- message rendering
- input handling

Do not keep all responsibilities inside one file if it becomes too large.

---

### Step 2 — Add chatbot API client

Create a dedicated API file inside `features/messages/api/`, for example:

- `chatbot.api.ts`

Implement functions such as:

- `sendChatbotMessage(payload)`
- optionally `getConversationMessages(conversationId)`
- optionally `getConversations()`

Use the shared axios client from `shared/api/axios.ts`, not inline fetch/axios inside UI.

---

### Step 3 — Add chatbot types

Create types for the backend response, for example:

- `ChatbotCitation`
- `ChatbotRecommendedItem`
- `ChatbotResponse`
- `SendChatbotMessagePayload`

Keep them inside `features/messages/types/`.

---

### Step 4 — Create a dedicated AI chat hook

Create a hook such as:

- `use-miki-chat.ts`

Responsibilities:

- send message to the chatbot HTTP endpoint
- manage loading/error state
- store/reuse `conversationId`
- append assistant response into the UI/store
- preserve `citations` and `items`

Use React Query mutation if appropriate.

Recommended:

- mutation for `POST /api/chatbot/chat/`
- local feature state/store for the active AI conversation session

---

### Step 5 — Keep staff chat logic in a dedicated hook

Wrap the current socket-based flow behind a dedicated hook such as:

- `use-staff-chat.ts`

Responsibilities:

- use the existing websocket-based sending behavior
- expose whether staff chat is currently available
- define clean “can use staff mode” logic

Do not mix staff socket conditions directly all over the UI.

---

### Step 6 — Add a chat mode switcher

Create a UI component such as:

- `ChatModeSwitcher.tsx`

Requirements:

- clearly show the two modes
- visually indicate the active mode
- disable or block switching to **Staff** mode when websocket is unavailable
- allow staying in **Miki AI** mode regardless of socket status

This should be a small presentational component.

---

### Step 7 — Refactor the message send flow

Replace the current single-path send behavior with branch logic based on mode:

#### If mode = `ai`

- send through chatbot HTTP API
- add user message optimistically
- show loading state for assistant
- append assistant answer when the response returns
- optionally show citations/items beneath the answer or in a follow-up UI block

#### If mode = `staff`

- use the current websocket `sendMessage`
- keep the realtime flow unchanged as much as possible

---

### Step 8 — Refactor suggestions behavior

Currently, suggestion buttons are disabled when socket is disconnected.

This must change.

Rules:

#### In AI mode

- suggestions must remain enabled
- clicking a suggestion should call the AI flow, not the staff flow
- do not keep the current fake timeout FAQ response if the real backend chatbot should now answer

#### In Staff mode

- suggestions are optional
- if kept, they must respect websocket availability

Preferred product behavior:

- use suggestions only for AI mode

---

### Step 9 — Improve message model/display mapping

The current messages list appears to render a generic shared message shape.

You need to support the fact that AI responses now come from HTTP and may include:

- `answer`
- `citations`
- `items`

You must decide how to represent this in the frontend state.

Recommended:

- normalize AI response into the same base message list where possible
- optionally extend assistant message metadata to include:
  - `citations`
  - `items`
  - `mode`

This should allow the UI to render:

- standard text answer
- optional citation block
- optional recommended dish cards

---

### Step 10 — Add recommended items rendering

If `items` exist in the chatbot response, render them in a clean UI block under the assistant reply.

Recommended behavior:

- show dish image
- show dish name
- make the card clickable if your app already has a dish/menu detail route
- keep this rendering inside the messages feature, not inside `app/`

---

### Step 11 — Add loading and failure UX for AI mode

For AI mode:

- show an in-progress assistant placeholder while waiting for HTTP response
- if the request fails, show a safe fallback assistant error message
- do not block the whole chat panel because the socket is disconnected

The user should still be able to talk to Miki even when WebSocket is down.

---

### Step 12 — Keep WebSocket status relevant only to Staff mode

The socket connection banner should not imply that the whole assistant is broken if AI mode still works.

Adjust the UI copy accordingly.

Example:

- if socket is disconnected but AI mode is active, show:
  - staff chat unavailable
  - Miki AI still available

Do not show a global failure state that incorrectly suggests the whole assistant is unusable.

---

## 11. Behavioral Rules

### AI mode must work when socket is disconnected

This is the core product requirement.

### Staff mode must depend on socket connectivity

If socket is disconnected:

- do not allow selecting Staff mode
- or if currently selected, show disabled/unavailable state and guide the user back to AI mode

### Do not silently change user intent

If the user explicitly selected Staff mode, do not silently send their message to AI instead.

If Staff mode is unavailable, the UI must make that explicit.

---

## 12. Definition of Done

This task is done only when:

- the assistant supports **two explicit modes**: AI and Staff
- AI mode works through the backend HTTP chatbot endpoint
- AI mode works even when websocket is disconnected
- Staff mode continues to use websocket
- Staff mode cannot be used when websocket is unavailable
- `MikiAssistant` is no longer a bloated one-file implementation if splitting improves ownership
- API logic lives in `features/messages/api`
- mode-specific logic lives in hooks/services inside `features/messages`
- route/page files remain thin
- message UI remains readable and modular
- citations and recommended items are preserved and rendered correctly
- naming follows the project conventions
- `pnpm lint` passes
- `pnpm type-check` passes
- `pnpm build` passes

---

## 13. Commands

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

## 14. Implementation Notes

- Follow the existing feature-first architecture strictly.
- Use `features/messages` as the owning feature.
- Use `shared/api/axios.ts` for HTTP calls.
- Keep socket-specific code behind feature hooks or socket modules.
- Avoid adding business logic directly inside `page.tsx`.
- Prefer clear feature boundaries over quick hacks.
- Refactor incrementally rather than rewriting unrelated parts.
- If a component becomes too long, split it into section-level or responsibility-level components.
- Preserve existing behavior where still valid, but do not preserve the current “socket required for everything” behavior.

---

## 15. Skills to Apply

Use these skills selectively, not broadly.

### From `next-best-practices`

Focus specifically on:

- `data-patterns.md`
- `directives.md`
- `error-handling.md`
- `file-conventions.md` (only when deciding file placement)
- `route-handlers.md` (only if a Next.js route handler/proxy is introduced)

### From `vercel-react-best-practices`

Focus specifically on:

- `rerender-split-combined-hooks`
- `rerender-no-inline-components`
- `rerender-derived-state-no-effect`
- `rerender-dependencies`
- `rendering-conditional-render`
- `js-early-exit`

Apply them to:

- split `MikiAssistant` by responsibility
- separate AI chat flow from staff chat flow
- keep UI state and business logic clean
- avoid one giant client component
- keep mode-specific behavior explicit and maintainable
