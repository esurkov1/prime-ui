/** A company settings panel: a header, fields on the surface fill and buttons in the footer — `Card.Header`, `Card.Body`, `Card.Footer`. */
import { Button, Card, Input, Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardOverviewExample() {
  return (
    <div className={styles.panel}>
      <Card.Root variant="panel">
        <Card.Header>
          <Card.Title>Профиль компании</Card.Title>
        </Card.Header>
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
        <Card.Footer>
          <Button.Root variant="ghost" tone="neutral">
            Отмена
          </Button.Root>
          <Button.Root>Сохранить</Button.Root>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
