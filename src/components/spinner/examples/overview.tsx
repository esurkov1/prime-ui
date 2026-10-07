/** A loading status next to a short explanation; the spinner takes the text color. */
import { Spinner, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SpinnerOverviewExample() {
  return (
    <div className={styles.status}>
      <Spinner labels={{ loading: "Загружаем счета" }} />
      <Typography as="span" variant="body-m" tone="secondary">
        Загружаем счета за октябрь…
      </Typography>
    </div>
  );
}
