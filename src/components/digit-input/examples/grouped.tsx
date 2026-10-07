/** `groupSize` adds a wider gap before every group, so a long code reads in chunks: 123 456 or 1234 5678. Works with `fullWidth` and with square cells. Use it for codes of six digits and longer. */
import { DigitInput } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DigitInputGroupedExample() {
  return (
    <div className={styles.wide}>
      <DigitInput.Root
        length={6}
        size="l"
        groupSize={3}
        defaultValue="123456"
        labels={{ group: "Код, две группы по три цифры" }}
      />
      <DigitInput.Root
        length={8}
        size="m"
        groupSize={4}
        fullWidth
        labels={{ group: "Код, две группы по четыре цифры" }}
      />
    </div>
  );
}
