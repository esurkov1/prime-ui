import HintFieldStatesExample from "@/components/hint/examples/field-states";
import hintFieldStatesSource from "@/components/hint/examples/field-states.tsx?raw";
import HintHintOrErrorExample from "@/components/hint/examples/hint-or-error";
import hintControlledVariantSource from "@/components/hint/examples/hint-or-error.tsx?raw";
import HintInFormExample from "@/components/hint/examples/in-form";
import hintCompositionSource from "@/components/hint/examples/in-form.tsx?raw";
import HintSizesExample from "@/components/hint/examples/sizes";
import hintSizesSource from "@/components/hint/examples/sizes.tsx?raw";
import HintStatesExample from "@/components/hint/examples/states";
import hintVariantsSource from "@/components/hint/examples/states.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const hintRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер парного поля. Кегль всегда мельче текста поля: xs/s/m 12/16 · l/xl 13/20.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description:
      "Текст ошибки проверки: danger-text (data-invalid). Обычная подсказка — text-muted.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description:
      "Под отключённым полем: text-disabled (data-disabled). Состояния success нет: используйте нейтральный текст или Banner.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLParagraphElement>",
    defaultValue: "—",
    required: "Нет",
    description: 'id для aria-describedby поля, role="alert" для ошибок после отправки, className.',
  },
];

const hintIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Иконка; центрируется по первой строке, 14 px при строке 16 и 16 px при строке 20.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className и прочие атрибуты span; обёртка всегда aria-hidden.",
  },
];

export default function HintSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Hint</PageContent.Title>
        <PageContent.Description measure="full">
          Вспомогательный текст под полем: правило формата, ограничение, откуда берётся значение,
          ошибка проверки. Ошибка заменяет подсказку в том же слоте. У Input, Textarea, Checkbox и
          других полей есть пропы <code>hint</code> / <code>error</code> — они связывают id сами;{" "}
          <code>Hint</code> напрямую нужен при ручной сборке поля.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Берите тот же <code>size</code>, что у поля. Отступ от поля —{" "}
              <code>--prime-control-&lt;size&gt;-hint-gap</code> (4 px), его задаёт раскладка поля.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={hintSizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <HintSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния и иконка</DemoSectionTitle>
            <DemoDescription>
              Обычная, <code>invalid</code> и <code>disabled</code>. <code>Hint.Icon</code> ставит
              иконку перед текстом и выравнивает её по первой строке.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={hintVariantsSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <HintStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния поля</DemoSectionTitle>
            <DemoDescription>
              Ручная сборка <code>Label</code> + <code>Select</code> + <code>Hint</code>: обычное
              поле, ошибка и отключённое. <code>id</code> подсказки передан в{" "}
              <code>aria-describedby</code> триггера — скринридер прочитает её вместе с полем.
              Подсказка не интерактивна: наведение и фокус относятся к полю.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={hintFieldStatesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <HintFieldStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Подсказка или ошибка</DemoSectionTitle>
            <DemoDescription>
              Родитель переключает <code>invalid</code> и текст в одном и том же элементе. Для
              ошибки после действия пользователя добавьте <code>role=&quot;alert&quot;</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={hintControlledVariantSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <HintHintOrErrorExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: смена пароля</DemoSectionTitle>
            <DemoDescription>
              Подсказки через проп <code>hint</code> у Input. Нажмите «Сохранить пароль» — ошибка
              встанет на место подсказки, и высота формы не изменится.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={hintCompositionSource.trim()}
              previewLayout="stack-center"
              surface="canvas"
            >
              <PlaygroundExampleFrame.Stage>
                <HintInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Hint.Root</DemoApiTitle>
            <DemoDescription>
              Рендерится как <code>&lt;p&gt;</code> и передаёт <code>size</code> вложенным иконкам.
            </DemoDescription>
            <PlaygroundApiTable rows={hintRootApiRows} />
            <DemoApiTitle>Hint.Icon</DemoApiTitle>
            <PlaygroundApiTable rows={hintIconApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
