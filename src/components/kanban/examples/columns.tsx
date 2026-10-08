/** A sales pipeline whose stages move by the grip in their header, carry a color and a short rule under the title, and are edited in a popover: rename, recolor, delete — `reorderableColumns`, `onColumnOrderChange`, `description`, `color`, `renderColumnActions`. */
import {
  Button,
  ColorSwatches,
  Icon,
  Input,
  Kanban,
  type KanbanColumn,
  type PaletteColor,
  Popover,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Deal = { id: string; client: string; amount: string };

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
  { id: "lead", title: "Заявки", description: "Ответить в течение дня", color: "blue" },
  { id: "demo", title: "Демо", description: "Показ продукта команде клиента", color: "purple" },
  { id: "offer", title: "Предложение", description: "Счёт и договор отправлены", color: "orange" },
  { id: "won", title: "Сделка", description: "Оплата получена", color: "green" },
];

const DEALS: Deal[] = [
  { id: "DL-318", client: "ООО «Север»", amount: "480 000 ₽" },
  { id: "DL-322", client: "АО «Гранит»", amount: "1 200 000 ₽" },
  { id: "DL-309", client: "ИП Лебедев", amount: "96 000 ₽" },
  { id: "DL-301", client: "ООО «Вектор»", amount: "350 000 ₽" },
  { id: "DL-296", client: "ГК «Меридиан»", amount: "2 750 000 ₽" },
];

const PLACEMENT = {
  lead: ["DL-318", "DL-322"],
  demo: ["DL-309"],
  offer: ["DL-301"],
  won: ["DL-296"],
};

export default function KanbanColumnsExample() {
  const [columns, setColumns] = React.useState(COLUMNS);
  const [savedOrder, setSavedOrder] = React.useState<readonly string[] | null>(null);

  const updateColumn = (id: string, patch: Partial<KanbanColumn>) =>
    setColumns((current) =>
      current.map((column) => (column.id === id ? { ...column, ...patch } : column)),
    );
  const titleOf = (id: string) => columns.find((column) => column.id === id)?.title;

  return (
    <div className={styles.stage}>
      <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
        {savedOrder
          ? `Порядок этапов сохранён: ${savedOrder.map(titleOf).filter(Boolean).join(" → ")}`
          : "Перетащите этап за ручку в шапке или нажмите на ней Alt + ← / →"}
      </Typography>
      <Kanban.Root
        aria-label="Воронка продаж"
        className={styles.board}
        columns={columns}
        items={DEALS}
        getId={(deal) => deal.id}
        getLabel={(deal) => deal.client}
        defaultValue={PLACEMENT}
        reorderableColumns
        onColumnOrderChange={setSavedOrder}
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
            </Popover.Content>
          </Popover.Root>
        )}
        renderItem={(deal) => (
          <Kanban.Item>
            <Kanban.ItemTitle>{deal.client}</Kanban.ItemTitle>
            <Kanban.ItemDescription>
              {deal.id} · {deal.amount}
            </Kanban.ItemDescription>
          </Kanban.Item>
        )}
      />
    </div>
  );
}
