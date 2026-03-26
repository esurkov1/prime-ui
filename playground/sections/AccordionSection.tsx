import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import AccordionCompositionSnippet from "../snippets/accordion/composition";
import compositionSource from "../snippets/accordion/composition.tsx?raw";
import AccordionControlledSnippet from "../snippets/accordion/controlled";
import controlledSource from "../snippets/accordion/controlled.tsx?raw";
import AccordionFeaturesArrowSnippet from "../snippets/accordion/features-arrow";
import featuresArrowSource from "../snippets/accordion/features-arrow.tsx?raw";
import AccordionFullWidthSnippet from "../snippets/accordion/full-width";
import fullWidthSource from "../snippets/accordion/full-width.tsx?raw";
import AccordionIconAsSnippet from "../snippets/accordion/icon-as";
import iconAsSource from "../snippets/accordion/icon-as.tsx?raw";
import AccordionSizesSnippet from "../snippets/accordion/sizes";
import sizesSource from "../snippets/accordion/sizes.tsx?raw";
import AccordionStatesSnippet from "../snippets/accordion/states";
import statesSource from "../snippets/accordion/states.tsx?raw";
import AccordionVariantsLayoutTypeSnippet from "../snippets/accordion/variants-layout-type";
import variantsLayoutTypeSource from "../snippets/accordion/variants-layout-type.tsx?raw";

const accordionRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"single" | "multiple"',
    defaultValue: '"single"',
    required: "Нет",
    description:
      "Режим: один открытый пункт или несколько; влияет на форму value и аргумент onValueChange.",
  },
  {
    prop: "value",
    type: "string | string[]",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое состояние: для single — id строки, для multiple — массив id.",
  },
  {
    prop: "defaultValue",
    type: "string | string[]",
    defaultValue: "—",
    required: "Нет",
    description: "Начальное раскрытие в неконтролируемом режиме (без prop value).",
  },
  {
    prop: "onValueChange",
    type: "(value: string | string[]) => void",
    defaultValue: "—",
    required: "Нет",
    description: "При single в колбэк передаётся строка; при multiple — массив открытых value.",
  },
  {
    prop: "collapsible",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      'Только при type="single": если false, нельзя закрыть единственный открытый пункт.',
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Токены текста, иконок, отступов триггера и контента.",
  },
  {
    prop: "layout",
    type: '"grouped" | "separate"',
    defaultValue: '"grouped"',
    required: "Нет",
    description: "Список в одной рамке или отдельные карточки с зазорами (data-layout).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс корневого div.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Accordion.Item и вложенная разметка.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "data-*, aria-* на корневой контейнер.",
  },
];

const accordionItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Уникальный идентификатор пункта внутри одного Root.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Блокирует раскрытие и клик по триггеру (data-disabled).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки пункта.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Header, Content и прочая структура пункта.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты на div пункта.",
  },
];

const accordionHeaderApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс для h3-обёртки заголовка.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно Accordion.Trigger.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLHeadingElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты нативного заголовка (рендерится как h3).",
  },
];

const accordionTriggerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки; по умолчанию button, чтобы не отправлять формы случайно.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс кнопки-триггера.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст, Accordion.Icon, Accordion.Arrow и др.",
  },
  {
    prop: "…rest",
    type: "React.ButtonHTMLAttributes<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description:
      "onClick вызывается до переключения; defaultPrevented отменяет смену состояния; aria-expanded и aria-controls выставляются автоматически.",
  },
];

const accordionIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: "React.ElementType",
    defaultValue: '"div"',
    required: "Нет",
    description: "Тег или компонент оболочки иконки (полиморфный слот).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс оболочки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка или разметка внутри оболочки.",
  },
  {
    prop: "…rest",
    type: "зависит от as",
    defaultValue: "—",
    required: "Нет",
    description:
      "Остальные пропсы выбранного в as тега или компонента (поле as и className зарезервированы).",
  },
];

const accordionArrowApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "openIcon",
    type: "React.ElementType<{ className?: string; strokeWidth?: number | string }>",
    defaultValue: "ChevronDown",
    required: "Нет",
    description: "Иконка в закрытом состоянии или единственная при вращении.",
  },
  {
    prop: "closeIcon",
    type: "Тот же контракт, что у openIcon",
    defaultValue: "—",
    required: "Нет",
    description: "Если задана и отличается от openIcon — переключение двух иконок без поворота.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс span-обёртки стрелки.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты span вокруг иконок; иконки помечены aria-hidden.",
  },
];

const accordionContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс внутреннего блока с padding и типографикой контента.",
  },
  {
    prop: "style",
    type: "React.CSSProperties",
    defaultValue: "—",
    required: "Нет",
    description: "Сливается с inline-стилем секции (в т.ч. CSS-переменная высоты анимации).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое раскрываемой области.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты внешней section; aria-labelledby и aria-hidden задаются из контекста.",
  },
];

export default function AccordionSection() {
  return (
    <PlaygroundDocPage
      headingId="accordion-heading"
      title="Accordion"
      description={
        <>
          Список разделов, которые пользователь открывает по одному или несколько сразу: вопросы и
          ответы, настройки, длинные формы. Размер и раскладка задаются пропсами корня; триггер —
          кнопка с понятной подписью и стрелкой или своей иконкой.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code> на корне: <code>s</code>, <code>m</code>,{" "}
            <code>l</code>, <code>xl</code> — меняются кегль, иконки и отступы триггера и текста
            контента.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <AccordionSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты и режимы</DemoSectionTitle>
          <DemoDescription>
            Визуальная раскладка <code>layout</code> (<code>grouped</code> / <code>separate</code>)
            и поведение <code>type</code> (<code>single</code> / <code>multiple</code>); для
            нескольких открытых секций — <code>defaultValue</code> как массив строк.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsLayoutTypeSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <AccordionVariantsLayoutTypeSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Отключённый пункт (<code>Accordion.Item disabled</code>), стартовое раскрытие (
            <code>defaultValue</code>) и режим без полного сворачивания в <code>single</code> (
            <code>collapsible={"{false}"}</code>).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <AccordionStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Пара <code>value</code> + <code>onValueChange</code> при{" "}
            <code>type=&quot;single&quot;</code>: родитель синхронизирует открытый пункт с боковыми
            кнопками или маршрутом.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <AccordionControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            <code>Accordion.Icon</code> с компонентом иконки через <code>as={"{Icon}"}</code>, текст
            в <code>span</code>, справа <code>Accordion.Arrow</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <AccordionCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Корень на всю ширину колонки превью (без класса с <code>max-width</code> демо): типично
            для боковой панели или широкого блока на странице.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <AccordionFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Полиморфная иконка</DemoSectionTitle>
          <DemoDescription>
            <code>Accordion.Icon</code> с <code>as=&quot;span&quot;</code> и произвольной разметкой
            внутри вместо передачи одного компонента в <code>as</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={iconAsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <AccordionIconAsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            <code>Accordion.Arrow</code>: смена набора иконок через <code>openIcon</code> и{" "}
            <code>closeIcon</code> (плюс/минус) рядом с вариантом по умолчанию.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={featuresArrowSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <AccordionFeaturesArrowSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Accordion.Root</DemoApiTitle>
          <DemoDescription>
            Контейнер списка: режим single/multiple, контролируемость, размер и групповая раскладка.
          </DemoDescription>
          <PlaygroundApiTable rows={accordionRootApiRows} />
          <DemoApiTitle>Accordion.Item</DemoApiTitle>
          <DemoDescription>Один раскрываемый блок с уникальным value.</DemoDescription>
          <PlaygroundApiTable rows={accordionItemApiRows} />
          <DemoApiTitle>Accordion.Header</DemoApiTitle>
          <DemoDescription>
            Семантический заголовок пункта (фиксированный уровень h3 в разметке).
          </DemoDescription>
          <PlaygroundApiTable rows={accordionHeaderApiRows} />
          <DemoApiTitle>Accordion.Trigger</DemoApiTitle>
          <DemoDescription>
            Кнопка раскрытия: связывает aria-controls и aria-expanded с контентом.
          </DemoDescription>
          <PlaygroundApiTable rows={accordionTriggerApiRows} />
          <DemoApiTitle>Accordion.Icon</DemoApiTitle>
          <DemoDescription>Слот иконки слева от подписи триггера.</DemoDescription>
          <PlaygroundApiTable rows={accordionIconApiRows} />
          <DemoApiTitle>Accordion.Arrow</DemoApiTitle>
          <DemoDescription>
            Индикатор справа: шеврон по умолчанию или пара кастомных иконок.
          </DemoDescription>
          <PlaygroundApiTable rows={accordionArrowApiRows} />
          <DemoApiTitle>Accordion.Content</DemoApiTitle>
          <DemoDescription>
            Область с анимацией высоты; внешний узел — section с aria-связью с триггером.
          </DemoDescription>
          <PlaygroundApiTable rows={accordionContentApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
