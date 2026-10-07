import { PageContent } from "@/components/page-content/PageContent";
import SliderBasicExample from "@/components/slider/examples/basic";
import basicSource from "@/components/slider/examples/basic.tsx?raw";
import SliderControlledExample from "@/components/slider/examples/controlled";
import controlledSource from "@/components/slider/examples/controlled.tsx?raw";
import SliderDisplaySettingsExample from "@/components/slider/examples/display-settings";
import displaySettingsSource from "@/components/slider/examples/display-settings.tsx?raw";
import SliderRangeStepExample from "@/components/slider/examples/range-step";
import rangeStepSource from "@/components/slider/examples/range-step.tsx?raw";
import SliderSizesExample from "@/components/slider/examples/sizes";
import sizesSource from "@/components/slider/examples/sizes.tsx?raw";
import SliderStatesExample from "@/components/slider/examples/states";
import statesSource from "@/components/slider/examples/states.tsx?raw";
import SliderTonesExample from "@/components/slider/examples/tones";
import tonesSource from "@/components/slider/examples/tones.tsx?raw";
import SliderValueFormatExample from "@/components/slider/examples/value-format";
import valueFormatSource from "@/components/slider/examples/value-format.tsx?raw";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const sliderRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус: толщина дорожки T = --prime-control-<tier>-track (4–8px), бегунок — капсула 4.5T × 3T, плюс типографика подписи.",
  },
  {
    prop: "tone",
    type: '"accent" | "neutral" | "success" | "warning" | "danger" | "info"',
    defaultValue: '"accent"',
    required: "Нет",
    description: "Цвет заполнения дорожки.",
  },
  {
    prop: "value",
    type: "number",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое значение (ограничивается [min, max]); вместе с onValueChange.",
  },
  {
    prop: "defaultValue",
    type: "number",
    defaultValue: "min",
    required: "Нет",
    description: "Начальное значение в неконтролируемом режиме.",
  },
  {
    prop: "onValueChange",
    type: "(value: number) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при каждом изменении положения бегунка.",
  },
  {
    prop: "min / max / step",
    type: "number",
    defaultValue: "0 / 100 / 1",
    required: "Нет",
    description: "Диапазон и шаг нативного range; дробный step допустим.",
  },
  {
    prop: "label",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Видимая подпись (Label.Root), связана с ползунком через htmlFor.",
  },
  {
    prop: "showValue",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Текущее значение в конце строки подписи, табличные цифры, text-secondary.",
  },
  {
    prop: "formatValue",
    type: "(value: number) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Формат показанного значения; заодно задаёт aria-valuetext с единицами.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Приглушённые дорожка и заполнение, плоский бегунок, ввод заблокирован.",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя для скринридеров, если нет видимого label.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс корня (на нём data-size, data-tone и data-disabled).",
  },
];

export default function SliderSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Slider</PageContent.Title>
        <PageContent.Description measure="full">
          Ползунок для примерного значения в диапазоне: громкость, яркость, потолок цены. Построен
          на нативном <code>input type=&quot;range&quot;</code>, поэтому клавиатура и указатель
          работают без дополнительного кода. Над дорожкой — строка подписи со значением.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code>, <code>s</code>, <code>m</code>, <code>l</code>, <code>xl</code> в
              одном ряду: всё выводится из толщины дорожки (та же шкала, что у ProgressBar), поэтому
              дорожка и бегунок растут как одна форма.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SliderSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Пустое заполнение на минимуме, середина, максимум и <code>disabled</code>. Наведите на
              бегунок — он станет стеклянным; потяните — стекло станет прозрачным и покажет
              скруглённый конец заполнения; Tab рисует кольцо фокуса вокруг бегунка.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SliderStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Цвет</DemoSectionTitle>
            <DemoDescription>
              <code>tone</code> красит заполнение дорожки: <code>accent</code> по умолчанию,{" "}
              <code>neutral</code> для монохромных экранов, смысловые тона — когда значение несёт
              смысл (порог, риск).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={tonesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SliderTonesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Значение и формат</DemoSectionTitle>
            <DemoDescription>
              <code>showValue</code> выводит значение в конце строки подписи;{" "}
              <code>formatValue</code> добавляет единицы — градусы, рубли, проценты — и тот же текст
              отдаёт скринридеру через <code>aria-valuetext</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={valueFormatSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SliderValueFormatExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Поверхности</DemoSectionTitle>
            <DemoDescription>
              Дорожка <code>fill-strong</code> и бегунок с тенью читаются на холсте, в карточке и во
              всплывающем слое.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={basicSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery className="examplePreviewBleed">
                  <SliderBasicExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              <code>value</code> + <code>onValueChange</code>: ползунок и числовое поле правят одно
              состояние — так точное значение можно ввести с клавиатуры.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SliderControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Диапазон и шаг</DemoSectionTitle>
            <DemoDescription>
              Свои <code>min</code>, <code>max</code> и <code>step</code>, включая дробный шаг.
              Стрелки меняют значение на шаг, Page Up / Page Down — крупнее, Home / End — к краям.
              Без видимой подписи задайте <code>aria-label</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={rangeStepSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SliderRangeStepExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              Карточка настроек: ползунки размера <code>m</code> с форматированными значениями;
              переключатель «Автояркость» блокирует ползунок яркости.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={displaySettingsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SliderDisplaySettingsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Slider.Root</DemoApiTitle>
            <DemoDescription>
              Строка подписи (<code>label</code> + <code>showValue</code>) и прозрачный нативный{" "}
              <code>input type=&quot;range&quot;</code> поверх нарисованных дорожки и бегунка.
              Положение задаёт CSS-переменная <code>--slider-ratio</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={sliderRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
