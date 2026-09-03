# Frontend Architecture & Coding Standards — Landing Page

## 1. Purpose

This document defines the architecture and coding standards for the **landing page** project.

A landing page is presentational by nature — little to no complex business logic, no persistence layer, at most a form submission and fetching static content (CMS/testimonials). For that reason, this document deliberately **does not** use a full layered architecture (Domain/Application/Infrastructure) as typically used for large systems — that would be overengineering for this context.

Primary goals:

- Maintainable code
- Reusable code
- Testable code
- Clear separation of concerns (UI vs logic)
- Consistent project structure
- Easy onboarding for developers and AI coding agents
- Prevent large, unmaintainable files
- Prevent duplicated UI and logic

The project MUST follow:

1. Section-based structure
2. SOLID Principles (at the component/hook/function level)
3. Separation of UI and logic
4. Reusable component architecture
5. Lightweight dependency inversion (no formal Repository pattern)
6. Single Responsibility Principle
7. Maximum 500 lines per page/component file

---

## 2. Core Principle

The dependency flow used in this project:

```text
Page / Section
     ↓
Hook (logic & data fetching)
     ↓
lib/ (thin fetcher)
     ↓
API / CMS
```

There is no Use Case, Repository Interface, Repository Implementation, or Domain Layer. This is sufficient for a landing page because there is no business rule/orchestration complex enough to warrant an additional layer.

UI **MUST NOT** call `fetch`/`axios` directly inside a component — always go through a hook, and the hook calls a thin function in `_lib/`.

---

## 3. Folder Structure

Since this project uses the **Next.js App Router**, all source code (components, hooks, lib, etc.) lives **inside `app/`** — not in a separate top-level `src/`. Folders prefixed with an underscore (`_name`) are Next.js's built-in [private folders](https://nextjs.org/docs/app/building-your-application/routing/colocation#private-folders): they are **not** treated as routes, so they're safe to use for colocating components/hooks/lib without colliding with the routing system.

```text
app/
├── layout.tsx
├── page.tsx                    # landing page — composes all sections
├── globals.css
│
├── properties/                 # route: /properties
│   ├── page.tsx                 # full property listing
│   └── [slug]/
│       └── page.tsx              # route: /properties/[slug] — property detail
│
├── _components/
│   ├── ui/                     # Button, Input, Card, Badge — generic, used anywhere
│   └── layout/                 # Header, Footer, Container, Section wrapper
│
├── _sections/                  # landing-page-specific sections
│   ├── hero/
│   │   ├── Hero.tsx
│   │   └── hero.constants.ts
│   ├── testimonials/
│   │   ├── Testimonials.tsx
│   │   └── TestimonialCard.tsx
│   ├── pricing/
│   └── contact/
│       ├── ContactForm.tsx
│       ├── useContactForm.ts   # validation + submit logic, separate from UI
│       └── contact.schema.ts   # validation schema (zod/yup)
│
├── _hooks/                     # cross-section hooks (not specific to one section)
│   └── useMediaQuery.ts
│
├── _lib/                       # thin abstraction over external systems
│   ├── api-client.ts           # thin fetch wrapper
│   └── analytics.ts
│
├── _constants/
├── _types/
└── _styles/
```

**Placement principles:**

- Underscore folders (`_components`, `_sections`, `_hooks`, `_lib`, `_constants`, `_types`, `_styles`) **MUST** be used for anything that isn't a route — this is Next.js App Router's official private-folder convention, not just a naming preference.
- Only `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`, and route folders (like `properties/`) may sit directly inside `app/` without an underscore — those are the ones Next.js picks up as part of routing.
- A section-specific file lives in one place (`_sections/hero/`) — hooks and constants specific to that section stay next to it, not scattered into global folders.
- `_components/ui/` is only for components that are genuinely generic and used in ≥2 sections.
- `_lib/` replaces the entire "infrastructure layer" concept — just a few thin files, not a layered repository folder.
- If a route has files that only that route needs (e.g. a component used only on `/properties`), colocate it inside that route's own folder (`app/properties/_components/`) — don't automatically promote it to the global `app/_components/`.
- If this landing page later grows into part of a larger application (auth, dashboard, complex data mutation), **that is when** you introduce `features/`, `domain/`, `application/` — not from the start.
- `ARCHITECTURE.md`, `AGENTS.md`, and `DESIGN.md` stay at the project root, **not** inside `app/`.

---

## 4. UI and Logic Separation

This is a STRICT rule. UI code **MUST NOT** contain complex business logic.

Bad:

```tsx
function ContactSection() {
  const [values, setValues] = useState({});

  async function handleSubmit() {
    // validation
    // API call
    // error handling
    // formatting
  }

  return (/* large JSX */);
}
```

Prefer:

```tsx
function ContactSection() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useContactForm();

  return (
    <ContactForm
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
```

A Page/Section should primarily describe **what the UI looks like**, not **how the application works internally**.

---

## 5. SOLID Principles (Component Level)

SOLID is still mandatory — just applied at the component/hook/function level, not through a formal layer.

### Single Responsibility

One component = one visual/interaction responsibility. `Hero`, `Testimonials`, `PricingSection`, `ContactForm` each stand on their own. Logic beyond a simple `useState` is extracted into a hook.

### Open/Closed

Components like `Section` or `Card` accept `children`/props rather than being edited every time a new variant appears. For CTA/testimonial layout variants, use props/composition or a config object — not stacked `if/else`.

### Liskov Substitution

Component variants sharing an interface (e.g. `PrimaryButton`, `OutlineButton` with the same `ButtonProps`) must be substitutable for each other without breaking the parent.

### Interface Segregation

Don't build one giant props interface for an all-purpose component (`showHeader`, `showFooter`, `compact`, `mobile`, etc.). Split into smaller composable components instead.

### Dependency Inversion

Data fetching (CMS content, form submission) must not be called directly inside a component. Put it in a hook (`useHeroContent()`, `useContactForm()`) that calls a thin function in `_lib/api-client.ts`, so the component doesn't depend on API implementation details.

---

## 6. Function Separation

Functions MUST NOT be mixed unnecessarily with large UI declarations.

Avoid:

```tsx
function ContactSection() {
  const formatPhone = () => {};
  const validateEmail = () => {};
  const handleSubmit = () => {};

  return (/* hundreds of lines */);
}
```

Prefer: extract into `useContactForm.ts` and `contact.schema.ts`. Small, strictly UI-specific event handlers may remain inside the component.

---

## 7. Maximum File Size

**HARD LIMIT: 500 lines per Page/Section component.**

When approaching this limit, extract:

```text
Components
Hooks
Utilities
Validators
Constants
Types
```

Do not work around the limit by compressing code, writing unreadable one-liners, or combining unrelated functions.

Files outside of Pages: **< 300 lines** is preferred.

---

## 8. Component Reusability & Composition

A reusable component **MUST** be used when the same UI/behavior appears in ≥2 places: Button, Modal, Form Field, Pagination, Empty State, Loading State.

Prefer composition:

```tsx
<Section>
  <Hero />
  <Testimonials />
  <Pricing />
  <ContactForm />
</Section>
```

Bad — a component with too many configuration flags:

```tsx
<Section showHeader showFooter compact mobile admin ... />
```

### Avoid Premature Abstraction

Don't extract every small piece of UI into a component automatically. Extract when: it's used more than once, it represents a clear UI concept, it has independent behavior, or extraction clearly improves readability.

---

## 9. State Management

- **Local state** — for UI-only state (modal open/close, input value).
- **Section-level state** — for state shared across components within one section (form state).
- **Global state** — only when genuinely shared across unrelated sections (e.g. theme, locale). Don't put everything into global state.

---

## 10. Custom Hooks

Hooks encapsulate reusable UI/interaction logic:

```text
useContactForm()
useHeroContent()
useMediaQuery()
```

A hook **must not** become a full replacement for a service layer — avoid a 500-line hook that mixes API calls + validation + formatting + side effects. Split into `_lib/` and `*.schema.ts` when it starts growing.

---

## 11. API Access

A Section/Page **MUST NOT** call an API client directly.

Bad:

```tsx
const res = await axios.get("/api/testimonials");
```

Prefer:

```text
Section → Hook → _lib/api-client.ts → API/CMS
```

This is a thin abstraction, not a formal Repository pattern with separate interface + implementation.

---

## 12. Error Handling & Loading/Empty/Error States

For sections that fetch data (e.g. testimonials from a CMS), consider these states:

```text
Loading
Success
Empty
Error
```

Use reusable `LoadingState`, `ErrorState`, `EmptyState` components when this pattern repeats across sections. Never expose raw API error messages directly to the user.

---

## 13. Naming Convention

Good:

```text
useContactForm
ContactForm
Hero
TestimonialCard
formatPhoneNumber
```

Avoid meaningless generic names:

```text
Helper
Manager
Utils2
Common
Temp
```

---

## 14. Constants & Configuration

Repeated values **MUST** be extracted into `_constants/`. Environment-specific values (API URL, analytics key) **MUST NOT** be hardcoded — use environment variables via configuration, not written directly in code.

---

## 15. Testing

- **Hooks** (`useContactForm`, etc.) → unit tests, testable without rendering the full UI.
- **Components** → component tests (render, interaction, snapshot if needed).
- **Section/Page** → integration/E2E tests for important flows (e.g. submitting the contact form).

---

## 16. AI Agent / Skill Usage

AI coding agents **MUST** prioritize available project skills/agents when relevant, before starting a non-trivial task.

Before modifying an existing feature/section, the agent **MUST** inspect:

```text
Project structure
Relevant section
Existing components
Existing hooks
Available shared components
```

### Reuse Before Create

```text
Need functionality
      ↓
Search for an existing implementation
      ↓
Exists?
 ↙        ↘
YES        NO
 ↓          ↓
Reuse/extend   Create new
```

Don't immediately create a new abstraction without checking whether an existing one can be reused/extended.

### Duplication Rule

When the same UI or logic appears **2 or more times**, that's a trigger to refactor into a shared component/hook. Don't blindly abstract two things that coincidentally look similar but have different responsibilities.

---

## 17. Anti-Patterns

The following are NOT allowed without a strong architectural reason:

```text
God Component
God Hook
God Utility
Massive Section/Page (>500 lines)
Massive Conditional (stacked if/else for different strategies)
Duplicated Components
Duplicated Logic
Direct API calls inside components
Business logic inside JSX
Global state for everything
```

---

## 18. Refactoring Trigger

Consider refactoring when:

- A Page/Section approaches 500 lines
- A component has multiple unrelated responsibilities
- A hook becomes too complex (API + validation + formatting + UI in one hook)
- Business logic appears inside UI/JSX
- The same code appears in ≥2 places
- A file requires extensive scrolling to understand
- Tests become difficult to write

---

## 19. Deliberately Excluded (and Why)

For context: parts of the "full" architecture standard that are **deliberately excluded** from this landing page, because they'd be overkill:

| Excluded                                                             | Reason                                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Domain Layer (entities, value objects, invariants)                   | A landing page has no business rules/domain complex enough to warrant this                 |
| Application Layer / Use Case classes                                 | No orchestration/workflow complex enough to need a layer separate from hooks               |
| Repository Interface + Implementation                                | A single thin fetcher function in `_lib/` is enough                                        |
| Heavy design patterns (Factory, Strategy, Adapter, Facade, Observer) | Only make sense with many logic variants; a landing page doesn't need this                 |
| Formal DTO + Mapper                                                  | Overkill for consuming 1–2 small APIs/CMS endpoints                                        |
| Feature-based folders (`features/users`, etc.)                       | A landing page has no "features" like users/orders — replaced with section-based structure |

If this project later grows into a larger application with auth, dashboards, or complex data mutation, the items above can be reintroduced gradually — not applied from day one to a simple landing page.

---

## 20. Booking Feature — Property & Antar-Jemput (Pickup/Drop-off) via WhatsApp

This landing page has two **independent** booking flows, both of which end at WhatsApp (click-to-chat) rather than a backend/database order system:

1. **Property Booking** — user picks a property (from multiple listings) → fills a form (dates, guest count, notes) → an auto-generated WhatsApp message is produced.
2. **Antar-Jemput (Pickup/Drop-off)** — stands on its own, **does not require** a property booking first. A user can fill the form directly (pickup/drop-off location, date, passenger count) → an auto-generated WhatsApp message is produced, without going through the property booking flow.

Because both flows share the same pattern — "collect form data → format into a WhatsApp message → open the `wa.me` link" — this logic **MUST** be shared through a single util, not duplicated in each form (Duplication Rule, §16).

### Additional structure

```text
app/
├── page.tsx              # landing: hero, property highlights, antar-jemput CTA, contact
├── properties/
│   ├── page.tsx           # full property listing
│   └── [slug]/
│       └── page.tsx        # property detail + PropertyBookingForm
│
├── _sections/
│   ├── properties/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyList.tsx
│   │   └── PropertyDetail.tsx
│   │
│   ├── property-booking/
│   │   ├── PropertyBookingForm.tsx
│   │   ├── usePropertyBookingForm.ts
│   │   └── propertyBooking.schema.ts
│   │
│   └── antar-jemput/
│       ├── AntarJemputForm.tsx
│       ├── useAntarJemputForm.ts
│       └── antarJemput.schema.ts
│
├── _lib/
│   ├── whatsapp.ts        # shared: buildWhatsAppMessage(), buildWhatsAppLink()
│   └── properties.ts      # fetch property list/detail (static JSON or CMS)
│
└── _constants/
    └── whatsapp.ts        # WA number & message template — don't hardcode in forms
```

If a component/hook above is only used on the `/properties` route (not reused on the main landing page), it can be colocated inside `app/properties/_components/` instead — follow §3's rule on per-route vs. global colocation.

### Rules

- `_lib/whatsapp.ts` **MUST** be the single place that knows how to format the WA number and generate the `wa.me` link. Both `usePropertyBookingForm` and `useAntarJemputForm` call this same function — neither builds its own URL string.
- The WhatsApp number and message template **MUST** live in `_constants/whatsapp.ts`, not hardcoded inside form components.
- Since Antar-Jemput can be booked standalone, `AntarJemputForm` **MUST NOT** depend on state/props from the property booking flow — the two flows are independent even though they share the same util.
- This is still **not** a database-backed order system — there is no Use Case/Repository for "create order." If order history persistence is needed later (beyond just opening WhatsApp), that's when a real backend/API order system should be introduced (see §19).
- If the property list later comes from a CMS, fetching still follows §11 (through `_lib/properties.ts`, called from a Server Component for the listing/detail pages).
