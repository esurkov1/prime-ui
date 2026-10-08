/** Theme settings: the color goes with the form, a too light color shakes in an error on save that leaves once the color changes — `value`, `error`. */
import { Button, Input, Typography } from "prime-ui-kit";
import { ColorPicker, parseColor } from "prime-ui-kit/color-picker";
import * as React from "react";

import styles from "./examples.module.css";

const MAX_LIGHTNESS = 80;

export default function ColorPickerInFormExample() {
  const [color, setColor] = React.useState(() => parseColor("#f2f2f2"));
  const [error, setError] = React.useState<string>();
  const [saved, setSaved] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lightness = color.toFormat("hsl").getChannelValue("lightness");
    const next =
      lightness > MAX_LIGHTNESS ? "Слишком светлый: белый текст на нём не читается" : undefined;
    setError(next);
    setSaved(next === undefined);
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Input.Root label="Название темы" required>
        <Input.Wrapper>
          <Input.Field name="theme" defaultValue="Осенняя распродажа" />
        </Input.Wrapper>
      </Input.Root>
      <ColorPicker.Root
        value={color}
        onValueChange={(next) => {
          setColor(next);
          setError(undefined);
          setSaved(false);
        }}
      >
        <ColorPicker.HexInput label="Цвет кнопок" error={error} />
      </ColorPicker.Root>
      <input type="hidden" name="buttonColor" value={color.toString("hex")} />
      {saved ? (
        <Typography as="p" variant="body-s" tone="secondary" role="status">
          Тема сохранена.
        </Typography>
      ) : null}
      <div className={styles.actions}>
        <Button.Root type="submit">Сохранить тему</Button.Root>
      </div>
    </form>
  );
}
