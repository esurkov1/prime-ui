import { Search } from "lucide-react";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Input } from "@/components/input/Input";
import { Kbd } from "@/components/kbd/Kbd";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Select } from "@/components/select/Select";
import { Typography } from "@/components/typography/Typography";

import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoDescription } from "../components/PlaygroundDemoTypography";
import { FoundationPage, FoundationSection, Panel, RuleList, TokenTable } from "./FoundationKit";
import s from "./foundation.module.css";
import { formatPx, SIZE_TIERS, type SizeTier, semanticPx } from "./tokenModel";

const px = (path: string) => formatPx(semanticPx(path));
const pair = (size: string, lh: string) => `${px(size)}/${px(lh)}`;

/** Columns of foundation §6; every cell is read from `semanticTokens.control.<tier>`. */
const COLUMNS: { head: string; cell: (t: SizeTier) => string }[] = [
  { head: "Высота", cell: (t) => px(`control.${t}.height`) },
  { head: "Текст", cell: (t) => pair(`control.${t}.textSize`, `control.${t}.lineHeight`) },
  { head: "Кнопка padX", cell: (t) => px(`control.${t}.paddingX`) },
  { head: "Поле padX", cell: (t) => px(`control.${t}.fieldPaddingX`) },
  { head: "Gap", cell: (t) => px(`control.${t}.gap`) },
  { head: "Иконка", cell: (t) => px(`control.${t}.icon`) },
  { head: "Радиус", cell: (t) => px(`control.${t}.radius`) },
  { head: "Подпись", cell: (t) => pair(`control.${t}.labelSize`, `control.${t}.labelLineHeight`) },
  { head: "Подсказка", cell: (t) => pair(`control.${t}.hintSize`, `control.${t}.hintLineHeight`) },
  { head: "Пункт меню", cell: (t) => px(`control.${t}.itemHeight`) },
  { head: "Checkbox", cell: (t) => px(`control.${t}.choice`) },
  { head: "Дорожка", cell: (t) => px(`control.${t}.track`) },
];

const TIER_COLUMNS: DataTableColumn<SizeTier>[] = [
  {
    id: "tier",
    header: "Уровень",
    cell: (t) => (
      <span className={s.tierCell}>
        {t}
        {t === "m" ? <Badge.Root color="blue">по умолчанию</Badge.Root> : null}
      </span>
    ),
  },
  ...COLUMNS.map(
    (c): DataTableColumn<SizeTier> => ({
      id: c.head,
      header: c.head,
      numeric: true,
      cell: (t) => c.cell(t),
    }),
  ),
];

function TierTable() {
  return <TokenTable columns={TIER_COLUMNS} rows={[...SIZE_TIERS]} getRowKey={(t) => t} />;
}

/** One row of real kit controls of a tier: heights match, the text shares one baseline. */
function TierRow({ t }: { t: SizeTier }) {
  return (
    <div className={s.tierRow}>
      <Typography.Root as="span" variant="caption" tone="muted" className={s.tierName}>
        {t} · {px(`control.${t}.height`)}
      </Typography.Root>
      <div className={s.tierItems}>
        <Button.Root size={t}>
          <Button.Icon>
            <Search />
          </Button.Icon>
          Сохранить
        </Button.Root>
        <Button.Root size={t} variant="soft" tone="neutral">
          Отмена
        </Button.Root>
        <Button.Root size={t} variant="soft" tone="neutral" aria-label="Поиск">
          <Button.Icon>
            <Search />
          </Button.Icon>
        </Button.Root>
        <Input.Root size={t} className={s.tierInput}>
          <Input.Wrapper>
            <Input.Field aria-label={`Поиск, размер ${t}`} placeholder="Поиск" />
            <Input.InlineAffix side="end">
              <Kbd>⌘K</Kbd>
            </Input.InlineAffix>
          </Input.Wrapper>
        </Input.Root>
        <SegmentedControl.Root size={t} defaultValue="day" aria-label={`Период, размер ${t}`}>
          <SegmentedControl.Item value="day">День</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Checkbox.Root size={t} defaultChecked>
          <Checkbox.Label>Все</Checkbox.Label>
        </Checkbox.Root>
      </div>
    </div>
  );
}

function TierLiveRows() {
  return (
    <Panel className={s.tierPanel}>
      {SIZE_TIERS.map((t) => (
        <TierRow key={t} t={t} />
      ))}
    </Panel>
  );
}

/** A Select of one tier with its label and hint: open it to see the menu items of the same tier. */
function PairingDemo() {
  return (
    <div className={s.pairingGrid}>
      {(["s", "m", "l"] as const).map((t) => (
        <Panel key={t} className={s.pairingCard}>
          <Typography.Root as="span" variant="caption" tone="muted">
            Уровень {t}
          </Typography.Root>
          <Select.Root
            size={t}
            defaultValue="msk"
            label="Город"
            hint="Подсказка мельче текста поля"
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="msk">Москва</Select.Item>
              <Select.Item value="kzn">Казань</Select.Item>
              <Select.Item value="smr">Самара</Select.Item>
            </Select.Content>
          </Select.Root>
        </Panel>
      ))}
    </div>
  );
}

const BADGE_TABLE_COLUMNS: DataTableColumn<SizeTier>[] = [
  { id: "tier", header: "Badge", accessor: (t) => t },
  ...(
    [
      ["height", "Высота"],
      ["paddingX", "padX"],
      ["textSize", "Текст"],
      ["icon", "Иконка"],
      ["gap", "Gap"],
      ["radius", "Радиус"],
    ] as const
  ).map(
    ([k, head]): DataTableColumn<SizeTier> => ({
      id: k,
      header: head,
      numeric: true,
      cell: (t) => px(`badge.${t}.${k}`),
    }),
  ),
  { id: "sample", header: "", cell: (t) => <Badge.Root size={t}>Новый</Badge.Root> },
];

function BadgeTable() {
  return <TokenTable columns={BADGE_TABLE_COLUMNS} rows={[...SIZE_TIERS]} getRowKey={(t) => t} />;
}

const providerRows: PlaygroundApiPropRow[] = [
  {
    prop: "value",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: "—",
    required: "Да",
    description: "Уровень размера, который получат дочерние компоненты без явного `size`.",
  },
  {
    prop: "children",
    type: "React.ReactNode",
    defaultValue: "—",
    required: "Да",
    description: "Поддерево, в котором действует контекст.",
  },
];

export default function SizeTiersPage() {
  return (
    <FoundationPage
      title="Размеры"
      description={
        <>
          Одна ось размеров для всех контролов: <code>xs · s · m · l · xl</code>, по умолчанию{" "}
          <code>m</code>. Контролы одного уровня стоят в ряд без подгонки: Button, Input, Select,
          Datepicker, SegmentedControl, Tabs. Переменные:{" "}
          <code>--prime-control-&lt;tier&gt;-*</code>.
        </>
      }
    >
      <FoundationSection
        title="Таблица уровней"
        description="Значения в пикселях, прочитаны из semanticTokens.control."
      >
        <TierTable />
      </FoundationSection>

      <FoundationSection
        title="В одну линию"
        description="Каждая строка собрана из настоящих компонентов кита своего уровня. Высоты совпадают, базовая линия текста общая."
      >
        <TierLiveRows />
      </FoundationSection>

      <FoundationSection title="Правила пар">
        <RuleList>
          <li>
            Поле уровня T берёт подпись и подсказку того же уровня. Подсказка и ошибка всегда мельче
            текста поля.
          </li>
          <li>
            Меню, открытое от триггера уровня T, использует <code>item-height</code> того же уровня
            и тот же кегль.
          </li>
          <li>
            Badge и Kbd внутри контрола уровня T берут badge-уровень на ступень ниже: в поле{" "}
            <code>m</code> стоит badge <code>s</code>.
          </li>
          <li>Кнопка только с иконкой квадратная: ширина равна высоте.</li>
          <li>
            В поле иконка стоит посередине между краем и текстом: край → иконка = иконка → текст ={" "}
            <code>field-padding-x</code> уровня. Это касается и шеврона, и кнопки очистки.
          </li>
          <li>
            В кнопке со стороны иконки отступ на 4 px меньше: <code>padX − 4px</code>, но не меньше
            8 px. Так иконка и подпись выглядят одной группой по центру.
          </li>
        </RuleList>
        <PairingDemo />
      </FoundationSection>

      <FoundationSection
        title="Badge, Kbd"
        description={
          <>
            Свои уровни высоты 16 · 20 · 24 · 28 · 32: <code>--prime-badge-&lt;tier&gt;-*</code>.
          </>
        }
      >
        <BadgeTable />
      </FoundationSection>

      <FoundationSection
        title="ControlSizeProvider"
        description={
          <>
            Передаёт уровень вниз по дереву. Компоненты без явного <code>size</code> (например,{" "}
            <code>Icon</code>) берут его из ближайшего провайдера. Хук{" "}
            <code>useOptionalControlSize()</code> возвращает уровень или <code>undefined</code> вне
            провайдера.
          </>
        }
      >
        <DemoApiTitle>ControlSizeProvider</DemoApiTitle>
        <PlaygroundApiTable rows={providerRows} />
        <DemoDescription>
          Явный <code>size</code> на компоненте всегда важнее контекста.
        </DemoDescription>
      </FoundationSection>
    </FoundationPage>
  );
}
