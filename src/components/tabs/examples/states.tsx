/** A disabled tab that clicks and arrow keys skip — `disabled`. */
import { Tabs, Typography } from "prime-ui-kit";

export default function TabsStatesExample() {
  return (
    <Tabs.Root defaultValue="profile">
      <Tabs.List aria-label="Аккаунт">
        <Tabs.Item value="profile">Профиль</Tabs.Item>
        <Tabs.Item value="security">Безопасность</Tabs.Item>
        <Tabs.Item value="billing" disabled>
          Оплата
        </Tabs.Item>
      </Tabs.List>
      <Tabs.Panel value="profile">
        <Typography variant="body-m" tone="secondary">
          Имя, должность и контакты.
        </Typography>
      </Tabs.Panel>
      <Tabs.Panel value="security">
        <Typography variant="body-m" tone="secondary">
          Пароль и двухфакторная защита.
        </Typography>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
