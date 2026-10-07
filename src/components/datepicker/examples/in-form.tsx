/** A leave request in a card: a required range with a hint that turns into an error after submit, and an optional single date. Use it for date fields inside forms. */
import { Button, Card, Datepicker, type DatepickerRange } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DatepickerInFormExample() {
  const [range, setRange] = React.useState<DatepickerRange>({ from: null, to: null });
  const [returnDay, setReturnDay] = React.useState<Date | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const missing = submitted && (!range.from || !range.to);

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Заявка на отпуск</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <Datepicker.Root
            mode="range"
            label="Период"
            required
            hint="Не больше 28 дней подряд"
            error={missing ? "Укажите начало и конец отпуска" : undefined}
            value={range}
            onValueChange={setRange}
            months={2}
            footer
            placeholder="Выбрать период"
            fullWidth
          />
          <Datepicker.Root
            mode="single"
            label="Выход на работу"
            optional
            value={returnDay}
            onValueChange={setReturnDay}
            fullWidth
          />
          <div className={styles.actions}>
            <Button.Root variant="ghost" tone="neutral">
              Отмена
            </Button.Root>
            <Button.Root type="submit">Отправить</Button.Root>
          </div>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
