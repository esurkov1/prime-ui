import DatepickerBadgeExample from "@/components/datepicker/examples/badge";
import datepickerBadgeSource from "@/components/datepicker/examples/badge.tsx?raw";
import DatepickerInFormExample from "@/components/datepicker/examples/in-form";
import datepickerInFormSource from "@/components/datepicker/examples/in-form.tsx?raw";
import DatepickerInlinePanelExample from "@/components/datepicker/examples/inline-panel";
import datepickerInlinePanelSource from "@/components/datepicker/examples/inline-panel.tsx?raw";
import DatepickerNarrowExample from "@/components/datepicker/examples/narrow";
import datepickerNarrowSource from "@/components/datepicker/examples/narrow.tsx?raw";
import DatepickerRangePresetsExample from "@/components/datepicker/examples/range-presets";
import datepickerRangePresetsSource from "@/components/datepicker/examples/range-presets.tsx?raw";
import DatepickerSingleExample from "@/components/datepicker/examples/single";
import datepickerSingleSource from "@/components/datepicker/examples/single.tsx?raw";
import DatepickerSizesExample from "@/components/datepicker/examples/sizes";
import datepickerSizesSource from "@/components/datepicker/examples/sizes.tsx?raw";
import DatepickerStatesExample from "@/components/datepicker/examples/states";
import datepickerStatesSource from "@/components/datepicker/examples/states.tsx?raw";
import DatepickerYearlessExample from "@/components/datepicker/examples/yearless";
import datepickerYearlessSource from "@/components/datepicker/examples/yearless.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const panelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "mode",
    type: '"range" | "single"',
    defaultValue: "—",
    required: "Да",
    description: "Диапазон или одна дата; от режима зависят типы value и onValueChange.",
  },
  {
    prop: "value / defaultValue / onValueChange",
    type: "DatepickerRange | Date | null",
    defaultValue: "пусто",
    required: "Нет",
    description:
      "Значение в «настенном» времени (локальные поля Date), контролируемое или нет. В range границы могут быть null.",
  },
  {
    prop: "months",
    type: "1 | 2",
    defaultValue: "1",
    required: "Нет",
    description:
      "Сколько месяцев рядом. Если два не помещаются (окно — для поповера, своя ширина — для встроенной панели), показывается один.",
  },
  {
    prop: "presets",
    type: "DatepickerPreset[] | false",
    defaultValue: "false",
    required: "Нет",
    description:
      "Колонка периодов слева (range). Готовые: datepickerPresets, набор DEFAULT_DATEPICKER_PRESETS, «Всё время» — datepickerPresets.allTime().",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Клетка дня = высота пункта меню яруса (24 · 28 · 32 · 36 · 40); кнопки нижней строки на ступень меньше.",
  },
  {
    prop: "prompt",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Подсказка-шаг «Выберите начальную/конечную дату» под календарём.",
  },
  {
    prop: "footer",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Нижняя строка с датами и кнопками «Сбросить» / «Применить». Без неё выбор применяется сразу.",
  },
  {
    prop: "withTime",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Поля времени в нижней строке (00:00 — 23:59 по умолчанию).",
  },
  {
    prop: "isDayDisabled / disableFuture",
    type: "(day: Date) => boolean / boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Недоступные дни; будущие дни приглушены при disableFuture.",
  },
  {
    prop: "yearless",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Ежегодная дата «день + месяц»: без года, значения в YEARLESS_YEAR.",
  },
  {
    prop: "resetValue",
    type: "DatepickerRange | Date | null",
    defaultValue: "пусто",
    required: "Нет",
    description: "Что отдать по «Сбросить».",
  },
  {
    prop: "today / locale / weekStartsOn / labels",
    type: "Date / Locale / 0–6 / Partial<DatepickerLabels>",
    defaultValue: "сегодня / ru / 1 / русские",
    required: "Нет",
    description: "«Сегодня» в нужном часовом поясе, локаль date-fns, начало недели и подписи.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс корня панели (у Root — класс обёртки поля).",
  },
];

const rootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "…DatepickerPanelProps",
    type: "—",
    defaultValue: "—",
    required: "—",
    description: "Все пропы панели.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус поля и панели; поле выравнивается с Input и Select того же размера.",
  },
  {
    prop: "placeholder",
    type: "string",
    defaultValue: '"Выбрать дату"',
    required: "Нет",
    description: "Текст поля без значения.",
  },
  {
    prop: "label / required / optional / hint / error",
    type: "ReactNode / boolean / boolean / ReactNode / ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Поле формы как у Input: подпись над полем, *, «необязательно», подсказка и ошибка под ним (error включает invalid).",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Inset-кольцо danger, aria-invalid, data-invalid — без текста.",
  },
  {
    prop: "valuePrefix",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Текст перед значением, например «С 15 октября».",
  },
  {
    prop: "aria-label / aria-labelledby / aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Имя поля без label (к нему добавляется значение) или связь с внешними элементами.",
  },
  {
    prop: "disabled / align / fullWidth",
    type: 'boolean / "start" | "center" | "end" / boolean',
    defaultValue: 'false / "start" / false',
    required: "Нет",
    description: "Блокировка, выравнивание поповера, кнопка на всю ширину.",
  },
  {
    prop: "open / defaultOpen / onOpenChange",
    type: "boolean / boolean / (open: boolean) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Управляемое открытие поповера.",
  },
  {
    prop: "focusRing",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: 'false скрывает только кольцо фокуса (data-focus-ring="false").',
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "авто",
    required: "Нет",
    description: "id кнопки поля.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Украшения поля: Datepicker.Badge перед шевроном (входит в доступное имя).",
  },
];

const badgeApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "color",
    type: "PaletteColor",
    defaultValue: '"gray"',
    required: "Нет",
    description: "Цвет мягкого бейджа (на ярус ниже поля).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст бейджа.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс бейджа.",
  },
];

export default function DatepickerSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Datepicker</PageContent.Title>
        <PageContent.Description measure="full">
          Выбор даты или периода: <code>Datepicker.Root</code> — кнопка с поповером,{" "}
          <code>Datepicker.Panel</code> — та же панель внутри страницы. Пресеты слева, один или два
          месяца, подсказка, нижняя строка с временем. Колесо над открытым поповером не прокручивает
          страницу. Стрелки двигают фокус по дням, PageUp/PageDown листают месяцы, Home/End — начало
          и конец недели, Enter выбирает.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Период с пресетами</DemoSectionTitle>
            <DemoDescription>
              <code>months=&#123;2&#125;</code>, <code>presets</code>, <code>prompt</code>,{" "}
              <code>footer</code> и <code>withTime</code>; будущие дни недоступны.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={datepickerRangePresetsSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DatepickerRangePresetsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Бейдж в поле</DemoSectionTitle>
            <DemoDescription>
              <code>Datepicker.Badge</code> внутри <code>Datepicker.Root</code>: мягкий бейдж на
              ярус ниже у правого края, перед шевроном; входит в доступное имя поля.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={datepickerBadgeSource.trim()}
              previewLayout="stack-narrow"
            >
              <PlaygroundExampleFrame.Stage>
                <DatepickerBadgeExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code>–<code>xl</code>: высота поля 28–48 — в одну линию с Input, Select и
              Button того же размера. Панель берёт тот же ярус: клетка дня 24–40 px. По умолчанию —{" "}
              <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={datepickerSizesSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DatepickerSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния поля</DemoSectionTitle>
            <DemoDescription>
              Поле устроено как остальные поля: заливка без рамки, при наведении темнее, открыто или
              в фокусе — <code>field-bg-focus</code> с кольцом. <code>label</code>,{" "}
              <code>hint</code> и <code>error</code> — пропсы Root (ошибка включает кольцо danger и
              попадает в <code>aria-describedby</code>); <code>disabled</code> не открывает панель.
              Сегодняшний день — акцентный цвет и полужирный, без точки.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={datepickerStatesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <DatepickerStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Одна дата</DemoSectionTitle>
            <DemoDescription>
              <code>mode=&quot;single&quot;</code> без нижней строки: клик по дню сразу применяет
              значение.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={datepickerSingleSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DatepickerSingleExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Встроенная панель</DemoSectionTitle>
            <DemoDescription>
              <code>Datepicker.Panel</code> без поповера сама себе карточка: заливка, радиус, поля и
              тень карточки (на холсте — белая, внутри карточки — утопленная плитка). Ширина по
              содержимому, месяцы прижаты к началу; два месяца — когда родителю хватает места, иначе
              один.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={datepickerInlinePanelSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DatepickerInlinePanelExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Узкий экран, 320 px</DemoSectionTitle>
            <DemoDescription>
              Datepicker сам считает доступную ширину. В поповере это окно минус 8 px с каждой
              стороны: два месяца превращаются в один, колонка периодов уходит в прокручиваемую
              строку над календарём, панель никогда не шире экрана. Встроенная панель меряет
              доступную ширину родителя (не свою): уже одного месяца — компактный режим (клетки
              сжимаются, поля меньше, поля даты в нижней строке встают над кнопками). Ниже —{" "}
              <code>months=&#123;2&#125;</code> в колонке 320 px: один месяц.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={datepickerNarrowSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DatepickerNarrowExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Форма в карточке</DemoSectionTitle>
            <DemoDescription>
              Заявка на отпуск: обязательный период (<code>required</code> на{" "}
              <code>Datepicker.Root</code>), ошибка после отправки на месте подсказки,
              необязательная дата выхода (<code>optional</code>).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={datepickerInFormSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DatepickerInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Ежегодная дата</DemoSectionTitle>
            <DemoDescription>
              <code>yearless</code>: день и месяц без года, <code>isDayDisabled</code> закрывает
              занятые даты.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={datepickerYearlessSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <DatepickerYearlessExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>
        </div>

        <DemoApiTitle>Datepicker.Panel</DemoApiTitle>
        <PlaygroundApiTable rows={panelApiRows} />
        <DemoApiTitle>Datepicker.Root</DemoApiTitle>
        <PlaygroundApiTable rows={rootApiRows} />
        <DemoApiTitle>Datepicker.Badge</DemoApiTitle>
        <PlaygroundApiTable rows={badgeApiRows} />
      </PageContent.Body>
    </PageContent.Section>
  );
}
