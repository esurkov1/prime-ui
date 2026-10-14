/** A default field next to a disabled and an invalid one, and one whose focus shows without the ring — `disabled`, `invalid`, `focusRing`. */
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
      <NativeSelect label="focusRing={false}" defaultValue="editor" focusRing={false}>
        <option value="viewer">Наблюдатель</option>
        <option value="editor">Редактор</option>
      </NativeSelect>
    </>
  );
}
