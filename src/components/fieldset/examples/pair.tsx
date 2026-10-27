/** Company details two to a row: the field left alone in the last row spans it, a narrow group stacks them — `label`, `layout`. */
import { Fieldset, Input } from "prime-ui-kit";

export default function FieldsetPairExample() {
  return (
    <Fieldset label="Реквизиты" layout="pair">
      <Input.Root label="ИНН">
        <Input.Wrapper>
          <Input.Field inputMode="numeric" defaultValue="7814523690" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="КПП">
        <Input.Wrapper>
          <Input.Field inputMode="numeric" defaultValue="781401001" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Расчётный счёт">
        <Input.Wrapper>
          <Input.Field inputMode="numeric" defaultValue="40702810900000012345" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="БИК">
        <Input.Wrapper>
          <Input.Field inputMode="numeric" defaultValue="044030653" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Юридический адрес">
        <Input.Wrapper>
          <Input.Field defaultValue="Санкт-Петербург, Невский проспект, 28, офис 410" />
        </Input.Wrapper>
      </Input.Root>
    </Fieldset>
  );
}
