/** An expense form: the choice is a labelled field with a hint, checked on submit, its error leaves as soon as a segment is chosen; an optional choice beside it — `label`, `hint`, `required`, `error`, `optional`. */
import { Button, Input, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SegmentedControlInFormExample() {
  const [owner, setOwner] = React.useState("");
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(owner ? undefined : "Выберите, чей это расход");
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Input.Root label="Сумма" required>
        <Input.Wrapper>
          <Input.Field name="amount" inputMode="decimal" defaultValue="12 400" />
          <Input.InlineAffix side="end">₽</Input.InlineAffix>
        </Input.Wrapper>
      </Input.Root>
      <SegmentedControl.Root
        label="Чей расход"
        hint="Личные расходы не попадают в отчёт компании"
        required
        error={error}
        value={owner}
        onValueChange={(next) => {
          setOwner(next);
          setError(undefined);
        }}
      >
        <SegmentedControl.Item value="company">Компании</SegmentedControl.Item>
        <SegmentedControl.Item value="project">Проекта</SegmentedControl.Item>
        <SegmentedControl.Item value="personal">Личный</SegmentedControl.Item>
      </SegmentedControl.Root>
      <SegmentedControl.Root label="Возмещение" optional defaultValue="salary">
        <SegmentedControl.Item value="salary">С зарплатой</SegmentedControl.Item>
        <SegmentedControl.Item value="card">На карту</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Button.Root type="submit">Сохранить расход</Button.Root>
    </form>
  );
}
