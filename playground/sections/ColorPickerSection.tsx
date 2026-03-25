import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import ColorPickerCompositionSnippet from "../snippets/color-picker/composition";
import compositionSource from "../snippets/color-picker/composition.tsx?raw";
import ColorPickerControlledSnippet from "../snippets/color-picker/controlled";
import controlledSource from "../snippets/color-picker/controlled.tsx?raw";
import ColorPickerFeaturesSnippet from "../snippets/color-picker/features";
import featuresSource from "../snippets/color-picker/features.tsx?raw";
import ColorPickerFormatVariantsSnippet from "../snippets/color-picker/format-variants";
import formatVariantsSource from "../snippets/color-picker/format-variants.tsx?raw";
import ColorPickerFullWidthSnippet from "../snippets/color-picker/full-width";
import fullWidthSource from "../snippets/color-picker/full-width.tsx?raw";
import ColorPickerHexInputSizesSnippet from "../snippets/color-picker/hex-input-sizes";
import hexInputSizesSource from "../snippets/color-picker/hex-input-sizes.tsx?raw";
import ColorPickerPanelPlacementSnippet from "../snippets/color-picker/panel-placement";
import panelPlacementSource from "../snippets/color-picker/panel-placement.tsx?raw";
import ColorPickerPopoverSnippet from "../snippets/color-picker/popover";
import popoverSource from "../snippets/color-picker/popover.tsx?raw";
import ColorPickerStatesSnippet from "../snippets/color-picker/states";
import statesSource from "../snippets/color-picker/states.tsx?raw";

const colorPickerRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string | Color",
    defaultValue: "—",
    required: "Нет",
    description:
      "Текущий цвет (контролируемый режим); строка в формате CSS или объект Color из react-aria-components.",
  },
  {
    prop: "defaultValue",
    type: "string | Color",
    defaultValue: "—",
    required: "Нет",
    description:
      "Начальное значение без внешнего состояния (например «#336699» или «hsl(220, 90%, 56%)»).",
  },
  {
    prop: "onChange",
    type: "(color: Color) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при смене цвета из любого вложенного контрола.",
  },
  {
    prop: "children",
    type: "React.ReactNode | (renderProps) => ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Разметка панели; в функции доступен текущий color из состояния.",
  },
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс корневого элемента ColorPicker из react-aria-components.",
  },
  {
    prop: "slot",
    type: "string | null",
    defaultValue: "—",
    required: "Нет",
    description: "Имя слота для slotted context (RAC).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement> и прочие пропсы RAC ColorPicker",
    defaultValue: "—",
    required: "Нет",
    description:
      "Атрибуты корня, имя в форме и др. — по документации react-aria-components для ColorPicker.",
  },
];

const formatProviderApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Дочерние FormatSelect, ChannelStrip и поля каналов; без обёртки ChannelStrip и FormatSelect не работают.",
  },
  {
    prop: "defaultFormat",
    type: '"hsl" | "rgb" | "hex"',
    defaultValue: '"hsl"',
    required: "Нет",
    description:
      "Какой набор полей показывает ChannelStrip при первом рендере; смена через FormatSelect.",
  },
];

const formatSelectApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки вокруг китового Select для переключения формата.",
  },
];

const channelStripApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "pipetteIcon",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Иконка пипетки; обычно через Button.Icon (как у EyeDropperButton внутри полосы).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс контейнера полосы каналов и кнопки пипетки.",
  },
];

const hexInputApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер китового Input вокруг hex-поля.",
  },
  {
    prop: "label",
    type: "React.ReactNode",
    defaultValue: '"Hex"',
    required: "Нет",
    description: "Подпись поля (Label у Input.Root).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс для Input.Root.",
  },
];

const triggerSwatchApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс квадрата превью; заливка берётся из контекста ColorPicker (текущий цвет).",
  },
];

const sliderMetaApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "label",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст слева; справа выводится числовое значение через ColorPicker.Output.",
  },
];

const eyeDropperButtonApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно Button.Icon с иконкой пипетки.",
  },
  {
    prop: "aria-label",
    type: "string",
    defaultValue: '"Пипетка"',
    required: "Нет",
    description:
      "Подпись для кнопки; при отсутствии API EyeDropper кнопка скрыта от вспомогательных технологий.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс кнопки.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ComponentProps<typeof Button.Root>, "variant" | "mode" | "size">',
    defaultValue: "—",
    required: "Нет",
    description:
      "onClick, type, ref и прочие пропсы китовой кнопки; variant, mode и size зафиксированы внутри.",
  },
];

const racAreaApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "colorSpace",
    type: '"rgb" | "hsl" | "hsb"',
    defaultValue: "—",
    required: "Да",
    description: "Цветовое пространство двумерной области.",
  },
  {
    prop: "xChannel",
    type: "ColorChannel",
    defaultValue: "—",
    required: "Да",
    description: "Канал по горизонтали (например saturation в HSL).",
  },
  {
    prop: "yChannel",
    type: "ColorChannel",
    defaultValue: "—",
    required: "Да",
    description: "Канал по вертикали (например lightness в HSL).",
  },
  {
    prop: "isDisabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Локально отключить область (дополнительно к корню).",
  },
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Стили градиентной области.",
  },
  {
    prop: "…rest",
    type: "Omit<react-aria-components ColorAreaProps, перечисленные выше>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные пропсы RAC ColorArea (aria-label, ref и т.д.).",
  },
];

const racAreaThumbApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Обводка и размер маркера области (стили кита).",
  },
  {
    prop: "…rest",
    type: "react-aria-components ColorThumbProps",
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы маркера внутри ColorArea.",
  },
];

const racColorSliderApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "channel",
    type: "ColorChannel",
    defaultValue: "—",
    required: "Да",
    description: "Канал слайдера: hue, alpha, red и т.д.",
  },
  {
    prop: "colorSpace",
    type: '"rgb" | "hsl" | "hsb"',
    defaultValue: "—",
    required: "Нет",
    description: "Нужен для каналов, зависящих от пространства (например hue в HSL).",
  },
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    required: "Нет",
    description: "Ориентация трека (в ките ожидается горизонтальная разметка).",
  },
  {
    prop: "isDisabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Отключить конкретный слайдер.",
  },
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: 'Класс корня слайдера; обёртка задаёт data-size="m" как у контрола размера m.',
  },
  {
    prop: "…rest",
    type: "Omit<react-aria-components ColorSliderProps, перечисленные выше>",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительные пропсы RAC ColorSlider.",
  },
];

const racSliderTrackApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "style",
    type: "CSSProperties | (renderProps) => CSSProperties",
    defaultValue: "—",
    required: "Нет",
    description: "Обёртка добавляет шахматный фон под градиентом альфы.",
  },
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс трека.",
  },
  {
    prop: "…rest",
    type: "react-aria-components SliderTrackProps",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные пропсы трека слайдера.",
  },
];

const racSliderThumbApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Внешний вид ползунка на треке цветового слайдера.",
  },
  {
    prop: "…rest",
    type: "react-aria-components ColorThumb / SliderThumb props",
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы маркера на ColorSlider.",
  },
];

const racOutputApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс элемента вывода значения (рядом с подписью в SliderMeta).",
  },
  {
    prop: "…rest",
    type: "react-aria-components SliderOutputProps",
    defaultValue: "—",
    required: "Нет",
    description: "Форматирование и доступность вывода значения слайдера.",
  },
];

const racFieldApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "channel",
    type: "ColorChannel",
    defaultValue: "—",
    required: "Нет",
    description:
      "Без channel поле редактирует цвет как hex; иначе — один канал в заданном colorSpace.",
  },
  {
    prop: "colorSpace",
    type: '"rgb" | "hsl" | "hsb"',
    defaultValue: "—",
    required: "Нет",
    description: "Пространство для channel; для hex не обязателен.",
  },
  {
    prop: "isDisabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Отключить ввод.",
  },
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки ColorField.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обычно Input из react-aria-components внутри поля.",
  },
  {
    prop: "…rest",
    type: "Omit<react-aria-components ColorFieldProps, label | placeholder | description | errorMessage | validationState | validationBehavior> + RACValidation + InputDOMProps",
    defaultValue: "—",
    required: "Нет",
    description: "aria-label, validationBehavior, ref и прочие пропсы RAC ColorField.",
  },
];

const swatchPickerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string | Color",
    defaultValue: "—",
    required: "Нет",
    description: "Выбранный пресет (контролируемо).",
  },
  {
    prop: "defaultValue",
    type: "string | Color",
    defaultValue: "—",
    required: "Нет",
    description: "Начальный выбранный цвет из палитры.",
  },
  {
    prop: "onChange",
    type: "(color: Color) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Смена выбранного пресета.",
  },
  {
    prop: "layout",
    type: '"grid" | "stack"',
    defaultValue: '"grid"',
    required: "Нет",
    description: "Сетка или вертикальный стек образцов.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "SwatchPickerItem с вложенным Swatch.",
  },
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс контейнера палитры.",
  },
  {
    prop: "…rest",
    type: "AriaLabelingProps, HTMLAttributes",
    defaultValue: "—",
    required: "Нет",
    description: "aria-label для группы пресетов и прочие атрибуты RAC ColorSwatchPicker.",
  },
];

const swatchPickerItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "color",
    type: "string | Color",
    defaultValue: "—",
    required: "Да",
    description: "Цвет пресета.",
  },
  {
    prop: "isDisabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Недоступный пресет.",
  },
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс ячейки пресета.",
  },
  {
    prop: "…rest",
    type: "react-aria-components ColorSwatchPickerItemProps",
    defaultValue: "—",
    required: "Нет",
    description: "onAction, aria-label, ref и др.",
  },
];

const swatchApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string | (state) => string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс квадрата образца.",
  },
  {
    prop: "style",
    type: "CSSProperties | (state) => CSSProperties",
    defaultValue: "—",
    required: "Нет",
    description: "Обёртка добавляет шахматный фон под полупрозрачным цветом.",
  },
  {
    prop: "…rest",
    type: "react-aria-components ColorSwatchProps",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные пропсы RAC ColorSwatch.",
  },
];

export default function ColorPickerSection() {
  return (
    <PlaygroundDocPage
      title="Color picker"
      description={
        <>
          Выбор цвета: область HSL, слайдеры, пресеты, hex и каналы. В продуктовом UI панель
          размещают в <code>Popover.Content</code>, триггер — кнопка с{" "}
          <code>ColorPicker.TriggerSwatch</code> (или свой индикатор); все примеры ниже так
          устроены. Состояние и a11y — <span translate="no">react-aria-components</span> (Color,
          React Aria).
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре <code>HexInput</code> с разным <code>size</code> — каждый за своим поповером.
          </p>
          <PlaygroundExampleFrame.Root
            code={hexInputSizesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <ColorPickerHexInputSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            Три формата (<code>hsl</code>, <code>rgb</code>, <code>hex</code>) — три отдельных
            поповера с <code>FormatProvider</code>.
          </p>
          <PlaygroundExampleFrame.Root
            code={formatVariantsSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <ColorPickerFormatVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Два поповера: отключённый пресет в палитре и отключённый слайдер оттенка.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <ColorPickerStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Расположение панели</h4>
          <p className="demoBlockDescription">
            Два экземпляра: <code>side=&quot;bottom&quot;</code> и <code>side=&quot;top&quot;</code>
            ; триггер с <code>TriggerSwatch</code>.
          </p>
          <PlaygroundExampleFrame.Root
            code={panelPlacementSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <ColorPickerPanelPlacementSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            <code>value</code> / <code>onChange</code>, readout снаружи поповера, панель внутри{" "}
            <code>Popover.Content</code>.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <ColorPickerControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            Полная панель в поповере: <code>FormatSelect</code>, <code>Area</code>, слайдеры,{" "}
            <code>ChannelStrip</code>, <code>SwatchPicker</code>.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <ColorPickerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Широкая <code>Popover.Content</code> и карточка <code>fullWidthStretch</code> внутри.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <ColorPickerFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            Поповер с кастомным квадратом цвета на кнопке (альтернатива <code>TriggerSwatch</code>
            ); ниже — <code>Field</code>, пипетка и слайдер в отдельном поповере.
          </p>
          <PlaygroundExampleFrame.Root code={popoverSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <ColorPickerPopoverSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
          <p className="demoBlockDescription">
            <code>Field</code> + <code>EyeDropperButton</code>, область и слайдер — всё внутри
            поповера.
          </p>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <ColorPickerFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>ColorPicker.Root</h5>
          <p className="demoBlockDescription">
            Общее состояние цвета для всех вложенных частей; прокидывает контекст React Aria
            ColorPicker.
          </p>
          <PlaygroundApiTable rows={colorPickerRootApiRows} />

          <h5>ColorPicker.FormatProvider</h5>
          <p className="demoBlockDescription">
            Локальный контекст формата (HSL / RGB / Hex) для FormatSelect и ChannelStrip.
          </p>
          <PlaygroundApiTable rows={formatProviderApiRows} />

          <h5>ColorPicker.FormatSelect</h5>
          <p className="demoBlockDescription">
            Выпадающий список китового Select для переключения формата каналов.
          </p>
          <PlaygroundApiTable rows={formatSelectApiRows} />

          <h5>ColorPicker.ChannelStrip</h5>
          <p className="demoBlockDescription">
            Полоса: кнопка пипетки и поля каналов или hex в зависимости от формата.
          </p>
          <PlaygroundApiTable rows={channelStripApiRows} />

          <h5>ColorPicker.HexInput</h5>
          <p className="demoBlockDescription">
            Однострочный ввод hex через китовый Input с синхронизацией из контекста цвета.
          </p>
          <PlaygroundApiTable rows={hexInputApiRows} />

          <h5>ColorPicker.TriggerSwatch</h5>
          <p className="demoBlockDescription">
            Квадрат предпросмотра текущего цвета для кнопки-триггера (без inline style, заливка в
            SVG).
          </p>
          <PlaygroundApiTable rows={triggerSwatchApiRows} />

          <h5>ColorPicker.Field</h5>
          <p className="demoBlockDescription">
            Обёртка RAC ColorField со стилями кита; внутрь — как минимум Input из
            react-aria-components.
          </p>
          <PlaygroundApiTable rows={racFieldApiRows} />

          <h5>ColorPicker.Area</h5>
          <p className="demoBlockDescription">
            Двумерная палитра по двум каналам выбранного пространства.
          </p>
          <PlaygroundApiTable rows={racAreaApiRows} />

          <h5>ColorPicker.AreaThumb</h5>
          <p className="demoBlockDescription">Маркер положения внутри области.</p>
          <PlaygroundApiTable rows={racAreaThumbApiRows} />

          <h5>ColorPicker.Slider</h5>
          <p className="demoBlockDescription">
            Слайдер одного канала; на корне выставляется <code>data-size=&quot;m&quot;</code> под
            стили кита.
          </p>
          <PlaygroundApiTable rows={racColorSliderApiRows} />

          <h5>ColorPicker.SliderMeta</h5>
          <p className="demoBlockDescription">Строка «подпись + значение» над треком слайдера.</p>
          <PlaygroundApiTable rows={sliderMetaApiRows} />

          <h5>ColorPicker.SliderTrack</h5>
          <p className="demoBlockDescription">
            Градиентный трек; для альфы подмешивается шахматный фон.
          </p>
          <PlaygroundApiTable rows={racSliderTrackApiRows} />

          <h5>ColorPicker.Thumb</h5>
          <p className="demoBlockDescription">Ползунок на треке цветового слайдера.</p>
          <PlaygroundApiTable rows={racSliderThumbApiRows} />

          <h5>ColorPicker.Output</h5>
          <p className="demoBlockDescription">
            Числовой вывод значения слайдера (используется внутри SliderMeta).
          </p>
          <PlaygroundApiTable rows={racOutputApiRows} />

          <h5>ColorPicker.SwatchPicker</h5>
          <p className="demoBlockDescription">Группа пресетов с выбором одного цвета.</p>
          <PlaygroundApiTable rows={swatchPickerApiRows} />

          <h5>ColorPicker.SwatchPickerItem</h5>
          <p className="demoBlockDescription">Один пресет в группе.</p>
          <PlaygroundApiTable rows={swatchPickerItemApiRows} />

          <h5>ColorPicker.Swatch</h5>
          <p className="demoBlockDescription">Визуальный квадрат цвета внутри элемента пресета.</p>
          <PlaygroundApiTable rows={swatchApiRows} />

          <h5>ColorPicker.EyeDropperButton</h5>
          <p className="demoBlockDescription">
            Кнопка захвата цвета с экрана через Web API EyeDropper (где доступно).
          </p>
          <PlaygroundApiTable rows={eyeDropperButtonApiRows} />

          <h5>parseColor (экспорт модуля)</h5>
          <p className="demoBlockDescription">
            Функция разбора строки CSS / hex в объект <code>Color</code> (re-export из
            react-aria-components); используется в контролируемом режиме и при коммите полей ввода.
          </p>
          <PlaygroundApiTable
            rows={[
              {
                prop: "value",
                type: "string",
                defaultValue: "—",
                required: "Да",
                description: "Строка цвета для разбора (например «#0f0», «rgb(0,255,0)»).",
              },
              {
                prop: "возврат",
                type: "Color",
                defaultValue: "—",
                required: "—",
                description: "Объект цвета для передачи в value / setColor.",
              },
            ]}
          />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
