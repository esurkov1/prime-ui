import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";
import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";

const row = (
  prop: string,
  type: string,
  defaultValue: string,
  description: string,
  required = "Нет",
): PlaygroundApiPropRow => ({ prop, type, defaultValue, required, description });

const sideRow = (what: string) => row("side", '"start" | "end"', "—", what, "Да");
const childrenRow = (what: string) => row("children", "React.ReactNode", "—", what, "Да");

export const page: ComponentPageConfig = {
  dir: "input",
  title: "Input",
  kind: "field",
  description:
    "Однострочное поле и эталон системы полей: подпись сверху, поле на заливке, строка поддержки снизу. Select, Datepicker, TagSelect и Textarea повторяют этот контракт.",
  examples: [
    { slot: "overview", description: "Поле с подписью и подсказкой под ним — `label`, `hint`." },
    { slot: "sizes", description: "Все ярусы; подпись и подсказка берут ярус поля — `size`." },
    {
      slot: "states",
      description: "Обычное поле рядом с неактивным и только для чтения — `disabled`, `readOnly`.",
    },
    {
      slot: "validation",
      description:
        "Пометки обязательного и необязательного поля, подсказка, ошибка и строка поддержки без сдвига — `required`, `optional`, `hint`, `error`, `reserveSupportRow`.",
    },
    {
      slot: "with-icon",
      description: "Декоративная иконка у любого края значения — `Input.Icon`, `side`.",
    },
    {
      scenario: "affixes",
      title: "Аффиксы",
      description:
        "Постоянные префикс и суффикс у краёв и единица рядом со значением — `Input.Affix`, `Input.InlineAffix`.",
    },
    {
      scenario: "with-badge",
      title: "Бейдж в поле",
      description:
        "Мягкий бейдж статуса у конца поля; высота не меняется — `Input.Badge`, `color`.",
    },
    {
      scenario: "without-focus-ring",
      title: "Без кольца фокуса",
      description: "Одно поле поиска, где фокус видно по каретке и светлой заливке — `focusRing`.",
    },
    {
      slot: "controlled",
      description:
        "Значением владеет родитель: кнопка очистки и счётчик символов следуют за ним — `value`, `onValueChange`, `Input.ClearButton`, `Input.Counter`.",
    },
    {
      slot: "in-form",
      description:
        "Реквизиты компании: обязательные поля проверяются при отправке, соседние поля держат низ на одной линии — `required`, `error`, `reserveSupportRow`.",
    },
  ],
  api: [
    {
      name: "Input.Root",
      description: "Размер, подпись, строка поддержки и контекст для `Wrapper` и `Field`.",
      rows: [
        row(
          "size",
          '"xs" | "s" | "m" | "l" | "xl"',
          '"m"',
          "Ярус поля: высота, отступы, радиус, кегль поля, подписи и подсказки.",
        ),
        row(
          "label",
          "React.ReactNode",
          "—",
          "Подпись над полем (`<label htmlFor>`). Без неё задайте `aria-label` на `Input.Field`.",
        ),
        row(
          "required",
          "boolean",
          "false",
          "Красная `*` после подписи (`aria-hidden`) и нативный `required` на `Input.Field`.",
        ),
        row(
          "optional",
          "boolean",
          "false",
          "Приглушённая пометка после подписи (`labels.optional`).",
        ),
        row(
          "hint",
          "React.ReactNode",
          "—",
          "Подсказка под полем; скрывается, пока показан `error`.",
        ),
        row(
          "error",
          "React.ReactNode",
          "—",
          "Текст ошибки на месте подсказки; включает `invalid`.",
        ),
        row(
          "invalid",
          "boolean",
          "false",
          "Ошибка без текста: красное кольцо, `aria-invalid`, `data-invalid`.",
        ),
        row(
          "focusRing",
          "boolean",
          "true",
          "`false` скрывает только кольцо фокуса; фокус, клавиатура, ARIA и кольцо ошибки остаются.",
        ),
        row(
          "counter",
          "React.ReactNode",
          "—",
          "Правая часть строки поддержки, обычно `<Input.Counter current max />`.",
        ),
        row(
          "reserveSupportRow",
          "boolean",
          "false",
          "Строка поддержки есть всегда, поэтому ошибка не сдвигает вёрстку.",
        ),
        row(
          "id",
          "string",
          "—",
          "Явный id поля; иначе генерируется. Связывает подпись, подсказку и ошибку.",
        ),
        row(
          "labels",
          "Partial<InputLabels>",
          "см. «Доступность»",
          "Системные строки: пометка optional, имя кнопки очистки, озвучка счётчика.",
        ),
        childrenRow("Обычно `Input.Wrapper` с полем и слотами."),
        row("className", "string", "—", "Класс корня."),
      ],
    },
    {
      name: "Input.Wrapper",
      description: "Видимое поле: заливка, наведение, фокус, ошибка.",
      rows: [
        childrenRow("`Field`, `Icon`, `Affix`, `InlineAffix`, `Badge`, `ClearButton`."),
        row(
          "className",
          "string",
          "—",
          "Класс поля; `data-size` и `data-invalid` приходят из контекста.",
        ),
      ],
    },
    {
      name: "Input.Field",
      description: "Нативный `<input>` с id, aria-связями и `aria-invalid` из контекста.",
      rows: [
        row(
          "onValueChange",
          "(value: string) => void",
          "—",
          "Новое строковое значение; нативный `onChange` тоже вызывается.",
        ),
        row("aria-describedby", "string", "—", "Добавляется к id подсказки и ошибки из контекста."),
        row(
          "…rest",
          'Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">',
          "—",
          "`value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`…",
        ),
      ],
    },
    {
      name: "Input.Icon",
      rows: [
        sideRow("Сторона; иконка стоит по центру между краем и текстом."),
        childrenRow("Иконка; без `size` берёт ярус поля."),
        row("className", "string", "—", "Класс span."),
      ],
    },
    {
      name: "Input.Affix",
      rows: [
        sideRow("Край, к которому прилегает секция с подложкой."),
        childrenRow("Постоянный текст: протокол, домен, код страны."),
        row("className", "string", "—", "Класс секции."),
      ],
    },
    {
      name: "Input.InlineAffix",
      rows: [
        sideRow("Сторона значения."),
        childrenRow("Короткая единица: ₽, %, кг."),
        row("className", "string", "—", "Класс span."),
      ],
    },
    {
      name: "Input.Badge",
      rows: [
        row(
          "color",
          '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          '"gray"',
          "Цвет палитры мягкого бейджа (ярус на шаг ниже поля).",
        ),
        childrenRow("Короткий статус: «Проверен», «Новое»."),
        row("className", "string", "—", "Класс бейджа."),
      ],
    },
    {
      name: "Input.ClearButton",
      description:
        "Сегмент очистки на всю высоту поля у конца. Рендерите его, только пока есть значение.",
      rows: [
        row(
          "onClick",
          "(event) => void",
          "—",
          "Очистите значение здесь; затем фокус вернётся в поле (если не вызван `preventDefault`).",
        ),
        row(
          "…rest",
          'Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "aria-label">',
          "—",
          "Имя кнопки — `labels.clear` у `Input.Root`.",
        ),
      ],
    },
    {
      name: "Input.Counter",
      rows: [
        row("current", "number", "—", "Текущая длина.", "Да"),
        row(
          "max",
          "number",
          "—",
          "Лимит; при `current > max` счётчик красный (`data-invalid`).",
          "Да",
        ),
        row("className", "string", "—", "Класс span."),
      ],
    },
  ],
  accessibility: {
    keyboard: [
      { keys: "Tab", action: "Фокус в поле, затем на кнопку очистки, если она показана." },
      {
        keys: "Enter · Space",
        action: "На кнопке очистки: очищает значение и возвращает фокус в поле.",
      },
    ],
    aria: [
      "`label` — настоящий `<label htmlFor>`; без него задайте `aria-label` на `Input.Field`. Плейсхолдер не заменяет подпись.",
      'Подсказка и ошибка связаны через `aria-describedby`; ошибка ставит `aria-invalid="true"`.',
      "`Input.Icon`, `Input.Affix`, `Input.InlineAffix` скрыты (`aria-hidden`): смысл единицы или префикса дублируйте в подписи.",
      "`Input.ClearButton` — кнопка с именем `labels.clear` и `aria-controls` на поле.",
      '`Input.Counter` показывает «14/40», а скринридер читает `labels.counter` через `aria-live="polite"`.',
    ],
    labels: [
      {
        key: "optional",
        defaultValue: "необязательно",
        description: "Пометка после подписи при `optional`.",
      },
      { key: "clear", defaultValue: "Очистить", description: "Имя `Input.ClearButton`." },
      {
        key: "counter",
        defaultValue: "{current} из {max} символов",
        description: "Озвучка `Input.Counter`; `{current}` и `{max}` подставляются.",
      },
    ],
  },
};

export default function InputSection() {
  return <ComponentPage page={page} />;
}
