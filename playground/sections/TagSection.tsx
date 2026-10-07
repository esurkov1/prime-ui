import { PageContent } from "@/components/page-content/PageContent";
import TagAppliedFiltersExample from "@/components/tag/examples/applied-filters";
import tagAppliedFiltersSource from "@/components/tag/examples/applied-filters.tsx?raw";
import TagColorsExample from "@/components/tag/examples/colors";
import tagColorsSource from "@/components/tag/examples/colors.tsx?raw";
import TagSizesExample from "@/components/tag/examples/sizes";
import tagSizesSource from "@/components/tag/examples/sizes.tsx?raw";
import TagStatesExample from "@/components/tag/examples/states";
import tagStatesSource from "@/components/tag/examples/states.tsx?raw";
import TagSurfacesExample from "@/components/tag/examples/surfaces";
import tagSurfacesSource from "@/components/tag/examples/surfaces.tsx?raw";
import TagWithIconExample from "@/components/tag/examples/with-icon";
import tagWithIconSource from "@/components/tag/examples/with-icon.tsx?raw";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const tagRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "color",
    type: '"gray" | "blue" | "sky" | "teal" | "green" | "yellow" | "orange" | "red" | "pink" | "purple"',
    defaultValue: '"gray"',
    required: "Нет",
    description: "Оттенок палитры, как у Badge: мягкая заливка и текст оттенка.",
  },
  {
    prop: "variant",
    type: '"soft" | "outline"',
    defaultValue: '"soft"',
    required: "Нет",
    description: "soft — мягкая заливка, outline — тонкий контур без заливки.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: 'из контрола или "m"',
    required: "Нет",
    description:
      "Ярусы бейджа: 16 · 20 · 24 · 28 · 32 px. Без size внутри контрола тег на ярус меньше контрола (data-size — размер контрола, data-tier — визуальный ярус).",
  },
  {
    prop: "onRemove",
    type: "() => void",
    defaultValue: "—",
    required: "Нет",
    description: "Показывает кнопку удаления справа; клик вызывает колбэк.",
  },
  {
    prop: "labels",
    type: "Partial<TagLabels>",
    defaultValue: '{ remove: "Удалить" }',
    required: "Нет",
    description:
      "Системные строки. remove — доступное имя кнопки удаления; включайте текст тега: «Убрать фильтр «Москва»».",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description:
      "Приглушённый текст; кнопка удаления нативно disabled, на корне aria-disabled и data-disabled.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст и опционально Tag.Icon в начале.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className и остальные атрибуты корневого span; ref передаётся на span.",
  },
];

const tagIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Иконка; цвет текста тега, размер по ярусу тега.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс обёртки.",
  },
];

export default function TagSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Tag</PageContent.Title>
        <PageContent.Description measure="full">
          Чип на мягкой заливке без обводки (по умолчанию нейтральной) — для выбранных значений,
          применённых фильтров и ключевых слов, с необязательной кнопкой удаления. Цветной статус
          только для чтения — это <code>Badge</code>; переключатели — <code>ButtonGroup</code> или{" "}
          <code>Checkbox</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              Ярусы <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> ·{" "}
              <code>xl</code> общие с <code>Badge</code>. Внутри контрола (например в{" "}
              <code>TagSelect</code>) тег без <code>size</code> сам берёт ярус на ступень ниже.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={tagSizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <TagSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Цвета и варианты</DemoSectionTitle>
            <DemoDescription>
              Десять оттенков <code>color</code>, как у <code>Badge</code>. <code>soft</code> (по
              умолчанию) — мягкая заливка, <code>outline</code> — тонкий контур без заливки.
              Нейтральный <code>gray</code> — для обычных значений, цвет — для группировки по
              категориям.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={tagColorsSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <TagColorsExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Сам тег не фокусируется — фокус получает только кнопка удаления. Наведите на крестик
              или нажмите <code>Tab</code>: появится подложка и кольцо фокуса. При{" "}
              <code>disabled</code> кнопка заблокирована, текст приглушён.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={tagStatesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <TagStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>С иконкой</DemoSectionTitle>
            <DemoDescription>
              <code>Tag.Icon</code> ставит иконку перед текстом; размер подстраивается под ярус.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={tagWithIconSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <TagWithIconExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>На разных поверхностях</DemoSectionTitle>
            <DemoDescription>
              Нейтральная заливка остаётся различимой на холсте, карточке и всплывающем слое.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={tagSurfacesSource.trim()} previewLayout="stack">
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery>
                  <TagSurfacesExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: применённые фильтры</DemoSectionTitle>
            <DemoDescription>
              Каждый тег снимает свой фильтр; <code>labels.remove</code> включает название фильтра,
              чтобы скринридер не читал пять одинаковых «Удалить». После удаления переведите фокус
              на соседний тег или поле, из которого фильтр был добавлен.
            </DemoDescription>
            <PlaygroundExampleFrame.Root
              code={tagAppliedFiltersSource.trim()}
              previewLayout="stack-center"
              surface="canvas"
            >
              <PlaygroundExampleFrame.Stage>
                <TagAppliedFiltersExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Tag.Root</DemoApiTitle>
            <PlaygroundApiTable rows={tagRootApiRows} />
            <DemoApiTitle>Tag.Icon</DemoApiTitle>
            <PlaygroundApiTable rows={tagIconApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
