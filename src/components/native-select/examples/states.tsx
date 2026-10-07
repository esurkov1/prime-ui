/** A default field next to a disabled and an invalid one — `disabled`, `invalid`. */
import { NativeSelect } from "prime-ui-kit";

export default function NativeSelectStatesExample() {
  return (
    <>
      <NativeSelect label="default" defaultValue="editor">
        <option value="viewer">Наблюдатель</option>
        <option value="editor">Редактор</option>
      </NativeSelect>
      <NativeSelect label="disabled" defaultValue="viewer" disabled>
        <option value="viewer">Наблюдатель</option>
        <option value="editor">Редактор</option>
      </NativeSelect>
      <NativeSelect label="invalid" placeholder="Выберите роль" invalid>
        <option value="viewer">Наблюдатель</option>
        <option value="editor">Редактор</option>
      </NativeSelect>
    </>
  );
}
