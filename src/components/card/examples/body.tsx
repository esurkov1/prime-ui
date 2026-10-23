/** What the body holds: label — value rows, a list of records that open, a form on kit fields and an empty state — `DescriptionList`, `List`, `Input.Root`, `EmptyPage`. */
import {
  Button,
  Card,
  DescriptionList,
  EmptyPage,
  Icon,
  Input,
  List,
  Textarea,
} from "prime-ui-kit";

import styles from "./examples.module.css";

const INVOICES = [
  { id: "2026-0418", client: "ООО «Гранит»", sum: "256 000 ₽" },
  { id: "2026-0417", client: "ООО «Лето»", sum: "84 500 ₽" },
  { id: "2026-0416", client: "ИП Козлов", sum: "12 000 ₽" },
];

export default function CardBodyExample() {
  return (
    <div className={styles.grid}>
      <Card.Root>
        <Card.Header>
          <Card.Title>Реквизиты</Card.Title>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Компания">ООО «Северный ветер»</DescriptionList.Item>
            <DescriptionList.Item label="ИНН">7704512398</DescriptionList.Item>
            <DescriptionList.Item label="Телефон">+7 495 120-44-18</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Последние счета</Card.Title>
        </Card.Header>
        <Card.Body>
          <List.Root aria-label="Последние счета">
            {INVOICES.map((invoice) => (
              <List.Item key={invoice.id}>
                <List.ItemText>Счёт № {invoice.id}</List.ItemText>
                <List.ItemDescription>{invoice.client}</List.ItemDescription>
                <List.ItemMeta>{invoice.sum}</List.ItemMeta>
              </List.Item>
            ))}
          </List.Root>
        </Card.Body>
      </Card.Root>
      <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
        <Card.Root>
          <Card.Header>
            <Card.Title>Новая заметка</Card.Title>
          </Card.Header>
          <Card.Body>
            <Input.Root label="Тема">
              <Input.Wrapper>
                <Input.Field name="subject" placeholder="О чём заметка" />
              </Input.Wrapper>
            </Input.Root>
            <Textarea.Root name="text" label="Текст" rows={3} />
          </Card.Body>
          <Card.Footer>
            <Card.Actions>
              <Button.Root type="submit">Сохранить</Button.Root>
            </Card.Actions>
          </Card.Footer>
        </Card.Root>
      </form>
      <Card.Root>
        <Card.Header>
          <Card.Title>Документы</Card.Title>
        </Card.Header>
        <Card.Body>
          <EmptyPage.Root layout="compact">
            <EmptyPage.Icon>
              <Icon name="object.document" />
            </EmptyPage.Icon>
            <EmptyPage.Title as="p">Документов нет</EmptyPage.Title>
            <EmptyPage.Description>Загрузите договор или акт</EmptyPage.Description>
            <EmptyPage.Actions>
              <Button.Root variant="soft" tone="neutral">
                Загрузить
              </Button.Root>
            </EmptyPage.Actions>
          </EmptyPage.Root>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
