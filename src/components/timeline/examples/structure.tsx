/** A service history with intervals between events, a caption on the right of a gap, two meta lines under a repair and a second value line — `Timeline.Gap`, `Timeline.Description`, `Timeline.ItemMeta`. */
import { Timeline } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TimelineStructureExample() {
  return (
    <Timeline.Root className={styles.feed}>
      <Timeline.Group label="История работ">
        <Timeline.Gap>
          Без обслуживания 26 дней · 300 км
          <Timeline.Description>сейчас</Timeline.Description>
        </Timeline.Gap>
        <Timeline.Item color="blue">
          <Timeline.ItemTitle>ТО: замена масла</Timeline.ItemTitle>
          <Timeline.ItemMeta>
            <strong>10.09.26</strong> · 16 500 км
          </Timeline.ItemMeta>
          <Timeline.ItemValue>
            900 ₽<Timeline.ItemMeta>ТО</Timeline.ItemMeta>
          </Timeline.ItemValue>
        </Timeline.Item>
        <Timeline.Gap>40 дней · 2 200 км без обслуживания</Timeline.Gap>
        <Timeline.Item color="blue">
          <Timeline.ItemTitle>ТО: масло + колодки</Timeline.ItemTitle>
          <Timeline.ItemMeta>
            <strong>01.08.26</strong> · 14 300 км
          </Timeline.ItemMeta>
          <Timeline.ItemValue>
            1 500 ₽<Timeline.ItemMeta>ТО</Timeline.ItemMeta>
          </Timeline.ItemValue>
        </Timeline.Item>
        <Timeline.Gap>55 дней · 2 200 км без обслуживания</Timeline.Gap>
        <Timeline.Item color="red">
          <Timeline.ItemTitle>Ремонт: замена ремня</Timeline.ItemTitle>
          <Timeline.ItemMeta>
            <strong>07.06.26</strong> · 12 100 км
          </Timeline.ItemMeta>
          <Timeline.ItemMeta>Мастер Олег Смирнов · гарантия 6 месяцев</Timeline.ItemMeta>
          <Timeline.ItemValue>
            2 800 ₽<Timeline.ItemMeta>Ремонт</Timeline.ItemMeta>
          </Timeline.ItemValue>
        </Timeline.Item>
        <Timeline.Gap tone="warning">100 дней · 4 400 км без обслуживания</Timeline.Gap>
        <Timeline.Item color="blue">
          <Timeline.ItemTitle>Резина зад + работа</Timeline.ItemTitle>
          <Timeline.ItemMeta>
            <strong>27.02.26</strong> · 7 700 км
          </Timeline.ItemMeta>
          <Timeline.ItemValue>
            1 516 ₽<Timeline.ItemMeta>ТО</Timeline.ItemMeta>
          </Timeline.ItemValue>
        </Timeline.Item>
      </Timeline.Group>
    </Timeline.Root>
  );
}
