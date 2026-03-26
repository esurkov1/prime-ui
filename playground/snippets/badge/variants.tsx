import { Badge } from "@/components/badge/Badge";

import styles from "./snippets.module.css";

/** Все значения variant и ряд значений status на одном экране. */
export default function BadgeVariantsSnippet() {
  return (
    <div className={styles.stackAlignStart}>
      <div className="row rowGapTight">
        <Badge.Root color="blue" variant="filled" size="m">
          filled
        </Badge.Root>
        <Badge.Root color="blue" variant="light" size="m">
          light
        </Badge.Root>
        <Badge.Root color="blue" variant="lighter" size="m">
          lighter
        </Badge.Root>
        <Badge.Root color="blue" variant="stroke" size="m">
          stroke
        </Badge.Root>
      </div>
      <div className="row rowGapTight">
        <Badge.Root variant="status" status="online" label="Пользователь в сети" size="m">
          В сети
        </Badge.Root>
        <Badge.Root variant="status" status="offline" label="Не в сети" size="m">
          Не в сети
        </Badge.Root>
        <Badge.Root variant="status" status="away" label="Отошёл" size="m">
          Отошёл
        </Badge.Root>
        <Badge.Root variant="status" status="busy" label="Занят" size="m">
          Занят
        </Badge.Root>
      </div>
    </div>
  );
}
