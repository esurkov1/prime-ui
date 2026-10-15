/** The parent owns the page: a finding opens its photo, and paging in the viewer moves the mark along the list — `index`, `onIndexChange`. */
import { List, MediaViewer, type MediaViewerItem } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const FINDINGS = [
  ["crack", "Трещина в отбойнике рампы 2"],
  ["floor", "Скол покрытия у ворот 4"],
  ["light", "Не горят две лампы в зоне отгрузки"],
  ["boxes", "Возвраты не разобраны с прошлой недели"],
] as const;

const PHOTOS: MediaViewerItem[] = FINDINGS.map(([id, alt]) => ({
  src: `https://picsum.photos/seed/finding-${id}/1600/1200`,
  width: 1600,
  height: 1200,
  alt,
  caption: alt,
}));

export default function MediaViewerControlledExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <div className={styles.findings}>
        <List.Root aria-label="Замечания проверки">
          {FINDINGS.map(([id, title], at) => (
            <List.Item
              key={id}
              value={id}
              current={at === index}
              onClick={() => {
                setIndex(at);
                setOpen(true);
              }}
            >
              <List.ItemText>{title}</List.ItemText>
            </List.Item>
          ))}
        </List.Root>
      </div>
      <MediaViewer
        items={PHOTOS}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}
