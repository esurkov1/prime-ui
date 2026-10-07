import CodeBlockApiDocsExample from "@/components/code-block/examples/api-docs";
import apiDocsSource from "@/components/code-block/examples/api-docs.tsx?raw";
import CodeBlockColorSchemeExample from "@/components/code-block/examples/color-scheme";
import colorSchemeSource from "@/components/code-block/examples/color-scheme.tsx?raw";
import CodeBlockControlledExample from "@/components/code-block/examples/controlled";
import controlledSource from "@/components/code-block/examples/controlled.tsx?raw";
import CodeBlockLongLinesExample from "@/components/code-block/examples/long-lines";
import longLinesSource from "@/components/code-block/examples/long-lines.tsx?raw";
import CodeBlockSurfacesExample from "@/components/code-block/examples/surfaces";
import surfacesSource from "@/components/code-block/examples/surfaces.tsx?raw";
import CodeBlockVariantsExample from "@/components/code-block/examples/variants";
import variantsSource from "@/components/code-block/examples/variants.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const codeBlockRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "code",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description:
      "Исходник TS/TSX; перед подсветкой у конца обрезаются пробельные символы (trimEnd).",
  },
  {
    prop: "variant",
    type: '"soft" | "ghost"',
    defaultValue: '"soft"',
    required: "Нет",
    description:
      "soft — утопленная панель с отступами, роль текста code (13/20), горизонтальная прокрутка, tabIndex=0. ghost — голый pre, кегль и фон от хоста.",
  },
  {
    prop: "colorScheme",
    type: '"light" | "dark"',
    defaultValue: "— (тема страницы)",
    required: "Нет",
    description:
      "Зафиксировать схему только для блока (data-theme на pre). Без пропа блок следует теме страницы.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс для элемента pre.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLPreElement>, "children" | "dangerouslySetInnerHTML">',
    defaultValue: "—",
    required: "Нет",
    description:
      "id, style, role, aria-*, data-*, on* и прочие атрибуты pre; children и dangerouslySetInnerHTML в типе исключены — разметка задаётся компонентом.",
  },
];

export default function CodeBlockSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Code Block</PageContent.Title>
        <PageContent.Description measure="full">
          Статичный фрагмент TypeScript или TSX с подсветкой синтаксиса. По умолчанию — утопленная
          панель без обводки (<code>variant=&quot;soft&quot;</code>); <code>ghost</code> отдаёт
          кегль и фон хосту. Цвета токенов следуют теме страницы, схему можно зафиксировать{" "}
          <code>colorScheme</code>. Пропа <code>size</code> нет: это не контрол, размер текста —
          роль <code>code</code> или кегль хоста.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Оформление</DemoSectionTitle>
            <DemoDescription>
              <code>soft</code> — панель с отступами 12/16 и радиусом <code>m</code>;{" "}
              <code>ghost</code> — голый <code>pre</code> для хоста, который рисует свою панель
              (здесь — акцентная подложка с мелким кеглем).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <CodeBlockVariantsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Цветовая схема</DemoSectionTitle>
            <DemoDescription>
              <code>colorScheme=&quot;light&quot;</code> и <code>&quot;dark&quot;</code> на одном
              фрагменте без переключения темы страницы; зафиксированный блок получает{" "}
              <code>bg-raised</code>, чтобы читаться внутри противоположной темы.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={colorSchemeSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <CodeBlockColorSchemeExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>На поверхностях</DemoSectionTitle>
            <DemoDescription>
              Подложка <code>soft</code> (<code>fill-muted</code>) одинаково читается на холсте, в
              карточке, во всплывающем слое и на акцентном фоне.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={surfacesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery>
                  <CodeBlockSurfacesExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Смена фрагмента</DemoSectionTitle>
            <DemoDescription>
              Проп <code>code</code> берётся из состояния: переключатель меняет показываемый
              фрагмент.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <CodeBlockControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Длинные строки</DemoSectionTitle>
            <DemoDescription>
              Блок занимает ширину колонки, длинная строка прокручивается внутри. Блок{" "}
              <code>soft</code> — остановка <kbd>Tab</kbd>, чтобы прокрутку можно было сделать с
              клавиатуры; если переполнения не бывает, передайте{" "}
              <code>tabIndex=&#123;-1&#125;</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={longLinesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <CodeBlockLongLinesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Фрагмент документации API: заголовок и пояснение на <code>Typography.Root</code>, ниже
              пример ответа с <code>aria-label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={apiDocsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <CodeBlockApiDocsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>CodeBlock.Root</DemoApiTitle>
            <DemoDescription>
              Выводит <code>pre</code> с вложенным <code>code</code>; HTML подсветки строит{" "}
              <code>highlightTsxHtml</code> и подставляет через <code>dangerouslySetInnerHTML</code>{" "}
              — передавайте только доверенный исходник.
            </DemoDescription>
            <PlaygroundApiTable rows={codeBlockRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
