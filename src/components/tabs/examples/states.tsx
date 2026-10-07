/** Icons with labels, a disabled tab skipped by arrows, and overflow in a phone-width container (scrolls with faded edges). Use to check icon, disabled and narrow-screen behaviour. */
import { Bell, CreditCard, Shield, User } from "lucide-react";
import { Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TabsStatesExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.group}>
        <Typography.Root variant="caption" weight="medium" tone="secondary">
          Иконки и disabled
        </Typography.Root>
        <Tabs.Root defaultValue="profile">
          <Tabs.List aria-label="Аккаунт">
            <Tabs.Trigger value="profile">
              <Tabs.Icon>
                <User />
              </Tabs.Icon>
              <Tabs.Label>Профиль</Tabs.Label>
            </Tabs.Trigger>
            <Tabs.Trigger value="security">
              <Tabs.Icon>
                <Shield />
              </Tabs.Icon>
              <Tabs.Label>Безопасность</Tabs.Label>
            </Tabs.Trigger>
            <Tabs.Trigger value="billing" disabled>
              <Tabs.Icon>
                <CreditCard />
              </Tabs.Icon>
              <Tabs.Label>Оплата</Tabs.Label>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>

      <div className={styles.group}>
        <Typography.Root variant="caption" weight="medium" tone="secondary">
          Переполнение в 375px
        </Typography.Root>
        <div className={styles.narrow}>
          <Tabs.Root defaultValue="notifications">
            <Tabs.List aria-label="Настройки">
              <Tabs.Trigger value="general">Общие</Tabs.Trigger>
              <Tabs.Trigger value="team">Команда</Tabs.Trigger>
              <Tabs.Trigger value="notifications">
                <Tabs.Icon>
                  <Bell />
                </Tabs.Icon>
                <Tabs.Label>Уведомления</Tabs.Label>
              </Tabs.Trigger>
              <Tabs.Trigger value="integrations">Интеграции</Tabs.Trigger>
              <Tabs.Trigger value="api">API</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
