/** The open record, a regular row and an unavailable one — `current`, `disabled`. */
import { List, Typography } from "prime-ui-kit";

export default function ListStatesExample() {
  return (
    <div>
      <div>
        <div>
          <List.Root aria-label="Открытая заявка">
            <List.Item current>
              <List.ItemText>Заявка № 1207 · Возврат оплаты</List.ItemText>
              <List.ItemDescription>Открыта сейчас</List.ItemDescription>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            current
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Заявка в работе">
            <List.Item>
              <List.ItemText>Заявка № 1206 · Смена тарифа</List.ItemText>
              <List.ItemDescription>Ждёт ответа клиента</List.ItemDescription>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            default
          </Typography>
        </div>
        <div>
          <List.Root aria-label="Заявка в архиве">
            <List.Item disabled>
              <List.ItemText>Заявка № 1198 · Доступ к API</List.ItemText>
              <List.ItemDescription>В архиве, недоступна</List.ItemDescription>
            </List.Item>
          </List.Root>
          <Typography as="span" variant="caption" tone="muted">
            disabled
          </Typography>
        </div>
      </div>
    </div>
  );
}
