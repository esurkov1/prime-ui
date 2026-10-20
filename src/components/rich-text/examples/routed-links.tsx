/** The assistant's weekly summary on a CRM page: a heading line, a bulleted and a numbered list, and links to the product's screens that the app routes in place — `children`, `onLinkClick`. */
import { Card, RichText, Typography } from "prime-ui-kit";
import * as React from "react";

const SUMMARY = `## Итоги недели
- Закрыто **6 сделок** на 3,2 млн ₽ — [отчёт](/reports/sales?period=week)
- Просрочено _2 счёта_: [Альфа-Логистик](/billing/invoices/4821)

На понедельник:
1. Согласовать договор с «Вектор»
2. Перенести демо для «ТехноСнаб»`;

export default function RichTextRoutedLinksExample() {
  const [route, setRoute] = React.useState<string | null>(null);

  // A product link: the app's router opens it in place; ⌘ / Ctrl + click still opens a new tab.
  const openRoute = (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setRoute(href);
  };

  return (
    <Card.Root>
      <Card.Body>
        <RichText onLinkClick={openRoute}>{SUMMARY}</RichText>
        <Typography as="p" variant="caption" tone="muted" aria-live="polite">
          {route ? `Открыт экран ${route}` : "Ссылки открывают экраны CRM на месте"}
        </Typography>
      </Card.Body>
    </Card.Root>
  );
}
