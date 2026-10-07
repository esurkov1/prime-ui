import { ComponentPage, type ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  dir: "button",
  title: "Button",
  kind: "primitive",
  description:
    "Кнопка для явных действий: сохранить, отправить, удалить. `tone` задаёт смысл действия, `variant` — подачу, `size` — ярус контрола.",
  examples: [
    {
      slot: "overview",
      description: "Главное действие и второстепенное рядом — `variant`, `tone`.",
    },
    { slot: "variants", description: "Все подачи во всех тонах — `variant`, `tone`." },
    { slot: "sizes", description: "Все ярусы, от 28 до 48 px в высоту — `size`." },
    {
      slot: "states",
      description:
        "Неактивная и загрузка рядом с обычной; спиннер не меняет ширину — `disabled`, `loading`.",
    },
    {
      slot: "with-icon",
      description:
        "Иконка до или после подписи и квадратная кнопка только с иконкой — `Button.Icon`, `aria-label`.",
    },
    {
      scenario: "as-child",
      title: "Как ссылка",
      description:
        "Вид кнопки на настоящей ссылке; неактивная ссылка не переходит — `asChild`, `disabled`.",
    },
    {
      slot: "in-form",
      description:
        "Кнопка отправки на всю ширину показывает идущий запрос — `type`, `loading`, `fullWidth`.",
    },
  ],
  api: [
    {
      name: "Button.Root",
      description:
        "Кнопка или слот для одного дочернего элемента при `asChild`; задаёт подачу, тон и размер, передаёт ярус вложенным иконкам.",
      rows: [
        {
          prop: "variant",
          type: '"solid" | "soft" | "outline" | "ghost"',
          defaultValue: '"solid"',
          required: "Нет",
          description: "Подача: заливка, мягкая заливка, линия или прозрачная.",
        },
        {
          prop: "tone",
          type: '"accent" | "neutral" | "danger"',
          defaultValue: '"accent"',
          required: "Нет",
          description: "Смысл: главное действие, второстепенное или разрушительное.",
        },
        {
          prop: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultValue: '"m"',
          required: "Нет",
          description:
            "Ярус контрола: высота 28 · 32 · 36 · 40 · 48, отступы, кегль, иконка. Совпадает с Input и Select того же размера.",
        },
        {
          prop: "fullWidth",
          type: "boolean",
          defaultValue: "—",
          required: "Нет",
          description: "Растянуть кнопку на ширину контейнера.",
        },
        {
          prop: "loading",
          type: "boolean",
          defaultValue: "false",
          required: "Нет",
          description:
            "Спиннер вместо ведущей иконки или по центру над подписью, `aria-busy` и запрет нажатия. Ширина не меняется.",
        },
        {
          prop: "asChild",
          type: "boolean",
          defaultValue: "false",
          required: "Нет",
          description:
            "Передать стили и пропсы единственному дочернему элементу вместо `<button>`.",
        },
        {
          prop: "type",
          type: '"button" | "submit" | "reset"',
          defaultValue: '"button"',
          required: "Нет",
          description: "Тип нативной кнопки; при `asChild` не передаётся.",
        },
        {
          prop: "disabled",
          type: "boolean",
          defaultValue: "—",
          required: "Нет",
          description: "Неактивное состояние; `loading` тоже блокирует нажатие.",
        },
        {
          prop: "children",
          type: "React.ReactNode",
          defaultValue: "—",
          required: "Нет",
          description:
            "Подпись и `Button.Icon`. Только `Button.Icon` — квадратная кнопка, ей нужен `aria-label`.",
        },
        {
          prop: "…rest",
          type: "React.ButtonHTMLAttributes<HTMLButtonElement> (без size)",
          defaultValue: "—",
          required: "Нет",
          description: "`onClick`, `className`, `aria-*`, `data-*` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Button.Icon",
      description: "Иконка размера яруса кнопки; скрыта от скринридеров (`aria-hidden`).",
      rows: [
        {
          prop: "children",
          type: "React.ReactNode",
          defaultValue: "—",
          required: "Да",
          description:
            'Иконка, например `<Icon name="action.copy" />`; без `size` берёт ярус кнопки.',
        },
        {
          prop: "…rest",
          type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
          defaultValue: "—",
          required: "Нет",
          description: "`className` и остальные атрибуты span.",
        },
      ],
    },
    {
      name: "Button.Spinner",
      description:
        "Явное место спиннера. Обычно не нужен: `loading` на корне показывает спиннер сам.",
      rows: [
        {
          prop: "…rest",
          type: "React.HTMLAttributes<HTMLSpanElement>",
          defaultValue: "—",
          required: "Нет",
          description: "Без `loading` на `Button.Root` ничего не рендерит.",
        },
      ],
    },
  ],
  accessibility: {
    keyboard: [
      { keys: "Enter · Space", action: "Нажимает кнопку (нативное поведение `<button>`)." },
      {
        keys: "Tab",
        action:
          "Переводит фокус; неактивная кнопка пропускается, а с `asChild` остаётся в порядке фокуса с `aria-disabled`.",
      },
    ],
    aria: [
      'Нативный `<button type="button">`: случайно не отправит форму.',
      "Кнопке только с иконкой нужен `aria-label`; `Button.Icon` скрыт (`aria-hidden`).",
      '`loading` ставит `aria-busy="true"` и блокирует нажатие.',
      'С `asChild` неактивное состояние — `aria-disabled="true"` без нативного `disabled`.',
    ],
  },
};

export default function ButtonSection() {
  return <ComponentPage page={page} />;
}
