/** A labelled field with a hint under it — `label`, `hint`. */
import { Input } from "prime-ui-kit";

export default function InputOverviewExample() {
  return (
    <Input.Root label="Рабочая почта" hint="Пришлём ссылку для входа">
      <Input.Wrapper>
        <Input.Field type="email" name="email" placeholder="name@company.ru" autoComplete="email" />
      </Input.Wrapper>
    </Input.Root>
  );
}
