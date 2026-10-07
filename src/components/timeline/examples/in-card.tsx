/** A feed inside `Card.Body` (the card owns the padding) with two groups and dot hues via `color`. Use for activity widgets on dashboards. */

import { Card, Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TimelineInCardExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Body>
        <Timeline.Root>
          <Timeline.Group label="Сегодня">
            <Timeline.Item color="green">
              <Timeline.Title>Оплата получена · Иван К.</Timeline.Title>
              <Timeline.Meta>
                <Timeline.MetaPrimary>07.10.26</Timeline.MetaPrimary> · 2 ч. назад
              </Timeline.Meta>
              <Timeline.Value>+6 300 ฿</Timeline.Value>
            </Timeline.Item>
            <Timeline.Item color="orange" active>
              <Timeline.Title>Штраф за парковку</Timeline.Title>
              <Timeline.Meta>
                <Timeline.MetaPrimary>07.10.26</Timeline.MetaPrimary> · 5 ч. назад
              </Timeline.Meta>
              <Timeline.Value>−1 000 ฿</Timeline.Value>
            </Timeline.Item>
          </Timeline.Group>
          <Timeline.Group label="Ранее">
            <Timeline.Item>
              <Timeline.Title>Аренда закончилась · Сергей М.</Timeline.Title>
              <Timeline.Meta>
                <Timeline.MetaPrimary>04.09.26</Timeline.MetaPrimary> · 32 д. назад
              </Timeline.Meta>
              <Timeline.Value>+13 500 ฿</Timeline.Value>
            </Timeline.Item>
            <Timeline.Item color="purple">
              <Timeline.Title>Мойка и химчистка салона</Timeline.Title>
              <Timeline.Meta>
                <Timeline.MetaPrimary>01.09.26</Timeline.MetaPrimary> · 36 д. назад
              </Timeline.Meta>
              <Timeline.Value>−450 ฿</Timeline.Value>
            </Timeline.Item>
          </Timeline.Group>
        </Timeline.Root>
      </Card.Body>
    </Card.Root>
  );
}
