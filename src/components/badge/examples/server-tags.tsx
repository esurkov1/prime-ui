/** Order tags removed on the server: a badge waits dimmed with a spinner, leaves once the server agrees and stays with an announcement when it refuses — `onRemove`, `labels`. */
import { Badge, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const TAGS = ["Срочный", "Оптовый клиент", "Оплачен", "Самовывоз"];

/** The server's answer a beat later: a paid order keeps its «Оплачен» tag. */
function deleteTag(tag: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (tag === "Оплачен") reject(new Error("Тег оплаты снимает только бухгалтерия"));
      else resolve();
    }, 900);
  });
}

export default function BadgeServerTagsExample() {
  const [tags, setTags] = React.useState(TAGS);
  const [failure, setFailure] = React.useState<string | null>(null);

  return (
    <div className={styles.filters}>
      <div className={styles.badges}>
        {tags.map((tag) => (
          <Badge.Root
            key={tag}
            color={tag === "Оплачен" ? "green" : "gray"}
            labels={{
              remove: `Снять тег «${tag}»`,
              removeFailed: `Тег «${tag}» не снят: его снимает только бухгалтерия`,
            }}
            onRemove={async () => {
              setFailure(null);
              try {
                await deleteTag(tag);
              } catch (error) {
                setFailure(error instanceof Error ? error.message : String(error));
                throw error;
              }
              setTags((current) => current.filter((item) => item !== tag));
            }}
          >
            {tag}
          </Badge.Root>
        ))}
      </div>
      {/* Seen on screen; the badge itself announces the refusal. */}
      {failure ? (
        <Typography variant="body-s" tone="danger" aria-hidden="true">
          {failure}
        </Typography>
      ) : null}
    </div>
  );
}
