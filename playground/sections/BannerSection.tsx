import type * as React from "react";

import BannerDismissExample from "@/components/banner/examples/dismiss";
import dismissSource from "@/components/banner/examples/dismiss.tsx?raw";
import BannerPlacementExample from "@/components/banner/examples/placement";
import pageSource from "@/components/banner/examples/placement.tsx?raw";
import BannerSizesExample from "@/components/banner/examples/sizes";
import sizesSource from "@/components/banner/examples/sizes.tsx?raw";
import BannerVariantsExample from "@/components/banner/examples/variants";
import variantsSource from "@/components/banner/examples/variants.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"soft" | "solid" | "outline"',
    defaultValue: '"soft"',
    required: "Нет",
    description:
      "Мягкая заливка с нейтральным текстом / насыщенная заливка / поверхность с обводкой.",
  },
  {
    prop: "tone",
    type: '"neutral" | "accent" | "info" | "success" | "warning" | "danger"',
    defaultValue: '"info"',
    required: "Нет",
    description: "Семантический цвет.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Высота, отступы и текст по ярусу контролов; кнопка закрытия берёт этот размер, кнопкам действий передайте его явно.",
  },
  {
    prop: "placement",
    type: '"inset" | "page"',
    defaultValue: '"inset"',
    required: "Нет",
    description:
      "`inset` — скруглённый блок в потоке или в карточке; `page` — полоса во всю ширину без скругления, текст по колонке контента страницы.",
  },
  {
    prop: "onDismiss",
    type: "() => void",
    defaultValue: "—",
    required: "Нет",
    description: "Добавляет кнопку закрытия, если нет своего `Banner.CloseButton`.",
  },
  {
    prop: "labels",
    type: "Partial<{ dismiss: string }>",
    defaultValue: '{ dismiss: "Закрыть" }',
    required: "Нет",
    description: "Встроенные строки (`aria-label` кнопки закрытия).",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: 'Например `role="region"` и `aria-label` для важного объявления.',
  },
];

const partsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Banner.Content",
    type: "div",
    defaultValue: "—",
    required: "Да",
    description:
      "Раскладка: иконка на первой строке, заголовок над описанием, действия справа (под текстом, когда узко).",
  },
  {
    prop: "Banner.Icon",
    type: "as?: ElementType",
    defaultValue: '"div"',
    required: "Нет",
    description: "Иконка статуса (передайте `aria-hidden`).",
  },
  {
    prop: "Banner.Title / Banner.Description",
    type: "span",
    defaultValue: "—",
    required: "Нет",
    description: "Заголовок и описание на ступень мельче.",
  },
  {
    prop: "Banner.Actions",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Кнопки и ссылки.",
  },
  {
    prop: "Banner.CloseButton",
    type: "button",
    defaultValue: 'aria-label="Закрыть"',
    required: "Нет",
    description:
      "Своя кнопка закрытия — прямой ребёнок Root; справа сверху, по центру первой строки.",
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
      <PlaygroundExampleFrame.Root code={code.trim()} previewLayout="stack">
        <PlaygroundExampleFrame.Stage>{children}</PlaygroundExampleFrame.Stage>
      </PlaygroundExampleFrame.Root>
    </div>
  );
}

export default function BannerSection() {
  return (
    <PageContent.Section aria-labelledby="banner-heading">
      <PageContent.Header>
        <PageContent.Title id="banner-heading">Banner</PageContent.Title>
        <PageContent.Description measure="full">
          Сообщение для страницы, раздела или карточки: иконка статуса, заголовок и описание,
          действия и закрытие. Всё выровнено влево, текст не шире колонки чтения; без рамок — статус
          передают заливка и иконка. Раскладка подстраивается под ширину самого баннера.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Страница и карточка"
            description={
              <>
                <code>placement="page"</code> — полоса во всю ширину без скругления над страницей;{" "}
                <code>placement="inset"</code> (по умолчанию) — блок в потоке или в карточке. Иконка
                статуса на первой строке, заголовок и описание в колонку, действия справа; уже 36rem
                собственной ширины действия уходят под текст.
              </>
            }
            code={pageSource}
          >
            <BannerPlacementExample />
          </Demo>

          <Demo
            title="Варианты и тона"
            description={
              <>
                <code>soft</code>, <code>solid</code>, <code>outline</code> × <code>info</code>,{" "}
                <code>success</code>, <code>warning</code>, <code>danger</code>, <code>accent</code>
                , <code>neutral</code>.
              </>
            }
            code={variantsSource}
          >
            <BannerVariantsExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code>: высота и текст по ярусу. Кнопка закрытия берёт
                ярус сама, кнопкам действий передайте тот же <code>size</code>.
              </>
            }
            code={sizesSource}
          >
            <BannerSizesExample />
          </Demo>

          <Demo
            title="Закрытие"
            description={
              <>
                <code>onDismiss</code> добавляет кнопку автоматически;{" "}
                <code>Banner.CloseButton</code> — когда нужна своя подпись на русском.
              </>
            }
            code={dismissSource}
          >
            <BannerDismissExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Banner.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootApiRows} />
            <DemoApiTitle>Части</DemoApiTitle>
            <PlaygroundApiTable rows={partsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
