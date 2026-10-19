/** API keys of an assistant, each row with two actions that stand as one group at its end — `DescriptionList.ItemAction`. */
import { Card, DescriptionList, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const KEYS = [
  { id: "openai", label: "OpenAI", masked: "sk-proj-…4f2a" },
  { id: "anthropic", label: "Anthropic", masked: "sk-ant-…91c0" },
  { id: "yandex", label: "YandexGPT", masked: "AQVN…k7Xe" },
];

export default function DescriptionListRowActionsExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Header>
        <Card.Title>Ключи API</Card.Title>
      </Card.Header>
      <Card.Body>
        <DescriptionList.Root>
          {KEYS.map((key) => (
            <DescriptionList.Item key={key.id} label={key.label}>
              {key.masked}
              <DescriptionList.ItemAction label={`Проверить ключ ${key.label}`}>
                <Icon name="action.check" />
              </DescriptionList.ItemAction>
              <DescriptionList.ItemAction label={`Заменить ключ ${key.label}`}>
                <Icon name="action.edit" />
              </DescriptionList.ItemAction>
            </DescriptionList.Item>
          ))}
        </DescriptionList.Root>
      </Card.Body>
    </Card.Root>
  );
}
