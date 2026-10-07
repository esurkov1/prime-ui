/** Size tiers xs–xl in a toolbar row next to Input and Button of the same size, all of one height. Use it to line a segmented control up with other controls. */
import { Button, IconSearch, Input, SegmentedControl, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SegmentedControlSizesExample() {
  return (
    <div className={styles.alignRows}>
      {SIZES.map((size) => (
        <div key={size} className={styles.alignRow}>
          <Typography.Root as="span" variant="caption" tone="muted" className={styles.sizeTag}>
            {size}
          </Typography.Root>
          <Input.Root size={size} className={styles.alignField}>
            <Input.Wrapper>
              <Input.Icon side="start">
                <IconSearch />
              </Input.Icon>
              <Input.Field placeholder="Поиск" aria-label={`Поиск, ${size}`} />
            </Input.Wrapper>
          </Input.Root>
          <SegmentedControl.Root size={size} defaultValue="week" aria-label={`Период, ${size}`}>
            <SegmentedControl.Item value="day">День</SegmentedControl.Item>
            <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
          </SegmentedControl.Root>
          <Button.Root size={size}>Создать</Button.Root>
        </div>
      ))}
    </div>
  );
}
