/** A notifications card where a master switch disables the other channels and an unavailable channel explains why. Use it for dependent settings. */

import { Card, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SwitchNotificationSettingsExample() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Уведомления</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <div className={styles.column}>
          <Switch.Root checked={enabled} onCheckedChange={setEnabled}>
            <Switch.Label>Присылать уведомления</Switch.Label>
            <Switch.Hint>Отключает все каналы разом.</Switch.Hint>
          </Switch.Root>
          <Switch.Root defaultChecked disabled={!enabled}>
            <Switch.Label>Новые заказы</Switch.Label>
            <Switch.Hint>Пуш и письмо сразу после оплаты.</Switch.Hint>
          </Switch.Root>
          <Switch.Root defaultChecked disabled={!enabled}>
            <Switch.Label>Отзывы покупателей</Switch.Label>
          </Switch.Root>
          <Switch.Root disabled>
            <Switch.Label>SMS</Switch.Label>
            <Switch.Hint>Подтвердите номер телефона в профиле.</Switch.Hint>
          </Switch.Root>
        </div>
      </Card.Body>
    </Card.Root>
  );
}
