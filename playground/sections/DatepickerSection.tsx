import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
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
    description: "Маппится на кегль Typography (caption), а не на сырой TypographySize.",
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
          Выбор одной даты или периода в календарной сетке с оформлением на токенах Prime. Есть
          размеры, при необходимости второй столбец месяца на широкой области, полоса быстрых
          периодов, время суток и текстовая подпись выбора. Движок сетки — react-day-picker, подписи
          и локаль удобно задавать через date-fns.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Четыре значения <code>Datepicker.Shell</code> и <code>Datepicker.Calendar</code>{" "}
            <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>, <code>xl</code> —
            высота ячеек, кегль и кнопки навигации из одного яруса токенов.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <DatepickerSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты и режимы</h4>
          <p className="demoBlockDescription">
            Режим <code>mode=&quot;single&quot;</code> против <code>mode=&quot;range&quot;</code>:
            одна выбранная дата и выделенный интервал; оба примера на одном месяце для сравнения
            сетки.
          </p>
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
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Сверху — недоступные дни через проп <code>disabled</code> календаря; снизу — связка дата
            + <code>Datepicker.Time</code>: поле времени остаётся <code>disabled</code>, пока нет
            выбранной даты.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DatepickerStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Расположение месяцев</h4>
          <p className="demoBlockDescription">
            <code>responsiveMonths</code> и при необходимости <code>responsiveBreakpoints</code>:
            при ширине контейнера от заданного порога показываются два месяца. Область превью с
            классом <code>examplePreviewBleed</code>, чтобы замерить ширину так же, как в карточке
            на всю колонку.
          </p>
          <PlaygroundExampleFrame.Root code={responsiveMonthsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DatepickerResponsiveMonthsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Состояние <code>selected</code> и <code>onSelect</code> подняты в React; выбранное
            значение выводится через <code>Datepicker.Value</code> с форматированием date-fns.
          </p>
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
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            <code>Datepicker.Shell</code> с <code>presets</code> (только одиночная дата), календарь
            с <code>responsiveMonths</code>, блок <code>Datepicker.Time</code> и{" "}
            <code>Datepicker.Value</code> — одно общее состояние в родителе.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <DatepickerCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Календарь внутри карточки на всю доступную ширину: обёртка <code>w-full</code>, у
            поверхности превью — <code>min-w-0</code>, чтобы сетка не вылезала за границы
            flex-контейнера.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DatepickerFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи</h4>
          <p className="demoBlockDescription">
            Встроенный календарь во всплывающей панели с триггером-кнопкой и закрытием после выбора
            даты; отдельно — диапазон с пресетами периодов (только для{" "}
            <code>mode=&quot;range&quot;</code>) и двумя полями времени.
          </p>
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
          <h4>API</h4>
          <h5>Datepicker.Calendar</h5>
          <p className="demoBlockDescription">
            Сетка дней на базе react-day-picker с классами и размерами Prime; опционально адаптивное
            число месяцев.
          </p>
          <PlaygroundApiTable rows={calendarApiRows} />

          <h5>Datepicker.Shell</h5>
          <p className="demoBlockDescription">
            Общий контекст размера и месяца для дочерних частей; опциональная нижняя полоса
            пресетов.
          </p>
          <PlaygroundApiTable rows={shellApiRows} />

          <h5>Datepicker.Presets</h5>
          <p className="demoBlockDescription">
            Горизонтальная группа кнопок быстрого выбора; для диапазона переключает{" "}
            <code>DateRange</code>.
          </p>
          <PlaygroundApiTable rows={presetsApiRows} />

          <h5>Datepicker.Time</h5>
          <p className="demoBlockDescription">
            Одно или два поля <code>type=&quot;time&quot;</code> на базе Input; время вшивается в
            выбранные даты.
          </p>
          <PlaygroundApiTable rows={timeApiRows} />

          <h5>Datepicker.Value</h5>
          <p className="demoBlockDescription">
            Текстовая подпись с типографикой кита; размер текста выводится из контекста датпикера.
          </p>
          <PlaygroundApiTable rows={valueApiRows} />

          <h5>formatTimeInputValue</h5>
          <p className="demoBlockDescription">
            Утилита для синхронизации <code>Date</code> с нативным полем времени.
          </p>
          <PlaygroundApiTable rows={utilFormatTimeApiRows} />

          <h5>mergeTimeIntoDate</h5>
          <p className="demoBlockDescription">
            Утилита для применения строки времени к существующей дате.
          </p>
          <PlaygroundApiTable rows={utilMergeTimeApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
