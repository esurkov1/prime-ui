import { type ComponentApi, labelRows } from "../../../scripts/docs/componentApi";
import { NOTIFICATION_LABELS } from "./Notification";

const POSITION =
  '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"';

const CONTENT = [
  {
    name: "tone",
    type: '"info" | "success" | "warning" | "danger"',
    default: '"info"',
    en: "Semantic color and tone icon; `danger` and `warning` are announced assertively.",
    ru: "Смысловой цвет и иконка тона; `danger` и `warning` объявляются сразу.",
  },
  {
    name: "title",
    type: "string",
    required: true,
    en: "The message.",
    ru: "Сообщение.",
  },
  {
    name: "description",
    type: "string",
    en: "Secondary text under the title.",
    ru: "Вторичный текст под заголовком.",
  },
  {
    name: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultNote: { en: 'host tier, else `"m"`', ru: 'ярус хоста, иначе `"m"`' },
    en: "Padding, icon and text tier of the card. Without it the tier of the host (a toast of `notify()` sits outside any host: `m`).",
    ru: "Ярус отступов, иконки и текста карточки. Без него — ярус хоста (уведомление из `notify()` вне хоста: `m`).",
  },
  {
    name: "icon",
    type: "ReactNode",
    en: "Replaces the tone icon.",
    ru: "Заменяет иконку тона.",
  },
  {
    name: "badge",
    type: "string | number",
    en: "A counter next to the title (a `Badge` in the tone hue).",
    ru: "Счётчик рядом с заголовком (`Badge` оттенка тона).",
  },
  {
    name: "action",
    type: "{ label: string; onClick: () => void }",
    en: "One soft button under the text, one tier below the card; on a toast of `notify()` it closes the toast after its `onClick` (reason `action`).",
    ru: "Одна мягкая кнопка под текстом, на ярус меньше карточки; у уведомления из `notify()` после своего `onClick` закрывает его (причина `action`).",
  },
];

export const api: ComponentApi = {
  parts: [
    {
      name: "NotificationProvider",
      en: "No DOM of its own, no ref. Wraps the app once: keeps the toasts and renders their stacks in a portal (one stack per position × tone).",
      ru: "Оборачивает приложение один раз: хранит уведомления и рендерит их стопки в портале (стопка на позицию × тон).",
      props: [
        {
          name: "position",
          type: POSITION,
          default: '"top-right"',
          en: "Default position for `notify()` calls without one.",
          ru: "Позиция по умолчанию для вызовов `notify()` без неё.",
        },
        {
          name: "max",
          type: "number",
          default: "5",
          en: "Max toasts per stack; a newer toast pushes the oldest out through its exit (reason `overflow`).",
          ru: "Максимум уведомлений в стопке; новое вытесняет самое старое, и оно уходит со своей анимацией (причина `overflow`).",
        },
        {
          name: "labels",
          type: "Partial<NotificationLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          en: "The app.",
          ru: "Приложение.",
        },
      ],
    },
    {
      name: "NotificationCard",
      en: '`ref` → `HTMLElement`. A static `<article role="status|alert">` card without a timer: inline confirmations, docs, mockups.',
      ru: 'Статичная карточка `<article role="status|alert">` без таймера: подтверждения на месте, документация, макеты.',
      props: [
        ...CONTENT,
        {
          name: "onDismiss",
          type: "() => void",
          en: "Shows the close button and is called on its click.",
          ru: "Показывает кнопку закрытия и вызывается по клику.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLElement>, "title" | "children" | "role">',
          en: "`className` and the other attributes of the `<article>`.",
          ru: "`className` и остальные атрибуты `<article>`.",
        },
      ],
    },
  ],
  types: [
    {
      name: "NotificationOptions",
      en: "The argument of `notify(options)`: what the toast shows and how it closes.",
      ru: "Аргумент `notify(options)`: что показывает уведомление и как оно закрывается.",
      fields: [
        ...CONTENT,
        {
          name: "position",
          type: POSITION,
          en: "Default: the provider's `position`.",
          ru: "По умолчанию — `position` провайдера.",
        },
        {
          name: "duration",
          type: "number",
          default: "5000",
          en: "Auto-close delay in ms; the timer pauses on hover, focus, swipe and in a hidden tab.",
          ru: "Задержка автозакрытия в мс; таймер стоит при наведении, фокусе, свайпе и в скрытой вкладке.",
        },
        {
          name: "persistent",
          type: "boolean",
          default: "false",
          en: "No timer and no countdown line.",
          ru: "Без таймера и линии обратного отсчёта.",
        },
        {
          name: "closable",
          type: "boolean",
          default: "true",
          en: "Shows the close button.",
          ru: "Показывает кнопку закрытия.",
        },
        {
          name: "onDismiss",
          type: '(reason: "timeout" | "close" | "swipe" | "action" | "dismiss" | "overflow") => void',
          en: "The toast left, with the reason: its timer ran out, the close button, a swipe, its action, `dismiss()` / `dismissAll()`, or a newer toast pushed it out of a full stack. Called once — the place to commit an action the toast offered to undo (every reason but `action`).",
          ru: "Уведомление ушло, с причиной: истёк таймер, крестик, свайп, его действие, `dismiss()` / `dismissAll()` или его вытеснило новое. Вызывается один раз — здесь применяют действие, которое уведомление предлагало отменить (при любой причине, кроме `action`).",
        },
      ],
    },
  ],
  functions: [
    {
      name: "useNotifications()",
      type: "() => { notify: (options: NotificationOptions) => string; dismiss: (id: string) => void; dismissAll: () => void; items: NotificationRecord[] }",
      en: "Called inside `NotificationProvider`; returns the store: `notify(options)` shows a toast and returns its id, `dismiss(id)` closes one with its exit animation, `dismissAll()` closes every toast, `items` holds the active toasts (without the ones playing their exit).",
      ru: "Вызывается внутри `NotificationProvider`; возвращает хранилище: `notify(options)` показывает уведомление и возвращает его id, `dismiss(id)` закрывает одно с анимацией ухода, `dismissAll()` закрывает все, `items` — активные уведомления (без уходящих).",
    },
  ],
  labels: labelRows(NOTIFICATION_LABELS, {
    close: { en: "`aria-label` of the close button.", ru: "`aria-label` кнопки закрытия." },
    regionTopLeft: {
      en: "Name of the top-left toast list.",
      ru: "Имя списка уведомлений сверху слева.",
    },
    regionTopCenter: {
      en: "Name of the top-center toast list.",
      ru: "Имя списка уведомлений сверху по центру.",
    },
    regionTopRight: {
      en: "Name of the top-right toast list.",
      ru: "Имя списка уведомлений сверху справа.",
    },
    regionBottomLeft: {
      en: "Name of the bottom-left toast list.",
      ru: "Имя списка уведомлений снизу слева.",
    },
    regionBottomCenter: {
      en: "Name of the bottom-center toast list.",
      ru: "Имя списка уведомлений снизу по центру.",
    },
    regionBottomRight: {
      en: "Name of the bottom-right toast list.",
      ru: "Имя списка уведомлений снизу справа.",
    },
  }),
  accessibility: {
    keyboard: [
      {
        keys: "Tab",
        en: "Focuses the action and the close button; focus inside a stack expands it and pauses the timers.",
        ru: "Фокус на действии и кнопке закрытия; фокус внутри стопки раскрывает её и ставит таймеры на паузу.",
      },
      {
        keys: "Enter · Space",
        en: "Presses the action or the close button.",
        ru: "Нажимает действие или кнопку закрытия.",
      },
    ],
    aria: [
      {
        en: 'Each stack is an `<ol>` named by the region label of its position; each card is an `<article>`: `role="status"` + `aria-live="polite"`, or `role="alert"` + `aria-live="assertive"` for `warning` / `danger`.',
        ru: 'Каждая стопка — `<ol>` с именем области своей позиции; карточка — `<article>`: `role="status"` + `aria-live="polite"` или `role="alert"` + `aria-live="assertive"` для `warning` / `danger`.',
      },
      {
        en: "The icon and the countdown are `aria-hidden`; the close button is named by `labels.close`.",
        ru: "Иконка скрыта (`aria-hidden`); кнопка закрытия названа `labels.close`.",
      },
      {
        en: "Focus never leaves with a toast: a card that goes while it holds focus hands it to the front card still open in its stack, else back to where focus came from.",
        ru: "Фокус не уходит вместе с уведомлением: карточка, которая уходит с фокусом, передаёт его передней открытой карточке стопки, иначе — туда, откуда фокус пришёл.",
      },
      {
        en: "A toast is a non-modal live region, not a layer of the overlay stack: Escape and a press elsewhere belong to the page and to the topmost open layer, so a toast takes no `closeOnEscape` / `closeOnOutsideClick` — it leaves by its timer, the close button, a swipe or `dismiss()`.",
        ru: "Уведомление — немодальная live-область, а не слой оверлеев: Escape и нажатие мимо принадлежат странице и верхнему открытому слою, поэтому у него нет `closeOnEscape` / `closeOnOutsideClick` — оно уходит по таймеру, крестику, свайпу или `dismiss()`.",
      },
      {
        en: "Do not keep the only copy of important information in a toast with a timer — use `persistent` or a Banner.",
        ru: "Важное не держите только в уведомлении с таймером — используйте `persistent` или Banner.",
      },
    ],
  },
};
