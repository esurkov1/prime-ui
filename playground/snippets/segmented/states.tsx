import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Typography } from "@/components/typography/Typography";

export default function SegmentedStatesSnippet() {
  return (
    <>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Обычный выбор
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="m">
          <SegmentedControl.Item value="day">День</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Один сегмент disabled
        </Typography.Root>
        <SegmentedControl.Root defaultValue="active" size="m">
          <SegmentedControl.Item value="active">Активные</SegmentedControl.Item>
          <SegmentedControl.Item value="paused" disabled>
            На паузе
          </SegmentedControl.Item>
          <SegmentedControl.Item value="archived">Архив</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Весь контроль disabled
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" disabled size="m">
          <SegmentedControl.Item value="day">День</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </>
  );
}
