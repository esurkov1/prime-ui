/** Dot hues for categories at reduced emphasis, and status tones on items, values and gaps at full emphasis — `color`, `tone`. */
import { type PaletteColor, Timeline, type Tone, Typography } from "prime-ui-kit";

const COLORS: PaletteColor[] = [
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

const TONES: { tone: Tone; title: string; value: string }[] = [
  { tone: "neutral", title: "Черновик сохранён", value: "0 ₽" },
  { tone: "accent", title: "Счёт выставлен", value: "4 200 ₽" },
  { tone: "success", title: "Оплата получена", value: "+4 200 ₽" },
  { tone: "warning", title: "Оплата просрочена", value: "4 200 ₽" },
  { tone: "danger", title: "Возврат средств", value: "−4 200 ₽" },
  { tone: "info", title: "Напоминание отправлено", value: "—" },
];

export default function TimelineVariantsExample() {
  return (
    <div>
      <div>
        <div>
          <Timeline.Root>
            <Timeline.Group label="Категории">
              {COLORS.map((color) => (
                <Timeline.Item key={color} color={color}>
                  <Timeline.ItemTitle>{color}</Timeline.ItemTitle>
                  <Timeline.ItemMeta>Категория события</Timeline.ItemMeta>
                </Timeline.Item>
              ))}
            </Timeline.Group>
          </Timeline.Root>
          <Typography as="span" variant="caption" tone="muted">
            color
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <Timeline.Root>
            <Timeline.Group label="Статусы">
              {TONES.map(({ tone, title, value }) => (
                <Timeline.Item key={tone} tone={tone}>
                  <Timeline.ItemTitle>{title}</Timeline.ItemTitle>
                  <Timeline.ItemMeta>{tone}</Timeline.ItemMeta>
                  <Timeline.ItemValue tone={tone}>{value}</Timeline.ItemValue>
                </Timeline.Item>
              ))}
              <Timeline.Gap tone="warning">Оплата задерживается 10 дней</Timeline.Gap>
              <Timeline.Gap tone="danger">Просрочка 30 дней</Timeline.Gap>
            </Timeline.Group>
          </Timeline.Root>
          <Typography as="span" variant="caption" tone="muted">
            tone
          </Typography>
        </div>
      </div>
    </div>
  );
}
