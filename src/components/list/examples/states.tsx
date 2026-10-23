/** The open record, a regular row and an unavailable one, whose title, description and mark all fade — `current`, `disabled`. */
import { Icon, List, Typography } from "prime-ui-kit";

const ROWS = [
  { state: "current", number: "#1207", title: "Возврат оплаты", note: "Открыта сейчас" },
  { state: "default", number: "#1206", title: "Смена тарифа", note: "Ждёт ответа клиента" },
  { state: "disabled", number: "#1198", title: "Доступ к API", note: "В архиве, недоступна" },
] as const;

export default function ListStatesExample() {
  return (
    <div>
      <div>
        {ROWS.map((row) => (
          <div key={row.state}>
            <List.Root aria-label={`Заявка ${row.number}`}>
              <List.Item
                current={row.state === "current"}
                disabled={row.state === "disabled"}
                onClick={() => {}}
              >
                <List.ItemIcon>
                  <Icon name="object.receipt" />
                </List.ItemIcon>
                <List.ItemText number={row.number}>{row.title}</List.ItemText>
                <List.ItemDescription>{row.note}</List.ItemDescription>
              </List.Item>
            </List.Root>
            <Typography as="span" variant="caption" tone="muted">
              {row.state}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
