/** A group of contact fields under a heading with a short description, no frame of its own — `label`, `description`. */
import { Fieldset, Icon, Input } from "prime-ui-kit";

export default function FieldsetOverviewExample() {
  return (
    <Fieldset label="Контакты" description="На эти адреса уйдут счета и закрывающие документы.">
      <Input.Root label="Почта для счетов">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon name="field.email" />
          </Input.Icon>
          <Input.Field type="email" defaultValue="billing@severny-veter.ru" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Телефон бухгалтерии" optional>
        <Input.Wrapper>
          <Input.Field type="tel" defaultValue="+7 812 555-01-42" />
        </Input.Wrapper>
      </Input.Root>
    </Fieldset>
  );
}
