/** Every tier changes padding, icon and text of the card — `size`. */
import { NotificationCard, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function NotificationSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <NotificationCard
              size={size}
              title="Отчёт готов"
              description="Выгрузка за сентябрь доступна в разделе «Отчёты»."
              onDismiss={() => undefined}
            />
            <Typography as="span" variant="caption" tone="muted">
              {size}
            </Typography>
          </div>
        </div>
      ))}
    </>
  );
}
