/** No selection yet, a disabled segment and a disabled group next to the default — `disabled`. */
import { SegmentedControl, Typography } from "prime-ui-kit";

export default function SegmentedControlStatesExample() {
  return (
    <div>
      <div>
        <SegmentedControl.Root defaultValue="active" aria-label="Статус кампании">
          <SegmentedControl.Item value="active">Активные</SegmentedControl.Item>
          <SegmentedControl.Item value="archived">Архив</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography as="span" variant="caption" tone="muted">
          default
        </Typography>
      </div>
      <div>
        <SegmentedControl.Root aria-label="Статус кампании">
          <SegmentedControl.Item value="active">Активные</SegmentedControl.Item>
          <SegmentedControl.Item value="archived">Архив</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography as="span" variant="caption" tone="muted">
          empty
        </Typography>
      </div>
      <div>
        <SegmentedControl.Root defaultValue="active" aria-label="Статус кампании">
          <SegmentedControl.Item value="active">Активные</SegmentedControl.Item>
          <SegmentedControl.Item value="archived" disabled>
            Архив
          </SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography as="span" variant="caption" tone="muted">
          Item disabled
        </Typography>
      </div>
      <div>
        <SegmentedControl.Root defaultValue="active" disabled aria-label="Статус кампании">
          <SegmentedControl.Item value="active">Активные</SegmentedControl.Item>
          <SegmentedControl.Item value="archived">Архив</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography as="span" variant="caption" tone="muted">
          disabled
        </Typography>
      </div>
    </div>
  );
}
