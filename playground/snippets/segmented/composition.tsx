import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Typography } from "@/components/typography/Typography";
import { IconHouse, IconLayoutGrid, IconMoon, IconSun } from "@/icons";
import styles from "./composition.module.css";

export default function SegmentedCompositionSnippet() {
  return (
    <>
      <div className="row rowAlignCenter rowGapMedium">
        <Typography.Root as="span" variant="body-compact" tone="muted">
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
        <Typography.Root as="span" variant="body-compact" tone="muted">
          Только иконки + скрытый текст для доступного имени
        </Typography.Root>
        <SegmentedControl.Root defaultValue="grid" size="m">
          <SegmentedControl.Item value="feed">
            <SegmentedControl.Icon>
              <IconHouse size="m" />
            </SegmentedControl.Icon>
            <span className={styles.srOnly}>Лента объявлений</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="grid">
            <SegmentedControl.Icon>
              <IconLayoutGrid size="m" />
            </SegmentedControl.Icon>
            <span className={styles.srOnly}>Сетка карточек</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="compact">
            <SegmentedControl.Icon>
              <IconSun size="m" />
            </SegmentedControl.Icon>
            <span className={styles.srOnly}>Компактные карточки</span>
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
    </>
  );
}
