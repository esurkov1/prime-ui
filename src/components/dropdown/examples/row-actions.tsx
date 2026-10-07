/** Card toolbar: the primary action stays visible, the rest go into an icon-only «⋯» menu aligned to the end. Use for secondary actions of a card or table row. */
import { Copy, Download, Ellipsis, Pencil, Share2, Trash2 } from "lucide-react";
import { Button, Card, Dropdown, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DropdownRowActionsExample() {
  return (
    <Card.Root variant="mini" className={styles.toolbar}>
      <div className={styles.toolbarText}>
        <Typography.Root as="span" variant="title-s" truncate>
          Отчёт о выплатах за сентябрь
        </Typography.Root>
        <Typography.Root as="span" variant="caption" tone="secondary">
          Обновлён 2 часа назад · 1,2 МБ
        </Typography.Root>
      </div>
      <div className={styles.toolbarActions}>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Download />
          </Button.Icon>
          Скачать
        </Button.Root>
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button.Root variant="ghost" tone="neutral" aria-label="Другие действия">
              <Button.Icon>
                <Ellipsis />
              </Button.Icon>
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align="end">
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Pencil} />
              Переименовать
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Copy} />
              Дублировать
            </Dropdown.Item>
            <Dropdown.Item>
              <Dropdown.ItemIcon as={Share2} />
              Поделиться
            </Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item tone="danger">
              <Dropdown.ItemIcon as={Trash2} />
              Удалить
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    </Card.Root>
  );
}
