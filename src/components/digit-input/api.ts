import type { ComponentApi } from "../../../scripts/docs/componentApi";
import { FIELD_ROOT_REST } from "../../internal/field.api";

export const api: ComponentApi = {
  parts: [
    {
      name: "DigitInput",
      en: "`ref` → `HTMLDivElement` (the field frame). The field frame (label → cells → hint | error) around a `<fieldset>` of one-character inputs; the value has no gaps, typing always goes to the first empty cell.",
      ru: "Рамка поля (подпись → ячейки → подсказка или ошибка) вокруг `<fieldset>` из однозначных полей; значение без пропусков.",
      props: [
        {
          name: "length",
          type: "number",
          default: "4",
          en: "Number of cells.",
          ru: "Число ячеек.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: 'host tier, else "m"',
          en: "Tier: the cell is a square on its own scale, two steps above the control heights (36 · 40 · 48 · 56 · 64); label and hint follow the field tier. Without it the tier of its host (LoginForm, a panel), else `m`.",
          ru: "Ярус: ячейка — квадрат своей шкалы, на две ступени крупнее контролов (36 · 40 · 48 · 56 · 64); подпись и подсказка — по ярусу поля.",
        },
        {
          name: "label",
          type: "ReactNode",
          en: "Label above the cells; names the group (`aria-labelledby`) and focuses the first cell on click. Without it the group is named by `labels.group`.",
          ru: "Подпись над ячейками; называет группу и по клику фокусирует первую ячейку. Без неё имя — `labels.group`.",
        },
        {
          name: "required",
          type: "boolean",
          en: "Red `*` after the label and native `required` on every cell.",
          ru: "Красная `*` после подписи и нативный `required` на ячейках.",
        },
        {
          name: "optional",
          type: "boolean",
          en: "Muted marker right after the label text (`labels.optional`).",
          ru: "Приглушённая пометка после подписи (`labels.optional`).",
        },
        {
          name: "hint",
          type: "ReactNode",
          en: "Help text under the cells. Hidden while `error` is shown.",
          ru: "Подсказка под ячейками; скрывается, пока показан `error`.",
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
          en: "Danger ring and danger digits on every cell, `aria-invalid`. A non-empty `error` implies it.",
          ru: "Ошибка без текста: красное кольцо и цифры, `aria-invalid`.",
        },
        {
          name: "disabled",
          type: "boolean",
          en: "Disables the fieldset and every cell.",
          ru: "Отключает группу и все ячейки.",
        },
        {
          name: "value",
          type: "string",
          en: "Controlled code; non-digits are dropped, extra digits cut to `length`.",
          ru: "Управляемый код; не-цифры отбрасываются, лишнее обрезается до `length`.",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          en: "Initial code when uncontrolled.",
          ru: "Начальный код без контроля.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the joined digits on every change.",
          ru: "Склеенные цифры при каждом изменении.",
        },
        {
          name: "onComplete",
          type: "(value: string) => void",
          en: "Called once when the last empty cell is filled (typing, paste or autofill).",
          ru: "Один раз, когда заполнена последняя пустая ячейка (ввод, вставка, автозаполнение).",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          en: "Cells share the container width up to 1.5 × their side (the row centres beyond that) and keep the tier height; otherwise square cells and the field hugs them.",
          ru: "Ячейки делят ширину контейнера, но не шире 1,5 своей стороны (дальше ряд по центру), высота яруса сохраняется; иначе квадратные.",
        },
        {
          name: "groupSize",
          type: "number",
          en: "Splits the cells into groups of this size with a wider gap (`3` → 123 456).",
          ru: "Делит ячейки на группы с увеличенным зазором (`3` → 123 456).",
        },
        {
          name: "mask",
          type: "boolean",
          default: "false",
          en: 'Hides the digits (PIN): cells are `type="password"`.',
          ru: 'Скрывает цифры (PIN): ячейки `type="password"`.',
        },
        {
          name: "name",
          type: "string",
          en: "Name of a hidden input that carries the joined code in a native form submit.",
          ru: "Имя скрытого поля с кодом для отправки формы.",
        },
        {
          name: "autoFocus",
          type: "boolean",
          default: "false",
          en: "Focuses the first empty cell on mount.",
          ru: "Фокус на первую пустую ячейку при монтировании.",
        },
        {
          name: "focusRing",
          type: "boolean",
          default: "true",
          en: '`false` hides only the visual focus ring on the cells (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay.',
          ru: "`false` скрывает только кольцо фокуса; фокус, клавиатура, ARIA и кольцо ошибки остаются.",
        },
        {
          name: "id",
          type: "string",
          en: "Id of the first cell (the label points at it); hint id is `<id>-hint`, error id is `<id>-error`.",
          ru: "Id первой ячейки (на неё указывает подпись); иначе генерируется.",
        },
        {
          name: "aria-describedby",
          type: "string",
          en: "Merged before the hint/error ids on the group.",
          ru: "Добавляется перед id подсказки и ошибки на группе.",
        },
        {
          name: "labels",
          type: "Partial<DigitInputLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        FIELD_ROOT_REST,
      ],
    },
  ],
  labels: [
    {
      key: "group",
      default: "Код",
      en: "Accessible name of the group when there is no visible `label`.",
      ru: "Имя группы, когда нет видимой подписи.",
    },
    {
      key: "cell",
      default: "Цифра {index} из {length}",
      en: "Accessible name of each cell; `{index}` (1-based) and `{length}` are replaced.",
      ru: "Имя каждой ячейки; `{index}` (с 1) и `{length}` подставляются.",
    },
    {
      key: "optional",
      default: "необязательно",
      en: "Marker after the label when `optional`.",
      ru: "Пометка после подписи при `optional`.",
    },
  ],
};
