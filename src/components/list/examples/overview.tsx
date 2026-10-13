/** Support dialogs with a preview, the time and the unread count; a click opens a dialog and makes it the current row — `current`, `onClick`. */
import { Card, List } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const DIALOGS = [
  {
    id: "granit",
    client: "ООО «Гранит»",
    preview: "Счёт № 4821 пришёл без НДС",
    time: "15:02",
    unread: 2,
  },
  {
    id: "leto",
    client: "ООО «Лето»",
    preview: "Можно перенести доставку на среду?",
    time: "13:40",
    unread: 0,
  },
  {
    id: "kozlov",
    client: "ИП Козлов",
    preview: "Подключите, пожалуйста, ЭДО",
    time: "вчера",
    unread: 1,
  },
  {
    id: "sever",
    client: "АО «Северсталь-Сервис»",
    preview: "Акт сверки за сентябрь подписан",
    time: "6 окт",
    unread: 0,
  },
];

export default function ListOverviewExample() {
  const [dialogId, setDialogId] = React.useState("granit");

  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root aria-label="Диалоги">
          {DIALOGS.map((dialog) => (
            <List.Item
              key={dialog.id}
              current={dialog.id === dialogId}
              onClick={() => setDialogId(dialog.id)}
            >
              <List.ItemText>{dialog.client}</List.ItemText>
              <List.ItemDescription>{dialog.preview}</List.ItemDescription>
              <List.ItemMeta>{dialog.time}</List.ItemMeta>
              {dialog.unread > 0 ? (
                <List.ItemCount color="blue">{dialog.unread}</List.ItemCount>
              ) : null}
            </List.Item>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
