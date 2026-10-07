import { PageContent } from "@/components/page-content/PageContent";
import SelectClearableExample from "@/components/select/examples/clearable";
import clearableSource from "@/components/select/examples/clearable.tsx?raw";
import SelectControlledExample from "@/components/select/examples/controlled";
import controlledSource from "@/components/select/examples/controlled.tsx?raw";
import SelectInFormExample from "@/components/select/examples/in-form";
import inFormSource from "@/components/select/examples/in-form.tsx?raw";
import SelectMultipleExample from "@/components/select/examples/multiple";
import multipleSource from "@/components/select/examples/multiple.tsx?raw";
import SelectNativeExample from "@/components/select/examples/native";
import nativeSource from "@/components/select/examples/native.tsx?raw";
import SelectRichOptionsExample from "@/components/select/examples/rich-options";
import richOptionsSource from "@/components/select/examples/rich-options.tsx?raw";
import SelectSearchGroupsExample from "@/components/select/examples/search-groups";
import searchGroupsSource from "@/components/select/examples/search-groups.tsx?raw";
import SelectSizesExample from "@/components/select/examples/sizes";
import sizesSource from "@/components/select/examples/sizes.tsx?raw";
import SelectStatesExample from "@/components/select/examples/states";
import statesSource from "@/components/select/examples/states.tsx?raw";
import SelectWithBadgeExample from "@/components/select/examples/with-badge";
import withBadgeSource from "@/components/select/examples/with-badge.tsx?raw";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const selectRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус: высота триггера 28–48, кегль, отступы; пункты списка — того же яруса.",
  },
  {
    prop: "label",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись над полем; связана с триггером (или нативным select) через htmlFor.",
  },
  {
    prop: "required / optional",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Красная * после подписи и aria-required / приглушённое «необязательно» (labels.optional).",
  },
  {
    prop: "hint",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Подсказка под полем, попадает в aria-describedby.",
  },
  {
    prop: "error",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст ошибки на месте подсказки; непустой error включает invalid.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Ошибка без текста: кольцо danger, aria-invalid, data-invalid.",
  },
  {
    prop: "value / defaultValue",
    type: "string | string[]",
    defaultValue: "—",
    required: "Нет",
    description: "Выбранное значение; при multiple — массив в порядке выбора.",
  },
  {
    prop: "onValueChange",
    type: "(value: string) => void | (value: string[]) => void",
    defaultValue: "—",
    required: "Нет",
    description: 'После выбора или сброса ("" / []); тип зависит от multiple.',
  },
  {
    prop: "open / defaultOpen / onOpenChange",
    type: "boolean / boolean / (open: boolean) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Открытие списка: контролируемое или нет. Только режим комбобокса.",
  },
  {
    prop: "multiple",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Мультивыбор: значение — массив, список не закрывается при выборе.",
  },
  {
    prop: "native",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Системный <select>: пункты из Item, группы — optgroup. name и aria-* — на Root.",
  },
  {
    prop: "placeholder",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Текст в триггере без значения (data-placeholder у Select.Value).",
  },
  {
    prop: "clearable",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "× в триггере; Delete/Backspace на триггере тоже очищают.",
  },
  {
    prop: "loading",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Спиннер вместо шеврона, aria-busy, строка labels.loading в панели.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Отключает поле целиком.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "авто",
    required: "Нет",
    description: "id триггера или нативного select.",
  },
  {
    prop: "labels",
    type: "Partial<SelectLabels>",
    defaultValue: "русские",
    required: "Нет",
    description: "search, empty, emptyHint, loading, clear, optional — все системные строки.",
  },
  {
    prop: "focusRing",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      'false скрывает только кольцо фокуса (data-focus-ring="false"); фокус, клавиатура и кольцо ошибки остаются.',
  },
  {
    prop: "name / aria-label / aria-labelledby / aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Только при native: атрибуты системного <select> (у него нет Select.Trigger).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки поля (подпись + контрол + подсказка).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Trigger и Content (в native — сразу Item/Group).",
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
  {
    prop: "children",
    type: "(item: { value: string; label: string }) => React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Только одиночный выбор: рисует выбранный пункт в триггере (Thumbnail / ItemText / ItemDescription). Не вызывается без значения.",
  },
];

const selectBadgeApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "color",
    type: "PaletteColor",
    defaultValue: '"gray"',
    required: "Нет",
    description: "Цвет мягкого бейджа в конце триггера (на ярус ниже поля).",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст статуса.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс бейджа.",
  },
];

const selectRichPartsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Thumbnail.Root",
    type: "ThumbnailRootProps",
    defaultValue: "размер по ярусу Select",
    required: "Нет",
    description:
      "Превью слева (иконка в Thumbnail.Fallback или Thumbnail.Image). Без своего size берёт размер под ярус Select (m → s). Делает пункт двухстрочным.",
  },
  {
    prop: "Select.ItemText",
    type: "children, className",
    defaultValue: "—",
    required: "Нет",
    description: "Название пункта; его текст — подпись для триггера, typeahead и поиска.",
  },
  {
    prop: "Select.ItemDescription",
    type: "children, className",
    defaultValue: "—",
    required: "Нет",
    description: "Вторая приглушённая строка; участвует в поиске.",
  },
  {
    prop: "Select.ItemMeta",
    type: "children, className",
    defaultValue: "—",
    required: "Нет",
    description: "Значение справа перед галочкой (цена, счётчик), табличные цифры.",
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
    description: "Класс портальной панели (поиск + listbox).",
  },
  {
    prop: "searchable",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Поле поиска сверху панели (labels.search); фильтр по подписи и keywords.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Пункты, группы, разделители. Остаются смонтированными при закрытом списке — так Select.Value знает подписи.",
  },
];

const selectItemApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Значение опции; попадает в onValueChange Root и в data-value для клавиатуры.",
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
    prop: "keywords",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительные слова для поиска (синонимы, латиница, сокращения).",
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
              <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> · <code>xl</code> —
              28, 32, 36, 40 и 48 px. Триггер выравнивается в одну линию с Button и Input того же
              размера, пункты списка берут высоту и кегль того же яруса. По умолчанию —{" "}
              <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <SelectSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Подпись, подсказка и ошибка — пропсы <code>label</code>, <code>hint</code>,{" "}
              <code>error</code> на <code>Select.Root</code>, как у Input. Плейсхолдер,{" "}
              <code>clearable</code>, <code>loading</code>, <code>disabled</code> и пустой список
              (текст — <code>labels.empty</code>). Наведение затемняет заливку поля, фокус и
              открытие переключают её на <code>field-bg-focus</code> с кольцом фокуса.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SelectStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Очистка значения</DemoSectionTitle>
            <DemoDescription>
              <code>clearable</code> добавляет перед шевроном сегмент очистки на всю высоту поля:
              вся зона кликабельна и подсвечивается целиком. С клавиатуры значение очищают Delete
              или Backspace на триггере.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={clearableSource.trim()} previewLayout="stack-narrow">
              <PlaygroundExampleFrame.Stage>
                <SelectClearableExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Поиск, группы и длинный список</DemoSectionTitle>
            <DemoDescription>
              <code>Select.Content searchable</code>: поле поиска сверху панели (плейсхолдер —{" "}
              <code>labels.search</code>), фильтр по подписи и <code>keywords</code>. Группы с{" "}
              <code>GroupLabel</code> и <code>Separator</code>, недоступный пункт пропускается
              стрелками. Длинный список прокручивается внутри панели (
              <code>--prime-panel-max-height</code>), у края экрана панель переворачивается.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={searchGroupsSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <SelectSearchGroupsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Мультиселект</DemoSectionTitle>
            <DemoDescription>
              <code>Select.Root multiple</code>: значение — массив строк, у пунктов слева чекбокс,
              список не закрывается после выбора, в триггере подписи через запятую.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={multipleSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <SelectMultipleExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Богатые пункты</DemoSectionTitle>
            <DemoDescription>
              <code>Thumbnail</code> — превью с иконкой или картинкой (размер подбирается под ярус
              Select), <code>Select.ItemText</code> и <code>Select.ItemDescription</code> — две
              строки, <code>Select.ItemMeta</code> — значение справа перед галочкой. Пункт и триггер
              растут до двух строк с отступами яруса; триггер рисует выбранный пункт через функцию в{" "}
              <code>Select.Value</code>. Typeahead — по названию, поиск — по названию и описанию.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={richOptionsSource.trim()}
              previewLayout="stack-narrow"
            >
              <PlaygroundExampleFrame.Stage>
                <SelectRichOptionsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Иконки пунктов и бейдж</DemoSectionTitle>
            <DemoDescription>
              <code>Select.ItemIcon</code> — иконка перед текстом пункта; <code>Select.Badge</code>{" "}
              в триггере — мягкий бейдж на ярус ниже поля перед шевроном, его <code>color</code>{" "}
              следует за выбранным значением.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={withBadgeSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <SelectWithBadgeExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Форма в карточке</DemoSectionTitle>
            <DemoDescription>
              Card переключает переменную <code>--prime-color-field-bg</code> на{" "}
              <code>field-bg-surface</code>. <code>label</code>, <code>required</code>,{" "}
              <code>optional</code> и <code>hint</code> на Root, иконка в триггере (
              <code>Select.TriggerIcon</code>) и <code>label</code> пункта: в списке короткий код, в
              триггере полное название.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={inFormSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <SelectInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>На разных поверхностях</DemoSectionTitle>
            <DemoDescription>
              Один и тот же триггер на холсте, в карточке и на плавающем слое — заливка поля берётся
              из <code>--prime-color-field-bg</code> текущей поверхности.
            </DemoDescription>
            <SurfaceGallery>
              <SelectControlledExample />
            </SurfaceGallery>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
            <DemoDescription>
              Пара <code>value</code> и <code>onValueChange</code>: значение хранится у родителя.
              Открытие списка так же контролируется парой <code>open</code> /{" "}
              <code>onOpenChange</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={controlledSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <SelectControlledExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Нативный select</DemoSectionTitle>
            <DemoDescription>
              <code>Select.Root native</code> — системный <code>&lt;select&gt;</code> с теми же
              токенами размера; пункты из <code>Select.Item</code>, группы становятся{" "}
              <code>&lt;optgroup&gt;</code>. Удобен на мобильных.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={nativeSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <SelectNativeExample />
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
            <DemoApiTitle>Select.Badge</DemoApiTitle>
            <DemoDescription>Статус в триггере перед кнопкой сброса и шевроном.</DemoDescription>
            <PlaygroundApiTable rows={selectBadgeApiRows} />
            <DemoApiTitle>Select.Content</DemoApiTitle>
            <DemoDescription>
              Портальная панель: необязательный поиск, listbox с клавиатурной навигацией, пустое
              состояние и статус загрузки.
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
            <DemoApiTitle>Богатый пункт</DemoApiTitle>
            <DemoDescription>
              Части пункта и функции в <code>Select.Value</code>; прямые дети Item.
            </DemoDescription>
            <PlaygroundApiTable rows={selectRichPartsApiRows} />
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
