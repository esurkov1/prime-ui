import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import StepperCompositionSnippet from "../snippets/stepper/composition";
import compositionSource from "../snippets/stepper/composition.tsx?raw";
import StepperControlledSnippet from "../snippets/stepper/controlled";
import controlledSource from "../snippets/stepper/controlled.tsx?raw";
import StepperFeaturesSnippet from "../snippets/stepper/features";
import featuresSource from "../snippets/stepper/features.tsx?raw";
import StepperFullWidthSnippet from "../snippets/stepper/full-width";
import fullWidthSource from "../snippets/stepper/full-width.tsx?raw";
import StepperLowLevelApiSnippet from "../snippets/stepper/low-level-api";
import lowLevelApiSource from "../snippets/stepper/low-level-api.tsx?raw";
import StepperOrientationSnippet from "../snippets/stepper/orientation";
import orientationSource from "../snippets/stepper/orientation.tsx?raw";
import StepperPolymorphicAsSnippet from "../snippets/stepper/polymorphic-as";
import polymorphicAsSource from "../snippets/stepper/polymorphic-as.tsx?raw";
import StepperSizesSnippet from "../snippets/stepper/sizes";
import sizesSource from "../snippets/stepper/sizes.tsx?raw";
import StepperStatesSnippet from "../snippets/stepper/states";
import statesSource from "../snippets/stepper/states.tsx?raw";

const stepperRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"vertical"',
    required: "Нет",
    description: "Направление: горизонтальная полоса или вертикальный список в `<ol>`.",
  },
  {
    prop: "currentStep",
    type: "number",
    defaultValue: "0",
    required: "Нет",
    description:
      "Индекс активного шага; остальные получают completed / pending, если не переопределить `status`.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Тир контрола: высота, круг индикатора, кегль и отступы из одного набора токенов.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Шаги (`Step` / `Item`), при горизонтали — ещё `SeparatorIcon` между кнопками.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на корневой `<ol>` (например `w-full` для полосы на всю ширину).",
  },
];

const stepperStepApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "index",
    type: "number",
    defaultValue: "—",
    required: "Нет",
    description:
      "Явный индекс шага для расчёта статуса и номера в индикаторе; иначе порядковый счётчик по дереву.",
  },
  {
    prop: "status",
    type: '"pending" | "active" | "completed" | "error"',
    defaultValue: "—",
    required: "Нет",
    description: "Принудительный статус; без пропа выводится из `currentStep` на корне.",
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип нативной кнопки внутри пункта списка.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Блокировка клика по шагу.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на `<button>` шага.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обычно `Indicator`, `Content`, при вертикали — опционально `Arrow`.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">',
    defaultValue: "—",
    required: "Нет",
    description: "onClick, aria-*, data-* и прочие атрибуты кнопки.",
  },
];

const stepperIndicatorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Кастомный индикатор; без детей для completed — галочка, иначе порядковый номер (index + 1).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на span индикатора.",
  },
];

const stepperContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "title",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок шага.",
  },
  {
    prop: "description",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Вторичный текст под заголовком.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на обёртку блока подписи.",
  },
];

const stepperSeparatorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Класс на иконку-разделитель внутри `<li>` (только вместе с горизонтальным Stepper).",
  },
];

const stepperArrowApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: "React.ElementType",
    defaultValue: "IconChevronRight",
    required: "Нет",
    description:
      "Компонент иконки вместо шеврона по умолчанию (см. также примитив `VerticalStepper.Arrow`).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на иконку-стрелку у вертикального шага.",
  },
  {
    prop: "…rest",
    type: "React.ComponentPropsWithoutRef<элемента as>",
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы, пробрасываемые в выбранный компонент иконки (например strokeWidth).",
  },
];

const horizontalStepperRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер тира для дочерних Item и индикаторов.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на корневой `<div>`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Цепочка `Item` и `SeparatorIcon` без обязательного списка.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты контейнера (role, data-*, style и т.д.).",
  },
];

const horizontalStepperSeparatorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: "React.ElementType",
    defaultValue: "IconChevronRight",
    required: "Нет",
    description: "Замена иконки между шагами.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на svg внутри разделителя.",
  },
  {
    prop: "…rest",
    type: "React.ComponentPropsWithoutRef<элемента as>",
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы иконки (передаётся strokeWidth={2} по умолчанию из компонента).",
  },
];

const horizontalStepperItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "state",
    type: '"default" | "active" | "completed"',
    defaultValue: '"default"',
    required: "Нет",
    description: "Визуальное состояние шага; в связке с ItemIndicator задаёт круг и галочку.",
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки шага.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс кнопки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Индикатор и подпись шага.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">',
    defaultValue: "—",
    required: "Нет",
    description: "onClick, disabled, aria-* и остальные атрибуты кнопки.",
  },
];

const horizontalStepperItemIndicatorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "state",
    type: '"default" | "active" | "completed"',
    defaultValue: "—",
    required: "Нет",
    description: "Переопределение состояния; иначе берётся из ближайшего Item.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на обёртку индикатора.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Содержимое круга; при completed без своих детей — встроенная галочка.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты корневого div индикатора.",
  },
];

const verticalStepperRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер тира для вертикальных шагов.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на корневой `<div>`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Набор VerticalStepper.Item.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты контейнера.",
  },
];

const verticalStepperArrowApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: "React.ElementType",
    defaultValue: "IconChevronRight",
    required: "Нет",
    description: "Другая иконка вместо шеврона.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на иконку.",
  },
  {
    prop: "…rest",
    type: "React.ComponentPropsWithoutRef<элемента as>",
    defaultValue: "—",
    required: "Нет",
    description: "Пропсы иконки.",
  },
];

const verticalStepperItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "state",
    type: '"default" | "active" | "completed"',
    defaultValue: '"default"',
    required: "Нет",
    description: "Состояние строки вертикального шага.",
  },
  {
    prop: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    required: "Нет",
    description: "Тип кнопки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс кнопки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "ItemIndicator, текст, опционально Arrow у активного шага.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">',
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты кнопки.",
  },
];

const verticalStepperItemIndicatorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "state",
    type: '"default" | "active" | "completed"',
    defaultValue: "—",
    required: "Нет",
    description: "Состояние индикатора; иначе из контекста Item.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Номер или метка; при completed — галочка по умолчанию.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты div.",
  },
];

export default function StepperSection() {
  return (
    <PlaygroundDocPage
      title="Stepper"
      description={
        <>
          Показывает этапы процесса: что уже сделано, где вы сейчас и что осталось. Есть готовый
          вариант с номером шага из кода и отдельные «примитивы» для полного контроля разметки и
          состояния каждой кнопки.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code> на <code>Stepper.Root</code> (<code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code>): одна и та же схема шагов, разный тир
            контрола и типографики.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты API</DemoSectionTitle>
          <DemoDescription>
            Примитивы <code>HorizontalStepper</code> и <code>VerticalStepper</code>: вы сами
            выставляете <code>state</code> у каждого <code>Item</code>, без <code>currentStep</code>{" "}
            и семантического <code>&lt;ol&gt;</code>. Подходит для кастомной навигации и данных с
            сервера.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={lowLevelApiSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperLowLevelApiSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Отключённый шаг (<code>disabled</code>) и ошибка на шаге через{" "}
            <code>status=&quot;error&quot;</code> с кастомным содержимым <code>Indicator</code>{" "}
            (например восклицательный знак).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Ориентация</DemoSectionTitle>
          <DemoDescription>
            Проп <code>orientation</code> у <code>Stepper.Root</code>: горизонтальная цепочка с{" "}
            <code>SeparatorIcon</code> между кнопками и вертикальный список со стрелкой{" "}
            <code>Stepper.Arrow</code> у активного шага.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={orientationSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperOrientationSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            <code>currentStep</code> хранится в React-состоянии родителя; кнопки «Назад» и «Далее»
            сдвигают индекс, клик по шагу ведёт к его индексу.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Свой символ в <code>Indicator</code>, рядом с подписью — сторонняя иконка (здесь{" "}
            <code>IconMail</code>) и стандартный <code>Content</code> с заголовком и описанием.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Горизонтальный степпер внутри широкой карточки:{" "}
            <code>className=&quot;w-full&quot;</code> на корне и обёртка на всю ширину превью.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Полиморфные иконки (as)</DemoSectionTitle>
          <DemoDescription>
            У примитивов разделитель и стрелка принимают <code>as</code> — можно подставить другой
            компонент иконки из набора пакета вместо шеврона по умолчанию.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={polymorphicAsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperPolymorphicAsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Псевдонимы <code>Stepper.Item</code> и <code>Stepper.ItemIndicator</code>, явный{" "}
            <code>index</code> для отображаемого номера и <code>SeparatorIcon</code> как отдельные
            пункты списка между шагами в горизонтальном режиме.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <StepperFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Stepper.Root</DemoApiTitle>
          <DemoDescription>
            Семантический список шагов и контекст размера, активного индекса и ориентации.
          </DemoDescription>
          <PlaygroundApiTable rows={stepperRootApiRows} />

          <DemoApiTitle>Stepper.Step (Stepper.Item)</DemoApiTitle>
          <DemoDescription>
            Кнопка внутри пункта <code>&lt;li&gt;</code>; <code>Item</code> — то же API.
          </DemoDescription>
          <PlaygroundApiTable rows={stepperStepApiRows} />

          <DemoApiTitle>Stepper.Indicator (Stepper.ItemIndicator)</DemoApiTitle>
          <DemoDescription>
            Круглый индикатор с номером или галочкой; <code>ItemIndicator</code> — псевдоним.
          </DemoDescription>
          <PlaygroundApiTable rows={stepperIndicatorApiRows} />

          <DemoApiTitle>Stepper.Content</DemoApiTitle>
          <DemoDescription>Заголовок и необязательное описание шага.</DemoDescription>
          <PlaygroundApiTable rows={stepperContentApiRows} />

          <DemoApiTitle>Stepper.SeparatorIcon</DemoApiTitle>
          <DemoDescription>
            Разделитель-шеврон между горизонтальными шагами (рендерится отдельным{" "}
            <code>&lt;li&gt;</code>).
          </DemoDescription>
          <PlaygroundApiTable rows={stepperSeparatorApiRows} />

          <DemoApiTitle>Stepper.Arrow</DemoApiTitle>
          <DemoDescription>
            Стрелка у вертикального шага; делегирует в <code>VerticalStepper.Arrow</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={stepperArrowApiRows} />

          <DemoApiTitle>HorizontalStepper.Root</DemoApiTitle>
          <DemoDescription>Контейнер горизонтальной полосы без списка шагов.</DemoDescription>
          <PlaygroundApiTable rows={horizontalStepperRootApiRows} />

          <DemoApiTitle>HorizontalStepper.SeparatorIcon</DemoApiTitle>
          <DemoDescription>Иконка между соседними горизонтальными кнопками.</DemoDescription>
          <PlaygroundApiTable rows={horizontalStepperSeparatorApiRows} />

          <DemoApiTitle>HorizontalStepper.Item</DemoApiTitle>
          <DemoDescription>
            Кнопка шага с явным визуальным <code>state</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={horizontalStepperItemApiRows} />

          <DemoApiTitle>HorizontalStepper.ItemIndicator</DemoApiTitle>
          <DemoDescription>Индикатор внутри горизонтального Item.</DemoDescription>
          <PlaygroundApiTable rows={horizontalStepperItemIndicatorApiRows} />

          <DemoApiTitle>VerticalStepper.Root</DemoApiTitle>
          <DemoDescription>Контейнер вертикальной колонки шагов.</DemoDescription>
          <PlaygroundApiTable rows={verticalStepperRootApiRows} />

          <DemoApiTitle>VerticalStepper.Arrow</DemoApiTitle>
          <DemoDescription>
            Иконка-стрелка справа от активной строки (или кастомная через <code>as</code>).
          </DemoDescription>
          <PlaygroundApiTable rows={verticalStepperArrowApiRows} />

          <DemoApiTitle>VerticalStepper.Item</DemoApiTitle>
          <DemoDescription>Кнопка одного вертикального шага.</DemoDescription>
          <PlaygroundApiTable rows={verticalStepperItemApiRows} />

          <DemoApiTitle>VerticalStepper.ItemIndicator</DemoApiTitle>
          <DemoDescription>Круглый индикатор в вертикальном Item.</DemoDescription>
          <PlaygroundApiTable rows={verticalStepperItemIndicatorApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
