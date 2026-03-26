import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "code",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description:
      "Исходный текст для вкладки «Код», копирования в буфер и подсветки через CodeBlock.",
  },
  {
    prop: "language",
    type: "string",
    defaultValue: '"tsx"',
    required: "Нет",
    description: "Зарезервировано; подсветка ориентирована на TS/TSX.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Превью компонентов. Если среди детей есть ExampleFrame.Stage, в превью попадают только его дети; иначе рендерятся все children.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на корневой обёртке фрейма.",
  },
  {
    prop: "colorScheme",
    type: '"light" | "dark"',
    defaultValue: "—",
    required: "Нет",
    description: "Управляемая цветовая схема превью (контролируемый режим).",
  },
  {
    prop: "defaultColorScheme",
    type: '"light" | "dark"',
    defaultValue: '"light"',
    required: "Нет",
    description: "Начальная схема в неконтролируемом режиме.",
  },
  {
    prop: "onColorSchemeChange",
    type: '(scheme: "light" | "dark") => void',
    defaultValue: "—",
    required: "Нет",
    description: "Колбэк при смене light/dark.",
  },
  {
    prop: "viewport",
    type: '"desktop" | "tablet" | "mobile"',
    defaultValue: "—",
    required: "Нет",
    description: "Управляемая ширина превью.",
  },
  {
    prop: "defaultViewport",
    type: '"desktop" | "tablet" | "mobile"',
    defaultValue: '"tablet"',
    required: "Нет",
    description: "Начальная ширина в неконтролируемом режиме.",
  },
  {
    prop: "onViewportChange",
    type: '(v: "desktop" | "tablet" | "mobile") => void',
    defaultValue: "—",
    required: "Нет",
    description: "Колбэк при смене вьюпорта.",
  },
  {
    prop: "showThemeToggle",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Показывать ли переключатель светлой/тёмной темы в тулбаре.",
  },
  {
    prop: "onCopy",
    type: "() => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается после успешного копирования code в буфер.",
  },
  {
    prop: "previewLayout",
    type: "ExampleFramePreviewLayout",
    defaultValue: '"default"',
    required: "Нет",
    description:
      "Раскладка внутри превью: default, stack, stack-center, stack-narrow, dense-stack, row, row-start, row-wrap.",
  },
  {
    prop: "themePreset",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Синхронизация с data-theme-preset на превью (например как у html в playground), чтобы цвета не расходились с оболочкой.",
  },
];

const stageRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Содержимое, которое попадает только в превью (обходной путь без лишних обёрток в сниппетах).",
  },
];

export default function ExampleFrameSection() {
  return (
    <PlaygroundDocPage
      title="ExampleFrame"
      description={
        <>
          Фрейм «превью + код» для документации и демо: тулбар с переключением вкладок, выбором
          ширины устройства и копированием исходника. В плейграунде обёртка{" "}
          <code>PlaygroundExampleFrame</code> строится поверх этого API. В каталоге основных
          компонентов отдельной страницы с живыми примерами нет — это вспомогательный блок для
          показа кода рядом с UI.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>ExampleFrame.Root</DemoApiTitle>
          <PlaygroundApiTable rows={rootRows} />
          <DemoApiTitle>ExampleFrame.Stage</DemoApiTitle>
          <PlaygroundApiTable rows={stageRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
