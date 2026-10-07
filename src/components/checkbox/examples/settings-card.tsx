/** A settings card with a parent «all channels» checkbox, nested options, a disabled option with a hint and a standalone setting. Use it for grouped preferences inside a form. */
import { Button, Card, Checkbox, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CHANNELS = [
  { id: "email", label: "Почта" },
  { id: "push", label: "Push в браузере" },
  { id: "telegram", label: "Telegram" },
];

export default function CheckboxSettingsCardExample() {
  const [channels, setChannels] = React.useState<string[]>(["email"]);
  const [digest, setDigest] = React.useState(true);

  const headingId = React.useId();
  const all = channels.length === CHANNELS.length;

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Уведомления</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <fieldset aria-labelledby={headingId} className={styles.group}>
          <Typography.Root id={headingId} variant="body-s" weight="medium" tone="secondary">
            Куда присылать
          </Typography.Root>
          <Checkbox.Root
            onCheckedChange={(checked) => setChannels(checked ? CHANNELS.map((c) => c.id) : [])}
            checked={all}
            indeterminate={channels.length > 0 && !all}
          >
            <Checkbox.Label>Все каналы</Checkbox.Label>
          </Checkbox.Root>
          <div className={styles.nested}>
            {CHANNELS.map((channel) => (
              <Checkbox.Root
                onCheckedChange={(checked) =>
                  setChannels((prev) =>
                    checked ? [...prev, channel.id] : prev.filter((id) => id !== channel.id),
                  )
                }
                key={channel.id}
                name="channels"
                value={channel.id}
                checked={channels.includes(channel.id)}
              >
                <Checkbox.Label>{channel.label}</Checkbox.Label>
              </Checkbox.Root>
            ))}
            <Checkbox.Root name="channels" value="sms" disabled>
              <Checkbox.Label>SMS</Checkbox.Label>
              <Checkbox.Hint>Доступно на тарифе «Бизнес».</Checkbox.Hint>
            </Checkbox.Root>
          </div>
        </fieldset>
        <Checkbox.Root
          onCheckedChange={(checked) => setDigest(checked)}
          name="digest"
          checked={digest}
        >
          <Checkbox.Label>Еженедельная сводка</Checkbox.Label>
          <Checkbox.Hint>Упоминания, задачи и комментарии за неделю одним письмом.</Checkbox.Hint>
        </Checkbox.Root>
      </Card.Body>
      <Card.Actions>
        <Button.Root variant="ghost" tone="neutral">
          Отмена
        </Button.Root>
        <Button.Root>Сохранить</Button.Root>
      </Card.Actions>
    </Card.Root>
  );
}
