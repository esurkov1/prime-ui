/** A leave request form: submit reads the period from the form data and checks it, the error shakes in and leaves once the period is fixed; an optional return date — `name`, `required`, `error`, `optional`. */
import { Button, Card, Datepicker, type DatepickerRange, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const EMPTY_PERIOD: DatepickerRange = { from: null, to: null };

export default function DatepickerInFormExample() {
  const [period, setPeriod] = React.useState<DatepickerRange>(EMPTY_PERIOD);
  const [error, setError] = React.useState<string>();
  const [sent, setSent] = React.useState(false);

  return (
    <Card.Root className={styles.formCard}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          // The range submits `from`, then `to` under its name ("2026-07-06").
          const [from, to] = new FormData(event.currentTarget).getAll("vacation");
          const complete = Boolean(from && to);
          setError(complete ? undefined : "Укажите начало и конец отпуска");
          setSent(complete);
        }}
      >
        <Datepicker.Root
          mode="range"
          name="vacation"
          label="Период отпуска"
          required
          hint="Не больше 28 дней подряд"
          error={error}
          value={period}
          onValueChange={(next) => {
            setPeriod(next);
            setError(undefined);
            setSent(false);
          }}
          months={2}
          footer
          placeholder="Выбрать период"
          fullWidth
        />
        <Datepicker.Root
          mode="single"
          name="returnDate"
          label="Выход на работу"
          optional
          fullWidth
        />
        {sent ? (
          <Typography as="p" variant="body-s" tone="secondary" role="status">
            Заявка отправлена на согласование.
          </Typography>
        ) : null}
        <div className={styles.actions}>
          <Button.Root
            variant="ghost"
            tone="neutral"
            onClick={() => {
              setPeriod(EMPTY_PERIOD);
              setError(undefined);
              setSent(false);
            }}
          >
            Отмена
          </Button.Root>
          <Button.Root type="submit">Отправить заявку</Button.Root>
        </div>
      </form>
    </Card.Root>
  );
}
