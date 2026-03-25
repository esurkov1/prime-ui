# prime-ui-kit Rules

Normative development contract for **prime-ui-kit** — a standalone React UI kit repository.  
If a rule is marked **MUST**, violating it blocks merge.

## 1. Foundation Contract

- **MUST**: build the system bottom-up — tokens -> themes -> states -> components.
- **MUST**: use a single source of truth for colors, sizes, spacing, and states.
- **MUST**: do not add runtime dependencies without proven need.
- **SHOULD**: do not introduce abstractions until repetition appears.

## 2. Styling Contract

- **MUST**: do not use Tailwind in **prime-ui-kit**.
- **MUST**: do not hardcode visual values in JSX.
- **MUST**: use `CSS Modules` + CSS variables.
- **MUST**: read values only from the semantic token layer.

## 3. Token Contract

- **MUST**: follow the hierarchy:
  - `tokens/primitives.ts`
  - `tokens/semantic.ts`
  - `tokens/themes/*`
- **MUST**: public components do not use `--prime-ref-*` directly.
- **MUST**: after token changes, update:
  - `src/styles/tokens.css`
  - `src/styles/theme-light.css`
  - `src/styles/theme-dark.css`
- **MUST**: pass `bun run verify:tokens` before merge.

## 4. Theme Contract

- **MUST**: switch themes only via `data-theme` on `:root` or on an isolated container (semantic tokens apply under `[data-theme="light"]` / `[data-theme="dark"]`).
- **MUST**: a component does not know about theme; it only knows semantic roles.
- **MUST**: `light` and `dark` themes are supported equally.

## 5. State Naming Contract

- **MUST**: the single destructive term is `error`.
- **MUST**: use the shared vocabulary from `src/internal/states.ts`.
- **MUST**: do not introduce new naming axes without updating `states.ts`, docs, and playground.

## 6. API Consistency Contract

- **MUST**: similar components share the same prop logic (`size`, `variant`, controlled/uncontrolled).
- **MUST**: `size`/`variant` values rely on a shared vocabulary, not ad hoc strings.
- **MUST**: do not mix visual mode, state, and business logic in a single prop.
- **SHOULD**: use native HTML attributes where possible.

## 7. DOM and Data-Attributes Contract

- **MUST**: React owns behavior and accessibility.
- **MUST**: CSS owns visuals only.
- **MUST**: contract states are conveyed via `data-*` or native HTML/ARIA attributes.

## 8. Accessibility Minimum Contract

- **MUST**: every interactive component supports keyboard use.
- **MUST**: `focus-visible` is visually obvious in light and dark.
- **MUST**: meaning is not conveyed by color alone.
- **MUST**: custom controls have explicit ARIA attributes and behavior tests.

## 9. Internal Architecture Contract

- **MUST**: factor repeated mechanics into `src/hooks` / `src/internal`.
- **MUST**: low-level logic does not leak into the public API.
- **SHOULD**: the public API is smaller and more stable than the internal layer.

## 10. Testing Contract

- **MUST**: every public component has examples and interaction tests.
- **MUST**: complex interactive components have keyboard tests.
- **MUST**: minimum gate before merge:
  - `bun run check`
  - `bun run typecheck`
  - `bun run test`
  - `bun run build`
- **SHOULD**: visually critical components are covered by screenshot/visual regression.

## 11. Documentation Contract

For every public component, **MUST** document:

- purpose;
- anatomy;
- props;
- variants;
- states;
- accessibility contract;
- examples;
- limitations.

## 12. Workflow Contract

- **MUST**: for changes at the repo root (including `src/**`, `tokens/**`, `playground/**`), pre-commit/CI runs checks from `package.json` (`verify` / individual scripts).
- **MUST**: CI for **prime-ui-kit** is green before merge.
- **MUST**: a breaking change is accompanied by updates to:
  - `README.md`
  - `RULES.md`
  - playground
  - tests

## 13. Breaking Changes Policy (pre-v1)

- **Allowed** if they strengthen the foundation.
- **MUST**: every breaking change includes a migration note in the PR/commit.
- **MUST**: the migration path is verified on playground and in tests.

## 14. Definition of Done (component)

A component is considered done when it:

- is implemented on semantic tokens;
- has a consistent API (`size`/`variant`/`state`);
- has interaction + keyboard/a11y tests;
- is added to public exports;
- is covered by playground examples;
- is documented in `README.md`.
