import type * as React from "react";

import NotificationFeaturesExample from "@/components/notification/examples/features";
import featuresSource from "@/components/notification/examples/features.tsx?raw";
import NotificationLiveExample from "@/components/notification/examples/live";
import liveSource from "@/components/notification/examples/live.tsx?raw";
import NotificationSaveFormExample from "@/components/notification/examples/save-form";
import saveFormSource from "@/components/notification/examples/save-form.tsx?raw";
import NotificationSizesExample from "@/components/notification/examples/sizes";
import sizesSource from "@/components/notification/examples/sizes.tsx?raw";
import NotificationTonesExample from "@/components/notification/examples/tones";
import tonesSource from "@/components/notification/examples/tones.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const providerApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "position",
    type: "NotificationPosition",
    defaultValue: '"top-right"',
    required: "Нет",
    description: "Позиция по умолчанию для `notify`.",
  },
  {
    prop: "max",
    type: "number",
    defaultValue: "5",
    required: "Нет",
    description: "Максимум карточек в одной стопке (позиция + тон).",
  },
  {
    prop: "labels",
    type: "{ close?: string; regions?: Partial<Record<NotificationPosition, string>> }",
    defaultValue: "русские строки",
    required: "Нет",
    description: "`aria-label` кнопки закрытия и названия регионов тостов.",
  },
];

const optionsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "tone",
    type: '"info" | "success" | "warning" | "danger"',
    defaultValue: '"info"',
    required: "Нет",
    description: "Смысл, иконка и группировка в стопку.",
  },
  {
    prop: "title",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Заголовок.",
  },
  {
    prop: "description",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Пояснение под заголовком.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Отступы, иконка и текст карточки.",
  },
  {
    prop: "position",
    type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
    defaultValue: "из провайдера",
    required: "Нет",
    description: "Угол или край экрана.",
  },
  {
    prop: "duration / persistent",
    type: "number / boolean",
    defaultValue: "5000 / false",
    required: "Нет",
    description: "Таймер закрытия; `persistent` — без таймера и линии отсчёта.",
  },
  {
    prop: "icon / badge",
    type: "ReactNode / string | number",
    defaultValue: "—",
    required: "Нет",
    description: "Своя иконка и счётчик рядом с заголовком.",
  },
  {
    prop: "action",
    type: "{ label: string; onClick: () => void }",
    defaultValue: "—",
    required: "Нет",
    description: "Вторичная кнопка в карточке.",
  },
  {
    prop: "closable",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Кнопка закрытия.",
  },
];

const hooksApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "useNotifications()",
    type: "{ items, notify, dismiss, dismissAll }",
    defaultValue: "—",
    required: "—",
    description: "`notify(options)` возвращает id; `items` — активные записи.",
  },
  {
    prop: "NotificationCard",
    type: "item, paused, onDismiss, className?, stackDepth?, stackExpanded?",
    defaultValue: "—",
    required: "—",
    description: "Статичная карточка для макетов и документации.",
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

export default function NotificationSection() {
  return (
    <PageContent.Section aria-labelledby="notification-heading">
      <PageContent.Header>
        <PageContent.Title id="notification-heading">Notification</PageContent.Title>
        <PageContent.Description measure="full">
          Всплывающие уведомления: <code>NotificationProvider</code> в корне приложения и{" "}
          <code>notify()</code> из любого экрана. Карточка — приподнятая поверхность без рамки,
          одинаковые уведомления складываются в стопку.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Сохранение формы"
            description={
              <>
                Кнопка в состоянии <code>loading</code>, затем тост успеха или ошибки с действием
                «Повторить».
              </>
            }
            code={saveFormSource}
          >
            <NotificationSaveFormExample />
          </Demo>

          <Demo
            title="Живые тосты"
            description={
              <>
                <code>notify()</code> с выбором позиции. Наведение на стопку раскрывает её и ставит
                таймеры на паузу; <code>persistent</code> отключает автозакрытие.
              </>
            }
            code={liveSource}
          >
            <NotificationLiveExample />
          </Demo>

          <Demo
            title="Тона"
            description={
              <>
                <code>success</code>, <code>info</code>, <code>warning</code>, <code>danger</code> —
                статичные <code>NotificationCard</code> для документации.
              </>
            }
            code={tonesSource}
          >
            <NotificationTonesExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>xs · s · m · l · xl</code> — отступы, иконка и текст.
              </>
            }
            code={sizesSource}
          >
            <NotificationSizesExample />
          </Demo>

          <Demo
            title="Иконка, счётчик, действие"
            description={
              <>
                <code>icon</code>, <code>badge</code>, <code>action</code> и короткое уведомление
                без описания и крестика.
              </>
            }
            code={featuresSource}
          >
            <NotificationFeaturesExample />
          </Demo>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>NotificationProvider</DemoApiTitle>
            <PlaygroundApiTable rows={providerApiRows} />
            <DemoApiTitle>notify(options)</DemoApiTitle>
            <PlaygroundApiTable rows={optionsApiRows} />
            <DemoApiTitle>Хуки и карточка</DemoApiTitle>
            <PlaygroundApiTable rows={hooksApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
