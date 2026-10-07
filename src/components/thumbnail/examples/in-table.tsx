/** A vehicle list: a 16:9 thumbnail next to a two-line cell (name · plate and meta), the photo or a `solid` fallback in the vehicle's own color. Use for object lists — products, vehicles, files — in tables. */
import { Bike } from "lucide-react";
import {
  Badge,
  DataTable,
  type DataTableColumn,
  type PaletteColor,
  Thumbnail,
  Typography,
} from "prime-ui-kit";

import styles from "./examples.module.css";

type Vehicle = {
  id: string;
  model: string;
  plate: string;
  meta: string;
  color: PaletteColor;
  photo?: string;
  status: string;
};

const rows: Vehicle[] = [
  {
    id: "1",
    model: "Honda ADV 350 · 2026",
    plate: "5672",
    meta: "Красный · Новый из салона",
    color: "red",
    status: "Свободен",
  },
  {
    id: "2",
    model: "Yamaha NMAX 155 · 2026",
    plate: "1408",
    meta: "Серый · Пробег 3 200 км",
    color: "gray",
    photo: "https://picsum.photos/seed/nmax/320/180",
    status: "В аренде",
  },
  {
    id: "3",
    model: "Honda PCX 160 · 2025",
    plate: "9031",
    meta: "Синий · Пробег 11 800 км",
    color: "blue",
    status: "Свободен",
  },
];

const columns: DataTableColumn<Vehicle>[] = [
  {
    id: "model",
    header: "Байк",
    cell: (row) => (
      <div className={styles.entity}>
        <Thumbnail.Root ratio="16:9" color={row.color} variant="solid">
          {row.photo ? <Thumbnail.Image src={row.photo} /> : null}
          <Thumbnail.Fallback>
            <Bike aria-hidden />
          </Thumbnail.Fallback>
        </Thumbnail.Root>
        <div className={styles.entityText}>
          <Typography.Root variant="body-m" weight="medium" truncate>
            {row.model}
          </Typography.Root>
          <div className={styles.meta}>
            <Badge.Root color="gray">{row.plate}</Badge.Root>
            <Typography.Root variant="caption" tone="secondary" truncate>
              {row.meta}
            </Typography.Root>
          </div>
        </div>
      </div>
    ),
  },
  { id: "status", header: "Занятость", accessor: "status" },
];

export default function ThumbnailInTableExample() {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      showPagination={false}
    />
  );
}
