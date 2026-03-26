import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Typography } from "@/components/typography/Typography";

/**
 * Золотой сценарий: блок чтения (`Typography` + `variant`) и блок контролов (`size` у полей и кнопок).
 */
export default function TypographyReadingAndControlSnippet() {
  return (
    <main className="typographyGoldenDemo">
      <Typography.Root as="h1" variant="heading-page">
        Заявка на доступ
      </Typography.Root>
      <Typography.Root as="p" variant="body-default" tone="muted">
        Заполните форму: типографика страницы не зависит от размеров полей.
      </Typography.Root>
      <div className="typographyGoldenDemoForm">
        <Input.Root label="Email" size="m">
          <Input.Wrapper>
            <Input.Field type="email" placeholder="you@example.com" autoComplete="email" />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="Комментарий" size="m" hint="Необязательно">
          <Input.Wrapper>
            <Input.Field placeholder="Контекст" />
          </Input.Wrapper>
        </Input.Root>
        <div className="typographyGoldenDemoActions">
          <Button.Root type="button" size="m" variant="primary">
            Отправить
          </Button.Root>
          <Button.Root type="button" size="m" variant="neutral" mode="stroke">
            Отмена
          </Button.Root>
        </div>
      </div>
    </main>
  );
}
