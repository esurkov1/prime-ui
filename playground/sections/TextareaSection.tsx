import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import TextareaCompositionSnippet from "../snippets/textarea/composition";
import compositionSource from "../snippets/textarea/composition.tsx?raw";
import TextareaControlledSnippet from "../snippets/textarea/controlled";
import controlledSource from "../snippets/textarea/controlled.tsx?raw";
import TextareaFeaturesSnippet from "../snippets/textarea/features";
import featuresSource from "../snippets/textarea/features.tsx?raw";
import TextareaFullWidthSnippet from "../snippets/textarea/full-width";
import fullWidthSource from "../snippets/textarea/full-width.tsx?raw";
import TextareaSizesSnippet from "../snippets/textarea/sizes";
import sizesSource from "../snippets/textarea/sizes.tsx?raw";
import TextareaStatesSnippet from "../snippets/textarea/states";
import statesSource from "../snippets/textarea/states.tsx?raw";
import TextareaVariantsSnippet from "../snippets/textarea/variants";
import variantsSource from "../snippets/textarea/variants.tsx?raw";

const textareaRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"default" | "error"',
    defaultValue: '"default"',
    required: "Нет",
    description: "Визуальная роль: обычное поле или акцент ошибки (aria-invalid, обводка).",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Кегль, отступы, минимальная высота и радиус из яруса токенов textarea.",
  },
  {
    prop: "autoResize",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Рост высоты по содержимому; при false остаётся нативный resize угла.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "useId()",
    required: "Нет",
    description:
      "Связь с подсказками: Hint/Error получают производные id; иначе стабильный id из React.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс видимой оболочки поля (элемент label с data-атрибутами состояния).",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Блокировка ввода; подсказка Hint переключается в вариант disabled.",
  },
  {
    prop: "readOnly",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Только чтение; Hint ведёт себя как при disabled.",
  },
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое значение; при autoResize синхронизируется data-value обёртки.",
  },
  {
    prop: "defaultValue",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Начальное значение в неконтролируемом режиме.",
  },
  {
    prop: "onInput",
    type: "React.FormEventHandler<HTMLTextAreaElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Обработчик ввода; внутри дополнительно обновляется autoResize.",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительные описания; к ним добавляются id Hint и Error при наличии.",
  },
  {
    prop: "aria-invalid",
    type: "Booleanish",
    defaultValue: "из variant / наличия Error",
    required: "Нет",
    description:
      'Явная инвалидность; иначе выводится из variant="error" или смонтированного Error.',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Textarea.CharCounter внутри корня (подвал), Textarea.Hint и Textarea.Error — снаружи label.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">',
    defaultValue: "—",
    required: "Нет",
    description:
      "placeholder, rows, maxLength, required, onChange, name, autoComplete и прочие атрибуты textarea.",
  },
];

const textareaCharCounterApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "current",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description: "Текущее число символов (обычно длина строки из состояния).",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "—",
    required: "Да",
    description: "Лимит для отображения «current/max»; при current > max — data-overflow.",
  },
];

const textareaHintApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст подсказки; рендерится через Hint.Root с размером из контекста Textarea.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс у слота подсказки.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты параграфа; id задан контекстом для aria-describedby на textarea.",
  },
];

const textareaErrorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст ошибки; регистрирует слот в контексте и variant error у Hint.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс у слота ошибки.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты параграфа; id задан контекстом для aria-describedby на textarea.",
  },
];

export default function TextareaSection() {
  return (
    <PlaygroundDocPage
      title="Textarea"
      description={
        <>
          Многострочное поле для отзывов, описаний и длинных ответов. Можно задать размер, показать
          подсказку или текст ошибки, ограничить длину и вывести счётчик символов. По умолчанию
          высота подстраивается под текст без скриптового измерения.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code> — <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code>; у каждого поля своя <code>Textarea.Hint</code> с подписью размера.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TextareaSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты</DemoSectionTitle>
          <DemoDescription>
            <code>variant=&quot;default&quot;</code> и <code>variant=&quot;error&quot;</code> с
            парным <code>Textarea.Error</code>; ошибка подключает <code>aria-describedby</code> и
            инвалидность.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TextareaVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Обычное поле с подсказкой, <code>disabled</code>, <code>readOnly</code> и нативный{" "}
            <code>required</code> (атрибут на textarea).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TextareaStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            <code>value</code> и <code>onChange</code> у родителя; длина текста выводится в{" "}
            <code>Textarea.Hint</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TextareaControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Заголовок секции через <code>Typography</code>, поле со счётчиком и подсказкой, отдельно
            — поле с <code>Textarea.Error</code> (корень сам оборачивает textarea в{" "}
            <code>label</code>).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TextareaCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Поле тянется на ширину родителя (<code>width: 100%</code> у корня); узкий контейнер
            имитирует колонку карточки или боковую панель.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TextareaFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            <code>autoResize</code> по умолчанию и отключение, <code>Textarea.CharCounter</code> с
            обычным и переполненным лимитом, связка <code>maxLength</code> со счётчиком.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TextareaFeaturesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Textarea.Root</DemoApiTitle>
          <DemoDescription>
            Обёртка поля: контекст для Hint/Error, опциональный подвал для счётчика, нативный{" "}
            <code>textarea</code> внутри <code>label</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={textareaRootApiRows} />
          <DemoApiTitle>Textarea.CharCounter</DemoApiTitle>
          <DemoDescription>
            Счётчик «текущий/максимум» в подвале; при превышении max помечается{" "}
            <code>data-overflow</code>, живой регион <code>aria-live=&quot;polite&quot;</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={textareaCharCounterApiRows} />
          <DemoApiTitle>Textarea.Hint</DemoApiTitle>
          <DemoDescription>
            Вспомогательный текст под полем; связывается с textarea через{" "}
            <code>aria-describedby</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={textareaHintApiRows} />
          <DemoApiTitle>Textarea.Error</DemoApiTitle>
          <DemoDescription>
            Сообщение об ошибке; влияет на <code>aria-invalid</code> и стиль поля вместе с{" "}
            <code>variant</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={textareaErrorApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
