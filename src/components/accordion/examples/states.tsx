/** A disabled section that cannot be opened, next to regular ones — `disabled`. */
import { Accordion } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function AccordionStatesExample() {
  return (
    <div className={styles.panel}>
      <Accordion.Root defaultValue="profile">
        <Accordion.Item value="profile">
          <Accordion.Header>
            <Accordion.Trigger>Профиль</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Имя, фото и язык интерфейса.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="security">
          <Accordion.Header>
            <Accordion.Trigger>Безопасность</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Пароль, двухфакторная защита и активные сессии.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="sso" disabled>
          <Accordion.Header>
            <Accordion.Trigger>Единый вход (SSO) — на тарифе «Корпоративный»</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>Подключите тариф, чтобы настроить единый вход.</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
