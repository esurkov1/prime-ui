/** Documents carried onto folders: a zone takes items by kind, a locked folder refuses before the release, the target flashes where the file landed — `Dnd.Draggable`, `Dnd.DropZone`, `canDrop`, `flashOnDrop`. */
import { Badge, Dnd, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Folder = "inbox" | "contracts" | "archive";
type Paper = { id: string; title: string; folder: Folder };

const FOLDERS: { id: Folder; title: string; locked?: boolean }[] = [
  { id: "contracts", title: "Договоры" },
  { id: "archive", title: "Архив (закрыт для записи)", locked: true },
];

const DOCUMENTS: Paper[] = [
  { id: "d1", title: "Договор поставки № 14", folder: "inbox" },
  { id: "d2", title: "Акт сверки за квартал", folder: "inbox" },
  { id: "d3", title: "Счёт на оплату", folder: "inbox" },
];

export default function DndDropZonesExample() {
  const [documents, setDocuments] = React.useState(DOCUMENTS);
  const inFolder = (folder: Folder) => documents.filter((doc) => doc.folder === folder);

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
          {inFolder("inbox").map((doc) => (
            <Dnd.Draggable
              key={doc.id}
              kind="document"
              id={doc.id}
              label={doc.title}
              className={styles.ticket}
            >
              <Typography.Root as="span" variant="body-m">
                {doc.title}
              </Typography.Root>
            </Dnd.Draggable>
          ))}
        </section>
        {FOLDERS.map((folder) => (
          <Dnd.DropZone
            key={folder.id}
            as="section"
            aria-label={folder.title}
            accepts="document"
            flashOnDrop
            className={styles.column}
            canDrop={() => !folder.locked}
            onDrop={(item) =>
              setDocuments((current) =>
                current.map((doc) => (doc.id === item.id ? { ...doc, folder: folder.id } : doc)),
              )
            }
          >
            <div className={styles.columnHeader}>
              <Typography.Root as="h4" variant="title-s">
                {folder.title}
              </Typography.Root>
              <Badge.Root>{inFolder(folder.id).length}</Badge.Root>
            </div>
            {inFolder(folder.id).map((doc) => (
              <div key={doc.id} className={styles.ticket}>
                <Typography.Root as="span" variant="body-m">
                  {doc.title}
                </Typography.Root>
              </div>
            ))}
          </Dnd.DropZone>
        ))}
      </div>
    </Dnd.Root>
  );
}
