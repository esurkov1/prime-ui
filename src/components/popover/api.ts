import type { ComponentApi } from "../../../scripts/docs/componentApi";

export const api: ComponentApi = {
  parts: [
    {
      name: "Popover.Root",
      en: "No DOM, no ref. Open state and dismiss policy.",
      ru: "Состояние открытия и политика закрытия; своего DOM нет.",
      props: [
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
          ru: "Начальное открытие без контроля.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          en: "Called on every open and close: trigger, `Popover.Close`, Escape, outside press, code.",
          ru: "Вызывается при каждом открытии и закрытии: триггер, `Popover.Close`, Escape, клик снаружи, код.",
        },
        {
          name: "closeOnOutsideClick",
          type: "boolean",
          default: "true",
          en: "A pointerdown outside the panel and its trigger closes it; focus follows the pointer.",
          ru: "Нажатие вне панели и триггера закрывает её; фокус остаётся там, куда нажали.",
        },
        {
          name: "closeOnEscape",
          type: "boolean",
          default: "true",
          en: "Escape closes the panel and returns focus to the trigger.",
          ru: "Escape закрывает панель и возвращает фокус на триггер.",
        },
        {
          name: "openOnArrow",
          type: "boolean",
          default: "false",
          en: "ArrowDown and ArrowUp on the trigger open the panel, as on a picker whose trigger reads as a field (a colour, a period); Enter and Space open it either way.",
          ru: "ArrowDown и ArrowUp на триггере открывают панель, как у выбора, чей триггер похож на поле (цвет, период); Enter и Space открывают её в любом случае.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Trigger (or Anchor) and Content.",
          ru: "Trigger (или Anchor) и Content.",
        },
      ],
    },
    {
      name: "Popover.Trigger · Popover.Anchor · Popover.Close",
      en: "No DOM: clone the single child and merge `ref` and `onClick`. Trigger toggles the panel and sets its ARIA; Anchor only positions the panel (open state comes from `open`), and its control names a panel without a Title; Close closes the panel.",
      ru: "Без DOM: клонируют единственный дочерний элемент и сливают `ref` и `onClick`. Trigger открывает и закрывает панель и ставит ARIA; Anchor только задаёт положение (открытием управляет `open`), а его контрол даёт имя панели без Title; Close закрывает панель.",
      props: [
        {
          name: "children",
          type: "ReactElement",
          required: true,
          en: "One element, usually a Button (Anchor: any element, e.g. a toolbar).",
          ru: "Один элемент, обычно Button (у Anchor — любой, например панель инструментов).",
        },
      ],
    },
    {
      name: "Popover.Content",
      en: '`ref` → `HTMLDivElement`. Portal + `role="dialog"` floating panel that scrolls inside, named by `Popover.Title` (else by the control it opened from). Below 640px of viewport, opened from a Trigger, it is a bottom sheet (`data-sheet`).',
      ru: 'Портал и плавающая панель `role="dialog"` с прокруткой внутри; имя — `Popover.Title`, иначе контрол, из которого её открыли. Уже 640px экрана, открытая из Trigger, она становится шторкой снизу (`data-sheet`).',
      props: [
        {
          name: "side",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"bottom"',
          en: "Preferred side; flips to the opposite side when there is no room.",
          ru: "Желаемая сторона; при нехватке места панель переходит на противоположную.",
        },
        {
          name: "align",
          type: '"auto" | "start" | "center" | "end"',
          default: '"auto"',
          en: "Alignment along the trigger. `auto` lines the panel up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix the edge.",
          ru: "Выравнивание по триггеру. `auto` выравнивает панель по краю триггера, за которым больше места; `start`, `center` или `end` задают край явно.",
        },
        {
          name: "size",
          type: '"xs" | "s" | "m" | "l" | "xl"',
          default: '"m"',
          en: "Tier of the text, padding and gap; also the size context of the controls inside.",
          ru: "Ярус текста, отступов и зазора; его же получают контролы внутри.",
        },
        {
          name: "width",
          type: '"auto" | "trigger" | "content"',
          default: '"auto"',
          en: "`auto`: by content, from the panel minimum to twice that. `trigger`: exactly the trigger's width, below the minimum too. `content`: what the content needs, within the viewport. A sheet is full width.",
          ru: "`auto` — по содержимому, от минимума панели до двойного. `trigger` — ровно по триггеру, даже уже минимума. `content` — сколько нужно содержимому, в пределах экрана. Шторка — на всю ширину.",
        },
        {
          name: "trapFocus",
          type: "boolean",
          default: "false",
          en: "Tab cycles inside the panel (forms). Without it Tab past the last (Shift+Tab before the first) stop closes the panel and returns focus to the trigger.",
          ru: "Tab ходит по кругу внутри панели (формы). Без него Tab за последний элемент закрывает панель и возвращает фокус на триггер.",
        },
        {
          name: "initialFocus",
          type: "boolean",
          defaultNote: {
            en: "`true` with `Popover.Trigger`, `false` with `Popover.Anchor`",
            ru: "`true` с `Popover.Trigger`, `false` с `Popover.Anchor`",
          },
          en: "Focus moves into the panel on open (`[data-autofocus]`, else the first tab stop, else the panel). Turn it on for an anchored panel opened by a command, such as a Dropdown item, so focus does not stay on the menu trigger.",
          ru: "Фокус переходит в панель при открытии (`[data-autofocus]`, иначе первый фокусируемый, иначе панель). Включите для панели с `Anchor`, открытой командой — пунктом Dropdown, — чтобы фокус не остался на кнопке меню.",
        },
        {
          name: "flush",
          type: "boolean",
          default: "false",
          en: "No inner padding and no gap: rows and dividers reach the panel edges; the content lays out its own spacing.",
          ru: "Без внутренних полей и зазора: строки и разделители доходят до краёв, отступы задаёт содержимое.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "role">',
          en: "`className` and the other attributes of the panel.",
          ru: "`className` и остальные атрибуты панели.",
        },
      ],
    },
    {
      name: "Popover.Header · Popover.Title · Popover.Description · Popover.Actions",
      en: "`ref` → `HTMLDivElement` / `HTMLHeadingElement` / `HTMLParagraphElement` / `HTMLDivElement`. `<div>` (title + description) / `<h2>` (names the dialog) / `<p>` (describes it) / `<div>` (buttons at the end; stacked in a sheet).",
      ru: "`<div>` (заголовок и описание) / `<h2>` (имя диалога) / `<p>` (его описание) / `<div>` (кнопки у края; в шторке — столбиком).",
      props: [
        {
          name: "…rest",
          type: "HTMLAttributes<HTMLDivElement | HTMLHeadingElement | HTMLParagraphElement>",
          en: "`className`, `children` and the other attributes; an own `id` on Title or Description is the one the panel points at.",
          ru: "`className`, `children` и остальные атрибуты; собственный `id` у Title или Description — тот, на который ссылается панель.",
        },
      ],
    },
  ],
  labels: [],
  accessibility: {
    keyboard: [
      {
        keys: "Enter · Space",
        en: "On the trigger: opens the panel (focus moves into it) and closes it.",
        ru: "На триггере открывает панель (фокус переходит в неё) и закрывает.",
      },
      {
        keys: "ArrowDown · ArrowUp",
        en: "On the trigger with `openOnArrow`: opens the panel.",
        ru: "На триггере с `openOnArrow` открывает панель.",
      },
      {
        keys: "Escape",
        en: "Closes the panel (`closeOnEscape`); focus returns to the trigger.",
        ru: "Закрывает панель (`closeOnEscape`); фокус возвращается на триггер.",
      },
      {
        keys: "Tab",
        en: "Moves through the panel content; with `trapFocus` it cycles inside the panel, without it Tab past the last stop closes the panel and goes on from the trigger.",
        ru: "Переходит по содержимому панели; с `trapFocus` ходит по кругу, без него Tab за последний элемент закрывает панель и идёт дальше от триггера.",
      },
    ],
    aria: [
      {
        en: 'The panel is `role="dialog"` without `aria-modal`, named by `Popover.Title` (its own `id` included), else by the control it opened from — the trigger, or the control inside `Popover.Anchor` — read from the page, and described by `Popover.Description`.',
        ru: 'Панель — `role="dialog"` без `aria-modal`; имя — `Popover.Title` (с его собственным `id` тоже), иначе контрол, из которого её открыли, — триггер или контрол внутри `Popover.Anchor`, взятый со страницы; описание — `Popover.Description`.',
      },
      {
        en: 'The trigger gets `aria-haspopup="dialog"`, `aria-expanded`, `data-state` and, while open, `aria-controls`; the child\'s own `id` wins. Other props given to `Popover.Trigger` (handlers, ARIA, `ref`) reach the child, so a wrapping `Tooltip.Trigger` keeps working.',
        ru: 'Триггер получает `aria-haspopup="dialog"`, `aria-expanded`, `data-state`, а пока панель открыта — `aria-controls`; собственный `id` ребёнка сохраняется. Остальные пропсы `Popover.Trigger` (обработчики, ARIA, `ref`) доходят до ребёнка, поэтому обёртка `Tooltip.Trigger` продолжает работать.',
      },
      {
        en: "Opened from a Trigger, focus moves into the panel: `[data-autofocus]`, else the first tab stop, else the panel. Opened at a `Popover.Anchor`, focus stays in the anchor (`initialFocus` moves it in), and presses on the anchor do not dismiss the panel.",
        ru: "При открытии от Trigger фокус уходит в панель: `[data-autofocus]`, иначе первая точка Tab, иначе сама панель. При открытии у `Popover.Anchor` фокус остаётся в якоре (`initialFocus` переносит его внутрь), а нажатия на якорь панель не закрывают.",
      },
      {
        en: "`Popover.Close` closes the panel and returns focus to the trigger, unless the child's own `onClick` calls `preventDefault()`.",
        ru: "`Popover.Close` закрывает панель и возвращает фокус на триггер, если собственный `onClick` ребёнка не вызвал `preventDefault()`.",
      },
      {
        en: "An outside press closes the panel without moving focus back to the trigger: focus follows the pointer (foundation §8).",
        ru: "Клик снаружи закрывает панель без возврата фокуса на триггер: фокус остаётся там, куда нажали (foundation §8).",
      },
      {
        en: "Only the topmost layer reacts: a Select open inside the panel closes first.",
        ru: "Реагирует только верхний слой: Select, открытый внутри панели, закрывается первым.",
      },
    ],
  },
};
