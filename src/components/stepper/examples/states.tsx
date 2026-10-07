/** Statuses that come from the server, a failed step with its own indicator and a locked step — `status`, `disabled`. */
import { Icon, Stepper } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function StepperStatesExample() {
  return (
    <div className={styles.column}>
      <Stepper.Root>
        <Stepper.Item status="completed">
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Оплата прошла</Stepper.Title>
            <Stepper.Description>12 400 ₽ списано с карты</Stepper.Description>
          </Stepper.Content>
        </Stepper.Item>
        <Stepper.Item status="danger">
          <Stepper.Indicator>
            <Icon name="status.danger" />
          </Stepper.Indicator>
          <Stepper.Content>
            <Stepper.Title>Ошибка доставки</Stepper.Title>
            <Stepper.Description>Проверьте адрес получателя</Stepper.Description>
          </Stepper.Content>
        </Stepper.Item>
        <Stepper.Item status="active">
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Подтверждение</Stepper.Title>
            <Stepper.Description>Ждём ответа склада</Stepper.Description>
          </Stepper.Content>
        </Stepper.Item>
        <Stepper.Item status="pending">
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Получение</Stepper.Title>
          </Stepper.Content>
        </Stepper.Item>
        <Stepper.Item status="pending" disabled>
          <Stepper.Indicator />
          <Stepper.Content>
            <Stepper.Title>Отзыв</Stepper.Title>
            <Stepper.Description>Откроется после получения</Stepper.Description>
          </Stepper.Content>
        </Stepper.Item>
      </Stepper.Root>
    </div>
  );
}
