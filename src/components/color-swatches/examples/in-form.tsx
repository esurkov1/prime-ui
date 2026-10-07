/** A settings form with a name field and an inline color choice labelled like any other field. Use it in dialogs and forms instead of a palette popover. */
import { ColorSwatches, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ColorSwatchesInFormExample() {
  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <Input.Root label="Название" required>
        <Input.Wrapper>
          <Input.Field name="title" defaultValue="Визит" />
        </Input.Wrapper>
      </Input.Root>
      <ColorSwatches.Root label="Цвет" name="color" defaultValue="#ef4444" />
    </form>
  );
}
