import type { ApiLabel, ApiPart, ApiProp } from "../../../scripts/docs/componentApi";

/**
 * API of the dialog parts shared by Modal and Drawer (both are built from `DialogParts.tsx`);
 * both `api.ts` files compose them.
 */

export function dialogRootProps(name: "Modal" | "Drawer"): ApiProp[] {
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
      en: "Called on every open and close: trigger, close button, `Close`, Escape, scrim click, code.",
      ru: "Вызывается при каждом открытии и закрытии: триггер, крестик, `Close`, Escape, подложка, код.",
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
      en: "A click on the scrim closes the dialog; turn off for destructive confirms.",
      ru: "Клик по подложке закрывает окно; `false` — для подтверждений удаления.",
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

export function dialogParts(name: "Modal" | "Drawer", footerDefault: string): ApiPart[] {
  return [
    {
      name: `${name}.Header`,
      en: "`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title + Description] [close button]. + native `HTMLAttributes<HTMLElement>`.",
      props: [
        {
          name: "showClose",
          type: "boolean",
          default: "true",
          en: "Built-in square ghost `s` close button named by `labels.close`.",
          ru: "Встроенная кнопка закрытия: квадратная ghost `s`.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Icon, Title, Description in any order; the icon goes to the leading slot.",
          ru: "Icon (уходит в левый слот), Title, Description.",
        },
      ],
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
      en: "`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last. + native `HTMLAttributes<HTMLElement>`.",
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
  ];
}

export function dialogSlotsPart(name: string, slots: string): ApiPart {
  return {
    name: slots,
    en: "No DOM: clone the single child and chain its `onClick` (unless the child's handler calls `preventDefault()`).",
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
