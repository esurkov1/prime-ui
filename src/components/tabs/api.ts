import type { ComponentApi } from "../../../scripts/docs/componentApi";

const SPAN_REST = {
  name: "…rest",
  type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
  en: "`className` and the other span attributes.",
  ru: "`className` и остальные атрибуты span.",
};

export const api: ComponentApi = {
  parts: [
    {
      name: "Tabs.Root",
      en: "`ref` → `HTMLDivElement`. `<div>` that owns the active value, size and orientation and lays out the list and the panel; horizontal, it is the frame and a layer of the surface ladder: a strip two steps off the layer over the panel in the layer's own color.",
      ru: "Хранит активную вкладку, размер и направление; раскладывает список и панель. В горизонтальном режиме это рамка и слой лестницы поверхностей: полоса на два шага от слоя над панелью цвета слоя.",
      props: [
        {
          name: "value",
          type: "string",
          en: "Active tab (controlled).",
          ru: "Активная вкладка (управляемый режим).",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          en: 'Initial active tab (uncontrolled). With `""` no tab is selected.',
          ru: 'Начальная вкладка (неуправляемый режим). При `""` ни одна не выбрана.',
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          en: "Called with the new active value.",
          ru: "Вызывается с новым значением активной вкладки.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          en: "List direction and arrow keys. A vertical list stacks above the panel when the container is narrower than 600px.",
          ru: "Направление списка и стрелок. Вертикальный список встаёт над панелью, когда контейнер уже 600px.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Control tier: text, icon, spacing, folder radius and panel padding. A horizontal tab is the control height plus the folder rise on both sides; a vertical one is the control height.",
          ru: "Ярус контрола: кегль, иконка, отступы, скругление папки и отступ панели. Горизонтальная вкладка — высота контрола плюс подъём папки сверху и снизу; вертикальная — высота контрола.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "true",
          en: "Horizontal tabs fill the list and tend to equal widths within `minItemWidth` … `maxItemWidth`, never narrower than their content: a long label keeps its width, short ones share the rest; when they do not fit, the list collapses, then scrolls. `false` sizes each tab to its content within the same bounds.",
          ru: "Горизонтальные вкладки заполняют список и стремятся к равной ширине в пределах `minItemWidth` … `maxItemWidth`, но не уже своего содержимого: длинная подпись сохраняет ширину, короткие делят остаток; если не помещаются, список сворачивается, затем прокручивается. `false` — каждая по своему содержимому в тех же пределах.",
        },
        {
          name: "tone",
          type: '"neutral" | "accent"',
          default: '"neutral"',
          en: "Colour of the active tab: `neutral` is primary text with an accent icon, `accent` puts text and icon in accent.",
          ru: "Цвет активной вкладки: `neutral` — основной текст с акцентной иконкой, `accent` — текст и иконка в акцентном цвете.",
        },
        {
          name: "minItemWidth",
          type: "number | string",
          default: "2.5 × control height",
          en: "Narrowest a horizontal tab with a label gets, px or a CSS length; a tab is also never narrower than its content (up to `maxItemWidth`). When tabs do not fit, the list collapses, then scrolls. Icon-only tabs are square.",
          ru: "Наименьшая ширина горизонтальной вкладки с подписью, px или CSS-длина; вкладка к тому же не уже своего содержимого (до `maxItemWidth`). Если вкладки не помещаются, список сворачивается, затем прокручивается. Вкладки-иконки квадратные.",
        },
        {
          name: "maxItemWidth",
          type: "number | string",
          default: "7 × control height",
          en: 'Widest a horizontal tab gets, px or a CSS length (`"none"` lifts the cap); a longer label ends with an ellipsis.',
          ru: 'Наибольшая ширина горизонтальной вкладки, px или CSS-длина (`"none"` снимает предел); длиннее — подпись обрезается многоточием.',
        },
        {
          name: "labels",
          type: "Partial<TabsLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "`Tabs.List` and `Tabs.Panel`s.",
          ru: "`Tabs.List` и `Tabs.Panel`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">',
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Tabs.List",
      en: '`ref` → `HTMLDivElement`. `role="tablist"` on a `ScrollContainer` (horizontal, edge fade, hidden scrollbar) with the sliding folder (vertical: pill), which glides only into a choice by click or keys and is placed without motion on mount, resize and collapse. When tabs do not fit or a label would be cut, it hides icons and descriptions, then labels (icons with tooltips stay; only when every tab has an icon); then the list scrolls; a label is never cut to make room. The active tab is kept in view: only the list scrolls, never the page.',
      ru: '`role="tablist"` на `ScrollContainer` со скользящей папкой (в вертикальном режиме — пилюлей): она скользит только к вкладке, выбранной кликом или клавишами, а при монтировании, изменении размера и сворачивании встаёт без анимации. Если вкладки не помещаются или подпись пришлось бы обрезать, скрывает иконки и описания, затем подписи (остаются иконки с подсказками; только если иконка есть у каждой вкладки); затем список прокручивается; подпись ради места не обрезается. Активная вкладка остаётся в поле зрения: прокручивается только список, не страница.',
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "`Tabs.Item`s and `Tabs.Separator`s.",
          ru: "Вкладки `Tabs.Item` и разделители `Tabs.Separator`.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`aria-label` (name the list), `className` and the other div attributes; `role`, `aria-orientation` and `onKeyDown` are set by the list.",
          ru: "`aria-label` (имя списка), `className` и остальные атрибуты div; `role`, `aria-orientation` и `onKeyDown` задаёт список.",
        },
      ],
    },
    {
      name: "Tabs.Item",
      en: '`ref` → `HTMLButtonElement`. One tab, a `<button role="tab">` in an item wrapper that also holds the close button of a removable tab; plain text children are wrapped in `Tabs.Label`.',
      ru: 'Одна вкладка — `<button role="tab">`; простой текст оборачивается в `Tabs.Label`.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Value that selects this tab and its panel.",
          ru: "Значение, выбирающее вкладку и её панель.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          en: "Disables the tab; clicks and arrow keys skip it.",
          ru: "Отключает вкладку; клик и стрелки её пропускают.",
        },
        {
          name: "onRemove",
          type: "() => void",
          en: "Makes the tab closable: a close button (shown on the active tab, on hover and focus, always on touch screens), `Delete` / `Backspace` and a middle click. Closing the active tab first selects its neighbour; remove the item from your list here.",
          ru: "Делает вкладку закрываемой: кнопка закрытия (видна на активной вкладке, при наведении и фокусе, на сенсорных экранах всегда), `Delete` / `Backspace` и средний клик. Закрытие активной вкладки сначала выбирает соседнюю; уберите вкладку из своего списка в этом обработчике.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Plain text, or `Tabs.Icon` / `Tabs.Label` / `Tabs.Count` / `Tabs.Description`. A description makes the tab two-line.",
          ru: "Текст или `Tabs.Icon` / `Tabs.Label` / `Tabs.Count` / `Tabs.Description`. Описание делает вкладку двухстрочной.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type" | "role" | "onClick">',
          en: "`className`, `aria-*` and the other button attributes; your `onKeyDown` / `onAuxClick` run first and `preventDefault()` keeps the tab open.",
          ru: "`className`, `aria-*` и остальные атрибуты кнопки; ваши `onKeyDown` / `onAuxClick` выполняются первыми, `preventDefault()` не даёт закрыть вкладку.",
        },
      ],
    },
    {
      name: "Tabs.Icon",
      en: "`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`) before the label; muted, accent on the active tab. Hidden first when tabs do not fit; the last thing left when nothing else fits.",
      ru: "Декоративная иконка перед подписью; приглушённая, на активной вкладке — акцентная. Скрывается первой, когда вкладки не помещаются; остаётся последней, когда не помещается ничего другого.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="field.calendar" />`.',
          ru: 'Иконка, например `<Icon name="field.calendar" />`.',
        },
        SPAN_REST,
      ],
    },
    {
      name: "Tabs.Label",
      en: "`ref` → `HTMLSpanElement`. Title; truncates and keeps a stable width when it turns medium weight.",
      ru: "Подпись; обрезается многоточием и не меняет ширину при выделении.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Title text.",
          ru: "Текст подписи.",
        },
        SPAN_REST,
      ],
    },
    {
      name: "Tabs.Count",
      en: "`ref` → `HTMLSpanElement`. Counter `Badge` after the label, one tier below the tabs size.",
      ru: "Счётчик `Badge` после подписи, на ярус меньше вкладок.",
      props: [
        {
          name: "color",
          type: '"gray" | "blue" | "green" | "orange" | "red" | "yellow" | "purple" | "sky" | "pink" | "teal"',
          default: '"gray"',
          en: "Badge hue.",
          ru: "Оттенок бейджа.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The number.",
          ru: "Число.",
        },
        SPAN_REST,
      ],
    },
    {
      name: "Tabs.Description",
      en: "`ref` → `HTMLSpanElement`. Muted second line; becomes the tab's `aria-describedby`.",
      ru: "Приглушённая вторая строка; становится `aria-describedby` вкладки.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Second-line text; wrap a key value in `<strong>`.",
          ru: "Текст второй строки; ключевое значение оберните в `<strong>`.",
        },
        SPAN_REST,
      ],
    },
    {
      name: "Tabs.Separator",
      en: "`ref` → `HTMLDivElement`. A `Divider` hairline between groups of tabs, across the list direction; hidden from assistive tech.",
      ru: "Черта `Divider` между группами вкладок поперёк списка; скрыта от вспомогательных технологий.",
      props: [
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "children">',
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
    {
      name: "Tabs.Panel",
      en: '`ref` → `HTMLDivElement`. `<div role="tabpanel">`, focusable, rendered only while its tab is active; horizontal, the padded surface the folder rises from. Its content enters each time it opens.',
      ru: '`<div role="tabpanel">`, фокусируемая; рендерится только пока её вкладка активна. В горизонтальном режиме — поверхность с отступами, из которой вырастает папка. Содержимое появляется при каждом открытии.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Tab value this panel belongs to.",
          ru: "Значение вкладки, которой принадлежит панель.",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Panel content.",
          ru: "Содержимое панели.",
        },
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement>",
          en: "`className` and the other div attributes.",
          ru: "`className` и остальные атрибуты div.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "remove",
      default: "Закрыть вкладку «{label}»",
      en: "Accessible name of the close button of a removable tab; `{label}` is the tab title (its value when the title is not text).",
      ru: "Имя кнопки закрытия вкладки; `{label}` — подпись вкладки (её значение, если подпись не текст).",
    },
  ],
};
