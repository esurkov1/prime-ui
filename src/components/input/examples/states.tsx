/** A default field next to a disabled and a read-only one — `disabled`, `readOnly`. */
import { Icon, Input } from "prime-ui-kit";

export default function InputStatesExample() {
  return (
    <>
      <Input.Root label="default">
        <Input.Wrapper>
          <Input.Field placeholder="Например, Москва" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="disabled">
        <Input.Wrapper>
          <Input.Field defaultValue="Екатеринбург" disabled />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="readOnly">
        <Input.Wrapper>
          <Input.Field defaultValue="ID 4821-0093" readOnly />
          <Input.Icon side="end">
            <Icon name="status.locked" tone="secondary" />
          </Input.Icon>
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
