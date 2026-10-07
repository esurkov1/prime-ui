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
      en: "`ref` → `HTMLDivElement`. `<div>` that owns the active value, size and orientation and lays out the list and the panel.",
      ru: "Хранит активную вкладку, размер и направление; раскладывает список и панель.",
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
          en: "Control tier: tab height 28 · 32 · 36 · 40 · 48, text, icon, radius, spacing, indicator thickness.",
          ru: "Ярус контрола: высота вкладки 28 · 32 · 36 · 40 · 48, кегль, иконка, отступы, толщина индикатора.",
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
      en: 'No ref. `role="tablist"` on a `ScrollContainer` (horizontal, edge fade, hidden scrollbar) with the sliding indicator; scrolls instead of wrapping.',
      ru: '`role="tablist"` на `ScrollContainer` со скользящим индикатором: прокручивается с затуханием краёв вместо переноса.',
      props: [
        {
          name: "children",
          type: "ReactNode",
          en: "`Tabs.Item`s.",
          ru: "Вкладки `Tabs.Item`.",
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
      en: 'No ref. One tab, a `<button role="tab">`; plain text children are wrapped in `Tabs.Label`.',
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
          name: "children",
          type: "ReactNode",
          required: true,
          en: "Plain text, or `Tabs.Icon` / `Tabs.Label` / `Tabs.Count` / `Tabs.Description`. A description makes the tab two-line.",
          ru: "Текст или `Tabs.Icon` / `Tabs.Label` / `Tabs.Count` / `Tabs.Description`. Описание делает вкладку двухстрочной.",
        },
        {
          name: "…rest",
          type: 'Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type" | "role" | "onClick">',
          en: "`className`, `aria-*` and the other button attributes.",
          ru: "`className`, `aria-*` и остальные атрибуты кнопки.",
        },
      ],
    },
    {
      name: "Tabs.Icon",
      en: "No ref. Decorative icon (`aria-hidden`) before the label; muted, accent on the active tab.",
      ru: "Декоративная иконка перед подписью; приглушённая, на активной вкладке — акцентная.",
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
      en: "No ref. Title; truncates and keeps a stable width when it turns medium weight.",
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
      en: "No ref. Counter `Badge` after the label, one tier below the tabs size.",
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
          name: "className",
          type: "string",
          en: "Extra class.",
          ru: "Дополнительный класс.",
        },
      ],
    },
    {
      name: "Tabs.Description",
      en: "No ref. Muted second line; becomes the tab's `aria-describedby`.",
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
      name: "Tabs.Panel",
      en: 'No ref. `<div role="tabpanel">`, focusable, rendered only while its tab is active.',
      ru: '`<div role="tabpanel">`, фокусируемая; рендерится только пока её вкладка активна.',
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
  labels: [],
};
