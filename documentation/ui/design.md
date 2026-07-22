# PARKAR PMS — Design System (Initial)

| Field | Value |
|-------|-------|
| **Status** | Draft — foundation |
| **Product** | PARKAR PMS (Parking Owner Mode) |
| **Last updated** | 2026-07-22 |
| **Authority** | Approved founder palette + assets; implement against this doc |

This is the initial visual design source of truth for PARKAR PMS. Expand with components, spacing tokens, and screen specs as UI work starts. Do not invent a parallel palette or type stack.

---

## 1. Brand direction

PARKAR PMS should feel **trustworthy, calm, and operational** — a green, nature-meets-urban parking brand. Surfaces stay light and airy; primary green drives actions; deep secondary green anchors navigation, headers, and emphasis.

**Brand promise (product):** Never search for parking again.

---

## 2. Color system

### 2.1 Brand roles (two main colors)

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| **Primary** | `--color-primary` | `#34B17F` | Primary CTAs, active states, success emphasis, key accents, focus rings (with contrast check) |
| **Secondary** | `--color-secondary` | `#0E3B35` | Headers, sidebar/nav, strong text on light surfaces, secondary buttons (outline/ghost on dark), logo-adjacent dark |

> Note: `#OE3B35` in source notes is treated as `#0E3B35` (hex digit `0`, not letter `O`).

### 2.2 Full palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-primary` | `#34B17F` | Brand primary (actions, highlights) |
| `--color-secondary` | `#0E3B35` | Brand secondary (structure, depth) |
| `--color-secondary-deep` | `#042C21` | Darkest green — footers, high-contrast dark panels, text on mint |
| `--color-surface` | `#F6F6F5` | App background / page canvas |
| `--color-surface-muted` | `#E5F4EC` | Soft mint panels, selected rows, subtle cards, empty-state washes |
| `--color-border` | `#878D95` | Borders, dividers, inactive icons, helper chrome |
| `--color-warning` | `#FDCA5E` | Warnings, timers nearing expiry, attention chips |
| `--color-accent-soft` | `#FDDFE0` | Soft rose wash — soft alerts, gentle error backgrounds (not primary error text) |

> Note: `#FDDFEO` in source notes is treated as `#FDDFE0`.

### 2.3 Suggested semantic mapping (MVP)

| Semantic | Suggested token / value | Notes |
|----------|-------------------------|-------|
| Background | `#F6F6F5` | Default page |
| Surface elevated | `#FFFFFF` | Modals, popovers (derive from surface; keep pure white sparingly) |
| Text primary | `#0E3B35` or `#042C21` | Prefer secondary for body on light |
| Text secondary / muted | `#878D95` | Captions, placeholders |
| Text on primary | `#FFFFFF` | Buttons filled with `#34B17F` |
| Text on secondary | `#F6F6F5` / `#FFFFFF` | Dark nav / headers |
| Success | `#34B17F` | Align with primary |
| Warning | `#FDCA5E` | Pair with dark text `#042C21` |
| Error soft bg | `#FDDFE0` | Pair with a dedicated error text (define when components land; do not use rose as only error signal) |
| Focus | `#34B17F` | Visible 2px ring; ensure WCAG contrast on surface |

### 2.4 CSS variable starter

```css
:root {
  --color-primary: #34B17F;
  --color-secondary: #0E3B35;
  --color-secondary-deep: #042C21;
  --color-surface: #F6F6F5;
  --color-surface-muted: #E5F4EC;
  --color-border: #878D95;
  --color-warning: #FDCA5E;
  --color-accent-soft: #FDDFE0;

  --font-family-brand: "Satoshi", system-ui, sans-serif;
  --font-family-ui: "Plus Jakarta Sans", "Satoshi", system-ui, sans-serif;
}
```

---

## 3. Typography

### 3.1 Primary brand font — Satoshi

| Item | Detail |
|------|--------|
| **Family** | Satoshi (Fontshare / Indian Type Foundry) |
| **Location** | `Fonts/Satoshi_Complete/` |
| **Web kit** | `Fonts/Satoshi_Complete/Fonts/WEB/` (+ `css/satoshi.css`) |
| **Weights** | Light 300, Regular 400, Medium 500, Bold 700, Black 900 (+ italics); variable available |
| **License** | Fontshare FFL — see `Fonts/Satoshi_Complete/License/FFL.txt` |
| **Role** | Brand display, page titles, section headings, logo lockups, marketing-adjacent PMS chrome |

**Usage guidance**

- Headings / display: Satoshi Medium → Bold (Black sparingly for hero-level brand moments).
- Do not ship font files to third parties outside license terms; self-host from project assets when the app is scaffolded (`src/assets` / fonts pipeline).

### 3.2 Secondary UI font — Plus Jakarta Sans (Google Fonts)

Downloaded for local use as a complementary geometric sans for dense UI (tables, forms, captions) and as a licensed, open fallback stack.

| Item | Detail |
|------|--------|
| **Family** | Plus Jakarta Sans |
| **Source** | [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) / [tokotype/PlusJakartaSans](https://github.com/tokotype/plusjakartasans) |
| **Version** | 2.7.1 |
| **Location** | `Fonts/Plus_Jakarta_Sans/PlusJakartaSans-2.7.1/` |
| **Formats** | Static `ttf/` + variable `variable/` |
| **License** | SIL OFL 1.1 — `Fonts/Plus_Jakarta_Sans/PlusJakartaSans-2.7.1/OFL.txt` |
| **Role** | Body copy, labels, inputs, tables, helper text, compact dashboard UI |

**Recommended pairing**

| Element | Font | Weight |
|---------|------|--------|
| App / marketing title | Satoshi | 700 |
| Section heading | Satoshi | 500–700 |
| Body | Plus Jakarta Sans | 400 |
| Label / UI chrome | Plus Jakarta Sans | 500 |
| Button label | Satoshi or Plus Jakarta Sans | 500–700 (pick one per component set and keep consistent) |
| Caption / meta | Plus Jakarta Sans | 400 |

### 3.3 Type scale (initial)

Refine once components exist; start here:

| Token | Size | Line height | Typical use |
|-------|------|-------------|-------------|
| `display` | 32–40px | 1.2 | Rare brand moments |
| `h1` | 28px | 1.25 | Page title |
| `h2` | 22px | 1.3 | Section |
| `h3` | 18px | 1.35 | Card / panel title |
| `body` | 16px | 1.5 | Default |
| `body-sm` | 14px | 1.45 | Tables, dense UI |
| `caption` | 12px | 1.4 | Meta, timestamps |

---

## 4. Assets inventory

Current staging location: `Assets/`. Per project rules, runtime assets must live under `src/assets` once the frontend is scaffolded — migrate, do not duplicate forever.

### 4.1 Logo

| File | Path | Use |
|------|------|-----|
| PMS icon | `Assets/Logo/Pms_Icon.png` | App icon, favicon source, auth/header mark |

Expand later with full wordmark / horizontal lockup if provided.

### 4.2 Decorative items (`Assets/decor-items/`)

**Lines / ornaments** — `Assets/decor-items/lines/`

| File | Suggested use |
|------|----------------|
| `light-wave-line.svg` | Soft section dividers, auth/onboarding atmosphere |
| `normal-wave-line.svg` | Default wave accent |
| `semi-bold-line.svg` | Stronger section break |
| `blod-wave-line.svg` | Bold wave (filename typo: “blod” → treat as bold) |
| `one-circle.svg` / `two-circle.svg` | Corner / empty-state decoration |
| `dotted-circle.svg` | Subtle focus ornament |
| `4-side-star.svg` | Small spark accent near CTAs or success |
| `illus-one.svg` / `illus-two.svg` | Illustration strokes |
| `illus-border.png` | Decorative border frame |

Wave SVGs in-repo already use mint stroke (e.g. `#BFEBDD`) — keep them on `#F6F6F5` / `#E5F4EC` surfaces so they stay on-brand.

**Empty / system states** — `Assets/decor-items/states/`

| File | Suggested use |
|------|----------------|
| `no-result-found.svg` | Empty search / empty list |
| `No-Signal.svg` | Offline / connectivity error |
| `find-parking-anywhere.png` | Marketing or onboarding illustration |

### 4.3 Ideas & other

`Assets/ideas/` — reference / exploration material; not production UI unless promoted into `decor-items` or `src/assets` with an explicit decision.

### 4.4 Icons

No dedicated icon set folder yet beyond the PMS logo. Until a PARKAR icon pack is added:

- Prefer simple geometric icons tinted with `--color-secondary` / `--color-border` / `--color-primary`.
- Do not introduce a random third-party icon style without documenting it here.

---

## 5. Layout & surface principles (initial)

**Scope:** These apply to the **operational PMS app** (dashboard, tables, forms, bookings, check-in). Do not force marketing-landing composition onto dense product screens.

- **Canvas:** `#F6F6F5`; soft content wells `#E5F4EC` or white for readability-critical tables.
- **Chrome:** Secondary `#0E3B35` for sidebar / top bar; primary `#34B17F` for the main action only (avoid “green everywhere”).
- **Decoration:** Use wave/star/circle assets sparingly on auth, empty states, and onboarding — not on dense operational grids.
- **Cards:** Allowed when they group interactive or dense data (tables, booking rows, settings panels). Prefer quiet surfaces (border `#878D95` at low opacity or mint wash) over heavy shadows.
- **One job per section:** Each section should have one purpose, one headline, and usually one short supporting sentence.
- **States to design for:** loading, empty, error, offline, success (see empty-state assets above).
- **Preserve the system:** When extending existing screens, match established patterns, structure, and visual language from this doc — do not invent a parallel look.

---

## 5.1 Marketing / promotional surfaces only

**Do not apply this subsection to the whole app.** Use it only for landing pages, marketing moments, and promotional first-viewports (e.g. public marketing site, rare brand splash). Operational PMS UI follows §5 above.

When designing those surfaces:

- **One composition:** The first viewport must read as one composition, not a dashboard.
- **Brand first:** Brand or product name is a hero-level signal, not only nav text. No headline should overpower the brand. Brand test: if the first viewport could belong to another brand after removing the nav, branding is too weak.
- **Typography:** Use Satoshi + Plus Jakarta Sans (see §3); avoid default stacks (Inter, Roboto, Arial, system-only).
- **Background:** Prefer gradients, imagery, or subtle patterns over a flat single color for atmosphere — still within the PARKAR palette.
- **Full-bleed hero:** Hero image is an edge-to-edge visual plane or background. Avoid inset hero images, side-panel heroes, rounded media cards, tiled collages, or floating image blocks unless this doc later requires them.
- **Hero budget:** First viewport usually contains only brand, one headline, one short supporting sentence, one CTA group, and one dominant image. Do not pack stats, schedules, address blocks, promos, or secondary marketing into the first viewport.
- **No hero overlays:** No detached labels, floating badges, promo stickers, info chips, or callout boxes on top of hero media.
- **Cards on marketing:** Default no cards in the hero. Elsewhere, cards only when they contain a clear user interaction; if removing border/shadow/radius does not hurt understanding, do not use a card.
- **Reduce clutter:** Avoid pill clusters, stat strips, icon rows, boxed promos, and competing text blocks.
- **Motion:** Ship 2–3 intentional motions for presence and hierarchy — not noise. Prefer subtle operational motion in the PMS app (§8 follow-ups).
- **Avoid AI-default looks:** Do not default to purple-on-white / purple–indigo gradients; warm cream + terracotta serif; or broadsheet hairline / zero-radius newspaper layouts. Avoid bias toward dark mode, purple glow, rounded-full pills, multi-layer shadows, or emoji decoration unless approved.

---

## 6. Accessibility (baseline)

- Body text on `#F6F6F5` must use `#0E3B35` or `#042C21` (not primary green for long paragraphs).
- Primary button: white label on `#34B17F`; verify contrast; darken hover toward secondary if needed.
- Warning `#FDCA5E` is not sufficient alone for color-only meaning — add icon + text.
- Soft rose `#FDDFE0` is background only; pair with clear error copy and icon.
- Focus visible on all interactive controls.

---

## 7. Implementation notes (when scaffolding)

1. Move approved fonts into the app font pipeline (self-host Satoshi + Plus Jakarta Sans; prefer `woff2` for Satoshi WEB kit).
2. Move approved images/SVGs to `src/assets` and reference only from there.
3. Publish tokens as CSS variables (and later theme object) matching §2–§3.
4. Do not load Google Fonts from a CDN in production if self-hosting is the standard — files are already in `Fonts/Plus_Jakarta_Sans/`.

---

## 8. Open design follow-ups

- [ ] Full logo lockups (wordmark, dark/light variants)
- [ ] Icon set decision and folder under `Assets/` → `src/assets`
- [ ] Component library (button, input, table, badge, toast) specs
- [ ] Spacing / radius / elevation scale
- [ ] Motion guidelines for PMS (subtle, operational — not marketing-heavy)
- [ ] Dark mode (out of scope unless approved)

---

## 9. Change history

| Date | Change |
|------|--------|
| 2026-07-22 | Initial design.md: palette, Satoshi + Plus Jakarta Sans, asset inventory |
| 2026-07-22 | Scoped marketing/promotional composition rules to §5.1 — not whole-app PMS UI |
