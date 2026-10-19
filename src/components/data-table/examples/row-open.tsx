/** Deals that open in a side panel: a click, or Enter and Space on the focused row; the panel keeps the last deal while it slides away — `onRowClick`. */
import { Badge, DataTable, type DataTableColumn, DescriptionList, Drawer } from "prime-ui-kit";
import * as React from "react";

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
  { id: "title", header: "Сделка", accessor: "title" },
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
            <Drawer.Title number={deal?.id}>{deal?.title}</Drawer.Title>
            {deal ? (
              <Drawer.Badges>
                <Badge.Root color={STAGE[deal.stage].color}>{STAGE[deal.stage].label}</Badge.Root>
              </Drawer.Badges>
            ) : null}
          </Drawer.Header>
          <Drawer.Body>
            {deal ? (
              <DescriptionList.Root>
                <DescriptionList.Item label="Клиент">{deal.client}</DescriptionList.Item>
                <DescriptionList.Item label="Ответственный">{deal.owner}</DescriptionList.Item>
                <DescriptionList.Item label="Сумма">{RUB.format(deal.sum)}</DescriptionList.Item>
              </DescriptionList.Root>
            ) : null}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
