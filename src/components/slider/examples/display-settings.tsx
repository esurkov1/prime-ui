/** A display settings card with formatted sliders where an «auto brightness» switch disables the brightness slider. Use it for settings panels with dependent controls. */
import { Card, Slider, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SliderDisplaySettingsExample() {
  const [auto, setAuto] = React.useState(false);

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Экран и звук</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <div className={styles.settings}>
          <Switch.Root checked={auto} onCheckedChange={setAuto}>
            <Switch.Label>Автояркость</Switch.Label>
            <Switch.Hint>Подстраивается под освещение.</Switch.Hint>
          </Switch.Root>
          <Slider.Root
            label="Яркость"
            defaultValue={70}
            disabled={auto}
            showValue
            formatValue={(v) => `${v}%`}
          />
          <Slider.Root
            label="Размер текста"
            min={12}
            max={24}
            defaultValue={16}
            showValue
            formatValue={(v) => `${v} px`}
          />
          <Slider.Root label="Громкость уведомлений" defaultValue={40} showValue />
        </div>
      </Card.Body>
    </Card.Root>
  );
}
