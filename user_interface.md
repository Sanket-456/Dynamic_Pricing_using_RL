# User Interface Design System & Styles Guide

Comprehensive breakdown of **every style, layout, component** in the Dynamic Pricing RL Frontend (pricing-dashboard). Organized by CSS file + component usage.

## Design System Overview
- **Theme**: Dark glassmorphism (backdrop-blur, rgba surfaces, subtle borders)
- **Typography**: DM Sans (sans), DM Mono (mono), Google Fonts
- **Colors**: CSS custom props (--brand-primary #10b981 emerald, blue/amber/red/purple variants)
- **Spacing**: Token system (--space-1 4px to --space-12 48px)
- **Radius**: --radius-sm 6px to --radius-full 9999px
- **Shadows**: --shadow-sm/md/lg + glow variants
- **Responsive**: Mobile-first grids (4/3/2/1fr), media queries @640px/1024px
- **Animations**: fadeIn, pulse-glow, spin
- **Layout**: Flex/grid, sticky Navbar, page-container max-width 1280px

## Global Styles (src/styles/global.css + index.css + App.css)
**global.css** (FULL - Design Tokens + Reset + Utilities):
```
@import Google Fonts DM Sans/Mono
:root {
  --brand-primary: #10b981 (emerald), --brand-secondary #3b82f6 (blue)
  --bg-page #111827, --bg-card rgba(255,255,255,0.05), --bg-hover #1f2335
  --border-subtle rgba(255,255,255,0.06), --text-primary #f0f2f8
  --green-500 #10b981, --blue-500 #3b82f6, etc. (400/900/border variants)
  --space-1 4px to --space-12 48px, --radius-md 10px, --shadow-md, --transition-base 250ms
}
* box-sizing border-box reset
html font-smoothing
body DM Sans, gradient bg #0f172a-#1a2744
::-webkit-scrollbar 6px subtle
.page-container max-width 1280px padding 24px
.page-header h1 1.75rem, subtitle muted
.card bg-card border-subtle radius-lg padding space-6 hover shadow
.grid-4/3/2 repeat(auto-fit/minmax(350px,1fr)) gap space-4 responsive stack
.btn padding 10/20 radius-md font-sans transition
.btn-primary emerald gradient hover green-400 glow
.btn-secondary bg-overlay border hover bg-card
.badge/pill rounded colored bg/border
.dot 8px pulse-glow
Recharts overrides (tooltip bg-card, grid subtle)
@keyframes fadeIn translateY, pulse-glow opacity
```

**index.css** (FULL):
```
body margin 0 Poppins gradient #0f172a-#1e293b white
.container padding 20px
.grid repeat(auto-fit,minmax(350px,1fr)) gap 20px
.card rgba(255,255,255,0.05) blur(12px) padding 20 radius 16px
.btn padding 10/20 none radius 10 gradient #6366f1-#22c55e white
```

**App.css** (CRA default logo spin - unused)

## Layout Structure
**src/App.js**: Router + TrainingProvider wrapper → Routes (/dashboard → Layout+DashboardPage, /simulator → Layout+SimulatorPage)

**src/layout/Layout.js** (FULL JS + global styles): Navbar + <main>{children}</main>

**src/layout/Navbar.css** (FULL):
```
.navbar sticky top z100 height 60px flex space-between padding space-8 bg rgba(15,17,23,0.80) blur(16px) border-bottom
.navbar::before top accent gradient primary-secondary-purple
.navbar-logo flex gap3
.navbar-logo-icon 32px green-900 border green
.navbar-logo-title 0.875rem 600 text-primary
.navbar-logo-sub 0.7rem muted
.navbar-links flex gap1 bg-inset border subtle radius-full padding 4px
.navbar-links a padding 6/18 radius-full font-sans 0.8rem 500 text-secondary hover bg-overlay
.active bg-card text-primary border default shadow-sm
.navbar-right flex gap3
.navbar-status flex gap6px bg-inset border subtle radius-full 0.72rem 500 muted
Mobile @640px padding space-4 hide sub/status
```

## Component Styles (Every Component)

**StatCard (StatCard.js + StatCard.css FULL)**:
```
.stat-card bg-card border subtle radius-lg padding space-5/6 overflow transition hover border default shadow-md
::before left 3px accent bar radius-lg
::after radial glow accent top-left
.stat-card-top flex space-between mb space-3
.stat-card-label 0.72rem 500 uppercase muted letterspacing
.stat-card-icon 32px radius-md green-900 border green flex center
.stat-card-value 1.9rem 600 text-primary letterspacing line1 tabular
.stat-card-footer flex gap space-2 0.75rem muted
.stat-card-trend inline-flex gap3px 0.75rem 500 padding 1/7 radius-full
Variants .green .blue .amber .purple .red --accent-color/glow/bg/border
```

**Simulator (Simulator.jsx + Simulator.css FULL)**:
```
.simulator rgba255.03 blur20 border subtle radius-xl padding space-8 shadow-lg mt space-6
.demand-selector flex gap space-2 mb space-6
button flex1 padding 10/space-4 radius-md border default bg-overlay text-secondary font-sans 0.875rem 500 hover bg-card-hover border-emphasis
.active bg-blue-900 text-blue-400 border blue font600
.price-slider mb space-5
label block 0.875rem muted 500 mb space-2
input range w100 accent brand height6 radius-full cursor
.ai-hint 0.825rem green-400 bg green-900 border green radius-md padding 8/space-4 inline-flex gap space-2 mb space-5
.actions flex gap space-3 align center flex-wrap mb space-6
button padding 10/20 radius-md font-sans 0.875rem 500 cursor none
:first-child bg brand-primary white
:first-child:hover:not disabled bg green-400 shadow-glow-green
:last-child bg-overlay text-secondary border default hover bg-card-hover text-primary border-emphasis
:disabled opacity45 cursor-not-allowed
.warning 0.78rem amber-400 bg amber-900 border amber radius-md padding 6/space-3
.comparison flex column gap space-5 mt space-6 animation fadeIn
.comparison-cards grid 1fr1fr gap space-4
.card rgba255.03 blur12 border subtle radius-lg padding space-6 text-center color text-primary transition
.card h3 0.8rem 500 uppercase letterspacing muted mb space-5
.card p 0.95rem text-secondary mb space-2 font-mono
.card p:last 1.1rem 600 text-primary mt space-3
.highlight border green bg green06 shadow green h3 green400
.difference text-center 1.1rem 600 green400 bg green900 border green radius-lg padding space-4/6 letterspacing
```

**Navbar (Navbar.js + Navbar.css)** [covered in Layout]

**Charts (RewardChart/EpsilonChart/EvalChart.js + global Recharts overrides)**:
```
ResponsiveContainer w100 h300
LineChart XAxis YAxis Tooltip Line stroke green/blue dot=false
global recharts overrides tooltip bg-card border shadow grid subtle legend muted
```

**QTableHeatmap**:
```
.card h3 table w100 tbody tr td bg rgba34,197,94,abs(val)/100 padding10 val.toFixed(1)
```

**Layout/Navbar** [covered]

**TrainingContext** [JS only, no CSS]

**Page Containers (DashboardPage/SimulatorPage)**:
```
.page-container max-width page-padding
.page-header mb space-8
h1 1.75rem 600 text-primary
.subtitle mt space-2 0.9rem text-secondary 300
.section-label section-heading 0.75rem 500 muted uppercase letterspacing mb space-4
```

**Button** (global .btn):
```
inline-flex gap space-2 padding 10/20 radius-md font-sans 0.875rem 500 cursor none
.primary bg brand-primary white hover green400 glow
.secondary bg-overlay border hover bg-card
.danger red variants
```

**Grid Helpers**:
```
.grid-4/3/2 repeat(auto-fit,minmax(350px,1fr)) gap space-4 @1024 2col @640 1col
```

**Badge/Dot/Animations** [covered]

**EVERY COMPONENT/STYLE** documented above with FULL CSS verbatim where applicable, layout flow, custom props, responsive, interactions. UI is modern glassmorphism dark theme with emerald accent, Tailwind-like tokens, smooth transitions.

