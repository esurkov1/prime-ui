import ColorPickerBrandColorExample from "@/components/color-picker/examples/brand-color";
import brandColorSource from "@/components/color-picker/examples/brand-color.tsx?raw";
import ColorPickerFormatsExample from "@/components/color-picker/examples/formats";
import formatsSource from "@/components/color-picker/examples/formats.tsx?raw";
import ColorPickerHexInputSizesExample from "@/components/color-picker/examples/hex-input-sizes";
import hexInputSizesSource from "@/components/color-picker/examples/hex-input-sizes.tsx?raw";
import ColorPickerPanelExample from "@/components/color-picker/examples/panel";
import panelSource from "@/components/color-picker/examples/panel.tsx?raw";
import ColorPresetsLabelsExample from "@/components/color-picker/examples/presets-labels";
import presetsLabelsSource from "@/components/color-picker/examples/presets-labels.tsx?raw";
import ColorPresetsQuickExample from "@/components/color-picker/examples/presets-quick";
import presetsQuickSource from "@/components/color-picker/examples/presets-quick.tsx?raw";
import ColorPresetsSizesExample from "@/components/color-picker/examples/presets-sizes";
import presetsSizesSource from "@/components/color-picker/examples/presets-sizes.tsx?raw";
import ColorPickerStatesExample from "@/components/color-picker/examples/states";
import statesSource from "@/components/color-picker/examples/states.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

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
    prop: "onValueChange",
    type: "(color: Color) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при смене цвета из любого вложенного контрола.",
  },
  {
    prop: "defaultFormat",
    type: '"hsl" | "rgb" | "hex"',
    defaultValue: '"hsl"',
    required: "Нет",
    description:
      "Какой набор полей показывает ChannelStrip при первом рендере; смена через FormatSelect.",
  },
  {
    prop: "labels",
    type: "Partial<ColorPickerLabels>",
    defaultValue: "русские строки",
    required: "Нет",
    description:
      "Встроенные строки: format (FormatSelect), eyeDropper, hex, имена каналов hue · saturation · lightness · alpha · red · green · blue.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Части пикера; триггер и панель держите под одним Root.",
  },
];

const colorPresetsRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value / defaultValue",
    type: "string | null",
    defaultValue: "null",
    required: "Нет",
    description: "Выбранный цвет (строка CSS из пресета); null — без цвета.",
  },
  {
    prop: "onValueChange",
    type: "(value: string | null) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при выборе свотча.",
  },
  {
    prop: "open / defaultOpen / onOpenChange",
    type: "boolean / boolean / (open: boolean) => void",
    defaultValue: "false",
    required: "Нет",
    description: "Состояние панели.",
  },
  {
    prop: "presets",
    type: "readonly { value: string; label: string }[]",
    defaultValue: "COLOR_PRESETS (16)",
    required: "Нет",
    description:
      "Свотчи по порядку; label — доступное имя. COLOR_PRESETS: шаги 500 и 700 восьми оттенков палитры; slice(0, 8) — один ряд.",
  },
  {
    prop: "columns",
    type: "number",
    defaultValue: "один ряд до 8 пресетов, иначе 8",
    required: "Нет",
    description: "Колонки сетки; у l / xl на экранах < 480px — вдвое меньше.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Триггер — высота контрола яруса; свотч — item-height − 8 (16 · 20 · 24 · 28 · 32).",
  },
  {
    prop: "allowEmpty",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Свотч «Без цвета» (шахматка) после пресетов, значение null.",
  },
  {
    prop: "closeOnSelect",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Закрывать панель после выбора; фокус возвращается на триггер.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Триггер недоступен, панель не открывается.",
  },
  {
    prop: "labels",
    type: "Partial<ColorPresetsLabels>",
    defaultValue: "русские строки",
    required: "Нет",
    description:
      "trigger («Цвет» → «Цвет: Синий»), list («Цвета», имя списка без label), empty («Без цвета»).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "ColorPresets.Trigger и ColorPresets.Content.",
  },
];

const colorPresetsPartsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Trigger asChild",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "false — квадратная кнопка-свотч яруса Root; true — единственный ребёнок (например Button.Root с ColorPresets.Swatch) становится триггером.",
  },
  {
    prop: "Trigger aria-label / …rest",
    type: 'Omit<ButtonHTMLAttributes, "children" | "disabled" | "value">',
    defaultValue: "«labels.trigger: имя цвета»",
    required: "Нет",
    description:
      "Атрибуты кнопки; ref — на кнопку. ↑ / ↓ открывают панель только у квадратного триггера; с asChild onKeyDown с Trigger отбрасывается — вешайте его на ребёнка.",
  },
  {
    prop: "Content label",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Заголовок над сеткой и имя списка (иначе labels.list).",
  },
  {
    prop: "Content align / side",
    type: '"start" | "center" | "end" / "bottom" | "top"',
    defaultValue: '"start" / "bottom"',
    required: "Нет",
    description: "Положение панели относительно триггера.",
  },
  {
    prop: "Content · Swatch className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс панели / квадрата цвета для своего триггера.",
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
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс контейнера полосы каналов и кнопки пипетки.",
  },
  {
    prop: "focusRing",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: 'false скрывает только кольцо фокуса полей (data-focus-ring="false").',
  },
];

const hexInputApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус китового Input; триггер палитры рядом делайте кнопкой того же size — высоты совпадут.",
  },
  {
    prop: "label",
    type: "React.ReactNode",
    defaultValue: "labels.hex",
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
  {
    prop: "focusRing",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "false скрывает только кольцо фокуса поля; кольцо ошибки остаётся.",
  },
];

const triggerSwatchApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Класс квадрата превью (размер — --prime-icon-size хоста, иначе --prime-control-m-icon, 16 px); заливка — текущий цвет. aria-hidden: имя давайте кнопке-триггеру.",
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
    description: "Своя иконка; по умолчанию — пипетка кита. Имя кнопки — labels.eyeDropper у Root.",
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
    type: 'Omit<React.ComponentProps<typeof Button.Root>, "variant" | "tone" | "size" | "aria-label">',
    defaultValue: "—",
    required: "Нет",
    description:
      "onClick, type, ref и прочие пропсы китовой кнопки; tone (neutral) и variant (soft) задаются внутри. Без window.EyeDropper кнопка disabled и aria-hidden.",
  },
];

const panelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "surface",
    type: '"none" | "raised"',
    defaultValue: '"none"',
    required: "Нет",
    description:
      "none — только раскладка (зазор 12 px) внутри Popover / Card; raised — самостоятельная панель: bg-raised, радиус и поля панели, shadow-overlay, поля переходят на field-bg-surface.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className (например фиксированная ширина), ref и прочие атрибуты div.",
  },
];

const racPartsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Area",
    type: "ColorAreaProps",
    defaultValue: "—",
    required: "—",
    description:
      "Двумерная область 4:3. Ключевые: colorSpace, xChannel, yChannel (например hsl / saturation / lightness), disabled. Внутрь — AreaThumb.",
  },
  {
    prop: "AreaThumb · Thumb",
    type: "ColorThumbProps",
    defaultValue: "—",
    required: "—",
    description:
      "Маркер области (20 px) и ползунок слайдера (18 px): кольцо control-thumb, тень, кольцо фокуса.",
  },
  {
    prop: "Slider",
    type: "ColorSliderProps",
    defaultValue: "—",
    required: "—",
    description:
      "Слайдер канала: channel (hue, alpha, red…), colorSpace, orientation, disabled. Визуально всегда ярус m. Внутрь — SliderMeta (необязательно) и SliderTrack.",
  },
  {
    prop: "SliderTrack",
    type: "SliderTrackProps",
    defaultValue: "—",
    required: "—",
    description:
      "Градиентный трек; под полупрозрачными цветами подмешивается шахматный фон. Внутрь — Thumb.",
  },
  {
    prop: "Output",
    type: "SliderOutputProps",
    defaultValue: "—",
    required: "—",
    description: "Числовое значение канала; используется внутри SliderMeta.",
  },
  {
    prop: "Field",
    type: "ColorFieldProps",
    defaultValue: "—",
    required: "—",
    description:
      "RAC ColorField в стиле полей кита: без channel — hex, с channel + colorSpace — один канал. Внутрь — Input из react-aria-components; нужен aria-label. Плюс focusRing (по умолчанию true).",
  },
  {
    prop: "SwatchPicker",
    type: "ColorSwatchPickerProps",
    defaultValue: "—",
    required: "—",
    description:
      "Группа пресетов: внутри Root следует цвету пикера; отдельно — value / defaultValue / onValueChange. layout grid | stack. Обязательно aria-label.",
  },
  {
    prop: "SwatchPickerItem",
    type: "ColorSwatchPickerItemProps",
    defaultValue: "—",
    required: "—",
    description:
      "Один пресет: color (обязателен), disabled. Выбранный — акцентная обводка с отступом 2 px. Внутрь — Swatch.",
  },
  {
    prop: "Swatch",
    type: "ColorSwatchProps",
    defaultValue: "—",
    required: "—",
    description: "Круг цвета 24 px с шахматным фоном для прозрачности.",
  },
];

const parseColorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description:
      "CSS-строка цвета («#0f0», «rgb(0 255 0)», «hsl(220, 90%, 56%)»). Бросает исключение, если разобрать не удалось.",
  },
  {
    prop: "возврат",
    type: "Color",
    defaultValue: "—",
    required: "—",
    description:
      'Объект цвета для value; обратно в строку — color.toString("hex" | "hexa" | "css").',
  },
];

export default function ColorPickerSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Color picker</PageContent.Title>
        <PageContent.Description measure="full">
          Выбор цвета на <span translate="no">react-aria-components</span>: область, слайдеры
          каналов, пресеты, hex и поля каналов с пипеткой работают с одним общим <code>Color</code>{" "}
          внутри <code>ColorPicker.Root</code>. В интерфейсе панель обычно открывают из Popover
          рядом с полем; отдельно стоящую панель оформляет{" "}
          <code>ColorPicker.Panel surface=&quot;raised&quot;</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Панель</DemoSectionTitle>
            <DemoDescription>
              <code>ColorPicker.Panel</code> складывает части с зазором 12 px.{" "}
              <code>surface=&quot;raised&quot;</code> — самостоятельная плавающая поверхность с
              тенью; <code>&quot;none&quot;</code> (по умолчанию) — только раскладка внутри Popover
              или Card. Порядок частей: <code>FormatSelect</code> → <code>Area</code> → слайдеры →{" "}
              <code>ChannelStrip</code> → пресеты.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={panelSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ColorPickerPanelExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры: поле и триггер</DemoSectionTitle>
            <DemoDescription>
              Ось <code>size</code> (<code>xs</code> · <code>s</code> · <code>m</code> ·{" "}
              <code>l</code> · <code>xl</code>) есть только у <code>HexInput</code>; область и
              слайдеры всегда яруса <code>m</code>. Кнопка-триггер того же <code>size</code> с{" "}
              <code>TriggerSwatch</code> внутри <code>Button.Icon</code> становится квадратной и
              совпадает с полем по высоте. Нажмите на квадрат, чтобы открыть панель.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={hexInputSizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ColorPickerHexInputSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Форматы</DemoSectionTitle>
            <DemoDescription>
              <code>defaultFormat</code> у <code>Root</code> — <code>hsl</code> (по умолчанию),{" "}
              <code>rgb</code> или <code>hex</code> — задаёт набор полей <code>ChannelStrip</code>,
              а <code>FormatSelect</code> переключает его на лету. Здесь три <code>Root</code> с
              одним контролируемым значением: измените поле в одной полосе — обновятся все.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={formatsSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ColorPickerFormatsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Общего <code>disabled</code> у <code>Root</code> нет — отключайте части:{" "}
              <code>disabled</code> у <code>Area</code>, <code>Slider</code>,{" "}
              <code>SwatchPickerItem</code>. Поля следуют системе полей (hover, фокус по Tab,
              ошибка, disabled); неверный hex в <code>HexInput</code> и полосе откатывается при blur
              / Enter. Пипетка неактивна, если браузер не поддерживает EyeDropper API.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ColorPickerStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: цвет бренда в настройках</DemoSectionTitle>
            <DemoDescription>
              Контролируемый режим: <code>value</code> + <code>onValueChange</code> с объектом{" "}
              <code>Color</code> (начальное значение — <code>parseColor</code>). Поле hex, триггер с
              панелью в Popover и пресеты бренда редактируют один цвет; превью и сброс живут снаружи
              пикера. Размер <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={brandColorSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ColorPickerBrandColorExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Пресеты: быстрый цвет</DemoSectionTitle>
            <DemoDescription>
              <code>ColorPresets</code> — без палитры и значения: квадрат текущего цвета открывает
              сетку свотчей. 8 пресетов — один ряд, 16 (по умолчанию <code>COLOR_PRESETS</code>) — 8
              × 2; <code>allowEmpty</code> добавляет в конец «Без цвета», <code>Content label</code>{" "}
              — подпись секции. Стрелки, Home / End, Enter / Space выбирает и закрывает, Escape
              возвращает фокус на триггер. Свой триггер — <code>Trigger asChild</code> +{" "}
              <code>ColorPresets.Swatch</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={presetsQuickSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ColorPresetsQuickExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Пресеты: размеры</DemoSectionTitle>
            <DemoDescription>
              Триггер — квадрат высоты контрола (<code>xs</code> 28 … <code>xl</code> 48) и стоит в
              ряд с полем того же <code>size</code>; свотчи в панели растут с ярусом.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={presetsSizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ColorPresetsSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Пресеты: цвета меток</DemoSectionTitle>
            <DemoDescription>
              Как в управлении метками TagSelect: у каждой строки свой <code>ColorPresets</code>{" "}
              яруса <code>s</code> внутри Popover. Вложенная панель закрывается первой (Escape, клик
              снаружи).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={presetsLabelsSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <ColorPresetsLabelsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>ColorPicker.Root</DemoApiTitle>
            <DemoDescription>
              Общее состояние цвета и формата для всех вложенных частей (без своего DOM). Триггер и
              панель держите под одним <code>Root</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={colorPickerRootApiRows} />

            <DemoApiTitle>ColorPicker.Panel</DemoApiTitle>
            <DemoDescription>
              Вертикальная раскладка частей, по желанию — своя поверхность.
            </DemoDescription>
            <PlaygroundApiTable rows={panelApiRows} />

            <DemoApiTitle>ColorPicker.FormatSelect</DemoApiTitle>
            <DemoDescription>
              Китовый Select HSL / RGB / Hex; формат хранит <code>Root</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={formatSelectApiRows} />

            <DemoApiTitle>ColorPicker.ChannelStrip</DemoApiTitle>
            <DemoDescription>
              Пипетка и компактные поля каналов (или одно hex-поле) по текущему формату.
            </DemoDescription>
            <PlaygroundApiTable rows={channelStripApiRows} />

            <DemoApiTitle>ColorPicker.HexInput</DemoApiTitle>
            <DemoDescription>
              Китовый Input с hex текущего цвета; единственная часть с осью size.
            </DemoDescription>
            <PlaygroundApiTable rows={hexInputApiRows} />

            <DemoApiTitle>ColorPicker.TriggerSwatch</DemoApiTitle>
            <DemoDescription>Квадрат текущего цвета для кнопки-триггера.</DemoDescription>
            <PlaygroundApiTable rows={triggerSwatchApiRows} />

            <DemoApiTitle>ColorPicker.SliderMeta</DemoApiTitle>
            <DemoDescription>Строка «подпись + значение» над треком слайдера.</DemoDescription>
            <PlaygroundApiTable rows={sliderMetaApiRows} />

            <DemoApiTitle>ColorPicker.EyeDropperButton</DemoApiTitle>
            <DemoDescription>
              Кнопка захвата цвета с экрана (EyeDropper API); уже встроена в{" "}
              <code>ChannelStrip</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={eyeDropperButtonApiRows} />

            <DemoApiTitle>Обёртки react-aria-components</DemoApiTitle>
            <DemoDescription>
              Стилизованные части с API соответствующих примитивов RAC (<code>className</code> и{" "}
              <code>style</code> принимают render-функции). В колонке «Prop» — имя части, в «Type» —
              тип пропсов RAC.
            </DemoDescription>
            <PlaygroundApiTable rows={racPartsApiRows} />

            <DemoApiTitle>ColorPresets.Root</DemoApiTitle>
            <DemoDescription>
              Быстрый выбор из пресетов. Части: <code>Trigger</code> (квадрат-свотч или{" "}
              <code>asChild</code>), <code>Swatch</code> (цвет для своего триггера),{" "}
              <code>Content</code> (<code>label</code>, <code>align</code>, <code>side</code>).
            </DemoDescription>
            <PlaygroundApiTable rows={colorPresetsRootApiRows} />
            <DemoApiTitle>ColorPresets.Trigger · Content · Swatch</DemoApiTitle>
            <PlaygroundApiTable rows={colorPresetsPartsApiRows} />

            <DemoApiTitle>parseColor</DemoApiTitle>
            <DemoDescription>
              Разбор CSS-строки в <code>Color</code> (re-export из RAC).
            </DemoDescription>
            <PlaygroundApiTable rows={parseColorApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
