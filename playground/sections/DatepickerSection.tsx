import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DatepickerCompositionSnippet from "../snippets/datepicker/composition";
import compositionSource from "../snippets/datepicker/composition.tsx?raw";
import DatepickerControlledValueSnippet from "../snippets/datepicker/controlled-value";
import controlledValueSource from "../snippets/datepicker/controlled-value.tsx?raw";
import DatepickerFullWidthSnippet from "../snippets/datepicker/full-width";
import fullWidthSource from "../snippets/datepicker/full-width.tsx?raw";
import DatepickerPopoverSnippet from "../snippets/datepicker/popover";
import popoverSource from "../snippets/datepicker/popover.tsx?raw";
import DatepickerRangePresetsTimeSnippet from "../snippets/datepicker/range-presets-time";
import rangePresetsTimeSource from "../snippets/datepicker/range-presets-time.tsx?raw";
import DatepickerResponsiveMonthsSnippet from "../snippets/datepicker/responsive-months";
import responsiveMonthsSource from "../snippets/datepicker/responsive-months.tsx?raw";
import DatepickerSizesSnippet from "../snippets/datepicker/sizes";
import sizesSource from "../snippets/datepicker/sizes.tsx?raw";
import DatepickerStatesSnippet from "../snippets/datepicker/states";
import statesSource from "../snippets/datepicker/states.tsx?raw";
import DatepickerVariantsModesSnippet from "../snippets/datepicker/variants-modes";
import variantsModesSource from "../snippets/datepicker/variants-modes.tsx?raw";

const calendarApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: "из Shell или «m»",
    required: "Нет",
    description:
      "Размер сетки и навигации: токены высоты ячеек, кегля и кнопок; можно переопределить поверх размера из Datepicker.Shell.",
  },
  {
    prop: "responsiveMonths",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Подстраивать число колонок месяцев (1 или 2) по ширине контейнера; при true проп numberOfMonths игнорируется.",
  },
  {
    prop: "responsiveBreakpoints",
    type: "{ twoColumns: number }",
    defaultValue: "{ twoColumns: 500 }",
    required: "Нет",
    description: "Порог ширины контейнера (px) для переключения на два месяца рядом.",
  },
  {
    prop: "weekStartsOn",
    type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
    defaultValue: "1",
    required: "Нет",
    description: "Первый день недели в шапке (по умолчанию понедельник).",
  },
  {
    prop: "navLayout",
    type: 'React-day-picker: до/после сетки ("before" | "after" | ...)',
    defaultValue: '"after"',
    required: "Нет",
    description: "Раскладка навигации по месяцам (пробрасывается в react-day-picker).",
  },
  {
    prop: "month",
    type: "Date",
    defaultValue: "—",
    required: "Нет",
    description: "Отображаемый месяц в контролируемом режиме (см. onMonthChange).",
  },
  {
    prop: "onMonthChange",
    type: "(month: Date) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Смена месяца пользователем; синхронизируется с контекстом Shell для пресетов.",
  },
  {
    prop: "numberOfMonths",
    type: "number",
    defaultValue: "1",
    required: "Нет",
    description: "Фиксированное число месяцев в ряд, если responsiveMonths не включён.",
  },
  {
    prop: "mode",
    type: '"single" | "range" | "multiple" | …',
    defaultValue: "—",
    required: "Да",
    description:
      "Режим выбора дат; типы selected/onSelect зависят от режима (см. документацию react-day-picker).",
  },
  {
    prop: "selected",
    type: "Date | DateRange | Date[] | …",
    defaultValue: "—",
    required: "Нет",
    description: "Выбранное значение в контролируемом режиме (формат зависит от mode).",
  },
  {
    prop: "onSelect",
    type: "(value: …) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Обработчик выбора; сигнатура соответствует mode.",
  },
  {
    prop: "disabled",
    type: "Matcher | Matcher[]",
    defaultValue: "—",
    required: "Нет",
    description:
      "Недоступные дни (диапазоны, дни недели, произвольная функция — см. react-day-picker).",
  },
  {
    prop: "locale",
    type: "Locale (date-fns)",
    defaultValue: "—",
    required: "Нет",
    description: "Локаль для подписей месяцев и дней недели.",
  },
  {
    prop: "classNames",
    type: "Partial<ClassNames>",
    defaultValue: "—",
    required: "Нет",
    description: "Переопределение имён классов day-picker; сливается с оформлением Prime.",
  },
  {
    prop: "components",
    type: "Partial<CustomComponents>",
    defaultValue: "—",
    required: "Нет",
    description:
      "Кастомные части календаря; встроенные Chevron и MonthCaption дополняют переданное.",
  },
  {
    prop: "style",
    type: "React.CSSProperties",
    defaultValue: "—",
    required: "Нет",
    description: "Инлайн-стили корня day-picker.",
  },
  {
    prop: "…rest",
    type: "DayPickerProps (react-day-picker)",
    defaultValue: "—",
    required: "Нет",
    description:
      "Остальные пропсы DayPicker: модификаторы, футер, captionLayout, dir, timeZone и т.д.",
  },
];

const shellApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Размер оболочки и контекст для Calendar, Time, Value и Presets без собственного size.",
  },
  {
    prop: "presets",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Слот под полосу пресетов (обычно Datepicker.Presets); при наличии включается нижняя панель и data-layout.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Календарь, время, подпись выбора и прочая разметка внутри оболочки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс корневого контейнера (например ширина или отступы).",
  },
];

const presetsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "mode",
    type: '"single" | "range"',
    defaultValue: "—",
    required: "Да",
    description:
      "Режим пресетов: одна дата или диапазон; от этого зависят поля presets и onSelect.",
  },
  {
    prop: "presets",
    type: "DatepickerPresetSingle[] | DatepickerPresetRange[]",
    defaultValue: "—",
    required: "Да",
    description: "Список кнопок быстрого выбора с подписью и значением.",
  },
  {
    prop: "onSelect",
    type: "(date: Date | undefined) => void | (range: DateRange | undefined) => void",
    defaultValue: "—",
    required: "Да",
    description: "Вызов при клике по пресету; для диапазона передаётся DateRange.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: "из Shell или «m»",
    required: "Нет",
    description: "Размер сегментов ButtonGroup в полосе пресетов.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс блока пресетов.",
  },
  {
    prop: "title",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Объявлено в публичном типе; в текущей разметке не выводится.",
  },
];

const timeApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "mode",
    type: '"single" | "range"',
    defaultValue: '"single"',
    required: "Нет",
    description: "В режиме range нужны from, to и два обработчика; иначе value и onChange.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: "из Shell или «m»",
    required: "Нет",
    description: "Размер полей Input для времени.",
  },
  {
    prop: "value",
    type: "Date | undefined",
    defaultValue: "—",
    required: "Да (single)",
    description: "Дата-якорь для времени; при отсутствии поле time disabled.",
  },
  {
    prop: "onChange",
    type: "(next: Date) => void",
    defaultValue: "—",
    required: "Да (single)",
    description: 'Обновление даты с новыми часами и минутами из input type="time".',
  },
  {
    prop: "from",
    type: "Date | undefined",
    defaultValue: "—",
    required: "Да (range)",
    description: "Начало диапазона; время редактируется отдельно от конца.",
  },
  {
    prop: "to",
    type: "Date | undefined",
    defaultValue: "—",
    required: "Да (range)",
    description: "Конец диапазона.",
  },
  {
    prop: "onFromChange",
    type: "(next: Date) => void",
    defaultValue: "—",
    required: "Да (range)",
    description: "Изменение времени у даты начала.",
  },
  {
    prop: "onToChange",
    type: "(next: Date) => void",
    defaultValue: "—",
    required: "Да (range)",
    description: "Изменение времени у даты конца.",
  },
  {
    prop: "labels",
    type: "{ time?: string } | { from?: string; to?: string }",
    defaultValue: "«Время» / «Начало» / «Конец»",
    required: "Нет",
    description: "Подписи к полям времени.",
  },
];

const valueApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: "из Shell или «m»",
    required: "Нет",
    description:
      "Маппится на семантический variant Typography (роли caption / body), а не на ось size контролов.",
  },
  {
    prop: "as",
    type: '"p" | "span" | "div"',
    defaultValue: '"p"',
    required: "Нет",
    description: "Корневой тег текста.",
  },
  {
    prop: "tone",
    type: '"default" | "muted"',
    defaultValue: '"muted"',
    required: "Нет",
    description: "Наследует Typography: приглушённый текст для подписи выбранной даты.",
  },
  {
    prop: "weight",
    type: '"regular" | "medium" | "semibold"',
    defaultValue: '"regular"',
    required: "Нет",
    description: "Начертание.",
  },
  {
    prop: "tracking",
    type: '"normal" | "tight" | "tighter" | "wide"',
    defaultValue: '"normal"',
    required: "Нет",
    description: "Межбуквенное расстояние.",
  },
  {
    prop: "italic",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Курсив.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Отформатированная строка или произвольная разметка рядом с календарём.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты выбранного тега as (кроме переопределённых Typography).",
  },
];

const utilFormatTimeApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "date",
    type: "Date | undefined",
    defaultValue: "—",
    required: "Да",
    description:
      'Исходная дата; возвращается строка HH:mm для value нативного input type="time" в локальном времени, иначе пустая строка.',
  },
];

const utilMergeTimeApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "date",
    type: "Date",
    defaultValue: "—",
    required: "Да",
    description: "Дата, в которую подставляется время.",
  },
  {
    prop: "timeHHmm",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Строка «ЧЧ:мм»; некорректные части трактуются как 0.",
  },
];

export default function DatepickerSection() {
  return (
    <PlaygroundDocPage
      title="Datepicker"
      description={
        <>
          Выбор одной даты или периода в календарной сетке с оформлением на токенах Prime. В
          продуктовом UI календарь и оболочку <code>Datepicker.Shell</code> размещают внутри{" "}
          <code>Popover.Content</code> (кнопка или поле — триггер); все примеры ниже следуют этому
          паттерну. Движок сетки — react-day-picker, локаль и форматирование — через date-fns.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>Datepicker.Shell</code> и <code>Datepicker.Calendar</code>{" "}
            <code>size</code> — каждое открывается своим <code>Popover</code> с кнопкой-триггером.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <DatepickerSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты и режимы</DemoSectionTitle>
          <DemoDescription>
            <code>mode=&quot;single&quot;</code> и <code>mode=&quot;range&quot;</code> — отдельные
            поповеры с кнопками-триггерами.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={variantsModesSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <DatepickerVariantsModesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Два поповера: календарь с <code>disabled</code> по дням недели и связка дата +{" "}
            <code>Datepicker.Time</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DatepickerStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Расположение месяцев</DemoSectionTitle>
          <DemoDescription>
            <code>responsiveMonths</code> и <code>responsiveBreakpoints</code> внутри поповера;
            превью с <code>examplePreviewBleed</code> для ширины контейнера.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={responsiveMonthsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DatepickerResponsiveMonthsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Состояние в React; подпись <code>Datepicker.Value</code> внутри панели поповера; после
            выбора даты поповер закрывается.
          </DemoDescription>
          <PlaygroundExampleFrame.Root
            code={controlledValueSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <DatepickerControlledValueSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Пресеты, календарь, время и <code>Datepicker.Value</code> в одном поповере, общее
            состояние.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <DatepickerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Широкая <code>Popover.Content</code> и <code>Datepicker.Shell</code> с{" "}
            <code>min-w-0</code>, чтобы сетка не ломала раскладку.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DatepickerFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Эталон: иконка календаря на триггере и закрытие после выбора даты; ниже — диапазон с
            пресетами и <code>Datepicker.Time</code> в отдельном поповере.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={popoverSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <DatepickerPopoverSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
          <PlaygroundExampleFrame.Root
            code={rangePresetsTimeSource.trim()}
            previewLayout="stack-center"
          >
            <PlaygroundExampleFrame.Stage>
              <DatepickerRangePresetsTimeSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Datepicker.Calendar</DemoApiTitle>
          <DemoDescription>
            Сетка дней на базе react-day-picker с классами и размерами Prime; опционально адаптивное
            число месяцев.
          </DemoDescription>
          <PlaygroundApiTable rows={calendarApiRows} />

          <DemoApiTitle>Datepicker.Shell</DemoApiTitle>
          <DemoDescription>
            Общий контекст размера и месяца для дочерних частей; опциональная нижняя полоса
            пресетов.
          </DemoDescription>
          <PlaygroundApiTable rows={shellApiRows} />

          <DemoApiTitle>Datepicker.Presets</DemoApiTitle>
          <DemoDescription>
            Горизонтальная группа кнопок быстрого выбора; для диапазона переключает{" "}
            <code>DateRange</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={presetsApiRows} />

          <DemoApiTitle>Datepicker.Time</DemoApiTitle>
          <DemoDescription>
            Одно или два поля <code>type=&quot;time&quot;</code> на базе Input; время вшивается в
            выбранные даты.
          </DemoDescription>
          <PlaygroundApiTable rows={timeApiRows} />

          <DemoApiTitle>Datepicker.Value</DemoApiTitle>
          <DemoDescription>
            Текстовая подпись с типографикой кита; размер текста выводится из контекста датпикера.
          </DemoDescription>
          <PlaygroundApiTable rows={valueApiRows} />

          <DemoApiTitle>formatTimeInputValue</DemoApiTitle>
          <DemoDescription>
            Утилита для синхронизации <code>Date</code> с нативным полем времени.
          </DemoDescription>
          <PlaygroundApiTable rows={utilFormatTimeApiRows} />

          <DemoApiTitle>mergeTimeIntoDate</DemoApiTitle>
          <DemoDescription>
            Утилита для применения строки времени к существующей дате.
          </DemoDescription>
          <PlaygroundApiTable rows={utilMergeTimeApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
