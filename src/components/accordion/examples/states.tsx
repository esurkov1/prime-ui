/** Leading icons, a custom «+ / −» arrow, controlled `type="multiple"` and a disabled item. Use for settings groups where several sections can stay open. */

import { Lock, Minus, Plus, Shield, User } from "lucide-react";
import { Accordion, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function AccordionStatesExample() {
  const [open, setOpen] = React.useState<string[]>(["profile", "security"]);

  return (
    <div className={styles.stack}>
      <div className={styles.group}>
        <Typography.Root variant="caption" tone="muted">
          <Typography.Root as="span" variant="code" tone="muted">
            type="multiple"
          </Typography.Root>{" "}
          · открыто: {open.length ? open.join(", ") : "ничего"}
        </Typography.Root>
        <Accordion.Root type="multiple" value={open} onValueChange={(v) => setOpen(v as string[])}>
          <Accordion.Item value="profile">
            <Accordion.Header>
              <Accordion.Trigger>
                <Accordion.Icon as={User} />
                <span>Профиль</span>
                <Accordion.Arrow icon={Plus} openIcon={Minus} />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Имя, фото и язык интерфейса.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="security">
            <Accordion.Header>
              <Accordion.Trigger>
                <Accordion.Icon as={Shield} />
                <span>Безопасность</span>
                <Accordion.Arrow icon={Plus} openIcon={Minus} />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Пароль, двухфакторная защита и активные сессии.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="sso" disabled>
            <Accordion.Header>
              <Accordion.Trigger>
                <Accordion.Icon as={Lock} />
                <span>Единый вход (SSO) — на тарифе «Корпоративный»</span>
                <Accordion.Arrow icon={Plus} openIcon={Minus} />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Недоступно.</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}
