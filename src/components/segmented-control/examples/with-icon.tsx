/** An icon before the label and square icon-only segments named for screen readers — `SegmentedControl.Icon`, `aria-label`. */
import { Icon, SegmentedControl, Typography } from "prime-ui-kit";

const VIEWPORTS = [
  { value: "desktop", label: "Компьютер", icon: "viewport.desktop" },
  { value: "tablet", label: "Планшет", icon: "viewport.tablet" },
  { value: "mobile", label: "Телефон", icon: "viewport.mobile" },
] as const;

export default function SegmentedControlWithIconExample() {
  return (
    <div>
      <div>
        <SegmentedControl.Root defaultValue="light" aria-label="Тема">
          <SegmentedControl.Item value="light">
            <SegmentedControl.Icon>
              <Icon name="theme.light" />
            </SegmentedControl.Icon>
            Светлая
          </SegmentedControl.Item>
          <SegmentedControl.Item value="dark">
            <SegmentedControl.Icon>
              <Icon name="theme.dark" />
            </SegmentedControl.Icon>
            Тёмная
          </SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography as="span" variant="caption" tone="muted">
          leading
        </Typography>
      </div>
      <div>
        <SegmentedControl.Root defaultValue="desktop" aria-label="Предпросмотр письма">
          {VIEWPORTS.map((viewport) => (
            <SegmentedControl.Item
              key={viewport.value}
              value={viewport.value}
              aria-label={viewport.label}
            >
              <SegmentedControl.Icon>
                <Icon name={viewport.icon} />
              </SegmentedControl.Icon>
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
        <Typography as="span" variant="caption" tone="muted">
          icon-only
        </Typography>
      </div>
    </div>
  );
}
