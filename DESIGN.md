# Design Brief

## Direction

Dark Editorial Productivity Tool — M3U playlist manager with minimalist, tool-focused design and high information density for long editing sessions.

## Tone

Brutally minimal, content-forward. Dark mode reduces cognitive load. No decoration, only structure. Clean and utilitarian like Linear or Vercel, stripped of corporate polish.

## Differentiation

Visual stream validation feedback with soft status badges (green/red/amber) next to URLs. Clean table interface with subtle row alternation rhythm. Streamlined import/export. No clutter.

## Color Palette

| Token      | OKLCH          | Role   |
| ---------- | -------------- | ------ |
| background | 0.145 0.014 260 | dark charcoal base |
| foreground | 0.95 0.01 260  | text, primary content |
| card       | 0.18 0.014 260 | table rows, elevated cards |
| primary    | 0.75 0.15 190  | cyan accent, CTAs, stream status |
| accent     | 0.75 0.15 190  | stream validation highlights |
| muted      | 0.22 0.02 260  | secondary text, disabled state |
| destructive | 0.55 0.2 25   | delete actions, invalid streams |

## Typography

- Display: Satoshi — clean sans, section headings, labels
- Body: Satoshi — UI text, body copy, input labels
- Mono: JetBrains Mono — URLs, metadata, code-like values
- Scale: h1 `text-3xl font-bold`, h2 `text-xl font-semibold`, label `text-sm font-medium`, body `text-base`

## Elevation & Depth

Minimal shadows (2px soft elevation only). Surface hierarchy through background color shifts only. No glow, no blur, no neon effects. Card hover state: 2px lifted shadow.

## Structural Zones

| Zone    | Background     | Border     | Notes |
| ------- | -------------- | ---------- | ----- |
| Header  | `bg-card`      | `border-b` | Logo, title, quick stats (playlist count, valid %) |
| Content | `bg-background` | —          | Main table area with alternating `bg-card/50` rows |
| Sidebar | `bg-sidebar`   | `border-r` | Optional: channel groups, filter history (future) |
| Footer  | `bg-card`      | `border-t` | Stats summary or action status |

## Spacing & Rhythm

Spacious layout (gap: 24px between sections). Table rows have 12px vertical padding. Input/button height 40px. Border-radius 6px for cards, 4px for inline elements. Breathing room between import/export buttons and table.

## Component Patterns

- **Buttons**: Cyan primary (`bg-primary` + hover darkened), transparent secondary (`border border-border` + hover `bg-card`)
- **Table**: Alternating row backgrounds (`bg-card/50` for even rows). Clickable rows with `hover:bg-card` transition. Inline actions on hover.
- **Badges**: Status badges with background + text color (`status-valid`, `status-invalid`, `status-pending` utilities)
- **Inputs**: Border `border-border`, focus `ring-2 ring-primary`, placeholder `text-muted-foreground`

## Motion

- Entrance: Table rows fade-in staggered 50ms per row (optional)
- Hover: `transition-smooth` (0.3s) on all interactive elements
- Validation: Batch validation progress bar with smooth 0.5s per item update
- Decorative: None — motion is functional only

## Constraints

- No gradients, full colors only
- No animations beyond functional transitions
- Dark mode only (dark editorial preset)
- Max 2 fonts (Satoshi body + JetBrains Mono for data)
- Subtle shadows only (2px lifted, no glow)
- Information density prioritized over whitespace

## Signature Detail

Soft cyan status badges next to URLs transition on hover. Stream validation health at a glance — green (valid), red (failed), amber (pending/checking). Combines utility with visual feedback.
