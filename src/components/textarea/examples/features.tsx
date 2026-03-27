import { Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const OVERFLOW_DEMO =
  "This string is longer than the 30-character demo cap so the counter shows overflow.";

/** Default `autoResize`, turning it off, counter, overflow styling, and `maxLength` + counter. */
export default function TextareaFeaturesExample() {
  const maxLen = 120;
  const overflowMax = 30;
  const nativeLimit = 80;
  const [value, setValue] = React.useState("");
  const [overflowValue, setOverflowValue] = React.useState(OVERFLOW_DEMO);
  const [limited, setLimited] = React.useState("");

  return (
    <>
      <Textarea.Root
        size="m"
        placeholder="Multiple lines — height grows with content (autoResize default)"
      >
        <Textarea.Hint>Height follows content via wrapper `data-value`.</Textarea.Hint>
      </Textarea.Root>
      <div className={styles.blockSpacer}>
        <Textarea.Root size="m" autoResize={false} placeholder="Fixed height; native resize handle">
          <Textarea.Hint>autoResize=false</Textarea.Hint>
        </Textarea.Root>
      </div>
      <div className={styles.blockSpacer}>
        <Textarea.Root
          size="m"
          placeholder="Character counter in the field footer"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <Textarea.CharCounter current={value.length} max={maxLen} />
        </Textarea.Root>
      </div>
      <div className={styles.blockSpacer}>
        <Textarea.Root
          size="m"
          value={overflowValue}
          onChange={(e) => setOverflowValue(e.target.value)}
        >
          <Textarea.CharCounter current={overflowValue.length} max={overflowMax} />
          <Textarea.Hint>When current &gt; max, the counter gets data-overflow.</Textarea.Hint>
        </Textarea.Root>
      </div>
      <div className={styles.blockSpacer}>
        <Textarea.Root
          size="m"
          placeholder={`Up to ${nativeLimit} characters`}
          value={limited}
          maxLength={nativeLimit}
          onChange={(e) => setLimited(e.target.value)}
        >
          <Textarea.CharCounter current={limited.length} max={nativeLimit} />
          <Textarea.Hint>Native maxLength blocks extra input.</Textarea.Hint>
        </Textarea.Root>
      </div>
    </>
  );
}
