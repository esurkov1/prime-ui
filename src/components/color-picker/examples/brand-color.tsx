/** A controlled brand color in a settings card: hex field, popover panel and brand swatches edit one Color, with preview and reset outside the picker. Use it for theme or brand settings. */
import { Button, Card, ColorPicker, Popover, parseColor, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const BRAND = ["#5b5bd6", "#0090ff", "#12a594", "#f76b15", "#e5484d"];

export default function ColorPickerBrandColorExample() {
  const [color, setColor] = React.useState(() => parseColor("#5b5bd6"));

  return (
    <Card.Root variant="panel" className={styles.card}>
      <Card.SectionHeader>
        <Card.SectionTitle>Оформление витрины</Card.SectionTitle>
      </Card.SectionHeader>
      <Card.Body>
        <ColorPicker.Root value={color} onValueChange={setColor}>
          <div className={styles.fieldRow}>
            <ColorPicker.HexInput label="Акцентный цвет" />
            <Popover.Root>
              <Popover.Trigger>
                <Button.Root
                  variant="soft"
                  tone="neutral"
                  aria-label="Открыть палитру"
                  className={styles.swatchTrigger}
                >
                  <Button.Icon>
                    <ColorPicker.TriggerSwatch className={styles.swatchFill} />
                  </Button.Icon>
                </Button.Root>
              </Popover.Trigger>
              <Popover.Content align="end">
                <ColorPicker.Panel className={styles.panel}>
                  <ColorPicker.FormatSelect />
                  <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                    <ColorPicker.AreaThumb />
                  </ColorPicker.Area>
                  <ColorPicker.Slider channel="hue" colorSpace="hsl">
                    <ColorPicker.SliderTrack>
                      <ColorPicker.Thumb />
                    </ColorPicker.SliderTrack>
                  </ColorPicker.Slider>
                  <ColorPicker.ChannelStrip />
                </ColorPicker.Panel>
              </Popover.Content>
            </Popover.Root>
          </div>
          <ColorPicker.SwatchPicker aria-label="Цвета бренда">
            {BRAND.map((c) => (
              <ColorPicker.SwatchPickerItem key={c} color={c}>
                <ColorPicker.Swatch />
              </ColorPicker.SwatchPickerItem>
            ))}
          </ColorPicker.SwatchPicker>
        </ColorPicker.Root>
        <div className={styles.preview}>
          <span className={styles.previewChip} style={{ background: color.toString("css") }} />
          <Typography.Root as="p" variant="body-s" tone="secondary">
            Кнопки и ссылки витрины: <code>{color.toString("hex")}</code>
          </Typography.Root>
        </div>
      </Card.Body>
      <Card.Actions>
        <Button.Root variant="ghost" tone="neutral" onClick={() => setColor(parseColor("#5b5bd6"))}>
          Сбросить
        </Button.Root>
        <Button.Root>Сохранить</Button.Root>
      </Card.Actions>
    </Card.Root>
  );
}
