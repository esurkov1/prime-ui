import * as React from "react";

import { Checkbox } from "@/components/checkbox/Checkbox";

export default function CheckboxControlledSnippet() {
  const [checked, setChecked] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(true);

  return (
    <>
      <Checkbox.Root checked={checked} onChange={(e) => setChecked(e.target.checked)}>
        <Checkbox.Label>Контролируемый флаг: {checked ? "включено" : "выключено"}</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root indeterminate={indeterminate} onChange={() => setIndeterminate(false)}>
        <Checkbox.Label>
          Контролируемый indeterminate: {indeterminate ? "да (частичный выбор)" : "нет"}
        </Checkbox.Label>
      </Checkbox.Root>
    </>
  );
}
