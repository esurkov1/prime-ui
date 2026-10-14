/** Every tier scales text, dot and row rhythm, rows 40 to 76 px — `size`. */
import { Timeline, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TimelineSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <Timeline.Root size={size}>
              <Timeline.Group label="Недавно">
                <Timeline.Item>
                  <Timeline.ItemTitle>Аренда закончилась · Иван К.</Timeline.ItemTitle>
                  <Timeline.ItemMeta>
                    <strong>21.09.26</strong> · 15 д. назад
                  </Timeline.ItemMeta>
                  <Timeline.ItemValue>+6 300 ₽</Timeline.ItemValue>
                </Timeline.Item>
                <Timeline.Item>
                  <Timeline.ItemTitle>ТО: замена масла</Timeline.ItemTitle>
                  <Timeline.ItemMeta>
                    <strong>10.09.26</strong> · 26 д. назад
                  </Timeline.ItemMeta>
                  <Timeline.ItemValue>−689 ₽</Timeline.ItemValue>
                </Timeline.Item>
              </Timeline.Group>
            </Timeline.Root>
            <Typography as="span" variant="caption" tone="muted">
              {size}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
