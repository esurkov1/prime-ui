import CheckboxHintErrorExample from "@/components/checkbox/examples/hint-error";
import hintErrorSource from "@/components/checkbox/examples/hint-error.tsx?raw";
import CheckboxSelectAllExample from "@/components/checkbox/examples/select-all";
import selectAllSource from "@/components/checkbox/examples/select-all.tsx?raw";
import CheckboxSettingsCardExample from "@/components/checkbox/examples/settings-card";
import settingsCardSource from "@/components/checkbox/examples/settings-card.tsx?raw";
import CheckboxSizesExample from "@/components/checkbox/examples/sizes";
import sizesSource from "@/components/checkbox/examples/sizes.tsx?raw";
import CheckboxStatesExample from "@/components/checkbox/examples/states";
import statesSource from "@/components/checkbox/examples/states.tsx?raw";
import CheckboxWithoutLabelExample from "@/components/checkbox/examples/without-label";
import withoutLabelSource from "@/components/checkbox/examples/without-label.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const checkboxRootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "invalid",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Красное кольцо у неотмеченного квадрата и aria-invalid без текста ошибки; Checkbox.Error включает то же самое.",
  },
  {
    prop: "fullWidth",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Растянуть на ширину контейнера; по умолчанию ширина по содержимому.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус: квадрат 14 · 16 · 18 · 20 · 24 px, зазор до текста и кегль подписи из токенов control.",
  },
  {
    prop: "indeterminate",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description:
      "Промежуточное состояние (частичный выбор в группе); синхронизируется с input.indeterminate.",
  },
  {
    prop: "id",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "id нативного input; при отсутствии генерируется стабильный id для связи с Checkbox.Label.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на обёртке поля (div.field).",
  },
  {
    prop: "checked",
    type: "boolean",
    defaultValue: "—",
    required: "Нет",
    description: "Контролируемое значение «отмечен»; вместе с onCheckedChange.",
  },
  {
    prop: "defaultChecked",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Начальное значение в неконтролируемом режиме.",
  },
  {
    prop: "onCheckedChange",
    type: "(checked: boolean) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Новое значение после клика или пробела.",
  },
  {
    prop: "disabled",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Блокирует input; квадрат fill-muted, подпись и подсказка text-disabled.",
  },
  {
    prop: "aria-describedby",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description:
      "Дополнительные описания; объединяется с id подсказки и сообщения об ошибке из слотов.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description: "Обычно Checkbox.Label, Checkbox.Hint и Checkbox.Error внутри корня.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "checked" | "defaultChecked" | "onChange" | "children">',
    defaultValue: "—",
    required: "Нет",
    description:
      "name, value, required, readOnly, autoFocus, form и прочие атрибуты пробрасываются на скрытый input.",
  },
];

const checkboxLabelApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Нет",
    description:
      "Текст подписи; пустой узел оставляет только квадрат — тогда задайте aria-label на Checkbox.Root.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Класс на label (строка: квадрат + текст).",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" | "size">',
    defaultValue: "—",
    required: "Нет",
    description: "Атрибуты label, кроме htmlFor и size (задаются из контекста и размера поля).",
  },
];

const checkboxHintApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст подсказки под подписью, с отступом под колонку текста.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корне Hint.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты абзаца; id фиксирован для связи с aria-describedby на input.",
  },
];

const checkboxErrorApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Текст ошибки; монтирование помечает поле как invalid (aria-invalid и стиль).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс на корне сообщения.",
  },
  {
    prop: "…rest",
    type: 'Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">',
    defaultValue: "—",
    required: "Нет",
    description: "Прочие атрибуты абзаца; id фиксирован для связи с aria-describedby на input.",
  },
];

export default function CheckboxSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Checkbox</PageContent.Title>
        <PageContent.Description measure="full">
          Независимый выбор «да / нет», который отправляется вместе с формой: согласия, наборы
          опций, множественный выбор в списках. Для взаимоисключающих вариантов — Radio, для
          мгновенно применяемой настройки — Switch.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> ·{" "}
              <code>xl</code> — квадрат 14–24 px, зазор и кегль подписи берутся из того же яруса,
              что у полей и кнопок. По умолчанию <code>m</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <CheckboxSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Не отмечен, отмечен, <code>indeterminate</code>, <code>invalid</code> и{" "}
              <code>disabled</code> — на холсте, в карточке и на всплывающей панели. Наведите
              курсор, чтобы увидеть hover, или перейдите по Tab — кольцо фокуса появляется вокруг
              квадрата; пробел переключает флажок.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery surfaces={["canvas", "surface", "raised"]}>
                  <CheckboxStatesExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Описание и ошибка</DemoSectionTitle>
            <DemoDescription>
              <code>Checkbox.Hint</code> и <code>Checkbox.Error</code> выравниваются по колонке
              текста и попадают в <code>aria-describedby</code>. Смонтированный{" "}
              <code>Checkbox.Error</code> сам переводит поле в invalid — <code>invalid</code> на
              корне не нужен.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={hintErrorSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <CheckboxHintErrorExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>«Выбрать все»</DemoSectionTitle>
            <DemoDescription>
              Контролируемый режим: <code>checked</code> + <code>onCheckedChange</code>.
              Родительский флажок получает <code>indeterminate</code>, пока выбрана только часть
              списка.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={selectAllSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <CheckboxSelectAllExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: карточка настроек</DemoSectionTitle>
            <DemoDescription>
              Группа в <code>fieldset</code> с общим флажком и вложенными пунктами, недоступная
              опция с объяснением в подсказке и отдельная настройка с описанием. Размер{" "}
              <code>m</code>, отступ вложенных пунктов равен ширине квадрата и зазора.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={settingsCardSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <CheckboxSettingsCardExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Без видимой подписи</DemoSectionTitle>
            <DemoDescription>
              В строках таблицы оставьте пустой <code>Checkbox.Label</code> и задайте{" "}
              <code>aria-label</code> на <code>Checkbox.Root</code>; <code>name</code> и{" "}
              <code>value</code> уходят в форму как у обычного input.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={withoutLabelSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <CheckboxWithoutLabelExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>Checkbox.Root</DemoApiTitle>
            <DemoDescription>
              Обёртка поля и провайдер контекста. Ref и все input-атрибуты уходят на скрытый
              нативный <code>input type=&quot;checkbox&quot;</code>. На корне —{" "}
              <code>data-size</code>, <code>data-state</code> (
              <code>checked | unchecked | indeterminate</code>), <code>data-invalid</code>,{" "}
              <code>data-disabled</code>, <code>data-full-width</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={checkboxRootApiRows} />
            <DemoApiTitle>Checkbox.Label</DemoApiTitle>
            <DemoDescription>
              Кликабельная строка «квадрат + текст»: рендерит input и связывает его через{" "}
              <code>htmlFor</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={checkboxLabelApiRows} />
            <DemoApiTitle>Checkbox.Hint</DemoApiTitle>
            <DemoDescription>
              Описание под текстом (<code>text-muted</code>), добавляется в{" "}
              <code>aria-describedby</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={checkboxHintApiRows} />
            <DemoApiTitle>Checkbox.Error</DemoApiTitle>
            <DemoDescription>
              Текст ошибки (<code>danger-text</code>); пока смонтирован, поле invalid.
            </DemoDescription>
            <PlaygroundApiTable rows={checkboxErrorApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
