/** `Dnd.Draggable` + `Dnd.DropZone`: files carried onto folders. A zone takes items by kind, can refuse one (`canDrop`, here a locked folder) and turns `danger` before the release; `flashOnDrop` shows where the file landed. Use for "put this there" moves where the target has no inner order. */
import { Badge, Dnd, Typography } from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

type Folder = "inbox" | "contracts" | "archive";

const FOLDERS: { id: Folder; title: string; locked?: boolean }[] = [
  { id: "contracts", title: "Договоры" },
  { id: "archive", title: "Архив (закрыт для записи)", locked: true },
];

const INITIAL = [
  { id: "f1", title: "Договор поставки № 14", folder: "inbox" as Folder },
  { id: "f2", title: "Акт сверки за квартал", folder: "inbox" as Folder },
  { id: "f3", title: "Счёт на оплату", folder: "inbox" as Folder },
];

export default function DndDropZonesExample() {
  const [files, setFiles] = useState(INITIAL);
  const inFolder = (folder: Folder) => files.filter((f) => f.folder === folder);

  return (
    <Dnd.Root>
      <div className={styles.board}>
        <section className={styles.column} aria-label="Входящие">
          <div className={styles.columnHeader}>
            <Typography.Root as="h4" variant="title-s">
              Входящие
            </Typography.Root>
            <Badge.Root>{inFolder("inbox").length}</Badge.Root>
          </div>
          {inFolder("inbox").map((file) => (
            <Dnd.Draggable
              key={file.id}
              kind="file"
              id={file.id}
              label={file.title}
              className={styles.ticket}
            >
              <Typography.Root as="span" variant="body-m">
                {file.title}
              </Typography.Root>
            </Dnd.Draggable>
          ))}
        </section>
        {FOLDERS.map((folder) => (
          <Dnd.DropZone
            key={folder.id}
            as="section"
            aria-label={folder.title}
            accepts="file"
            flashOnDrop
            className={styles.column}
            canDrop={() => !folder.locked}
            onDrop={(item) =>
              setFiles((current) =>
                current.map((f) => (f.id === item.id ? { ...f, folder: folder.id } : f)),
              )
            }
          >
            <div className={styles.columnHeader}>
              <Typography.Root as="h4" variant="title-s">
                {folder.title}
              </Typography.Root>
              <Badge.Root>{inFolder(folder.id).length}</Badge.Root>
            </div>
            {inFolder(folder.id).map((file) => (
              <div key={file.id} className={styles.ticket}>
                <Typography.Root as="span" variant="body-m">
                  {file.title}
                </Typography.Root>
              </div>
            ))}
          </Dnd.DropZone>
        ))}
      </div>
    </Dnd.Root>
  );
}
