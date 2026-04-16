# DESIGN.md — CertZen Design System

> Drop this file in your project and tell any AI agent: "Build UI that matches DESIGN.md".
> Inspired by the [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) format.

---

## 1 · Visual Theme & Atmosphere

**Concept:** Deep Space Premium — a certification study platform that feels like a high-performance tool, not a boring exam list. Bold typography, electric accents on near-void dark surfaces, spring-physics interactions.

| Dimension     | Value                                                                       |
|---------------|-----------------------------------------------------------------------------|
| Base feeling  | Focused, high-energy, premium — like a cockpit for serious professionals   |
| Surface depth | Near-void (#06080f) → elevated cards (#111828) — very dark, cold blue-black |
| Accent energy | Vivid violet (#8b5cf6) + electric cyan (#22d3ee) — high-contrast duo-tone  |
| Motion style  | Spring physics, stagger reveals, lift-on-hover; never abrupt or janky       |
| Typography    | Syne (bold display) + Inter (precise body) — size range 12px–88px           |
| Density       | Spacious hero → dense feature grid → comfortable cert cards                 |
| Metaphor      | Launching pad. Students arrive, see the platform's power, feel compelled to start |

---

## 2 · Color Palette

### Surfaces (darkest to lightest)

| Token               | Hex       | Role                                      |
|---------------------|-----------|-------------------------------------------|
| `surface`           | `#06080f` | Page background — deep space void         |
| `surface.raised`    | `#090b1e` | Seconday background sections              |
| `surface.soft`      | `#0d1120` | Sidebar, alt sections                     |
| `surface.card`      | `#111828` | Cards, panels, inputs                     |
| `surface.muted`     | `#1a2337` | Hover state, pressed state                |
| `surface.border`    | `#1f2b45` | Default borders, dividers                 |
| `surface.border-bright` | `#374d6e` | Active borders, focus rings           |

### Brand — Vivid Violet

| Token        | Hex       | Role                                   |
|--------------|-----------|----------------------------------------|
| `brand.400`  | `#a78bfa` | Hover states, light text accents       |
| `brand.500`  | `#8b5cf6` | Primary brand, CTAs, active UI         |
| `brand.600`  | `#7c3aed` | Pressed state, CTA hover               |
| `brand.700`  | `#6d28d9` | Dark pressed, shadow-glow source       |

### Neon Accents (sparingly — max 2 per screen)

| Token          | Hex       | Role                                      |
|----------------|-----------|-------------------------------------------|
| `neon.cyan`    | `#22d3ee` | Data highlights, charts, secondary CTAs   |
| `neon.violet`  | `#a78bfa` | Text gradient endpoint, glow effects      |
| `neon.amber`   | `#fbbf24` | Achievements, Pro badge, gold rewards     |
| `neon.rose`    | `#fb7185` | Danger, wrong answers, error states       |
| `neon.emerald` | `#34d399` | Success, correct answers, pass indicators |

### Semantic

| Token           | Hex       | Usage                              |
|-----------------|-----------|------------------------------------|
| `success.500`   | `#10b981` | Success badges, passing scores     |
| `warning.500`   | `#f59e0b` | Warnings, near-limit indicators    |
| `danger.500`    | `#ef4444` | Errors, failing scores, alerts     |

### Text

| Role              | Value       | Usage                             |
|-------------------|-------------|-----------------------------------|
| Primary text      | `#f1f5f9`   | Headings, critical body           |
| Secondary text    | `#94a3b8`   | Descriptions, meta               |
| Tertiary text     | `#64748b`   | Timestamps, disabled, captions   |
| Accent text       | `#a78bfa`   | Brand mentions, highlighted text  |

---

## 3 · Typography Rules

### Font Stack

| Family | Use case              | Weights   |
|--------|-----------------------|-----------|
| Syne   | Display headings, brand name | 600, 700, 800 |
| Inter  | Body, UI, labels, buttons | 400, 500, 600, 700 |

**Load via Google Fonts:**
```
Inter:wght@400;500;600;700;800 + Syne:wght@600;700;800
```

### Type Scale (Syne for display levels, Inter for rest)

| Level         | Size   | Weight | Height | Tracking  | Family | Usage                       |
|---------------|--------|--------|--------|-----------|--------|-----------------------------|
| Display Hero  | 80–88px | 800  | 0.9    | -4px      | Syne   | Landing hero headline       |
| Display Large | 56–64px | 700  | 0.95   | -3px      | Syne   | Section hero titles         |
| Section Title | 36–42px | 700  | 1.0    | -1.5px    | Syne   | Feature section headings    |
| Card Title    | 20–24px | 600  | 1.2    | -0.5px    | Syne   | Card headings               |
| Body Large    | 18–20px | 400  | 1.6    | -0.2px    | Inter  | Hero subheading             |
| Body          | 15–16px | 400  | 1.5    | 0         | Inter  | Standard body text          |
| Label         | 13–14px | 500  | 1.4    | +0.2px    | Inter  | UI labels, badges           |
| Caption       | 11–12px | 500  | 1.4    | +0.4px    | Inter  | Metadata, timestamps        |

### Text Gradients

```css
/* Brand aurora gradient — main hero accent */
.text-gradient-aurora {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 40%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Legacy brand gradient (kept for backward compat) */
.text-gradient-brand {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 4 · Component Styling

### Buttons

```
┌─ PRIMARY ──────────────────────────────────────────────┐
│  bg-brand-600  →  hover:bg-brand-500  →  active:scale(0.97)  │
│  text-white  font-semibold  text-sm                         │
│  py-2.5 px-5  rounded-xl  shadow-glow-brand on hover         │
└────────────────────────────────────────────────────────┘

┌─ GHOST ────────────────────────────────────────────────┐
│  bg-transparent  border border-surface-border           │
│  hover:bg-surface-muted  hover:border-surface-border-bright  │
│  text-slate-300  font-medium  text-sm                   │
└────────────────────────────────────────────────────────┘

┌─ NEON CTA ─────────────────────────────────────────────┐
│  bg-brand-600  with glow effect  ring-1 ring-brand-500/30  │
│  hover:ring-brand-400/50  hover:shadow-glow-brand       │
│  transform transition-all duration-200                  │
└────────────────────────────────────────────────────────┘
```

**All buttons:** `transition-all duration-200` + `active:scale-[0.97]` micro-interaction.  
**Focus:** `focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface`

### Cards

```
┌─ FEATURE CARD ──────────────────────────────────────────┐
│  bg-surface-card                                         │
│  border border-surface-border                            │
│  rounded-2xl  p-6                                        │
│  hover:border-[accent-color]/40                          │
│  hover:-translate-y-1  hover:shadow-card-hover           │
│  transition-all duration-300                             │
└─────────────────────────────────────────────────────────┘

┌─ CERT CARD ─────────────────────────────────────────────┐
│  bg-gradient-to-br from-[color]/8 to-transparent         │
│  border border-[color]/25  hover:border-[color]/50       │
│  rounded-2xl  p-6                                        │
│  hover:-translate-y-1  hover:shadow-lg                   │
└─────────────────────────────────────────────────────────┘
```

### Badges / Chips

```
Available:    bg-emerald-500/15  text-emerald-400  border-emerald-500/20
Coming soon:  bg-slate-500/15   text-slate-400    border-slate-500/20
Pro:          bg-amber-500/15   text-amber-400    border-amber-500/30
New:          bg-cyan-500/15    text-cyan-400     border-cyan-500/20
```

### Inputs

```css
input {
  bg-surface-card;
  border: 1px solid surface-border;
  color: slate-100;
  rounded-xl;
  focus: ring-2 ring-brand-500/40 border-brand-500/60;
  placeholder: text-slate-500;
  transition: border-color 200ms, box-shadow 200ms;
}
```

### Navigation

- Sticky top-0 with `backdrop-blur-md bg-surface/80 border-b border-surface-border`
- Logo: Syne 600, gradient text (violet→cyan)
- Nav links: `text-slate-400 hover:text-slate-200 transition-colors`
- CTA button: primary style, size sm

---

## 5 · Layout Principles

### Grid System
- Max content width: `max-w-6xl` (hero, features, certs) 
- Narrow content: `max-w-3xl` (single-column text sections)
- Grid: 12-column (use 3-col or 2-col for features/certs)
- Gutter: 24px (gap-6)
- Page padding: `px-4 sm:px-6 lg:px-8`

### Spacing Scale (8px base)
```
4px   → micro gaps (icon-to-text)
8px   → tight groups
12px  → form element internals
16px  → card padding inner
24px  → card padding, section internal
32px  → between cards
40px  → section sub-spacing
56px  → between major sections
80px  → section top/bottom padding
120px → hero top/bottom
```

### Section Structure
- Hero: `py-24 sm:py-32 md:py-40` — TALL and dramatic
- Features: `py-20`
- Certs: `py-16`
- CTA: `py-20`

---

## 6 · Depth & Elevation

| Level | Shadow                                                  | Use case           |
|-------|---------------------------------------------------------|--------------------|
| 0     | none                                                    | Base surfaces       |
| 1     | `0 1px 3px rgba(0,0,0,0.4)`                             | Subtle lift         |
| 2     | `0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)` | Cards              |
| 3     | `0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)` | Elevated, hover     |
| Glow  | `0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.15)` | CTAs, active |

### Glass Morphism
```css
.glass {
  background: rgba(17, 24, 40, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(31, 43, 69, 0.8);
}
.glass-bright {
  background: rgba(17, 24, 40, 0.8);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(139, 92, 246, 0.2);
}
```

---

## 7 · Motion & Micro-interactions

### Principles
- **Spring physics** for hover transforms: `type: "spring", stiffness: 400, damping: 25`
- **Stagger reveals** on list items: each child +80ms
- **Scroll-triggered** entries: `whileInView` with `once: true` and 15–20% threshold
- **Page transitions**: 400ms fade-up (`opacity: 0, y: 20 → opacity: 1, y: 0`)

### Standard Micro-interactions
```jsx
// Hover lift (cards, buttons)
whileHover={{ y: -4, scale: 1.01 }}
whileTap={{ scale: 0.97 }}
transition={{ type: "spring", stiffness: 400, damping: 25 }}

// Entrance animation
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}

// Staggered list
// Parent: staggerChildren: 0.08
// Children: inherit
```

### Background Animations
- **Aurora blobs**: 3 large colored circles, `blur-3xl`, slow float (10–14s)
- **Float keyframe**: `translateY(0) → translateY(-14px) → translateY(0)` easing
- Colors: blob1 `#7c3aed/15%`, blob2 `#06b6d4/10%`, blob3 `#c084fc/8%`

---

## 8 · Responsive Behavior

| Breakpoint | Width  | Changes                                |
|------------|--------|----------------------------------------|
| base (xs)  | <640px | Hero h1 48px, single-col layout        |
| sm         | 640px  | Hero h1 64px, 2-col cert cards         |
| md         | 768px  | Hero h1 72px, 3-col features           |
| lg         | 1024px | Hero h1 80px, max-w-6xl unlocked       |
| xl         | 1280px | Full hero centered, comfortable gutters |

**Touch targets:** Minimum 44px height for all interactive elements.  
**Cert cards:** Single col on mobile, 2-col on sm+.  
**Feature cards:** Single col on mobile, 3-col on md+.  
**Nav:** Collapse to icon-only or hamburger below sm.

---

## 9 · Do's and Don'ts

### ✅ Do's
- Use Syne for any heading that needs impact — display sizes especially
- Layer depth: blob bg → grid overlay → cards → interactive elements
- Add micro-interactions to EVERY clickable element (hover lift, tap scale)
- Use gradient text (text-gradient-aurora) for the most important brand words
- Keep background Aurora blobs at ≤15% opacity — they accent, don't dominate
- Use `whileInView` for below-the-fold sections — reward the scroll
- Add `transition-all duration-200` to every interactive element by default

### ❌ Don'ts
- Don't use flat solid indigo `#6366f1` as accent (too murky on dark surfaces)
- Don't use `bg-white` or `bg-gray-*` — this is a dark-first design system
- Don't use more than 2 neon accent colors on the same screen section
- Don't animate text body paragraphs — only headlines and containers
- Don't use `border-radius: 4px` on important cards — minimum `rounded-xl` (12px)
- Don't add shadows without depth context — shadows imply elevation
- Don't use `font-display` for body text or captions

---

## 10 · Agent Prompt Guide

### Quick color reference for prompts
```
Background:    #06080f (void black-blue)
Card surface:  #111828 (dark navy card)
Primary brand: #8b5cf6 (vivid violet)
Hover brand:   #a78bfa (lighter violet)
Cyan accent:   #22d3ee (electric cyan)
Gold reward:   #fbbf24 (amber achievement)
Body text:     #94a3b8 (slate-400)
Heading text:  #f1f5f9 (slate-100)
Success:       #34d399 (emerald green)
Danger:        #fb7185 (rose red)
```

### Ready-to-use prompts
```
"Build a feature card using DESIGN.md: dark card bg-surface-card, rounded-2xl,
gradient icon in top-left, Syne card title, Inter description, hover lift -4px,
border transitions to the card's accent color on hover."

"Build a hero section using DESIGN.md: full-viewport, aurora blob background,
massive Syne 800 headline with text-gradient-aurora on the key word, Inter
subheading text-slate-300, two CTAs (primary + ghost), platform stats row below."

"Build a navigation using DESIGN.md: sticky glass-morphism header, CertZen logo
in Syne with gradient text, ghost nav links, primary CTA button right-aligned."
```
