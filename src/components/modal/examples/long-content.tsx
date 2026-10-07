/** A long body scrolls on its own while the header and the footer stay in place — `Modal.Body`. */
import { Button, Modal, Typography } from "prime-ui-kit";

const TERMS = [
  "Исполнитель обрабатывает персональные данные только для оказания услуги.",
  "Данные не передаются третьим лицам без письменного согласия заказчика.",
  "Доступ к данным получают только сотрудники, которым он нужен для работы.",
  "Резервные копии хранятся в зашифрованном виде в дата-центрах на территории РФ.",
  "Заказчик может запросить выгрузку своих данных в течение 10 рабочих дней.",
  "По запросу заказчика данные удаляются в течение 30 дней после расторжения договора.",
  "О каждом инциденте безопасности исполнитель сообщает заказчику в течение 24 часов.",
  "Журналы доступа хранятся не меньше одного года и выдаются по запросу.",
  "Исполнитель ежегодно проходит внешний аудит защиты информации.",
  "Субподрядчики допускаются только с согласия заказчика и на тех же условиях.",
  "Изменения условий публикуются за 30 дней до вступления в силу.",
  "Споры решаются в арбитражном суде по месту нахождения исполнителя.",
];

export default function ModalLongContentExample() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Условия обработки данных
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content size="l">
        <Modal.Header>
          <Modal.Title>Условия обработки данных</Modal.Title>
          <Modal.Description>Редакция от 1 октября 2026 года</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          {TERMS.map((line) => (
            <Typography.Root key={line} variant="body-m" tone="secondary">
              {line}
            </Typography.Root>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button.Root variant="outline" tone="neutral">
              Не сейчас
            </Button.Root>
          </Modal.Close>
          <Modal.Close>
            <Button.Root>Принимаю</Button.Root>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
