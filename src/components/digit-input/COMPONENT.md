# DigitInput

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## Canonical

- **Import:** `import { DigitInput } from "prime-ui-kit"`.
- **Surface:** только **`DigitInput.Root`** — горизонтальный ряд ячеек (`<fieldset>` + несколько `<input>`).
- **Значение:** одна строка из цифр; длина задаётся **`length`** (по умолчанию **`4`**).
- **Размер ячеек:** **`size`**: `"s"` \| `"m"` \| `"l"` \| `"xl"` (по умолчанию **`m`**).
- **Режимы:** контролируемый (`value` + `onChange`) или неконтролируемый (`defaultValue`); опционально **`onComplete`**, **`disabled`**, **`hasError`**, **`className`**.
- **Подписи и ошибки:** снаружи — [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md); встроенных слотов нет.
- **Playground:** секция **`playground/sections/DigitInputSection.tsx`**; исходники демо — **`playground/snippets/digit-input/*.tsx`** (импорты **`@/`**). Сниппеты **`playground/snippets/slider-digit/`** относятся к **Slider** с режимом «цифры», а не к **DigitInput**.
- **Примеры для копирования:** [`examples/`](./examples/) — продуктовые сценарии и зеркала сниппетов с импортом **`prime-ui-kit`**.

## Extended

### About

`DigitInput` — один OTP-стиль контроль: горизонтальный ряд полей по одному символу, общая строка цифр, вставка из буфера и автоматический перенос фокуса между ячейками.

- **Use** for short numeric codes (SMS/OTP, PIN, pickup codes) where one digit per box matches user expectations.
- **Use** when you want `inputMode="numeric"`, `maxLength={1}` per cell, and `autoComplete="one-time-code"` without wiring it yourself.
- **Use** with `onComplete` to react once the user fills all cells (for example, submit or advance a step).
- **Do not use** for alphanumeric codes; non-digit characters are stripped on type and paste.
- **Do not use** when a single full-width numeric field is enough — prefer [Input](../input/COMPONENT.md) or app-level masking.
- **Do not use** for free-form numbers (amounts, phone as one field); this component is fixed-length, one digit per slot.
- **Do not expect** arrow keys to move between cells; only typing, Backspace on an empty cell, and pointer focus apply.

### Playground snippets

Демо совпадают по порядку и смыслу с **`playground/sections/DigitInputSection.tsx`**. В сниппетах — импорты **`@/`**; зеркальные рецепты с **`prime-ui-kit`** — в **`examples/`** (та же разметка и пропы, раскладка через простой column flex и токены отступов).

| Блок | Сниппет | Зеркало в `examples/` |
| ---- | ------- | ---------------------- |
| **Размеры** | [`sizes.tsx`](../../../playground/snippets/digit-input/sizes.tsx) | [`sizes.tsx`](./examples/sizes.tsx) — **`size`** **`s`**, **`m`**, **`l`**, **`xl`** при **`length={4}`** и одинаковом **`defaultValue`** для сравнения масштаба. |
| **Состояния** | [`states.tsx`](../../../playground/snippets/digit-input/states.tsx) | [`states.tsx`](./examples/states.tsx) — без флагов, **`hasError`**, **`disabled`**. |
| **Контролируемый режим** | [`controlled.tsx`](../../../playground/snippets/digit-input/controlled.tsx) | [`controlled.tsx`](./examples/controlled.tsx) — **`value`** + **`onChange`**, подпись со строкой и счётчиком **`(n/4)`**. |
| **Композиция** | [`composition.tsx`](../../../playground/snippets/digit-input/composition.tsx) | [`composition.tsx`](./examples/composition.tsx) — **[Label](../label/COMPONENT.md)** + **DigitInput** + **[Hint](../hint/COMPONENT.md)** без слотов на корне. |
| **Специфичные фичи** | [`features.tsx`](../../../playground/snippets/digit-input/features.tsx) | [`features.tsx`](./examples/features.tsx) — разные **`length`** / **`defaultValue`**, демо **`onComplete`** после последней цифры. |

### Composition

- Public API is **`DigitInput.Root` only** (`DigitInput = { Root }`). There are no inner slots (`Label`, `Icon`, etc.) on this component.
- The root renders a native **`fieldset`** with `aria-label="Digit input"` and **`length`** separate `<input type="text">` cells (`inputMode="numeric"`, `maxLength={1}`, `autoComplete="one-time-code"`).
- Pair captions and helper text with [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) **outside** the root; there is no built-in link from one label to a single control id.

### Minimal example

```tsx
import { DigitInput } from "prime-ui-kit";

export function OneTimeCode() {
  return <DigitInput.Root />;
}
```

### Scenarios (recipes)

Продуктовые сценарии (импорт **`prime-ui-kit`**). Для построчного соответствия демо плейграунда см. **Playground snippets** выше.

| Сценарий | Файл |
| -------- | ---- |
| Вход по SMS / OTP, `length={6}`, контролируемое значение, подсказка про вставку | [`examples/otp-login.tsx`](./examples/otp-login.tsx) |
| PIN, крупные ячейки для тача (`size="l"`) | [`examples/pin.tsx`](./examples/pin.tsx) |
| Шаг верификации: код + кнопка «Продолжить» до заполнения | [`examples/verification-step.tsx`](./examples/verification-step.tsx) |
| Неверный код: `hasError` и `Hint` с `variant="error"` | [`examples/error-state.tsx`](./examples/error-state.tsx) |
| Повторная отправка кода и сброс поля через родительское состояние | [`examples/resend-and-clear.tsx`](./examples/resend-and-clear.tsx) |

### Rules

- **Controlled:** pass `value` and `onChange`; the live string is always normalized to digits only and truncated to `length`.
- **Uncontrolled:** use `defaultValue` (defaults to `""`); still pass `onChange` if you need to observe updates.
- **`onChange`** receives the full normalized digit string after each edit (not only the last key).
- **`onComplete`** fires **once** when the string length becomes `length` **after** having been shorter; editing digits while already full does not fire it again until the value is shortened below `length` and filled again.
- **Paste** at any cell fills forward from that index; non-digits are dropped; focus moves to the last filled or last cell.
- **Backspace** on an **empty** cell moves focus to the previous cell (it does not delete the previous digit by itself).
- **After typing a digit** in a cell, focus moves to the next cell when one exists.
- **`disabled`** disables every cell; **`hasError`** drives error styling on the root via `data-has-error`.
- **No portal, no polymorphic root, no `variant`:** visual scale is only `size` (`s` | `m` | `l` | `xl`); width follows cell layout, not a `fullWidth` prop.

## LLM note

- Для разметки и комбинаций пропов сначала смотри **`playground/snippets/digit-input/*.tsx`** и зеркала **`examples/sizes.tsx`**, **`states.tsx`**, **`controlled.tsx`**, **`composition.tsx`**, **`features.tsx`**.
- Нормализация: в **`value` / `onChange` / paste** нецифровые символы **удаляются**, строка **обрезается** до **`length`**. Алфавитно-цифровые коды **не поддерживаются**.
- **`onComplete(value)`** вызывается **один раз**, когда длина строки **впервые** стала **`length`**, будучи до этого **меньше**; при редактировании уже полной строки без укорочения **не** вызывается снова.
- **Backspace** на **пустой** ячейке только **переносит фокус** назад; **не** стирает предыдущую цифру автоматически.
- После ввода цифры фокус **переходит вперёд** (если есть следующая ячейка). **Стрелки** между ячейками **не** обрабатываются.
- **Paste** с любой ячейки: цифры подставляются **вперёд** от индекса; нецифры отбрасываются.
- Каждая ячейка: **`inputMode="numeric"`**, **`maxLength={1}`**, **`autoComplete="one-time-code"`** (задано в реализации).
- Нет **`fullWidth`**, **`variant`**, портала и полиморфного корня; ошибка только через **`hasError`** → `data-has-error` на корне.

## API

### DigitInput.Root

| Prop           | Type                        | Default | Required | Description                                                                 |
| -------------- | --------------------------- | ------- | -------- | --------------------------------------------------------------------------- |
| `length`       | `number`                    | `4`     | No       | Number of cells (one digit per cell).                                       |
| `size`         | `"s" \| "m" \| "l" \| "xl"` | `"m"`   | No       | Visual size of cells (control tokens).                                      |
| `value`        | `string`                    | —       | No       | Controlled value; non-digits stripped, truncated to `length`.               |
| `defaultValue` | `string`                    | `""`    | No       | Initial value in uncontrolled mode (normalized the same way).               |
| `onChange`     | `(value: string) => void`   | —       | No       | Called with the normalized digit string on every change.                    |
| `disabled`     | `boolean`                   | —       | No       | Disables all cells.                                                         |
| `hasError`     | `boolean`                   | —       | No       | Error styling for the group (`data-has-error` on the root).                |
| `onComplete`   | `(value: string) => void`   | —       | No       | Called when the value first reaches full `length` from a shorter string.   |
| `className`    | `string`                    | —       | No       | Class name on the root `fieldset`.                                          |

Exported composite: `DigitInput = { Root }`. Types: `DigitInputRootProps`, `DigitInputSize`.

## Related

- [Label](../label/COMPONENT.md) — caption for the code group (place beside or above the fieldset).
- [Hint](../hint/COMPONENT.md) — validation or timing hints under the cells.
- [Input](../input/COMPONENT.md) — single-line text or number entry without fixed cells.
- [Button](../button/COMPONENT.md) — actions such as clear, resend, or continue next to the code.
