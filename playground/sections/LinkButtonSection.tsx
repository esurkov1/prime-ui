import LinkButtonCompositionExample from "@/components/link-button/examples/composition";
import linkButtonCompositionSource from "@/components/link-button/examples/composition.tsx?raw";
import LinkButtonExternalLinkExample from "@/components/link-button/examples/external-link";
import linkButtonExternalLinkSource from "@/components/link-button/examples/external-link.tsx?raw";
import LinkButtonSizesExample from "@/components/link-button/examples/sizes";
import linkButtonSizesSource from "@/components/link-button/examples/sizes.tsx?raw";
import LinkButtonStatesExample from "@/components/link-button/examples/states";
import linkButtonStatesSource from "@/components/link-button/examples/states.tsx?raw";
import LinkButtonTonesExample from "@/components/link-button/examples/tones";
import linkButtonTonesSource from "@/components/link-button/examples/tones.tsx?raw";
import LinkButtonWithIconExample from "@/components/link-button/examples/with-icon";
import linkButtonWithIconSource from "@/components/link-button/examples/with-icon.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const linkButtonRootApiRows = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "нет",
    description:
      "Ярус контрола: кегль, межстрочный интервал и размер вложенных иконок (ControlSizeProvider). xl берёт кегль title-l (18).",
  },
  {
    prop: "tone",
    type: '"accent" | "neutral"',
    defaultValue: '"accent"',
    required: "нет",
    description:
      "accent — обычная ссылка; neutral — вторичный текст, на наведении основной: футеры, метаданные.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "нет",
    description:
      'Недоступное состояние: рендерится span с role="link", без href и без перехода; aria-disabled и tabIndex={-1}. Остальные атрибуты ссылки при этом не передаются.',
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
          Текстовая ссылка с размерами контролов: акцентный или нейтральный тон, подчёркивание при
          наведении, общее кольцо фокуса. Пять размеров <code>xs</code>–<code>xl</code>. Для
          действий без перехода по адресу используйте Button (<code>variant=&quot;ghost&quot;</code>
          ).
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> · <code>xl</code>:
              кегль и иконка берутся из яруса контрола, по умолчанию <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={linkButtonSizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <LinkButtonSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Тон</DemoSectionTitle>
            <DemoDescription>
              <code>tone=&quot;accent&quot;</code> (по умолчанию) — обычная ссылка;{" "}
              <code>tone=&quot;neutral&quot;</code> — вторичный текст, на наведении становится
              основным. Подходит для футеров и метаданных.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={linkButtonTonesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <LinkButtonTonesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Наведите курсор — появляется подчёркивание, <kbd>Tab</kbd> — кольцо фокуса.{" "}
              <code>disabled</code> рендерит <code>span role=&quot;link&quot;</code> без{" "}
              <code>href</code> и убирает ссылку из порядка табуляции.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={linkButtonStatesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <LinkButtonStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>С иконкой</DemoSectionTitle>
            <DemoDescription>
              <code>Icon</code> без <code>size</code> наследует ярус ссылки; иконка декоративная,
              имя ссылки — её текст.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={linkButtonWithIconSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <LinkButtonWithIconExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Карточка входа: ссылка внутри текста, ссылка рядом с кнопкой того же размера и
              нейтральные служебные ссылки размера <code>s</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={linkButtonCompositionSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <LinkButtonCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Внешняя ссылка</DemoSectionTitle>
            <DemoDescription>
              <code>target=&quot;_blank&quot;</code> и{" "}
              <code>rel=&quot;noopener noreferrer&quot;</code> пробрасываются в нативный{" "}
              <code>&lt;a&gt;</code>; о новой вкладке сообщите в тексте.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={linkButtonExternalLinkSource.trim()}
              previewLayout="row"
            >
              <PlaygroundExampleFrame.Stage>
                <LinkButtonExternalLinkExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>LinkButton.Root</DemoApiTitle>
            <DemoDescription>
              Нативный <code>&lt;a&gt;</code> или недоступный <code>span</code>; размер передаётся
              вложенным иконкам.
            </DemoDescription>
            <PlaygroundApiTable rows={linkButtonRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
