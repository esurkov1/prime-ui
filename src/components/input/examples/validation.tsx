/** Live validation: an error shakes the field as it arrives, drops in and leaves as soon as the value is fixed; required and optional markers, a hint and a support row that does not shift — `required`, `optional`, `hint`, `error`, `reserveSupportRow`. */
import { Button, Input } from "prime-ui-kit";
import * as React from "react";

const PROMO_CODES = ["SPRING25", "TEAM10"];

/** The INN error, or nothing when the value is a valid INN. */
function innError(value: string) {
  if (value === "") return "Введите ИНН";
  if (/\D/.test(value)) return "Только цифры, без пробелов и букв";
  if (value.length !== 10 && value.length !== 12) return "ИНН состоит из 10 или 12 цифр";
  return undefined;
}

export default function InputValidationExample() {
  const [inn, setInn] = React.useState("77010");
  const [promo, setPromo] = React.useState("SPRING");
  const [promoError, setPromoError] = React.useState<string>();

  const applyPromo = () =>
    setPromoError(
      PROMO_CODES.includes(promo.trim().toUpperCase())
        ? undefined
        : "Промокод недействителен или истёк",
    );

  return (
    <>
      <Input.Root label="Название организации" required hint="Как в учредительных документах">
        <Input.Wrapper>
          <Input.Field defaultValue="ООО «Северный ветер»" autoComplete="organization" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root
        label="ИНН"
        required
        hint="10 цифр для организации, 12 — для ИП"
        error={innError(inn)}
      >
        <Input.Wrapper>
          <Input.Field value={inn} onValueChange={setInn} inputMode="numeric" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Промокод" optional reserveSupportRow error={promoError}>
        <Input.Wrapper>
          <Input.Field
            value={promo}
            onValueChange={(value) => {
              setPromo(value);
              setPromoError(undefined);
            }}
          />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root variant="soft" tone="neutral" onClick={applyPromo}>
        Применить промокод
      </Button.Root>
    </>
  );
}
