import { Icon, Input } from "prime-ui-kit";
import * as React from "react";

/**
 * Пароль: подсказка под полем и иконка справа (декоративная, без роли имени).
 */
export default function PasswordWithHintExample() {
  const [password, setPassword] = React.useState("");

  return (
    <Input.Root size="m" label="Пароль" hint="Не менее 8 символов, буквы и цифры">
      <Input.Wrapper>
        <Input.Field
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input.Icon side="end">
          <Icon name="status.locked" size="s" tone="subtle" />
        </Input.Icon>
      </Input.Wrapper>
    </Input.Root>
  );
}
