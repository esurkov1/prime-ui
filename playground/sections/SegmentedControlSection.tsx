import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import SegmentedControlColorsExample from "@/components/segmented-control/examples/colors";
import colorsSource from "@/components/segmented-control/examples/colors.tsx?raw";
import SegmentedControlControlledExample from "@/components/segmented-control/examples/controlled";
import controlledSource from "@/components/segmented-control/examples/controlled.tsx?raw";
import SegmentedControlFullWidthExample from "@/components/segmented-control/examples/full-width";
import fullWidthSource from "@/components/segmented-control/examples/full-width.tsx?raw";
import SegmentedControlItemContentExample from "@/components/segmented-control/examples/item-content";
import itemContentSource from "@/components/segmented-control/examples/item-content.tsx?raw";
import SegmentedControlSizesExample from "@/components/segmented-control/examples/sizes";
import sizesSource from "@/components/segmented-control/examples/sizes.tsx?raw";
import SegmentedControlStatesExample from "@/components/segmented-control/examples/states";
import statesSource from "@/components/segmented-control/examples/states.tsx?raw";
import SegmentedControlSurfacesExample from "@/components/segmented-control/examples/surfaces";
import surfacesSource from "@/components/segmented-control/examples/surfaces.tsx?raw";
import SegmentedControlToolbarExample from "@/components/segmented-control/examples/toolbar";
import toolbarSource from "@/components/segmented-control/examples/toolbar.tsx?raw";
import SegmentedControlTwoLineExample from "@/components/segmented-control/examples/two-line";
import twoLineSource from "@/components/segmented-control/examples/two-line.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const segmentedRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Выбранное значение в контролируемом режиме (должно совпадать с value одного из Item).",
  },
  {
    prop: "defaultValue",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description:
      "Начальное значение при неконтролируемом режиме; пустая строка — ни один сегмент не выбран.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при смене выбранного сегмента (клик или клавиатура на группе).",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Блокирует всю группу: aria-disabled на radiogroup, все сегменты неактивны.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус --prime-control-<tier>-*: внешняя высота равна Button / Input того же размера (28 · 32 · 36 · 40 · 48).",
  },
  {
    prop: "fullWidth",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Растягивает группу на ширину контейнера; сегменты равные, длинные подписи обрезаются. Без него группа по содержимому и в узком контейнере прокручивается.",
  },
  {
    prop: "aria-label / aria-labelledby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя radiogroup; задавайте всегда — у группы нет видимой подписи.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Сегменты SegmentedControl.Item; «таблетку» выбора корень рисует сам и плавно переносит к выбранному.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс на контейнере radiogroup.",
  },
];

const segmentedItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Идентификатор сегмента; сравнивается с value/defaultValue корня.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Отключает один сегмент; при навигации стрелками пропускается.",
  },
  {
    prop: "color",
    type: "PaletteColor",
    defaultValue: "—",
    required: "Нет",
    description:
      "Цвет палитры пункта: точка перед подписью, у выбранного — мягкая заливка бегунка этим цветом с тонким кольцом.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Текст, SegmentedControl.Icon, Label, Count, Description. Description делает сегмент двухстрочным. Только иконка — квадратный сегмент: задайте aria-label и оберните в Tooltip.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс на кнопке сегмента.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "children" | "type" | "role">',
    defaultValue: "—",
    required: "Нет",
    description: "aria-label, onClick и прочие атрибуты button; ref — на button.",
  },
];

const segmentedIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Иконка размера --prime-control-<tier>-icon; обёртка помечена aria-hidden — сегменту из одной иконки нужен aria-label.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс на span.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLSpanElement>, "children">',
    defaultValue: "—",
    required: "Нет",
    description: "data-*, style и прочие атрибуты span (кроме children).",
  },
];

const segmentedTwoLineApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "SegmentedControl.Label",
    type: "children, className, …HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись (обрезается многоточием). Обычный текст в Item оборачивается сам.",
  },
  {
    prop: "SegmentedControl.Description",
    type: "children, className, …HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      "Вторая строка (кегль подсказки яруса, приглушённая; <strong> — основной цвет). Делает сегмент двухстрочным, становится aria-describedby.",
  },
];

const segmentedCountApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "color",
    type: "PaletteColor",
    defaultValue: '"gray"',
    required: "Нет",
    description: "Цвет мягкого бейджа.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Число. Бейдж на ярус ниже контрола (m → s), цифры моноширинные.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс на бейдже.",
  },
];

type Demo = {
  title: string;
  description: React.ReactNode;
  code: string;
  layout: "stack" | "stack-center";
  preview: React.ReactNode;
};

const demos: Demo[] = [
  {
    title: "Размеры в ряду панели",
    description: (
      <>
        <code>xs · s · m · l · xl</code> рядом с Input и Button того же размера: высота группы равна
        высоте контрола яруса, ряд выровнен без подгонки. Отступ дорожки 4px на всех ярусах; радиус
        сегмента — радиус дорожки минус отступ.
      </>
    ),
    code: sizesSource,
    layout: "stack",
    preview: <SegmentedControlSizesExample />,
  },
  {
    title: "Содержимое сегмента",
    description: (
      <>
        Иконка + текст, только иконка (квадратный сегмент, <code>aria-label</code> и Tooltip) и
        счётчик <code>SegmentedControl.Count</code> — бейдж на ярус ниже.
      </>
    ),
    code: itemContentSource,
    layout: "stack",
    preview: <SegmentedControlItemContentExample />,
  },
  {
    title: "Двухстрочные: автопарк",
    description: (
      <>
        <code>SegmentedControl.Label</code> + <code>Count</code> в первой строке,{" "}
        <code>Description</code> во второй (значение в <code>&lt;strong&gt;</code>). С{" "}
        <code>fullWidth</code> сегменты распределяются по дорожке, на узком экране ряд
        прокручивается с затуханием краёв. Текст выбранного сегмента остаётся читаемым.
      </>
    ),
    code: twoLineSource,
    layout: "stack",
    preview: <SegmentedControlTwoLineExample />,
  },
  {
    title: "По содержимому и во всю ширину",
    description: (
      <>
        По умолчанию сегменты шириной в подпись, в узком контейнере группа прокручивается (не
        переносится). <code>fullWidth</code> делит ширину поровну и обрезает длинные подписи.
      </>
    ),
    code: fullWidthSource,
    layout: "stack",
    preview: <SegmentedControlFullWidthExample />,
  },
  {
    title: "На разных поверхностях",
    description: (
      <>
        Дорожка <code>fill-muted</code>, выбранный сегмент — поверхность с лёгкой тенью (в тёмной
        теме на шаг светлее дорожки). Видно на холсте, в карточке, во вложенной карточке и в
        модальном окне.
      </>
    ),
    code: surfacesSource,
    layout: "stack",
    preview: <SegmentedControlSurfacesExample />,
  },
  {
    title: "Цвет пунктов",
    description: (
      <>
        <code>color</code> на <code>Item</code>: точка цвета палитры перед подписью; выбранный пункт
        — мягкая заливка своего цвета с тонким кольцом вместо нейтральной «таблетки», подпись
        основным цветом. Бегунок переезжает и перекрашивается одним токеном движения.
      </>
    ),
    code: colorsSource,
    layout: "stack",
    preview: <SegmentedControlColorsExample />,
  },
  {
    title: "Состояния",
    description: (
      <>
        Выбранный сегмент, группа без выбора, <code>disabled</code> на одном <code>Item</code> и на
        всём <code>Root</code>. Наведение на невыбранный — только основной цвет текста (заливка —
        одна «таблетка»). Tab ставит фокус на выбранный сегмент (без выбора — на первый), стрелки
        двигают выбор, пропуская отключённые; Home / End — к краям.
      </>
    ),
    code: statesSource,
    layout: "stack",
    preview: <SegmentedControlStatesExample />,
  },
  {
    title: "Контролируемый режим",
    description: (
      <>
        Выбор хранится в состоянии родителя: <code>value</code> и <code>onValueChange</code> на{" "}
        <code>Root</code>.
      </>
    ),
    code: controlledSource,
    layout: "stack",
    preview: <SegmentedControlControlledExample />,
  },
  {
    title: "Панель инструментов",
    description: (
      <>
        Над задачами: поиск, вид «Список / Доска / Календарь», период «День / Неделя / Месяц / Год»
        и экспорт — всё размера <code>m</code>.
      </>
    ),
    code: toolbarSource,
    layout: "stack",
    preview: <SegmentedControlToolbarExample />,
  },
];

export default function SegmentedControlSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>SegmentedControl</PageContent.Title>
        <PageContent.Description measure="full">
          Выбор одного значения или режима из 2–5 вариантов с мгновенным эффектом: период отчёта,
          вид списка. Выбранный сегмент — «таблетка» на серой дорожке, она плавно переезжает при
          смене выбора. Для навигации между панелями содержимого используйте Tabs.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          {demos.map((demo) => (
            <div key={demo.title} className="demoBlock">
              <DemoSectionTitle>{demo.title}</DemoSectionTitle>
              <DemoDescription>{demo.description}</DemoDescription>
              <PlaygroundExampleFrame.Root code={demo.code.trim()} previewLayout={demo.layout}>
                <PlaygroundExampleFrame.Stage>{demo.preview}</PlaygroundExampleFrame.Stage>
              </PlaygroundExampleFrame.Root>
            </div>
          ))}

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>SegmentedControl.Root</DemoApiTitle>
            <DemoDescription>
              Контейнер <code>role=&quot;radiogroup&quot;</code>: хранит выбор, раздаёт контекст
              сегментам, обрабатывает стрелки и Home / End, двигает «таблетку».
            </DemoDescription>
            <PlaygroundApiTable rows={segmentedRootApiRows} />
            <DemoApiTitle>SegmentedControl.Item</DemoApiTitle>
            <DemoDescription>
              Сегмент — <code>button</code> с <code>role=&quot;radio&quot;</code> и roving{" "}
              <code>tabIndex</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={segmentedItemApiRows} />
            <DemoApiTitle>SegmentedControl.Icon</DemoApiTitle>
            <DemoDescription>
              Слот иконки размера <code>--prime-control-&lt;tier&gt;-icon</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={segmentedIconApiRows} />
            <DemoApiTitle>SegmentedControl.Count</DemoApiTitle>
            <PlaygroundApiTable rows={segmentedCountApiRows} />
            <DemoApiTitle>Двухстрочный сегмент</DemoApiTitle>
            <PlaygroundApiTable rows={segmentedTwoLineApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
