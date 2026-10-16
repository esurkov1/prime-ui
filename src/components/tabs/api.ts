import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { TABS_LABELS } from "./Tabs";

export const api: ComponentApi = {
  parts: [
    {
      name: "Tabs.Root",
      en: "`ref` → `HTMLDivElement`. `<div>` that owns the active value, size and orientation; no surface of its own — it stands in the host's padding. In a Modal or Drawer it wraps `X.Header` (with `Tabs.List` last) and `X.Body`.",
      ru: "`<div>`, который хранит активную вкладку, размер и направление; своей поверхности нет — стоит в отступах хоста. В Modal и Drawer оборачивает `X.Header` (с `Tabs.List` последним) и `X.Body`.",
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
          en: "List direction and arrow keys. Vertical: a column of sections beside the panel, which becomes a horizontal strip in a container below 600px.",
          ru: "Направление списка и стрелок. Вертикальный: колонка разделов рядом с панелью; в контейнере уже 600px она становится горизонтальной полосой.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус хоста, иначе `"m"`' },
          en: "Control tier: text, icon, spacing, folder radius and the gap between the strip and the panel; a tab is at least the control height. Without it the tier of the host.",
          ru: "Ярус контрола: кегль, иконка, отступы, скругление папки и зазор между полосой и панелью; вкладка не ниже высоты контрола. Без него — ярус хоста.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "true",
          en: "Horizontal tabs fill the list and tend to equal widths within `minItemWidth` … `maxItemWidth`; `false` sizes each tab to its content within the same bounds.",
          ru: "Горизонтальные вкладки заполняют список и стремятся к равной ширине в пределах `minItemWidth` … `maxItemWidth`; `false` — каждая по своему содержимому в тех же пределах.",
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
          defaultNote: { en: "2.5 × control height", ru: "2,5 × высота контрола" },
          en: "Narrowest a horizontal tab with a label gets, px or a CSS length; a tab is also never narrower than its content (up to `maxItemWidth`).",
          ru: "Наименьшая ширина горизонтальной вкладки с подписью, px или CSS-длина; вкладка к тому же не уже своего содержимого (до `maxItemWidth`).",
        },
        {
          name: "maxItemWidth",
          type: "number | string",
          defaultNote: { en: "7 × control height", ru: "7 × высота контрола" },
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
      en: '`ref` → `HTMLDivElement`. `role="tablist"` on the switcher row (a sideways `ScrollContainer`) with the sliding folder. When tabs do not fit it hides icons and descriptions, then labels (only when every tab has an icon), then scrolls; the active tab stays in view.',
      ru: '`role="tablist"` на строке переключателя (горизонтальный `ScrollContainer`) со скользящей папкой. Если вкладки не помещаются, скрывает иконки и описания, затем подписи (только если иконка есть у каждой вкладки), затем прокручивается; активная вкладка остаётся на виду.',
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
          type: "() => void | Promise<void>",
          en: "Makes the tab closable (close button, `Delete` / `Backspace`, middle click); remove the item from your list here. Return a promise to confirm first: rejected, the tab stays.",
          ru: "Делает вкладку закрываемой (кнопка закрытия, `Delete` / `Backspace`, средний клик); уберите вкладку из своего списка здесь. Верните промис, чтобы сначала спросить: отклонён — вкладка остаётся.",
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
      ru: "Декоративная иконка (`aria-hidden`) перед подписью; приглушённая, на активной вкладке — акцентная. Скрывается первой, когда вкладки не помещаются; остаётся последней, когда не помещается ничего другого.",
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: 'The icon, e.g. `<Icon name="field.calendar" />`.',
          ru: 'Иконка, например `<Icon name="field.calendar" />`.',
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
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
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
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
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
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
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLSpanElement>, "children">',
          en: "`className` and the other span attributes.",
          ru: "`className` и остальные атрибуты span.",
        },
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
      en: "`ref` → `HTMLDivElement`. `<div role=\"tabpanel\">`, focusable, rendered only while its tab is active (with `keepMounted`, kept hidden once opened). No fill and no padding: its content is the host's content, aligned with the strip's edges. Content opened after mount enters.",
      ru: '`<div role="tabpanel">`, фокусируемая; рендерится только пока её вкладка активна (с `keepMounted` — после первого открытия остаётся скрытой). Без фона и отступов: её содержимое — контент хоста, по краям полосы вкладок. Содержимое, открытое после показа, появляется.',
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          en: "Tab value this panel belongs to.",
          ru: "Значение вкладки, которой принадлежит панель.",
        },
        {
          name: "keepMounted",
          type: "boolean",
          default: "false",
          en: "Once opened, the panel stays mounted and `hidden` while another tab is active: its data, form draft and scroll survive a switch. A panel never opened is not mounted.",
          ru: "После первого открытия панель остаётся смонтированной и `hidden`, пока активна другая вкладка: данные, черновик формы и прокрутка переживают переключение. Ни разу не открытая панель не монтируется.",
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
  labels: labelRows(TABS_LABELS, {
    remove: {
      en: "Accessible name of the close button of a removable tab; `{label}` is the tab title (its value when the title is not text).",
      ru: "Имя кнопки закрытия вкладки; `{label}` — подпись вкладки (её значение, если подпись не текст).",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "ArrowLeft · ArrowRight",
        en: "Select the neighbouring tab, wrapping and skipping disabled ones; also work in a vertical list.",
        ru: "Выбирают соседнюю вкладку по кругу, пропуская неактивные; в вертикальном списке тоже работают.",
      },
      {
        keys: "ArrowUp · ArrowDown",
        en: "The same in a vertical list.",
        ru: "То же в вертикальном списке.",
      },
      {
        keys: "Home · End",
        en: "First and last enabled tab.",
        ru: "Первая и последняя доступная вкладка.",
      },
      {
        keys: "Delete · Backspace",
        en: "Close a tab with `onRemove`; closing the active tab selects and focuses its neighbour.",
        ru: "Закрывают вкладку с `onRemove`; если она была активной, выбор и фокус переходят к соседней.",
      },
      {
        keys: "Tab",
        en: "Enters the active tab (roving tabindex), then moves to the panel.",
        ru: "Входит в активную вкладку (roving tabindex), затем переходит в панель.",
      },
    ],
    aria: [
      {
        en: "WAI-ARIA tabs pattern: `tablist` / `tab` / `tabpanel` with `aria-controls` / `aria-labelledby` wired automatically; a tab names its panel in `aria-controls` only while the panel is in the document. Give `Tabs.List` an `aria-label`.",
        ru: "Паттерн WAI-ARIA tabs: `tablist` / `tab` / `tabpanel`, `aria-controls` и `aria-labelledby` связываются сами; вкладка указывает панель в `aria-controls`, только пока та в документе. Дайте `Tabs.List` `aria-label`.",
      },
      {
        en: "Selection follows focus; the panel is focusable (`tabIndex=0`).",
        ru: "Выбор следует за фокусом; панель фокусируема (`tabIndex=0`).",
      },
      {
        en: "In a two-line tab the accessible name is label (+ count); `Tabs.Description` becomes `aria-describedby`.",
        ru: "В двухстрочной вкладке имя — подпись и счётчик, `Tabs.Description` — `aria-describedby`.",
      },
      {
        en: "`Tabs.Icon` and `Tabs.Separator` are `aria-hidden`.",
        ru: "`Tabs.Icon` и `Tabs.Separator` скрыты (`aria-hidden`).",
      },
      {
        en: "When only icons are left, a `VisuallyHidden` copy of the label names the tab and the label shows in a `Tooltip` on hover and focus.",
        ru: "Когда остаются только иконки, вкладку называет копия подписи в `VisuallyHidden`, а сама подпись показывается в `Tooltip` при наведении и фокусе.",
      },
      {
        en: 'The close button of a removable tab is named after it (`labels.remove`) and stays out of the Tab order; the tab announces `aria-keyshortcuts="Delete"`.',
        ru: 'Кнопка закрытия названа по вкладке (`labels.remove`) и не входит в порядок Tab; у вкладки `aria-keyshortcuts="Delete"`.',
      },
    ],
  },
};
