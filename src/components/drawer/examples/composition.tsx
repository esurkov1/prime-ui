/** Settings drawer: a grouped form in the body, Cancel / Save in the footer with a loading state. Use for editing settings or a record next to the page. */
import { Settings } from "lucide-react";
import { Button, Drawer, Input, Label, SegmentedControl, Select, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DrawerCompositionExample() {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const languageId = React.useId();

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setOpen(false);
    }, 1000);
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Settings />
          </Button.Icon>
          Настройки рабочего пространства
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Icon>
            <Settings />
          </Drawer.Icon>
          <Drawer.Title>Рабочее пространство</Drawer.Title>
          <Drawer.Description>Изменения увидят все участники</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <div className={styles.form}>
            <Input.Root label="Название" required>
              <Input.Wrapper>
                <Input.Field defaultValue="Команда продукта" />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Адрес" hint="Только латиница, цифры и дефис">
              <Input.Wrapper>
                <Input.Field defaultValue="product-team" />
              </Input.Wrapper>
            </Input.Root>
            <div className={styles.field}>
              <Label.Root id={languageId}>Язык интерфейса</Label.Root>
              <Select.Root defaultValue="ru">
                <Select.Trigger aria-labelledby={languageId}>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="ru">Русский</Select.Item>
                  <Select.Item value="en">English</Select.Item>
                  <Select.Item value="kk">Қазақша</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            <div className={styles.field}>
              <Label.Root>Начало недели</Label.Root>
              <SegmentedControl.Root defaultValue="mon" fullWidth aria-label="Начало недели">
                <SegmentedControl.Item value="mon">Понедельник</SegmentedControl.Item>
                <SegmentedControl.Item value="sun">Воскресенье</SegmentedControl.Item>
              </SegmentedControl.Root>
            </div>
            <div className={styles.group}>
              <Switch.Root defaultChecked>
                <Switch.Label>Письма о новых задачах</Switch.Label>
              </Switch.Root>
              <Switch.Root>
                <Switch.Label>Еженедельная сводка</Switch.Label>
              </Switch.Root>
            </div>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral" disabled={saving}>
              Отмена
            </Button.Root>
          </Drawer.Close>
          <Button.Root loading={saving} onClick={save}>
            Сохранить
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
