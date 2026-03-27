import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Typography } from "@/components/typography/Typography";

export default function SegmentedFeaturesSnippet() {
  return (
    <>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Два сегмента
        </Typography.Root>
        <SegmentedControl.Root defaultValue="all">
          <SegmentedControl.Item value="all">Все задачи</SegmentedControl.Item>
          <SegmentedControl.Item value="mine">Мои</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Три сегмента
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day">
          <SegmentedControl.Item value="day">Сегодня</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Четыре сегмента
        </Typography.Root>
        <SegmentedControl.Root defaultValue="q1">
          <SegmentedControl.Item value="q1">Q1</SegmentedControl.Item>
          <SegmentedControl.Item value="q2">Q2</SegmentedControl.Item>
          <SegmentedControl.Item value="q3">Q3</SegmentedControl.Item>
          <SegmentedControl.Item value="q4">Q4</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <p className="previewCaption previewCaptionTopBase">
        Фокус на группе и стрелки ← → переключают выбранный сегмент (пропускаются пункты с{" "}
        <code>disabled</code>).
      </p>
    </>
  );
}
