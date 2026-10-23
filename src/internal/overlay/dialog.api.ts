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
type FooterDefault = { value: string } | { note: ApiText };

/** `Section`: a titled group of the body (Modal, Drawer; a Sheet holds one short task). */
function dialogSectionPart(name: DialogName): ApiPart {
  return {
    name: `${name}.Section`,
    en: `\`ref\` → \`HTMLElement\`. A titled \`<section>\` of the body: an \`<h3>\` (title-s, under the \`<h2>\` title), an optional description, a \`${name}.Actions\` at the end of the heading row; the content 16 below, sections 32 apart, in any wrapper. Fields group in a \`Fieldset\`.`,
    ru: `\`<section>\` тела с заголовком: \`<h3>\` (title-s, под заголовком \`<h2>\`), необязательное описание, \`${name}.Actions\` в конце строки заголовка; содержимое на 16 ниже, секции в 32 друг от друга в любой обёртке. Поля группирует \`Fieldset\`.`,
    props: [
      {
        name: "label",
        type: "ReactNode",
        required: true,
        en: "The heading of the section; it names the `<section>`.",
        ru: "Заголовок секции; он же имя `<section>`.",
      },
      {
        name: "description",
        type: "ReactNode",
        en: "One line of context under the heading (body-s).",
        ru: "Строка контекста под заголовком (body-s).",
      },
      {
        name: "…rest",
        type: 'Omit<HTMLAttributes<HTMLElement>, "title">',
        en: `\`children\` (the content and an optional \`${name}.Actions\`), \`className\` and the other attributes of the \`<section>\`.`,
        ru: `\`children\` (содержимое и необязательный \`${name}.Actions\`), \`className\` и остальные атрибуты \`<section>\`.`,
      },
    ],
  };
}

export function dialogParts(
  name: DialogName,
  footerDefault: FooterDefault,
  { section = false }: { section?: boolean } = {},
): ApiPart[] {
  return [
    {
      name: `${name}.Header`,
      en: "`ref` → `HTMLElement`. `<header>`, the kit's header row, frame `l`, no line under it: [Icon] [Title + Badges / Description] [Actions] [close button], then the `Fields` row. One line each; a row too full drops `Actions` under the title, the close button stays on top.",
      ru: "`<header>` — строка шапки кита, фрейм `l`, без линии под ней: [Icon] [Title + Badges / Description] [Actions] [кнопка закрытия], затем ряд `Fields`. Каждое — в одну строку; у заголовка есть минимум (до 8em), тесная строка роняет `Actions` под него; закрытие остаётся наверху.",
      props: [
        {
          name: "showClose",
          type: "boolean",
          default: "true",
          en: "Built-in square ghost close button at the dialog's control tier, named by `labels.close`; disabled in place while a `Guard` is `busy`.",
          ru: "Встроенная кнопка закрытия: квадратная ghost ярусом диалога с именем из `labels.close`; при `Guard` `busy` остаётся на месте, выключенная.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Icon, Title, Description, Badges, Actions, Fields in any order; each goes to its place. A `Tabs.List` (with `Tabs.Root` around header and body) turns the header into a tab strip under the `Fields`.",
          ru: "Icon, Title, Description, Badges, Actions, Fields в любом порядке; каждый встаёт на своё место. `Tabs.List` (с `Tabs.Root` вокруг шапки и тела) превращает шапку в полосу вкладок под `Fields`.",
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
      en: `\`ref\` → \`HTMLDivElement\`. Header: a tab-wide switcher, then icon buttons and the ⋯ menu, at the dialog's tier, at the end of the title line (under it if too tight)${section ? `; at the end of a \`${name}.Section\` heading` : ""}. Value pickers go in \`${name}.Fields\`. In \`${name}.Footer\`: the start group.`,
      ru: `Шапка: переключатель вкладки, затем кнопки-иконки и меню ⋯, ярус диалога, в конце строки заголовка (под заголовком, когда не помещаются)${section ? `; в конце заголовка \`${name}.Section\`` : ""}. Выборы — в \`${name}.Fields\`. В \`${name}.Footer\` — группа в начале.`,
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
      name: `${name}.Fields`,
      en: "`ref` → `HTMLDivElement`. The record's value pickers (`Select`s: status, assignee) as one row under the title row of `Header`, above a `Tabs.List`; tier `xs` by itself, each at its content width, the row wraps when narrow. Each picker has its own `aria-label`.",
      ru: "Выборы записи (`Select`: статус, ответственный) одной строкой под строкой заголовка `Header`, над `Tabs.List`; ярус `xs` задан сам, каждый по ширине содержимого, тесная строка переносится. У каждого выбора свой `aria-label`.",
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
      en: "`ref` → `HTMLSpanElement`. Optional mark of the header row, 48 px: an `aria-hidden` tone tile; around the record's picture (an `Avatar.Root` or a `Thumbnail.Root` inside) no tile (`data-media`).",
      ru: "Необязательная метка строки шапки, 48 px: `aria-hidden` плашка с заливкой тона; вокруг картинки записи (`Avatar.Root` или `Thumbnail.Root` внутри) плашки нет (`data-media`).",
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
          en: "An `Icon`, or the record's picture: an `Avatar.Root` or a `Thumbnail.Root` (or a `ProgressCircle`), sized by the slot.",
          ru: "`Icon` или картинка записи: `Avatar.Root`, `Thumbnail.Root` (или `ProgressCircle`) — размер задаёт слот.",
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
      name: `${name}.Title`,
      en: "`ref` → `HTMLHeadingElement`. `<h2>` (16/24) of the header row; its id names the dialog. In a record header (an `Icon`, `Badges` or a `number`) one line with an ellipsis, giving way to the badges; in a question dialog it wraps.",
      ru: "`<h2>` (16/24) строки шапки; его id даёт диалогу имя. В шапке записи (`Icon`, `Badges` или `number`) — одна строка с многоточием, уступает бейджам; в диалоге-вопросе переносится.",
      props: [
        {
          name: "number",
          type: "ReactNode",
          en: "The record's number («#678», «№ 1042», «INV-2026-0142»): muted after the name, never cut, part of the dialog's name. Never in `Description`.",
          ru: "Номер записи («#678», «№ 1042», «INV-2026-0142»): приглушённый после имени, не обрезается, входит в имя диалога. Не в `Description`.",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The name loads (a record opened by a link): a `Skeleton` holds the title line and `aria-busy` is set, so the header never moves; the name fades in.",
          ru: "Имя загружается (запись открыта по ссылке): `Skeleton` держит строку заголовка и ставит `aria-busy`, шапка не сдвигается; имя проявляется.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLHeadingElement>, "id">',
          en: "`className`, `children` and the other attributes except `id` (the dialog owns it).",
          ru: "`className`, `children` и остальные атрибуты, кроме `id` (его задаёт диалог).",
        },
      ],
    },
    {
      name: `${name}.Description`,
      en: "`ref` → `HTMLParagraphElement`. `<p>` (14/20) under the title; its id describes the dialog. In a record header one line with an ellipsis, a `StatusDot` may stand first; in a question dialog it wraps.",
      ru: "`<p>` (14/20) под заголовком; его id даёт диалогу описание. В шапке записи — одна строка с многоточием, первым может стоять `StatusDot`; в диалоге-вопросе переносится.",
      props: [
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "Its data loads: a `Skeleton` holds the line's place and `aria-busy` is set, so the header never moves; the data fades in.",
          ru: "Данные строки загружаются: `Skeleton` держит её место и ставит `aria-busy`, шапка не сдвигается; данные проявляются.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLParagraphElement>, "id">',
          en: "`className`, `children` and the other attributes except `id` (the dialog owns it).",
          ru: "`className`, `children` и остальные атрибуты, кроме `id` (его задаёт диалог).",
        },
      ],
    },
    {
      name: `${name}.Badges`,
      en: "`ref` → `HTMLDivElement`. The badges after the title, on its line: one `Badge.Group`, chip tier `m`, one row, the rest folds into «+N». A status or person picker is a `Select` in `Fields`.",
      ru: "Бейджи после заголовка, на его строке: один `Badge.Group`, ярус чипов `m`, один ряд, остальное в «+N». Выбор статуса или человека — `Select` в `Fields`.",
      props: [
        {
          name: "loading",
          type: "boolean",
          default: "false",
          en: "The record loads: a `Skeleton` holds the line and `aria-busy` is set, so the header never moves; the badges fade in.",
          ru: "Запись загружается: `Skeleton` держит строку и ставит `aria-busy`, шапка не сдвигается; бейджи проявляются.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: '`children` (`Badge.Root`s), `className`, `aria-label` (a named row is `role="group"`) and the other attributes of the row.',
          ru: '`children` (`Badge.Root`), `className`, `aria-label` (названный ряд — `role="group"`) и остальные атрибуты ряда.',
        },
      ],
    },
    {
      name: `${name}.Body`,
      en: "`ref` → `HTMLDivElement`. The only scrolling zone (a ScrollContainer), 16 gap between blocks. No line parts it from the header and the footer: while it is scrolled its edge fades under them.",
      ru: "Единственная прокручиваемая зона (ScrollContainer), зазор 16 между блоками. Линии между ней, шапкой и подвалом нет: пока она прокручена, её край гаснет под ними.",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className`, `children` and the other attributes of the zone.",
          ru: "`className`, `children` и остальные атрибуты зоны.",
        },
      ],
    },
    ...(section ? [dialogSectionPart(name)] : []),
    {
      name: `${name}.Footer`,
      en: `\`ref\` → \`HTMLElement\`. Renders \`<footer>\` with the actions, primary last, with no line above it, only while it holds something (it enters and closes up in place); at the start one thing — an optional \`${name}.Actions\` (an action apart) and \`Meta\`.`,
      ru: `Рисует \`<footer>\` с действиями, главное последним, без линии над ним, только пока в нём что-то есть (появляется и схлопывается на месте); в начале одно — необязательные \`${name}.Actions\` (отдельное действие) и \`Meta\`.`,
      props: [
        {
          name: "layout",
          type: '"fill" | "end"',
          ...("value" in footerDefault
            ? { default: footerDefault.value }
            : { defaultNote: footerDefault.note }),
          en: "`fill`: equal-width buttons in one row, wrapping rather than cutting a label; `end`: auto width, at the end. Stacked on phones (viewport below 640 px) and in a dialog narrower than 360 px.",
          ru: "`fill` — кнопки равной ширины в ряд, переносятся, а не режут подпись; `end` — по содержимому у края. На телефоне (уже 640 px) и в диалоге уже 360 px — столбиком.",
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
      en: "No DOM, no ref. Holds the dialog from anywhere inside Content, where the form state lives; renders only the built-in «discard changes?» confirm. While `busy` or `dirty` the browser also asks before the tab closes or reloads. Closing from code is never held.",
      ru: "Удерживает окно изнутри Content, где живёт состояние формы; своего DOM нет, кроме встроенного подтверждения. Пока `busy` или `dirty`, браузер тоже спрашивает перед закрытием или перезагрузкой вкладки. Закрытие кодом не удерживается.",
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
