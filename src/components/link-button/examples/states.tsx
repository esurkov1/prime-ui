/** Active link and disabled links in both tones; `disabled` renders a `span role="link"` without `href`, out of the Tab order. Use when a destination is temporarily unavailable. */
import { LinkButton } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LinkButtonStatesExample() {
  return (
    <div className={styles.row}>
      <LinkButton.Root href="#">Активная</LinkButton.Root>
      <LinkButton.Root href="#" disabled>
        Недоступная
      </LinkButton.Root>
      <LinkButton.Root href="#" tone="neutral" disabled>
        Недоступная нейтральная
      </LinkButton.Root>
    </div>
  );
}
