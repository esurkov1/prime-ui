import type { ComponentApi } from "../../../scripts/docs/componentApi";

const VIEWPORT = '"desktop" | "tablet" | "mobile"';

export const api: ComponentApi = {
  parts: [
    {
      name: "ExampleFrame",
      en: "`ref` → `HTMLDivElement`. The documentation frame: a toolbar (pane switch, theme toggle, copy button, device switch) above the preview stage or the code pane.",
      ru: "Рамка документации: панель (вид, тема, копирование, ширина) над превью или кодом.",
      props: [
        {
          name: "code",
          type: "string",
          required: true,
          en: "Source shown on the code pane (TS / TSX highlighting via CodeBlock) and copied by the copy button.",
          ru: "Исходник для вкладки кода (подсветка через CodeBlock) и для кнопки копирования.",
        },
        {
          name: "previewLayout",
          type: '"default" | "stack" | "stack-narrow" | "full" | "row" | "matrix"',
          default: '"default"',
          en: "How the preview lays out its children, so snippets need no wrapper divs (see Variants).",
          ru: "Как превью раскладывает детей, чтобы примерам не нужны были обёртки (см. «Варианты» в COMPONENT.md).",
        },
        {
          name: "viewport",
          type: VIEWPORT,
          en: "Preview width (controlled).",
          ru: "Ширина превью (управляемый режим).",
        },
        {
          name: "defaultViewport",
          type: VIEWPORT,
          default: '"desktop"',
          en: "Initial preview width (uncontrolled).",
          ru: "Начальная ширина превью (неуправляемый режим).",
        },
        {
          name: "onViewportChange",
          type: `(viewport: ${VIEWPORT}) => void`,
          en: "Called with the new width from the device switch.",
          ru: "Вызывается с новой шириной из переключателя устройств.",
        },
        {
          name: "colorScheme",
          type: '"light" | "dark"',
          en: "Theme of the stage and code pane (controlled); the page theme is untouched.",
          ru: "Тема превью и кода (управляемый режим); тема страницы не меняется.",
        },
        {
          name: "defaultColorScheme",
          type: '"light" | "dark"',
          default: '"light"',
          en: "Initial theme (uncontrolled).",
          ru: "Начальная тема (неуправляемый режим).",
        },
        {
          name: "onColorSchemeChange",
          type: '(scheme: "light" | "dark") => void',
          en: "Called with the new theme from the theme toggle.",
          ru: "Вызывается с новой темой из переключателя темы.",
        },
        {
          name: "showThemeToggle",
          type: "boolean",
          default: "true",
          en: "Show the light / dark toggle in the toolbar.",
          ru: "Показывать переключатель темы на панели.",
        },
        {
          name: "onCopy",
          type: "() => void",
          en: "Called after `code` was copied to the clipboard.",
          ru: "Вызывается после копирования `code` в буфер.",
        },
        {
          name: "labels",
          type: "Partial<ExampleFrameLabels>",
          en: "Built-in strings, see Labels.",
          ru: "Системные строки, см. «Доступность».",
        },
        {
          name: "children",
          type: "ReactNode",
          en: "Preview content, laid out by `previewLayout`.",
          ru: "Содержимое превью, раскладка — `previewLayout`.",
        },
        {
          name: "…rest",
          type: 'Omit<HTMLAttributes<HTMLDivElement>, "onCopy">',
          en: "`className` and the other attributes of the frame `<div>`.",
          ru: "`className` и остальные атрибуты `<div>` рамки.",
        },
      ],
    },
  ],
  labels: [
    {
      key: "paneSwitch",
      default: "Вид примера",
      en: "`aria-label` of the Preview / Code switch.",
      ru: "`aria-label` переключателя «Превью / Код».",
    },
    { key: "preview", default: "Превью", en: "Preview pane option.", ru: "Вариант «превью»." },
    { key: "code", default: "Код", en: "Code pane option.", ru: "Вариант «код»." },
    {
      key: "viewportSwitch",
      default: "Ширина превью",
      en: "`aria-label` of the device switch.",
      ru: "`aria-label` переключателя устройств.",
    },
    { key: "desktop", default: "Десктоп", en: "Desktop width option.", ru: "Ширина десктопа." },
    { key: "tablet", default: "Планшет", en: "Tablet width option.", ru: "Ширина планшета." },
    { key: "mobile", default: "Телефон", en: "Phone width option.", ru: "Ширина телефона." },
    {
      key: "copy",
      default: "Копировать код",
      en: "Copy button `aria-label`.",
      ru: "`aria-label` кнопки копирования.",
    },
    {
      key: "copied",
      default: "Скопировано",
      en: "Copy button after success.",
      ru: "Кнопка копирования после успеха.",
    },
    {
      key: "copyError",
      default: "Не удалось скопировать",
      en: "Copy button after a failure.",
      ru: "Кнопка копирования после ошибки.",
    },
    {
      key: "themeDark",
      default: "Включить тёмную тему",
      en: "Theme toggle in the light theme.",
      ru: "Переключатель темы в светлой теме.",
    },
    {
      key: "themeLight",
      default: "Включить светлую тему",
      en: "Theme toggle in the dark theme.",
      ru: "Переключатель темы в тёмной теме.",
    },
    {
      key: "codeRegion",
      default: "Код примера",
      en: "`aria-label` of the code pane.",
      ru: "`aria-label` области кода.",
    },
  ],
};
