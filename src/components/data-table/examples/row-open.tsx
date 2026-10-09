/** Deals that open in a side panel: a click, or Enter and Space on the focused row; the panel keeps the last deal while it slides away — `onRowClick`. */
import { Badge, DataTable, type DataTableColumn, Drawer, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Stage = "new" | "talks" | "won";
type Deal = { id: string; title: string; client: string; owner: string; stage: Stage; sum: number };

const STAGE: Record<Stage, { label: string; color: "blue" | "orange" | "green" }> = {
  new: { label: "Новая", color: "blue" },
  talks: { label: "Переговоры", color: "orange" },
  won: { label: "Выиграна", color: "green" },
};

const DEALS: Deal[] = [
  {
    id: "D-311",
    title: "Поставка серверов",
    client: "АО «Технопарк»",
    owner: "Ольга Смирнова",
    stage: "talks",
    sum: 1_240_000,
  },
  {
    id: "D-312",
    title: "Годовая лицензия",
    client: "ООО «Лето»",
    owner: "Игорь Волков",
    stage: "new",
    sum: 360_000,
  },
  {
    id: "D-313",
    title: "Внедрение CRM",
    client: "ООО «Гранит»",
    owner: "Мария Орлова",
    stage: "won",
    sum: 890_000,
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Deal>[] = [
  { id: "title", header: "Сделка", accessor: "title", hideable: false },
  { id: "client", header: "Клиент", accessor: "client" },
  {
    id: "stage",
    header: "Этап",
    cell: (row) => <Badge.Root color={STAGE[row.stage].color}>{STAGE[row.stage].label}</Badge.Root>,
  },
  {
    id: "sum",
    header: "Сумма",
    accessor: "sum",
    numeric: true,
    cell: (row) => RUB.format(row.sum),
  },
];

export default function DataTableRowOpenExample() {
  const [open, setOpen] = React.useState(false);
  // The last opened deal stays while the panel slides away, so it never empties mid-motion.
  const [deal, setDeal] = React.useState<Deal | null>(null);

  return (
    <>
      <DataTable
        columns={COLUMNS}
        rows={DEALS}
        getRowKey={(row) => row.id}
        paging="none"
        onRowClick={(row) => {
          setDeal(row);
          setOpen(true);
        }}
      />
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Content size="s">
          <Drawer.Header>
            <Drawer.Title>{deal?.title}</Drawer.Title>
            <Drawer.Description>{deal?.id}</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>
            {deal ? (
              <dl className={styles.details}>
                <dt>
                  <Typography as="span" variant="body-m" tone="muted">
                    Клиент
                  </Typography>
                </dt>
                <dd>
                  <Typography as="span" variant="body-m">
                    {deal.client}
                  </Typography>
                </dd>
                <dt>
                  <Typography as="span" variant="body-m" tone="muted">
                    Ответственный
                  </Typography>
                </dt>
                <dd>
                  <Typography as="span" variant="body-m">
                    {deal.owner}
                  </Typography>
                </dd>
                <dt>
                  <Typography as="span" variant="body-m" tone="muted">
                    Сумма
                  </Typography>
                </dt>
                <dd>
                  <Typography as="span" variant="body-m">
                    {RUB.format(deal.sum)}
                  </Typography>
                </dd>
              </dl>
            ) : null}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
