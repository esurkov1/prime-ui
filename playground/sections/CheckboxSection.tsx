import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import CheckboxCompositionSnippet from "../snippets/checkbox/composition";
import compositionSource from "../snippets/checkbox/composition.tsx?raw";
import CheckboxControlledSnippet from "../snippets/checkbox/controlled";
import controlledSource from "../snippets/checkbox/controlled.tsx?raw";
import CheckboxFullWidthSnippet from "../snippets/checkbox/full-width";
import fullWidthSource from "../snippets/checkbox/full-width.tsx?raw";
import CheckboxSizesSnippet from "../snippets/checkbox/sizes";
import sizesSource from "../snippets/checkbox/sizes.tsx?raw";
import CheckboxSpecificSnippet from "../snippets/checkbox/specific";
import specificSource from "../snippets/checkbox/specific.tsx?raw";
import CheckboxStatesSnippet from "../snippets/checkbox/states";
import statesSource from "../snippets/checkbox/states.tsx?raw";
import CheckboxVariantsSnippet from "../snippets/checkbox/variants";
import variantsSource from "../snippets/checkbox/variants.tsx?raw";

const checkboxRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"default" | "error"',
    defaultValue: '"default"',
    required: "Нет",
    description:
      "Визуальная семантика: error даёт обводку ошибки; invalid также включается при наличии Checkbox.Error.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер квадрата, отступов и кегля подписи из яруса токенов choice/control.",
  },
  {
    prop: "indeterminate",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Промежуточное состояние (частичный выбор в группе); синхронизируется с input.indeterminate.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "id нативного input; при отсутствии генерируется стабильный id для связи с Checkbox.Label.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на обёртке поля (div.field).",
  },
  {
    prop: "checked",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое значение «отмечен»; вместе с onChange задаёт управляемый режим.",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Начальное значение в неконтролируемом режиме.",
  },
  {
    prop: "onChange",
    type: "React.ChangeEventHandler<HTMLInputElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Обработчик изменения; внутри обновляется внутреннее состояние checked.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Блокировка input и приглушение подписи (через Label).",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Дополнительные описания; объединяется с id подсказки и сообщения об ошибке из слотов.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно Checkbox.Label, Checkbox.Hint и Checkbox.Error внутри корня.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">',
    defaultValue: "—",
    required: "Нет",
    description:
      "name, value, required, readOnly, autoFocus, form и прочие атрибуты пробрасываются на скрытый input.",
  },
];

const checkboxLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Текст подписи; пустой узел оставляет только квадрат — тогда задайте aria-label на Checkbox.Root.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на label (строка: квадрат + текст).",
  },
  {
    prop: "…rest",
    type: 'Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor" | "size">',
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты label, кроме htmlFor и size (задаются из контекста и размера поля).",
  },
];

const checkboxHintApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст подсказки под подписью, с отступом под колонку текста.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корне Hint.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты абзаца; id фиксирован для связи с aria-describedby на input.",
  },
];

const checkboxErrorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст ошибки; монтирование помечает поле как invalid (aria-invalid и стиль).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корне сообщения.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты абзаца; id фиксирован для связи с aria-describedby на input.",
  },
];

export default function CheckboxSection() {
  return (
    <PlaygroundDocPage
      title="Checkbox"
      description={
        <>
          Флажок «да/нет» с подписью, подсказкой и сообщением об ошибке. Подходит для согласий,
          настроек и таблиц с множественным выбором; есть отдельное визуальное состояние для
          частично выбранной группы.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Четыре значения <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>,{" "}
            <code>xl</code> — высота квадрата, зазор до текста и кегль подписи согласованы токенами.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <CheckboxSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты</DemoSectionTitle>
          <DemoDescription>
            Проп <code>variant</code>: <code>default</code> и <code>error</code> (красная обводка
            квадрата). Сообщение через <code>Checkbox.Error</code> тоже переводит поле в invalid —
            см. блок «Композиция».
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CheckboxVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Не отмечен / отмечен, <code>indeterminate</code>, нативный <code>required</code> на
            input, <code>disabled</code> в обычном и отмеченном виде.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CheckboxStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            <code>checked</code> и <code>onChange</code> для полностью управляемого флага; отдельно
            можно держать <code>indeterminate</code> из состояния родителя (типично для «выбрать
            все» в таблице).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CheckboxControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Слоты <code>Checkbox.Label</code>, <code>Checkbox.Hint</code> и{" "}
            <code>Checkbox.Error</code>: подсказка, только ошибка (без{" "}
            <code>variant=&quot;error&quot;</code> на корне) и полный набор с вариантом ошибки на
            корне.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CheckboxCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>На ширину контейнера</DemoSectionTitle>
          <DemoDescription>
            Корень поля уже <code>width: 100%</code>: в узкой колонке (карточка, сайдбар) подпись
            переносится во второй столбец сетки, подсказка остаётся выровненной под текст.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CheckboxFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
          <DemoDescription>
            Пустой <code>Checkbox.Label</code> с обязательным <code>aria-label</code> на{" "}
            <code>Checkbox.Root</code> для экранных читалок; <code>name</code> и <code>value</code>{" "}
            для отправки формы.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={specificSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <CheckboxSpecificSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Checkbox.Root</DemoApiTitle>
          <DemoDescription>
            Обёртка поля и провайдер контекста: размер, вариант, состояние checked/indeterminate и
            ссылки на слоты hint/error.
          </DemoDescription>
          <PlaygroundApiTable rows={checkboxRootApiRows} />
          <DemoApiTitle>Checkbox.Label</DemoApiTitle>
          <DemoDescription>
            Подпись и кликабельная область: связь <code>htmlFor</code> с input, сетка «квадрат +
            текст», рендер нативного <code>input type=&quot;checkbox&quot;</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={checkboxLabelApiRows} />
          <DemoApiTitle>Checkbox.Hint</DemoApiTitle>
          <DemoDescription>
            Вторичный текст под подписью; регистрируется в контексте для{" "}
            <code>aria-describedby</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={checkboxHintApiRows} />
          <DemoApiTitle>Checkbox.Error</DemoApiTitle>
          <DemoDescription>
            Сообщение об ошибке визуально как Hint с вариантом error; включает invalid у всего поля.
          </DemoDescription>
          <PlaygroundApiTable rows={checkboxErrorApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
