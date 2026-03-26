import { Button } from "@/components/button/Button";
import { Card } from "@/components/card/Card";
import { LinkButton } from "@/components/link-button/LinkButton";

export default function CardCtaSnippet() {
  return (
    <Card.Root variant="cta">
      <Card.Title>Экспорт отчёта</Card.Title>
      <Card.CtaBody>
        Скачайте сводку по сегментам и метрикам за выбранный период в CSV или XLSX.
      </Card.CtaBody>
      <Card.Actions>
        <LinkButton.Root href="#" size="s">
          Скачать CSV
        </LinkButton.Root>
        <Button.Root mode="ghost" size="s" type="button" variant="neutral">
          Настроить колонки
        </Button.Root>
      </Card.Actions>
    </Card.Root>
  );
}
