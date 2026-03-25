# prime-ui-kit Rules

Нормативный контракт разработки **prime-ui-kit** — отдельного репозитория React UI-kit.  
Если правило помечено как **MUST**, его нарушение блокирует merge.

## 1. Foundation Contract

- **MUST**: строить систему снизу вверх — tokens -> themes -> states -> components.
- **MUST**: использовать единый источник правды для цветов, размеров, отступов и состояний.
- **MUST**: не добавлять runtime-зависимости без доказанной необходимости.
- **SHOULD**: не вводить абстракции до появления повторения.

## 2. Styling Contract

- **MUST**: не использовать Tailwind в **prime-ui-kit**.
- **MUST**: не хардкодить визуальные значения в JSX.
- **MUST**: использовать `CSS Modules` + CSS variables.
- **MUST**: читать значения только из semantic token layer.

## 3. Token Contract

- **MUST**: соблюдать иерархию:
  - `tokens/primitives.ts`
  - `tokens/semantic.ts`
  - `tokens/themes/*`
- **MUST**: публичные компоненты не используют `--prime-ref-*` напрямую.
- **MUST**: после изменений токенов обновлять:
  - `src/styles/tokens.css`
  - `src/styles/theme-light.css`
  - `src/styles/theme-dark.css`
- **MUST**: проходить `bun run verify:tokens` перед merge.

## 4. Theme Contract

- **MUST**: переключение тем только через `data-theme` на `:root` или на изолированном контейнере (semantic-токены применяются к `[data-theme="light"]` / `[data-theme="dark"]`).
- **MUST**: компонент не знает о теме, знает только semantic roles.
- **MUST**: темы `light` и `dark` поддерживаются в равной степени.

## 5. State Naming Contract

- **MUST**: единый destructive-термин — `error`.
- **MUST**: использовать общий словарь из `src/internal/states.ts`.
- **MUST**: не вводить новые naming-оси без обновления `states.ts`, docs и playground.

## 6. API Consistency Contract

- **MUST**: похожие компоненты имеют одинаковую логику props (`size`, `variant`, controlled/uncontrolled).
- **MUST**: значения `size`/`variant` опираются на единый словарь, а не локальные строки.
- **MUST**: не смешивать визуальный режим, состояние и бизнес-логику в одном prop.
- **SHOULD**: использовать нативные HTML-атрибуты там, где это возможно.

## 7. DOM and Data-Attributes Contract

- **MUST**: React отвечает за поведение и accessibility.
- **MUST**: CSS отвечает только за визуал.
- **MUST**: контрактные состояния передаются через `data-*` или нативные HTML/ARIA атрибуты.

## 8. Accessibility Minimum Contract

- **MUST**: каждый интерактивный компонент поддерживает клавиатуру.
- **MUST**: `focus-visible` визуально заметен в light и dark.
- **MUST**: смысл не кодируется только цветом.
- **MUST**: для кастомных контролов есть явные ARIA-атрибуты и тесты поведения.

## 9. Internal Architecture Contract

- **MUST**: повторяющуюся механику выносить в `src/hooks` / `src/internal`.
- **MUST**: низкоуровневая логика не просачивается в публичный API.
- **SHOULD**: размер публичного API меньше и стабильнее внутреннего слоя.

## 10. Testing Contract

- **MUST**: каждый публичный компонент имеет примеры и interaction tests.
- **MUST**: сложные интерактивные компоненты имеют keyboard tests.
- **MUST**: минимальный gate перед merge:
  - `bun run check`
  - `bun run typecheck`
  - `bun run test`
  - `bun run build`
- **SHOULD**: визуально критичные компоненты покрыты screenshot/visual-regression.

## 11. Documentation Contract

Для каждого публичного компонента **MUST** быть описаны:

- назначение;
- anatomy;
- props;
- variants;
- states;
- accessibility contract;
- примеры;
- ограничения.

## 12. Workflow Contract

- **MUST**: для изменений в корне репозитория (в т.ч. `src/**`, `tokens/**`, `playground/**`) pre-commit/CI запускают проверки из `package.json` (`verify` / отдельные скрипты).
- **MUST**: CI для **prime-ui-kit** зелёный до merge.
- **MUST**: breaking change сопровождается обновлением:
  - `README.md`
  - `RULES.md`
  - playground
  - tests

## 13. Breaking Changes Policy (до v1)

- **Разрешены**, если укрепляют foundation.
- **MUST**: каждая ломающая правка имеет migration note в PR/коммите.
- **MUST**: migration path проверен на playground и тестах.

## 14. Definition of Done (компонент)

Компонент считается готовым, если:

- реализован на semantic tokens;
- имеет единый API (`size/variant/state`);
- имеет interaction + keyboard/a11y tests;
- добавлен в публичные exports;
- покрыт примерами в playground;
- задокументирован в `README.md`.
