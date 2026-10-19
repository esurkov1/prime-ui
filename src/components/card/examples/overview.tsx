/** A company settings form on a card: a header, fields on the surface fill and the submit button in the footer — `Card.Header`, `Card.Body`, `Card.Footer`. */
import { Button, Card, Fieldset, Input, Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardOverviewExample() {
  return (
    <form className={styles.panel} onSubmit={(event) => event.preventDefault()}>
      <Card.Root variant="panel">
        <Card.Header>
          <Card.Title>Профиль компании</Card.Title>
        </Card.Header>
        <Card.Body>
          <Fieldset>
            <Input.Root label="Название" required>
              <Input.Wrapper>
                <Input.Field name="name" defaultValue="ООО «Прайм»" />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root label="Сайт" optional hint="Покажем в счетах и письмах">
              <Input.Wrapper>
                <Input.Field name="site" type="url" placeholder="https://" />
              </Input.Wrapper>
            </Input.Root>
            <Switch.Root name="report" defaultChecked>
              <Switch.Label>Отправлять ежемесячный отчёт</Switch.Label>
            </Switch.Root>
          </Fieldset>
        </Card.Body>
        <Card.Footer>
          <Button.Root type="reset" variant="soft" tone="neutral">
            Отмена
          </Button.Root>
          <Button.Root type="submit">Сохранить</Button.Root>
        </Card.Footer>
      </Card.Root>
    </form>
  );
}
