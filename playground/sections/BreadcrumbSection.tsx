import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import BreadcrumbCompositionSnippet from "../snippets/breadcrumb/composition";
import breadcrumbCompositionSource from "../snippets/breadcrumb/composition.tsx?raw";
import BreadcrumbFullWidthSnippet from "../snippets/breadcrumb/full-width";
import breadcrumbFullWidthSource from "../snippets/breadcrumb/full-width.tsx?raw";
import BreadcrumbLongEllipsisSnippet from "../snippets/breadcrumb/long-ellipsis";
import breadcrumbLongEllipsisSource from "../snippets/breadcrumb/long-ellipsis.tsx?raw";
import BreadcrumbSizesSnippet from "../snippets/breadcrumb/sizes";
import breadcrumbSizesSource from "../snippets/breadcrumb/sizes.tsx?raw";
import BreadcrumbStatesSnippet from "../snippets/breadcrumb/states";
import breadcrumbStatesSource from "../snippets/breadcrumb/states.tsx?raw";

const breadcrumbRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Элементы списка: Item, Separator, Ellipsis внутри <ol>.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Доп. класс на <nav>.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Кегль ссылок, текущей страницы, многоточия; иконки разделителя и «дом».",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      "Атрибуты nav: например aria-label (по умолчанию задаётся «Breadcrumb»), id, data-*.",
  },
];

const breadcrumbItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "href",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Если задан — рендерится LinkButton; иначе span.",
  },
  {
    prop: "current",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: 'Текущая страница: стиль и aria-current="page" на span.',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст или иконка пункта.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Доп. класс на <li>.",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Для ссылки без видимого текста (например, только иконка «дом»).",
  },
];

const breadcrumbSeparatorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "Icon nav.chevronRight",
    required: "Нет",
    description: "Кастомный разделитель; по умолчанию шеврон в тоне subtle.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Доп. класс на <li aria-hidden>.",
  },
];

const breadcrumbEllipsisApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Доп. класс на <li> с символом многоточия.",
  },
];

export default function BreadcrumbSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Breadcrumb</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Цепочка от раздела до текущей страницы: по пути можно переходить по ссылкам, последний
              пункт показывает, где вы сейчас. Один параметр размера подстраивает подписи,
              многоточие и иконки разделителя.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Четыре ряда с <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
              <code>xl</code> на <code>Breadcrumb.Root</code> — общий масштаб для всей цепочки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={breadcrumbSizesSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <BreadcrumbSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Сверху: промежуточные пункты с <code>href</code>, финал с <code>current</code>{" "}
              (текущая страница). Снизу: средний сегмент без <code>href</code> — обычный текст в{" "}
              <code>span</code>, не ссылка.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={breadcrumbStatesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <BreadcrumbStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Первый пункт только с иконкой: класс <code>itemHome</code> из стилей крошек и
              обязательный <code>aria-label</code> на <code>Item</code>. Разделители заменены на
              символ через <code>children</code> у <code>Separator</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={breadcrumbCompositionSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <BreadcrumbCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width / responsive</DemoSectionTitle>
            <DemoDescription>
              Список внутри корня — <code>flex</code> с <code>flex-wrap</code>: в узком контейнере
              длинные подписи переносятся на следующую строку без обрезки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={breadcrumbFullWidthSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <BreadcrumbFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
            <DemoDescription>
              Схлопывание середины пути через <code>Breadcrumb.Ellipsis</code> между разделителями —
              удобно для глубокой вложенности каталога или документации.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={breadcrumbLongEllipsisSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <BreadcrumbLongEllipsisSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Breadcrumb.Root</DemoApiTitle>
            <DemoDescription>
              Обёртка-<code>nav</code> с подписью для скринридеров, список-<code>ol</code> и
              контекст размера для дочерних частей.
            </DemoDescription>
            <PlaygroundApiTable rows={breadcrumbRootApiRows} />
            <DemoApiTitle>Breadcrumb.Item</DemoApiTitle>
            <DemoDescription>
              Элемент списка: ссылка через внутренний <code>LinkButton</code> или текстовый{" "}
              <code>span</code> для текущей страницы и необязательных «заголовков» без перехода.
            </DemoDescription>
            <PlaygroundApiTable rows={breadcrumbItemApiRows} />
            <DemoApiTitle>Breadcrumb.Separator</DemoApiTitle>
            <DemoDescription>
              Служебный пункт между сегментами: по умолчанию иконка-шеврон, скрыт от вспомогательных
              технологий через <code>aria-hidden</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={breadcrumbSeparatorApiRows} />
            <DemoApiTitle>Breadcrumb.Ellipsis</DemoApiTitle>
            <DemoDescription>
              Визуальный маркер пропущенных уровней вложенности (символ «…» внутри <code>li</code>).
            </DemoDescription>
            <PlaygroundApiTable rows={breadcrumbEllipsisApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
