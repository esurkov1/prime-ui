import ButtonGroupCompositionExample from "@/components/button-group/examples/composition";
import compositionSource from "@/components/button-group/examples/composition.tsx?raw";
import ButtonGroupControlledExample from "@/components/button-group/examples/controlled";
import controlledSource from "@/components/button-group/examples/controlled.tsx?raw";
import ButtonGroupFullWidthExample from "@/components/button-group/examples/full-width";
import fullWidthSource from "@/components/button-group/examples/full-width.tsx?raw";
import ButtonGroupInFormExample from "@/components/button-group/examples/in-form";
import inFormSource from "@/components/button-group/examples/in-form.tsx?raw";
import ButtonGroupOrientationExample from "@/components/button-group/examples/orientation";
import orientationSource from "@/components/button-group/examples/orientation.tsx?raw";
import ButtonGroupSizesExample from "@/components/button-group/examples/sizes";
import sizesSource from "@/components/button-group/examples/sizes.tsx?raw";
import ButtonGroupStatesExample from "@/components/button-group/examples/states";
import statesSource from "@/components/button-group/examples/states.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

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
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус контрола для всех сегментов (высота 28 · 32 · 36 · 40 · 48); передаётся вложенным иконкам и контролам.",
  },
  {
    prop: "fullWidth",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Растянуть группу на ширину контейнера; горизонтальные сегменты делят её поровну.",
  },
  {
    prop: "role",
    type: "string",
    defaultValue: '"group"',
    required: "Нет",
    description: 'Переопределение роли, например "toolbar" для панели редактора.',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Сегменты ButtonGroup.Item.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс корня.",
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
    description:
      'Переключаемый сегмент: boolean ставит aria-pressed и data-state="active" | "inactive".',
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
    description: "Неактивный сегмент: приглушённый текст, курсор not-allowed.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст и ButtonGroup.Icon. Только иконка — квадратный сегмент (нужен aria-label).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс сегмента.",
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
          Несколько связанных действий или переключателей в одной планке: нейтральная заливка без
          обводки, сегменты разделены тонким зазором, скруглены только внешние углы. Размер{" "}
          <code>xs</code>–<code>xl</code> задаётся на корне и совпадает с Button того же яруса;
          выбранный сегмент — <code>pressed</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> · <code>xl</code> —
              высота 28 · 32 · 36 · 40 · 48, по умолчанию <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Наведите курсор — сегмент темнеет, <kbd>Tab</kbd> — кольцо фокуса поверх соседей.
              Выбранный — <code>pressed</code> (<code>data-state=&quot;active&quot;</code>,{" "}
              <code>aria-pressed</code>), мягкая акцентная заливка; <code>disabled</code> гасит
              сегмент.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ориентация</DemoSectionTitle>
            <DemoDescription>
              По умолчанию <code>orientation=&quot;horizontal&quot;</code>; колонка —{" "}
              <code>orientation=&quot;vertical&quot;</code>, скругляются верхние и нижние углы.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={orientationSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupOrientationExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Один из нескольких</DemoSectionTitle>
            <DemoDescription>
              Активный сегмент хранится в состоянии родителя: <code>pressed</code> на выбранном,
              переключение через <code>onClick</code>. Зазор между сегментами показывает фон под
              группой — проверьте на разных поверхностях.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery>
                  <ButtonGroupControlledExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Панель редактора: история, начертание (независимые переключатели), выравнивание (один
              из трёх) и главное действие кнопкой того же размера. Сегментам только с иконкой нужен{" "}
              <code>aria-label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>На всю ширину</DemoSectionTitle>
            <DemoDescription>
              <code>fullWidth</code>: группа занимает ширину колонки, горизонтальные сегменты делят
              её поровну.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupFullWidthExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>В форме</DemoSectionTitle>
            <DemoDescription>
              Сегменты — нативные <code>&lt;button&gt;</code>: <code>type=&quot;submit&quot;</code>{" "}
              и <code>type=&quot;reset&quot;</code> работают в одной группе.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={inFormSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <ButtonGroupInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>ButtonGroup.Root</DemoApiTitle>
            <DemoDescription>
              Обёртка группы: ориентация, размер, ширина; размер передаётся в{" "}
              <code>ControlSizeProvider</code> для вложенных иконок.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonGroupRootApiRows} />
            <DemoApiTitle>ButtonGroup.Item</DemoApiTitle>
            <DemoDescription>
              Один сегмент — нативная кнопка; должен находиться внутри <code>Root</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonGroupItemApiRows} />
            <DemoApiTitle>ButtonGroup.Icon</DemoApiTitle>
            <DemoDescription>
              Слот под иконку размером яруса группы; рендерит <code>span</code> с{" "}
              <code>aria-hidden</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={buttonGroupIconApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
