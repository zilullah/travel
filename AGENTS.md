# AGENTS.md — Landing Page (Next.js)

This document is the mandatory guide for AI coding agents (Claude Code, Cursor, etc.) working on this project. It aligns with `ARCHITECTURE.md` and `DESIGN.md` — read all three, plus every available `.skill`, before starting any non-trivial task.

---

## 0. Project Documents & Priority

This project has several sources of rules. When they conflict, the priority order is:

```text
1. .skill files (skills/**)   → HIGHEST PRIORITY, must be followed first for any covered task
2. DESIGN.md                  → visual system: tokens, UI components, spacing, typography
3. ARCHITECTURE.md            → folder structure, SOLID, separation of concerns
4. AGENTS.md (this document)  → workflow & Next.js-specific rules
```

**Skill-First Rule:** for every task, the agent **MUST** first check whether a relevant `.skill` exists (e.g. a skill for building UI components, a skill for section layout, a skill for forms, etc.). If a skill covers the task:

- The agent **MUST** follow the steps/pattern defined by that skill as-is — not treat it as an optional reference.
- The agent **MUST NOT** reinvent its own pattern when the skill already provides a clear way to do the task.
- `ARCHITECTURE.md` and `AGENTS.md` still apply to anything **not** covered by a skill (general folder structure, SOLID, Next.js rules, etc.) — skills and these documents complement each other, they don't fully replace one another.
- If a skill appears to conflict with `ARCHITECTURE.md`/`DESIGN.md` for a specific case, follow the skill (since skills are usually more specific/up to date), but flag the conflict to the user instead of silently picking one.

---

## 1. Project Context

- **Project type:** Landing page / marketing site
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Architecture shape:** Lightweight, section-based — **not** a full layered architecture (no Domain/Application/Repository layer). See `ARCHITECTURE.md` §19 for the list of things deliberately excluded.

The agent **MUST NOT** propose or create a Domain Layer, Use Case classes, or a formal Repository pattern in this project unless explicitly requested.

---

## 2. Tech Stack

```text
Framework        : Next.js (App Router)
Language          : TypeScript
Styling           : Tailwind CSS
Form/Validation   : react-hook-form + zod (when a form is present)
Package manager   : match whatever the lockfile uses (don't mix npm/yarn/pnpm)
```

Before adding a new dependency, the agent **MUST** check `package.json` — don't install a library whose functionality is already covered by an existing one.

---

## 3. Folder Structure (Next.js App Router)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # compose all sections here
│   ├── globals.css
│   └── (other routes if any, e.g. /privacy, /terms)
│
├── components/
│   ├── ui/                     # Button, Input, Card, Badge — generic
│   └── layout/                 # Header, Footer, Container
│
├── sections/                   # one folder per landing page section
│   ├── hero/
│   │   ├── Hero.tsx
│   │   └── hero.constants.ts
│   ├── testimonials/
│   ├── pricing/
│   └── contact/
│       ├── ContactForm.tsx
│       ├── useContactForm.ts
│       └── contact.schema.ts
│
├── hooks/                      # cross-section hooks
├── lib/                        # thin fetcher, analytics, utils
├── constants/
├── types/
└── styles/
```

**Rules for placing new files:**

- Section-specific files → go into `sections/<section-name>/`, not a global folder.
- Generic components (used in ≥2 sections) → `components/ui/`.
- Server Component is the default in the App Router — only add `"use client"` when interactivity/client-side hooks are actually needed (form, animation, local state).

---

## 4. Next.js Specific Rules

### Server vs Client Components

- Default to **Server Component**. Static sections (Hero, Pricing, Testimonials with no interaction) **MUST** remain Server Components.
- `"use client"` is only used in components that genuinely need it: `useState`, `useEffect`, interactive event handlers, or client-only libraries.
- Don't put `"use client"` in `page.tsx` or `layout.tsx` unless necessary — it would make the whole subtree client-rendered.

### Data Fetching

- Static/CMS content **MUST** be fetched in a Server Component (directly via `async function` + `fetch`, or through a function in `lib/`) — not on the client with `useEffect`.
- If client-side fetching is needed (e.g. data that changes based on user interaction), still go through a hook → `lib/api-client.ts` — don't call `fetch` directly in a component.
- Use Next.js `fetch` with an explicit caching strategy (`cache: 'force-cache'` / `next: { revalidate }`) appropriate to the content — don't leave it at default without thinking about it.

### Metadata & SEO

- Every route **MUST** export `metadata` (title, description, OG tags) — this is a landing page, SEO is a requirement, not optional.
- Images **MUST** use `next/image`, not a plain `<img>`, unless there's a specific reason (e.g. a small SVG icon).
- Fonts **MUST** use `next/font` for load optimization.

### Routing

- A landing page is typically a single route (`/`). If there are additional routes (`/privacy`, `/terms`), keep them in `app/` — no need for complex nested layouts unless genuinely required.

---

## 5. Coding Standards (summary — see ARCHITECTURE.md for details)

- Max **500 lines** per page/section component (hard limit).
- One component = one responsibility (SRP).
- UI **must not** contain complex logic — move it into a hook (`useContactForm`, etc.).
- Form validation **MUST** use a schema (`zod`), not manual validation scattered across components.
- API/CMS calls **must not** happen directly in a component — always through `lib/api-client.ts` or a hook.
- A props interface that keeps growing with boolean flags (`showX`, `isY`, `compact`, etc.) is a signal to split into a separate component, not to add another flag.

---

## 6. Agent Workflow

Before working on a non-trivial task, the agent **MUST**:

```text
1. Read ARCHITECTURE.md, DESIGN.md, AGENTS.md, and any relevant .skill files
2. Inspect the project structure and the relevant section
3. Check whether the needed component/hook/util already exists (Reuse Before Create)
4. Check whether a relevant project skill/agent covers this task — if so, follow it first
5. Then implement
```

### Reuse Before Create

```text
Need functionality
      ↓
Search components/ui, sections/, hooks/, lib/ for an existing implementation
      ↓
Exists?
 ↙        ↘
YES        NO
 ↓          ↓
Reuse/extend   Create new
```

### Duplication Rule

When the same UI or logic appears **2 or more times**, that's a trigger to extract it into a shared component/hook.

---

## 7. Anti-Patterns (Not Allowed Without a Strong Reason)

```text
Formal Domain/Application/Repository layer (see ARCHITECTURE.md §19)
"use client" in layout.tsx / page.tsx without a reason
Plain <img> for content images (use next/image)
Direct fetch calls inside a component (client-side or without a lib/ abstraction)
God Component / God Hook
Massive Section (>500 lines)
Business logic inside JSX
Duplicated component/logic
```

---

## 8. Before Submitting / Finishing a Task

The agent **MUST** check:

- [ ] Server Component remains the default unless there's a reason for `"use client"`
- [ ] No file exceeds 500 lines
- [ ] No new duplication of a component/logic that should have been reused
- [ ] SEO metadata is filled in for new routes
- [ ] Images use `next/image`, fonts use `next/font`
- [ ] Forms (if any) use schema validation
- [ ] No direct API calls inside components
- [ ] Any relevant `.skill` was checked and followed before implementation
