/** The deposits of a rental in one card: a row per deposit with its state badge and amount over one line of detail, the step's action and an edit button at the end, and a return with a hold folding open under its row — `Card.List`, `Card.ListItem`, `Card.ListItemContent`. */
import { Badge, Button, Card, Dropdown, Icon, Input, Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Deposit = {
  id: string;
  state: "held" | "returned" | "pending";
  amount: string;
  detail: string;
};

const DEPOSITS: Deposit[] = [
  { id: "cash", state: "held", amount: "300 $", detail: "Наличные, новые · принят 8 окт" },
  {
    id: "baht",
    state: "returned",
    amount: "вернули 4 500 ฿ из 5 000 ฿",
    detail: "Наличные · возвращён 20 окт · удержали 500 ฿ за царапину",
  },
  { id: "usdt", state: "held", amount: "100 USDT", detail: "Крипта, TRC-20 · принят 8 окт" },
  { id: "rub", state: "pending", amount: "2 000 ₽", detail: "Договорились · перевод" },
];

const STATE = {
  held: { label: "У нас", color: "green" },
  returned: { label: "Возвращён", color: "gray" },
  pending: { label: "Не взят", color: "gray" },
} as const;

export default function CardRecordRowsExample() {
  const [holdId, setHoldId] = React.useState<string | null>(null);

  return (
    <div className={styles.panel}>
      <Card.Root variant="list">
        <Card.List>
          {DEPOSITS.map((deposit) => (
            <Card.ListItem key={deposit.id}>
              <Card.Title>
                <Badge.Root color={STATE[deposit.state].color}>
                  {STATE[deposit.state].label}
                </Badge.Root>
                {deposit.amount}
              </Card.Title>
              <Card.Description>{deposit.detail}</Card.Description>
              {deposit.state === "held" ? (
                <Dropdown.Root>
                  <Dropdown.Trigger>
                    <Button.Root variant="soft" tone="neutral">
                      Вернуть
                      <Button.Icon>
                        <Icon name="nav.chevronDown" />
                      </Button.Icon>
                    </Button.Root>
                  </Dropdown.Trigger>
                  <Dropdown.Content align="end">
                    <Dropdown.Item>
                      Полностью
                      <Dropdown.ItemDescription>{`вернуть ${deposit.amount}`}</Dropdown.ItemDescription>
                    </Dropdown.Item>
                    <Dropdown.Item onSelect={() => setHoldId(deposit.id)}>
                      С удержанием
                      <Dropdown.ItemDescription>часть оставить себе</Dropdown.ItemDescription>
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown.Root>
              ) : null}
              {deposit.state === "pending" ? (
                <Button.Root variant="soft" tone="neutral">
                  Принять
                </Button.Root>
              ) : null}
              <Button.Root variant="soft" tone="neutral" aria-label="Изменить депозит">
                <Button.Icon>
                  <Icon name="action.edit" />
                </Button.Icon>
              </Button.Root>
              <Card.ListItemContent open={holdId === deposit.id}>
                <Input.Root label="Вернуть клиенту">
                  <Input.Wrapper>
                    <Input.Field inputMode="decimal" defaultValue="250" />
                  </Input.Wrapper>
                </Input.Root>
                <Textarea.Root label="Причина удержания" rows={2} />
                <Card.Footer>
                  <Button.Root variant="soft" tone="neutral" onClick={() => setHoldId(null)}>
                    Отмена
                  </Button.Root>
                  <Button.Root onClick={() => setHoldId(null)}>Вернуть 250 $</Button.Root>
                </Card.Footer>
              </Card.ListItemContent>
            </Card.ListItem>
          ))}
        </Card.List>
      </Card.Root>
    </div>
  );
}
