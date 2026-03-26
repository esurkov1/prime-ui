import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoSectionTitle } from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";

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
    description: "Обычно `PageShell.NavArea` + `PageShell.ContentArea`.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного div, включая `ref` (forwardRef).",
  },
];

const navAreaRows: PlaygroundApiPropRow[] = [
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

const applicationRows: PlaygroundApiPropRow[] = [
  {
    prop: "fillViewport",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Пробрасывается в `PageShell.Root`.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на корневой оболочке (`PageShell.Root`).",
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
    description: "Контент в `PageShell.ContentArea` (`<main>`).",
  },
  {
    prop: "navProps",
    type: 'Omit<PageShellNavAreaProps, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы на слот навигации.",
  },
  {
    prop: "contentProps",
    type: 'Omit<PageShellContentAreaProps, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы на основную колонку (ref сюда же через forwardRef на `ContentArea`).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты на `PageShell.Root` (без `children` / `ref`).",
  },
];

const contentAreaRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"plain" | "surface" | "page"',
    defaultValue: '"plain"',
    required: "Нет",
    description:
      "`plain` — только скролл и `main`. `surface` — карточка с полями внутри колонки. `page` — типичные поля страницы внутри `main` (доки/плейграунд).",
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

export default function PageShellSection() {
  return (
    <PlaygroundDocPage
      title="PageShell"
      description={
        <>
          Каркас: CSS Grid из двух колонок — <strong>nav area</strong> (<code>NavArea</code>,{" "}
          <code>data-prime-shell=&quot;nav-area&quot;</code>) и <strong>content area</strong> (
          <code>ContentArea</code> как <code>&lt;main&gt;</code>,{" "}
          <code>data-prime-shell=&quot;content-area&quot;</code>).{" "}
          <code>PageShell.Application</code> помечает корень как{" "}
          <code>data-prime-shell=&quot;application&quot;</code>: на широком экране — симметричные
          поля вьюпорта и зазор между колонками при открытом <code>Sidebar</code> (
          <code>sidebarSlot=&quot;page-nav&quot;</code>). Поля контента — через{" "}
          <code>ContentArea variant=&quot;page&quot;</code> или свою разметку. В плейграунде —{" "}
          <code>PlaygroundLayout</code>.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>PageShell.Root</DemoApiTitle>
          <PlaygroundApiTable rows={rootRows} />
          <DemoApiTitle>PageShell.Application</DemoApiTitle>
          <PlaygroundApiTable rows={applicationRows} />
          <DemoApiTitle>PageShell.NavArea</DemoApiTitle>
          <PlaygroundApiTable rows={navAreaRows} />
          <DemoApiTitle>PageShell.ContentArea</DemoApiTitle>
          <PlaygroundApiTable rows={contentAreaRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
