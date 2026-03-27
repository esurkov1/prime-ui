import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import ButtonGroupCompositionSnippet from "../snippets/button-group/composition";
import compositionSource from "../snippets/button-group/composition.tsx?raw";
import ButtonGroupControlledSnippet from "../snippets/button-group/controlled";
import controlledSource from "../snippets/button-group/controlled.tsx?raw";
import ButtonGroupFormFeaturesSnippet from "../snippets/button-group/form-features";
import formFeaturesSource from "../snippets/button-group/form-features.tsx?raw";
import ButtonGroupFullWidthSnippet from "../snippets/button-group/full-width";
import fullWidthSource from "../snippets/button-group/full-width.tsx?raw";
import ButtonGroupOrientationSnippet from "../snippets/button-group/orientation";
import orientationSource from "../snippets/button-group/orientation.tsx?raw";
import ButtonGroupSizesSnippet from "../snippets/button-group/sizes";
import sizesSource from "../snippets/button-group/sizes.tsx?raw";
import ButtonGroupStatesSnippet from "../snippets/button-group/states";
import statesSource from "../snippets/button-group/states.tsx?raw";

const buttonGroupRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    required: "Нет",
    description: "Направление сегментов; вертикаль выставляет data-orientation на корне.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус токенов высоты, радиуса, текста и иконки для всей группы и вложенных контролов.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Сегменты ButtonGroup.Item и вспомогательная разметка внутри общей обводки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корня (например ширина `w-full`).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Роль, aria-*, data-*, onClick на обёртке и прочие атрибуты div.",
  },
];

const buttonGroupItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "pressed",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: 'Включённый сегмент: data-state="on" и aria-pressed при явном boolean.',
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип нативной кнопки (в т.ч. для форм).",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Неактивный сегмент с пониженной непрозрачностью.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст, ButtonGroup.Icon и другой контент сегмента.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс сегмента (например flex-1 для равной ширины).",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "onClick, aria-*, name, value и остальные атрибуты кнопки.",
  },
];

const buttonGroupIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обычно SVG-иконка; смысл дублируется текстом или aria-label на Item.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс обёртки иконки.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "Корень span с aria-hidden; прочие атрибуты span.",
  },
];

export default function ButtonGroupSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>ButtonGroup</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Несколько связанных действий или переключателей в одной визуальной «планке»: общая
              обводка, скругления только с краёв. Размер задаётся на корне и наследуется сегментами;
              отдельный сегмент можно подсветить как выбранный (<code>pressed</code>) или отключить.
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
              <code>xl</code> — у каждого своя группа из трёх сегментов.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Обычный сегмент; выбранный — через <code>pressed</code> (
              <code>data-state=&quot;on&quot;</code> и <code>aria-pressed</code>); отдельно показан{" "}
              <code>disabled</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ориентация</DemoSectionTitle>
            <DemoDescription>
              По умолчанию <code>orientation=&quot;horizontal&quot;</code>; колонка —{" "}
              <code>orientation=&quot;vertical&quot;</code> (скругления и стыковка бордеров
              пересчитываются стилями).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={orientationSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupOrientationSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              Какой сегмент активен, решает состояние React: на выбранном элементе{" "}
              <code>pressed=&#123;true&#125;</code>, переключение через <code>onClick</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              <code>ButtonGroup.Icon</code> выравнивает SVG по токенам размера; для сегментов только
              с иконкой нужна подпись через <code>aria-label</code> на <code>Item</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width</DemoSectionTitle>
            <DemoDescription>
              Отдельного пропа нет: на <code>Root</code> — класс ширины контейнера (например{" "}
              <code>w-full</code>), на сегментах — <code>flex-1</code>, чтобы поделить строку в
              карточке или панели.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
            <DemoDescription>
              Сегменты остаются нативными <code>&lt;button&gt;</code>: в форме можно сочетать{" "}
              <code>type=&quot;submit&quot;</code> и <code>type=&quot;reset&quot;</code> в одной
              группе.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={formFeaturesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupFormFeaturesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>ButtonGroup.Root</DemoApiTitle>
            <DemoDescription>
              Обёртка группы: задаёт ориентацию, размер, контекст для сегментов и иконок,
              прокидывает размер в <code>ControlSizeProvider</code> для дочерних контролов.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonGroupRootApiRows} />
            <DemoApiTitle>ButtonGroup.Item</DemoApiTitle>
            <DemoDescription>
              Один сегмент — кнопка с общей стилизацией группы; должен находиться внутри{" "}
              <code>Root</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonGroupItemApiRows} />
            <DemoApiTitle>ButtonGroup.Icon</DemoApiTitle>
            <DemoDescription>
              Слот под иконку внутри сегмента; рендерит <code>span</code> с <code>aria-hidden</code>
              .
            </DemoDescription>
            <PlaygroundApiTable rows={buttonGroupIconApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
