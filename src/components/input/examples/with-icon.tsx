/** A decorative icon at either end of the value — `Input.Icon`, `side`. */
import { Icon, Input } from "prime-ui-kit";

export default function InputWithIconExample() {
  return (
    <>
      <Input.Root label="Поиск по каталогу">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon name="action.search" tone="secondary" />
          </Input.Icon>
          <Input.Field type="search" placeholder="Название или артикул" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Номер договора">
        <Input.Wrapper>
          <Input.Field defaultValue="Д-2026/0147" readOnly />
          <Input.Icon side="end">
            <Icon name="status.locked" tone="secondary" />
          </Input.Icon>
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
