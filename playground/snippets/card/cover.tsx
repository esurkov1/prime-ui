import { Button } from "@/components/button/Button";
import { Card } from "@/components/card/Card";

export default function CardCoverSnippet() {
  return (
    <Card.Root variant="cover">
      <Card.Cover aria-hidden>
        <div
          style={{
            minHeight: "7rem",
            background:
              "linear-gradient(135deg, var(--prime-sys-color-status-information-background) 0%, var(--prime-sys-color-surface-raised) 100%)",
          }}
        />
      </Card.Cover>
      <Card.Stack>
        <Card.Title>Кампания «Весна»</Card.Title>
        <Card.Label>Охват и клики за 7 дней</Card.Label>
        <Card.Description>Сравнение с контрольной группой.</Card.Description>
      </Card.Stack>
      <Card.Actions>
        <Button.Root mode="filled" size="s" type="button" variant="primary">
          Открыть отчёт
        </Button.Root>
      </Card.Actions>
    </Card.Root>
  );
}
