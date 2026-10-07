# prime-ui-kit

React 19 UI kit (npm package `prime-ui-kit`) for building product interfaces: admin panels, dashboards,
settings, forms, tables. Design language "Graphite": depth from fill, not lines; 4px grid; one size
axis `xs–xl` (default `m`); air as hierarchy. Styling is CSS Modules + semantic CSS variables
(`--prime-*`), behaviour and a11y partly on `react-aria-components`. TypeScript, ESM, light + dark themes.

Consumers install it from npm and build screens from its components. An agent skill (`SKILL/`) teaches
other agents to build UI with the kit the way its author would.

## Sources of truth (higher wins)

1. `docs/foundation.md` — design contract and API v1 (§10). Do not change it without an explicit request.
2. Code: `src/components/<dir>/*.tsx|*.module.css`, `src/layout/**`, `src/internal/**`, `src/hooks/**`, `tokens/`.
3. Examples: `src/components/<dir>/examples/*.tsx` (layout: `src/layout/<dir>/examples/`). The playground
   imports them directly — there is no separate snippet copy.
4. Docs derived from 1–3: `COMPONENT.md` per component, `SKILL/`, `README.md`.

Never document props, variants, tokens or scenarios that the code does not have.

## Repository map

| Path | What |
|---|---|
| `tokens/` | `primitives.ts` → `semantic.ts` → `themes/{light,dark}.ts`; `bun run tokens:build` generates `src/styles/{tokens,theme-light,theme-dark}.css` (never edit those by hand) |
| `src/components/<dir>/` | one component: `X.tsx`, `X.module.css`, `X.test.tsx`, `COMPONENT.md`, `examples/` |
| `src/layout/` | AppShell, Sidebar (same structure) |
| `src/internal/` | shared mechanics: `states.ts` (shared vocabulary: `ControlSize`, tones…), contexts, overlay motion |
| `src/hooks/` | `useOutsideClick`, `useEscapeKey`, `useFocusTrap`, `usePresence`… (overlay stack) |
| `src/icons/` | public `Icon*` set built on lucide-react |
| `src/index.ts`, `src/components/index.ts`, `src/layout/index.ts` | public exports |
| `playground/` | docs site (Vite). `playgroundPages.tsx` = routes, sidebar categories, search; `sections/<Name>Section.tsx` = one page per component; `foundation/` = token pages |
| `src/test/docs-contract.test.ts` | fails when docs/examples/playground drift apart |
| `SKILL/` | agent skill for consumer projects (rules, choosing, layouts, anti-slop, checklist) |
| `scripts/` | token build, library bundle |

## Commands

```bash
bun install
bun run playground:dev      # docs site
bun run typecheck
bun run check               # biome (check:fix to autofix)
bun run test                # vitest, incl. docs contract
bun run build               # tokens + bundle + d.ts
bun run verify              # everything CI runs — must be green before a commit
```

## One change touches everything

A component change is done only when all of these agree. Do them in the same change:

1. **Code** — `X.tsx`, `X.module.css`, tokens if needed; follow foundation (tokens only, no raw px/hex,
   no `--prime-ref-*`; API names from §10; `data-*` for state).
2. **Tests** — `X.test.tsx` for behaviour, keyboard and a11y.
3. **Exports** — `src/components/index.ts` (or `src/layout/index.ts`) for new parts and types.
4. **Examples** — `examples/<scenario>.tsx`: one scenario per file, kebab-case name by meaning, first line
   an English JSDoc, one `export default function <Component><Scenario>Example()`, kit imports only from
   `"prime-ui-kit"`, layout via kit components or one local `examples.module.css` on `--prime-*` tokens,
   Russian UI text, copyable into a consumer project. New prop or variant → an example shows it.
5. **Playground** — `playground/sections/<Name>Section.tsx` imports every example (preview + `?raw` code,
   via `@/components/<dir>/examples/<file>`), and its `PlaygroundApiTable` rows match the code. A new
   component also gets a page in `CATEGORY_PAGES` (`playground/playgroundPages.tsx`).
6. **COMPONENT.md** — full reference (English, same template everywhere): Category line matching
   `CATEGORY_PAGES`, When to use / not, Import, Anatomy, API (every prop, exact defaults), Variants (every
   union value), States, Layout & spacing, Accessibility (every `labels` key), Examples (every file),
   Mistakes, Related.
7. **SKILL/** — holds no per-component content: `components.md` is a category tree of relative links to
   each `COMPONENT.md` and `examples/`, so editing a component never requires editing the skill. Touch
   the skill only when a component is added/removed/renamed (one index line), when the choice between
   components changes (`choosing.md`), or when a shared rule changes (`api-contract.md`,
   `foundations.md`). No symlinks: npm drops them and copied skills would break.
8. **README.md** — when the public surface changes (new component, export, install step).

`bun run test` enforces the mechanical part (docs exist, sections present, category matches, every
example listed and imported by the playground, import rules, tokens in example CSS). The rest is on you.

## Conventions

- No backward compatibility: one name per concept, no aliases, no `@deprecated`, delete legacy.
- Compound API `X.Root` + `X.Part` for components with parts; single export for leaves.
- Controlled/uncontrolled pairs: `value/defaultValue/onValueChange`, `checked/…/onCheckedChange`,
  `open/defaultOpen/onOpenChange`; dismiss via `closeOnOutsideClick`/`closeOnEscape`.
- System strings in `labels?: Partial<XLabels>` with Russian defaults; visible content via children.
- Destructive tone is `danger`, never `error`. Default size is `m` in every example and screen.
- Code, identifiers, docs and comments in English; UI strings in Russian.
- Tokens: edit `tokens/*.ts` only, then `bun run tokens:build`; `bun run verify:tokens` must show no diff.
- Themes switch only via `data-theme`; components know semantic roles, never the theme.
- A11y minimum: every interactive component works from the keyboard, has explicit ARIA, a visible
  focus ring in both themes, never conveys meaning by color alone, and has keyboard tests.
- Biome formatting: 2 spaces, double quotes, line width 100.

## Release

`.github/workflows/ci.yml`: every push to `main` runs `bun run verify`; then, if the `package.json`
version is not on npm yet, publishes it. Bump `version` to release. `package.json` `files` ships `dist`,
styles, every `COMPONENT.md` and `examples/**`.
