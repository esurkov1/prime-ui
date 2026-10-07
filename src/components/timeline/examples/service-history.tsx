/** Service history: events and the intervals between them with `Timeline.Gap` (dashed segment, hollow dot, muted caption, `trailing`); `tone="warning"` flags a long interval, `Timeline.ValueMeta` adds a second value line. Use for maintenance and audit histories. */

import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TimelineServiceHistoryExample() {
  return (
    <Timeline.Root className={styles.feed}>
      <Timeline.Group label="История работ">
        <Timeline.Gap trailing="сейчас">Без обслуживания 26 дней · 300 км</Timeline.Gap>
        <Timeline.Item color="blue">
          <Timeline.Title>ТО: замена масла</Timeline.Title>
          <Timeline.Meta>
            <Timeline.MetaPrimary>10.09.26</Timeline.MetaPrimary> · 16 500 км
          </Timeline.Meta>
          <Timeline.Value>
            900 ฿<Timeline.ValueMeta>ТО</Timeline.ValueMeta>
          </Timeline.Value>
        </Timeline.Item>
        <Timeline.Gap>40 дней · 2 200 км без обслуживания</Timeline.Gap>
        <Timeline.Item color="blue">
          <Timeline.Title>ТО: масло + колодки</Timeline.Title>
          <Timeline.Meta>
            <Timeline.MetaPrimary>01.08.26</Timeline.MetaPrimary> · 14 300 км
          </Timeline.Meta>
          <Timeline.Value>
            1 500 ฿<Timeline.ValueMeta>ТО</Timeline.ValueMeta>
          </Timeline.Value>
        </Timeline.Item>
        <Timeline.Gap>55 дней · 2 200 км без обслуживания</Timeline.Gap>
        <Timeline.Item color="red">
          <Timeline.Title>Ремонт: замена ремня</Timeline.Title>
          <Timeline.Meta>
            <Timeline.MetaPrimary>07.06.26</Timeline.MetaPrimary> · 12 100 км
          </Timeline.Meta>
          <Timeline.Value>
            2 800 ฿<Timeline.ValueMeta>Ремонт</Timeline.ValueMeta>
          </Timeline.Value>
        </Timeline.Item>
        <Timeline.Gap tone="warning">100 дней · 4 400 км без обслуживания</Timeline.Gap>
        <Timeline.Item color="blue">
          <Timeline.Title>Резина зад + работа</Timeline.Title>
          <Timeline.Meta>
            <Timeline.MetaPrimary>27.02.26</Timeline.MetaPrimary> · 7 700 км
          </Timeline.Meta>
          <Timeline.Value>
            1 516 ฿<Timeline.ValueMeta>ТО</Timeline.ValueMeta>
          </Timeline.Value>
        </Timeline.Item>
      </Timeline.Group>
    </Timeline.Root>
  );
}
