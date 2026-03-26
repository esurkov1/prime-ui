import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Typography } from "@/components/typography/Typography";

/**
 * Заголовок и вводный текст — только `Typography` + `variant`; поля и действия — `Input` и `Button` (см. их COMPONENT.md).
 */
export default function TypographyReadingAndFormSnippet() {
  return (
    <main className="typographyGoldenDemo">
      <Typography.Root as="h1" variant="heading-page">
        Заявка на доступ
      </Typography.Root>
      <Typography.Root as="p" variant="body-default" tone="muted">
        Заполните форму: роли текста задаются здесь, оформление полей — компонентами формы.
      </Typography.Root>
      <div className="typographyGoldenDemoForm">
        <Input.Root label="Email">
          <Input.Wrapper>
            <Input.Field type="email" placeholder="you@example.com" autoComplete="email" />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="Комментарий" hint="Необязательно">
          <Input.Wrapper>
            <Input.Field placeholder="Контекст" />
          </Input.Wrapper>
        </Input.Root>
        <div className="typographyGoldenDemoActions">
          <Button.Root type="button" variant="primary">
            Отправить
          </Button.Root>
          <Button.Root type="button" variant="neutral" mode="stroke">
            Отмена
          </Button.Root>
        </div>
      </div>
    </main>
  );
}
