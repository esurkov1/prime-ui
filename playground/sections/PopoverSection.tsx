import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import PopoverAsChildSnippet from "../snippets/popover/as-child";
import asChildSource from "../snippets/popover/as-child.tsx?raw";
import PopoverCompositionSnippet from "../snippets/popover/composition";
import compositionSource from "../snippets/popover/composition.tsx?raw";
import PopoverControlledSnippet from "../snippets/popover/controlled";
import controlledSource from "../snippets/popover/controlled.tsx?raw";
import PopoverFeaturesSnippet from "../snippets/popover/features";
import featuresSource from "../snippets/popover/features.tsx?raw";
import PopoverFullWidthSnippet from "../snippets/popover/full-width";
import fullWidthSource from "../snippets/popover/full-width.tsx?raw";
import PopoverInsetVariantsSnippet from "../snippets/popover/inset-variants";
import insetVariantsSource from "../snippets/popover/inset-variants.tsx?raw";
import PopoverPlacementSnippet from "../snippets/popover/placement";
import placementSource from "../snippets/popover/placement.tsx?raw";
import PopoverSizesSnippet from "../snippets/popover/sizes";
import sizesSource from "../snippets/popover/sizes.tsx?raw";
import PopoverStatesSnippet from "../snippets/popover/states";
import statesSource from "../snippets/popover/states.tsx?raw";

const popoverRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "open",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое открытие; вместе с onOpenChange.",
  },
  {
    prop: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Начальное состояние в неконтролируемом режиме.",
  },
  {
    prop: "onOpenChange",
    type: "(open: boolean) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при открытии и закрытии (триггер, Escape, клик снаружи).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обычно Popover.Trigger и Popover.Content.",
  },
];

const popoverTriggerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactElement",
    defaultValue: "—",
    required: "Да",
    description:
      "Ровно один элемент-триггер; на него накладываются ref, aria-атрибуты и обработчик клика.",
  },
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "Проп в API для совместимости с паттерном слота; реализация всегда сливает поведение с единственным ребёнком через cloneElement.",
  },
];

const popoverContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    defaultValue: '"start"',
    required: "Нет",
    description: "Горизонтальное выравнивание панели относительно триггера.",
  },
  {
    prop: "side",
    type: '"bottom" | "top"',
    defaultValue: '"bottom"',
    required: "Нет",
    description: "Предпочтительная сторона; у края окна может переключиться (flip).",
  },
  {
    prop: "sameMinWidthAsTrigger",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Ширина панели по триггеру (border-box): текст переносится; не шире max-width панели и вьюпорта.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус отступов и типографики панели; дочерние контролы в ControlSizeProvider.",
  },
  {
    prop: "trapFocus",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Ловушка фокуса внутри панели при открытии (Tab циклически внутри).",
  },
  {
    prop: "insetPadding",
    type: '"none" | "x1" | "x2" | "x3"',
    defaultValue: '"none"',
    required: "Нет",
    description:
      "Дополнительный внутренний отступ к ярусу панели (--po-pad); data-inset-padding на корне панели.",
  },
  {
    prop: "insetGap",
    type: '"none" | "x2" | "x3" | "x4"',
    defaultValue: '"none"',
    required: "Нет",
    description: "Вертикальный зазор между прямыми дочерними элементами (data-inset-gap).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Содержимое панели.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс на контейнере панели (role=dialog).",
  },
];

export default function PopoverSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Popover</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Всплывающая панель рядом с кнопкой или ссылкой: внутри можно разместить форму,
              фильтры, выбор из списка или поясняющий текст. Панель фиксируется у края окна,
              подстраивается при прокрутке и закрывается по Escape или клику вне области.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Проп <code>size</code> на <code>Popover.Content</code>: ряд <code>s</code>,{" "}
              <code>m</code>, <code>l</code>, <code>xl</code> — разные отступы панели, минимальная
              ширина и кегль вспомогательного текста.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <PopoverSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Варианты внутренней сетки</DemoSectionTitle>
            <DemoDescription>
              Плотность задаётся <code>insetPadding</code> и <code>insetGap</code> на{" "}
              <code>Popover.Content</code> (включая <code>none</code> для плотного макета).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={insetVariantsSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <PopoverInsetVariantsSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              <code>defaultOpen</code> на корне — панель видна сразу после монтирования. Отдельного{" "}
              <code>disabled</code> у поповера нет: недоступный триггер (например кнопка с{" "}
              <code>disabled</code>) не откроет панель.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="row">
              <PlaygroundExampleFrame.Stage>
                <PopoverStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Расположение</DemoSectionTitle>
            <DemoDescription>
              <code>side</code> (<code>bottom</code> или <code>top</code>) и <code>align</code> (
              <code>start</code>, <code>center</code>, <code>end</code>); у границы вьюпорта сторона
              может смениться автоматически.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={placementSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PopoverPlacementSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>open</code> и <code>onOpenChange</code> на <code>Popover.Root</code>: состояние
              держит родитель (кнопка «Открыть извне», счётчики, шаги мастера).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PopoverControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Триггер с <code>Button.Icon</code>, заголовок, текст и нативные чекбоксы в теле панели
              с <code>insetPadding</code> / <code>insetGap</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PopoverCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ширина относительно триггера</DemoSectionTitle>
            <DemoDescription>
              <code>sameMinWidthAsTrigger</code> — ширина панели как у триггера (не только
              min-width); удобно в узкой колонке.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PopoverFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Триггер не только кнопка</DemoSectionTitle>
            <DemoDescription>
              <code>Popover.Trigger</code> принимает один дочерний элемент — здесь нативная{" "}
              <code>&lt;button&gt;</code> без визуала кнопки (как текстовая ссылка); к ней
              добавляются подписи доступности и переключение по клику.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={asChildSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PopoverAsChildSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Фокус и вложенный выбор</DemoSectionTitle>
            <DemoDescription>
              <code>trapFocus</code> для формы в панели; рядом <code>Input</code> и{" "}
              <code>Select</code> — клик по выпадающему списку не закрывает поповер как «снаружи».
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <PopoverFeaturesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Popover.Root</DemoApiTitle>
            <DemoDescription>
              Хранит открытие/закрытие, id для связи триггера и панели, ref якоря для
              позиционирования.
            </DemoDescription>
            <PlaygroundApiTable rows={popoverRootApiRows} />
            <DemoApiTitle>Popover.Trigger</DemoApiTitle>
            <DemoDescription>
              Один дочерний элемент-якорь; по клику переключает видимость панели.
            </DemoDescription>
            <PlaygroundApiTable rows={popoverTriggerApiRows} />
            <DemoApiTitle>Popover.Content</DemoApiTitle>
            <DemoDescription>
              Панель в портале с role=&quot;dialog&quot;, позиционированием и опциональной ловушкой
              фокуса.
            </DemoDescription>
            <PlaygroundApiTable rows={popoverContentApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
