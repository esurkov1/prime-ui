/**
 * Every part that renders DOM takes `ref` (CLAUDE.md §1): the ref reaches the part's own element.
 * One row per part: a render with the ref on the part under test and the tag it must point at.
 */
import { render } from "@testing-library/react";
import type * as React from "react";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  Avatar,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  ColorPicker,
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
  Label,
  LoginForm,
  Modal,
  NotificationCard,
  PageContent,
  Popover,
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
import { AppShell, Sidebar } from "@/layout";

/** A callback ref: contravariant, so it fits every element type a part declares. */
type RefFn = (node: Element | null) => void;

type Case = [name: string, tag: string, ui: (ref: RefFn) => React.ReactNode];

const CASES: Case[] = [
  // ── Primitives ──
  [
    "Accordion.Icon",
    "SPAN",
    (ref) => (
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>
              <Accordion.Icon ref={ref}>★</Accordion.Icon>
              Оплата
            </Accordion.Trigger>
          </Accordion.Header>
        </Accordion.Item>
      </Accordion.Root>
    ),
  ],
  [
    "Avatar.Fallback",
    "SPAN",
    (ref) => (
      <Avatar.Root>
        <Avatar.Fallback ref={ref}>АБ</Avatar.Fallback>
      </Avatar.Root>
    ),
  ],
  [
    "Avatar.Status",
    "SPAN",
    (ref) => (
      <Avatar.Root>
        <Avatar.Fallback>АБ</Avatar.Fallback>
        <Avatar.Status ref={ref} status="online" />
      </Avatar.Root>
    ),
  ],
  [
    "Badge.Icon",
    "SPAN",
    (ref) => (
      <Badge.Root>
        <Badge.Icon ref={ref}>★</Badge.Icon>
        Новый
      </Badge.Root>
    ),
  ],
  [
    "Badge.Dot",
    "SPAN",
    (ref) => (
      <Badge.Root>
        <Badge.Dot ref={ref} />
        Активен
      </Badge.Root>
    ),
  ],
  [
    "Badge.Action",
    "BUTTON",
    (ref) => (
      <Badge.Root>
        billing
        <Badge.Action ref={ref} label="Скрыть" onClick={() => {}} />
      </Badge.Root>
    ),
  ],
  [
    "Banner.Content",
    "DIV",
    (ref) => (
      <Banner.Root>
        <Banner.Content ref={ref}>
          <Banner.Title>Оплата</Banner.Title>
        </Banner.Content>
      </Banner.Root>
    ),
  ],
  [
    "Banner.Icon",
    "SPAN",
    (ref) => (
      <Banner.Root>
        <Banner.Content>
          <Banner.Icon ref={ref}>!</Banner.Icon>
        </Banner.Content>
      </Banner.Root>
    ),
  ],
  [
    "Banner.Title",
    "SPAN",
    (ref) => (
      <Banner.Root>
        <Banner.Content>
          <Banner.Title ref={ref}>Оплата</Banner.Title>
        </Banner.Content>
      </Banner.Root>
    ),
  ],
  [
    "Banner.Description",
    "SPAN",
    (ref) => (
      <Banner.Root>
        <Banner.Content>
          <Banner.Description ref={ref}>Счёт просрочен</Banner.Description>
        </Banner.Content>
      </Banner.Root>
    ),
  ],
  [
    "Banner.Actions",
    "DIV",
    (ref) => (
      <Banner.Root>
        <Banner.Content>
          <Banner.Actions ref={ref}>
            <Button.Root>Оплатить</Button.Root>
          </Banner.Actions>
        </Banner.Content>
      </Banner.Root>
    ),
  ],
  [
    "Button.Icon",
    "SPAN",
    (ref) => (
      <Button.Root aria-label="Добавить">
        <Button.Icon ref={ref}>+</Button.Icon>
      </Button.Root>
    ),
  ],
  [
    "ButtonGroup.Icon",
    "SPAN",
    (ref) => (
      <ButtonGroup.Root>
        <ButtonGroup.Item>
          <ButtonGroup.Icon ref={ref}>+</ButtonGroup.Icon>
          Добавить
        </ButtonGroup.Item>
      </ButtonGroup.Root>
    ),
  ],
  [
    "EmptyPage.Icon",
    "DIV",
    (ref) => (
      <EmptyPage.Root>
        <EmptyPage.Icon ref={ref}>○</EmptyPage.Icon>
      </EmptyPage.Root>
    ),
  ],
  [
    "EmptyPage.Actions",
    "DIV",
    (ref) => (
      <EmptyPage.Root>
        <EmptyPage.Actions ref={ref}>
          <Button.Root>Создать</Button.Root>
        </EmptyPage.Actions>
      </EmptyPage.Root>
    ),
  ],
  [
    "Hint.Icon",
    "SPAN",
    (ref) => (
      <Hint.Root>
        <Hint.Icon ref={ref}>i</Hint.Icon>
        Подсказка
      </Hint.Root>
    ),
  ],
  [
    "Label.Icon",
    "SPAN",
    (ref) => (
      <Label.Root>
        <Label.Icon ref={ref}>@</Label.Icon>
        Почта
      </Label.Root>
    ),
  ],
  [
    "Label.Description",
    "SPAN",
    (ref) => (
      <Label.Root>
        Вес <Label.Description ref={ref}>кг</Label.Description>
      </Label.Root>
    ),
  ],
  [
    "Thumbnail.Fallback",
    "SPAN",
    (ref) => (
      <Thumbnail.Root>
        <Thumbnail.Fallback ref={ref}>PDF</Thumbnail.Fallback>
      </Thumbnail.Root>
    ),
  ],

  // ── Card ──
  ...(
    [
      ["Card.Header", "DIV", (ref: RefFn) => <Card.Header ref={ref}>Шапка</Card.Header>],
      ["Card.Title", "H3", (ref: RefFn) => <Card.Title ref={ref}>Заголовок</Card.Title>],
      [
        "Card.Description",
        "P",
        (ref: RefFn) => <Card.Description ref={ref}>Текст</Card.Description>,
      ],
      ["Card.Body", "DIV", (ref: RefFn) => <Card.Body ref={ref}>Тело</Card.Body>],
      ["Card.Media", "DIV", (ref: RefFn) => <Card.Media ref={ref}>График</Card.Media>],
      ["Card.Footer", "DIV", (ref: RefFn) => <Card.Footer ref={ref}>Кнопки</Card.Footer>],
      ["Card.Icon", "DIV", (ref: RefFn) => <Card.Icon ref={ref}>★</Card.Icon>],
      ["Card.Label", "SPAN", (ref: RefFn) => <Card.Label ref={ref}>Выручка</Card.Label>],
      ["Card.Value", "SPAN", (ref: RefFn) => <Card.Value ref={ref}>42</Card.Value>],
      ["Card.Delta", "SPAN", (ref: RefFn) => <Card.Delta ref={ref}>+5%</Card.Delta>],
      [
        "Card.List",
        "UL",
        (ref: RefFn) => (
          <Card.List ref={ref}>
            <Card.ListItem>Событие</Card.ListItem>
          </Card.List>
        ),
      ],
      [
        "Card.ListItem",
        "LI",
        (ref: RefFn) => (
          <Card.List>
            <Card.ListItem ref={ref}>Событие</Card.ListItem>
          </Card.List>
        ),
      ],
    ] satisfies Case[]
  ).map(([name, tag, ui]): Case => [name, tag, (ref) => <Card.Root>{ui(ref)}</Card.Root>]),

  // ── Navigation ──
  [
    "Breadcrumb.Root",
    "NAV",
    (ref) => (
      <Breadcrumb.Root ref={ref}>
        <Breadcrumb.Item current>Заказы</Breadcrumb.Item>
      </Breadcrumb.Root>
    ),
  ],
  [
    "Breadcrumb.Item",
    "LI",
    (ref) => (
      <Breadcrumb.Root>
        <Breadcrumb.Item ref={ref} current>
          Заказы
        </Breadcrumb.Item>
      </Breadcrumb.Root>
    ),
  ],
  [
    "Breadcrumb.Ellipsis",
    "LI",
    (ref) => (
      <Breadcrumb.Root>
        <Breadcrumb.Ellipsis ref={ref} />
        <Breadcrumb.Item current>Заказы</Breadcrumb.Item>
      </Breadcrumb.Root>
    ),
  ],
  ...(
    [
      ["Stepper.Indicator", "SPAN", (ref: RefFn) => <Stepper.Indicator ref={ref} />],
      [
        "Stepper.Content",
        "SPAN",
        (ref: RefFn) => (
          <Stepper.Content ref={ref}>
            <Stepper.Title>Данные</Stepper.Title>
          </Stepper.Content>
        ),
      ],
      ["Stepper.Title", "SPAN", (ref: RefFn) => <Stepper.Title ref={ref}>Данные</Stepper.Title>],
      [
        "Stepper.Description",
        "SPAN",
        (ref: RefFn) => <Stepper.Description ref={ref}>Шаг 1</Stepper.Description>,
      ],
      ["Stepper.Arrow", "svg", (ref: RefFn) => <Stepper.Arrow ref={ref} />],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [
      name,
      tag,
      (ref) => (
        <Stepper.Root orientation="vertical">
          <Stepper.Item>{ui(ref)}</Stepper.Item>
        </Stepper.Root>
      ),
    ],
  ),
  [
    "Stepper.Root",
    "OL",
    (ref) => (
      <Stepper.Root ref={ref}>
        <Stepper.Item>
          <Stepper.Content>
            <Stepper.Title>Данные</Stepper.Title>
          </Stepper.Content>
        </Stepper.Item>
      </Stepper.Root>
    ),
  ],
  [
    "Tabs.Root",
    "DIV",
    (ref) => (
      <Tabs.Root ref={ref} defaultValue="a">
        <Tabs.List>
          <Tabs.Item value="a">Заказы</Tabs.Item>
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
  ...(
    [
      ["Tabs.Icon", (ref: RefFn) => <Tabs.Icon ref={ref}>★</Tabs.Icon>],
      ["Tabs.Label", (ref: RefFn) => <Tabs.Label ref={ref}>Заказы</Tabs.Label>],
      ["Tabs.Count", (ref: RefFn) => <Tabs.Count ref={ref}>3</Tabs.Count>],
      ["Tabs.Description", (ref: RefFn) => <Tabs.Description ref={ref}>Новые</Tabs.Description>],
    ] as const
  ).map(
    ([name, ui]): Case => [
      name,
      "SPAN",
      (ref) => (
        <Tabs.Root defaultValue="a">
          <Tabs.List>
            <Tabs.Item value="a">
              <Tabs.Label>Заказы</Tabs.Label>
              {ui(ref)}
            </Tabs.Item>
          </Tabs.List>
        </Tabs.Root>
      ),
    ],
  ),
  [
    "Tabs.Panel",
    "DIV",
    (ref) => (
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Item value="a">Заказы</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel ref={ref} value="a">
          Список
        </Tabs.Panel>
      </Tabs.Root>
    ),
  ],
  [
    "SegmentedControl.Root",
    "DIV",
    (ref) => (
      <SegmentedControl.Root ref={ref} defaultValue="a" aria-label="Период">
        <SegmentedControl.Item value="a">День</SegmentedControl.Item>
      </SegmentedControl.Root>
    ),
  ],
  ...(
    [
      [
        "SegmentedControl.Icon",
        (ref: RefFn) => <SegmentedControl.Icon ref={ref}>★</SegmentedControl.Icon>,
      ],
      [
        "SegmentedControl.Label",
        (ref: RefFn) => <SegmentedControl.Label ref={ref}>День</SegmentedControl.Label>,
      ],
      [
        "SegmentedControl.Count",
        (ref: RefFn) => <SegmentedControl.Count ref={ref}>3</SegmentedControl.Count>,
      ],
      [
        "SegmentedControl.Description",
        (ref: RefFn) => <SegmentedControl.Description ref={ref}>24 ч</SegmentedControl.Description>,
      ],
    ] as const
  ).map(
    ([name, ui]): Case => [
      name,
      "SPAN",
      (ref) => (
        <SegmentedControl.Root defaultValue="a" aria-label="Период">
          <SegmentedControl.Item value="a">
            <SegmentedControl.Label>День</SegmentedControl.Label>
            {ui(ref)}
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      ),
    ],
  ),

  // ── Fields ──
  [
    "Input.Root",
    "DIV",
    (ref) => (
      <Input.Root ref={ref} label="Название">
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>
    ),
  ],
  [
    "Input.Wrapper",
    "DIV",
    (ref) => (
      <Input.Root label="Название">
        <Input.Wrapper ref={ref}>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>
    ),
  ],
  ...(
    [
      [
        "Input.Icon",
        "SPAN",
        (ref: RefFn) => (
          <Input.Icon ref={ref} side="start">
            @
          </Input.Icon>
        ),
      ],
      [
        "Input.Affix",
        "DIV",
        (ref: RefFn) => (
          <Input.Affix ref={ref} side="start">
            https://
          </Input.Affix>
        ),
      ],
      [
        "Input.InlineAffix",
        "SPAN",
        (ref: RefFn) => (
          <Input.InlineAffix ref={ref} side="end">
            ₽
          </Input.InlineAffix>
        ),
      ],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [
      name,
      tag,
      (ref) => (
        <Input.Root label="Сумма">
          <Input.Wrapper>
            {ui(ref)}
            <Input.Field />
          </Input.Wrapper>
        </Input.Root>
      ),
    ],
  ),
  [
    "Input.Counter",
    "SPAN",
    (ref) => (
      <Input.Root label="Название" counter={<Input.Counter ref={ref} current={3} max={40} />}>
        <Input.Wrapper>
          <Input.Field />
        </Input.Wrapper>
      </Input.Root>
    ),
  ],
  [
    "Textarea.Counter",
    "SPAN",
    (ref) => (
      <Textarea.Root
        label="Комментарий"
        counter={<Textarea.Counter ref={ref} current={3} max={280} />}
      />
    ),
  ],
  ["DigitInput", "DIV", (ref) => <DigitInput ref={ref} label="Код" />],
  ["ColorSwatches", "DIV", (ref) => <ColorSwatches ref={ref} label="Цвет" />],
  [
    "TagSelect",
    "DIV",
    (ref) => <TagSelect ref={ref} label="Теги" options={[{ value: "vip", label: "VIP" }]} />,
  ],
  ["Datepicker.Root", "DIV", (ref) => <Datepicker.Root ref={ref} mode="single" label="Дата" />],
  ["Datepicker.Panel", "DIV", (ref) => <Datepicker.Panel ref={ref} mode="single" />],
  ["Slider", "DIV", (ref) => <Slider ref={ref} label="Громкость" />],
  [
    "Select.Root",
    "DIV",
    (ref) => (
      <Select.Root ref={ref} label="Статус">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
      </Select.Root>
    ),
  ],
  [
    "Select.Value",
    "SPAN",
    (ref) => (
      <Select.Root label="Статус">
        <Select.Trigger>
          <Select.Value ref={ref} />
        </Select.Trigger>
      </Select.Root>
    ),
  ],
  [
    "Select.TriggerIcon",
    "SPAN",
    (ref) => (
      <Select.Root label="Статус">
        <Select.Trigger>
          <Select.TriggerIcon ref={ref}>★</Select.TriggerIcon>
          <Select.Value />
        </Select.Trigger>
      </Select.Root>
    ),
  ],
  [
    "Select.Content",
    "DIV",
    (ref) => (
      <Select.Root label="Статус">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content ref={ref}>
          <Select.Item value="new">Новый</Select.Item>
        </Select.Content>
      </Select.Root>
    ),
  ],
  ...(
    [
      [
        "Select.ItemIcon",
        "SPAN",
        (ref: RefFn) => (
          <Select.Item value="new">
            <Select.ItemIcon ref={ref}>★</Select.ItemIcon>
            Новый
          </Select.Item>
        ),
      ],
      [
        "Select.ItemText",
        "SPAN",
        (ref: RefFn) => (
          <Select.Item value="new">
            <Select.ItemText ref={ref}>Новый</Select.ItemText>
          </Select.Item>
        ),
      ],
      [
        "Select.ItemDescription",
        "SPAN",
        (ref: RefFn) => (
          <Select.Item value="new">
            <Select.ItemText>Новый</Select.ItemText>
            <Select.ItemDescription ref={ref}>Без оплаты</Select.ItemDescription>
          </Select.Item>
        ),
      ],
      [
        "Select.ItemMeta",
        "SPAN",
        (ref: RefFn) => (
          <Select.Item value="new">
            Новый
            <Select.ItemMeta ref={ref}>12</Select.ItemMeta>
          </Select.Item>
        ),
      ],
      [
        "Select.Group",
        "DIV",
        (ref: RefFn) => (
          <Select.Group ref={ref} label="Статусы">
            <Select.Item value="new">Новый</Select.Item>
          </Select.Group>
        ),
      ],
      ["Select.Separator", "DIV", (ref: RefFn) => <Select.Separator ref={ref} />],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [
      name,
      tag,
      (ref) => (
        <Select.Root label="Статус">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {ui(ref)}
            <Select.Item value="done">Готов</Select.Item>
          </Select.Content>
        </Select.Root>
      ),
    ],
  ),
  [
    "FileUpload.Item",
    "DIV",
    (ref) => (
      <FileUpload.Item ref={ref}>
        <FileUpload.ItemName>Счёт.pdf</FileUpload.ItemName>
      </FileUpload.Item>
    ),
  ],
  ...(
    [
      ["FileUpload.Body", "DIV", (ref: RefFn) => <FileUpload.Body ref={ref}>Зона</FileUpload.Body>],
      ["FileUpload.Icon", "SPAN", (ref: RefFn) => <FileUpload.Icon ref={ref}>↑</FileUpload.Icon>],
      [
        "FileUpload.Title",
        "P",
        (ref: RefFn) => <FileUpload.Title ref={ref}>Файл</FileUpload.Title>,
      ],
      [
        "FileUpload.Description",
        "P",
        (ref: RefFn) => <FileUpload.Description ref={ref}>PDF до 10 МБ</FileUpload.Description>,
      ],
      [
        "FileUpload.FormatBadge",
        "SPAN",
        (ref: RefFn) => <FileUpload.FormatBadge ref={ref} format="pdf" />,
      ],
      [
        "FileUpload.ItemName",
        "DIV",
        (ref: RefFn) => <FileUpload.ItemName ref={ref}>Счёт.pdf</FileUpload.ItemName>,
      ],
      [
        "FileUpload.ItemDescription",
        "DIV",
        (ref: RefFn) => <FileUpload.ItemDescription ref={ref}>2 МБ</FileUpload.ItemDescription>,
      ],
      [
        "FileUpload.ItemActions",
        "DIV",
        (ref: RefFn) => (
          <FileUpload.ItemActions ref={ref}>
            <Button.Root>Удалить</Button.Root>
          </FileUpload.ItemActions>
        ),
      ],
      [
        "FileUpload.ItemProgress",
        "DIV",
        (ref: RefFn) => <FileUpload.ItemProgress ref={ref} value={40} />,
      ],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [name, tag, (ref) => <FileUpload.Item>{ui(ref)}</FileUpload.Item>],
  ),
  ...(
    [
      ["ColorPicker.HexInput", "DIV", (ref: RefFn) => <ColorPicker.HexInput ref={ref} />],
      [
        "ColorPicker.TriggerSwatch",
        "SPAN",
        (ref: RefFn) => <ColorPicker.TriggerSwatch ref={ref} />,
      ],
      ["ColorPicker.FormatSelect", "DIV", (ref: RefFn) => <ColorPicker.FormatSelect ref={ref} />],
      ["ColorPicker.ChannelStrip", "DIV", (ref: RefFn) => <ColorPicker.ChannelStrip ref={ref} />],
      [
        "ColorPicker.Swatches",
        "DIV",
        (ref: RefFn) => <ColorPicker.Swatches ref={ref} label="Цвет" />,
      ],
      [
        "ColorPicker.Area",
        "DIV",
        (ref: RefFn) => (
          <ColorPicker.Area ref={ref} colorSpace="hsl" xChannel="saturation" yChannel="lightness">
            <ColorPicker.AreaThumb />
          </ColorPicker.Area>
        ),
      ],
      [
        "ColorPicker.AreaThumb",
        "DIV",
        (ref: RefFn) => (
          <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
            <ColorPicker.AreaThumb ref={ref} />
          </ColorPicker.Area>
        ),
      ],
      [
        "ColorPicker.Slider",
        "DIV",
        (ref: RefFn) => (
          <ColorPicker.Slider ref={ref} channel="hue" colorSpace="hsl">
            <ColorPicker.SliderTrack>
              <ColorPicker.Thumb />
            </ColorPicker.SliderTrack>
          </ColorPicker.Slider>
        ),
      ],
      [
        "ColorPicker.SliderMeta",
        "DIV",
        (ref: RefFn) => (
          <ColorPicker.Slider channel="hue" colorSpace="hsl">
            <ColorPicker.SliderMeta ref={ref} label="Тон" />
          </ColorPicker.Slider>
        ),
      ],
      [
        "ColorPicker.SliderTrack",
        "DIV",
        (ref: RefFn) => (
          <ColorPicker.Slider channel="hue" colorSpace="hsl">
            <ColorPicker.SliderTrack ref={ref}>
              <ColorPicker.Thumb />
            </ColorPicker.SliderTrack>
          </ColorPicker.Slider>
        ),
      ],
      [
        "ColorPicker.Thumb",
        "DIV",
        (ref: RefFn) => (
          <ColorPicker.Slider channel="hue" colorSpace="hsl">
            <ColorPicker.SliderTrack>
              <ColorPicker.Thumb ref={ref} />
            </ColorPicker.SliderTrack>
          </ColorPicker.Slider>
        ),
      ],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [
      name,
      tag,
      (ref) => <ColorPicker.Root defaultValue="#3366ff">{ui(ref)}</ColorPicker.Root>,
    ],
  ),
  [
    "ColorPresets.Swatch",
    "SPAN",
    (ref) => (
      <ColorPresets.Root>
        <ColorPresets.Trigger asChild>
          <Button.Root>
            <ColorPresets.Swatch ref={ref} />
            Цвет
          </Button.Root>
        </ColorPresets.Trigger>
      </ColorPresets.Root>
    ),
  ],
  [
    "ColorPresets.Content",
    "DIV",
    (ref) => (
      <ColorPresets.Root defaultOpen>
        <ColorPresets.Trigger />
        <ColorPresets.Content ref={ref} />
      </ColorPresets.Root>
    ),
  ],

  // ── Overlays ──
  ...(
    [
      [
        "Content",
        "DIV",
        (ref: RefFn, D: typeof Modal | typeof Drawer) => (
          <D.Content ref={ref} aria-label="Окно">
            Текст
          </D.Content>
        ),
      ],
      [
        "Header",
        "HEADER",
        (ref: RefFn, D: typeof Modal | typeof Drawer) => (
          <D.Content>
            <D.Header ref={ref}>
              <D.Title>Заказ</D.Title>
            </D.Header>
          </D.Content>
        ),
      ],
      [
        "Icon",
        "SPAN",
        (ref: RefFn, D: typeof Modal | typeof Drawer) => (
          <D.Content aria-label="Окно">
            <D.Header>
              <D.Icon ref={ref}>!</D.Icon>
            </D.Header>
          </D.Content>
        ),
      ],
      [
        "Title",
        "H2",
        (ref: RefFn, D: typeof Modal | typeof Drawer) => (
          <D.Content>
            <D.Header>
              <D.Title ref={ref}>Заказ</D.Title>
            </D.Header>
          </D.Content>
        ),
      ],
      [
        "Description",
        "P",
        (ref: RefFn, D: typeof Modal | typeof Drawer) => (
          <D.Content aria-label="Окно">
            <D.Header>
              <D.Description ref={ref}>Детали</D.Description>
            </D.Header>
          </D.Content>
        ),
      ],
      [
        "Body",
        "DIV",
        (ref: RefFn, D: typeof Modal | typeof Drawer) => (
          <D.Content aria-label="Окно">
            <D.Body ref={ref}>Текст</D.Body>
          </D.Content>
        ),
      ],
      [
        "Footer",
        "FOOTER",
        (ref: RefFn, D: typeof Modal | typeof Drawer) => (
          <D.Content aria-label="Окно">
            <D.Footer ref={ref}>
              <Button.Root>Готово</Button.Root>
            </D.Footer>
          </D.Content>
        ),
      ],
    ] as const
  ).flatMap(([part, tag, ui]): Case[] => [
    [`Modal.${part}`, tag, (ref) => <Modal.Root defaultOpen>{ui(ref, Modal)}</Modal.Root>],
    [`Drawer.${part}`, tag, (ref) => <Drawer.Root defaultOpen>{ui(ref, Drawer)}</Drawer.Root>],
  ]),
  ...(
    [
      [
        "Popover.Header",
        "DIV",
        (ref: RefFn) => (
          <Popover.Header ref={ref}>
            <Popover.Title>Фильтр</Popover.Title>
          </Popover.Header>
        ),
      ],
      ["Popover.Title", "H2", (ref: RefFn) => <Popover.Title ref={ref}>Фильтр</Popover.Title>],
      [
        "Popover.Description",
        "P",
        (ref: RefFn) => <Popover.Description ref={ref}>Условия</Popover.Description>,
      ],
      [
        "Popover.Actions",
        "DIV",
        (ref: RefFn) => (
          <Popover.Actions ref={ref}>
            <Button.Root>Применить</Button.Root>
          </Popover.Actions>
        ),
      ],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [
      name,
      tag,
      (ref) => (
        <Popover.Root defaultOpen>
          <Popover.Trigger>
            <Button.Root>Открыть</Button.Root>
          </Popover.Trigger>
          <Popover.Content aria-label="Фильтр">{ui(ref)}</Popover.Content>
        </Popover.Root>
      ),
    ],
  ),
  ...(
    [
      [
        "Dropdown.ItemIcon",
        "SPAN",
        (ref: RefFn) => (
          <Dropdown.Item>
            <Dropdown.ItemIcon ref={ref}>★</Dropdown.ItemIcon>
            Изменить
          </Dropdown.Item>
        ),
      ],
      [
        "Dropdown.ItemShortcut",
        "KBD",
        (ref: RefFn) => (
          <Dropdown.Item>
            Изменить
            <Dropdown.ItemShortcut ref={ref}>E</Dropdown.ItemShortcut>
          </Dropdown.Item>
        ),
      ],
      [
        "Dropdown.Group",
        "DIV",
        (ref: RefFn) => (
          <Dropdown.Group ref={ref} label="Действия">
            <Dropdown.Item>Изменить</Dropdown.Item>
          </Dropdown.Group>
        ),
      ],
      ["Dropdown.Separator", "DIV", (ref: RefFn) => <Dropdown.Separator ref={ref} />],
      [
        "Dropdown.Header",
        "DIV",
        (ref: RefFn) => (
          <Dropdown.Header ref={ref}>
            <Dropdown.Title>Анна</Dropdown.Title>
          </Dropdown.Header>
        ),
      ],
      [
        "Dropdown.Title",
        "DIV",
        (ref: RefFn) => (
          <Dropdown.Header>
            <Dropdown.Title ref={ref}>Анна</Dropdown.Title>
          </Dropdown.Header>
        ),
      ],
      [
        "Dropdown.Description",
        "DIV",
        (ref: RefFn) => (
          <Dropdown.Header>
            <Dropdown.Title>Анна</Dropdown.Title>
            <Dropdown.Description ref={ref}>anna@prime.ru</Dropdown.Description>
          </Dropdown.Header>
        ),
      ],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [
      name,
      tag,
      (ref) => (
        <Dropdown.Root defaultOpen>
          <Dropdown.Trigger>
            <Button.Root>Меню</Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {ui(ref)}
            <Dropdown.Item>Удалить</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      ),
    ],
  ),
  [
    "CommandMenu.Root",
    "DIV",
    (ref) => (
      <CommandMenu.Root ref={ref} defaultOpen aria-label="Команды">
        <CommandMenu.Input />
      </CommandMenu.Root>
    ),
  ],
  ...(
    [
      [
        "CommandMenu.Title",
        "H2",
        (ref: RefFn) => <CommandMenu.Title ref={ref}>Команды</CommandMenu.Title>,
      ],
      [
        "CommandMenu.Description",
        "P",
        (ref: RefFn) => <CommandMenu.Description ref={ref}>Поиск</CommandMenu.Description>,
      ],
      [
        "CommandMenu.Group",
        "DIV",
        (ref: RefFn) => (
          <CommandMenu.List>
            <CommandMenu.Group ref={ref} label="Заказы">
              <CommandMenu.Item value="Создать заказ">Создать заказ</CommandMenu.Item>
            </CommandMenu.Group>
          </CommandMenu.List>
        ),
      ],
      [
        "CommandMenu.ItemIcon",
        "SPAN",
        (ref: RefFn) => (
          <CommandMenu.List>
            <CommandMenu.Item value="Создать">
              <CommandMenu.ItemIcon ref={ref}>+</CommandMenu.ItemIcon>
              Создать
            </CommandMenu.Item>
          </CommandMenu.List>
        ),
      ],
      [
        "CommandMenu.ItemText",
        "SPAN",
        (ref: RefFn) => (
          <CommandMenu.List>
            <CommandMenu.Item value="Создать">
              <CommandMenu.ItemText ref={ref}>Создать</CommandMenu.ItemText>
            </CommandMenu.Item>
          </CommandMenu.List>
        ),
      ],
      [
        "CommandMenu.ItemShortcut",
        "KBD",
        (ref: RefFn) => (
          <CommandMenu.List>
            <CommandMenu.Item value="Создать">
              Создать
              <CommandMenu.ItemShortcut ref={ref}>N</CommandMenu.ItemShortcut>
            </CommandMenu.Item>
          </CommandMenu.List>
        ),
      ],
      [
        "CommandMenu.Empty",
        "DIV",
        (ref: RefFn) => (
          <CommandMenu.List>
            <CommandMenu.Empty ref={ref} />
          </CommandMenu.List>
        ),
      ],
      [
        "CommandMenu.Footer",
        "DIV",
        (ref: RefFn) => (
          <CommandMenu.Footer ref={ref}>
            <CommandMenu.FooterHint keys={["↵"]}>Выбрать</CommandMenu.FooterHint>
          </CommandMenu.Footer>
        ),
      ],
      [
        "CommandMenu.FooterHint",
        "SPAN",
        (ref: RefFn) => (
          <CommandMenu.Footer>
            <CommandMenu.FooterHint ref={ref} keys={["↵"]}>
              Выбрать
            </CommandMenu.FooterHint>
          </CommandMenu.Footer>
        ),
      ],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [
      name,
      tag,
      (ref) => (
        <CommandMenu.Root defaultOpen aria-label="Команды">
          <CommandMenu.Input />
          {ui(ref)}
        </CommandMenu.Root>
      ),
    ],
  ),
  ["NotificationCard", "ARTICLE", (ref) => <NotificationCard ref={ref} title="Счёт отправлен" />],

  // ── Composites and layout ──
  ...(
    [
      [
        "PageContent.Header",
        (ref: RefFn) => <PageContent.Header ref={ref}>Заказы</PageContent.Header>,
      ],
      [
        "PageContent.Actions",
        (ref: RefFn) => (
          <PageContent.Header>
            <PageContent.Title>Заказы</PageContent.Title>
            <PageContent.Actions ref={ref}>
              <Button.Root>Создать</Button.Root>
            </PageContent.Actions>
          </PageContent.Header>
        ),
      ],
      ["PageContent.Body", (ref: RefFn) => <PageContent.Body ref={ref}>Блоки</PageContent.Body>],
    ] as const
  ).map(
    ([name, ui]): Case => [name, "DIV", (ref) => <PageContent.Root>{ui(ref)}</PageContent.Root>],
  ),
  ...(
    [
      [
        "LoginForm.Header",
        "HEADER",
        (ref: RefFn) => <LoginForm.Header ref={ref}>Вход</LoginForm.Header>,
      ],
      ["LoginForm.Logo", "DIV", (ref: RefFn) => <LoginForm.Logo ref={ref}>P</LoginForm.Logo>],
      ["LoginForm.Title", "H1", (ref: RefFn) => <LoginForm.Title ref={ref}>Вход</LoginForm.Title>],
      [
        "LoginForm.Description",
        "P",
        (ref: RefFn) => <LoginForm.Description ref={ref}>Рабочая почта</LoginForm.Description>,
      ],
      ["LoginForm.Body", "DIV", (ref: RefFn) => <LoginForm.Body ref={ref}>Форма</LoginForm.Body>],
      [
        "LoginForm.Actions",
        "DIV",
        (ref: RefFn) => (
          <LoginForm.Actions ref={ref}>
            <Button.Root>Войти</Button.Root>
          </LoginForm.Actions>
        ),
      ],
      [
        "LoginForm.Footer",
        "P",
        (ref: RefFn) => <LoginForm.Footer ref={ref}>Нет аккаунта?</LoginForm.Footer>,
      ],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [name, tag, (ref) => <LoginForm.Root>{ui(ref)}</LoginForm.Root>],
  ),
  ...(
    [
      ["Timeline.Title", (ref: RefFn) => <Timeline.Title ref={ref}>Оплата</Timeline.Title>],
      ["Timeline.Meta", (ref: RefFn) => <Timeline.Meta ref={ref}>12:04</Timeline.Meta>],
      [
        "Timeline.MetaPrimary",
        (ref: RefFn) => (
          <Timeline.Meta>
            <Timeline.MetaPrimary ref={ref}>21.09</Timeline.MetaPrimary>
          </Timeline.Meta>
        ),
      ],
      ["Timeline.Value", (ref: RefFn) => <Timeline.Value ref={ref}>₽ 600</Timeline.Value>],
      [
        "Timeline.ValueMeta",
        (ref: RefFn) => (
          <Timeline.Value>
            ₽ 600<Timeline.ValueMeta ref={ref}>аренда</Timeline.ValueMeta>
          </Timeline.Value>
        ),
      ],
    ] as const
  ).map(
    ([name, ui]): Case => [
      name,
      "SPAN",
      (ref) => (
        <Timeline.Root>
          <Timeline.Group label="Недавно">
            <Timeline.Item>
              <Timeline.Title>Событие</Timeline.Title>
              {ui(ref)}
            </Timeline.Item>
          </Timeline.Group>
        </Timeline.Root>
      ),
    ],
  ),
  [
    "SmartFilter.Root",
    "DIV",
    (ref) => (
      <SmartFilter.Root ref={ref} fields={[]}>
        <SmartFilter.Toolbar />
      </SmartFilter.Root>
    ),
  ],
  [
    "SmartFilter.Toolbar",
    "DIV",
    (ref) => (
      <SmartFilter.Root fields={[]}>
        <SmartFilter.Toolbar ref={ref} />
      </SmartFilter.Root>
    ),
  ],
  [
    "SmartFilter.Chips",
    "DIV",
    (ref) => (
      <SmartFilter.Root
        fields={[{ key: "state", label: "Статус", options: [{ value: "new", label: "Новый" }] }]}
        defaultValue={{ state: { include: ["new"], exclude: [] } }}
      >
        <SmartFilter.Chips ref={ref} />
      </SmartFilter.Root>
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
    "AppShell.Nav",
    "DIV",
    (ref) => (
      <AppShell.Root>
        <AppShell.Nav ref={ref}>Навигация</AppShell.Nav>
      </AppShell.Root>
    ),
  ],
  ...(
    [
      [
        "Sidebar.Header",
        "DIV",
        (ref: RefFn) => (
          <Sidebar.Header ref={ref}>
            <Sidebar.Brand>Прайм</Sidebar.Brand>
          </Sidebar.Header>
        ),
      ],
      [
        "Sidebar.BrandLogo",
        "SPAN",
        (ref: RefFn) => (
          <Sidebar.Header>
            <Sidebar.Brand>
              <Sidebar.BrandLogo ref={ref}>P</Sidebar.BrandLogo>
              Прайм
            </Sidebar.Brand>
          </Sidebar.Header>
        ),
      ],
      [
        "Sidebar.Footer",
        "DIV",
        (ref: RefFn) => (
          <Sidebar.Footer ref={ref}>
            <Sidebar.Toggle />
          </Sidebar.Footer>
        ),
      ],
      [
        "Sidebar.Group",
        "DIV",
        (ref: RefFn) => (
          <Sidebar.Content>
            <Sidebar.Group ref={ref} label="Разделы">
              <Sidebar.Item>Главная</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
        ),
      ],
      [
        "Sidebar.ItemIcon",
        "SPAN",
        (ref: RefFn) => (
          <Sidebar.Content>
            <Sidebar.Item>
              <Sidebar.ItemIcon ref={ref}>⌂</Sidebar.ItemIcon>
              Главная
            </Sidebar.Item>
          </Sidebar.Content>
        ),
      ],
      [
        "Sidebar.ItemCount",
        "SPAN",
        (ref: RefFn) => (
          <Sidebar.Content>
            <Sidebar.Item>
              Входящие
              <Sidebar.ItemCount ref={ref}>5</Sidebar.ItemCount>
            </Sidebar.Item>
          </Sidebar.Content>
        ),
      ],
      [
        "Sidebar.ItemShortcut",
        "SPAN",
        (ref: RefFn) => (
          <Sidebar.Content>
            <Sidebar.Item>
              Поиск
              <Sidebar.ItemShortcut ref={ref}>⌘K</Sidebar.ItemShortcut>
            </Sidebar.Item>
          </Sidebar.Content>
        ),
      ],
      [
        "Sidebar.ItemAction",
        "BUTTON",
        (ref: RefFn) => (
          <Sidebar.Content>
            <Sidebar.Item>
              Задачи
              <Sidebar.ItemAction ref={ref} label="Создать задачу" onClick={() => {}} />
            </Sidebar.Item>
          </Sidebar.Content>
        ),
      ],
      [
        "Sidebar.Sub",
        "DIV",
        (ref: RefFn) => (
          <Sidebar.Sub ref={ref}>
            <Sidebar.SubTrigger>Задачи</Sidebar.SubTrigger>
            <Sidebar.SubContent>
              <Sidebar.Item>Бэклог</Sidebar.Item>
            </Sidebar.SubContent>
          </Sidebar.Sub>
        ),
      ],
      [
        "Sidebar.SubContent",
        "DIV",
        (ref: RefFn) => (
          <Sidebar.Sub>
            <Sidebar.SubTrigger>Задачи</Sidebar.SubTrigger>
            <Sidebar.SubContent ref={ref}>
              <Sidebar.Item>Бэклог</Sidebar.Item>
            </Sidebar.SubContent>
          </Sidebar.Sub>
        ),
      ],
    ] satisfies Case[]
  ).map(
    ([name, tag, ui]): Case => [
      name,
      tag,
      (ref) => <Sidebar.Root offCanvas="never">{ui(ref)}</Sidebar.Root>,
    ],
  ),
];

describe("part refs", () => {
  it.each(CASES)("%s → <%s>", (_name, tag, ui) => {
    let node: Element | null = null;
    render(
      <>
        {ui((element) => {
          if (element) node = element;
        })}
      </>,
    );
    expect(node).not.toBeNull();
    expect((node as unknown as Element).tagName.toUpperCase()).toBe(tag.toUpperCase());
    expect(document.body.contains(node)).toBe(true);
  });
});
