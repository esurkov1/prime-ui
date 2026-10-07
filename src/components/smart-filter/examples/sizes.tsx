/** Every size tier: the filter button, the search, the tags and the panel follow one tier — `size`. */
import { SmartFilter, type SmartFilterField, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const FIELDS: SmartFilterField[] = [
  {
    key: "method",
    label: "Метод",
    options: ["GET", "POST", "PUT", "DELETE"].map((v) => ({ value: v, label: v })),
  },
];

const ONLY_GET = { method: { include: ["GET"], exclude: [] } };
const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function SmartFilterSizesExample() {
  return (
    <div className={styles.sizes}>
      {SIZES.map((size) => (
        <div key={size} className={styles.size}>
          <SmartFilter.Root fields={FIELDS} size={size} defaultValue={ONLY_GET}>
            <SmartFilter.Toolbar />
            <SmartFilter.Chips />
          </SmartFilter.Root>
          <Typography as="span" variant="caption" tone="muted">
            {size}
          </Typography>
        </div>
      ))}
    </div>
  );
}
