/** A new password with a show toggle and a meter that fills step by step and names the level beside the hint — `Input.RevealButton`, `strength`. */
import { Input } from "prime-ui-kit";

export default function InputPasswordStrengthExample() {
  return (
    <Input.Root label="Новый пароль" hint="Не короче 8 символов" strength>
      <Input.Wrapper>
        <Input.Field type="password" autoComplete="new-password" defaultValue="Graphite2026" />
        <Input.RevealButton />
      </Input.Wrapper>
    </Input.Root>
  );
}
