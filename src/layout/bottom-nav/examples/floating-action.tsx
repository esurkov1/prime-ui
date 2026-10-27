/** A round action beside the glass capsule for the screen's main action, with labels or icons alone — `BottomNav.Action`, `floating`. */
import { AppShell, Avatar, BottomNav, Icon, Page, Switch, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SECTIONS = [
  { id: "home", label: "Главная", icon: "nav.home" },
  { id: "clients", label: "Клиенты", icon: "object.users" },
  { id: "inbox", label: "Входящие", icon: "object.inbox" },
] as const;

const CLIENTS = [
  { name: "ООО «Север»", initials: "СЕ", color: "blue", deals: "4 сделки" },
  { name: "ИП Котов", initials: "КО", color: "green", deals: "1 сделка" },
  { name: "ООО «Вектор»", initials: "ВЕ", color: "orange", deals: "7 сделок" },
  { name: "АО «Меридиан»", initials: "МЕ", color: "purple", deals: "2 сделки" },
  { name: "ООО «Полюс»", initials: "ПО", color: "red", deals: "5 сделок" },
  { name: "ИП Белова", initials: "БЕ", color: "teal", deals: "3 сделки" },
  { name: "ООО «Гранит»", initials: "ГР", color: "yellow", deals: "6 сделок" },
  { name: "АО «Ладога»", initials: "ЛА", color: "sky", deals: "2 сделки" },
] as const;

export default function BottomNavFloatingActionExample() {
  const [section, setSection] = React.useState<string>("clients");
  const [iconOnly, setIconOnly] = React.useState(false);

  return (
    <div className={styles.phone}>
      <AppShell.Root className={styles.shell}>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar>
              <Page.Heading>
                <Page.Title>Клиенты</Page.Title>
              </Page.Heading>
            </Page.TopBar>
            <Page.Body>
              <div className={styles.options}>
                <Switch.Root checked={iconOnly} onCheckedChange={setIconOnly}>
                  <Switch.Label>Только иконки</Switch.Label>
                </Switch.Root>
              </div>
              {CLIENTS.map((client) => (
                <div key={client.name} className={styles.client}>
                  <Avatar.Root color={client.color} aria-hidden="true">
                    <Avatar.Fallback>{client.initials}</Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <Typography variant="body-m">{client.name}</Typography>
                    <Typography variant="body-s" tone="muted">
                      {client.deals}
                    </Typography>
                  </div>
                </div>
              ))}
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
        <AppShell.Footer>
          <BottomNav.Root floating iconOnly={iconOnly}>
            {SECTIONS.map((item) => (
              <BottomNav.Item
                key={item.id}
                current={item.id === section}
                onClick={() => setSection(item.id)}
              >
                <BottomNav.ItemIcon>
                  <Icon name={item.icon} />
                </BottomNav.ItemIcon>
                {item.label}
              </BottomNav.Item>
            ))}
            <BottomNav.Action aria-label="Новый клиент">
              <Icon name="action.add" />
            </BottomNav.Action>
          </BottomNav.Root>
        </AppShell.Footer>
      </AppShell.Root>
    </div>
  );
}
