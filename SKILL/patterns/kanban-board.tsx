/** A sales pipeline board: header with one primary action, search and filter with a board / list switch, a Kanban of deals by stage with totals, moves saved on the server that can be refused, movable stages and the deal in a Drawer. */
import {
  Avatar,
  Badge,
  Button,
  Crossfade,
  DataTable,
  type DataTableColumn,
  DescriptionList,
  Drawer,
  Dropdown,
  EmptyPage,
  Icon,
  Kanban,
  type KanbanColumn,
  type KanbanValue,
  matchesSmartFilter,
  PageContent,
  PageToolbar,
  type PaletteColor,
  SegmentedControl,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
  Typography,
  useNotifications,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./kanban-board.module.css";

type Owner = { name: string; initials: string; color: PaletteColor };

type Deal = {
  id: string;
  company: string;
  amount: number;
  owner: Owner;
  due: string;
  contact: string;
  source: string;
  probability: number;
  contract: boolean;
  comments: number;
  tags: { text: string; color: PaletteColor }[];
};

type DealRow = Deal & { stage: string };

/** The stages of the pipeline; the first and the last are system stages and stay in place. */
const STAGES: KanbanColumn[] = [
  {
    id: "new",
    title: "Новая",
    description: "Связаться в течение дня",
    color: "blue",
    locked: true,
  },
  { id: "qualified", title: "Квалификация", description: "Бюджет и сроки", color: "purple" },
  { id: "proposal", title: "Предложение", description: "КП отправлено", color: "orange" },
  { id: "negotiation", title: "Переговоры", description: "Условия договора", color: "yellow" },
  { id: "won", title: "Выиграна", description: "Договор подписан", color: "green", locked: true },
];

const ANNA: Owner = { name: "Анна Климова", initials: "АК", color: "purple" };
const ILYA: Owner = { name: "Илья Петров", initials: "ИП", color: "teal" };
const MARAT: Owner = { name: "Марат Хасанов", initials: "МХ", color: "orange" };

const DEALS: Deal[] = [
  {
    id: "DL-341",
    company: "ООО «Северный ветер»",
    amount: 480_000,
    owner: ANNA,
    due: "2026-10-24",
    contact: "Ольга Белова, закупки",
    source: "Сайт",
    probability: 20,
    contract: false,
    comments: 2,
    tags: [{ text: "Входящая", color: "sky" }],
  },
  {
    id: "DL-338",
    company: "АО «Техностиль»",
    amount: 1_240_000,
    owner: ILYA,
    due: "2026-10-30",
    contact: "Дмитрий Орлов, ИТ-директор",
    source: "Выставка",
    probability: 25,
    contract: false,
    comments: 0,
    tags: [{ text: "Тендер", color: "blue" }],
  },
  {
    id: "DL-332",
    company: "ООО «Логистик Плюс»",
    amount: 312_000,
    owner: MARAT,
    due: "2026-10-19",
    contact: "Сергей Ким, операционный директор",
    source: "Рекомендация",
    probability: 40,
    contract: false,
    comments: 4,
    tags: [{ text: "Повторная", color: "green" }],
  },
  {
    id: "DL-327",
    company: "ООО «Гранит»",
    amount: 94_750,
    owner: ANNA,
    due: "2026-10-12",
    contact: "Наталья Фомина, финансы",
    source: "Сайт",
    probability: 40,
    contract: false,
    comments: 1,
    tags: [{ text: "Просрочена", color: "red" }],
  },
  {
    id: "DL-321",
    company: "ЗАО «Альфа Медиа»",
    amount: 760_000,
    owner: ILYA,
    due: "2026-10-28",
    contact: "Екатерина Лаптева, маркетинг",
    source: "Холодный звонок",
    probability: 60,
    contract: false,
    comments: 6,
    tags: [{ text: "Горячая", color: "orange" }],
  },
  {
    id: "DL-316",
    company: "ООО «Мостострой»",
    amount: 2_480_000,
    owner: MARAT,
    due: "2026-11-06",
    contact: "Андрей Зуев, генеральный директор",
    source: "Рекомендация",
    probability: 75,
    contract: true,
    comments: 9,
    tags: [
      { text: "Тендер", color: "blue" },
      { text: "Горячая", color: "orange" },
    ],
  },
  {
    id: "DL-309",
    company: "АО «Волга-Энерго»",
    amount: 1_095_000,
    owner: ANNA,
    due: "2026-10-21",
    contact: "Игорь Щукин, закупки",
    source: "Выставка",
    probability: 80,
    contract: false,
    comments: 3,
    tags: [{ text: "Ждём подпись", color: "yellow" }],
  },
  {
    id: "DL-298",
    company: "ООО «Зелёный квартал»",
    amount: 205_300,
    owner: ILYA,
    due: "2026-10-08",
    contact: "Мария Глебова, офис-менеджер",
    source: "Сайт",
    probability: 100,
    contract: true,
    comments: 2,
    tags: [{ text: "Повторная", color: "green" }],
  },
];

const PLACEMENT: KanbanValue = {
  new: ["DL-341", "DL-338"],
  qualified: ["DL-332", "DL-327"],
  proposal: ["DL-321"],
  negotiation: ["DL-316", "DL-309"],
  won: ["DL-298"],
};

const BY_ID = new Map(DEALS.map((deal) => [deal.id, deal]));
const STAGE_BY_ID = new Map(STAGES.map((stage) => [stage.id, stage]));
const OWNERS = [ANNA, ILYA, MARAT];

const RUBLES = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});
const DAY = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });

const FIELDS: SmartFilterField[] = [
  {
    key: "stage",
    label: "Этап",
    options: STAGES.map((stage) => ({ value: stage.id, label: stage.title })),
  },
  {
    key: "owner",
    label: "Ответственный",
    options: OWNERS.map((owner) => ({ value: owner.name, label: owner.name })),
  },
];

const LOAD_MS = 900;
const SAVE_MS = 800;

const dealsWord = (count: number) => {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return "сделок";
  if (ones === 1) return "сделка";
  if (ones >= 2 && ones <= 4) return "сделки";
  return "сделок";
};

const stageOf = (placement: KanbanValue, id: string) =>
  Object.keys(placement).find((stage) => placement[stage]?.includes(id)) ?? "new";

/** `placement` with deal `id` moved to the top of stage `to`. */
const placeOnTop = (placement: KanbanValue, id: string, to: string): KanbanValue => {
  const next: Record<string, readonly string[]> = {};
  for (const stage of Object.keys(placement)) {
    next[stage] = (placement[stage] ?? []).filter((card) => card !== id);
  }
  next[to] = [id, ...(next[to] ?? [])];
  return next;
};

/** The server's answer to a stage change, a beat later: no signed contract — no won deal. */
function saveStage(deal: Deal, to: string) {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (to === "won" && !deal.contract) {
        reject(new Error(`${deal.company}: договор ещё не подписан`));
      } else {
        resolve();
      }
    }, SAVE_MS);
  });
}

/** The server's answer to a new order of the stages. */
function saveStageOrder() {
  return new Promise<void>((resolve) => window.setTimeout(resolve, SAVE_MS));
}

const ownerAvatar = (owner: Owner) => (
  <Avatar.Root size="s" color={owner.color} aria-label={owner.name}>
    <Avatar.Fallback>{owner.initials}</Avatar.Fallback>
  </Avatar.Root>
);

const stageBadge = (stageId: string) => {
  const stage = STAGE_BY_ID.get(stageId);
  return <Badge.Root color={stage?.color}>{stage?.title}</Badge.Root>;
};

const COLUMNS: DataTableColumn<DealRow>[] = [
  {
    id: "company",
    header: "Компания",
    accessor: "company",
    sortable: true,
    cell: (row) => (
      <span className={styles.company}>
        <Typography as="span" variant="body-m">
          {row.company}
        </Typography>
        <Typography as="span" variant="caption" tone="muted">
          {row.id}
        </Typography>
      </span>
    ),
  },
  { id: "stage", header: "Этап", accessor: "stage", cell: (row) => stageBadge(row.stage) },
  {
    id: "owner",
    header: "Ответственный",
    cell: (row) => (
      <span className={styles.owner}>
        {ownerAvatar(row.owner)}
        {row.owner.name}
      </span>
    ),
  },
  {
    id: "due",
    header: "Срок",
    accessor: "due",
    sortable: true,
    numeric: true,
    headerAlign: "end",
    cell: (row) => DAY.format(new Date(row.due)),
  },
  {
    id: "amount",
    header: "Сумма",
    accessor: "amount",
    sortable: true,
    numeric: true,
    headerAlign: "end",
    cell: (row) => RUBLES.format(row.amount),
  },
];

export default function KanbanBoardPattern() {
  const { notify } = useNotifications();
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState("board");
  const [filter, setFilter] = React.useState<SmartFilterValue>({});
  const [search, setSearch] = React.useState("");
  const [placement, setPlacement] = React.useState(PLACEMENT);
  const [stageOrder, setStageOrder] = React.useState<readonly string[]>(
    STAGES.map((stage) => stage.id),
  );
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // The first load: skeleton cards and rows hold the geometry until the deals arrive.
  React.useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const query = search.trim().toLowerCase();
  const deals = DEALS.filter(
    (deal) =>
      matchesSmartFilter(filter.stage, stageOf(placement, deal.id)) &&
      matchesSmartFilter(filter.owner, deal.owner.name) &&
      (deal.company.toLowerCase().includes(query) || deal.id.toLowerCase().includes(query)),
  );
  const rows: DealRow[] = deals.map((deal) => ({ ...deal, stage: stageOf(placement, deal.id) }));
  const shown = new Set(deals.map((deal) => deal.id));

  const figures = (column: KanbanColumn) => {
    const ids = (placement[column.id] ?? []).filter((id) => shown.has(id));
    const sum = ids.reduce((total, id) => total + (BY_ID.get(id)?.amount ?? 0), 0);
    return `${ids.length} ${dealsWord(ids.length)} · ${RUBLES.format(sum)}`;
  };

  const refuse = (error: unknown) =>
    notify({
      tone: "danger",
      title: "Этап не изменён",
      description: error instanceof Error ? error.message : String(error),
    });

  const openDeal = (id: string) => {
    setOpenId(id);
    setDrawerOpen(true);
  };

  const resetFilters = () => {
    setFilter({});
    setSearch("");
  };

  // From the drawer: the stage changes only after the server agrees.
  const moveDeal = async (deal: Deal, to: string) => {
    setSaving(true);
    try {
      await saveStage(deal, to);
      setPlacement((current) => placeOnTop(current, deal.id, to));
      notify({
        tone: "success",
        title: `Сделка на этапе «${STAGE_BY_ID.get(to)?.title}»`,
        description: deal.company,
      });
    } catch (error) {
      refuse(error);
    } finally {
      setSaving(false);
    }
  };

  const deal = openId === null ? undefined : BY_ID.get(openId);
  const dealStage = deal ? stageOf(placement, deal.id) : "new";
  const nextStage = STAGE_BY_ID.get(stageOrder[stageOrder.indexOf(dealStage) + 1] ?? "");

  return (
    <PageContent.Page aria-labelledby="deals-title">
      <PageContent.Header>
        <PageContent.Title id="deals-title">Сделки</PageContent.Title>
        <PageContent.Description>
          Воронка отдела продаж: перетащите сделку на следующий этап или откройте её карточку.
        </PageContent.Description>
        <PageContent.Actions>
          <Button.Root variant="soft" tone="neutral">
            <Button.Icon>
              <Icon name="action.download" />
            </Button.Icon>
            Экспорт
          </Button.Root>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Новая сделка
          </Button.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>
        <div className={styles.workspace}>
          <SmartFilter.Root
            fields={FIELDS}
            value={filter}
            onValueChange={setFilter}
            search={search}
            onSearchChange={setSearch}
          >
            <PageToolbar.Root aria-label="Сделки">
              <PageToolbar.Tools>
                <SmartFilter.Toolbar />
              </PageToolbar.Tools>
              <PageToolbar.View>
                <SegmentedControl.Root value={view} onValueChange={setView} aria-label="Вид">
                  <SegmentedControl.Item value="board">
                    <SegmentedControl.Icon>
                      <Icon name="view.columns" />
                    </SegmentedControl.Icon>
                    Доска
                  </SegmentedControl.Item>
                  <SegmentedControl.Item value="list">
                    <SegmentedControl.Icon>
                      <Icon name="format.list" />
                    </SegmentedControl.Icon>
                    Список
                  </SegmentedControl.Item>
                </SegmentedControl.Root>
              </PageToolbar.View>
              <PageToolbar.Chips>
                <SmartFilter.Chips />
              </PageToolbar.Chips>
            </PageToolbar.Root>
          </SmartFilter.Root>
          <Crossfade state={view}>
            {view === "board" ? (
              // `plain` (the default): the board is the page's main region, so the stages are no
              // boxes — their headers and the deal cards stand on the page, one level of nesting.
              <Kanban.Root
                aria-label="Воронка продаж"
                className={styles.board}
                columns={STAGES}
                items={deals}
                getId={(item) => item.id}
                getLabel={(item) => item.company}
                value={placement}
                onValueChange={async (next, move) => {
                  const moved = BY_ID.get(move.id);
                  if (moved && move.from !== move.to) {
                    try {
                      await saveStage(moved, move.to);
                    } catch (error) {
                      refuse(error);
                      throw error;
                    }
                  }
                  setPlacement(next);
                }}
                reorderableColumns
                columnOrder={stageOrder}
                onColumnOrderChange={async (next) => {
                  await saveStageOrder();
                  setStageOrder(next);
                }}
                renderColumnMeta={figures}
                loading={loading}
                onItemClick={(item) => openDeal(item.id)}
                renderItem={(item) => (
                  <Kanban.Item>
                    <Kanban.ItemTitle>{item.company}</Kanban.ItemTitle>
                    <Kanban.ItemDescription>
                      {RUBLES.format(item.amount)} · до {DAY.format(new Date(item.due))}
                    </Kanban.ItemDescription>
                    <Kanban.ItemBadges>
                      {item.tags.map((tag) => (
                        <Badge.Root key={tag.text} color={tag.color}>
                          {tag.text}
                        </Badge.Root>
                      ))}
                    </Kanban.ItemBadges>
                    <Kanban.ItemFooter>
                      <Kanban.ItemCount>
                        <Icon name="object.message" />
                        {item.comments}
                      </Kanban.ItemCount>
                      {ownerAvatar(item.owner)}
                    </Kanban.ItemFooter>
                  </Kanban.Item>
                )}
              />
            ) : (
              <DataTable
                columns={COLUMNS}
                rows={loading ? [] : rows}
                loading={loading}
                getRowKey={(row) => row.id}
                getRowLabel={(row) => row.company}
                onRowClick={(row) => openDeal(row.id)}
                pageSize={8}
                defaultSort={{ columnId: "due", order: "asc" }}
                empty={
                  <EmptyPage.Root size="s" role="status" aria-labelledby="deals-empty">
                    <EmptyPage.Icon>
                      <Icon name="action.search" />
                    </EmptyPage.Icon>
                    <EmptyPage.Title as="p" id="deals-empty">
                      Сделок не найдено
                    </EmptyPage.Title>
                    <EmptyPage.Description>
                      Измените запрос или сбросьте фильтры.
                    </EmptyPage.Description>
                    <EmptyPage.Actions>
                      <Button.Root variant="soft" tone="neutral" onClick={resetFilters}>
                        Сбросить фильтры
                      </Button.Root>
                    </EmptyPage.Actions>
                  </EmptyPage.Root>
                }
              />
            )}
          </Crossfade>
        </div>
        <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Drawer.Content>
            <Drawer.Guard busy={saving} />
            <Drawer.Header>
              <Drawer.Title>{deal?.company}</Drawer.Title>
              <Drawer.Description>
                {deal?.id} · {STAGE_BY_ID.get(dealStage)?.title}
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              {deal ? (
                <DescriptionList.Root>
                  <DescriptionList.Item label="Этап">{stageBadge(dealStage)}</DescriptionList.Item>
                  <DescriptionList.Item label="Сумма">
                    {RUBLES.format(deal.amount)}
                  </DescriptionList.Item>
                  <DescriptionList.Item label="Вероятность">
                    {deal.probability} %
                  </DescriptionList.Item>
                  <DescriptionList.Item label="Срок закрытия">
                    {DAY.format(new Date(deal.due))}
                  </DescriptionList.Item>
                  <DescriptionList.Item label="Ответственный">
                    <span className={styles.owner}>
                      {ownerAvatar(deal.owner)}
                      {deal.owner.name}
                    </span>
                  </DescriptionList.Item>
                  <DescriptionList.Item label="Контакт">{deal.contact}</DescriptionList.Item>
                  <DescriptionList.Item label="Источник">{deal.source}</DescriptionList.Item>
                  <DescriptionList.Item label="Договор">
                    {deal.contract ? (
                      <Badge.Root color="green">Подписан</Badge.Root>
                    ) : (
                      <Badge.Root color="gray">Не подписан</Badge.Root>
                    )}
                  </DescriptionList.Item>
                </DescriptionList.Root>
              ) : null}
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button.Root variant="outline" tone="neutral">
                  Закрыть
                </Button.Root>
              </Drawer.Close>
              <Dropdown.Root>
                <Dropdown.Trigger>
                  <Button.Root variant="soft" tone="neutral" disabled={saving}>
                    Сменить этап
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  {stageOrder.map((id) => (
                    <Dropdown.Item
                      key={id}
                      disabled={id === dealStage}
                      onSelect={() => {
                        if (deal) void moveDeal(deal, id);
                      }}
                    >
                      {STAGE_BY_ID.get(id)?.title}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown.Root>
              {nextStage ? (
                <Button.Root
                  loading={saving}
                  onClick={() => {
                    if (deal) void moveDeal(deal, nextStage.id);
                  }}
                >
                  В «{nextStage.title}»
                </Button.Root>
              ) : null}
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      </PageContent.Body>
    </PageContent.Page>
  );
}
