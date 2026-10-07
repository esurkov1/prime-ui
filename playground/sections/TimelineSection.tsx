import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import TimelineActivityFeedExample from "@/components/timeline/examples/activity-feed";
import activityFeedSource from "@/components/timeline/examples/activity-feed.tsx?raw";
import TimelineColorsAndTonesExample from "@/components/timeline/examples/colors-and-tones";
import colorsAndTonesSource from "@/components/timeline/examples/colors-and-tones.tsx?raw";
import TimelineHoverHighlightExample from "@/components/timeline/examples/hover-highlight";
import hoverHighlightSource from "@/components/timeline/examples/hover-highlight.tsx?raw";
import TimelineInCardExample from "@/components/timeline/examples/in-card";
import inCardSource from "@/components/timeline/examples/in-card.tsx?raw";
import TimelineNarrowExample from "@/components/timeline/examples/narrow";
import narrowSource from "@/components/timeline/examples/narrow.tsx?raw";
import TimelineSelectableExample from "@/components/timeline/examples/selectable";
import selectableSource from "@/components/timeline/examples/selectable.tsx?raw";
import TimelineServiceHistoryExample from "@/components/timeline/examples/service-history";
import serviceHistorySource from "@/components/timeline/examples/service-history.tsx?raw";
import TimelineSizesExample from "@/components/timeline/examples/sizes";
import sizesSource from "@/components/timeline/examples/sizes.tsx?raw";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import type { PlaygroundPreviewSurface } from "../components/PlaygroundPreviewTheme";

const rootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Ярус текста, точки и ритма строк: 40 · 52 · 64 · 68 · 76.",
  },
  {
    prop: "highlight",
    type: '"selected" | "hover"',
    defaultValue: '"selected"',
    required: "Нет",
    description:
      "Кто получает выделение (подложка, акцентные заголовок и точка): строка `active` или строка под курсором / в фокусе.",
  },
  {
    prop: "className / …div",
    type: "HTMLAttributes",
    defaultValue: "—",
    required: "Нет",
    description: "Корень — size-контейнер; ниже 20rem сумма уходит под мета-строку.",
  },
];

const partsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "Timeline.Group",
    type: "label?, …ol",
    defaultValue: "—",
    required: "Да",
    description: "`<ol>` с заголовком группы (title-s); заголовок подписывает список.",
  },
  {
    prop: "Timeline.Item",
    type: "color?, tone?, active?, onClick?, href?, asChild?",
    defaultValue: 'color="blue"',
    required: "Да",
    description:
      "Строка `<li>`. `color` — палитра точки (приглушённо), `tone` — статус (в полную силу). `active` — подложка, акцентный заголовок, `data-state`. С `onClick` — кнопка, с `href` — ссылка, `asChild` — свой элемент.",
  },
  {
    prop: "Timeline.Title",
    type: "children",
    defaultValue: "—",
    required: "Да",
    description: "Первая строка: body-m medium, переносится.",
  },
  {
    prop: "Timeline.Meta · MetaPrimary",
    type: "children",
    defaultValue: "—",
    required: "Нет",
    description:
      "Вторая строка body-s, `text-muted`, tabular-nums. Дату выделяет `MetaPrimary` или `<strong>`.",
  },
  {
    prop: "Timeline.Value",
    type: "tone?",
    defaultValue: '"neutral"',
    required: "Нет",
    description: "Сумма справа, по центру строки, medium, tabular-nums.",
  },
  {
    prop: "Timeline.ValueMeta",
    type: "children",
    defaultValue: "—",
    required: "Нет",
    description: "Вторая строка внутри Value (категория): body-s, `text-muted`, справа.",
  },
  {
    prop: "Timeline.Gap",
    type: "tone?, trailing?, children",
    defaultValue: 'tone="neutral"',
    required: "Нет",
    description:
      "Интервал между событиями (`<li>`): пунктир, полая точка, приглушённая подпись; `trailing` — подпись справа («сейчас»). `tone` красит точку и текст.",
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

export default function TimelineSection() {
  return (
    <PageContent.Section aria-labelledby="timeline-heading">
      <PageContent.Header>
        <PageContent.Title id="timeline-heading">Timeline</PageContent.Title>
        <PageContent.Description measure="full">
          Лента событий: точки на тонкой линии, заголовок и дата события, сумма справа. Группы с
          подписью, выделенная строка, кликабельные строки и ссылки. Для шагов процесса — Stepper.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Лента операций"
            description={
              <>
                Группа «Недавно», линия соединяет центры первой и последней точки. Строка{" "}
                <code>active</code> — подложка <code>radius-l</code>, акцентные заголовок и точка.
              </>
            }
            code={activityFeedSource}
          >
            <TimelineActivityFeedExample />
          </Demo>

          <Demo
            title="История работ"
            description={
              <>
                <code>Timeline.Gap</code> — интервал между событиями: ниже строки, пунктир вместо
                линии, полая точка и приглушённая подпись, справа — <code>trailing</code>.{" "}
                <code>tone="warning"</code> красит точку и текст. Вторая строка суммы —{" "}
                <code>Timeline.ValueMeta</code>.
              </>
            }
            code={serviceHistorySource}
          >
            <TimelineServiceHistoryExample />
          </Demo>

          <Demo
            title="Выбор строки"
            description={
              <>
                С <code>onClick</code> строка — кнопка: одна остановка Tab, hover{" "}
                <code>fill-subtle</code>, кольцо фокуса внутри. <code>tone</code> красит точку и
                сумму.
              </>
            }
            code={selectableSource}
          >
            <TimelineSelectableExample />
          </Demo>

          <Demo
            title="Выделение при наведении"
            description={
              <>
                <code>highlight="hover"</code> — без постоянного выбора: подложку, акцентные
                заголовок и точку получает строка под курсором или в фокусе с клавиатуры и плавно
                теряет их при уходе. По умолчанию <code>highlight="selected"</code> — выделение у{" "}
                <code>active</code>.
              </>
            }
            code={hoverHighlightSource}
          >
            <TimelineHoverHighlightExample />
          </Demo>

          <Demo
            title="В карточке"
            description={
              <>
                Лента внутри <code>Card.Body</code> — отступы задаёт карточка. Группы: заголовок →
                первая строка 8, между группами 16 (28 до текста); <code>color</code> задаёт оттенок
                точки.
              </>
            }
            code={inCardSource}
            surface="canvas"
          >
            <TimelineInCardExample />
          </Demo>

          <Demo
            title="Цвета и статусы"
            description={
              <>
                <code>color</code> — декоративный оттенок точки (приглушённо), для категорий.{" "}
                <code>tone</code> — статус в полную силу: у <code>Item</code> красит точку, у{" "}
                <code>Value</code> — сумму, у <code>Gap</code> — полую точку и подпись.
              </>
            }
            code={colorsAndTonesSource}
          >
            <TimelineColorsAndTonesExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code>: высота строки 40 · 52 · 64 · 68 · 76.
              </>
            }
            code={sizesSource}
          >
            <TimelineSizesExample />
          </Demo>

          <Demo
            title="Узкая ширина"
            description={
              <>
                На 375px заголовок переносится, сумма остаётся справа; уже 20rem сумма уходит под
                дату.
              </>
            }
            code={narrowSource}
          >
            <TimelineNarrowExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Timeline.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootApiRows} />
            <DemoApiTitle>Части</DemoApiTitle>
            <PlaygroundApiTable rows={partsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
