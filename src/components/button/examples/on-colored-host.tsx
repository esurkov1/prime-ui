/** Actions on a colored strip take its text color: a ghost icon close and a soft action — `tone="inherit"`. */
import { Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const HOSTS = [
  { className: styles.accentHost, text: "Доступна новая версия редактора" },
  { className: styles.inverseHost, text: "Режим только для чтения" },
];

export default function ButtonOnColoredHostExample() {
  return (
    <>
      {HOSTS.map(({ className, text }) => (
        <div key={text} className={className}>
          <span className={styles.hostText}>{text}</span>
          <Button.Root variant="soft" tone="inherit" size="s">
            Обновить
          </Button.Root>
          <Button.Root variant="ghost" tone="inherit" size="s" aria-label="Закрыть">
            <Button.Icon>
              <Icon name="action.close" />
            </Button.Icon>
          </Button.Root>
        </div>
      ))}
    </>
  );
}
