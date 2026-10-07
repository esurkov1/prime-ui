import { PageContent } from "@/components/page-content/PageContent";
import CardGridExample from "@/components/thumbnail/examples/card-grid";
import cardGridSource from "@/components/thumbnail/examples/card-grid.tsx?raw";
import FallbackExample from "@/components/thumbnail/examples/fallback";
import fallbackSource from "@/components/thumbnail/examples/fallback.tsx?raw";
import InTableExample from "@/components/thumbnail/examples/in-table";
import inTableSource from "@/components/thumbnail/examples/in-table.tsx?raw";
import RatiosExample from "@/components/thumbnail/examples/ratios";
import ratiosSource from "@/components/thumbnail/examples/ratios.tsx?raw";
import RingExample from "@/components/thumbnail/examples/ring";
import ringSource from "@/components/thumbnail/examples/ring.tsx?raw";
import SizesExample from "@/components/thumbnail/examples/sizes";
import sizesSource from "@/components/thumbnail/examples/sizes.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Высота 24 · 32 · 40 · 48 · 64 и радиус 4 · 6 · 8 · 8 · 12; ширина — из ratio.",
  },
  {
    prop: "ratio",
    type: '"1:1" | "4:3" | "3:2" | "16:9" | "3:4"',
    defaultValue: '"1:1"',
    required: "Нет",
    description: "Соотношение сторон, ширина ÷ высота.",
  },
  {
    prop: "color",
    type: "PaletteColor",
    defaultValue: '"gray"',
    required: "Нет",
    description: "Оттенок заливки и иконки фолбэка.",
  },
  {
    prop: "variant",
    type: '"soft" | "solid"',
    defaultValue: '"soft"',
    required: "Нет",
    description:
      "soft — мягкая заливка с иконкой цвета; solid — сам цвет с контрастной иконкой, когда цвет — свойство объекта.",
  },
  {
    prop: "fullWidth",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Ширина контейнера, высота из ratio — обложки карточек и галереи.",
  },
  {
    prop: "ring",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Тонкое внутреннее кольцо по краю — для фото на белом фоне на светлой поверхности.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className, aria-*, data-* корневого div; ref пробрасывается.",
  },
];

const imageApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "src",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Адрес изображения; пока грузится и при ошибке виден Fallback.",
  },
  {
    prop: "alt",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Пусто, если рядом уже есть название объекта.",
  },
  {
    prop: "fit",
    type: '"cover" | "contain"',
    defaultValue: '"cover"',
    required: "Нет",
    description: "cover — обрезает до заполнения; contain — целиком на заливке фолбэка.",
  },
  {
    prop: "…rest",
    type: "React.ImgHTMLAttributes<HTMLImageElement>",
    defaultValue: "—",
    required: "Нет",
    description: "loading, onLoad, onError и прочие атрибуты img; ref пробрасывается.",
  },
];

const fallbackApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Иконка (размер по ярусу) или короткая подпись.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLSpanElement>",
    defaultValue: "—",
    required: "Нет",
    description: "className и атрибуты span.",
  },
];

function Demo({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: React.ReactNode;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <div className="demoBlock">
      <DemoSectionTitle>{title}</DemoSectionTitle>
      <DemoDescription>{description}</DemoDescription>
      <PlaygroundExampleFrame.Root code={code.trim()} previewLayout="stack-center">
        <PlaygroundExampleFrame.Stage>{children}</PlaygroundExampleFrame.Stage>
      </PlaygroundExampleFrame.Root>
    </div>
  );
}

export default function ThumbnailSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Thumbnail</PageContent.Title>
        <PageContent.Description measure="full">
          Превью объекта — товара, транспорта, файла, обложки — с фиксированным соотношением сторон.
          Пока картинка грузится или если её нет, видна цветная заливка с иконкой. Людей показывает
          Avatar.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="В таблице"
            description={
              <>Миниатюра 16:9 рядом с двухстрочной ячейкой: строка таблицы растёт по контенту.</>
            }
            code={inTableSource}
          >
            <InTableExample />
          </Demo>
          <Demo
            title="Соотношения сторон"
            description={
              <>
                <code>ratio</code>: 1:1 · 4:3 · 3:2 · 16:9 · 3:4 при одной высоте.
              </>
            }
            code={ratiosSource}
          >
            <RatiosExample />
          </Demo>
          <Demo
            title="Размеры"
            description={
              <>
                <code>size</code> задаёт высоту 24 · 32 · 40 · 48 · 64. По умолчанию <code>m</code>.
              </>
            }
            code={sizesSource}
          >
            <SizesExample />
          </Demo>
          <Demo
            title="Фолбэк"
            description={<>Иконка, подпись и картинка, которая не загрузилась.</>}
            code={fallbackSource}
          >
            <FallbackExample />
          </Demo>
          <Demo
            title="Обводка"
            description={
              <>
                По умолчанию обводки нет — превью отделяет заливка. <code>ring</code> добавляет
                тонкое внутреннее кольцо для фото на белом фоне, край которых иначе теряется на
                светлой поверхности.
              </>
            }
            code={ringSource}
          >
            <RingExample />
          </Demo>
          <Demo
            title="Обложки в карточках"
            description={
              <>
                <code>fullWidth</code>: ширина карточки, высота из соотношения — у всех карточек
                сетки одинаковая обложка.
              </>
            }
            code={cardGridSource}
          >
            <CardGridExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Thumbnail.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootApiRows} />
            <DemoApiTitle>Thumbnail.Image</DemoApiTitle>
            <PlaygroundApiTable rows={imageApiRows} />
            <DemoApiTitle>Thumbnail.Fallback</DemoApiTitle>
            <PlaygroundApiTable rows={fallbackApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
