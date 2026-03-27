import { Badge } from "@/components/badge/Badge";

import styles from "./snippets.module.css";

/** Все значения variant и ряд значений status на одном экране. */
export default function BadgeVariantsSnippet() {
  return (
    <div className={styles.stackAlignStart}>
      <div className="row rowGapTight">
        <Badge.Root color="blue" variant="filled">
          filled
        </Badge.Root>
        <Badge.Root color="blue" variant="light">
          light
        </Badge.Root>
        <Badge.Root color="blue" variant="lighter">
          lighter
        </Badge.Root>
        <Badge.Root color="blue" variant="stroke">
          stroke
        </Badge.Root>
      </div>
      <div className="row rowGapTight">
        <Badge.Root variant="status" status="online" label="Пользователь в сети">
          В сети
        </Badge.Root>
        <Badge.Root variant="status" status="offline" label="Не в сети">
          Не в сети
        </Badge.Root>
        <Badge.Root variant="status" status="away" label="Отошёл">
          Отошёл
        </Badge.Root>
        <Badge.Root variant="status" status="busy" label="Занят">
          Занят
        </Badge.Root>
      </div>
    </div>
  );
}
