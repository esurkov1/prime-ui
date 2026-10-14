/** A default field next to a disabled, a read-only and an invalid one with no message — `disabled`, `readOnly`, `invalid`. */
import { Icon, Input } from "prime-ui-kit";

export default function InputStatesExample() {
  return (
    <>
      <div>
        <div>
          <Input.Root label="default">
            <Input.Wrapper>
              <Input.Field placeholder="Например, Москва" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
      <div>
        <div>
          <Input.Root label="disabled">
            <Input.Wrapper>
              <Input.Field defaultValue="Екатеринбург" disabled />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
      <div>
        <div>
          <Input.Root label="readOnly">
            <Input.Wrapper>
              <Input.Field defaultValue="ID 4821-0093" readOnly />
              <Input.Icon side="end">
                <Icon name="status.locked" tone="secondary" />
              </Input.Icon>
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
      <div>
        <div>
          <Input.Root label="invalid" invalid>
            <Input.Wrapper>
              <Input.Field type="tel" defaultValue="+7 900 12" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
    </>
  );
}
