import type { CSSProperties } from "react";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Typography } from "@/components/typography/Typography";
import { IconHouse, IconLayoutGrid, IconMoon, IconSun } from "@/icons";

const srOnly: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

export default function SegmentedCompositionSnippet() {
  return (
    <>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" size="xs" tone="muted">
          Иконка и текст
        </Typography.Root>
        <SegmentedControl.Root defaultValue="light" size="m">
          <SegmentedControl.Item value="light">
            <SegmentedControl.Icon>
              <IconSun size="m" />
            </SegmentedControl.Icon>
            Светлая
          </SegmentedControl.Item>
          <SegmentedControl.Item value="dark">
            <SegmentedControl.Icon>
              <IconMoon size="m" />
            </SegmentedControl.Icon>
            Тёмная
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" size="xs" tone="muted">
          Только иконки + скрытый текст для доступного имени
        </Typography.Root>
        <SegmentedControl.Root defaultValue="grid" size="m">
          <SegmentedControl.Item value="feed">
            <SegmentedControl.Icon>
              <IconHouse size="m" />
            </SegmentedControl.Icon>
            <span style={srOnly}>Лента объявлений</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="grid">
            <SegmentedControl.Icon>
              <IconLayoutGrid size="m" />
            </SegmentedControl.Icon>
            <span style={srOnly}>Сетка карточек</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="compact">
            <SegmentedControl.Icon>
              <IconSun size="m" />
            </SegmentedControl.Icon>
            <span style={srOnly}>Компактные карточки</span>
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </>
  );
}
