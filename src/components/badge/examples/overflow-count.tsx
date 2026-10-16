/** The sections of each role in one line of a narrow cell: what does not fit waits behind «+N» with the full list in its tooltip — `Badge.Group`, `overflow`. */
import { Badge, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const ROLES = [
  {
    name: "Администратор",
    sections: ["Сделки", "Контакты", "Счета", "Отчёты", "Склад", "Настройки"],
  },
  { name: "Менеджер", sections: ["Сделки", "Контакты", "Задачи"] },
  { name: "Бухгалтер", sections: ["Счета", "Акты", "Платежи", "Отчёты"] },
];

export default function BadgeOverflowCountExample() {
  return (
    <div className={styles.roles}>
      {ROLES.map((role) => (
        <div key={role.name} className={styles.role}>
          <Typography as="span" variant="body-m">
            {role.name}
          </Typography>
          <Badge.Group overflow="count" aria-label={`Разделы роли «${role.name}»`}>
            {role.sections.map((section) => (
              <Badge.Root key={section}>{section}</Badge.Root>
            ))}
          </Badge.Group>
        </div>
      ))}
    </div>
  );
}
