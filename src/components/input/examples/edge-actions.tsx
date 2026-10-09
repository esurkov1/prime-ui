/** Actions at the field's end: a mail link with a tooltip beside copying the value, and a profile link on a read-only field — `Input.Action`, `Input.CopyButton`. */
import { Icon, Input } from "prime-ui-kit";

export default function InputEdgeActionsExample() {
  return (
    <>
      <Input.Root label="Почта контакта">
        <Input.Wrapper>
          <Input.Field type="email" defaultValue="i.sokolova@severny-veter.ru" />
          <Input.Action label="Написать письмо" asChild>
            <a href="mailto:i.sokolova@severny-veter.ru">
              <Icon name="field.email" />
            </a>
          </Input.Action>
          <Input.CopyButton />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Ответственный">
        <Input.Wrapper>
          <Input.Field readOnly defaultValue="Анна Ковалёва" />
          <Input.Action label="Открыть профиль" asChild>
            <a href="#team-kovaleva">
              <Icon name="object.user" />
            </a>
          </Input.Action>
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
