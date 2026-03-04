# AGAPE SITE REBUILD — START HERE

> **Read this entire file before doing anything.** This is your design bible and build instructions.

---

## WHO YOU ARE & WHAT YOU'RE DOING

You are building a website for **Agape**, a techno events company. The site is being rebuilt from scratch using Next.js. Your #1 job is to make this site look **as good or better** than https://www.teletech.events/ — a site we studied in depth and consider the gold standard.

**You have powerful design skills installed.** Use them:
- `/frontend-design` — for production-grade, non-generic UI
- `core-3d-animation` — Three.js, GSAP, React Three Fiber, Framer Motion, Babylon.js
- `extended-3d-scroll` — Locomotive Scroll, PixiJS, Barba.js, Vanta effects
- `animation-components` — Anime.js, Lottie, React Spring, Magic UI, AOS
- `authoring-motion` — Rive, Spline, Blender pipeline
- `playwright` — browser testing

**Leverage these skills aggressively.** Don't build generic UI. Every component should feel handcrafted, alive, and immersive.

---

## THE STACK

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4** (via @tailwindcss/postcss)
- **Framer Motion 12** for animations
- **Sanity CMS** for content (schemas: event, release, article, newsCategory, siteSettings)
- **Resend** for email
- **TypeScript**

**Project location:** `/Users/jaredbeguelin/newCode/AGAPE_SITE_REBUILD/agape-site/`
**Old site reference:** `agape_site_old_ref/` (Webflow export)
**Design study guide:** Check your memory at `~/.claude/projects/-Users-jaredbeguelin-newCode-AGAPE-SITE-REBUILD/memory/teletech-design-study.md`

---

## THE DESIGN STANDARD — TELETECH BREAKDOWN

### Design Philosophy
Everything must feel **intentional, immersive, and alive**. No static elements. The site should feel like a living digital organism, not a brochure.

Five pillars:
1. **Dark-first** — darkness makes everything pop
2. **Everything moves** — scroll, hover, mouse input all trigger responses
3. **Analog imperfection** — grain, glitch, flicker give digital content analog soul
4. **Technical aesthetic** — corner brackets, numbered nav, HUD-like UI
5. **Restraint in color** — near-monochrome with rare accent pops for maximum impact

### Color Palette (ENFORCE THIS)
```css
--bg-primary:      #0a0a0a;   /* near-black background */
--bg-secondary:    #111111;   /* slightly lighter sections */
--text-primary:    #f0f0f0;   /* off-white text */
--text-secondary:  #fafafa;   /* brighter white headings */
--text-muted:      #888888;   /* subdued labels */
--border:          #363636;   /* dark grey borders */
--accent-error:    #c13243;   /* red highlights, errors */
```
- NO bright colors in base UI — content images provide color
- NO gradients — use texture and layering
- Neon pops (#ff1493 pink, #1e90ff blue) ONLY for dramatic lighting effects

### Typography
```
Hero:           3–5vw, bold — DOMINATES the viewport
Section heads:  2–3rem, bold
Sub-heads:      1.25–1.5rem, medium
Body:           1rem, regular
Labels:         0.75–0.875rem, uppercase, letter-spacing 0.05–0.1em
Nav items:      uppercase, numbered (01 Events, 02 About, etc.)
```
- Clean sans-serif (Inter, Neue Haas, or similar)
- `-webkit-font-smoothing: antialiased` everywhere
- Sharp, squared edges — NO rounded corners on cards

---

## MANDATORY INTERACTIVE EFFECTS

**This is the #1 priority. These effects are what make the site exceptional. Every single one must be implemented.**

### 1. Text Glitch Effect (HOVER)
On hover, characters randomize rapidly (75ms intervals), then resolve left-to-right.
- Charset: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*`
- Duration: 300–500ms total
- Apply to: nav links, CTAs, card titles, all interactive text
- Build as a reusable `<GlitchText>` component

### 2. Grain/Noise Overlay
- Full-viewport canvas or CSS noise texture
- Opacity: 0.05 desktop, 0.2 mobile
- `pointer-events: none` — never block interactions
- Animated/shifting grain, not a static image

### 3. WebGL Pixel Displacement (MOUSE-REACTIVE)
- Canvas overlay on hero images
- Fragment shader displaces pixels based on mouse position
- Analog TV-style distortion that follows cursor
- Use Three.js / React Three Fiber or lightweight custom canvas
- Organic smeared feel, not a hard circle

### 4. Smooth Scrolling (Lenis)
- Install `lenis` or `@studio-freight/lenis`
- lerp: 0.1, wheelMultiplier: 0.7
- Wrap entire app — every page gets smooth scroll

### 5. Scroll-Triggered Animations
- Elements fade + slide in on viewport entry
- Use clip-path wipe reveals
- Stagger groups: 50–100ms delay between items
- Opacity + transform together, never opacity alone
- Parallax depth on background elements

### 6. Hover Expansion (Cards)
- Desktop: hovered card expands to ~30vw, neighbors compress
- Transition: 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955)
- Text within expanding card also glitch-animates
- Disabled on mobile

### 7. Flicker Animation (CTAs)
- Subtle brightness oscillation via CSS `filter: brightness()`
- "Neon sign" / "CRT monitor" vibe
- Apply to corner decorations and active buttons

### 8. Page Transition / Preloader
- Initial load: scroll locked ~4s
- Coordinated mask animations reveal content
- Expanding/contracting borders + scale transforms
- Use Framer Motion or GSAP timeline

---

## SIGNATURE VISUAL ELEMENTS

### Corner Brackets (THE motif)
```
┌──          ──┐
│   content    │
└──          ──┘
```
- Small L-shaped SVG strokes at each corner
- Positioned absolutely within containers
- Animated stroke-dasharray on scroll reveal
- Apply to: cards, image containers, CTAs, section boundaries
- Build as `<CornerBrackets>` wrapper component

### Dashed Borders
- Between carousel items — dashed, not solid
- Subtle visual separation without heaviness

### Scroll Indicator
- Animated down arrow at bottom of hero
- Glow/highlight effect

---

## COMPONENT ARCHITECTURE

```
src/components/
  effects/
    GrainOverlay.tsx           — Full-page animated grain
    GlitchText.tsx             — Reusable text glitch on hover
    CornerBrackets.tsx         — SVG corner decoration wrapper
    PixelDisplacement.tsx      — WebGL mouse-reactive canvas
    ScrollReveal.tsx           — Intersection-based reveal
    FlickerButton.tsx          — CTA with flicker effect
  layout/
    Navbar.tsx                 — Numbered nav + glitch hover
    Footer.tsx                 — Multi-column footer
    SmoothScroll.tsx           — Lenis provider wrapper
    PageTransition.tsx         — Preloader / page transition
  cards/
    EventCard.tsx              — Event card with all effects
```

---

## ANIMATION TIMING CHEATSHEET

```
Easing:
  Layout shifts:    cubic-bezier(0.455, 0.03, 0.515, 0.955) — 0.8s
  Filter states:    linear — 0.2s
  Nav reveals:      ease — 0.25s (staggered)
  Color transitions: ease — 0.3s

Durations:
  Text glitch:       300–500ms
  Hover transitions: 200–300ms
  Layout expansion:  800ms
  Page preloader:    ~4000ms
  Scroll animations: 600–1000ms

Stagger:
  50–100ms between items, first item immediate
```

---

## RESPONSIVE RULES

```
Mobile:     < 479px
Tablet:     479–767px
Desktop-S:  768–991px
Desktop:    992px+
```

### Mobile:
- Grain opacity increases to 0.2
- Flicker animations disabled
- Carousels become vertical stacked
- Hover expansion disabled
- Hero text: 5.5–6.5vw
- WebGL effects simplified or off
- Swipe replaces click nav

### Tablet:
- Carousels show 2 items (not 3)
- 70–80px slide spacing
- Core animations kept, 3D simplified

---

## SPACING & LAYOUT

```
Section padding:    6–8rem vertical
Card gaps:          1.25rem
Hero:               100vh or close
```
- GENEROUS whitespace everywhere
- Each section = distinct visual block
- Full-bleed backgrounds, contained content
- Modular: hero → narrative → gallery → carousel → CTA → footer

---

## PERFORMANCE

- `will-change` only during active animations
- Prefer `transform` + `opacity` (GPU composited)
- Lazy load images and canvas effects
- IntersectionObserver for scroll triggers
- WebP for all images
- Disable heavy effects on mobile via `matchMedia`
- `pointer-events: none` on all overlays

---

## QUALITY CHECKLIST — EVERY PAGE MUST PASS

- [ ] Dark background (#0a0a0a) + off-white text (#f0f0f0)
- [ ] Grain overlay visible, not blocking clicks
- [ ] Text glitch on all interactive text
- [ ] Lenis smooth scrolling active
- [ ] Scroll-triggered animations on all sections
- [ ] Corner brackets on cards and containers
- [ ] Hero fills viewport with oversized type
- [ ] Mouse-reactive effect on hero/featured images
- [ ] Numbered nav with glitch hover
- [ ] Hover expansion on card rows (desktop)
- [ ] Flicker on CTAs
- [ ] Page transition on load
- [ ] Mobile: grain visible, heavy FX off, vertical layouts
- [ ] Tablet: 2-col carousels, core animations kept
- [ ] Proper easing on all transitions
- [ ] Clear typography hierarchy
- [ ] Generous whitespace
- [ ] Overall: dark, immersive, alive, technical, premium

---

## WHAT NEVER TO DO

- NO bright/colorful UI chrome
- NO generic Bootstrap/Material feel
- NO static anything — everything responds to input
- NO harsh solid borders — use dashed or bracket-style
- NO default browser scroll
- NO basic hover effects (just color swap) — always glitch/expand/transform
- NO gradient backgrounds
- NO rounded corners
- NO stock/template layouts

---

## VISUAL SELF-REVIEW LOOP (MANDATORY)

**After completing any component, section, or page — you MUST visually inspect your own work using Playwright before moving on.**

### The Loop:
```
BUILD → SCREENSHOT → JUDGE → FIX → REPEAT
```

### How it works:
1. **Build** the component/section/page
2. **Start the dev server** (`npm run dev` in the background if not already running)
3. **Use Playwright** to navigate to the page and take screenshots:
   - Full page screenshot
   - Individual section screenshots
   - Mobile viewport screenshot (375px wide)
   - Tablet viewport screenshot (768px wide)
   - Desktop screenshot (1440px wide)
4. **Look at your own screenshots** and judge them against the Teletech standard
5. **Ask yourself these questions honestly:**
   - Does this look as good as teletech.events? Or is it generic?
   - Is the typography bold and architectural enough?
   - Are the interactive effects (glitch, grain, scroll animations) actually working and visible?
   - Does the spacing feel generous and intentional?
   - Do the corner brackets and visual motifs create the HUD/technical feel?
   - Would a user landing on this page feel IMMERSED or just... meh?
   - Is there anything that looks like "default AI slop" or stock template?
6. **If anything fails the vibe check** — fix it immediately before moving on
7. **Take new screenshots** after fixes to confirm improvement
8. **Only move to the next section when the current one passes**

### Screenshot Checklist:
For each screenshot, verify:
- [ ] Dark, immersive atmosphere — not just "dark mode" but genuinely moody
- [ ] Typography has presence and weight — hero text dominates
- [ ] Grain overlay is subtly visible
- [ ] Corner brackets are rendering on cards/containers
- [ ] Spacing is generous, nothing cramped
- [ ] The page does NOT look like a generic Next.js/Tailwind template
- [ ] Colors match the palette (#0a0a0a bg, #f0f0f0 text)
- [ ] On mobile: layout adapts properly, nothing overflows or breaks

### Testing Interactions:
Beyond static screenshots, use Playwright to test:
- Hover over interactive text → verify glitch effect fires
- Scroll down the page → verify scroll animations trigger
- Move mouse over hero → verify pixel displacement responds
- Check that smooth scrolling is active (not native janky scroll)
- Click nav items → verify page transitions work

### Be Brutally Honest:
If your work looks like a standard dark-themed website and NOT like teletech.events, **do not move on.** The bar is "would someone screenshot this and share it because it looks incredible?" If the answer isn't yes, keep iterating.

---

## AGENT TEAM STRATEGY

**Use agent teams to parallelize work and move fast.** You are the team lead. Spin up specialized teammates and coordinate them.

### Team Structure:

```
YOU (Team Lead / Orchestrator)
  │
  ├── effects-engineer (frontend-developer agent)
  │     Builds: GrainOverlay, GlitchText, CornerBrackets,
  │             PixelDisplacement, ScrollReveal, FlickerButton
  │     Focus: All interactive effects, shaders, canvas, animations
  │
  ├── layout-builder (frontend-developer agent)
  │     Builds: Navbar, Footer, SmoothScroll, PageTransition
  │     Focus: Site-wide layout, navigation, page structure
  │
  ├── page-builder (frontend-developer agent)
  │     Builds: Homepage sections, event pages, about page, etc.
  │     Focus: Assembling pages using the effects + layout components
  │     Depends on: effects-engineer and layout-builder finishing first
  │
  └── qa-reviewer (general-purpose agent)
        Runs: Playwright visual self-review loop
        Focus: Screenshots, vibe checks, interaction testing
        Takes screenshots at 375px, 768px, 1440px
        Compares against Teletech standard
        Files issues back to the relevant builder
```

### How to Launch:

1. **Create the team:**
   ```
   TeamCreate → team_name: "agape-build"
   ```

2. **Create tasks with TaskCreate** for each piece of work, organized by dependency:
   - Phase 1 (parallel): Effects components + Layout components
   - Phase 2 (after Phase 1): Page building — assembles components into pages
   - Phase 3 (after each page): QA visual review loop

3. **Spawn teammates with the Agent tool:**
   - Use `subagent_type: "frontend-developer"` for builders
   - Use `subagent_type: "general-purpose"` for QA
   - Set `team_name: "agape-build"` on each
   - Give each agent a `name` matching the role above

4. **Assign tasks** via TaskUpdate with `owner` set to the teammate name

5. **Coordinate dependencies:**
   - `page-builder` is blocked by `effects-engineer` and `layout-builder`
   - `qa-reviewer` runs after each page is built
   - Use `addBlockedBy` on tasks to enforce ordering

### Task Breakdown Template:

**Phase 1 — Effects (parallel, no dependencies):**
- Task: Build GrainOverlay component
- Task: Build GlitchText component
- Task: Build CornerBrackets component
- Task: Build PixelDisplacement (WebGL mouse-reactive) component
- Task: Build ScrollReveal component
- Task: Build FlickerButton component

**Phase 1 — Layout (parallel with effects):**
- Task: Build SmoothScroll (Lenis) provider
- Task: Build Navbar (numbered, glitch hover)
- Task: Build Footer (multi-column)
- Task: Build PageTransition / preloader

**Phase 2 — Pages (blocked by Phase 1):**
- Task: Build Hero section
- Task: Build About/Narrative section
- Task: Build Events listing/carousel section
- Task: Build full Homepage (compose all sections)
- Task: Build Events page
- Task: Build About page

**Phase 3 — QA (blocked by each page):**
- Task: Visual review Homepage (screenshots + interaction tests)
- Task: Visual review Events page
- Task: Visual review About page
- Task: Mobile/tablet responsive audit

### Rules for Teammates:

Every teammate MUST:
- Read this file (`AGAPE_BUILD_PROMPT.md`) before starting any work
- Read the design study guide in memory
- Use `/frontend-design` skill when building any UI
- Follow the color palette, typography, and animation timing specs exactly
- Build components as client components (`"use client"`) when they use hooks/effects
- Never produce generic-looking output — if it looks like default Tailwind, redo it

### When to Use Teams vs Solo:

- **Use teams** for the initial build sprint — effects, layout, and pages can all be built in parallel
- **Use solo** for small fixes, iterations after QA feedback, and polish work
- **Always use QA agent** after any significant visual change — never skip the screenshot loop

### Communication:

- Team lead (you) coordinates via SendMessage
- Teammates report completion via TaskUpdate (mark tasks completed)
- QA agent sends visual review results back to team lead
- If QA fails a page, team lead assigns fix tasks to the relevant builder
- Use broadcast ONLY for critical blockers — prefer direct messages

---

## HOW TO START

1. Read this file completely
2. Read the detailed study guide: `~/.claude/projects/-Users-jaredbeguelin-newCode-AGAPE-SITE-REBUILD/memory/teletech-design-study.md`
3. Check the old Webflow export in `agape_site_old_ref/` for content/structure reference
4. **Spin up the agent team** (see Agent Team Strategy above)
5. Build the effects system first (GrainOverlay, GlitchText, CornerBrackets, SmoothScroll, ScrollReveal)
6. Build layout in parallel (Navbar, Footer, PageTransition)
7. Then build pages section by section, applying all effects
8. **Run the visual self-review loop after every section** (see above)
9. Test every page against the quality checklist above
10. Use `/frontend-design` skill for every UI component to avoid generic output
11. **Never consider a page done until you've screenshotted it and confirmed it matches the Teletech standard**
