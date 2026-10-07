import { PageContent } from "@/components/page-content/PageContent";
import AppShellContainedExample from "@/layout/app-shell/examples/contained";
import containedSource from "@/layout/app-shell/examples/contained.tsx?raw";
import AppShellWithSidebarExample from "@/layout/app-shell/examples/with-sidebar";
import appShellSource from "@/layout/app-shell/examples/with-sidebar.tsx?raw";
import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "fillViewport",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Оболочка высотой во вьюпорт: прокручивается только `AppShell.Main`. Без него прокручивается документ, а навигация липкая.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корневой `<div>`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "`AppShell.Nav` — колонка навигации на холсте; всё остальное (`Header`, `Main`) попадает в панель контента на поверхности.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного div, включая `ref` (forwardRef).",
  },
];

const navRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на слоте навигации в сетке (`<div>`, не landmark).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Сайдбар, дерево меню и т.п.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного div.",
  },
];

const templateRows: PlaygroundApiPropRow[] = [
  {
    prop: "fillViewport",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Пробрасывается в `AppShell.Root`.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на корневой оболочке (`AppShell.Root`).",
  },
  {
    prop: "nav",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Колонка навигации: обычно `Sidebar.Root`. Без неё панель занимает всю ширину.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Контент как прямые дети `<main>`; поля и центрирование уже заданы в `AppShell.Main`.",
  },
  {
    prop: "header",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое шапки панели (`AppShell.Header`); без него шапки нет.",
  },
  {
    prop: "mainProps",
    type: 'Omit<AppShellMainProps, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы на `main`, например `contentWidth`; ref Template тоже попадает на `main`.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты на `AppShell.Root` (без `children` / `ref`).",
  },
];

const headerRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Хлебные крошки, поиск, действия — flex-ряд с зазором 12 px.",
  },
  {
    prop: "className / …rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты `<header>`, включая `ref`.",
  },
];

const mainRows: PlaygroundApiPropRow[] = [
  {
    prop: "contentWidth",
    type: '"contained" | "full"',
    defaultValue: '"full"',
    required: "Нет",
    description:
      "`full` — на всю ширину панели с адаптивными полями 16 / 24 / 32 px; `contained` — по центру, не шире `--prime-layout-content-max-width` (1200 px), для страниц с длинным текстом.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на `<main>`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Дочерние узлы внутри `<main>`; поля колонки на самом `main`; в `Template` дополнительно сброс прокрутки при смене маршрута.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного main, включая `ref` (forwardRef).",
  },
];

export default function AppShellSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>AppShell</PageContent.Title>
        <PageContent.Description measure="full">
          Каркас приложения: две плоскости во всю высоту, край в край — слева{" "}
          <code>AppShell.Nav</code> на холсте, справа контент на поверхности. Без отступов,
          радиусов, теней и рамок: границу даёт только смена заливки. В контенте — необязательная
          липкая <code>AppShell.Header</code> и прокручиваемая <code>AppShell.Main</code>: сверху 24
          → 40 px (от 1024 px), поля 16 → 24 → 32; с <code>contentWidth=&quot;contained&quot;</code>{" "}
          колонка по центру и не шире 1200 px. Карточки внутри становятся утопленными плитками.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Сайдбар, шапка и страница</DemoSectionTitle>
            <DemoDescription>
              <code>Sidebar</code> в <code>AppShell.Nav</code>, хлебные крошки в{" "}
              <code>AppShell.Header</code>, заголовок с действием и карточка в{" "}
              <code>AppShell.Main</code>. С <code>fillViewport</code> прокручивается только{" "}
              <code>main</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={appShellSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <AppShellWithSidebarExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Колонка для длинного текста</DemoSectionTitle>
            <DemoDescription>
              Без <code>AppShell.Nav</code> панель занимает всю ширину;{" "}
              <code>contentWidth=&quot;contained&quot;</code> на <code>AppShell.Main</code>{" "}
              центрирует колонку и ограничивает её <code>--prime-layout-content-max-width</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={containedSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <AppShellContainedExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>AppShell.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootRows} />
            <DemoApiTitle>AppShell.Template</DemoApiTitle>
            <PlaygroundApiTable rows={templateRows} />
            <DemoApiTitle>AppShell.Nav</DemoApiTitle>
            <PlaygroundApiTable rows={navRows} />
            <DemoApiTitle>AppShell.Header</DemoApiTitle>
            <PlaygroundApiTable rows={headerRows} />
            <DemoApiTitle>AppShell.Main</DemoApiTitle>
            <PlaygroundApiTable rows={mainRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
