/** A right-click on a deal opens its menu at the pointer, and Escape or a pick returns focus to that row — `anchorPoint`, `Dropdown.Anchor`. */
import { Card, Dropdown, Icon, List } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const DEALS = [
  { id: "d-1042", title: "Поставка оборудования", client: "ООО «Гранит»" },
  { id: "d-1043", title: "Годовое обслуживание", client: "АО «Северсталь-Сервис»" },
  { id: "d-1044", title: "Пилотный проект", client: "ИП Козлов" },
];

export default function DropdownContextMenuExample() {
  const [menu, setMenu] = React.useState<{ id: string; x: number; y: number } | null>(null);

  return (
    <Card.Root className={styles.column}>
      <Card.Body>
        <List.Root aria-label="Сделки">
          {DEALS.map((deal) => {
            const open = menu?.id === deal.id;
            return (
              <Dropdown.Root
                key={deal.id}
                open={open}
                onOpenChange={(next) => {
                  if (!next) setMenu(null);
                }}
                anchorPoint={open ? menu : null}
              >
                <Dropdown.Anchor>
                  <List.Item
                    onContextMenu={(event) => {
                      event.preventDefault();
                      const box = event.currentTarget.getBoundingClientRect();
                      setMenu({
                        id: deal.id,
                        x: event.clientX - box.left,
                        y: event.clientY - box.top,
                      });
                    }}
                  >
                    <List.ItemText>{deal.title}</List.ItemText>
                    <List.ItemDescription>{deal.client}</List.ItemDescription>
                  </List.Item>
                </Dropdown.Anchor>
                <Dropdown.Content>
                  <Dropdown.Item>
                    <Dropdown.ItemIcon>
                      <Icon name="action.edit" />
                    </Dropdown.ItemIcon>
                    Переименовать
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Dropdown.ItemIcon>
                      <Icon name="action.copy" />
                    </Dropdown.ItemIcon>
                    Дублировать
                  </Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Item tone="danger">
                    <Dropdown.ItemIcon>
                      <Icon name="action.delete" />
                    </Dropdown.ItemIcon>
                    Удалить
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            );
          })}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
