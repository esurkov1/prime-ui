import type * as React from "react";

import CardContentExample from "@/components/card/examples/content";
import contentSource from "@/components/card/examples/content.tsx?raw";
import CardFlatExample from "@/components/card/examples/flat";
import flatSource from "@/components/card/examples/flat.tsx?raw";
import CardMetricsExample from "@/components/card/examples/metrics";
import metricsSource from "@/components/card/examples/metrics.tsx?raw";
import CardMiniMediaExample from "@/components/card/examples/mini-media";
import miniMediaSource from "@/components/card/examples/mini-media.tsx?raw";
import CardPanelChartExample from "@/components/card/examples/panel-chart";
import panelChartSource from "@/components/card/examples/panel-chart.tsx?raw";
import CardResponsiveExample from "@/components/card/examples/responsive";
import responsiveSource from "@/components/card/examples/responsive.tsx?raw";
import CardSettingsExample from "@/components/card/examples/settings";
import settingsSource from "@/components/card/examples/settings.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import type { PlaygroundPreviewSurface } from "../components/PlaygroundPreviewTheme";

const cardRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "variant",
    type: '"mini" | "mini-media" | "metric" | "stat-trend" | "split" | "panel" | "cta" | "list" | "cover"',
    defaultValue: '"panel"',
    required: "Нет",
    description:
      "Макет и роль значения: mini — title-l, metric — heading-m, stat-trend — heading-l (display-s на широкой карточке).",
  },
  {
    prop: "flat",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Без тени `shadow-raised`: плоская белая поверхность. Рамки у карточки нет в любом случае.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты корневого div (id, role, aria-*, data-*, className).",
  },
];

const slotApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "IconBox",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Плитка 40px `accent-soft` под иконку (mini, mini-media, split).",
  },
  {
    prop: "Stack / Label / Value",
    type: "div / span / span",
    defaultValue: "—",
    required: "Нет",
    description: "Подпись и значение (`tabular-nums`).",
  },
  {
    prop: "HeaderRow / Lead / Description",
    type: "div / div / p",
    defaultValue: "—",
    required: "Нет",
    description: "Верхний ряд `metric` и строка пояснения.",
  },
  {
    prop: "Delta",
    type: "span, tone: neutral | success | warning | danger",
    defaultValue: 'tone="neutral"',
    required: "Нет",
    description: "Дельта; tone по смыслу: neutral (text-secondary) / success / warning / danger.",
  },
  {
    prop: "Media",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Нижний слот mini-media: спарклайн, ProgressBar.",
  },
  {
    prop: "SectionHeader / SectionTitle / SectionTrailing",
    type: "div / h2 | h3 | h4 / div",
    defaultValue: "—",
    required: "Нет",
    description: "Заголовок `panel` с действиями справа.",
  },
  {
    prop: "SectionTitle as",
    type: '"h2" | "h3" | "h4"',
    defaultValue: '"h3"',
    required: "Нет",
    description: "Уровень заголовка панели по структуре страницы; вид не меняется.",
  },
  {
    prop: "Body / Chart",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Текст и поля с отступами / график от края до края.",
  },
  {
    prop: "Title / CtaBody / Actions",
    type: "h2 | h3 | h4 / div / div",
    defaultValue: "—",
    required: "Нет",
    description: "CTA и cover.",
  },
  {
    prop: "Title as",
    type: '"h2" | "h3" | "h4"',
    defaultValue: '"h3"',
    required: "Нет",
    description: "Уровень заголовка карточки по структуре страницы; вид не меняется.",
  },
  {
    prop: "ListHeader / List / ListItem",
    type: "div / ul / li",
    defaultValue: "—",
    required: "Нет",
    description: "Список событий с тонкими разделителями.",
  },
  {
    prop: "Split / SplitCell",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Две метрики; складываются уже 22rem.",
  },
  {
    prop: "Cover",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Медиа сверху (cover).",
  },
];

function Demo({
  title,
  description,
  code,
  surface,
  children,
}: {
  title: string;
  description: React.ReactNode;
  code: string;
  surface?: PlaygroundPreviewSurface;
  children: React.ReactNode;
}) {
  return (
    <div className="demoBlock">
      <DemoSectionTitle>{title}</DemoSectionTitle>
      <DemoDescription>{description}</DemoDescription>
      <PlaygroundExampleFrame.Root code={code.trim()} previewLayout="stack" surface={surface}>
        <PlaygroundExampleFrame.Stage>{children}</PlaygroundExampleFrame.Stage>
      </PlaygroundExampleFrame.Root>
    </div>
  );
}

export default function CardSection() {
  return (
    <PageContent.Section aria-labelledby="card-heading">
      <PageContent.Header>
        <PageContent.Title id="card-heading">Card</PageContent.Title>
        <PageContent.Description measure="full">
          Белая поверхность на сером холсте: без рамки, глубина — заливкой и лёгкой тенью. Варианты
          для метрик, графиков, списков и CTA; внутренняя раскладка подстраивается под ширину самой
          карточки (container queries).
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Метрики"
            description={
              <>
                <code>mini</code>, <code>metric</code> и <code>stat-trend</code>: у каждого своя
                роль значения (title-l, heading-m, heading-l). <code>Delta</code> окрашивается по{" "}
                <code>tone</code> — хорошо или плохо, а не знак изменения.
              </>
            }
            code={metricsSource}
            surface="canvas"
          >
            <CardMetricsExample />
          </Demo>

          <Demo
            title="Метрика с медиа"
            description={
              <>
                <code>mini-media</code> добавляет нижний слот <code>Media</code>. Высоту спарклайна
                задаёт CSS, SVG только растягивается по ширине.
              </>
            }
            code={miniMediaSource}
            surface="canvas"
          >
            <CardMiniMediaExample />
          </Demo>

          <Demo
            title="Адаптация по ширине карточки"
            description={
              <>
                <code>split</code> складывает ячейки уже 22rem; значение <code>stat-trend</code>{" "}
                уменьшается до heading-m уже 20rem и растёт до display-s шире 36rem.
              </>
            }
            code={responsiveSource}
            surface="canvas"
          >
            <CardResponsiveExample />
          </Demo>

          <Demo
            title="Панель с графиком"
            description={
              <>
                <code>panel</code>: <code>SectionHeader</code> с переключателем периода, текст в{" "}
                <code>Body</code> и график от края до края в <code>Chart</code>.
              </>
            }
            code={panelChartSource}
            surface="canvas"
          >
            <CardPanelChartExample />
          </Demo>

          <Demo
            title="CTA, список, обложка"
            description={
              <>
                <code>cta</code>, <code>list</code> и <code>cover</code>. Еле заметные линии
                отделяют шапку списка, его пункты и подвал с действиями.
              </>
            }
            code={contentSource}
            surface="canvas"
          >
            <CardContentExample />
          </Demo>

          <Demo
            title="Карточка настроек"
            description={
              <>
                Поля внутри карточки получают фон <code>field-bg-surface</code> — они остаются
                различимыми на белом. Отступ поле → поле 20px, действия справа.
              </>
            }
            code={settingsSource}
            surface="canvas"
          >
            <CardSettingsExample />
          </Demo>

          <Demo
            title="Тень и flat"
            description={
              <>
                По умолчанию — <code>shadow-raised</code>; <code>flat</code> убирает тень для
                плотных сеток. Рамки нет в обоих случаях.
              </>
            }
            code={flatSource}
            surface="canvas"
          >
            <CardFlatExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Card.Root</DemoApiTitle>
            <PlaygroundApiTable rows={cardRootApiRows} />
            <DemoApiTitle>Слоты</DemoApiTitle>
            <PlaygroundApiTable rows={slotApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
