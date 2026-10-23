/**
 * Every part that renders DOM takes `ref` (CLAUDE.md §1), and its `api.ts` says where it lands.
 *
 * Compile time (tsc runs this file): `part-refs.generated.ts` holds the ref line of every
 * `api.ts` part (`bun run docs:build`). Each entry must be an exported part whose props take a
 * ref of that element and its native attributes (`className`, `style`); every exported part must
 * have an entry, and a part without `ref` is either `null` there (its `api.ts` says "No DOM" /
 * "No ref") or in `NO_REF` below with the reason.
 *
 * Runtime: a part that merges the consumer's ref with its own or points it at another element is
 * rendered in `CASES`, and the ref and a native attribute must reach the same element. Every part
 * that calls `useMergedRefs(…, ref)` or hands `ref` to an element without its rest props needs a
 * row (the completeness scan below).
 */
import fs from "node:fs";
import path from "node:path";

import { render } from "@testing-library/react";
import type * as React from "react";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import type * as colorPickerEntry from "@/color-picker";
import {
  Accordion,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  Card,
  Carousel,
  ChartFrame,
  Chat,
  ChatList,
  Checkbox,
  CommandMenu,
  Composer,
  DataTable,
  Datepicker,
  Dnd,
  Drawer,
  Dropdown,
  EmptyPage,
  ExampleFrame,
  FieldList,
  FileUpload,
  Gallery,
  Gantt,
  Hint,
  Input,
  Kanban,
  List,
  MediaViewer,
  Message,
  Modal,
  ScrollContainer,
  Select,
  Sheet,
  SmartFilter,
  Tabs,
  Textarea,
  Timeline,
  VideoNote,
  VoicePlayer,
} from "@/components";
import type * as mainEntry from "@/index";
import { AppShell, Page, Sidebar } from "@/layout";

import { root, walk } from "./contract-utils";
import type { PART_REFS } from "./part-refs.generated";

type Kit = typeof mainEntry & typeof colorPickerEntry;
type Refs = typeof PART_REFS;

type PropsOf<C> = C extends React.JSXElementConstructor<infer P> ? P : never;

/** `Button.Root` → the exported `Button.Root`; `Spinner` → `Spinner`. */
type PartOf<N> = N extends `${infer A}.${infer B}`
  ? A extends keyof Kit
    ? B extends keyof Kit[A]
      ? Kit[A][B]
      : never
    : never
  : N extends keyof Kit
    ? Kit[N]
    : never;

/** `HTMLDivElement` → the DOM interface. */
type ElementOf<N> = N extends keyof typeof globalThis
  ? (typeof globalThis)[N] extends { prototype: infer E }
    ? E
    : never
  : never;

type Component = React.JSXElementConstructor<never>;
/** A component name: PascalCase, not a constant (`COLOR_PRESETS`). */
type PascalName<K> = K extends string
  ? K extends Uppercase<K>
    ? never
    : K extends Capitalize<K>
      ? K
      : never
  : never;

/** Every exported part: a component export, or a component member of an exported namespace. */
type ExportedParts = {
  [K in PascalName<keyof Kit>]: Kit[K] extends Component
    ? K
    : Kit[K] extends object
      ? {
          [P in PascalName<keyof Kit[K]>]: Kit[K][P] extends Component ? `${K}.${P}` : never;
        }[PascalName<keyof Kit[K]>]
      : never;
}[PascalName<keyof Kit>];

/**
 * Exported components that are no part of any `api.ts` table and take no ref, with the reason.
 * A part of a component is documented in its `api.ts` instead (and `null` there when it has no
 * ref).
 */
const NO_REF = {
  ControlSizeProvider: "a context provider: renders its children only",
} as const;

/**
 * Exported components documented outside the component `api.ts` tables, with the element their
 * ref reaches: `Icon` is the icon registry's renderer (`SKILL/api-contract.md`, Icons).
 */
const OUTSIDE_API = {
  Icon: "SVGSVGElement",
} as const;

/**
 * Parts whose props do not forward their element's native attributes, each named with its reason
 * (a fixed part still listed fails to compile).
 */
const PENDING_DOM_PROPS = {} as const;

type TakesRef<C> = "ref" extends keyof PropsOf<C> ? true : false;
/** The props take a ref of the element: a `RefObject` of it is assignable to their `ref`. */
type RefReaches<C, E> =
  PropsOf<C> extends { ref?: infer R }
    ? React.RefObject<E | null> extends R
      ? true
      : false
    : false;
/** The props forward the element's native attributes. */
type TakesDomProps<C> = "className" extends keyof PropsOf<C>
  ? "style" extends keyof PropsOf<C>
    ? true
    : false
  : false;

/** Entries whose part is not exported. */
type NotExported = { [N in keyof Refs]: [PartOf<N>] extends [never] ? N : never }[keyof Refs];
/** Entries whose ref does not reach the element their `api.ts` names. */
type WrongRef = {
  [N in keyof Refs]: Refs[N] extends readonly [infer E, ...unknown[]]
    ? E extends "Element"
      ? TakesRef<PartOf<N>> extends true
        ? never
        : N
      : RefReaches<PartOf<N>, ElementOf<E>> extends true
        ? never
        : N
    : never;
}[keyof Refs];
/** Entries with an element whose props drop the native attributes. */
type NoDomProps = Exclude<
  {
    [N in keyof Refs]: Refs[N] extends null
      ? never
      : TakesDomProps<PartOf<N>> extends true
        ? never
        : N;
  }[keyof Refs],
  keyof typeof PENDING_DOM_PROPS
>;
/** `PENDING_DOM_PROPS` entries whose part forwards its native attributes now. */
type StalePendingDomProps = {
  [N in keyof typeof PENDING_DOM_PROPS]: TakesDomProps<PartOf<N>> extends true ? N : never;
}[keyof typeof PENDING_DOM_PROPS];
/** Exported parts no `api.ts` documents and `NO_REF` does not list. */
type Undocumented = Exclude<
  ExportedParts,
  keyof Refs | keyof typeof NO_REF | keyof typeof OUTSIDE_API
>;
/** `OUTSIDE_API` entries whose ref does not reach the element named there. */
type WrongOutsideRef = {
  [N in keyof typeof OUTSIDE_API]: RefReaches<
    PartOf<N>,
    ElementOf<(typeof OUTSIDE_API)[N]>
  > extends true
    ? never
    : N;
}[keyof typeof OUTSIDE_API];
/** `NO_REF` entries that are documented or take a ref after all. */
type StaleNoRef = {
  [N in keyof typeof NO_REF]: N extends keyof Refs
    ? N
    : TakesRef<PartOf<N>> extends true
      ? N
      : never;
}[keyof typeof NO_REF];

/** Fails to compile with the offending names when `T` is not `never`. */
type Expect<T extends never> = T;
type PartRefChecks = [
  Expect<NotExported>,
  Expect<WrongRef>,
  Expect<NoDomProps>,
  Expect<Undocumented>,
  Expect<WrongOutsideRef>,
  Expect<StaleNoRef>,
  Expect<StalePendingDomProps>,
];

describe("part refs: every documented ref is the code's ref", () => {
  it("type-checks (tsc compiles PartRefChecks above)", () => {
    const compiled: PartRefChecks extends unknown[] ? true : false = true;
    expect(compiled).toBe(true);
  });
});

/** A callback ref: contravariant, so it fits every element type a part declares. */
type RefFn = (node: Element | null) => void;

type Case = [name: string, tag: string, ui: (ref: RefFn) => React.ReactNode];

/** Parts that merge the consumer's ref with their own or point it at another element. */
const CASES: Case[] = [
  [
    "AppShell.Template",
    "MAIN",
    (ref) => (
      <AppShell.Template
        ref={ref}
        mainProps={{ "data-testid": "part" } as React.ComponentProps<"main">}
      >
        <span>page</span>
      </AppShell.Template>
    ),
  ],
  ["ScrollContainer", "DIV", (ref) => <ScrollContainer ref={ref} data-testid="part" />],
  [
    "Accordion.Content",
    "SECTION",
    (ref) => (
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>Реквизиты</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content ref={ref} data-testid="part">
            ИНН 7701234567
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    ),
  ],
  [
    "Banner.Root",
    "DIV",
    (ref) => (
      <Banner.Root ref={ref} data-testid="part">
        <Banner.Content>X</Banner.Content>
      </Banner.Root>
    ),
  ],
  [
    "Page.List",
    "DIV",
    (ref) => (
      <Page.Split>
        <Page.List ref={ref} data-testid="part" aria-label="Обращения" />
        <Page.Detail aria-label="Обращение" />
      </Page.Split>
    ),
  ],
  [
    "Page.Detail",
    "DIV",
    (ref) => (
      <Page.Split>
        <Page.List aria-label="Обращения" />
        <Page.Detail ref={ref} data-testid="part" aria-label="Обращение" />
      </Page.Split>
    ),
  ],
  [
    "Page.TopBar",
    "HEADER",
    (ref) => (
      <Page.Root>
        <Page.TopBar ref={ref} data-testid="part" collapse />
      </Page.Root>
    ),
  ],
  [
    "SmartFilter.Toolbar",
    "DIV",
    (ref) => (
      <SmartFilter.Root fields={[{ key: "city", label: "Город", options: [] }]}>
        <SmartFilter.Toolbar ref={ref} data-testid="part" />
      </SmartFilter.Root>
    ),
  ],
  [
    "Page.Title",
    "H1",
    (ref) => (
      <Page.Root>
        <Page.Header>
          <Page.Heading>
            <Page.Title ref={ref} data-testid="part">
              Заказы
            </Page.Title>
          </Page.Heading>
        </Page.Header>
      </Page.Root>
    ),
  ],
  [
    "Page.Actions",
    "DIV",
    (ref) => (
      <Page.TopBar>
        <Page.Actions ref={ref} data-testid="part" />
      </Page.TopBar>
    ),
  ],
  [
    "List.Item",
    "BUTTON",
    (ref) => (
      <List.Root aria-label="Диалоги">
        <List.Item ref={ref} data-testid="part" onClick={() => {}}>
          ООО «Гранит»
        </List.Item>
      </List.Root>
    ),
  ],
  [
    "Tabs.Item",
    "BUTTON",
    (ref) => (
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Item ref={ref} data-testid="part" value="a">
            Заказы
          </Tabs.Item>
        </Tabs.List>
      </Tabs.Root>
    ),
  ],
  [
    "Tabs.List",
    "DIV",
    (ref) => (
      <Tabs.Root defaultValue="a">
        <Tabs.List ref={ref} data-testid="part">
          <Tabs.Item value="a">Заказы</Tabs.Item>
        </Tabs.List>
      </Tabs.Root>
    ),
  ],
  [
    "Breadcrumb.Root",
    "NAV",
    (ref) => (
      <Breadcrumb.Root ref={ref} data-testid="part">
        <Breadcrumb.Item href="#crm">CRM</Breadcrumb.Item>
        <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
        <Breadcrumb.Item current>ООО «Гранит»</Breadcrumb.Item>
      </Breadcrumb.Root>
    ),
  ],
  [
    "Datepicker.Panel",
    "DIV",
    (ref) => <Datepicker.Panel ref={ref} data-testid="part" mode="single" />,
  ],
  [
    "Dropdown.Item",
    "BUTTON",
    (ref) => (
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Действия</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item ref={ref} data-testid="part">
            Переименовать
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    ),
  ],
  [
    "Dropdown.CheckboxItem",
    "BUTTON",
    (ref) => (
      <Dropdown.Root defaultOpen>
        <Dropdown.Trigger>
          <button type="button">Колонки</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem ref={ref} data-testid="part">
            Сумма
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Root>
    ),
  ],
  [
    "CommandMenu.List",
    "DIV",
    (ref) => (
      <CommandMenu.Root defaultOpen aria-label="Команды">
        <CommandMenu.List ref={ref} data-testid="part">
          <CommandMenu.Item value="заказы">Заказы</CommandMenu.Item>
        </CommandMenu.List>
      </CommandMenu.Root>
    ),
  ],
  [
    "Modal.Content",
    "DIV",
    (ref) => (
      <Modal.Root defaultOpen>
        <Modal.Content ref={ref} data-testid="part" aria-label="Окно">
          Текст
        </Modal.Content>
      </Modal.Root>
    ),
  ],
  [
    "Drawer.Content",
    "DIV",
    (ref) => (
      <Drawer.Root defaultOpen>
        <Drawer.Content ref={ref} data-testid="part" aria-label="Окно">
          Текст
        </Drawer.Content>
      </Drawer.Root>
    ),
  ],
  [
    "Sheet.Content",
    "DIV",
    (ref) => (
      <Sheet.Root defaultOpen>
        <Sheet.Content ref={ref} data-testid="part" aria-label="Окно">
          Текст
        </Sheet.Content>
      </Sheet.Root>
    ),
  ],
  [
    "MediaViewer",
    "DIV",
    (ref) => (
      <MediaViewer
        ref={ref}
        data-testid="part"
        defaultOpen
        items={[{ src: "/dock.jpg", alt: "Склад" }]}
      />
    ),
  ],
  [
    "DataTable",
    "DIV",
    (ref) => (
      <DataTable
        ref={ref}
        data-testid="part"
        columns={[{ id: "name", header: "Имя", cell: (row: { name: string }) => row.name }]}
        rows={[{ name: "Анна" }]}
        getRowKey={(row) => row.name}
      />
    ),
  ],
  [
    "Gantt",
    "DIV",
    (ref) => (
      <Gantt
        ref={ref}
        data-testid="part"
        aria-label="План"
        rows={[{ name: "Анна" }]}
        getRowKey={(row) => row.name}
        getRowLabel={(row) => row.name}
        getRowBars={() => []}
      />
    ),
  ],
  [
    "Card.Root asChild",
    "A",
    (ref) => (
      <Card.Root ref={ref} data-testid="part" asChild>
        <a href="#orders">Заказы</a>
      </Card.Root>
    ),
  ],
  [
    "Card.Title",
    "H3",
    (ref) => (
      <Card.Root>
        <Card.Header>
          <Card.Title ref={ref} data-testid="part">
            Заказы
          </Card.Title>
        </Card.Header>
      </Card.Root>
    ),
  ],
  [
    "ChartFrame.Plot",
    "DIV",
    (ref) => (
      <ChartFrame.Root rows={[]}>
        <ChartFrame.Plot ref={ref} data-testid="part" renderPlot={() => null} />
      </ChartFrame.Root>
    ),
  ],
  [
    "ExampleFrame",
    "DIV",
    (ref) => (
      <ExampleFrame ref={ref} data-testid="part" code="<Button.Root />">
        <Button.Root>Пример</Button.Root>
      </ExampleFrame>
    ),
  ],
  [
    "FileUpload.Queue",
    "UL",
    (ref) => (
      <FileUpload.Queue
        ref={ref}
        data-testid="part"
        defaultValue={[{ id: "a", name: "Счёт.pdf" }]}
      />
    ),
  ],
  [
    "FileUpload.Queue (grid)",
    "UL",
    (ref) => (
      <FileUpload.Queue
        ref={ref}
        data-testid="part"
        layout="grid"
        defaultValue={[{ id: "a", name: "Счёт.pdf" }]}
      />
    ),
  ],
  [
    "Dnd.Sortable",
    "UL",
    (ref) => (
      <Dnd.Root>
        <Dnd.Sortable
          ref={ref}
          data-testid="part"
          as="ul"
          items={["a"]}
          getId={(id) => id}
          onReorder={() => undefined}
          renderItem={(id) => <Dnd.SortableItem id={id}>{id}</Dnd.SortableItem>}
        />
      </Dnd.Root>
    ),
  ],
  [
    "Dnd.SortableItem",
    "LI",
    (ref) => (
      <Dnd.Root>
        <Dnd.Sortable
          as="ul"
          items={["a"]}
          getId={(id) => id}
          onReorder={() => undefined}
          renderItem={(id) => (
            <Dnd.SortableItem ref={ref} data-testid="part" id={id}>
              {id}
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>
    ),
  ],
  [
    "Dnd.Handle",
    "BUTTON",
    (ref) => (
      <Dnd.Root>
        <Dnd.Sortable
          as="ul"
          handle
          items={["a"]}
          getId={(id) => id}
          onReorder={() => undefined}
          renderItem={(id) => (
            <Dnd.SortableItem id={id}>
              <Dnd.Handle ref={ref} data-testid="part" />
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>
    ),
  ],
  [
    "Dnd.Handle (lock of a locked item)",
    "SPAN",
    (ref) => (
      <Dnd.Root>
        <Dnd.Sortable
          as="ul"
          handle
          items={["a"]}
          getId={(id) => id}
          onReorder={() => undefined}
          renderItem={(id) => (
            <Dnd.SortableItem id={id} locked>
              <Dnd.Handle ref={ref} data-testid="part" />
            </Dnd.SortableItem>
          )}
        />
      </Dnd.Root>
    ),
  ],
  [
    "Dnd.Draggable",
    "DIV",
    (ref) => (
      <Dnd.Root>
        <Dnd.Draggable ref={ref} data-testid="part" kind="task" id="a">
          Задача
        </Dnd.Draggable>
      </Dnd.Root>
    ),
  ],
  [
    "Dnd.DropZone",
    "SECTION",
    (ref) => (
      <Dnd.Root>
        <Dnd.DropZone ref={ref} data-testid="part" as="section" accepts="task" onDrop={() => {}}>
          Готово
        </Dnd.DropZone>
      </Dnd.Root>
    ),
  ],
  [
    "Kanban.Root",
    "DIV",
    (ref) => (
      <Kanban.Root
        ref={ref}
        data-testid="part"
        columns={[{ id: "todo", title: "К выполнению" }]}
        items={["a"]}
        getId={(id) => id}
        defaultValue={{ todo: ["a"] }}
        renderItem={(id) => <Kanban.Item>{id}</Kanban.Item>}
      />
    ),
  ],
  [
    "Kanban.Item",
    "LI",
    (ref) => (
      <Kanban.Root
        columns={[{ id: "todo", title: "К выполнению" }]}
        items={["a"]}
        getId={(id) => id}
        defaultValue={{ todo: ["a"] }}
        renderItem={(id) => (
          <Kanban.Item ref={ref} data-testid="part">
            {id}
          </Kanban.Item>
        )}
      />
    ),
  ],
  [
    "Kanban.ItemTitle",
    "SPAN",
    (ref) => (
      <Kanban.Root
        columns={[{ id: "todo", title: "К выполнению" }]}
        items={["a"]}
        getId={(id) => id}
        defaultValue={{ todo: ["a"] }}
        renderItem={() => (
          <Kanban.Item>
            <Kanban.ItemTitle ref={ref} data-testid="part">
              Подготовить договор
            </Kanban.ItemTitle>
          </Kanban.Item>
        )}
      />
    ),
  ],
  [
    "Sidebar.SubContent",
    "DIV",
    (ref) => (
      <Sidebar.Root offCanvas="never">
        <Sidebar.Sub>
          <Sidebar.SubTrigger>Задачи</Sidebar.SubTrigger>
          <Sidebar.SubContent ref={ref} data-testid="part">
            <Sidebar.Item>Бэклог</Sidebar.Item>
          </Sidebar.SubContent>
        </Sidebar.Sub>
      </Sidebar.Root>
    ),
  ],
  [
    "VoicePlayer",
    "DIV",
    (ref) => <VoicePlayer ref={ref} data-testid="part" src="/voice.ogg" duration={12} />,
  ],
  [
    "ChatList.Root",
    "DIV",
    (ref) => (
      <ChatList.Root
        ref={ref}
        data-testid="part"
        items={["granit"]}
        getKey={(item) => item}
        renderItem={() => (
          <ChatList.Item>
            <ChatList.ItemText>ООО «Гранит»</ChatList.ItemText>
          </ChatList.Item>
        )}
      />
    ),
  ],
  [
    "ChatList.Item",
    "BUTTON",
    (ref) => (
      <ChatList.Root
        items={["granit"]}
        getKey={(item) => item}
        renderItem={() => (
          <ChatList.Item ref={ref} data-testid="part">
            <ChatList.ItemText>ООО «Гранит»</ChatList.ItemText>
          </ChatList.Item>
        )}
      />
    ),
  ],
  [
    "ChatList.ItemText",
    "SPAN",
    (ref) => (
      <ChatList.Root
        items={["granit"]}
        getKey={(item) => item}
        renderItem={() => (
          <ChatList.Item>
            <ChatList.ItemText ref={ref} data-testid="part">
              ООО «Гранит»
            </ChatList.ItemText>
          </ChatList.Item>
        )}
      />
    ),
  ],
  [
    "Chat.Messages",
    "DIV",
    (ref) => (
      <Chat.Root>
        <Chat.Messages ref={ref} data-testid="part" />
      </Chat.Root>
    ),
  ],
  [
    "Chat.Title",
    "H2",
    (ref) => (
      <Chat.Root>
        <Chat.Header>
          <Chat.Title ref={ref} data-testid="part">
            ООО «Северный ветер»
          </Chat.Title>
        </Chat.Header>
      </Chat.Root>
    ),
  ],
  [
    "Message.Root",
    "ARTICLE",
    (ref) => (
      <Message.Root ref={ref} data-testid="part" time="10:00">
        <Message.Text>Счёт отправлен</Message.Text>
      </Message.Root>
    ),
  ],
  [
    "VideoNote",
    "DIV",
    (ref) => <VideoNote ref={ref} data-testid="part" src="/note.mp4" duration={6} />,
  ],
  [
    "Badge.Root",
    "SPAN",
    (ref) => (
      <Badge.Root ref={ref} data-testid="part">
        Новый
      </Badge.Root>
    ),
  ],
  [
    "Badge.Group",
    "DIV",
    (ref) => (
      <Badge.Group ref={ref} data-testid="part" overflow="count">
        <Badge.Root>Сделки</Badge.Root>
      </Badge.Group>
    ),
  ],
  [
    "Checkbox.Root",
    "INPUT",
    (ref) => (
      <Checkbox.Root ref={ref} data-testid="part">
        <Checkbox.Label>Согласен</Checkbox.Label>
      </Checkbox.Root>
    ),
  ],
  [
    "Input.Wrapper",
    "DIV",
    (ref) => (
      <Input.Root label="Склад" suggestions={["Склад на Лесной"]}>
        <Input.Wrapper ref={ref} data-testid="part">
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>
    ),
  ],
  [
    "Input.Field",
    "INPUT",
    (ref) => (
      <Input.Root label="Имя">
        <Input.Wrapper>
          <Input.Field ref={ref} data-testid="part" />
        </Input.Wrapper>
      </Input.Root>
    ),
  ],
  [
    "Textarea.Root",
    "TEXTAREA",
    (ref) => <Textarea.Root ref={ref} data-testid="part" label="Комментарий" />,
  ],
  [
    "Select.Trigger",
    "BUTTON",
    (ref) => (
      <Select.Root label="Статус">
        <Select.Trigger ref={ref} data-testid="part" />
        <Select.Content>
          <Select.Item value="new">Новый</Select.Item>
        </Select.Content>
      </Select.Root>
    ),
  ],
  [
    "Select.Item",
    "DIV",
    (ref) => (
      <Select.Root label="Статус" defaultOpen>
        <Select.Trigger />
        <Select.Content>
          <Select.Item ref={ref} data-testid="part" value="new">
            Новый
          </Select.Item>
        </Select.Content>
      </Select.Root>
    ),
  ],
  [
    "Select.Action",
    "DIV",
    (ref) => (
      <Select.Root label="Клиент" defaultOpen>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="c1">Вектор</Select.Item>
          <Select.Action ref={ref} data-testid="part" onSelect={() => {}}>
            Новый клиент
          </Select.Action>
        </Select.Content>
      </Select.Root>
    ),
  ],
  [
    "Input.ClearButton",
    "BUTTON",
    (ref) => (
      <Input.Root label="Поиск">
        <Input.Wrapper>
          <Input.Field defaultValue="счёт" />
          <Input.ClearButton ref={ref} data-testid="part" />
        </Input.Wrapper>
      </Input.Root>
    ),
  ],
  [
    "CommandMenu.Item",
    "BUTTON",
    (ref) => (
      <CommandMenu.Root defaultOpen aria-label="Команды">
        <CommandMenu.List>
          <CommandMenu.Item ref={ref} data-testid="part" value="заказы">
            Заказы
          </CommandMenu.Item>
        </CommandMenu.List>
      </CommandMenu.Root>
    ),
  ],
  [
    "Carousel.Root",
    "SECTION",
    (ref) => <Carousel.Root ref={ref} data-testid="part" items={[{ src: "/dock.jpg" }]} />,
  ],
  [
    "Gallery",
    "DIV",
    (ref) => (
      <Gallery
        ref={ref}
        data-testid="part"
        items={[{ src: "/dock.jpg", alt: "Склад", width: 800, height: 600 }]}
      />
    ),
  ],
  [
    "Timeline.Item",
    "DIV",
    (ref) => (
      <Timeline.Root>
        <Timeline.Group label="Сегодня">
          <Timeline.Item ref={ref} data-testid="part">
            <Timeline.ItemTitle>Счёт оплачен</Timeline.ItemTitle>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>
    ),
  ],
  [
    "Chat.SearchButton",
    "BUTTON",
    (ref) => (
      <Chat.Root>
        <Chat.Header>
          <Chat.SearchButton ref={ref} data-testid="part" />
        </Chat.Header>
      </Chat.Root>
    ),
  ],
  [
    "Chat.SelectionBar",
    "DIV",
    (ref) => (
      <Chat.Root defaultSelected={[]}>
        <Chat.Messages>
          <Chat.SelectionBar ref={ref} data-testid="part" />
        </Chat.Messages>
      </Chat.Root>
    ),
  ],
  ["Composer.Root", "FORM", (ref) => <Composer.Root ref={ref} data-testid="part" />],
  [
    "Composer.Context",
    "DIV",
    (ref) => (
      <Composer.Root>
        <Composer.Context ref={ref} data-testid="part">
          Анна
        </Composer.Context>
      </Composer.Root>
    ),
  ],
  ["EmptyPage.Root", "DIV", (ref) => <EmptyPage.Root ref={ref} data-testid="part" />],
  [
    "Hint.Root",
    "P",
    (ref) => (
      <Hint.Root ref={ref} data-testid="part">
        Подсказка
      </Hint.Root>
    ),
  ],
  [
    "SmartFilter.Chips",
    "DIV",
    (ref) => (
      <SmartFilter.Root
        fields={[
          {
            key: "status",
            label: "Статус",
            options: [{ value: "new", label: "Новый" }],
          },
        ]}
        defaultValue={{ status: { include: ["new"], exclude: [] } }}
      >
        <SmartFilter.Chips ref={ref} data-testid="part" />
      </SmartFilter.Root>
    ),
  ],
  [
    "Sidebar.Root",
    "DIV",
    (ref) => (
      <Sidebar.Root ref={ref} data-testid="part" offCanvas="never">
        <Sidebar.Content>
          <Sidebar.Item>Заказы</Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Root>
    ),
  ],
  [
    "Sidebar.SubTrigger",
    "BUTTON",
    (ref) => (
      <Sidebar.Root offCanvas="never">
        <Sidebar.Sub>
          <Sidebar.SubTrigger ref={ref} data-testid="part">
            Задачи
          </Sidebar.SubTrigger>
          <Sidebar.SubContent>
            <Sidebar.Item>Бэклог</Sidebar.Item>
          </Sidebar.SubContent>
        </Sidebar.Sub>
      </Sidebar.Root>
    ),
  ],
  [
    "FieldList",
    "DIV",
    (ref) => (
      <FieldList
        ref={ref}
        data-testid="part"
        label="Контакты"
        columns={[{ label: "Имя" }]}
        defaultValue={[{ id: "a", name: "Анна" }]}
        getId={(row: { id: string; name: string }) => row.id}
        createItem={() => ({ id: "b", name: "" })}
        renderItem={(row: { id: string; name: string }) => (
          <Input.Root>
            <Input.Wrapper>
              <Input.Field defaultValue={row.name} />
            </Input.Wrapper>
          </Input.Root>
        )}
      />
    ),
  ],
];

describe("part refs: merged and redirected refs reach their element", () => {
  it.each(CASES)("%s → <%s>", (name, tag, ui) => {
    let node: Element | null = null;
    render(
      ui((element) => {
        if (element) node = element;
      }),
    );
    expect(node).not.toBeNull();
    const element = node as unknown as Element;
    expect(element.tagName.toUpperCase()).toBe(tag.toUpperCase());
    expect(document.body.contains(element)).toBe(true);
    // The native attributes reach the same element as the ref (a part still listed in
    // PENDING_DOM_PROPS forwards none yet).
    if (!(name.split(" ")[0] in PENDING_DOM_PROPS)) {
      expect(element.getAttribute("data-testid")).toBe("part");
    }
  });
});

/**
 * The parts whose ref is merged (`useMergedRefs(…, ref)`) or redirected (`ref={ref}` on an
 * element without the rest props), by part name: found in the component sources, named by the
 * namespace object or the `displayName` that exports them.
 */
function mergedOrRedirectedParts(): string[] {
  const files = [...walk("src/components", /\.tsx$/), ...walk("src/layout", /\.tsx$/)].filter(
    (file) => !/\.test\.tsx$/.test(file) && !file.includes("/examples/"),
  );
  const parts = new Set<string>();
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    if (!/\bref\b/.test(text)) continue;
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const names = new Map<string, string>();
    const visitNames = (node: ts.Node) => {
      // `X.displayName = "Ns.Part"`.
      if (
        ts.isBinaryExpression(node) &&
        ts.isPropertyAccessExpression(node.left) &&
        node.left.name.text === "displayName" &&
        ts.isIdentifier(node.left.expression) &&
        ts.isStringLiteral(node.right)
      ) {
        names.set(node.left.expression.text, node.right.text);
      }
      ts.forEachChild(node, visitNames);
    };
    visitNames(source);
    const flagged = new Set<string>();
    const inspect = (fn: ts.Node, name: string) => {
      let hit = false;
      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === "useMergedRefs" &&
          node.arguments.some((arg) => ts.isIdentifier(arg) && arg.text === "ref")
        ) {
          hit = true;
        }
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          const attributes = node.attributes.properties;
          const passesRef = attributes.some(
            (attr) =>
              ts.isJsxAttribute(attr) &&
              attr.name.getText() === "ref" &&
              attr.initializer &&
              ts.isJsxExpression(attr.initializer) &&
              attr.initializer.expression?.getText() === "ref",
          );
          const spreadsRest = attributes.some((attr) => ts.isJsxSpreadAttribute(attr));
          if (passesRef && !spreadsRest) hit = true;
        }
        ts.forEachChild(node, visit);
      };
      visit(fn);
      if (hit) flagged.add(name);
    };
    for (const statement of source.statements) {
      if (ts.isFunctionDeclaration(statement) && statement.name) {
        inspect(statement, statement.name.text);
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (
            ts.isIdentifier(declaration.name) &&
            declaration.initializer &&
            (ts.isArrowFunction(declaration.initializer) ||
              ts.isFunctionExpression(declaration.initializer))
          ) {
            inspect(declaration.initializer, declaration.name.text);
          }
        }
      }
    }
    for (const fn of flagged) {
      const name = names.get(fn);
      if (name && /^[A-Z]\w*(\.[A-Z]\w*)?$/.test(name)) parts.add(name);
    }
  }
  return [...parts].sort();
}

describe("part refs: every merged or redirected ref has a runtime row", () => {
  it("CASES covers the parts the sources merge or redirect", () => {
    const covered = new Set(CASES.map(([name]) => name.split(" ")[0]));
    const missing = mergedOrRedirectedParts().filter((name) => !covered.has(name));
    expect(missing, "part-refs-runtime").toEqual([]);
  });
});
