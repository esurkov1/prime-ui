/** A glass capsule over the page: the client list scrolls under its blur, with labels or icons alone — `floating`, `iconOnly`. */
import {
  AppHeader,
  AppShell,
  Avatar,
  BottomNav,
  Icon,
  PageContent,
  Switch,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SECTIONS = [
  { id: "home", label: "Главная", icon: "nav.home" },
  { id: "clients", label: "Клиенты", icon: "object.users" },
  { id: "inbox", label: "Входящие", icon: "object.inbox" },
  { id: "settings", label: "Настройки", icon: "action.settings" },
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

export default function BottomNavFloatingExample() {
  const [section, setSection] = React.useState<string>("clients");
  const [iconOnly, setIconOnly] = React.useState(false);

  return (
    <div className={styles.phone}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.Title>Клиенты</AppHeader.Title>
          </AppHeader.Start>
          <AppHeader.Actions>
            <Switch.Root checked={iconOnly} onCheckedChange={setIconOnly}>
              <Switch.Label>Только иконки</Switch.Label>
            </Switch.Root>
          </AppHeader.Actions>
        </AppHeader.Root>
        <AppShell.Main>
          <PageContent.Section>
            <PageContent.Body>
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
            </PageContent.Body>
          </PageContent.Section>
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
          </BottomNav.Root>
        </AppShell.Footer>
      </AppShell.Root>
    </div>
  );
}
