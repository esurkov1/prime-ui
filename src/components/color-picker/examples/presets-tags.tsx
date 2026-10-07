/** A tag manager in a Popover where each row has its own size-s ColorPresets with «no color»; the nested panel closes first. Use it for per-item colors in lists. */
import { Button, ColorPresets, Popover, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const INITIAL_TAGS = [
  { id: "bug", name: "Баг", color: "#ef4444" as string | null },
  { id: "feature", name: "Фича", color: "#5068f5" as string | null },
  { id: "design", name: "Дизайн", color: "#a855f7" as string | null },
  { id: "later", name: "Отложено", color: null as string | null },
];

export default function ColorPresetsTagsExample() {
  const [tags, setTags] = React.useState(INITIAL_TAGS);

  return (
    <Popover.Root defaultOpen={false}>
      <Popover.Trigger>
        <Button.Root variant="outline" tone="neutral">
          Управлять метками
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content size="s">
        <Popover.Header>
          <Popover.Title>Метки</Popover.Title>
        </Popover.Header>
        <div className={styles.tagList}>
          {tags.map((tag) => (
            <div key={tag.id} className={styles.tagRow}>
              <ColorPresets.Root
                size="s"
                allowEmpty
                value={tag.color}
                onValueChange={(color) =>
                  setTags((prev) => prev.map((t) => (t.id === tag.id ? { ...t, color } : t)))
                }
                labels={{ trigger: `Цвет метки «${tag.name}»` }}
              >
                <ColorPresets.Trigger />
                <ColorPresets.Content />
              </ColorPresets.Root>
              <Typography.Root as="span" variant="body-s" truncate className={styles.tagName}>
                {tag.name}
              </Typography.Root>
            </div>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
