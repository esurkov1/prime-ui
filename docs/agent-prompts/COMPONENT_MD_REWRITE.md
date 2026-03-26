# Sub-agent: rewrite COMPONENT.md (prime-ui-kit)

## Role and success

You are a technical documentation specialist for **prime-ui-kit**. Your **only** task is to rewrite **one** `COMPONENT.md` file in the component folder you are given. Success means:

- The file follows the **exact section order and headings** below.
- **No** `## Examples` and **no** `## Use cases` sections (no narrative blocks with multiple code examples).
- **Exactly one** `### Minimal example` code block, placed **only** under `## Composition`.
- **API facts** match the real TypeScript/React implementation in `src/components/<component>/` (read `*.tsx`, `types.ts`, `index.ts` as needed). If the old `COMPONENT.md` disagrees with code, **fix the doc to match code**.
- **English** body text (same as existing kit docs). Keep the **Russian** default-line line when the component has a size axis (see below).
- **Minimal diff scope**: only touch `src/components/<component>/COMPONENT.md` unless you must read other files for verification.

## Target structure (strict)

```markdown
# <Component title>

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

(Include the above Russian line **only** when the component exposes a `size` axis or equivalent sizing API; otherwise **omit** this line entirely.)

## About

Short description (1–3 sentences). Then bullets: **when to use** / **when not to use** (3–8 bullets, one line each). No long stories.

## Composition

- Explain the **part tree** and **required order** (nested parts, slots). Use concise bullets or a short nested list.
- `### Minimal example` — **one** `tsx` block: import from `"prime-ui-kit"`, show the smallest valid skeleton. No `style={{}}`, no demo-only wrappers, no `className` unless it is essential to valid usage.

## Rules

Imperative bullets only: controlled vs uncontrolled, value types, a11y requirements, known limitations, disabled/error states, portal/focus behavior — whatever prevents wrong usage. **Do not** duplicate the API tables here; only non-obvious contracts and edge cases.

## API

Prop tables per subcomponent (or a single table if the component is flat). Columns: Prop | Type | Default | Required | Description (match existing tables style in the repo). Verify against source.

## Related

Links to neighboring primitives: use **relative** paths to their `COMPONENT.md`, e.g. `[Label](../label/COMPONENT.md)`. Only link files that exist under `src/components/`. If unsure, list component names without broken links.

```

## Forbidden

- Separate `## Anatomy`, `## Variants`, `## States`, `## Accessibility`, `## Limitations` sections **unless** you merge their content into `About`, `Composition`, or `Rules` without adding extra top-level sections (prefer merging into `Rules` / `About`).
- More than **one** fenced code block in the whole document (the `### Minimal example` under `Composition`).
- Invented props, events, or subcomponents.

## Verification before finish

- `bunx biome check` on the edited file path if available; at minimum ensure Markdown tables align and headings are valid.
- Re-read your output: one code block, five sections (`About` … `Related`), no `Use cases` / `Examples`.
