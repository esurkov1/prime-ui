import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Typography } from "@/components/typography/Typography";

export default function SegmentedSizesSnippet() {
  return (
    <>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          SegmentedControl s
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="s">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          SegmentedControl m
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="m">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          SegmentedControl l
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="l">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
          SegmentedControl xl
        </Typography.Root>
        <SegmentedControl.Root defaultValue="day" size="xl">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </>
  );
}
