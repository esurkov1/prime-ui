import { PageContent } from "@/components/page-content/PageContent";
import TagSelectInFormExample from "@/components/tag-select/examples/in-form";
import inFormSource from "@/components/tag-select/examples/in-form.tsx?raw";
import TagSelectManageTagsExample from "@/components/tag-select/examples/manage-tags";
import manageTagsSource from "@/components/tag-select/examples/manage-tags.tsx?raw";
import TagSelectSizesExample from "@/components/tag-select/examples/sizes";
import sizesSource from "@/components/tag-select/examples/sizes.tsx?raw";
import TagSelectStatesExample from "@/components/tag-select/examples/states";
import statesSource from "@/components/tag-select/examples/states.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const tagSelectRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "options",
    type: "TagSelectOption[]",
    defaultValue: "—",
    required: "Да",
    description: "Справочник: value, label, color (PaletteColor), disabled.",
  },
  {
    prop: "value / defaultValue",
    type: "string[]",
    defaultValue: "—",
    required: "Нет",
    description: "Выбранные значения в порядке добавления.",
  },
  {
    prop: "onValueChange",
    type: "(value: string[]) => void",
    defaultValue: "—",
    required: "Нет",
    description: "После добавления, снятия или создания тега.",
  },
  {
    prop: "open / defaultOpen / onOpenChange",
    type: "boolean / boolean / (open: boolean) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Открытие списка.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус поля и списка; чипы (Badge) — на ярус меньше.",
  },
  {
    prop: "label / required / optional / hint / error",
    type: "ReactNode / boolean / boolean / ReactNode / ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Поле формы как у Input: подпись, *, «необязательно», подсказка, ошибка (включает invalid).",
  },
  {
    prop: "invalid / disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Кольцо danger и aria-invalid / отключённое поле.",
  },
  {
    prop: "placeholder",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Текст в пустом поле.",
  },
  {
    prop: "creatable",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Строка «Создать» и Enter добавляют значение, которого нет в options.",
  },
  {
    prop: "onCreate",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается только для созданного значения (не для выбора из options).",
  },
  {
    prop: "defaultColor",
    type: "PaletteColor",
    defaultValue: '"gray"',
    required: "Нет",
    description: "Цвет чипа для значений без color, в том числе созданных.",
  },
  {
    prop: "onOptionUpdate",
    type: "(value, { label?, color? }) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Включает меню «⋯» у строки: имя и палитра. value не меняется.",
  },
  {
    prop: "onOptionDelete",
    type: "(value: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Кнопка «Удалить» в меню; значение снимается и из выбора.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "авто",
    required: "Нет",
    description: "id поля ввода.",
  },
  {
    prop: "labels",
    type: "Partial<TagSelectLabels>",
    defaultValue: "русские",
    required: "Нет",
    description:
      "panelHint, create, remove, more, removed, edit, name, delete, colors, colorNames, optional. «{label}» — текст тега, «{count}» — число скрытых.",
  },
  {
    prop: "focusRing",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description:
      'false скрывает только кольцо фокуса (data-focus-ring="false"); кольцо ошибки остаётся.',
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс обёртки поля (подпись + контрол + подсказка).",
  },
  {
    prop: "aria-label / aria-labelledby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Имя без видимого label.",
  },
];

export default function TagSelectSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Tag select</PageContent.Title>
        <PageContent.Description measure="full">
          Мультивыбор с чипами <code>Badge</code> в поле, панель списка на базе стилей{" "}
          <code>Select.Content</code>, фильтр по вводу и опциональное создание нового тега. Для
          выбора из закрытого списка без чипов — <code>Select multiple</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>xs</code>–<code>xl</code> — та же ось, что у Select и Input: высота поля 28–48,
              чипы на один ярус меньше поля. По умолчанию — <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <TagSelectSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              В покое поле в одну строку: лишние чипы — в кнопке «+N» («Показать ещё N»). В фокусе
              или с открытым списком поле раскрывается и показывает все чипы в несколько строк (до
              трёх, дальше прокрутка внутри поля), при уходе фокуса сворачивается. Выбранные
              значения стоят в списке первыми с галочкой — снятие галочки убирает тег. Недоступные
              пункты (<code>disabled</code> в <code>options</code>) не выбираются.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TagSelectStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Создание и редактирование меток</DemoSectionTitle>
            <DemoDescription>
              Фильтр по вводу, <code>creatable</code> (строка «Создать» или Enter), цвета через{" "}
              <code>color</code> у <code>options</code>. Меню «⋯» у строки: переименование, палитра,
              удаление из справочника; <code>onOptionUpdate</code> дополняет список, если тега ещё
              нет в <code>options</code>. Клавиатура: Backspace в пустом поле снимает последний чип,
              ← из пустого ввода переходит по чипам, Delete / Backspace на чипе удаляют его
              (экранный диктор слышит «Удалено: …»).
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={manageTagsSource.trim()}
              previewLayout="stack-center"
            >
              <PlaygroundExampleFrame.Stage>
                <TagSelectManageTagsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Форма задачи</DemoSectionTitle>
            <DemoDescription>
              В карточке заливка поля та же, что у Input рядом; <code>label</code>,{" "}
              <code>optional</code> и <code>hint</code> — пропсы TagSelect.Root, как у Input.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={inFormSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <TagSelectInFormExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>TagSelect.Root</DemoApiTitle>
            <PlaygroundApiTable rows={tagSelectRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
