---
name: "Autonomy Insurance"
description: "Warm, editorial, human-first life insurance design system pairing Mapúa Red and Gold with generous Warm White space, oversized grotesk headlines, and a signature pixel-mosaic motif."
---

## Overview

Autonomy Insurance makes life insurance feel approachable, human, and transparent. Built around a warm editorial aesthetic, it pairs oversized, tightly tracked headlines with generous Warm White (`#FAF7F2`) breathing room, tactile pill-shaped controls, and friendly 16–32px rounded cards.

- **Brand Personality:** Confident, playful, jargon-free, and deeply human. Every interaction reinforces that real licensed agents are one tap away—assisted, never replaced, by AI.
- **Signature Motif:** A pixel-mosaic of small Mapúa Red (`#D52B1E`), Mapúa Gold (`#F2B705`), Light Gray (`#D9D9DA`), and Pure White (`#FFFFFF`) squares that fades and disperses at section edges, behind hero artwork, and inside loading or empty states.
- **Role Hierarchy Consistency:** Web and mobile share one visual language across Client, Agent, Manager, and Admin views.

## Colors

The palette preserves the exact Mapúa University brand colors, anchored on Warm White (`#FAF7F2`) and Pure White (`#FFFFFF`) surfaces so red and gold act as high-energy accents rather than overwhelming the page.

- **Mapúa Red (`#D52B1E`) & Deep Red (`#A81F16`):** Primary CTAs, active navigation states, live agent indicators, and hover/pressed gradients.
- **Mapúa Gold (`#F2B705`):** Rewards milestones, highlight stickers, step badges, and celebratory accents paired with deep dark text (`#251A00`) for crisp legibility.
- **Charcoal (`#4B4B4D`) & Neutrals:** Headlines, body copy, and dark closing bands, supported by Light Gray (`#D9D9DA`) borders and Mid Gray (`#8A8B8D`) icons.

```yaml
colors:
  mapua-red: "#D52B1E"
  deep-red: "#A81F16"
  mapua-gold: "#F2B705"
  charcoal: "#4B4B4D"
  mid-gray: "#8A8B8D"
  light-gray: "#D9D9DA"
  warm-white: "#FAF7F2"
  pure-white: "#FFFFFF"
  primary: "#D52B1E"
  on-primary: "#FFFFFF"
  primary-hover: "#A81F16"
  primary-container: "#FFEDEA"
  on-primary-container: "#410000"
  secondary: "#F2B705"
  on-secondary: "#251A00"
  secondary-container: "#FFEFD4"
  on-secondary-container: "#3F2E00"
  surface: "#FAF7F2"
  on-surface: "#4B4B4D"
  on-surface-strong: "#1B1B1D"
  on-surface-muted: "#5E5E60"
  surface-card: "#FFFFFF"
  surface-dark: "#4B4B4D"
  on-surface-dark: "#FAF7F2"
  outline: "#D9D9DA"
  success: "#15803D"
  on-success: "#FFFFFF"
  warning: "#B45309"
  on-warning: "#FFFFFF"
  error: "#BA1A1A"
  on-error: "#FFFFFF"
```

## Typography

**Hanken Grotesk** drives oversized editorial headlines and giant stat numerals with tight negative tracking, while **DM Sans** handles all UI controls, chat messages, and body copy. **DM Mono** renders policy IDs, timestamps, and live tabular counters.

```yaml
typography:
  display-xl:
    fontFamily: "Hanken Grotesk"
    fontSize: 84px
    fontWeight: 800
    lineHeight: 84px
    letterSpacing: -3.2px
  display-xl-mobile:
    fontFamily: "Hanken Grotesk"
    fontSize: 32px
    fontWeight: 800
    lineHeight: 36px
    letterSpacing: -1.0px
  display-lg:
    fontFamily: "Hanken Grotesk"
    fontSize: 64px
    fontWeight: 800
    lineHeight: 68px
    letterSpacing: -2.4px
  display-lg-mobile:
    fontFamily: "Hanken Grotesk"
    fontSize: 30px
    fontWeight: 800
    lineHeight: 34px
    letterSpacing: -0.8px
  display-md:
    fontFamily: "Hanken Grotesk"
    fontSize: 48px
    fontWeight: 800
    lineHeight: 52px
    letterSpacing: -1.6px
  display-md-mobile:
    fontFamily: "Hanken Grotesk"
    fontSize: 28px
    fontWeight: 800
    lineHeight: 32px
    letterSpacing: -0.6px
  headline-lg:
    fontFamily: "Hanken Grotesk"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 42px
    letterSpacing: -1.0px
  headline-lg-mobile:
    fontFamily: "Hanken Grotesk"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 28px
    letterSpacing: -0.5px
  headline-md:
    fontFamily: "Hanken Grotesk"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 30px
    letterSpacing: -0.4px
  title-lg:
    fontFamily: "DM Sans"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 26px
    letterSpacing: -0.2px
  title-md:
    fontFamily: "DM Sans"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 22px
    letterSpacing: 0px
  body-lg:
    fontFamily: "DM Sans"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: 0px
  body-md:
    fontFamily: "DM Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  body-sm:
    fontFamily: "DM Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-lg:
    fontFamily: "DM Sans"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: "DM Sans"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.4px
  mono-md:
    fontFamily: "DM Mono"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
```

## Layout & Spacing

Desktop marketing and web views use a **12-column Fixed-Max-Width Grid** (`1440px` web frame, `1280px` content container) with generous section padding (`64px`) and `24px` gutters. Mobile app views (`390 × 844` frame) use a **Fluid Single-Column Grid** with `16px` horizontal margins and `16px` card gutters on an `8px` spacing base (`8, 16, 24, 32`).

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 64px
  section-lg: 96px
  page-margin: 24px
```

## Elevation & Depth

Hierarchy relies on **tonal contrast** between Warm White (`#FAF7F2`) page grounds, Pure White (`#FFFFFF`) elevated cards, and Charcoal (`#4B4B4D`) feature bands, paired with crisp `1px` Light Gray (`#D9D9DA`) borders and soft, warm-tinted hover shadows (`0 12px 32px rgba(75, 75, 77, 0.08)`). Overlapping sticker illustrations break card edges deliberately to create playful physical depth without heavy drop shadows.

## Shapes

Generous, friendly curvature defines every surface: `16px` rounded corners on cards, `24px`–`32px` on large panels, bento tiles, and chat containers, and `9999px` pill geometry on all primary buttons, status chips, and navigation pills.

```yaml
rounded:
  sm: 8px
  DEFAULT: 16px
  md: 20px
  lg: 24px
  xl: 32px
  full: 9999px
```

## Motion & Micro-interaction

Motion feels springy, editorial, and responsive. Card hover lifts, slider-driven premium updates, and chat message sends resolve cleanly with `transform` and `opacity` transitions. Continuous marquee tickers and rotating hero phrases keep the landing page alive while honoring `prefers-reduced-motion`.

```yaml
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  card-lift:
    duration: 240ms
    delay: 0ms
    timingFunction: cubic-bezier(0.22, 1, 0.36, 1)
  surface-enter:
    duration: 320ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 180ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Tone of Voice:** Warm, plain-spoken, and reassuring. Say "Chat with Maya, your agent" instead of "Initiate agent communication protocol." Avoid legalese and actuarial jargon.
- **Capitalisation:** Sentence case for headings, questions, and buttons; uppercase only for compact `12px` category tags when paired with ample tracking.
- **Action Labels:** Outcome-driven verbs (`Start Chat with Agent`, `Calculate My Estimate`, `Claim Step Bonus`).
- **Numbers & Currency:** Use Philippine peso (`₱`) and format coverage and premiums clearly with `tabular-nums` (e.g., `₱2,000,000`, `₱1,850/mo`).
- **Sample Data:** Use consistent sample records only—clients **Elena Rostova** and **Leo Mendoza**, agent **Maya Santos**, policy `#INS-4829` ("20-Year Term Life ₱2M"), and claim IDs such as `#CLM-1042`.

## Navigation & Accessibility

- **Web Top Bar (Client):** `Home`, `Chat`, `Estimate`, `Claims`, `Profile`.
- **Web Top Bar (Agent):** `Clients`, `Estimates`, `Chats`, `Claims`.
- **Mobile Bottom Tab Bar:** `Home`, `Chat`, `Estimate`, `Claims`, `Profile`.
- **Accessibility:** Minimum `44px` touch targets, WCAG AA text contrast (`#1B1B1D` / `#4B4B4D` / `#5E5E60` on light grounds), visible keyboard focus rings, and explicit visible feedback (toast or status chip) for every user action.

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Accordion** → `@components/accordion.html`: `accordion-single`, `accordion-group`
- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Input Field** → `@components/input-field.html`: `input-field-text`, `input-field-icon`
