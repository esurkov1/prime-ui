import type * as React from "react";

import { PageContent } from "@/components/page-content/PageContent";
import SwitchControlledExample from "@/components/switch/examples/controlled";
import controlledSource from "@/components/switch/examples/controlled.tsx?raw";
import SwitchInFormExample from "@/components/switch/examples/in-form";
import inFormSource from "@/components/switch/examples/in-form.tsx?raw";
import SwitchNotificationSettingsExample from "@/components/switch/examples/notification-settings";
import notificationSettingsSource from "@/components/switch/examples/notification-settings.tsx?raw";
import SwitchOnOffExample from "@/components/switch/examples/on-off";
import onOffSource from "@/components/switch/examples/on-off.tsx?raw";
import SwitchSettingsRowExample from "@/components/switch/examples/settings-row";
import settingsRowSource from "@/components/switch/examples/settings-row.tsx?raw";
import SwitchSizesExample from "@/components/switch/examples/sizes";
import sizesSource from "@/components/switch/examples/sizes.tsx?raw";
import SwitchStatesExample from "@/components/switch/examples/states";
import statesSource from "@/components/switch/examples/states.tsx?raw";
import SwitchValidationExample from "@/components/switch/examples/validation";
import validationSource from "@/components/switch/examples/validation.tsx?raw";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const switchRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус: дорожка --prime-switch-<tier>-{width,height} (xs 24×16 … xl 44×24), бегунок и типографика подписи.",
  },
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Стиль ошибки без текста; смонтированный Switch.Error включает его сам.",
  },
  {
    prop: "fullWidth",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Растянуть на ширину контейнера; по умолчанию ширина по содержимому.",
  },
  {
    prop: "checked",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое состояние; вместе с onCheckedChange.",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Начальное состояние в неконтролируемом режиме.",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Вызывается при переключении (клик, Space).",
  },
  {
    prop: "readOnly",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Состояние видно, но не меняется; без hover, aria-readonly на input.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Отключён: выкл. — fill-muted, вкл. — accent-soft, бегунок без тени.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Класс корня (data-size, data-state, data-invalid, data-disabled, data-full-width).",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "useId()",
    required: "Нет",
    description: "id нативного input; от него строятся id подсказки и ошибки.",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительные описания; объединяется с id смонтированных Hint и Error.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Switch.Label, Switch.Hint, Switch.Error.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "checked" | "defaultChecked" | "onChange" | "children">',
    defaultValue: "—",
    required: "Нет",
    description:
      "name, value, required, aria-label, aria-labelledby и прочее уходят на input role=switch; ref — тоже на input.",
  },
];

const switchLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Текст справа от дорожки. Без children рендерится только дорожка — тогда задайте aria-label на Root.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс строки label (дорожка + текст).",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" | "size">',
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты label; htmlFor и size задаются из контекста.",
  },
];

const switchHintApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description:
      "Текст под колонкой подписи; Hint и Error автоматически попадают в aria-describedby.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты абзаца; id фиксирован для связи с aria-describedby.",
  },
];

type Demo = {
  title: string;
  description: React.ReactNode;
  code: string;
  preview: React.ReactNode;
};

const demos: Demo[] = [
  {
    title: "Размеры",
    description: (
      <>
        <code>xs</code>, <code>s</code>, <code>m</code>, <code>l</code>, <code>xl</code> в одном
        ряду. Дорожка центрируется по первой строке подписи, текст берёт кегль яруса.
      </>
    ),
    code: sizesSource,
    preview: <SwitchSizesExample />,
  },
  {
    title: "Ошибка",
    description: (
      <>
        Обычный и ошибка. <code>Switch.Error</code> под текстом сам включает ошибку и{" "}
        <code>aria-invalid</code>; <code>invalid</code> даёт стиль без текста.
      </>
    ),
    code: validationSource,
    preview: <SwitchValidationExample />,
  },
  {
    title: "Состояния",
    description: (
      <>
        Выключен, включён, <code>disabled</code> в обоих положениях, <code>readOnly</code> и ошибка.
        Наведите курсор — дорожка темнеет; Tab — кольцо фокуса вокруг дорожки, Space переключает.
      </>
    ),
    code: statesSource,
    preview: <SwitchStatesExample />,
  },
  {
    title: "Поверхности",
    description: (
      <>
        Выключенная дорожка <code>fill-strong</code> и включённая <code>accent</code> на холсте, в
        карточке, во всплывающем слое и на акцентной подложке.
      </>
    ),
    code: onOffSource,
    preview: (
      <SurfaceGallery className="examplePreviewBleed">
        <SwitchOnOffExample />
      </SurfaceGallery>
    ),
  },
  {
    title: "Контролируемый режим",
    description: (
      <>
        <code>checked</code> и <code>onCheckedChange</code> у родителя — подсказка меняется вместе с
        состоянием.
      </>
    ),
    code: controlledSource,
    preview: <SwitchControlledExample />,
  },
  {
    title: "В форме",
    description: (
      <>
        <code>name</code> отправляет «on» в FormData, <code>required</code> проверяет браузер.
        Переключатель без текста получает имя через <code>aria-label</code>.
      </>
    ),
    code: inFormSource,
    preview: <SwitchInFormExample />,
  },
  {
    title: "Строка настроек",
    description: (
      <>
        Текст слева, дорожка справа: <code>Switch.Label</code> без детей, имя и описание — через{" "}
        <code>aria-labelledby</code> и <code>aria-describedby</code>.
      </>
    ),
    code: settingsRowSource,
    preview: <SwitchSettingsRowExample />,
  },
  {
    title: "Композиция",
    description: (
      <>
        Карточка уведомлений размера <code>m</code>: главный переключатель отключает остальные,
        недоступный канал объясняет причину в подсказке.
      </>
    ),
    code: notificationSettingsSource,
    preview: <SwitchNotificationSettingsExample />,
  },
];

export default function SwitchSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Switch</PageContent.Title>
        <PageContent.Description measure="full">
          Переключатель для настройки, которая применяется сразу: уведомления, флаги функций,
          предпочтения. Нативный{" "}
          <code>input type=&quot;checkbox&quot; role=&quot;switch&quot;</code> с дорожкой; раскладка
          как у Checkbox — дорожка слева, текст и подсказка справа. Если значение вступает в силу
          только после отправки формы, лучше подойдёт Checkbox.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          {demos.map((demo) => (
            <div key={demo.title} className="demoBlock">
              <DemoSectionTitle>{demo.title}</DemoSectionTitle>
              <DemoDescription>{demo.description}</DemoDescription>
              <PlaygroundExampleFrame.Root code={demo.code.trim()} previewLayout="stack">
                <PlaygroundExampleFrame.Stage>{demo.preview}</PlaygroundExampleFrame.Stage>
              </PlaygroundExampleFrame.Root>
            </div>
          ))}

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Switch.Root</DemoApiTitle>
            <DemoDescription>
              Контекст поля: состояние, ошибки, id подсказок. Сам input рендерит{" "}
              <code>Switch.Label</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={switchRootApiRows} />
            <DemoApiTitle>Switch.Label</DemoApiTitle>
            <DemoDescription>
              <code>label</code> с визуально скрытым input и дорожкой; текст — в children.
            </DemoDescription>
            <PlaygroundApiTable rows={switchLabelApiRows} />
            <DemoApiTitle>Switch.Hint · Switch.Error</DemoApiTitle>
            <DemoDescription>
              Подсказка и ошибка под колонкой текста; Error дополнительно включает стиль ошибки.
            </DemoDescription>
            <PlaygroundApiTable rows={switchHintApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
