/** A delivery city whose suggestions stay open on a press beside the field while the address is copied from a letter; Escape still closes them — `closeOnOutsideClick`, `closeOnEscape`. */
import { Input } from "prime-ui-kit";
import * as React from "react";

const CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
];

export default function InputDismissExample() {
  const [city, setCity] = React.useState("");

  return (
    <Input.Root
      label="Город доставки"
      suggestions={CITIES}
      closeOnOutsideClick={false}
      closeOnEscape
    >
      <Input.Wrapper>
        <Input.Field value={city} onValueChange={setCity} />
      </Input.Wrapper>
    </Input.Root>
  );
}
