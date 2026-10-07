import { PageContent } from "@/components/page-content/PageContent";
import ControlledExample from "@/components/smart-filter/examples/controlled";
import controlledSource from "@/components/smart-filter/examples/controlled.tsx?raw";
import HttpRequestsExample from "@/components/smart-filter/examples/http-requests";
import httpRequestsSource from "@/components/smart-filter/examples/http-requests.tsx?raw";
import ManyValuesExample from "@/components/smart-filter/examples/many-values";
import manyValuesSource from "@/components/smart-filter/examples/many-values.tsx?raw";
import SizesExample from "@/components/smart-filter/examples/sizes";
import sizesSource from "@/components/smart-filter/examples/sizes.tsx?raw";
import type { PlaygroundApiPropRow } from "../components/PlaygroundApiTable";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootRows: PlaygroundApiPropRow[] = [
  {
    prop: "fields",
    type: "readonly SmartFilterField[]",
    defaultValue: "—",
    required: "Да",
    description:
      "Поля экрана по порядку. Пустой массив — только поиск. Передавайте стабильную ссылку.",
  },
  {
    prop: "value",
    type: "SmartFilterValue",
    defaultValue: "—",
    required: "Нет",
    description: "Controlled-выбор по ключам полей: { include, exclude }.",
  },
  {
    prop: "defaultValue",
    type: "SmartFilterValue",
    defaultValue: "{}",
    required: "Нет",
    description: "Начальный выбор (uncontrolled).",
  },
  {
    prop: "onValueChange",
    type: "(value: SmartFilterValue) => void",
    defaultValue: "—",
    required: "Нет",
    description: "Весь следующий выбор; ключи чужих полей сохраняются.",
  },
  {
    prop: "search",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Controlled-текст поиска.",
  },
  {
    prop: "defaultSearch",
    type: "string",
    defaultValue: '""',
    required: "Нет",
    description: "Начальный текст поиска.",
  },
  {
    prop: "onSearchChange",
    type: "(search: string) => void",
    defaultValue: "—",
    required: "Нет",
    description: "На каждое нажатие; дебаунс — в владельце.",
  },
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description: "Размер кнопки, поиска, тегов и панели.",
  },
  {
    prop: "collapsedLimit",
    type: "number",
    defaultValue: "12",
    required: "Нет",
    description: "Сколько значений поля видно до «Ещё N».",
  },
  {
    prop: "labels",
    type: "Partial<SmartFilterLabels>",
    defaultValue: "русские строки",
    required: "Нет",
    description: "Системные строки.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс корня.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "SmartFilter.Toolbar и SmartFilter.Chips.",
  },
];

const partRows: PlaygroundApiPropRow[] = [
  {
    prop: "className",
    type: "string",
    defaultValue: "—",
    required: "Нет",
    description: "Дополнительный класс.",
  },
];

const fieldRows: PlaygroundApiPropRow[] = [
  {
    prop: "key",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Ключ поля в выборе.",
  },
  {
    prop: "label",
    type: "string",
    defaultValue: "—",
    required: "Да",
    description: "Название поля в панели и чипах.",
  },
  {
    prop: "options",
    type: "SmartFilterOption[]",
    defaultValue: "—",
    required: "Да",
    description: "{ value, label, leading? }; leading — декоративная метка перед подписью.",
  },
  {
    prop: "finite",
    type: "boolean",
    defaultValue: "true",
    required: "Нет",
    description: "Конечный набор: скрыть все значения нельзя. false — открытый набор (сервисы).",
  },
];

function Block({
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

export default function SmartFilterSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>SmartFilter</PageContent.Title>
        <PageContent.Description measure="full">
          Умные фильтры для списков и таблиц: кнопка «Фильтр» и поиск с панелью значений,
          применённые фильтры тегами под ними. Значения — теги: нажатие показывает только это
          значение, «−» по наведению скрывает его. Панель сужается по мере ввода и подчёркивает
          совпадение. Всё собрано из компонентов кита.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Block
            title="Список с фильтрами и поиском"
            description={
              <>
                Основной сценарий: <code>SmartFilter.Toolbar</code> и <code>SmartFilter.Chips</code>{" "}
                над списком, который сужается через <code>matchesSmartFilter</code> и текст поиска.
                Метод и состояние — конечные поля: скрыть все значения сразу нельзя. Скрыть значение
                — «−» по наведению, <code>Alt</code>-клик или <code>Shift</code>+<code>Enter</code>.
              </>
            }
            code={httpRequestsSource}
          >
            <HttpRequestsExample />
          </Block>
          <Block
            title="Много значений и открытый набор"
            description={
              <>
                Двадцать сервисов с точкой статуса (<code>leading</code>) сворачиваются до «Ещё N» (
                <code>collapsedLimit</code>). <code>finite: false</code> разрешает скрыть любые
                значения. Введите «events» в поиск — панель отфильтруется.
              </>
            }
            code={manyValuesSource}
          >
            <ManyValuesExample />
          </Block>
          <Block
            title="Выбор снаружи и готовые списки для запроса"
            description={
              <>
                Controlled-значение меняют кнопки-пресеты, а <code>resolveSmartFilterValues</code>{" "}
                превращает «скрыть» конечного поля в «все, кроме» для запроса.
              </>
            }
            code={controlledSource}
          >
            <ControlledExample />
          </Block>
          <Block
            title="Размеры"
            description={
              <>
                <code>size</code> корня задаёт один размер для кнопки, поиска, тегов и панели.
              </>
            }
            code={sizesSource}
          >
            <SizesExample />
          </Block>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>SmartFilter.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootRows} />
            <DemoApiTitle>SmartFilter.Toolbar · SmartFilter.Chips</DemoApiTitle>
            <PlaygroundApiTable rows={partRows} />
            <DemoApiTitle>SmartFilterField</DemoApiTitle>
            <PlaygroundApiTable rows={fieldRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
