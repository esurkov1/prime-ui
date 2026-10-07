/** A soft status badge at the end of the field; the height does not change — `Input.Badge`, `color`. */
import { Input } from "prime-ui-kit";

export default function InputWithBadgeExample() {
  return (
    <>
      <Input.Root label="ИНН контрагента">
        <Input.Wrapper>
          <Input.Field defaultValue="7707083893" inputMode="numeric" />
          <Input.Badge color="green">Проверен</Input.Badge>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="КПП">
        <Input.Wrapper>
          <Input.Field placeholder="9 цифр" inputMode="numeric" />
          <Input.Badge color="orange">Не заполнено</Input.Badge>
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
