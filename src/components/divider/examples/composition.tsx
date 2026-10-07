/** An «или» divider between sign-in options, a section heading with an icon and presentation lines between list rows. Use when lines separate content inside one surface. */
import { Button, Divider, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const rows = [
  { label: "Пароль", value: "Изменён 12 дней назад" },
  { label: "Двухфакторный вход", value: "Включён" },
  { label: "Активные сессии", value: "3 устройства" },
];

export default function DividerCompositionExample() {
  return (
    <div className={styles.column}>
      <div className={styles.stack}>
        <Button.Root fullWidth>Войти</Button.Root>
        <Divider.Root>или</Divider.Root>
        <Button.Root variant="outline" tone="neutral" fullWidth>
          <Button.Icon>
            <Icon name="field.email" />
          </Button.Icon>
          Получить ссылку на почту
        </Button.Root>
      </div>

      <div>
        <Divider.Root align="start">
          <Icon name="status.locked" />
          Безопасность
        </Divider.Root>
        <div className={styles.list}>
          {rows.map((row, index) => (
            <div key={row.label}>
              {index > 0 ? <Divider.Root role="presentation" /> : null}
              <div className={styles.listRow}>
                <Typography.Root as="span" variant="body-m">
                  {row.label}
                </Typography.Root>
                <Typography.Root as="span" variant="body-m" tone="secondary">
                  {row.value}
                </Typography.Root>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
