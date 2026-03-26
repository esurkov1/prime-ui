import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import InputCompositionSnippet from "../snippets/input/composition";
import compositionSource from "../snippets/input/composition.tsx?raw";
import InputControlledSnippet from "../snippets/input/controlled";
import controlledSource from "../snippets/input/controlled.tsx?raw";
import InputFeaturesSnippet from "../snippets/input/features";
import featuresSource from "../snippets/input/features.tsx?raw";
import InputFullWidthSnippet from "../snippets/input/full-width";
import fullWidthSource from "../snippets/input/full-width.tsx?raw";
import InputSizesSnippet from "../snippets/input/sizes";
import sizesSource from "../snippets/input/sizes.tsx?raw";
import InputStatesSnippet from "../snippets/input/states";
import statesSource from "../snippets/input/states.tsx?raw";

const inputRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер: высота обёртки, кегль, отступы и иконки из одного яруса токенов.",
  },
  {
    prop: "hasError",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Визуальная ошибка и aria-invalid на поле; true также если передан error.",
  },
  {
    prop: "label",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись над полем; рендерится как label с htmlFor на id инпута.",
  },
  {
    prop: "optionalLabel",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Вторичный текст в строке заголовка (например «по желанию»).",
  },
  {
    prop: "hint",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подсказка под полем через Hint.Root.",
  },
  {
    prop: "error",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст ошибки под полем; включает hasError и связывает aria-describedby.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Явный id для input; иначе генерируется (useFieldIds).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обычно Input.Wrapper с полем и слотами; задаёт контекст для вложенных частей.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корневом контейнере блока поля.",
  },
];

const inputWrapperApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обводка и фон поля: Field, Icon, Affix, InlineAffix в одном flex-ряду.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на обёртке; data-size и data-has-error с контекста.",
  },
];

const inputFieldApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на нативном input.",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Склеивается с id подсказок/ошибки из контекста.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">',
    defaultValue: "—",
    required: "Нет",
    description:
      "type, placeholder, value, defaultValue, disabled, readOnly, required, name, autoComplete, inputMode, maxLength, min, max, step, pattern, onChange, onBlur и остальные атрибуты input (кроме size — зарезервирован под дизайн-систему).",
  },
];

const inputIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "side",
    type: '"start" | "end"',
    defaultValue: "—",
    required: "Да",
    description: "Сторона иконки относительно текста поля.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Обычно компонент Icon; узел помечен aria-hidden.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на span-обёртке.",
  },
];

const inputAffixApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "side",
    type: '"start" | "end"',
    defaultValue: "—",
    required: "Да",
    description: "Сторона блочного аффикса с фоном и разделителем.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст или короткая метка (https://, домен, валюта).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на контейнере аффикса.",
  },
];

const inputInlineAffixApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "side",
    type: '"start" | "end"',
    defaultValue: "—",
    required: "Да",
    description: "Сторона инлайн-аффикса в строке с вводом.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Короткий текст без отдельной секции (€, ₽, %).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на span.",
  },
];

export default function InputSection() {
  return (
    <PlaygroundDocPage
      title="Input"
      description={
        <>
          Однострочное поле ввода с единым оформлением: подпись и подсказка сверху и снизу, внутри —
          рамка с текстом, иконками и текстовыми аффиксами. Подходит для почты, поиска, сумм и
          коротких кодов; многострочный ввод — отдельный компонент Textarea.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code> на <code>Input.Root</code> (<code>s</code>,{" "}
            <code>m</code>, <code>l</code>, <code>xl</code>): одна и та же разметка с иконкой слева,
            меняются только токены высоты и типографики.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <InputSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Обычное поле с <code>hint</code>, <code>disabled</code> и <code>readOnly</code> на{" "}
            <code>Input.Field</code>, обязательность через <code>required</code>, ошибка через{" "}
            <code>error</code> на Root (или <code>hasError</code>) — на инпут уходит{" "}
            <code>aria-invalid</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <InputStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Значение и обработчик на <code>Input.Field</code> (<code>value</code>,{" "}
            <code>onChange</code>): родитель владеет строкой поиска; подпись поля продублирована в{" "}
            <code>aria-label</code> для скринридеров.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <InputControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Слоты <code>Input.Icon</code> (<code>side</code>), <code>Input.Affix</code> (выделенные
            края) и <code>Input.InlineAffix</code> (символ в строке) внутри{" "}
            <code>Input.Wrapper</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <InputCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Корень поля тянется на ширину родителя (<code>width: 100%</code> у Root): сравнение
            узкой колонки и блока на всю ширину превью.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <InputFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Явный <code>id</code> на Root для стабильных тестов и связки с подсказками; связка{" "}
            <code>label</code> + <code>optionalLabel</code>; одновременно <code>hint</code> и{" "}
            <code>error</code> (ошибка включает визуальное состояние ошибки).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <InputFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Input.Root</DemoApiTitle>
          <DemoDescription>
            Блок поля: размер, подписи, подсказка и ошибка, контекст для Wrapper и Field.
          </DemoDescription>
          <PlaygroundApiTable rows={inputRootApiRows} />

          <DemoApiTitle>Input.Wrapper</DemoApiTitle>
          <DemoDescription>
            Рамка вокруг нативного input и декоративных слотов; наследует размер и флаг ошибки из
            контекста.
          </DemoDescription>
          <PlaygroundApiTable rows={inputWrapperApiRows} />

          <DemoApiTitle>Input.Field</DemoApiTitle>
          <DemoDescription>
            Нативный <code>input</code> с id, aria-связями и <code>aria-invalid</code> из контекста.
          </DemoDescription>
          <PlaygroundApiTable rows={inputFieldApiRows} />

          <DemoApiTitle>Input.Icon</DemoApiTitle>
          <DemoDescription>
            Декоративная иконка слева или справа; не озвучивается (<code>aria-hidden</code>).
          </DemoDescription>
          <PlaygroundApiTable rows={inputIconApiRows} />

          <DemoApiTitle>Input.Affix</DemoApiTitle>
          <DemoDescription>
            Текстовый блок-аффикс с фоном по краю поля (префикс URL, зона домена).
          </DemoDescription>
          <PlaygroundApiTable rows={inputAffixApiRows} />

          <DemoApiTitle>Input.InlineAffix</DemoApiTitle>
          <DemoDescription>
            Компактный аффикс в одной строке с вводом (валюта, единицы).
          </DemoDescription>
          <PlaygroundApiTable rows={inputInlineAffixApiRows} />

          <DemoApiTitle>useInputContext</DemoApiTitle>
          <DemoDescription>
            Публичный хук для продвинутой композиции: возвращает{" "}
            <code>{`{ size, hasError, inputId, describedBy }`}</code> — те же значения, что получает{" "}
            <code>Input.Field</code> из провайдера.
          </DemoDescription>
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
