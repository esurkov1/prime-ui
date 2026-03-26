import { Radio } from "@/components/radio/Radio";

import styles from "./radio-snippets.module.css";

export default function RadioFullWidthSnippet() {
  return (
    <div className="previewBannerNarrowColumn">
      <p className={styles.blockTitle}>Способ связи</p>
      <div className="stack">
        <Radio.Root name="radio-fw-contact" value="phone" defaultChecked size="m">
          <Radio.Label>Звонок в рабочее время</Radio.Label>
        </Radio.Root>
        <Radio.Root name="radio-fw-contact" value="chat" size="m">
          <Radio.Label>Чат в приложении</Radio.Label>
        </Radio.Root>
      </div>
    </div>
  );
}
