import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import TagSelectFeaturesSnippet from "../snippets/tag-select/features";
import featuresSource from "../snippets/tag-select/features.tsx?raw";

const tagSelectRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "options",
    type: "TagSelectOption[]",
    defaultValue: "—",
    required: "Да",
    description: "Список значений: value, label, опционально color (Badge filled) и disabled.",
  },
  {
    prop: "value / defaultValue",
    type: "string[]",
    defaultValue: "[]",
    required: "Нет",
    description: "Выбранные значения (value из options или созданные вручную при creatable).",
  },
  {
    prop: "onValueChange",
    type: "(next: string[]) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Изменение набора выбранных тегов.",
  },
  {
    prop: "creatable",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Разрешить добавление значения, которого нет в options (строка Create в списке).",
  },
  {
    prop: "defaultTagColor",
    type: "BadgeColor",
    defaultValue: '"gray"',
    required: "Нет",
    description: "Цвет Badge для значений без color в options и для превью в строке Create.",
  },
  {
    prop: "hint",
    type: "React.ReactNode",
    defaultValue: "текст подсказки",
    required: "Нет",
    description: "Текст над списком; передайте null/false через условный рендер, чтобы скрыть.",
  },
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус токенов как у Select (поле и панель списка).",
  },
];

export default function TagSelectSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Tag select</PageContent.Title>
        <PageContent.Description measure="full">
          Мультивыбор с чипами <code>Badge</code> в поле, панель списка на базе стилей{" "}
          <code>Select.Content</code>, фильтр по вводу и опциональное создание нового тега.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Мультивыбор и создание</DemoSectionTitle>
            <DemoDescription>
              Цвета опций задаются через <code>color</code> у <code>options</code>. При{" "}
              <code>creatable</code> ввод несуществующего значения показывает строку Create с превью
              тега.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={featuresSource.trim()} previewLayout="stack-center">
              <PlaygroundExampleFrame.Stage>
                <TagSelectFeaturesSnippet />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoApiTitle>API</DemoApiTitle>
            <PlaygroundApiTable rows={tagSelectRootApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
