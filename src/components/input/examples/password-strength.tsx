/** A new password with a meter that fills step by step and names the level beside the hint — `strength`. */
import { Input } from "prime-ui-kit";

export default function InputPasswordStrengthExample() {
  return (
    <Input.Root label="Новый пароль" hint="Не короче 8 символов" strength>
      <Input.Wrapper>
        <Input.Field type="password" autoComplete="new-password" defaultValue="Graphite2026" />
      </Input.Wrapper>
    </Input.Root>
  );
}
