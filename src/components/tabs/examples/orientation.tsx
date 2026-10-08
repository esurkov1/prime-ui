/** Account settings with a side list of sections: the active section reaches out of the panel, and below 600px the list moves above it — `orientation`. */
import { Button, Icon, Input, Switch, Tabs, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TabsOrientationExample() {
  return (
    <Tabs.Root orientation="vertical" defaultValue="notifications" className={styles.wide}>
      <Tabs.List aria-label="Настройки аккаунта">
        <Tabs.Item value="profile">
          <Tabs.Icon>
            <Icon name="object.user" />
          </Tabs.Icon>
          <Tabs.Label>Профиль</Tabs.Label>
        </Tabs.Item>
        <Tabs.Item value="notifications">
          <Tabs.Icon>
            <Icon name="object.bell" />
          </Tabs.Icon>
          <Tabs.Label>Уведомления</Tabs.Label>
        </Tabs.Item>
        <Tabs.Item value="security">
          <Tabs.Icon>
            <Icon name="object.key" />
          </Tabs.Icon>
          <Tabs.Label>Безопасность</Tabs.Label>
        </Tabs.Item>
        <Tabs.Separator />
        <Tabs.Item value="deletion">
          <Tabs.Icon>
            <Icon name="action.delete" />
          </Tabs.Icon>
          <Tabs.Label>Удаление</Tabs.Label>
        </Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value="profile">
        <div className={styles.form}>
          <Input.Root label="Имя и фамилия">
            <Input.Wrapper>
              <Input.Field defaultValue="Анна Смирнова" autoComplete="name" />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root label="Должность">
            <Input.Wrapper>
              <Input.Field defaultValue="Руководитель отдела продаж" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="notifications">
        <div className={styles.form}>
          <Switch.Root defaultChecked hint="Письмо, как только заказ оплачен или отменён">
            <Switch.Label>Статусы заказов</Switch.Label>
          </Switch.Root>
          <Switch.Root defaultChecked hint="По понедельникам в 09:00">
            <Switch.Label>Сводка за неделю</Switch.Label>
          </Switch.Root>
          <Switch.Root hint="Новые функции и вебинары">
            <Switch.Label>Новости продукта</Switch.Label>
          </Switch.Root>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="security">
        <div className={styles.form}>
          <Input.Root label="Новый пароль" hint="Не короче 12 символов">
            <Input.Wrapper>
              <Input.Field type="password" autoComplete="new-password" />
            </Input.Wrapper>
          </Input.Root>
          <Switch.Root defaultChecked hint="Код из приложения при каждом входе">
            <Switch.Label>Двухфакторная проверка</Switch.Label>
          </Switch.Root>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="deletion">
        <div className={styles.form}>
          <Typography variant="body-m" tone="secondary">
            Аккаунт и все данные будут удалены через 30 дней. До этого срока удаление можно
            отменить.
          </Typography>
          <div>
            <Button.Root tone="danger" variant="soft">
              Удалить аккаунт
            </Button.Root>
          </div>
        </div>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
