/** A new password with a show toggle and a meter that fills step by step and names the level beside the hint, and a service password measured by the company's own rule — `Input.RevealButton`, `strength`, `getStrength`. */
import { Input, type PasswordStrength } from "prime-ui-kit";

/** The company rule for service accounts: only the length counts, 16 characters and more is hard. */
function serviceStrength(value: string): PasswordStrength {
  if (value.length === 0) return 0;
  if (value.length < 8) return 1;
  if (value.length < 12) return 2;
  if (value.length < 16) return 3;
  return 4;
}

export default function InputPasswordStrengthExample() {
  return (
    <>
      <Input.Root label="Новый пароль" hint="Не короче 8 символов" strength>
        <Input.Wrapper>
          <Input.Field type="password" autoComplete="new-password" defaultValue="Graphite2026" />
          <Input.RevealButton />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root
        label="Пароль сервисного аккаунта"
        hint="По правилам компании — от 16 символов"
        strength
        getStrength={serviceStrength}
      >
        <Input.Wrapper>
          <Input.Field
            type="password"
            autoComplete="new-password"
            defaultValue="export-1c-nightly"
          />
          <Input.RevealButton />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
