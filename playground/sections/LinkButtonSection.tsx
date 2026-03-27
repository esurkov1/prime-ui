import { PageContent } from "@/components/page-content/PageContent";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import LinkButtonCompositionSnippet from "../snippets/link-button/composition";
import linkButtonCompositionSource from "../snippets/link-button/composition.tsx?raw";
import LinkButtonExternalLinkSnippet from "../snippets/link-button/external-link";
import linkButtonExternalLinkSource from "../snippets/link-button/external-link.tsx?raw";
import LinkButtonSizesSnippet from "../snippets/link-button/sizes";
import linkButtonSizesSource from "../snippets/link-button/sizes.tsx?raw";
import LinkButtonStatesSnippet from "../snippets/link-button/states";
import linkButtonStatesSource from "../snippets/link-button/states.tsx?raw";

const linkButtonRootApiRows = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "нет",
    description:
      "Размер строки: кегль, отступы между элементами и контекст для вложенных иконок (ControlSizeProvider).",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "нет",
    description:
      'Недоступное состояние: рендерится span с role="link", без href и без перехода; aria-disabled и tabIndex={-1}.',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "нет",
    description: "Текст, иконки и прочая разметка внутри ссылки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "нет",
    description: "Дополнительный CSS-класс корневого элемента.",
  },
  {
    prop: "href",
    type: "string",
    defaultValue: "—",
    required: "нет",
    description:
      "Адрес перехода; на активной ссылке попадает в нативный <a>; при disabled не используется.",
  },
  {
    prop: "…anchorProps",
    type: "React.AnchorHTMLAttributes<HTMLAnchorElement>",
    defaultValue: "—",
    required: "нет",
    description:
      "Остальные атрибуты ссылки: target, rel, download, onClick, title, aria-*, tabIndex и т.д.; ref пробрасывается на <a> или <span>.",
  },
];

export default function LinkButtonSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>LinkButton</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Ссылка в стиле интерфейса: цвет текста, подчёркивание при наведении и при фокусе с
              клавиатуры, четыре размера. Для действий «сделать что-то» без перехода по URL лучше
              использовать кнопку.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Ряд ссылок с пропом <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
              <code>xl</code> — одна визуальная линия, разная плотность текста и отступов.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={linkButtonSizesSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <LinkButtonSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Обычная ссылка с <code>href</code> и вариант с <code>disabled</code>: без навигации,
              внешний вид «приглушённый» через <code>data-disabled</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={linkButtonStatesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <LinkButtonStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция с иконками</DemoSectionTitle>
            <DemoDescription>
              Произвольные дочерние узлы: компонент <code>Icon</code> подхватывает размер из
              контекста корня; для ссылки только с иконкой задайте <code>aria-label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={linkButtonCompositionSource.trim()}
              previewLayout="row"
            >
              <PlaygroundExampleFrame.Stage>
                <LinkButtonCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Внешняя ссылка</DemoSectionTitle>
            <DemoDescription>
              Атрибуты <code>target</code> и <code>rel</code> из стандартного API{" "}
              <code>&lt;a&gt;</code> — для открытия в новой вкладке укажите{" "}
              <code>rel=&quot;noopener noreferrer&quot;</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={linkButtonExternalLinkSource.trim()}
              previewLayout="stack"
            >
              <PlaygroundExampleFrame.Stage>
                <LinkButtonExternalLinkSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>LinkButton.Root</DemoApiTitle>
            <DemoDescription>
              Корневой узел: интерактивный <code>&lt;a&gt;</code> или недоступный{" "}
              <code>&lt;span role=&quot;link&quot;&gt;</code> при <code>disabled</code>. Стили и
              data-атрибуты размера — из модуля компонента.
            </DemoDescription>
            <PlaygroundApiTable rows={linkButtonRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
