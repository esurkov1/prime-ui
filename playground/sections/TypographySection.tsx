import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import TypographyAsPropSnippet from "../snippets/typography/as-prop";
import asPropSource from "../snippets/typography/as-prop.tsx?raw";
import TypographyCompositionSnippet from "../snippets/typography/composition";
import compositionSource from "../snippets/typography/composition.tsx?raw";
import TypographyFullWidthSnippet from "../snippets/typography/full-width";
import fullWidthSource from "../snippets/typography/full-width.tsx?raw";
import TypographySizesSnippet from "../snippets/typography/sizes";
import sizesSource from "../snippets/typography/sizes.tsx?raw";
import TypographyStatesSnippet from "../snippets/typography/states";
import statesSource from "../snippets/typography/states.tsx?raw";
import TypographyVariantsSnippet from "../snippets/typography/variants";
import variantsSource from "../snippets/typography/variants.tsx?raw";

const typographySizeUnion =
  '"2xs" | "xs" | "s" | "m" | "l" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl"';

const typographyRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: '"p" | "span" | "div"',
    defaultValue: '"p"',
    required: "Нет",
    description: "HTML-тег обёртки (не h1–h6).",
  },
  {
    prop: "size",
    type: typographySizeUnion,
    defaultValue: "—",
    required: "Да",
    description: "Ступень шкалы кегля и межстрочного интервала.",
  },
  {
    prop: "weight",
    type: '"regular" | "medium" | "semibold"',
    defaultValue: '"regular"',
    required: "Нет",
    description: "Начертание; для regular атрибут data-weight не выставляется.",
  },
  {
    prop: "tracking",
    type: '"normal" | "tight" | "tighter" | "wide"',
    defaultValue: '"normal"',
    required: "Нет",
    description: "Межбуквенное расстояние; для normal data-tracking не выставляется.",
  },
  {
    prop: "italic",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Курсив (data-italic).",
  },
  {
    prop: "tone",
    type: '"default" | "muted"',
    defaultValue: '"default"',
    required: "Нет",
    description: "default — основной цвет текста; muted — вторичный.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный CSS-класс.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Текст или вложенная разметка.",
  },
  {
    prop: "ref",
    type: "React.Ref<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Ссылка на DOM-элемент выбранного тега.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Остальные атрибуты элемента (id, title, aria-*, data-* и т.д.).",
  },
];

export default function TypographySection() {
  return (
    <PlaygroundDocPage
      title="Typography"
      description={
        <>
          Готовые сочетания размера текста, насыщенности, трекинга и оттенка. Обёртка может быть
          абзацем, <code>span</code> или <code>div</code>. Заголовки экранов по смыслу размечайте
          тегами <code>h1</code>–<code>h6</code>; этот компонент их не подменяет.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Одиннадцать значений <code>size</code> от <code>6xl</code> до <code>2xs</code>; у части
            строк заданы <code>weight</code> и <code>tracking</code> вдобавок к обязательному
            размеру.
          </p>
          <PlaygroundExampleFrame.Root code={sizesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographySizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            На одном <code>size=&quot;m&quot;</code>: три значения <code>weight</code>, крайние{" "}
            <code>tracking</code> и <code>tone=&quot;muted&quot;</code>.
          </p>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Интерактивных состояний (disabled, loading, ошибка) у текста нет; показан переключатель
            курсива <code>italic</code> при том же <code>size</code> и <code>weight</code>.
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            Вложенные <code>Typography.Root</code> с разными <code>as</code> и <code>weight</code>,
            плюс обычная ссылка внутри родительского блока.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Два контейнера разной ширины: одинаковые <code>size</code> и <code>tone</code> для
            подписи и основного текста, разное число переносов строки.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Тег as</h4>
          <p className="demoBlockDescription">
            Сравнение <code>as=&quot;p&quot;</code>, <code>as=&quot;div&quot;</code> и вложенного{" "}
            <code>as=&quot;span&quot;</code> внутри абзаца.
          </p>
          <PlaygroundExampleFrame.Root code={asPropSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyAsPropSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>Typography.Root</h5>
          <p className="demoBlockDescription">
            Единственная публичная часть API: стилизованный текст с обязательным <code>size</code> и
            опциональными осями оформления.
          </p>
          <PlaygroundApiTable rows={typographyRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
