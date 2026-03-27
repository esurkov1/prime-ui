import { Select } from "@/components/select/Select";
import { Icon } from "@/icons";

import styles from "./examples.module.css";

/** `TriggerIcon`, `ItemIcon`, and item `label` for trigger vs row text; mirrors `playground/snippets/select/composition.tsx`. */
export default function SelectPatternCompositionExample() {
  return (
    <div className={`${styles.stack} ${styles.stackNarrow}`}>
      <Select.Root size="m" defaultValue="eur" placeholder="Report currency">
        <Select.Trigger>
          <Select.TriggerIcon>
            <Icon name="nav.layoutGrid" size="s" tone="subtle" />
          </Select.TriggerIcon>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="rub" label="RUB — Russian ruble">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            ₽ RUB
          </Select.Item>
          <Select.Item value="eur" label="EUR — Euro">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            € EUR
          </Select.Item>
          <Select.Item value="usd" label="USD — US dollar">
            <Select.ItemIcon>
              <Icon name="nav.layoutGrid" size="s" tone="subtle" />
            </Select.ItemIcon>
            $ USD
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
