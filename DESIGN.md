# Design System

## Theme

An overhead-projector workbook brought to life: warm acetate-like surfaces, blunt technical labels, and a persistent prompt trace that behaves like a strip of physical tape. The room is bright, so the deck is light, high-contrast, and visually dense without feeling crowded.

## Color

- Background: `oklch(0.952 0.035 87)` — warm projected-paper field
- Surface: `oklch(0.985 0.018 92)` — diagram and text surface
- Ink: `oklch(0.205 0.027 62)` — near-black brown
- Muted: `oklch(0.44 0.035 69)` — secondary copy
- Primary: `oklch(0.69 0.165 112)` — olive trace / remembered context
- Signal: `oklch(0.48 0.18 267)` — model and inference actions
- Alert: `oklch(0.55 0.19 28)` — dropped context and hard limits

Color is semantic: olive marks context carried forward, blue-violet marks model computation, and red marks missing or discarded input.

## Typography

- Display: Trebuchet MS / Arial Narrow, heavy and tightly composed without extreme tracking
- Body: Trebuchet MS, large and humanist for projected reading
- Literary quotation: Georgia, used only for the conceptual/language interlude
- Data and code: ui-monospace, compact but never small

## Layout

Slides use the full 16:9 viewport with 2.25–4vw safe margins. A narrow top rail carries section and slide position; the main stage carries one visual claim; a persistent prompt trace near the bottom turns the deck’s thesis into a navigational motif.

## Components

- `slide`: one full-viewport narrative beat
- `prompt-trace`: the persistent strip showing what reaches the model
- `token`: square-ish semantic unit; never a decorative pill
- `message`: role/content pair in the constructed prompt
- `diagram-node`: labeled mechanism in a flow
- `transport`: bottom navigation and presentation controls

## Motion

Only mechanism slides animate. Autoregression cycles token-by-token, history accumulates turn-by-turn, and compaction visibly replaces raw turns. Motion pauses when a slide is inactive and becomes instantaneous under reduced-motion preferences.
