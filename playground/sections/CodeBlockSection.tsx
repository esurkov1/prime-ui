import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import CodeBlockCompositionSnippet from "../snippets/code-block/composition";
import compositionSource from "../snippets/code-block/composition.tsx?raw";
import CodeBlockControlledSnippet from "../snippets/code-block/controlled";
import controlledSource from "../snippets/code-block/controlled.tsx?raw";
import CodeBlockFeaturesSnippet from "../snippets/code-block/features";
import featuresSource from "../snippets/code-block/features.tsx?raw";
import CodeBlockFullWidthSnippet from "../snippets/code-block/full-width";
import fullWidthSource from "../snippets/code-block/full-width.tsx?raw";
import CodeBlockSizesSnippet from "../snippets/code-block/sizes";
import sizesSource from "../snippets/code-block/sizes.tsx?raw";
import CodeBlockVariantsSnippet from "../snippets/code-block/variants";
import variantsSource from "../snippets/code-block/variants.tsx?raw";

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
    prop: "colorScheme",
    type: '"light" | "dark"',
    defaultValue: '"light"',
    required: "Нет",
    description: "Палитра токенов подсветки: data-theme на корне для селекторов в стилях.",
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
    <PlaygroundDocPage
      title="Code Block"
      description={
        <>
          Статичный фрагмент кода на TypeScript или TSX с подсветкой синтаксиса средствами кита.
          Схему оформления можно зафиксировать пропом <code>colorScheme</code> независимо от темы
          страницы; размер шрифта задаётся снаружи — компонент наследует кегль и межстрочный
          интервал от родителя.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Отдельного пропа <code>size</code> нет: четыре обёртки с разными <code>font-size</code>{" "}
            и <code>line-height</code> (токены типографики), внутри один и тот же{" "}
            <code>CodeBlock.Root</code> с <code>colorScheme</code> из темы плейграунда.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CodeBlockSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты</DemoSectionTitle>
          <DemoDescription>
            Визуальный режим подсветки — <code>colorScheme=&quot;light&quot;</code> и{" "}
            <code>&quot;dark&quot;</code> на одном фрагменте, без переключения темы всей страницы.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CodeBlockVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Проп <code>code</code> берётся из состояния: кнопки переключают два разных фрагмента
            (утилита и хук).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CodeBlockControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Карточка «документации API»: заголовок и пояснение на <code>Typography.Root</code>, блок
            кода вложен в панель с фоном.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CodeBlockCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Узкая колонка и <code>overflow-x: auto</code> на обёртке; у <code>CodeBlock.Root</code>{" "}
            — класс <code>codeBlockFullBleed</code>, чтобы длинная строка растягивала пре и
            появлялась прокрутка.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CodeBlockFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Атрибуты доступности и тестов: <code>id</code>, <code>aria-label</code>,{" "}
            <code>data-snippet-kind</code>, оформление через <code>style</code> на корне. В строке
            кода в конце намеренно оставлены пробелы — перед подсветкой срабатывает{" "}
            <code>trimEnd</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CodeBlockFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>CodeBlock.Root</DemoApiTitle>
          <DemoDescription>
            Корень выводит <code>pre</code> с вложенным <code>code</code>; HTML подсветки строится
            функцией <code>highlightTsxHtml</code> и подставляется через{" "}
            <code>dangerouslySetInnerHTML</code> (передавайте только доверенный исходник).
          </DemoDescription>
          <PlaygroundApiTable rows={codeBlockRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
