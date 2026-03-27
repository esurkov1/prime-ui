import { Icon, Input } from "prime-ui-kit";
import * as React from "react";

/**
 * Вход: email с подписью, иконкой и автозаполнением.
 */
export default function LoginEmailExample() {
  const [email, setEmail] = React.useState("");

  return (
    <Input.Root label="Электронная почта" hint="Мы отправим код подтверждения на этот адрес">
      <Input.Wrapper>
        <Input.Icon side="start">
          <Icon surface="none" name="field.email" size="s" tone="subtle" />
        </Input.Icon>
        <Input.Field
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Input.Wrapper>
    </Input.Root>
  );
}
