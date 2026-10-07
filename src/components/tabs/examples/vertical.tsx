/** Vertical settings tabs inside a card: pill items on the side, section heading aligned with the first tab; stacks on top below 600px. Use for settings pages with several sections. */
import { Bell, Trash2, UserRound } from "lucide-react";
import { Button, Input, Switch, Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TabsVerticalExample() {
  return (
    <div className={styles.card}>
      <Tabs.Root orientation="vertical" defaultValue="notifications">
        <Tabs.List aria-label="Настройки">
          <Tabs.Trigger value="profile">
            <Tabs.Icon>
              <UserRound />
            </Tabs.Icon>
            <Tabs.Label>Профиль</Tabs.Label>
          </Tabs.Trigger>
          <Tabs.Trigger value="notifications">
            <Tabs.Icon>
              <Bell />
            </Tabs.Icon>
            <Tabs.Label>Уведомления</Tabs.Label>
          </Tabs.Trigger>
          <Tabs.Trigger value="danger">
            <Tabs.Icon>
              <Trash2 />
            </Tabs.Icon>
            <Tabs.Label>Удаление</Tabs.Label>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <Typography.Root as="h3" variant="title-s">
                Профиль
              </Typography.Root>
            </div>
            <div className={styles.form}>
              <Input.Root label="Имя">
                <Input.Wrapper>
                  <Input.Field defaultValue="Анна Соколова" />
                </Input.Wrapper>
              </Input.Root>
              <Input.Root label="Должность" optional>
                <Input.Wrapper>
                  <Input.Field placeholder="Например, продакт-менеджер" />
                </Input.Wrapper>
              </Input.Root>
              <div>
                <Button.Root>Сохранить</Button.Root>
              </div>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="notifications">
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <Typography.Root as="h3" variant="title-s">
                Уведомления
              </Typography.Root>
            </div>
            <div className={styles.rows}>
              <Switch.Root defaultChecked hint="Сразу после оформления заказа.">
                <Switch.Label>Письма о новых заказах</Switch.Label>
              </Switch.Root>
              <Switch.Root hint="По понедельникам в 9:00.">
                <Switch.Label>Еженедельная сводка</Switch.Label>
              </Switch.Root>
              <Switch.Root defaultChecked hint="В браузере, пока открыта вкладка.">
                <Switch.Label>Push-уведомления</Switch.Label>
              </Switch.Root>
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="danger">
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <Typography.Root as="h3" variant="title-s">
                Удаление аккаунта
              </Typography.Root>
            </div>
            <Typography.Root variant="body-m" tone="secondary">
              Аккаунт и все данные будут удалены без возможности восстановления.
            </Typography.Root>
            <div>
              <Button.Root variant="outline" tone="danger">
                Удалить аккаунт
              </Button.Root>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
