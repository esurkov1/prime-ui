import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import TagBasicSnippet from "../snippets/tag/basic";
import tagBasicSource from "../snippets/tag/basic.tsx?raw";
import TagCompositionSnippet from "../snippets/tag/composition";
import tagCompositionSource from "../snippets/tag/composition.tsx?raw";
import TagRemovableSnippet from "../snippets/tag/removable";
import tagRemovableSource from "../snippets/tag/removable.tsx?raw";
import TagSizesSnippet from "../snippets/tag/sizes";
import tagSizesSource from "../snippets/tag/sizes.tsx?raw";
import TagStatesSnippet from "../snippets/tag/states";
import tagStatesSource from "../snippets/tag/states.tsx?raw";

const tagRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"s" | "m" | "l" | "xl"',
    defaultValue: "m или из ControlSizeContext",
    required: "нет",
    description:
      "Визуальный размер. Если не задан, при обёртке в контекст размера контролов берётся соответствующий размер из контекста.",
  },
  {
    prop: "onRemove",
    type: "() => void",
    defaultValue: "—",
    required: "нет",
    description: "При передаче справа отображается кнопка удаления; клик вызывает колбэк.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "—",
    required: "нет",
    description: "Отключает тег и кнопку удаления; на корне выставляется aria-disabled.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "нет",
    description: "Содержимое тела тега; внутри доступен ControlSizeProvider с выбранным size.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "нет",
    description: "Дополнительный класс на корневом span.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "нет",
    description: "Стандартные атрибуты span (data-*, aria-*, onClick и т.д.).",
  },
];

const tagIconApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "да",
    description: "Обычно иконка; оборачивается в слот со стилями иконки тега.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "нет",
    description: "Дополнительный класс на обёртке иконки.",
  },
];

export default function TagSection() {
  return (
    <PlaygroundDocPage
      title="Tag"
      description={
        <>
          Компактная метка (чип) для фильтров, выбранных значений и метаданных. Поддерживает иконку
          слева от текста и опциональную кнопку удаления справа. Размер согласован с осью размеров
          контролов через <code>ControlSizeProvider</code>.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Ряд <code>size</code>: <code>s</code>, <code>m</code>, <code>l</code>, <code>xl</code> —
            высота, радиус, кегль и размер иконки берутся из одного яруса системных токенов
            контролов.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tagSizesSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <TagSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Обычный, с кнопкой удаления (<code>onRemove</code>) и <code>disabled</code>. Отключённое
            состояние блокирует кнопку удаления и выставляет <code>aria-disabled</code> на корне.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tagStatesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TagStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Иконка через <code>Tag.Icon</code> перед текстом, только текст или текст с кнопкой
            удаления. Размер иконки автоматически согласован с <code>size</code> корня через
            контекст.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tagCompositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TagCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Базовый пример</DemoSectionTitle>
          <DemoDescription>
            Статичные метки без иконки и без <code>onRemove</code> — типично для технологий проекта
            или категорий товара.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tagBasicSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TagBasicSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Удаляемые теги</DemoSectionTitle>
          <DemoDescription>
            Проп <code>onRemove</code> добавляет справа кнопку с крестиком; подпись для скринридеров
            фиксирована (<code>aria-label=&quot;Remove&quot;</code> в разметке компонента).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={tagRemovableSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TagRemovableSnippet />
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
    </PlaygroundDocPage>
  );
}
