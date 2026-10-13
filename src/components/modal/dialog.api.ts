import type { ApiLabel, ApiPart, ApiProp } from "../../../scripts/docs/componentApi";

/**
 * API of the dialog parts shared by Modal, Drawer and Sheet (all built from `DialogParts.tsx`);
 * their `api.ts` files compose them.
 */

export function dialogRootProps(name: "Modal" | "Drawer" | "Sheet"): ApiProp[] {
  // A Sheet (and a Modal as a phone sheet) swipes down; a Drawer has no gestures.
  const swipes = name !== "Drawer";
  return [
    {
      name: "open",
      type: "boolean",
      en: "Controlled visibility; together with `onOpenChange`.",
      ru: "Управляемое открытие; вместе с `onOpenChange`.",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      default: "false",
      en: "Initial visibility, uncontrolled.",
      ru: "Начальное состояние без управления.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      en: "Called on every open and close: trigger, close button, `Close`, Escape, scrim click, code. A `Guard` holds the dismisses (not code).",
      ru: "Вызывается при каждом открытии и закрытии: триггер, крестик, `Close`, Escape, подложка, код. `Guard` удерживает закрытие человеком (не кодом).",
    },
    {
      name: "closeOnEscape",
      type: "boolean",
      default: "true",
      en: "Escape closes the dialog.",
      ru: "Escape закрывает окно.",
    },
    {
      name: "closeOnOutsideClick",
      type: "boolean",
      default: "true",
      en: `A click on the scrim${swipes ? " (and a swipe down)" : ""} closes the dialog; turn off for destructive confirms.`,
      ru: `Клик по подложке${swipes ? " (и свайп вниз)" : ""} закрывает окно; \`false\` — для подтверждений удаления.`,
    },
    {
      name: "labels",
      type: `Partial<${name}Labels>`,
      en: "Built-in strings, see Labels.",
      ru: "Системные строки, см. «Доступность».",
    },
    {
      name: "children",
      type: "ReactNode",
      en: "Trigger and Content.",
      ru: "Триггер и содержимое.",
    },
  ];
}

export const dialogLabels: ApiLabel[] = [
  {
    key: "close",
    default: "Закрыть",
    en: "`aria-label` of the header close button.",
    ru: "`aria-label` кнопки закрытия в шапке.",
  },
  {
    key: "discardTitle",
    default: "Не сохранять изменения?",
    en: "Title of the confirm a dismiss opens while a `Guard` is `dirty`.",
    ru: "Заголовок подтверждения, которое открывает попытка закрыть окно при `Guard dirty`.",
  },
  {
    key: "discardDescription",
    default: "Изменения в форме пропадут.",
    en: "Its description.",
    ru: "Его описание.",
  },
  {
    key: "discardConfirm",
    default: "Не сохранять",
    en: "Its confirm button: close and lose the changes.",
    ru: "Его кнопка действия: закрыть и потерять изменения.",
  },
  {
    key: "discardCancel",
    default: "Продолжить",
    en: "Its cancel button: back to the form.",
    ru: "Его кнопка отмены: вернуться к форме.",
  },
];

export const dialogContentAriaProps: ApiProp[] = [
  {
    name: "aria-label",
    type: "string",
    en: "Dialog name when there is no Title.",
    ru: "Имя диалога без `Title`.",
  },
  {
    name: "aria-labelledby",
    type: "string",
    en: "Overrides the Title id.",
    ru: "Переопределяет id заголовка.",
  },
  {
    name: "aria-describedby",
    type: "string",
    en: "Overrides the Description id.",
    ru: "Переопределяет id описания.",
  },
  {
    name: "overlayClassName",
    type: "string",
    en: "Class on the scrim.",
    ru: "Класс подложки.",
  },
  {
    name: "…rest",
    type: "HTMLAttributes<HTMLDivElement>",
    en: '`className` and the other attributes of the `role="dialog"` element.',
    ru: '`className` и остальные атрибуты элемента `role="dialog"`.',
  },
];

export function dialogParts(name: "Modal" | "Drawer" | "Sheet", footerDefault: string): ApiPart[] {
  return [
    {
      name: `${name}.Header`,
      en: "`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title + Description] [Actions] [close button]. + native `HTMLAttributes<HTMLElement>`.",
      props: [
        {
          name: "showClose",
          type: "boolean",
          default: "true",
          en: "Built-in square ghost `s` close button named by `labels.close`; disabled in place while a `Guard` is `busy`.",
          ru: "Встроенная кнопка закрытия: квадратная ghost `s`; при `Guard busy` остаётся на месте, выключенная.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Icon, Title, Description, Actions in any order; each goes to its column. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip.",
          ru: "Icon, Title, Description, Actions в любом порядке; каждый встаёт в свою колонку. `Tabs.List` (с `Tabs.Root` вокруг шапки и тела) превращает шапку в полосу вкладок.",
        },
      ],
    },
    {
      name: `${name}.Actions`,
      en: "`ref` → `HTMLDivElement`. A row of controls at the end of the header, before the close button: a status Badge, a ⋯ Dropdown, an icon button. Controls inside take tier `s`. + native `<div>` props.",
      ru: "Ряд контролов в конце шапки перед крестиком: статус, меню ⋯, кнопка-иконка; контролы внутри — яруса `s`.",
      props: [],
    },
    {
      name: `${name}.Icon`,
      en: "`ref` → `HTMLSpanElement`. An `aria-hidden` 40 px tile with a tone fill.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          default: '"neutral"',
          en: "Soft fill and icon color.",
          ru: "Мягкая заливка плашки и цвет иконки.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Icon glyph (sized to the m icon).",
          ru: "Иконка 20 px.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other attributes of the tile.",
          ru: "`className` и остальные атрибуты плашки.",
        },
      ],
    },
    {
      name: `${name}.Title · ${name}.Description`,
      en: "`ref` → `HTMLHeadingElement` / `HTMLParagraphElement`. `<h2>` (title-m) / `<p>` (body-s, muted); their ids name and describe the dialog. + native props except `id`.",
      props: [],
    },
    {
      name: `${name}.Body`,
      en: "`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks. + native `<div>` props.",
      props: [],
    },
    {
      name: `${name}.Footer`,
      en: "`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last, and an optional `Meta` at the start. + native `HTMLAttributes<HTMLElement>`.",
      props: [
        {
          name: "layout",
          type: '"fill" | "end"',
          default: footerDefault,
          en: "`fill`: equal-width buttons in one row; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px.",
          ru: "`fill` — кнопки равной ширины в ряд; `end` — по содержимому у края. На телефоне (уже 640 px) и в диалоге уже 360 px — столбиком.",
        },
      ],
    },
    {
      name: `${name}.Meta`,
      en: "`ref` → `HTMLParagraphElement`. A `<p>` at the start of the footer: short muted status text («Есть несохранённые изменения»); the buttons keep their width at the end. Not part of the dialog description. + native `<p>` props.",
      ru: "Короткий статус в начале подвала («Есть несохранённые изменения»); кнопки остаются у края.",
      props: [],
    },
    {
      name: `${name}.Guard`,
      en: "No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. Closing from code is never held.",
      ru: "Удерживает окно изнутри `Content`, где живёт состояние формы; своего DOM нет, кроме встроенного подтверждения. Закрытие кодом не удерживается.",
      props: [
        {
          name: "busy",
          type: "boolean",
          default: "false",
          en: `A request runs: Escape, a press outside, ${name === "Drawer" ? "" : "a swipe, "}the close button and \`Close\` do nothing; the close button and the \`Close\` child stay in place, disabled.`,
          ru: `Идёт запрос: Escape, клик мимо, ${name === "Drawer" ? "" : "свайп, "}крестик и \`Close\` не закрывают; крестик и кнопка в \`Close\` остаются на месте выключенными.`,
        },
        {
          name: "dirty",
          type: "boolean",
          default: "false",
          en: "Unsaved changes: any of those dismisses first asks «Не сохранять изменения?» (a ConfirmDialog with `labels.discard*`); confirming closes the dialog.",
          ru: "Есть несохранённые изменения: любая попытка закрыть сначала спрашивает «Не сохранять изменения?» (ConfirmDialog с `labels.discard*`).",
        },
      ],
    },
  ];
}

export function dialogSlotsPart(name: string, slots: string): ApiPart {
  return {
    name: slots,
    en: "No DOM: clone the single child and chain its `onClick` (unless the child's handler calls `preventDefault()`). `Close` goes through a `Guard` and makes its child `disabled` while the guard is busy.",
    ru: `Оборачивают один элемент: \`Trigger\` открывает, \`Close\` закрывает${name === "Modal" ? ", `Confirm` делает кнопку целью Enter" : ""}.`,
    props: [
      {
        name: "children",
        type: "ReactElement",
        required: true,
        en: "One element, usually a Button.",
        ru: "Ровно один элемент, обычно Button.",
      },
    ],
  };
}
