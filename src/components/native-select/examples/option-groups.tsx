/** Options under group headings with the native optgroup, and a placeholder while nothing is picked — `placeholder`. */
import { NativeSelect } from "prime-ui-kit";

export default function NativeSelectOptionGroupsExample() {
  return (
    <NativeSelect label="Часовой пояс" placeholder="Выберите пояс">
      <optgroup label="Европа">
        <option value="kal">Калининград, UTC+2</option>
        <option value="msk">Москва, UTC+3</option>
      </optgroup>
      <optgroup label="Азия">
        <option value="ekb">Екатеринбург, UTC+5</option>
        <option value="nsk">Новосибирск, UTC+7</option>
      </optgroup>
    </NativeSelect>
  );
}
