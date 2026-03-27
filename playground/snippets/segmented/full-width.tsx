import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import styles from "./full-width.module.css";

export default function SegmentedFullWidthSnippet() {
  return (
    <div className={styles.shelf}>
      <SegmentedControl.Root defaultValue="day" className={styles.fill}>
        <SegmentedControl.Item value="day">День</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
      </SegmentedControl.Root>
    </div>
  );
}
