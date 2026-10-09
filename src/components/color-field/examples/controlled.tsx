/** The parent owns the color: the hint names it and a button resets it to the brand default — `value`, `onValueChange`. */
import { Button } from "prime-ui-kit";
import { ColorField } from "prime-ui-kit/color-picker";
import * as React from "react";

import styles from "./examples.module.css";

const BRAND_DEFAULT = "#5B5BD6";

export default function ColorFieldControlledExample() {
  const [accent, setAccent] = React.useState(BRAND_DEFAULT);

  return (
    <>
      <ColorField
        label="Акцентный цвет"
        hint={`Сейчас: ${accent}`}
        value={accent}
        onValueChange={setAccent}
      />
      <div className={styles.actions}>
        <Button.Root
          variant="soft"
          tone="neutral"
          disabled={accent === BRAND_DEFAULT}
          onClick={() => setAccent(BRAND_DEFAULT)}
        >
          Цвет бренда по умолчанию
        </Button.Root>
      </div>
    </>
  );
}
