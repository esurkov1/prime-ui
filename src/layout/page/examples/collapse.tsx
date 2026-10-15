/** An overview whose large title scrolls away under the top bar: the bar repeats it with its line of data and keeps the period and the page's buttons in reach — `collapse`. */
import { AppShell, Button, Card, Icon, Page, SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const WEEKS = [
  {
    id: "w41",
    title: "6–12 октября",
    text: "Выручка 1,2 млн ₽, 312 заказов, средний чек 3 850 ₽.",
  },
  { id: "w40", title: "29 сентября – 5 октября", text: "Выручка 1,1 млн ₽, 298 заказов." },
  { id: "w39", title: "22–28 сентября", text: "Выручка 0,9 млн ₽, 264 заказа." },
  { id: "w38", title: "15–21 сентября", text: "Выручка 1,0 млн ₽, 281 заказ." },
  { id: "w37", title: "8–14 сентября", text: "Выручка 0,8 млн ₽, 240 заказов." },
];

export default function PageCollapseExample() {
  const [period, setPeriod] = React.useState("week");

  return (
    <div className={`${styles.window} ${styles.tall}`}>
      <AppShell.Root fillViewport className={styles.shell}>
        <AppShell.Main>
          <Page.Root>
            <Page.TopBar collapse>
              <Page.Tools aria-label="Продажи">
                <SegmentedControl.Root value={period} onValueChange={setPeriod} aria-label="Период">
                  <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
                  <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
                </SegmentedControl.Root>
              </Page.Tools>
              <Page.Actions>
                <Button.Root variant="soft" tone="neutral">
                  <Button.Icon>
                    <Icon name="action.download" />
                  </Button.Icon>
                  Отчёт
                </Button.Root>
              </Page.Actions>
            </Page.TopBar>
            <Page.Header>
              <Page.Heading>
                <Page.Title>Продажи</Page.Title>
                <Page.Description>Интернет-магазин · на 14 октября, 9:40</Page.Description>
              </Page.Heading>
            </Page.Header>
            <Page.Body>
              {WEEKS.map((week) => (
                <Card.Root key={week.id} variant="panel">
                  <Card.Header>
                    <Card.Title as="h2">{week.title}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Typography variant="body-m" tone="secondary">
                      {week.text}
                    </Typography>
                  </Card.Body>
                </Card.Root>
              ))}
            </Page.Body>
          </Page.Root>
        </AppShell.Main>
      </AppShell.Root>
    </div>
  );
}
