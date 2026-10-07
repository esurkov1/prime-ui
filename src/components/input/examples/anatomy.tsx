/** Field anatomy on every size: label, required/optional markers, placeholder, hint, error and counter. Use it as the reference for how a field is assembled. */
import { Input, Typography } from "prime-ui-kit";
import type * as React from "react";

import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;
type Size = (typeof SIZES)[number];

const ROWS: { title: string; render: (size: Size) => React.ReactNode }[] = [
  {
    title: "Обязательное: подпись, *, плейсхолдер, подсказка",
    render: (size) => (
      <Input.Root size={size} label="Email" required hint="Пришлём ссылку для входа">
        <Input.Wrapper>
          <Input.Field type="email" placeholder="name@company.ru" />
        </Input.Wrapper>
      </Input.Root>
    ),
  },
  {
    title: "Необязательное и счётчик",
    render: (size) => (
      <Input.Root
        size={size}
        label="Должность"
        optional
        counter={<Input.Counter current={14} max={40} />}
      >
        <Input.Wrapper>
          <Input.Field defaultValue="Менеджер по ИТ" maxLength={40} />
        </Input.Wrapper>
      </Input.Root>
    ),
  },
  {
    title: "Ошибка вместо подсказки",
    render: (size) => (
      <Input.Root size={size} label="ИНН" required error="ИНН состоит из 10 или 12 цифр">
        <Input.Wrapper>
          <Input.Field defaultValue="77010" inputMode="numeric" />
        </Input.Wrapper>
      </Input.Root>
    ),
  },
];

export default function InputAnatomyExample() {
  return (
    <div className={styles.anatomyScroller}>
      <div className={styles.anatomyGrid}>
        {SIZES.map((size) => (
          <Typography.Root key={size} variant="code" tone="muted">
            size="{size}"
          </Typography.Root>
        ))}
        {ROWS.map((row) => (
          <div key={row.title} className={styles.anatomyRow}>
            <Typography.Root variant="caption" tone="muted" className={styles.anatomyRowHead}>
              {row.title}
            </Typography.Root>
            {SIZES.map((size) => (
              <div key={size}>{row.render(size)}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
