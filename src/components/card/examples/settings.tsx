/** Settings card: fields inside a card switch to the `field-bg-surface` fill, 20px between fields, actions in the footer on the right. Use for settings and profile forms. */

import { Button, Card, Input, Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardSettingsExample() {
  return (
    <div className={styles.panel}>
      <Card.Root variant="panel">
        <Card.SectionHeader>
          <Card.SectionTitle>Профиль компании</Card.SectionTitle>
        </Card.SectionHeader>
        <Card.Body>
          <div className={styles.form}>
            <Input.Root label="Название" required>
              <Input.Wrapper>
                <Input.Field defaultValue="ООО «Прайм»" />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Сайт" optional hint="Покажем в счетах и письмах">
              <Input.Wrapper>
                <Input.Field placeholder="https://" />
              </Input.Wrapper>
            </Input.Root>
            <Switch.Root defaultChecked>
              <Switch.Label>Отправлять ежемесячный отчёт</Switch.Label>
            </Switch.Root>
          </div>
        </Card.Body>
        <Card.Actions>
          <Button.Root variant="ghost" tone="neutral">
            Отмена
          </Button.Root>
          <Button.Root>Сохранить</Button.Root>
        </Card.Actions>
      </Card.Root>
    </div>
  );
}
