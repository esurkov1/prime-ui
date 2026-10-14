import {
  type ApiLabel,
  type ApiPart,
  type ApiProp,
  type ApiText,
  labelRows,
} from "../../../scripts/docs/componentApi";

import { DIALOG_LABELS } from "./DialogParts";

/**
 * API of the dialog parts shared by Modal, Drawer and Sheet (all built from `DialogParts.tsx`);
 * their `api.ts` files compose them.
 */

type DialogName = "Modal" | "Drawer" | "Sheet";

export function dialogRootProps(name: DialogName): ApiProp[] {
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
      en: `A click on the scrim${swipes ? " (and a swipe down, which draws the grab handle)" : ""} closes the dialog. A destructive action is confirmed in a ConfirmDialog; unsaved changes are held by \`Guard\`.`,
      ru: `Клик по подложке${swipes ? " (и свайп вниз, для которого видна ручка)" : ""} закрывает окно. Разрушительное действие подтверждают в ConfirmDialog, несохранённые изменения удерживает \`Guard\`.`,
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

export const dialogLabels: ApiLabel[] = labelRows(DIALOG_LABELS, {
  close: {
    en: "`aria-label` of the header close button.",
    ru: "`aria-label` кнопки закрытия в шапке.",
  },
  discardTitle: {
    en: "Title of the confirm a dismiss opens while a `Guard` is `dirty`.",
    ru: "Заголовок подтверждения, которое открывает попытка закрыть окно при `Guard` `dirty`.",
  },
  discardDescription: {
    en: "Its description.",
    ru: "Его описание.",
  },
  discardConfirm: {
    en: "Its confirm button: close and lose the changes.",
    ru: "Его кнопка действия: закрыть и потерять изменения.",
  },
  discardCancel: {
    en: "Its cancel button: back to the form.",
    ru: "Его кнопка отмены: вернуться к форме.",
  },
});

export const dialogContentAriaProps: ApiProp[] = [
  {
    name: "aria-label",
    type: "string",
    en: "Dialog name when there is no Title.",
    ru: "Имя диалога без Title.",
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

/** The default of the footer `layout`: one value, or one per width tier (Modal). */
export type FooterDefault = { value: string } | { note: ApiText };

export function dialogParts(name: DialogName, footerDefault: FooterDefault): ApiPart[] {
  return [
    {
      name: `${name}.Header`,
      en: "`ref` → `HTMLElement`. Renders `<header>`: [Icon] [Title + Description] [Actions] [close button].",
      ru: "Рисует `<header>`: [Icon] [Title + Description] [Actions] [кнопка закрытия].",
      props: [
        {
          name: "showClose",
          type: "boolean",
          default: "true",
          en: "Built-in square ghost `s` close button named by `labels.close`; disabled in place while a `Guard` is `busy`.",
          ru: "Встроенная кнопка закрытия: квадратная ghost `s` с именем из `labels.close`; при `Guard` `busy` остаётся на месте, выключенная.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Icon, Title, Description, Actions in any order; each goes to its column. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip.",
          ru: "Icon, Title, Description, Actions в любом порядке; каждый встаёт в свою колонку. `Tabs.List` (с `Tabs.Root` вокруг шапки и тела) превращает шапку в полосу вкладок.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`className` and the other attributes of the `<header>`.",
          ru: "`className` и остальные атрибуты `<header>`.",
        },
      ],
    },
    {
      name: `${name}.Actions`,
      en: "`ref` → `HTMLDivElement`. A row of controls at the end of the header, before the close button: a status Badge, a ⋯ Dropdown, an icon button. Controls inside take tier `s`.",
      ru: "Ряд контролов в конце шапки перед крестиком: статус Badge, меню ⋯ Dropdown, кнопка-иконка; контролы внутри — яруса `s`.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `children` and the other attributes of the row.",
          ru: "`className`, `children` и остальные атрибуты ряда.",
        },
      ],
    },
    {
      name: `${name}.Icon`,
      en: "`ref` → `HTMLSpanElement`. An `aria-hidden` 40 px tile with a tone fill; around an `Avatar.Root` or a `Thumbnail.Root` (the record's picture) no tile — `data-media`, the avatar sized to 40 px.",
      ru: "`aria-hidden` плашка 40 px с заливкой тона; вокруг `Avatar.Root` или `Thumbnail.Root` (картинка записи) плашки нет — `data-media`, аватар 40 px.",
      props: [
        {
          name: "tone",
          type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
          default: '"neutral"',
          en: "Soft fill and icon color; not used around a picture.",
          ru: "Мягкая заливка плашки и цвет иконки; у картинки не действует.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "An `Icon` (sized to the m icon), or the record's picture: an `Avatar.Root` (sized to the tile) or a `Thumbnail.Root`.",
          ru: "`Icon` размера m или картинка записи: `Avatar.Root` (под размер плашки) или `Thumbnail.Root`.",
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
      en: "`ref` → `HTMLHeadingElement` / `HTMLParagraphElement`. `<h2>` (title-m) / `<p>` (body-s, muted); their ids name and describe the dialog.",
      ru: "`<h2>` (title-m) / `<p>` (body-s, приглушённый); их id дают диалогу имя и описание.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>, "id">',
          en: "`className`, `children` and the other attributes except `id` (the dialog owns it).",
          ru: "`className`, `children` и остальные атрибуты, кроме `id` (его задаёт диалог).",
        },
      ],
    },
    {
      name: `${name}.Body`,
      en: "`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks.",
      ru: "Единственная прокручиваемая зона (ScrollContainer), зазор 16 между блоками.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `children` and the other attributes of the zone.",
          ru: "`className`, `children` и остальные атрибуты зоны.",
        },
      ],
    },
    {
      name: `${name}.Footer`,
      en: "`ref` → `HTMLElement`. Renders `<footer>` with the actions, primary last, and an optional `Meta` at the start.",
      ru: "Рисует `<footer>` с действиями, главное последним, и необязательный `Meta` в начале.",
      props: [
        {
          name: "layout",
          type: '"fill" | "end"',
          ...("value" in footerDefault
            ? { default: footerDefault.value }
            : { defaultNote: footerDefault.note }),
          en: "`fill`: equal-width buttons in one row; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px.",
          ru: "`fill` — кнопки равной ширины в ряд; `end` — по содержимому у края. На телефоне (уже 640 px) и в диалоге уже 360 px — столбиком.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLElement>",
          en: "`className`, `children` and the other attributes of the `<footer>`.",
          ru: "`className`, `children` и остальные атрибуты `<footer>`.",
        },
      ],
    },
    {
      name: `${name}.Meta`,
      en: "`ref` → `HTMLParagraphElement`. A `<p>` at the start of the footer: short muted status text («Есть несохранённые изменения»); the buttons keep their width at the end. Not part of the dialog description.",
      ru: "`<p>` в начале подвала: короткий приглушённый статус («Есть несохранённые изменения»); кнопки остаются у края. В описание диалога не входит.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLParagraphElement>",
          en: "`className`, `children` and the other attributes of the `<p>`.",
          ru: "`className`, `children` и остальные атрибуты `<p>`.",
        },
      ],
    },
    {
      name: `${name}.Guard`,
      en: "No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. Closing from code is never held.",
      ru: "Удерживает окно изнутри Content, где живёт состояние формы; своего DOM нет, кроме встроенного подтверждения. Закрытие кодом не удерживается.",
      props: [
        {
          name: "busy",
          type: "boolean",
          default: "false",
          en: `A request runs: Escape, a press outside, ${name === "Drawer" ? "" : "a swipe, "}the close button and \`Close\` do nothing; the close button and the \`Close\` child stay in place, disabled.${name === "Drawer" ? "" : " The grab handle stays and takes no drag."}`,
          ru: `Идёт запрос: Escape, клик мимо, ${name === "Drawer" ? "" : "свайп, "}крестик и \`Close\` не закрывают; крестик и кнопка в \`Close\` остаются на месте выключенными.${name === "Drawer" ? "" : " Ручка остаётся и не тянется."}`,
        },
        {
          name: "dirty",
          type: "boolean",
          default: "false",
          en: `Unsaved changes: any of those dismisses${name === "Drawer" ? "" : " (a swipe glides back first)"} asks «Не сохранять изменения?» (a ConfirmDialog with \`labels.discard*\`); confirming closes the dialog.`,
          ru: `Есть несохранённые изменения: любая попытка закрыть${name === "Drawer" ? "" : " (свайп сначала возвращает панель)"} спрашивает «Не сохранять изменения?» (ConfirmDialog с \`labels.discard*\`); подтверждение закрывает окно.`,
        },
      ],
    },
  ];
}

/** `Trigger · Close` (and Modal's `Confirm`): slots around one element. */
export function dialogSlotsPart(name: DialogName, slots: string): ApiPart {
  const confirm = name === "Modal";
  return {
    name: slots,
    en: `No DOM: each clones its child. \`Trigger\` and \`Close\` chain its \`onClick\` (skipped after \`preventDefault()\`): open; close through \`Guard\`, \`disabled\` while it is busy.${confirm ? " `Confirm` adds no handler: it marks the Enter target." : ""}`,
    ru: `Без DOM: каждый клонирует свой элемент. \`Trigger\` и \`Close\` добавляют к его \`onClick\` (не после \`preventDefault()\`): открыть; закрыть через \`Guard\`, \`disabled\`, пока он занят.${confirm ? " `Confirm` обработчика не добавляет: отмечает цель Enter." : ""}`,
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
