/** Controlled `value` + `onValueChange` with the text length passed to `Textarea.Counter`. Use it for length-limited text such as reviews. */
import { Textarea } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const MAX = 280;

export default function TextareaControlledExample() {
  const [text, setText] = React.useState("Курьер приехал раньше срока, всё целое.");

  return (
    <div className={styles.column}>
      <Textarea.Root
        label="Отзыв о доставке"
        value={text}
        onValueChange={setText}
        maxLength={MAX}
        placeholder="Что понравилось, что нет"
        hint="Отзыв появится после модерации."
        counter={<Textarea.Counter current={text.length} max={MAX} />}
      />
    </div>
  );
}
