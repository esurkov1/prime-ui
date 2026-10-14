/** Documents carried onto folders: a zone takes items by kind and gets the document as data, a locked folder refuses before the release and says why under the carried file, a syncing folder is no target at all, a document on signing stays put, the line above follows the drag, the target flashes where the file landed — `Dnd.Draggable`, `Dnd.DropZone`, `data`, `canDrop`, `disabled`, `onDragStart`, `onDragEnd`, `onEnter`, `onLeave`, `flashOnDrop`. */
import { Badge, Dnd, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Folder = "inbox" | "contracts" | "accounting" | "archive";
type Paper = { id: string; title: string; folder: Folder; signing?: boolean };

/** `locked` refuses with a reason; `syncing` is no target at all while it syncs. */
const FOLDERS: { id: Folder; title: string; locked?: boolean; syncing?: boolean }[] = [
  { id: "contracts", title: "Договоры" },
  { id: "accounting", title: "Бухгалтерия (синхронизация)", syncing: true },
  { id: "archive", title: "Архив (закрыт для записи)", locked: true },
];

const DOCUMENTS: Paper[] = [
  { id: "d1", title: "Договор поставки № 14", folder: "inbox" },
  { id: "d2", title: "Акт сверки за квартал", folder: "inbox" },
  { id: "d3", title: "Счёт на оплату № 482", folder: "inbox", signing: true },
];

export default function DndDropZonesExample() {
  const [documents, setDocuments] = React.useState(DOCUMENTS);
  const [carried, setCarried] = React.useState<string | null>(null);
  const [target, setTarget] = React.useState<string | null>(null);
  const inFolder = (folder: Folder) => documents.filter((doc) => doc.folder === folder);

  const status =
    carried === null
      ? "Перетащите документ в папку"
      : target === null
        ? `«${carried}» — отпустите над папкой`
        : `«${carried}» → ${target}`;

  return (
    <Dnd.Root>
      <div className={styles.stage}>
        <Typography as="p" variant="body-s" tone="muted">
          {status}
        </Typography>
        <div className={styles.board}>
          <section className={styles.column} aria-label="Входящие">
            <div className={styles.columnHeader}>
              <Typography as="h4" variant="title-s">
                Входящие
              </Typography>
              <Badge.Root>{inFolder("inbox").length}</Badge.Root>
            </div>
            {inFolder("inbox").map((doc) => (
              <Dnd.Draggable
                key={doc.id}
                kind="document"
                id={doc.id}
                data={doc}
                label={doc.title}
                disabled={doc.signing}
                className={styles.ticket}
                onDragStart={(item) => setCarried(item.label)}
                onDragEnd={() => {
                  setCarried(null);
                  setTarget(null);
                }}
              >
                <Typography as="span" variant="body-m">
                  {doc.title}
                </Typography>
                {doc.signing ? (
                  <Badge.Root tone="warning" className={styles.badge}>
                    На подписи
                  </Badge.Root>
                ) : null}
              </Dnd.Draggable>
            ))}
          </section>
          {FOLDERS.map((folder) => (
            <Dnd.DropZone<Paper>
              key={folder.id}
              as="section"
              aria-label={folder.title}
              accepts="document"
              flashOnDrop
              disabled={folder.syncing}
              className={styles.column}
              canDrop={() => (folder.locked ? "Архив только для чтения" : true)}
              onEnter={() => setTarget(folder.title)}
              onLeave={() => setTarget(null)}
              onDrop={(item) =>
                setDocuments((current) =>
                  current.map((doc) =>
                    doc.id === item.data.id ? { ...doc, folder: folder.id } : doc,
                  ),
                )
              }
            >
              <div className={styles.columnHeader}>
                <Typography as="h4" variant="title-s">
                  {folder.title}
                </Typography>
                <Badge.Root>{inFolder(folder.id).length}</Badge.Root>
              </div>
              {inFolder(folder.id).map((doc) => (
                <div key={doc.id} className={styles.ticket}>
                  <Typography as="span" variant="body-m">
                    {doc.title}
                  </Typography>
                </div>
              ))}
            </Dnd.DropZone>
          ))}
        </div>
      </div>
    </Dnd.Root>
  );
}
