/**
 * Every part that renders DOM takes `ref` (CLAUDE.md §1).
 *
 * Most parts declare `ref` in their props and pass it to their element through `{...rest}`: for
 * them the props type is the contract, checked at compile time below (`takesRef`). Parts that
 * merge the consumer's ref with an internal one or redirect it to another element are rendered
 * and checked at runtime: the ref must reach the right element.
 */
import { render } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";
import { ColorPicker } from "@/color-picker";
import {
  Accordion,
  Avatar,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  ColorPresets,
  ColorSwatches,
  CommandMenu,
  DataTable,
  Datepicker,
  DigitInput,
  Dnd,
  Drawer,
  Dropdown,
  EmptyPage,
  ExampleFrame,
  FileUpload,
  Hint,
  Input,
  Kanban,
  Label,
  LoginForm,
  Modal,
  NotificationCard,
  PageContent,
  Popover,
  ScrollContainer,
  SegmentedControl,
  Select,
  Slider,
  SmartFilter,
  Stepper,
  Tabs,
  TagSelect,
  Textarea,
  Thumbnail,
  Timeline,
} from "@/components";
import { AppHeader, AppShell, BottomNav, Sidebar } from "@/layout";

type PropsOf<C> = C extends React.JSXElementConstructor<infer P> ? P : never;

/** Compile-time: the part's props declare `ref` (it reaches the element through `{...rest}`). */
function takesRef<C>(
  _part: C & ("ref" extends keyof PropsOf<C> ? unknown : "props declare no ref"),
) {}

describe("part refs: every part declares ref", () => {
  it("type-checks (tsc runs this file)", () => {
    takesRef(Accordion.Icon);
    takesRef(AppShell.Root);
    takesRef(AppShell.Nav);
    takesRef(AppHeader.Root);
    takesRef(AppHeader.Start);
    takesRef(AppHeader.Title);
    takesRef(AppHeader.Icon);
    takesRef(AppHeader.Description);
    takesRef(AppHeader.Separator);
    takesRef(AppHeader.Search);
    takesRef(AppHeader.Actions);
    takesRef(AppHeader.MenuButton);
    takesRef(AppShell.Main);
    takesRef(AppShell.Footer);
    takesRef(BottomNav.Root);
    takesRef(BottomNav.Item);
    takesRef(BottomNav.ItemIcon);
    takesRef(BottomNav.ItemCount);
    takesRef(Avatar.Root);
    takesRef(Avatar.Image);
    takesRef(Avatar.Fallback);
    takesRef(Avatar.Status);
    takesRef(Avatar.Group);
    takesRef(Avatar.Overflow);
    takesRef(Badge.Root);
    takesRef(Badge.Icon);
    takesRef(Badge.Dot);
    takesRef(Badge.Action);
    takesRef(Banner.Root);
    takesRef(Banner.Content);
    takesRef(Banner.Icon);
    takesRef(Banner.Title);
    takesRef(Banner.Description);
    takesRef(Banner.Actions);
    takesRef(Breadcrumb.Root);
    takesRef(Breadcrumb.Item);
    takesRef(Breadcrumb.Ellipsis);
    takesRef(Button.Icon);
    takesRef(ButtonGroup.Icon);
    for (const part of Object.values(Card)) takesRef(part);
    takesRef(ColorPicker.Area);
    takesRef(ColorPicker.AreaThumb);
    takesRef(ColorPicker.ChannelStrip);
    takesRef(ColorPicker.FormatSelect);
    takesRef(ColorPicker.HexInput);
    takesRef(ColorPicker.Slider);
    takesRef(ColorPicker.SliderMeta);
    takesRef(ColorPicker.SliderTrack);
    takesRef(ColorPicker.Swatches);
    takesRef(ColorPicker.Thumb);
    takesRef(ColorPicker.TriggerSwatch);
    takesRef(ColorPresets.Content);
    takesRef(ColorPresets.Swatch);
    takesRef(ColorSwatches);
    takesRef(CommandMenu.Root);
    takesRef(CommandMenu.Title);
    takesRef(CommandMenu.Description);
    takesRef(CommandMenu.Group);
    takesRef(CommandMenu.ItemIcon);
    takesRef(CommandMenu.ItemText);
    takesRef(CommandMenu.ItemShortcut);
    takesRef(CommandMenu.Empty);
    takesRef(CommandMenu.Footer);
    takesRef(CommandMenu.FooterHint);
    takesRef(Datepicker.Root);
    takesRef(DigitInput);
    for (const D of [Modal, Drawer]) {
      takesRef(D.Header);
      takesRef(D.Icon);
      takesRef(D.Title);
      takesRef(D.Description);
      takesRef(D.Body);
      takesRef(D.Footer);
    }
    takesRef(Dropdown.CheckboxItem);
    takesRef(Dropdown.ItemIcon);
    takesRef(Dropdown.ItemShortcut);
    takesRef(Dropdown.Group);
    takesRef(Dropdown.Separator);
    takesRef(Dropdown.Header);
    takesRef(Dropdown.Title);
    takesRef(Dropdown.Description);
    for (const part of Object.values(EmptyPage)) takesRef(part);
    takesRef(FileUpload.Body);
    takesRef(FileUpload.Icon);
    takesRef(FileUpload.Title);
    takesRef(FileUpload.Description);
    takesRef(FileUpload.FormatBadge);
    takesRef(FileUpload.Item);
    takesRef(FileUpload.ItemName);
    takesRef(FileUpload.ItemDescription);
    takesRef(FileUpload.ItemActions);
    takesRef(FileUpload.ItemProgress);
    takesRef(Hint.Icon);
    takesRef(Input.Root);
    takesRef(Input.Wrapper);
    takesRef(Input.Icon);
    takesRef(Input.Affix);
    takesRef(Input.InlineAffix);
    takesRef(Input.Counter);
    takesRef(Kanban.ItemTitle);
    takesRef(Kanban.ItemDescription);
    takesRef(Kanban.ItemBadges);
    takesRef(Kanban.ItemFooter);
    takesRef(Kanban.ItemCount);
    takesRef(Label.Icon);
    takesRef(Label.Description);
    takesRef(LoginForm.Header);
    takesRef(LoginForm.Logo);
    takesRef(LoginForm.Title);
    takesRef(LoginForm.Description);
    takesRef(LoginForm.Body);
    takesRef(LoginForm.Actions);
    takesRef(LoginForm.Footer);
    takesRef(NotificationCard);
    for (const part of Object.values(PageContent)) takesRef(part);
    takesRef(Popover.Header);
    takesRef(Popover.Title);
    takesRef(Popover.Description);
    takesRef(Popover.Actions);
    takesRef(SegmentedControl.Root);
    takesRef(SegmentedControl.Icon);
    takesRef(SegmentedControl.Label);
    takesRef(SegmentedControl.Count);
    takesRef(SegmentedControl.Description);
    takesRef(Select.Root);
    takesRef(Select.Value);
    takesRef(Select.TriggerIcon);
    takesRef(Select.Content);
    takesRef(Select.ItemIcon);
    takesRef(Select.ItemText);
    takesRef(Select.ItemDescription);
    takesRef(Select.ItemMeta);
    takesRef(Select.Group);
    takesRef(Select.Separator);
    takesRef(Sidebar.Header);
    takesRef(Sidebar.BrandLogo);
    takesRef(Sidebar.Footer);
    takesRef(Sidebar.Group);
    takesRef(Sidebar.ItemIcon);
    takesRef(Sidebar.ItemCount);
    takesRef(Sidebar.ItemShortcut);
    takesRef(Sidebar.ItemAction);
    takesRef(Sidebar.Sub);
    takesRef(Slider);
    takesRef(SmartFilter.Root);
    takesRef(SmartFilter.Toolbar);
    takesRef(SmartFilter.Chips);
    takesRef(Stepper.Root);
    takesRef(Stepper.Arrow);
    takesRef(Stepper.Content);
    takesRef(Stepper.Description);
    takesRef(Stepper.Indicator);
    takesRef(Stepper.Title);
    takesRef(Tabs.Root);
    takesRef(Tabs.Item);
    takesRef(Tabs.Icon);
    takesRef(Tabs.Label);
    takesRef(Tabs.Count);
    takesRef(Tabs.Description);
    takesRef(Tabs.Separator);
    takesRef(Tabs.Panel);
    takesRef(TagSelect);
    takesRef(Textarea.Counter);
    takesRef(Thumbnail.Root);
    takesRef(Thumbnail.Image);
    takesRef(Thumbnail.Fallback);
    takesRef(Timeline.Title);
    takesRef(Timeline.Meta);
    takesRef(Timeline.MetaPrimary);
    takesRef(Timeline.Value);
    takesRef(Timeline.ValueMeta);
    expect(true).toBe(true);
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
      <AppShell.Template ref={ref}>
        <span>page</span>
      </AppShell.Template>
    ),
  ],
  ["ScrollContainer", "DIV", (ref) => <ScrollContainer ref={ref} fade />],
  [
    "Tabs.Item",
    "BUTTON",
    (ref) => (
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Item ref={ref} value="a">
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
        <Tabs.List ref={ref}>
          <Tabs.Item value="a">Заказы</Tabs.Item>
        </Tabs.List>
      </Tabs.Root>
    ),
  ],
  ["Datepicker.Panel", "DIV", (ref) => <Datepicker.Panel ref={ref} mode="single" />],
  [
    "Modal.Content",
    "DIV",
    (ref) => (
      <Modal.Root defaultOpen>
        <Modal.Content ref={ref} aria-label="Окно">
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
        <Drawer.Content ref={ref} aria-label="Окно">
          Текст
        </Drawer.Content>
      </Drawer.Root>
    ),
  ],
  [
    "DataTable",
    "DIV",
    (ref) => (
      <DataTable
        ref={ref}
        columns={[{ id: "name", header: "Имя", cell: (row: { name: string }) => row.name }]}
        rows={[{ name: "Анна" }]}
        getRowKey={(row) => row.name}
      />
    ),
  ],
  [
    "ExampleFrame",
    "DIV",
    (ref) => (
      <ExampleFrame ref={ref} code="<Button.Root />">
        <Button.Root>Пример</Button.Root>
      </ExampleFrame>
    ),
  ],
  [
    "Dnd.Sortable",
    "UL",
    (ref) => (
      <Dnd.Root>
        <Dnd.Sortable
          ref={ref}
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
            <Dnd.SortableItem ref={ref} id={id}>
              {id}
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
        <Dnd.Draggable ref={ref} kind="task" id="a">
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
        <Dnd.DropZone ref={ref} as="section" accepts="task" onDrop={() => {}}>
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
        renderItem={(id) => <Kanban.Item ref={ref}>{id}</Kanban.Item>}
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
          <Sidebar.SubContent ref={ref}>
            <Sidebar.Item>Бэклог</Sidebar.Item>
          </Sidebar.SubContent>
        </Sidebar.Sub>
      </Sidebar.Root>
    ),
  ],
];

describe("part refs: merged and redirected refs reach their element", () => {
  it.each(CASES)("%s → <%s>", (_name, tag, ui) => {
    let node: Element | null = null;
    render(
      ui((element) => {
        if (element) node = element;
      }),
    );
    expect(node).not.toBeNull();
    expect((node as unknown as Element).tagName.toUpperCase()).toBe(tag.toUpperCase());
    expect(document.body.contains(node)).toBe(true);
  });
});
