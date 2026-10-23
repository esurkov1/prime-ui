/** Documents with their buttons: icon buttons with a tooltip, soft, as tall as the row minus 8; the list shows them always or on hover and keyboard focus in the row — `List.ItemActions`, `actions`. */
import { Button, Card, Icon, List, SegmentedControl, Tooltip } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const FILES = [
  { id: "contract", name: "Договор поставки.pdf", note: "2,4 МБ · Анна Котова" },
  { id: "estimate", name: "Смета.xlsx", note: "234 КБ · Павел Орлов" },
  { id: "act", name: "Акт сверки.pdf", note: "1,1 МБ · Ирина Белова" },
];

const MODES = [
  { value: "always", label: "Всегда" },
  { value: "hover", label: "При наведении" },
] as const;

export default function ListActionsExample() {
  const [mode, setMode] = React.useState<"always" | "hover">("always");

  return (
    <>
      <SegmentedControl.Root
        aria-label="Когда видны кнопки"
        value={mode}
        onValueChange={(next) => setMode(next as "always" | "hover")}
      >
        {MODES.map((item) => (
          <SegmentedControl.Item key={item.value} value={item.value}>
            {item.label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <Card.Root className={styles.pane}>
        <Card.Body>
          <List.Root aria-label="Документы сделки" actions={mode}>
            {FILES.map((file) => (
              <List.Item key={file.id} value={file.id}>
                <List.ItemIcon>
                  <Icon name="object.file" />
                </List.ItemIcon>
                <List.ItemText>{file.name}</List.ItemText>
                <List.ItemDescription>{file.note}</List.ItemDescription>
                <List.ItemActions>
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <Button.Root
                        variant="soft"
                        tone="neutral"
                        aria-label={`Сохранить ${file.name}`}
                      >
                        <Button.Icon>
                          <Icon name="action.download" />
                        </Button.Icon>
                      </Button.Root>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Сохранить</Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <Button.Root variant="soft" tone="danger" aria-label={`Удалить ${file.name}`}>
                        <Button.Icon>
                          <Icon name="action.delete" />
                        </Button.Icon>
                      </Button.Root>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Удалить</Tooltip.Content>
                  </Tooltip.Root>
                </List.ItemActions>
              </List.Item>
            ))}
          </List.Root>
        </Card.Body>
      </Card.Root>
    </>
  );
}
