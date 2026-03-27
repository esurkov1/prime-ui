import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";

import styles from "./snippets.module.css";

/** Связь текста подсказки с полем через `id` на `Hint.Root` и `aria-describedby` на вводе. */
export default function HintA11yDescribedbySnippet() {
  return (
    <div className={`${styles.fieldRow} ${styles.maxW22}`}>
      <Label.Root htmlFor="hint-a11y-volume">Громкость уведомлений</Label.Root>
      <input
        id="hint-a11y-volume"
        type="range"
        min={0}
        max={100}
        defaultValue={40}
        aria-describedby="hint-a11y-volume-help"
      />
      <Hint.Root id="hint-a11y-volume-help" variant="default">
        Не влияет на звонки и будильник в мобильном приложении.
      </Hint.Root>
    </div>
  );
}
