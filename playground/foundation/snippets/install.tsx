// Один раз в корне приложения
import "prime-ui-kit/bundle.css"; // токены, обе темы и стили компонентов
import "prime-ui-kit/fonts.css"; // по желанию: Golos Text и JetBrains Mono из Google Fonts
import "prime-ui-kit/reset.css"; // по желанию: минимальный сброс документа

import { Button, Input } from "prime-ui-kit";

export function Example() {
  return (
    <form>
      <Input.Root label="Email" id="email">
        <Input.Wrapper>
          <Input.Field type="email" placeholder="you@example.com" />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root>Отправить</Button.Root>
    </form>
  );
}

// Тёмная тема: <html data-theme="dark">
