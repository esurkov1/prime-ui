/** Explicit `status` on each step (completed, error with a custom indicator, active, pending) and a disabled step. Use when step status comes from the server, e.g. a failed delivery step. */
import { Stepper } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function StepperStatesExample() {
  return (
    <div className={styles.vertical}>
      <Stepper.Root>
        <Stepper.Step status="completed">
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Оплата прошла</Stepper.Title>
            <Stepper.Description>completed</Stepper.Description>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step status="error">
          <Stepper.Indicator>!</Stepper.Indicator>
          <Stepper.Content>
            <Stepper.Title>Ошибка доставки</Stepper.Title>
            <Stepper.Description>error · проверьте адрес</Stepper.Description>
          </Stepper.Content>
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step status="active">
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Подтверждение</Stepper.Title>
            <Stepper.Description>active</Stepper.Description>
          </Stepper.Content>
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step status="pending">
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Получение</Stepper.Title>
            <Stepper.Description>pending</Stepper.Description>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step status="pending" disabled>
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Отзыв</Stepper.Title>
            <Stepper.Description>disabled</Stepper.Description>
          </Stepper.Content>
        </Stepper.Step>
      </Stepper.Root>
    </div>
  );
}
