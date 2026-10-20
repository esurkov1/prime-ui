/** The cards of a rental unit in its drawer, one type scale across them — a semibold title over one secondary line with the actions at the end: the status with its step, the bill with its lines and the total on the footer fill, the deposit with its state badge and two actions, the check-out video with its preview — `Card.Header`, `Card.Title`, `Card.Description`, `Card.Icon`, `Card.Footer`, `divider`, `Card.Total`. */
import {
  Badge,
  Button,
  Card,
  Datepicker,
  type DatepickerRange,
  Dropdown,
  FieldList,
  type FieldListColumn,
  Icon,
  Input,
  Select,
  Thumbnail,
  Tooltip,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type BillLine =
  | { id: string; kind: "period"; prefix: string; term: DatepickerRange; price: string }
  | { id: string; kind: "delivery"; zone: string; price: string };

const COLUMNS: FieldListColumn[] = [{ label: "Позиция" }, { label: "Сумма", width: "s" }];

const ZONES = [
  { value: "airport", label: "Доставка: Аэропорт Пхукета" },
  { value: "patong", label: "Доставка: Патонг" },
  { value: "kata", label: "Доставка: Ката" },
];

const LINES: BillLine[] = [
  {
    id: "rent",
    kind: "period",
    prefix: "Аренда:",
    term: { from: new Date(2026, 9, 10), to: new Date(2026, 10, 10) },
    price: "18 600",
  },
  {
    id: "extend",
    kind: "period",
    prefix: "Продление:",
    term: { from: new Date(2026, 10, 10), to: new Date(2026, 10, 30) },
    price: "15 000",
  },
  { id: "delivery", kind: "delivery", zone: "airport", price: "1 200" },
];

const RANGE_LABELS = { rangeValue: "{from} → {to}" };

const STATUS = {
  title: "Ожидает выдачи",
  details: "10 окт, 08:00 · 10 дн. назад · Аэропорт Пхукета",
};

const DEPOSIT = { amount: "300 $", details: "наличные · новые купюры · принял Демо 10 окт" };

const VIDEO = {
  src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  poster: "https://picsum.photos/seed/pcx-checkout/640/360",
  title: "Состояние при выдаче",
  details: "20 окт, 09:21 · Евгений Сурков",
};

const sumOf = (lines: BillLine[]) =>
  lines.reduce((total, line) => total + (Number(line.price.replace(/\s/g, "")) || 0), 0);

const formatBaht = (amount: number) => `${amount.toLocaleString("ru-RU")} ฿`;

export default function CardRecordDrawerExample() {
  const [lines, setLines] = React.useState(LINES);
  const add = (line: BillLine) => setLines((current) => [...current, line]);

  return (
    <div className={styles.panel}>
      <div className={styles.sections}>
        <Card.Root>
          <Card.Header>
            <Card.Title>{STATUS.title}</Card.Title>
            <Card.Description>{STATUS.details}</Card.Description>
            <Button.Root>Выдан</Button.Root>
          </Card.Header>
        </Card.Root>

        <section className={styles.section}>
          <Typography as="h3" variant="title-s">
            Счёт
          </Typography>
          <Card.Root>
            <Card.Body>
              <FieldList
                aria-label="Позиции счёта"
                columns={COLUMNS}
                stackedLabels={false}
                value={lines}
                onValueChange={setLines}
                getId={(line) => line.id}
                getLabel={(line) => (line.kind === "period" ? line.prefix : "Доставка")}
                renderItem={(line, row) => (
                  <>
                    {line.kind === "period" ? (
                      <Datepicker.Root
                        mode="range"
                        fullWidth
                        valuePrefix={line.prefix}
                        labels={RANGE_LABELS}
                        value={line.term}
                        onValueChange={(term: DatepickerRange) => row.update({ term })}
                      />
                    ) : (
                      <Select.Root
                        value={line.zone}
                        onValueChange={(zone: string) => row.update({ zone })}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {ZONES.map((zone) => (
                            <Select.Item key={zone.value} value={zone.value}>
                              {zone.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    )}
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Field
                          value={line.price}
                          inputMode="decimal"
                          placeholder="0"
                          onChange={(event) => row.update({ price: event.target.value })}
                        />
                        <Input.InlineAffix side="end">฿</Input.InlineAffix>
                      </Input.Wrapper>
                    </Input.Root>
                  </>
                )}
              />
            </Card.Body>
            <Card.Footer divider="fill">
              <Dropdown.Root>
                <Dropdown.Trigger>
                  <Button.Root variant="soft" tone="neutral">
                    <Button.Icon>
                      <Icon name="action.add" />
                    </Button.Icon>
                    Позиция
                    <Button.Icon>
                      <Icon name="nav.chevronDown" />
                    </Button.Icon>
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content align="start">
                  <Dropdown.Item
                    onSelect={() =>
                      add({
                        id: crypto.randomUUID(),
                        kind: "period",
                        prefix: "Продление:",
                        term: { from: new Date(2026, 10, 30), to: new Date(2026, 11, 10) },
                        price: "",
                      })
                    }
                  >
                    Продлить
                  </Dropdown.Item>
                  <Dropdown.Item
                    onSelect={() =>
                      add({ id: crypto.randomUUID(), kind: "delivery", zone: "patong", price: "" })
                    }
                  >
                    Доставка
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
              <Card.Total>
                <Card.Value>{formatBaht(sumOf(lines))}</Card.Value>
              </Card.Total>
            </Card.Footer>
          </Card.Root>
        </section>

        <section className={styles.section}>
          <Typography as="h3" variant="title-s">
            Депозит
          </Typography>
          <Card.Root>
            <Card.Header>
              <Card.Title as="h4">
                <Badge.Root color="green">У нас</Badge.Root> {DEPOSIT.amount}
              </Card.Title>
              <Card.Description>{DEPOSIT.details}</Card.Description>
              <Button.Root variant="soft" tone="neutral">
                Вернуть
              </Button.Root>
              <Tooltip.Root>
                <Tooltip.Trigger>
                  <Button.Root variant="ghost" tone="neutral" aria-label="Исправить депозит">
                    <Button.Icon>
                      <Icon name="action.edit" />
                    </Button.Icon>
                  </Button.Root>
                </Tooltip.Trigger>
                <Tooltip.Content>Исправить депозит</Tooltip.Content>
              </Tooltip.Root>
            </Card.Header>
          </Card.Root>
        </section>

        <section className={styles.section}>
          <Typography as="h3" variant="title-s">
            Видео при выдаче
          </Typography>
          <Card.Root>
            <Card.Header>
              <Card.Icon>
                <Thumbnail.Root ratio="16:9">
                  <Thumbnail.Video src={VIDEO.src} poster={VIDEO.poster} aria-label={VIDEO.title} />
                  <Thumbnail.Fallback>
                    <Icon name="action.play" />
                  </Thumbnail.Fallback>
                </Thumbnail.Root>
              </Card.Icon>
              <Card.Title as="h4">{VIDEO.title}</Card.Title>
              <Card.Description>{VIDEO.details}</Card.Description>
              <Button.Root variant="soft" tone="neutral">
                Заменить
              </Button.Root>
            </Card.Header>
          </Card.Root>
        </section>
      </div>
    </div>
  );
}
