import type { ComponentApi } from "../../../scripts/docs/componentApi";

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
    default: '"m"',
    en: "Padding, icon and text tier of the card.",
    ru: "Ярус отступов, иконки и текста карточки.",
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
    en: "One soft button under the text, one tier below the card.",
    ru: "Одна мягкая кнопка под текстом, на ярус меньше карточки.",
  },
];

export const api: ComponentApi = {
  parts: [
    {
      name: "NotificationProvider",
      en: "No ref. Wraps the app once: keeps the toasts and renders their stacks in a portal (one stack per position × tone).",
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
          en: "Max toasts per stack; older ones are dropped.",
          ru: "Максимум уведомлений в стопке; старые убираются.",
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
      name: "useNotifications()",
      en: "Must be called inside `NotificationProvider`; returns the store.",
      ru: "Вызывается внутри `NotificationProvider`; возвращает хранилище.",
      props: [
        {
          name: "notify",
          type: "(options: NotificationOptions) => string",
          en: "Shows a toast and returns its id.",
          ru: "Показывает уведомление и возвращает его id.",
        },
        {
          name: "dismiss",
          type: "(id: string) => void",
          en: "Closes one toast with its exit animation.",
          ru: "Закрывает одно уведомление с анимацией ухода.",
        },
        {
          name: "dismissAll",
          type: "() => void",
          en: "Closes every toast.",
          ru: "Закрывает все уведомления.",
        },
        {
          name: "items",
          type: "NotificationRecord[]",
          en: "Active toasts (without the ones playing their exit).",
          ru: "Активные уведомления (без уходящих).",
        },
      ],
    },
    {
      name: "notify(options)",
      en: "`NotificationOptions`: what the toast shows and how it closes.",
      ru: "`NotificationOptions`: что показывает уведомление и как оно закрывается.",
      props: [
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
      ],
    },
    {
      name: "NotificationCard",
      en: 'No ref. A static `<article role="status|alert">` card without a timer: inline confirmations, docs, mockups.',
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
          name: "className",
          type: "string",
          en: "Extra class on the card.",
          ru: "Дополнительный класс карточки.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "close",
      default: "Закрыть уведомление",
      en: "`aria-label` of the close button.",
      ru: "`aria-label` кнопки закрытия.",
    },
    {
      key: "regionTopLeft",
      default: "Уведомления сверху слева",
      en: "Name of the top-left toast list.",
      ru: "Имя списка уведомлений сверху слева.",
    },
    {
      key: "regionTopCenter",
      default: "Уведомления сверху по центру",
      en: "Name of the top-center toast list.",
      ru: "Имя списка уведомлений сверху по центру.",
    },
    {
      key: "regionTopRight",
      default: "Уведомления сверху справа",
      en: "Name of the top-right toast list.",
      ru: "Имя списка уведомлений сверху справа.",
    },
    {
      key: "regionBottomLeft",
      default: "Уведомления снизу слева",
      en: "Name of the bottom-left toast list.",
      ru: "Имя списка уведомлений снизу слева.",
    },
    {
      key: "regionBottomCenter",
      default: "Уведомления снизу по центру",
      en: "Name of the bottom-center toast list.",
      ru: "Имя списка уведомлений снизу по центру.",
    },
    {
      key: "regionBottomRight",
      default: "Уведомления снизу справа",
      en: "Name of the bottom-right toast list.",
      ru: "Имя списка уведомлений снизу справа.",
    },
  ],
};
