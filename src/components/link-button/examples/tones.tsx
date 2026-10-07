/** `accent` (regular link) next to `neutral` (secondary text, primary on hover). Use neutral for footers, metadata and dense lists. */
import { LinkButton } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LinkButtonTonesExample() {
  return (
    <div className={styles.row}>
      <LinkButton.Root href="#">Открыть отчёт</LinkButton.Root>
      <LinkButton.Root href="#" tone="neutral">
        Открыть отчёт
      </LinkButton.Root>
    </div>
  );
}
