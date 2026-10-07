/** The same field on every size: height, padding, text and icon come from the tier. Pick the size that matches the other controls in the row. */
import { Icon, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function InputSizesExample() {
  return (
    <div className={styles.sizesRow}>
      {SIZES.map((size) => (
        <Input.Root key={size} size={size} label={`size="${size}"`}>
          <Input.Wrapper>
            <Input.Icon side="start">
              <Icon name="field.email" tone="secondary" />
            </Input.Icon>
            <Input.Field type="email" placeholder="Почта" />
          </Input.Wrapper>
        </Input.Root>
      ))}
    </div>
  );
}
