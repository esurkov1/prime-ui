import TypographyArticleExample from "@/components/typography/examples/article";
import articleSource from "@/components/typography/examples/article.tsx?raw";
import TypographyAsPropExample from "@/components/typography/examples/as-prop";
import asPropSource from "@/components/typography/examples/as-prop.tsx?raw";
import TypographyCompositionExample from "@/components/typography/examples/composition";
import compositionSource from "@/components/typography/examples/composition.tsx?raw";
import TypographyFullWidthExample from "@/components/typography/examples/full-width";
import fullWidthSource from "@/components/typography/examples/full-width.tsx?raw";
import TypographyReadingAndFormExample from "@/components/typography/examples/reading-and-form";
import readingAndFormSource from "@/components/typography/examples/reading-and-form.tsx?raw";
import TypographyStatesExample from "@/components/typography/examples/states";
import statesSource from "@/components/typography/examples/states.tsx?raw";
import TypographyTonesExample from "@/components/typography/examples/tones";
import tonesSource from "@/components/typography/examples/tones.tsx?raw";
import TypographyTruncateExample from "@/components/typography/examples/truncate";
import truncateSource from "@/components/typography/examples/truncate.tsx?raw";
import TypographyVariantCatalogExample from "@/components/typography/examples/variant-catalog";
import variantCatalogSource from "@/components/typography/examples/variant-catalog.tsx?raw";
import TypographyVariantsExample from "@/components/typography/examples/variants";
import variantsSource from "@/components/typography/examples/variants.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const typographyVariantUnion =
  '"caption" | "body-s" | "body-m" | "body-l" | "title-s" | "title-m" | "title-l" | "heading-s" | "heading-m" | "heading-l" | "display-s" | "display-m" | "display-l" | "code"';

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
      "Текстовая роль (--prime-text-<role>-*): кегль, интервал, вес и трекинг; в DOM — data-variant.",
  },
  {
    prop: "weight",
    type: '"regular" | "medium" | "semibold"',
    defaultValue: "вес роли",
    required: "Нет",
    description: "Переопределяет вес роли (data-weight).",
  },
  {
    prop: "tracking",
    type: '"normal" | "tight" | "tighter" | "wide"',
    defaultValue: "трекинг роли",
    required: "Нет",
    description: "Переопределяет межбуквенное расстояние роли (data-tracking).",
  },
  {
    prop: "truncate",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Одна строка с многоточием (data-truncate); задайте title, если полный текст важен.",
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
    type: '"default" | "secondary" | "muted" | "accent" | "success" | "warning" | "danger"',
    defaultValue: '"default"',
    required: "Нет",
    description:
      "Цвет текста: default — основной, secondary и muted — две ступени тише, остальные — семантические *-text.",
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

/** Typography component docs (examples + API), shown under the type tokens on the Foundation page. */
export function TypographyComponentDocs() {
  return (
    <>
      <div className="demoBlock">
        <DemoSectionTitle>Компонент Typography: варианты</DemoSectionTitle>
        <DemoDescription>
          Полный набор ролей — от <code>display-l</code> до <code>caption</code> и <code>code</code>
          . Подписи у разделителей: имя <code>variant</code> и краткое назначение.
        </DemoDescription>
        <PlaygroundExampleFrame.Root code={variantCatalogSource.trim()} previewLayout="stack">
          <PlaygroundExampleFrame.Stage>
            <TypographyVariantCatalogExample />
          </PlaygroundExampleFrame.Stage>
        </PlaygroundExampleFrame.Root>
      </div>

      <div className="demoBlock">
        <DemoSectionTitle>Статья и цитата</DemoSectionTitle>
        <DemoDescription>
          Landmarks (<code>article</code>, <code>section</code>, <code>header</code>), заголовки{" "}
          <code>h1</code>–<code>h2</code> и <code>blockquote</code> с <code>Typography</code>.
        </DemoDescription>
        <PlaygroundExampleFrame.Root code={articleSource.trim()} previewLayout="stack">
          <PlaygroundExampleFrame.Stage>
            <TypographyArticleExample />
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
            <TypographyReadingAndFormExample />
          </PlaygroundExampleFrame.Stage>
        </PlaygroundExampleFrame.Root>
      </div>

      <div className="demoBlock">
        <DemoSectionTitle>Варианты начертания</DemoSectionTitle>
        <DemoDescription>
          На одном <code>variant=&quot;body-m&quot;</code>: <code>weight</code>, крайние{" "}
          <code>tracking</code> и <code>tone=&quot;secondary&quot;</code>.
        </DemoDescription>
        <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
          <PlaygroundExampleFrame.Stage>
            <TypographyVariantsExample />
          </PlaygroundExampleFrame.Stage>
        </PlaygroundExampleFrame.Root>
      </div>

      <div className="demoBlock">
        <DemoSectionTitle>Цвет текста</DemoSectionTitle>
        <DemoDescription>
          <code>tone</code>: <code>default</code>, <code>secondary</code>, <code>muted</code> и
          семантические <code>accent</code>, <code>success</code>, <code>warning</code>,{" "}
          <code>danger</code>.
        </DemoDescription>
        <PlaygroundExampleFrame.Root code={tonesSource.trim()} previewLayout="stack">
          <PlaygroundExampleFrame.Stage>
            <TypographyTonesExample />
          </PlaygroundExampleFrame.Stage>
        </PlaygroundExampleFrame.Root>
      </div>

      <div className="demoBlock">
        <DemoSectionTitle>Обрезка строки</DemoSectionTitle>
        <DemoDescription>
          <code>truncate</code> — одна строка с многоточием; полный текст — в <code>title</code>.
        </DemoDescription>
        <PlaygroundExampleFrame.Root code={truncateSource.trim()} previewLayout="stack">
          <PlaygroundExampleFrame.Stage>
            <TypographyTruncateExample />
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
            <TypographyStatesExample />
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
            <TypographyCompositionExample />
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
            <TypographyFullWidthExample />
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
            <TypographyAsPropExample />
          </PlaygroundExampleFrame.Stage>
        </PlaygroundExampleFrame.Root>
      </div>

      <div className="demoBlock">
        <DemoSectionTitle>API компонента Typography</DemoSectionTitle>
        <DemoApiTitle>Typography.Root</DemoApiTitle>
        <DemoDescription>
          Стилизованный текст с обязательным <code>variant</code> и опциональными осями оформления;
          в DOM — <code>data-variant</code> (и прочие <code>data-*</code> по правилам кита).
        </DemoDescription>
        <PlaygroundApiTable rows={typographyRootApiRows} />
      </div>
    </>
  );
}
