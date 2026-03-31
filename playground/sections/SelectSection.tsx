import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import SelectCompositionSnippet from "../snippets/select/composition";
import compositionSource from "../snippets/select/composition.tsx?raw";
import SelectControlledSnippet from "../snippets/select/controlled";
import controlledSource from "../snippets/select/controlled.tsx?raw";
import SelectFeaturesSnippet from "../snippets/select/features";
import featuresSource from "../snippets/select/features.tsx?raw";
import SelectFullWidthSnippet from "../snippets/select/full-width";
import fullWidthSource from "../snippets/select/full-width.tsx?raw";
import SelectMultipleSnippet from "../snippets/select/multiple";
import multipleSource from "../snippets/select/multiple.tsx?raw";
import SelectNativeSnippet from "../snippets/select/native";
import nativeSource from "../snippets/select/native.tsx?raw";
import SelectSizesSnippet from "../snippets/select/sizes";
import sizesSource from "../snippets/select/sizes.tsx?raw";
import SelectStatesSnippet from "../snippets/select/states";
import statesSource from "../snippets/select/states.tsx?raw";

const selectRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус токенов: высота триггера, кегль, отступы, размеры иконок в триггере и списке.",
  },
  {
    prop: "value",
    type: "string | string[]",
    defaultValue: "—",
    required: "Нет",
    description:
      "Одиночный выбор: `string`. При `multiple`: массив `value` выбранных Item (порядок — порядок выбора).",
  },
  {
    prop: "defaultValue",
    type: "string | string[]",
    defaultValue: "—",
    required: "Нет",
    description: "Начальное значение, если не передан value (для `multiple` — массив).",
  },
  {
    prop: "onChange",
    type: "(value: string) => void | (value: string[]) => void",
    defaultValue: "—",
    required: "Нет",
    description: "После выбора пункта: строка или массив строк в зависимости от `multiple`.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Отключает триггер и открытие списка для всего экземпляра.",
  },
  {
    prop: "placeholder",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Текст в триггере, пока значение не выбрано (data-placeholder у Select.Value).",
  },
  {
    prop: "hasError",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Визуальная ошибка валидации: обводка триггера (data-has-error).",
  },
  {
    prop: "native",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Нативный `<select>` с option/optgroup из дерева Item/Group; без триггера и портального listbox.",
  },
  {
    prop: "multiple",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Мультивыбор: `value`/`onChange` — массивы; список остаётся открытым при выборе.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Триггер, портальный список (Select.Content) и вложенные Item/Group.",
  },
];

const selectTriggerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Обычно Select.Value и при необходимости Select.TriggerIcon; справа всегда слот шеврона.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс кнопки-триггера.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description:
      "Нативный disabled кнопки; фактическое состояние также задаётся Select.Root (контекст).",
  },
  {
    prop: "ref",
    type: "React.Ref<HTMLButtonElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Ref на нативную кнопку (сливается с внутренним ref для позиционирования списка).",
  },
  {
    prop: "…rest",
    type: 'Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "id" | "type" | "role">',
    defaultValue: "—",
    required: "Нет",
    description:
      'role="combobox", id и type зафиксированы; доступны aria-label, aria-labelledby, onClick, onKeyDown и прочие атрибуты кнопки.',
  },
];

const selectValueApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс для текста выбранного значения или подсказки.",
  },
];

const selectTriggerIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка или маркер слева от подписи в триггере.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс слота иконки.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты обёртки span.",
  },
];

const selectContentApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: 'Класс портального контейнера списка (role="listbox").',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Пункты, группы, разделители; рендерится только пока список открыт.",
  },
];

const selectItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Значение опции; попадает в onChange Root и в data-value для клавиатуры.",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Подпись в триггере после выбора; если не задана — из текстовых children или value.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Пункт не выбирается и исключается из навигации стрелками.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс элемента option (div).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст и при необходимости Select.ItemIcon до основной подписи.",
  },
  {
    prop: "ref",
    type: "React.Ref<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Проброс ref на корень пункта.",
  },
];

const selectItemIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка в строке пункта (до текста).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс span.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты span.",
  },
];

const selectGroupApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: 'Класс группы (role="group").',
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "GroupLabel и Item внутри секции.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "data-*, aria-* и прочие атрибуты div.",
  },
];

const selectGroupLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс подписи группы.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст заголовка группы в списке.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты div.",
  },
];

const selectSeparatorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс горизонтальной линии между группами.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLHRElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты hr.",
  },
];

export default function SelectSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Select</PageContent.Title>
        <PageContent.Description measure="full">
          {
            <>
              Выпадающий список: одиночный или множественный выбор из закрытого набора. По умолчанию
              — комбобокс: триггер с подсказкой и портальный список с клавиатурой и группами.{" "}
              <code>multiple</code> включает мультиселект (значения — массив строк). Параметр{" "}
              <code>native</code> переключает на нативный <code>&lt;select&gt;</code> с теми же{" "}
              <code>Select.Item</code>. Подходит для форм, фильтров и настроек без свободного
              текста.
            </>
          }
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Четыре значения <code>size</code> на корне: <code>s</code>, <code>m</code>,{" "}
              <code>l</code>, <code>xl</code> — высота триггера, кегль и отступы из одного яруса
              токенов.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <SelectSizesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Подсказка без выбора, <code>defaultValue</code>, отключённый корень{" "}
              <code>disabled</code> и ошибка <code>hasError</code> на <code>Select.Root</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SelectStatesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              Пара <code>value</code> и <code>onChange</code> на <code>Select.Root</code>: выбранное
              значение хранится в состоянии родителя и отображается под полем.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SelectControlledSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция</DemoSectionTitle>
            <DemoDescription>
              <code>Select.TriggerIcon</code> и <code>Select.ItemIcon</code>; у пунктов задан{" "}
              <code>label</code> — в триггере длинная подпись, в списке остаётся короткая разметка
              (например код валюты).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SelectCompositionSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Full width</DemoSectionTitle>
            <DemoDescription>
              Триггер по умолчанию тянется на ширину контейнера (<code>width: 100%</code> в стилях)
              — в узкой колонке список остаётся по содержимому с ограничением по вьюпорту.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SelectFullWidthSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Нативный select</DemoSectionTitle>
            <DemoDescription>
              <code>Select.Root native</code> — нативный <code>&lt;select&gt;</code> с теми же
              токенами размера; пункты из <code>Select.Item</code> (можно обернуть в{" "}
              <code>Select.Content</code>
              ).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={nativeSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SelectNativeSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Мультиселект (комбобокс)</DemoSectionTitle>
            <DemoDescription>
              <code>Select.Root multiple</code>: <code>value</code> и <code>onChange</code> с
              массивом строк; пункты переключаются кликом или клавиатурой; список не закрывается
              после выбора; в триггере подписи через запятую.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={multipleSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SelectMultipleSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Специфичные фичи</DemoSectionTitle>
            <DemoDescription>
              <code>Select.Group</code>, <code>Select.GroupLabel</code>,{" "}
              <code>Select.Separator</code>, отключённый пункт, длинный список с прокруткой; панель
              позиционируется у края экрана и переворачивается при нехватке места (внутренняя логика
              позиционирования).
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SelectFeaturesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Select.Root</DemoApiTitle>
            <DemoDescription>
              Хранит выбранное значение, открытие списка, подсветку пункта и размер для дерева.
            </DemoDescription>
            <PlaygroundApiTable rows={selectRootApiRows} />
            <DemoApiTitle>Select.Trigger</DemoApiTitle>
            <DemoDescription>
              Кнопка-combobox: открывает и закрывает список, связана с listbox по aria-controls.
            </DemoDescription>
            <PlaygroundApiTable rows={selectTriggerApiRows} />
            <DemoApiTitle>Select.Value</DemoApiTitle>
            <DemoDescription>
              Отображает подпись выбранного пункта, иначе placeholder с визуальным стилем подсказки.
            </DemoDescription>
            <PlaygroundApiTable rows={selectValueApiRows} />
            <DemoApiTitle>Select.TriggerIcon</DemoApiTitle>
            <DemoDescription>Слот иконки слева от значения в триггере.</DemoDescription>
            <PlaygroundApiTable rows={selectTriggerIconApiRows} />
            <DemoApiTitle>Select.Content</DemoApiTitle>
            <DemoDescription>
              Портальный listbox с фокусом и клавиатурной навигацией; не рендерится, пока список
              закрыт.
            </DemoDescription>
            <PlaygroundApiTable rows={selectContentApiRows} />
            <DemoApiTitle>Select.Item</DemoApiTitle>
            <DemoDescription>
              Опция списка; сообщает подпись корню для отображения в триггере.
            </DemoDescription>
            <PlaygroundApiTable rows={selectItemApiRows} />
            <DemoApiTitle>Select.ItemIcon</DemoApiTitle>
            <DemoDescription>Иконка в строке пункта (до текста).</DemoDescription>
            <PlaygroundApiTable rows={selectItemIconApiRows} />
            <DemoApiTitle>Select.Group</DemoApiTitle>
            <DemoDescription>Секция пунктов с role=&quot;group&quot;.</DemoDescription>
            <PlaygroundApiTable rows={selectGroupApiRows} />
            <DemoApiTitle>Select.GroupLabel</DemoApiTitle>
            <DemoDescription>Заголовок секции внутри списка.</DemoDescription>
            <PlaygroundApiTable rows={selectGroupLabelApiRows} />
            <DemoApiTitle>Select.Separator</DemoApiTitle>
            <DemoDescription>Визуальный разрыв между группами.</DemoDescription>
            <PlaygroundApiTable rows={selectSeparatorApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
