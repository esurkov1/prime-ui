/** A settings form in a card: required, hint and optional on Root, grouped options, a trigger icon and an option label that differs from its row text. Use it for selects inside forms. */
import { Button, Card, Icon, Select } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SelectInFormExample() {
  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Региональные настройки</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <Select.Root label="Страна" required defaultValue="ru" placeholder="Выберите страну">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content searchable>
              <Select.Item value="ru">Россия</Select.Item>
              <Select.Item value="kz">Казахстан</Select.Item>
              <Select.Item value="by">Беларусь</Select.Item>
              <Select.Item value="am">Армения</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root
            label="Часовой пояс"
            hint="Время в отчётах и уведомлениях"
            defaultValue="msk"
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.GroupLabel>Европа</Select.GroupLabel>
                <Select.Item value="kal">Калининград, UTC+2</Select.Item>
                <Select.Item value="msk">Москва, UTC+3</Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.GroupLabel>Азия</Select.GroupLabel>
                <Select.Item value="ekb">Екатеринбург, UTC+5</Select.Item>
                <Select.Item value="nsk">Новосибирск, UTC+7</Select.Item>
                <Select.Item value="vvo">Владивосток, UTC+10</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <Select.Root label="Валюта отчётов" optional defaultValue="rub">
            <Select.Trigger>
              <Select.TriggerIcon>
                <Icon name="nav.layoutGrid" tone="secondary" />
              </Select.TriggerIcon>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="rub" label="Российский рубль, ₽">
                ₽ RUB
              </Select.Item>
              <Select.Item value="kzt" label="Казахстанский тенге, ₸">
                ₸ KZT
              </Select.Item>
              <Select.Item value="usd" label="Доллар США, $">
                $ USD
              </Select.Item>
            </Select.Content>
          </Select.Root>
          <div className={styles.actions}>
            <Button.Root variant="ghost" tone="neutral">
              Отмена
            </Button.Root>
            <Button.Root type="submit">Сохранить</Button.Root>
          </div>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
