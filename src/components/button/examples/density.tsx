/** Page numbers stay square and the current one takes the selected look; a speed chip sits inside a caption line — `density`, `current`. */
import { Button, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PAGES = [1, 2, 3, 4, 12] as const;
const SPEEDS = ["1×", "1,5×", "2×"] as const;

export default function ButtonDensityExample() {
  const [page, setPage] = React.useState<number>(3);
  const [speed, setSpeed] = React.useState(0);

  return (
    <>
      <nav aria-label="Страницы счетов" className={styles.row}>
        {PAGES.map((item) => (
          <Button.Root
            key={item}
            variant="ghost"
            tone="neutral"
            density="tight"
            current={item === page}
            aria-label={`Страница ${item}`}
            onClick={() => setPage(item)}
          >
            {item}
          </Button.Root>
        ))}
      </nav>
      <Typography variant="caption" tone="muted">
        Голосовое сообщение · 0:42 ·{" "}
        <Button.Root
          variant="soft"
          tone="neutral"
          density="inline"
          aria-label={`Скорость ${SPEEDS[speed]}`}
          onClick={() => setSpeed((speed + 1) % SPEEDS.length)}
        >
          {SPEEDS[speed]}
        </Button.Root>
      </Typography>
    </>
  );
}
