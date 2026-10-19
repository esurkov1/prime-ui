/** A hint that holds a link and a person card open on hover and keyboard focus, and Tab moves into them — `openOn`. */
import { Avatar, Button, LinkButton, Popover, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PopoverHoverCardExample() {
  return (
    <>
      <Typography variant="body-m" tone="secondary">
        Условия оплаты:{" "}
        <Popover.Root openOn="hover">
          <Popover.Trigger>
            <LinkButton asChild inline>
              <button type="button">предоплата 30%</button>
            </LinkButton>
          </Popover.Trigger>
          <Popover.Content size="s" side="top">
            <Popover.Description>
              Депозит списывается при бронировании, остаток — за сутки до поездки.
            </Popover.Description>
            <LinkButton href="#deposits">Подробнее о депозитах</LinkButton>
          </Popover.Content>
        </Popover.Root>
      </Typography>
      <Typography variant="body-m" tone="secondary">
        Заказ № 1048 оформил{" "}
        <Popover.Root openOn="hover">
          <Popover.Trigger>
            <LinkButton href="#team/anna-belova" inline>
              Анна Белова
            </LinkButton>
          </Popover.Trigger>
          <Popover.Content>
            <div className={styles.person}>
              <Avatar.Root color="blue" aria-hidden="true">
                <Avatar.Fallback>АБ</Avatar.Fallback>
              </Avatar.Root>
              <Popover.Header>
                <Popover.Title>Анна Белова</Popover.Title>
                <Popover.Description>Менеджер по работе с клиентами</Popover.Description>
              </Popover.Header>
            </div>
            <Popover.Actions>
              <Button.Root asChild variant="soft" tone="neutral">
                <a href="#team/anna-belova">Открыть профиль</a>
              </Button.Root>
            </Popover.Actions>
          </Popover.Content>
        </Popover.Root>
      </Typography>
    </>
  );
}
