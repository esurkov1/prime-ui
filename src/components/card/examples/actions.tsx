/** Tasks of a rental with their assignee: the picker leads the line under the title, the actions stand at the end of the header — one secondary action as a labelled button beside the primary, or several gathered in one menu with the destructive one last — `Card.Actions`, `Card.Description`, `Badge.Avatar`, `action.more`. */
import { Avatar, Badge, Button, Card, Dropdown, Icon, type PaletteColor } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Member = { id: string; name: string; initials: string; color: PaletteColor };

const TEAM: Member[] = [
  { id: "surkov", name: "Евгений Сурков", initials: "ЕС", color: "teal" },
  { id: "kotova", name: "Анна Котова", initials: "АК", color: "purple" },
  { id: "sokolov", name: "Илья Соколов", initials: "ИС", color: "green" },
];

const RETURN = { due: "Вернуть 10 дек · через 50 дн.", issued: "выдан 21 окт, 15:43" };

const DELIVERY = { due: "Доставить 24 окт · завтра", place: "Банг Тао, вилла 12" };

const memberOf = (id: string) => TEAM.find((item) => item.id === id) ?? TEAM[0];

export default function CardActionsExample() {
  const [returnOwner, setReturnOwner] = React.useState("surkov");
  const [deliveryOwner, setDeliveryOwner] = React.useState("kotova");
  const returnMember = memberOf(returnOwner);
  const deliveryMember = memberOf(deliveryOwner);

  return (
    <div className={styles.panel}>
      <div className={styles.stack}>
        <Card.Root>
          <Card.Header>
            <Card.Title>{RETURN.due}</Card.Title>
            <Card.Description>
              <Dropdown.Root>
                <Dropdown.Trigger>
                  <Badge.Root aria-label={`Ответственный: ${returnMember.name}`}>
                    <Badge.Avatar>
                      <Avatar.Root color={returnMember.color}>
                        <Avatar.Fallback>{returnMember.initials}</Avatar.Fallback>
                      </Avatar.Root>
                    </Badge.Avatar>
                    {returnMember.name}
                  </Badge.Root>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  {TEAM.map((item) => (
                    <Dropdown.Item
                      key={item.id}
                      selected={item.id === returnOwner}
                      onSelect={() => setReturnOwner(item.id)}
                    >
                      <Avatar.Root color={item.color}>
                        <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                      </Avatar.Root>
                      {item.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown.Root>
              {RETURN.issued}
            </Card.Description>
            <Card.Actions>
              <Button.Root variant="soft" tone="neutral">
                <Button.Icon>
                  <Icon name="action.close" />
                </Button.Icon>
                Отменить
              </Button.Root>
              <Button.Root>
                <Button.Icon>
                  <Icon name="action.check" />
                </Button.Icon>
                Принять возврат
              </Button.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>{DELIVERY.due}</Card.Title>
            <Card.Description>
              <Dropdown.Root>
                <Dropdown.Trigger>
                  <Badge.Root aria-label={`Ответственный: ${deliveryMember.name}`}>
                    <Badge.Avatar>
                      <Avatar.Root color={deliveryMember.color}>
                        <Avatar.Fallback>{deliveryMember.initials}</Avatar.Fallback>
                      </Avatar.Root>
                    </Badge.Avatar>
                    {deliveryMember.name}
                  </Badge.Root>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  {TEAM.map((item) => (
                    <Dropdown.Item
                      key={item.id}
                      selected={item.id === deliveryOwner}
                      onSelect={() => setDeliveryOwner(item.id)}
                    >
                      <Avatar.Root color={item.color}>
                        <Avatar.Fallback>{item.initials}</Avatar.Fallback>
                      </Avatar.Root>
                      {item.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown.Root>
              {DELIVERY.place}
            </Card.Description>
            <Card.Actions>
              <Button.Root>
                <Button.Icon>
                  <Icon name="action.check" />
                </Button.Icon>
                Доставлен
              </Button.Root>
              <Dropdown.Root>
                <Dropdown.Trigger>
                  <Button.Root variant="soft" tone="neutral" aria-label="Ещё действия">
                    <Button.Icon>
                      <Icon name="action.more" />
                    </Button.Icon>
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content align="end">
                  <Dropdown.Item>
                    <Dropdown.ItemIcon>
                      <Icon name="field.calendar" />
                    </Dropdown.ItemIcon>
                    Перенести
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Dropdown.ItemIcon>
                      <Icon name="action.edit" />
                    </Dropdown.ItemIcon>
                    Изменить адрес
                  </Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Item tone="danger">
                    <Dropdown.ItemIcon>
                      <Icon name="action.close" />
                    </Dropdown.ItemIcon>
                    Отменить доставку
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            </Card.Actions>
          </Card.Header>
        </Card.Root>
      </div>
    </div>
  );
}
