import type { ApiProp, ComponentApi } from "../../../scripts/docs/componentApi";
import { FIELD_ROOT_REST } from "../../internal/field.api";

const side = (en: string, ru: string): ApiProp => ({
  name: "side",
  type: '"start" | "end"',
  required: true,
  en,
  ru,
});

const rest = (element: "div" | "span", omit = '"children"'): ApiProp => {
  const type = element === "div" ? "HTMLDivElement" : "HTMLSpanElement";
  return {
    name: "…rest",
    type: `Omit<HTMLAttributes<${type}>, ${omit}>`,
    en: `\`className\` and the other attributes of the \`<${element}>\`.`,
    ru: `\`className\` и остальные атрибуты \`<${element}>\`.`,
  };
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Input.Root",
      en: "`ref` → `HTMLDivElement` (the field frame). Size, label, support row and the context for `Wrapper` and `Field`.",
      ru: "Размер, подпись, строка поддержки и контекст для `Wrapper` и `Field`.",
      props: [
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Tier for height, padding, radius, text, label and hint. Without it the field takes the tier of its host (LoginForm, Popover, a panel with a size), else `m`. Also provided to nested controls via the control-size context.",
          ru: "Ярус поля: высота, отступы, радиус, кегль поля, подписи и подсказки. Без него поле берёт ярус контейнера (LoginForm, Popover, панель с размером), иначе `m`.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Label above the field, rendered as `<label htmlFor>`. Without it, give `Input.Field` an `aria-label`.",
          ru: "Подпись над полем (`<label htmlFor>`). Без неё задайте `aria-label` на `Input.Field`.",
        },
        {
          name: "required",
          type: "boolean",
          default: "false",
          en: "Red `*` after the label (`aria-hidden`) and native `required` on `Input.Field`.",
          ru: "Красная `*` после подписи (`aria-hidden`) и нативный `required` на `Input.Field`.",
        },
        {
          name: "optional",
          type: "boolean",
          default: "false",
          en: "Muted marker right after the label text (`labels.optional`).",
          ru: "Приглушённая пометка после подписи (`labels.optional`).",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the field. Hidden while `error` is shown.",
          ru: "Подсказка под полем; скрывается, пока показан `error`.",
        },
        {
          name: "error",
          type: "ReactNode",
          en: "Error message in the hint slot; implies `invalid`.",
          ru: "Текст ошибки на месте подсказки; включает `invalid`.",
        },
        {
          name: "invalid",
          type: "boolean",
          default: "false",
          en: "Danger inset ring on the field, `aria-invalid` on the input. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо, `aria-invalid`, `data-invalid`.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides only the visual focus ring on `Input.Wrapper` (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay.',
          ru: "`false` скрывает только кольцо фокуса; фокус, клавиатура, ARIA и кольцо ошибки остаются.",
        },
        {
          name: "counter",
          type: "ReactNode",
          en: "Right side of the support row, usually `<Input.Counter />`.",
          ru: "Правая часть строки поддержки, обычно `<Input.Counter current max />`.",
        },
        {
          name: "reserveSupportRow",
          type: "boolean",
          default: "false",
          en: "Always render the support row (min height = hint line height), so an appearing error does not shift the layout.",
          ru: "Строка поддержки есть всегда, поэтому ошибка не сдвигает вёрстку.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the `<input>` (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Явный id поля; иначе генерируется. Связывает подпись, подсказку и ошибку.",
        },
        {
          name: "strength",
          type: "boolean",
          default: "false",
          en: "A password strength meter: a stepped `ProgressBar` (4 steps) under the field and the level word at the end of the support row — weak, easy, medium, hard (`labels.strengthWeak` … `strengthHard`), toned danger → warning → accent → success. Follows the value of `Input.Field`, controlled or not. For new-password fields.",
          ru: "Шкала надёжности пароля: ступенчатый `ProgressBar` (4 шага) под полем и слово уровня в конце строки поддержки — слабый, лёгкий, средний, сложный (`labels.strengthWeak` … `strengthHard`), тон danger → warning → accent → success. Следит за значением `Input.Field`, управляемым или нет. Для поля нового пароля.",
        },
        {
          name: "getStrength",
          type: "(value: string) => 0 | 1 | 2 | 3 | 4",
          default: "getPasswordStrength",
          en: "Replaces the kit's estimate: every trait adds a point on its own, in any order — lowercase, uppercase, digits, symbols, 10+ and 14+ characters; 0–2 points weak, 3 easy, 4 medium, 5+ hard, and under 8 characters at most easy. Return 0 for empty, 1 weak … 4 hard. A hint for the person typing, not a security check.",
          ru: "Заменяет оценку кита: каждый признак добавляет балл сам по себе, в любом порядке — строчные, заглавные, цифры, символы, 10+ и 14+ символов; 0–2 балла — слабый, 3 — лёгкий, 4 — средний, 5+ — сложный, короче 8 символов — не выше лёгкого. Верните 0 для пустого, 1 — слабый … 4 — сложный. Подсказка для человека, а не проверка безопасности.",
        },
        {
          name: "labels",
          type: "Partial<InputLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Usually `Input.Wrapper`.",
          ru: "Обычно `Input.Wrapper` с полем и слотами.",
        },
        FIELD_ROOT_REST,
      ],
    },
    {
      name: "Input.Wrapper",
      en: "`ref` → `HTMLDivElement`. The visible field: fill, hover, focus ring, invalid ring; `data-size` and `data-invalid` come from the root.",
      ru: "Видимое поле: заливка, наведение, фокус, ошибка; `data-size` и `data-invalid` приходят из контекста.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "`Field` and the slots: `Icon`, `Affix`, `InlineAffix`, `ClearButton`.",
          ru: "`Field`, `Icon`, `Affix`, `InlineAffix`, `ClearButton`.",
        },
        rest("div"),
      ],
    },
    {
      name: "Input.Field",
      en: "`ref` → `HTMLInputElement`. The native `<input>`; `id`, `aria-invalid` and `aria-describedby` come from the root.",
      ru: "Нативный `<input>` с id, aria-связями и `aria-invalid` из контекста.",
      props: [
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the new string; native `onChange` still fires first.",
          ru: "Новое строковое значение; нативный `onChange` тоже вызывается.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged with the hint/error ids from the root.",
          ru: "Добавляется к id подсказки и ошибки из контекста.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Overrides the root's `required` for the native input.",
          ru: "Переопределяет `required` корня для нативного поля.",
        },
        {
          name: "…rest",
          type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "id">',
          en: "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`, `placeholder`…",
          ru: "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`…",
        },
      ],
    },
    {
      name: "Input.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`), centered between the edge and the text.",
      props: [
        side("Side of the value.", "Сторона значения."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "An icon; kit icons without an explicit `size` take the field tier.",
          ru: "Иконка; без `size` берёт ярус поля.",
        },
        rest("span"),
      ],
    },
    {
      name: "Input.Affix",
      en: "`ref` → `HTMLDivElement`. Tinted section flush with the edge (`aria-hidden`); the wrapper drops its padding there.",
      props: [
        side("Edge the section sits on.", "Край, к которому прилегает секция с подложкой."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Static text: protocol, domain, country code.",
          ru: "Постоянный текст: протокол, домен, код страны.",
        },
        rest("div"),
      ],
    },
    {
      name: "Input.InlineAffix",
      en: "`ref` → `HTMLSpanElement`. Muted unit next to the value (`aria-hidden`).",
      props: [
        side("Side of the value.", "Сторона значения."),
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Short unit: `₽`, `%`, `кг`.",
          ru: "Короткая единица: `₽`, `%`, `кг`.",
        },
        rest("span"),
      ],
    },
    {
      name: "Input.ClearButton",
      en: "`ref` → `HTMLButtonElement`. A full-height clear segment at the end edge, named by `labels.clear`, with `aria-controls` on the input. Render it only while the field has a value.",
      ru: "Сегмент очистки на всю высоту поля у конца. Рендерите его, только пока есть значение.",
      props: [
        {
          name: "onClick",
          type: "MouseEventHandler<HTMLButtonElement>",
          en: "Clear the value here. Afterwards focus returns to the input unless `event.preventDefault()` was called.",
          ru: "Очистите значение здесь; затем фокус вернётся в поле (если не вызван `preventDefault`).",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "aria-label">',
          en: "The other button attributes.",
          ru: "Остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Input.Counter",
      en: "`ref` → `HTMLSpanElement`. Character counter for the support row; shows `14/40` and announces `labels.counter`.",
      props: [
        {
          name: "current",
          type: "number",
          required: true,
          en: "Current length.",
          ru: "Текущая длина.",
        },
        {
          name: "max",
          type: "number",
          required: true,
          en: 'Limit; `current > max` turns the counter danger (`data-invalid="true"`).',
          ru: "Лимит; при `current > max` счётчик красный (`data-invalid`).",
        },
        rest("span"),
      ],
    },
  ],
  labels: [
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
    {
      key: "clear",
      default: "Очистить",
      en: "Accessible name of `Input.ClearButton`.",
      ru: "Имя `Input.ClearButton`.",
    },
    {
      key: "counter",
      default: "{current} из {max} символов",
      en: "Screen-reader text of `Input.Counter`; `{current}` and `{max}` are replaced.",
      ru: "Озвучка `Input.Counter`; `{current}` и `{max}` подставляются.",
    },
    {
      key: "strength",
      default: "Надёжность пароля",
      en: "Accessible name of the `strength` meter and the spoken prefix of the level word.",
      ru: "Имя шкалы `strength` и озвучиваемое начало слова уровня.",
    },
    {
      key: "strengthWeak",
      default: "Слабый",
      en: "Level word for strength 1.",
      ru: "Слово уровня 1.",
    },
    {
      key: "strengthEasy",
      default: "Лёгкий",
      en: "Level word for strength 2.",
      ru: "Слово уровня 2.",
    },
    {
      key: "strengthMedium",
      default: "Средний",
      en: "Level word for strength 3.",
      ru: "Слово уровня 3.",
    },
    {
      key: "strengthHard",
      default: "Сложный",
      en: "Level word for strength 4.",
      ru: "Слово уровня 4.",
    },
  ],
};
