import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import TypographyArticleLandmarksSnippet from "../snippets/typography/article-landmarks";
import articleLandmarksSource from "../snippets/typography/article-landmarks.tsx?raw";
import TypographyAsPropSnippet from "../snippets/typography/as-prop";
import asPropSource from "../snippets/typography/as-prop.tsx?raw";
import TypographyCompositionSnippet from "../snippets/typography/composition";
import compositionSource from "../snippets/typography/composition.tsx?raw";
import TypographyFullWidthSnippet from "../snippets/typography/full-width";
import fullWidthSource from "../snippets/typography/full-width.tsx?raw";
import TypographyReadingAndFormSnippet from "../snippets/typography/reading-and-form";
import readingAndFormSource from "../snippets/typography/reading-and-form.tsx?raw";
import TypographyStatesSnippet from "../snippets/typography/states";
import statesSource from "../snippets/typography/states.tsx?raw";
import TypographyVariantCatalogSnippet from "../snippets/typography/variant-catalog";
import variantCatalogSource from "../snippets/typography/variant-catalog.tsx?raw";
import TypographyVariantsSnippet from "../snippets/typography/variants";
import variantsSource from "../snippets/typography/variants.tsx?raw";

const typographyVariantUnion =
  '"display" | "headline" | "heading-page" | "heading-section" | "heading-subsection" | "heading-group" | "body-large" | "body-default" | "body-small" | "body-compact" | "caption" | "caption-micro"';

const typographyAsUnion =
  '"p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "small" | "blockquote" | "article" | "section" | "header" | "footer" | "aside" | "nav" | "main"';

const typographyRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "as",
    type: typographyAsUnion,
    defaultValue: '"p"',
    required: "Нет",
    description: "HTML-тег обёртки (в т.ч. landmarks и заголовки h1–h6).",
  },
  {
    prop: "variant",
    type: typographyVariantUnion,
    defaultValue: "—",
    required: "Да",
    description:
      "Семантическая роль чтения; кегль и межстрочный интервал из темы (`typography.role`).",
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
          Текст страницы — семантические роли <code>variant</code> и токены{" "}
          <code>typography.role</code> (кегли согласованы со шкалой MD3; ориентиры Apple SF и
          Polaris — в <code>COMPONENT.md</code>). Поля и кнопки оформляются своими компонентами; с{" "}
          <code>Typography</code> они не смешиваются по API.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <DemoSectionTitle>Варианты (роли)</DemoSectionTitle>
          <DemoDescription>
            Полный набор ролей из <code>typography.role</code> — от <code>display</code> до{" "}
            <code>caption-micro</code>. Подписи у разделителей: имя <code>variant</code> и краткое
            назначение.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantCatalogSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyVariantCatalogSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Статья и цитата</DemoSectionTitle>
          <DemoDescription>
            Landmarks (<code>article</code>, <code>section</code>, <code>header</code>), заголовки{" "}
            <code>h1</code>–<code>h2</code> и <code>blockquote</code> с <code>Typography</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={articleLandmarksSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyArticleLandmarksSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Страница и форма</DemoSectionTitle>
          <DemoDescription>
            Один фрейм: заголовок и пояснение — <code>Typography</code>; поля и действия —{" "}
            <code>Input</code> и <code>Button</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={readingAndFormSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyReadingAndFormSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты начертания</DemoSectionTitle>
          <DemoDescription>
            На одном <code>variant=&quot;body-default&quot;</code>: <code>weight</code>, крайние{" "}
            <code>tracking</code> и <code>tone=&quot;muted&quot;</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Интерактивных состояний у текста нет; показан курсив <code>italic</code> при том же{" "}
            <code>variant</code> и <code>weight</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            Вложенные <code>Typography.Root</code> с разными <code>as</code> и <code>weight</code>,
            плюс ссылка внутри родительского блока.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Два контейнера разной ширины: одинаковые <code>variant</code> и <code>tone</code> для
            подписи и основного текста.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Тег as</DemoSectionTitle>
          <DemoDescription>
            <code>as=&quot;p&quot;</code>, <code>as=&quot;div&quot;</code> и вложенный{" "}
            <code>as=&quot;span&quot;</code> внутри абзаца.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={asPropSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <TypographyAsPropSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>Typography.Root</DemoApiTitle>
          <DemoDescription>
            Стилизованный текст с обязательным <code>variant</code> и опциональными осями
            оформления; в DOM — <code>data-variant</code> (и прочие <code>data-*</code> по правилам
            кита).
          </DemoDescription>
          <PlaygroundApiTable rows={typographyRootApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
