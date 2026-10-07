import { PageContent } from "@/components/page-content/PageContent";
import PopoverAsChildExample from "@/components/popover/examples/as-child";
import asChildSource from "@/components/popover/examples/as-child.tsx?raw";
import PopoverCompositionExample from "@/components/popover/examples/composition";
import compositionSource from "@/components/popover/examples/composition.tsx?raw";
import PopoverControlledExample from "@/components/popover/examples/controlled";
import controlledSource from "@/components/popover/examples/controlled.tsx?raw";
import PopoverFeaturesExample from "@/components/popover/examples/features";
import featuresSource from "@/components/popover/examples/features.tsx?raw";
import PopoverFlushListExample from "@/components/popover/examples/flush-list";
import flushListSource from "@/components/popover/examples/flush-list.tsx?raw";
import PopoverFullWidthExample from "@/components/popover/examples/full-width";
import fullWidthSource from "@/components/popover/examples/full-width.tsx?raw";
import PopoverInsetVariantsExample from "@/components/popover/examples/inset-variants";
import insetVariantsSource from "@/components/popover/examples/inset-variants.tsx?raw";
import PopoverPlacementExample from "@/components/popover/examples/placement";
import placementSource from "@/components/popover/examples/placement.tsx?raw";
import PopoverSizesExample from "@/components/popover/examples/sizes";
import sizesSource from "@/components/popover/examples/sizes.tsx?raw";
import PopoverStatesExample from "@/components/popover/examples/states";
import statesSource from "@/components/popover/examples/states.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

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
    prop: "closeOnOutsideClick",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      "Клик в любом месте вне панели и триггера закрывает её. false — закрытие только явно.",
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
    type: '"xs" | "s" | "m" | "l" | "xl"',
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
      "Добавка к внутреннему отступу яруса: x1 +4, x2 +8, x3 +12 px; data-inset-padding на корне панели.",
  },
  {
    prop: "insetGap",
    type: '"none" | "pad" | "x2" | "x3" | "x4"',
    defaultValue: '"pad"',
    required: "Нет",
    description:
      "Вертикальный зазор между прямыми дочерними элементами: pad — зазор яруса (8 для xs/s, 12 для m, 16 для l/xl), x2 8, x3 12, x4 16 px, none — без зазора.",
  },
  {
    prop: "stackAboveDropdown",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Поднять панель над выпадающим списком того же слоя — если триггер внутри Select/TagSelect или Dropdown.",
  },
  {
    prop: "flush",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Без внутренних полей и зазора: строки и разделители доходят до краёв панели.",
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

const popoverPartsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Popover.Header",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Заголовок и описание стопкой с зазором 4 px.",
  },
  {
    prop: "Popover.Title",
    type: "React.HTMLAttributes<HTMLHeadingElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      "h2: кегль яруса панели, вес title-s; становится доступным именем панели через aria-labelledby.",
  },
  {
    prop: "Popover.Description",
    type: "React.HTMLAttributes<HTMLParagraphElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      "p: кегль подписи яруса (m — 13/20), secondary; связывается с панелью через aria-describedby.",
  },
  {
    prop: "Popover.Actions",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Кнопки справа с зазором 8 px; уже 480 px — во всю ширину, основная последней.",
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
              подстраивается при прокрутке и плавно закрывается по Escape или клику в пустое место.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> на <code>Popover.Content</code> — <code>xs</code>–<code>xl</code>:
              внутренний отступ (12 для xs/s, 16 для m/l, 20 для xl), кегль и ярус вложенных
              контролов. Берите тот же размер, что у триггера. По умолчанию — <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <PopoverSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Варианты внутренней сетки</DemoSectionTitle>
            <DemoDescription>
              Плотность задаётся <code>insetPadding</code> и <code>insetGap</code> на{" "}
              <code>Popover.Content</code> (включая <code>none</code> для плотного макета).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={insetVariantsSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <PopoverInsetVariantsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Подтверждение опасного действия: <code>Header</code>, <code>Title</code>,{" "}
              <code>Description</code> и <code>Actions</code> с кнопкой{" "}
              <code>tone=&quot;danger&quot;</code>. Отдельного <code>disabled</code> у поповера нет:
              отключённый триггер не откроет панель.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <PopoverStatesExample />
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
            <PlaygroundExampleFrame.Root code={placementSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <PopoverPlacementExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>open</code> и <code>onOpenChange</code> на <code>Popover.Root</code>: состояние
              держит родитель (кнопка «Открыть извне», счётчики, шаги мастера).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={controlledSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <PopoverControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Фильтры отчёта: шапка, <code>SegmentedControl</code> на всю ширину, чекбоксы и кнопки
              «Сбросить» / «Применить». Панель приподнята (<code>bg-raised</code>), поля внутри
              получают серую заливку.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={compositionSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <PopoverCompositionExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ширина относительно триггера</DemoSectionTitle>
            <DemoDescription>
              <code>sameMinWidthAsTrigger</code> — ширина панели как у триггера (не только
              min-width); удобно в узкой колонке.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <PopoverFullWidthExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Триггер не только кнопка</DemoSectionTitle>
            <DemoDescription>
              <code>Popover.Trigger</code> принимает один дочерний элемент — здесь кнопка в виде
              текстовой ссылки; к ней добавляются aria-атрибуты и переключение по клику.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={asChildSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <PopoverAsChildExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Фокус и вложенный выбор</DemoSectionTitle>
            <DemoDescription>
              Форма приглашения: <code>trapFocus</code> держит Tab внутри панели, клик по списку
              вложенного <code>Select</code> не считается кликом снаружи. Отправка закрывает панель.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <PopoverFeaturesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Строки на всю ширину</DemoSectionTitle>
            <DemoDescription>
              <code>flush</code> убирает внутренние поля и зазор панели: строки доходят до краёв, а{" "}
              <code>Divider</code> между ними идёт от края до края. Отступы задаёт каждая строка.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={flushListSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <PopoverFlushListExample />
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
            <DemoApiTitle>Header · Title · Description · Actions</DemoApiTitle>
            <DemoDescription>
              Готовая разметка панели с доступными именем и описанием.
            </DemoDescription>
            <PlaygroundApiTable rows={popoverPartsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
