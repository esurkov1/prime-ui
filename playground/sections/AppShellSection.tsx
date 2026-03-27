import { PageContent } from "@/components/page-content/PageContent";
import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoSectionTitle } from "../components/PlaygroundDemoTypography";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "fillViewport",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Если true, корневой слой растягивается на высоту вьюпорта (типично для shell приложения с фиксированным сайдбаром и прокручиваемым main).",
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
    description: "Обычно `AppShell.Nav` + `AppShell.Main`.",
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
    required: "Да",
    description: "Левая колонка: напр. `Sidebar.Root` или `nav`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Контент в `AppShell.Main` (`<main>`).",
  },
  {
    prop: "navProps",
    type: 'Omit<AppShellNavProps, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы на слот навигации.",
  },
  {
    prop: "mainProps",
    type: 'Omit<AppShellMainProps, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы на основную колонку (ref сюда же через forwardRef на `Main`).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты на `AppShell.Root` (без `children` / `ref`).",
  },
];

const mainRows: PlaygroundApiPropRow[] = [
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
    description: "Основной контент страницы.",
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
          {
            <>
              Каркас: CSS Grid — <strong>nav</strong> (<code>AppShell.Nav</code>,{" "}
              <code>data-layout-region=&quot;nav&quot;</code>) и <strong>main</strong> (
              <code>AppShell.Main</code>, <code>data-layout-region=&quot;main&quot;</code>).{" "}
              <code>AppShell.Template</code> помечает корень как{" "}
              <code>data-layout-template=&quot;app&quot;</code>: на широком экране — поля у колонки{" "}
              <code>Nav</code> от края экрана и зазор между колонками при открытом{" "}
              <code>Sidebar</code> (<code>sidebarSlot=&quot;page-nav&quot;</code>). Поля контентной
              колонки задаются в приложении (например обёртка с <code>padding</code> внутри{" "}
              <code>main</code>, <code>PageContent.Root</code> и т.д.). В плейграунде —{" "}
              <code>PlaygroundLayout</code>.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>AppShell.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootRows} />
            <DemoApiTitle>AppShell.Template</DemoApiTitle>
            <PlaygroundApiTable rows={templateRows} />
            <DemoApiTitle>AppShell.Nav</DemoApiTitle>
            <PlaygroundApiTable rows={navRows} />
            <DemoApiTitle>AppShell.Main</DemoApiTitle>
            <PlaygroundApiTable rows={mainRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
