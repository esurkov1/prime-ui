/** A labelled system select with a hint; the OS picker opens on phones — `label`, `hint`. */
import { NativeSelect } from "prime-ui-kit";

export default function NativeSelectOverviewExample() {
  return (
    <NativeSelect
      label="Тема оформления"
      hint="На телефоне откроется системный список"
      defaultValue="auto"
    >
      <option value="auto">Как в системе</option>
      <option value="light">Светлая</option>
      <option value="dark">Тёмная</option>
    </NativeSelect>
  );
}
