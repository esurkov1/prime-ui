/** A sales pipeline whose stages move by the grip in their header while the first and the last stay locked; each stage carries its color on the count, a rule and its figures under the title, and is edited in a popover; the page keeps the order — `reorderableColumns`, `columnOrder`, `onColumnOrderChange`, `locked`, `color`, `description`, `renderColumnMeta`, `renderColumnActions`. */
import {
  Button,
  ColorSwatches,
  Icon,
  Input,
  Kanban,
  type KanbanColumn,
  type KanbanValue,
  type PaletteColor,
  Popover,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Deal = { id: string; client: string; amount: number };

/** The column colors offered in the editor: a swatch per palette hue. */
const COLUMN_COLORS: { color: PaletteColor; value: string; label: string }[] = [
  { color: "gray", value: "#71717a", label: "Серый" },
  { color: "blue", value: "#5068f5", label: "Синий" },
  { color: "teal", value: "#14b8a6", label: "Бирюзовый" },
  { color: "green", value: "#22c55e", label: "Зелёный" },
  { color: "yellow", value: "#eab308", label: "Жёлтый" },
  { color: "orange", value: "#f97316", label: "Оранжевый" },
  { color: "red", value: "#ef4444", label: "Красный" },
  { color: "purple", value: "#a855f7", label: "Фиолетовый" },
];

const PRESETS = COLUMN_COLORS.map(({ value, label }) => ({ value, label }));

const COLUMNS: KanbanColumn[] = [
  {
    id: "lead",
    title: "Заявки",
    description: "Ответить в течение дня",
    color: "blue",
    locked: true,
  },
  { id: "demo", title: "Демо", description: "Показ продукта команде клиента", color: "purple" },
  { id: "offer", title: "Предложение", description: "Счёт и договор отправлены", color: "orange" },
  { id: "won", title: "Сделка", description: "Оплата получена", color: "green", locked: true },
];

const DEALS: Deal[] = [
  { id: "DL-318", client: "ООО «Север»", amount: 480_000 },
  { id: "DL-322", client: "АО «Гранит»", amount: 1_200_000 },
  { id: "DL-309", client: "ИП Лебедев", amount: 96_000 },
  { id: "DL-301", client: "ООО «Вектор»", amount: 350_000 },
  { id: "DL-296", client: "ГК «Меридиан»", amount: 2_750_000 },
];

const INITIAL_ORDER = COLUMNS.map((column) => column.id);

const PLACEMENT: KanbanValue = {
  lead: ["DL-318", "DL-322"],
  demo: ["DL-309"],
  offer: ["DL-301"],
  won: ["DL-296"],
};

const RUBLES = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const dealsWord = (count: number) => {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return "сделок";
  if (ones === 1) return "сделка";
  if (ones >= 2 && ones <= 4) return "сделки";
  return "сделок";
};

export default function KanbanColumnsExample() {
  const [columns, setColumns] = React.useState(COLUMNS);
  const [placement, setPlacement] = React.useState<KanbanValue>(PLACEMENT);
  const [order, setOrder] = React.useState<readonly string[]>(INITIAL_ORDER);

  const updateColumn = (id: string, patch: Partial<KanbanColumn>) =>
    setColumns((current) =>
      current.map((column) => (column.id === id ? { ...column, ...patch } : column)),
    );
  const titleOf = (id: string) => columns.find((column) => column.id === id)?.title;
  const figures = (column: KanbanColumn) => {
    const deals = (placement[column.id] ?? []).flatMap((id) =>
      DEALS.filter((deal) => deal.id === id),
    );
    const sum = deals.reduce((total, deal) => total + deal.amount, 0);
    return `${deals.length} ${dealsWord(deals.length)} · ${RUBLES.format(sum)}`;
  };

  return (
    <div className={styles.stage}>
      <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
        {order !== INITIAL_ORDER
          ? `Порядок этапов сохранён: ${order.map(titleOf).filter(Boolean).join(" → ")}`
          : "Перетащите этап за ручку в шапке или нажмите на ней Alt + ← / →"}
      </Typography>
      <Kanban.Root
        aria-label="Воронка продаж"
        className={styles.board}
        columns={columns}
        items={DEALS}
        getId={(deal) => deal.id}
        getLabel={(deal) => deal.client}
        value={placement}
        onValueChange={setPlacement}
        reorderableColumns
        columnOrder={order}
        onColumnOrderChange={setOrder}
        renderColumnMeta={figures}
        renderColumnActions={(column) => (
          <Popover.Root>
            <Popover.Trigger>
              <Button.Root
                variant="ghost"
                tone="neutral"
                aria-label={`Настроить этап «${column.title}»`}
              >
                <Button.Icon>
                  <Icon name="action.settings" />
                </Button.Icon>
              </Button.Root>
            </Popover.Trigger>
            <Popover.Content className={styles.panel} trapFocus>
              <Popover.Header>
                <Popover.Title>Этап воронки</Popover.Title>
              </Popover.Header>
              <Input.Root label="Название">
                <Input.Wrapper>
                  <Input.Field
                    defaultValue={column.title}
                    onValueChange={(title) => {
                      if (title.trim()) updateColumn(column.id, { title: title.trim() });
                    }}
                  />
                </Input.Wrapper>
              </Input.Root>
              <ColorSwatches
                label="Цвет"
                presets={PRESETS}
                value={COLUMN_COLORS.find((entry) => entry.color === column.color)?.value ?? null}
                onValueChange={(value) =>
                  updateColumn(column.id, {
                    color: COLUMN_COLORS.find((entry) => entry.value === value)?.color,
                  })
                }
              />
              {column.locked ? null : (
                <Popover.Actions>
                  <Button.Root
                    variant="soft"
                    tone="danger"
                    fullWidth
                    onClick={() =>
                      setColumns((current) => current.filter((item) => item.id !== column.id))
                    }
                  >
                    <Button.Icon>
                      <Icon name="action.delete" />
                    </Button.Icon>
                    Удалить этап
                  </Button.Root>
                </Popover.Actions>
              )}
            </Popover.Content>
          </Popover.Root>
        )}
        renderItem={(deal) => (
          <Kanban.Item>
            <Kanban.ItemTitle>{deal.client}</Kanban.ItemTitle>
            <Kanban.ItemDescription>
              {deal.id} · {RUBLES.format(deal.amount)}
            </Kanban.ItemDescription>
          </Kanban.Item>
        )}
      />
    </div>
  );
}
