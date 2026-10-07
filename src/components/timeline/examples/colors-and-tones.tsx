/** Dot hues via `color` (decorative, reduced emphasis) and status via `tone` on items, values and gaps (full emphasis). Use `color` for categories, `tone` when the event has a status. */

import { type PaletteColor, Timeline, type Tone } from "prime-ui-kit";

import styles from "./examples.module.css";

const colors: PaletteColor[] = [
  "gray",
  "blue",
  "sky",
  "teal",
  "green",
  "yellow",
  "orange",
  "red",
  "pink",
  "purple",
];

const tones: { tone: Tone; title: string; value: string }[] = [
  { tone: "neutral", title: "Черновик сохранён", value: "0 ฿" },
  { tone: "accent", title: "Счёт выставлен", value: "4 200 ฿" },
  { tone: "success", title: "Оплата получена", value: "+4 200 ฿" },
  { tone: "warning", title: "Оплата просрочена", value: "4 200 ฿" },
  { tone: "danger", title: "Возврат средств", value: "−4 200 ฿" },
  { tone: "info", title: "Напоминание отправлено", value: "—" },
];

export default function TimelineColorsAndTonesExample() {
  return (
    <div className={styles.stack}>
      <Timeline.Root>
        <Timeline.Group label="color">
          {colors.map((color) => (
            <Timeline.Item key={color} color={color}>
              <Timeline.Title>{color}</Timeline.Title>
              <Timeline.Meta>Категория события</Timeline.Meta>
            </Timeline.Item>
          ))}
        </Timeline.Group>
      </Timeline.Root>
      <Timeline.Root>
        <Timeline.Group label="tone">
          {tones.map(({ tone, title, value }) => (
            <Timeline.Item key={tone} tone={tone}>
              <Timeline.Title>{title}</Timeline.Title>
              <Timeline.Meta>{tone}</Timeline.Meta>
              <Timeline.Value tone={tone}>{value}</Timeline.Value>
            </Timeline.Item>
          ))}
          <Timeline.Gap tone="neutral">14 дней без событий</Timeline.Gap>
          <Timeline.Gap tone="accent">Ожидаем ответ клиента</Timeline.Gap>
          <Timeline.Gap tone="success">Оплачено в срок</Timeline.Gap>
          <Timeline.Gap tone="warning">Оплата задерживается 10 дней</Timeline.Gap>
          <Timeline.Gap tone="danger">Просрочка 30 дней</Timeline.Gap>
          <Timeline.Gap tone="info">Автоматическое напоминание</Timeline.Gap>
        </Timeline.Group>
      </Timeline.Root>
    </div>
  );
}
