/** A deal board that fills its panel's height while it swaps between loading and data, and a notice slot above it that takes no room while empty — `fill`, `state`. */
import { Banner, Button, Card, Crossfade, Skeleton, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STAGES = [
  { id: "new", title: "Новые", deals: ["Поставка серверов", "Годовая лицензия"] },
  { id: "talks", title: "Переговоры", deals: ["Внедрение CRM"] },
  { id: "won", title: "Выиграны", deals: ["Обучение отдела", "Аудит склада", "Поддержка 24/7"] },
];

export default function CrossfadeFillExample() {
  const [status, setStatus] = React.useState<"loading" | "ready">("ready");
  const [notice, setNotice] = React.useState<string | null>(null);

  const refresh = () => {
    setNotice(null);
    setStatus("loading");
    window.setTimeout(() => {
      setStatus("ready");
      setNotice("Доска обновлена: 2 новые сделки");
    }, 900);
  };

  return (
    <div className={styles.fillPage}>
      <Button.Root variant="soft" tone="neutral" onClick={refresh} disabled={status === "loading"}>
        Обновить доску
      </Button.Root>

      {/* Empty: no box at all, so the page gap does not open above the board. */}
      <Crossfade state={notice ? "notice" : "none"}>
        {notice ? (
          <Banner.Root tone="success" onDismiss={() => setNotice(null)}>
            <Banner.Content>
              <Banner.Title>{notice}</Banner.Title>
            </Banner.Content>
          </Banner.Root>
        ) : null}
      </Crossfade>

      <Crossfade state={status} fill aria-busy={status === "loading"}>
        {status === "loading" ? (
          <Skeleton shape="block" className={styles.fillSkeleton} />
        ) : (
          <div className={styles.board}>
            {STAGES.map((stage) => (
              <Card.Root key={stage.id} className={styles.column}>
                <Card.Body>
                  <Typography as="h3" variant="title-s">
                    {stage.title} · {stage.deals.length}
                  </Typography>
                  <ul className={styles.facts}>
                    {stage.deals.map((deal) => (
                      <li key={deal}>
                        <Typography as="span" variant="body-m">
                          {deal}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card.Root>
            ))}
          </div>
        )}
      </Crossfade>
    </div>
  );
}
