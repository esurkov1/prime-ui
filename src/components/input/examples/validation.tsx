/** Required and optional markers, a hint, an error and a support row that does not shift — `required`, `optional`, `hint`, `error`, `reserveSupportRow`. */
import { Button, Input } from "prime-ui-kit";
import * as React from "react";

export default function InputValidationExample() {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <Input.Root label="Название организации" required hint="Как в учредительных документах">
        <Input.Wrapper>
          <Input.Field defaultValue="ООО «Северный ветер»" autoComplete="organization" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="ИНН" required error="ИНН состоит из 10 или 12 цифр">
        <Input.Wrapper>
          <Input.Field defaultValue="77010" inputMode="numeric" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root
        label="Промокод"
        optional
        reserveSupportRow
        error={checked ? "Промокод недействителен или истёк" : undefined}
      >
        <Input.Wrapper>
          <Input.Field defaultValue="SPRING25" />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root variant="soft" tone="neutral" onClick={() => setChecked((value) => !value)}>
        {checked ? "Сбросить проверку" : "Проверить промокод"}
      </Button.Root>
    </>
  );
}
