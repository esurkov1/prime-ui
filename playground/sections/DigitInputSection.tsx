import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import DigitInputCompositionSnippet from "../snippets/digit-input/composition";
import compositionSource from "../snippets/digit-input/composition.tsx?raw";
import DigitInputControlledSnippet from "../snippets/digit-input/controlled";
import controlledSource from "../snippets/digit-input/controlled.tsx?raw";
import DigitInputFeaturesSnippet from "../snippets/digit-input/features";
import featuresSource from "../snippets/digit-input/features.tsx?raw";
import DigitInputSizesSnippet from "../snippets/digit-input/sizes";
import sizesSource from "../snippets/digit-input/sizes.tsx?raw";
import DigitInputStatesSnippet from "../snippets/digit-input/states";
import statesSource from "../snippets/digit-input/states.tsx?raw";

const digitInputRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "length",
    type: "number",
    defaultValue: "4",
    required: "Нет",
    description: "Сколько ячеек с одной цифрой отрисовать.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер каждой ячейки: высота, радиус, кегль и промежуток из токенов контролов.",
  },
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Контролируемое значение: остаются только цифры, обрезается до length. Вместе с onChange.",
  },
  {
    prop: "defaultValue",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Начальное значение при неконтролируемом режиме (нормализуется как цифры).",
  },
  {
    prop: "onChange",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при каждом изменении собранной строки цифр.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Блокирует все ячейки; на корне data-disabled.",
  },
  {
    prop: "hasError",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Стиль ошибки для обводки ячеек; на корне data-has-error.",
  },
  {
    prop: "onComplete",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description:
      "Один раз, когда длина строки впервые достигает length (после ввода последней цифры).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корневом fieldset.",
  },
];

export default function DigitInputSection() {
  return (
    <PlaygroundDocPage
      title="DigitInput"
      description={
        <>
          Несколько отдельных полей для посимвольного ввода кода: подходит для PIN, одноразового
          кода из SMS или ключа восстановления. Цифры можно вставить из буфера — они заполнят ячейки
          подряд с активной позиции.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре ряда с <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code>; одинаковая длина <code>length=4</code> и заполненное{" "}
            <code>defaultValue</code> для сравнения масштаба.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <DigitInputSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Без флагов, затем <code>hasError</code> (красная обводка) и <code>disabled</code> (все
            инпуты неактивны).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DigitInputStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Строка кода хранится в состоянии родителя через <code>value</code> и{" "}
            <code>onChange</code>; подпись показывает текущее значение и счётчик символов.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <DigitInputControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            В форме рядом ставятся <code>Label.Root</code>, <code>DigitInput.Root</code> и{" "}
            <code>Hint.Root</code>: подпись сверху, подсказка снизу, без встроенных слотов у самого
            DigitInput.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <DigitInputCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Разная <code>length</code> и <code>defaultValue</code> в неконтролируемом режиме;{" "}
            <code>onComplete</code> после ввода последней цифры. Ввод с клавиатуры переводит фокус
            вперёд; пустая ячейка и Backspace возвращают фокус назад; вставка из буфера распределяет
            цифры по ячейкам (небуквенные символы отбрасываются).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <DigitInputFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>DigitInput.Root</DemoApiTitle>
          <DemoDescription>
            Группа ячеек: корень — <code>fieldset</code> с <code>aria-label</code>; внутри — по
            одному <code>input</code> на цифру, без дополнительных подкомпонентов в публичном API.
          </DemoDescription>
          <PlaygroundApiTable rows={digitInputRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
