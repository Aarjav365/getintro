# # Community Page Text Updates

I'll help you make those two direct edits to the onboarding-community.jsx file.

**Edit 1

_Started 2026-04-19 13:02 UTC_

---

## User

Get Intro
A smart networking OS — inbound request management + AI-powered introductions in one platform.

Status
Draft
Version
1.0
Product
Get Intro
Problem statement
High-value people — founders, investors, creators, mentors — are overwhelmed by scattered, untracked inbound requests across email, DMs, and LinkedIn. At the same time, ambitious people struggle to get warm introductions to exactly the right person. Cold outreach is noise. There's no product that solves both sides.

Target users
Busy professionals
Founders, investors, creators, advisors who receive high volumes of requests and need a structured way to manage them.
Ambitious networkers
Job seekers, early-stage founders, operators looking for warm intros to the right people.
Community builders
Operators running accelerators, communities, or investment networks who need smart matching at scale.
Core features
🔗
Smart link inbox (SuperDM)
A single shareable URL that surfaces multiple structured request types — call, mentorship, collab, apply, etc. All requests land in one unified inbox with tracking, status, and reply flows.
🤝
AI super connector
Users define who they are and who they want to meet. AI matches them to others on the platform and sends warm introductions via email or native messaging.
📋
Request types & forms
Customisable request categories per user — book a call, pitch me, ask for mentorship, apply to a role. Each type can have its own intake form and screening questions.
📥
Unified inbox
All inbound requests visible in one dashboard, with sender info, request type, status (pending, accepted, declined), and history. No more scattered DMs.

## Assistant

I'll design a high-fidelity interactive prototype for Get Intro. Let me ask some clarifying questions first to make sure I build the right thing.

_[tool: questions_v2]_

## User

Questions answered:
- device: Both — responsive
- primary_surface: Decide for me
- accent_vibe: 2
- aesthetic: Dark mode / premium tool
- content_realism: Realistic, specific names + companies (fictional but plausible)
- tweaks: Accent color, Persona switcher (founder/investor/creator), Density (compact/comfortable), Inbox layout variants, Typography pairing, AI panel style variants, Light/dark mode
- novelty: Lean novel — unusual layouts, unique interactions
- ai_tone: Subtle — AI works in the background, human-first UI
- screens_to_include: Submit a request form, AI super connector setup (define yourself + who you want to meet), Request detail / reply view, AI match suggestions / warm intro draft, Onboarding, Community builder / admin view
- persona_anchor: Decide for me

## Assistant

I have enough to build. Let me lay out my plan and design system, then execute.

**Design system I'll commit to:**
- **Aesthetic**: Dark-mode premium tool. Deep graphite base (`#0b0b0c`), warm off-black surfaces, lime-chartreuse accent (`oklch(0.92 0.2 125)` / `#b8ff3a`) for key actions, muted text hierarchy.
- **Type**: Geist (UI) + Geist Mono (metadata / IDs) as default pairing. Tweak allows swap to Inter+JetBrains Mono and Instrument Serif+Geist.
- **Novelty direction**: 
  - Inbox as a **card-deck triage** view (swipe/stack metaphor) as one variant, plus a dense table variant
  - Public SuperDM link uses a **vertical "request menu"** with handwritten-style rates and turnarounds
  - AI matches shown as a **constellation** of connections with reasoning threads, not a list
  - Request detail opens as a side-rail with **inline reply composer** showing AI-assisted draft
- **Persona**: Maya Chen — ex-Stripe PM now angel investor + advisor. Demonstrates both receiving (deal flow, advice requests) and sending (warm intros).

**Flows to build as clickable prototype:**
1. Onboarding (3 steps)
2. Unified inbox (2 layout variants)
3. Request detail + reply
4. AI super connector setup
5. AI match suggestions + warm intro draft
6. Public SuperDM link + submit form
7. Community builder admin

Let me set up.

_[tool: update_todos]_

_[tool: set_project_title]_

_[tool: write_file]_

Now let me build the data, icons, and main app in smaller files.

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

Now let me build the main screens. I'll split into multiple jsx files to stay lean.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: snip]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built the prototype. Here's what's there:

**Dark-mode premium tool** with lime-chartreuse accent, Geist + Geist Mono. Six flows, all clickable:

- **Onboarding** (3 steps: handle, request types, connector training) — shows first run, replay via Tweaks
- **Inbox** — two variants: dense **List + detail** with AI fit analysis and draft replies, or a **Triage deck** where you swipe through pending requests
- **Request detail** — sender profile, intake fields, AI fit panel with reasoning, reply composer with AI suggestions
- **AI matches** — network shown as a **constellation** with edges weighted by fit score; click nodes to see the warm intro draft
- **Connector setup** — who you are / who you want to meet, with matching weights
- **Public SuperDM link** — vertical request menu with prices and turnaround, plus a working submit form
- **Community admin** — KPIs, intro funnel, top connectors, approval queue

**Tweaks** (toggle in toolbar): accent color, theme, density, typeface, inbox layout, AI panel style, persona (Maya/Devon/Sana), viewport (desktop/mobile). Mobile layout adapts. All state persists to localStorage.

## User

A background task has completed. Here are the results:

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Fixed the inbox overflow by adding `min-width: 0` to the detail pane, wrapping its text blocks, and collapsing the sidebar under 1100px so the list + detail columns breathe on narrower screens.

## User

Apply 2 direct edits:
1. In components/onboarding-community.jsx (near line 141, <h1>): change the text from "On Deck Fintech" to "Activity ".
<mentioned-element>
react:    App › Community
dom:      body › … › div.content.scroll › div.community-wrap › div.hero-head › div › h1.hero-title[1/2]
text:     "On Deck Fintech"
children: text
selector: [data-om-id="jsx:/https:/93cadefb-74d0-462b-95c3-1478445db23b.claudeusercontent.com/v1/design/proje…
id:       cc-2
</mentioned-element>
2. In components/onboarding-community.jsx (near line 247, <div>): change the text from "84%" to "428".
<mentioned-element>
react:    App › Community › KpiCard
dom:      body › … › div.content.scroll › div.community-wrap › div.kpi-grid › div.kpi-card › div.kpi-value[2/3]
text:     "84%"
children: text
selector: [data-om-id="jsx:/https:/93cadefb-74d0-462b-95c3-1478445db23b.claudeusercontent.com/v1/design/proje…
id:       cc-3
</mentioned-element>

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

The reply rate value is in data.js, not the component. Let me fix that edit.

_[tool: grep]_

The "84%" is in `data.js`. Let me update there.

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: snip]_

Both edits applied.

