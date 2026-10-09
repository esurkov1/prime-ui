/** A message with a link and the card of the page under it: site, title, description and picture — `Message.LinkPreview`, `site`, `image`. */
import { Message } from "prime-ui-kit";

export default function MessageLinkPreviewExample() {
  return (
    <Message.Group aria-label="Чат маркетинга">
      <Message.Root direction="outgoing" time="18:02" status="read">
        <Message.Text>Наш кейс опубликовали: https://prime.app/blog/vector-case</Message.Text>
        <Message.LinkPreview
          href="https://prime.app/blog/vector-case"
          site="Блог Prime"
          title="Как «Вектор» сократил закрытие месяца до двух дней"
          description="Автоматическая сверка счетов, выгрузка в 1С и отчёты для финансового директора."
          image="https://picsum.photos/seed/vector-case/640/360"
        />
      </Message.Root>
    </Message.Group>
  );
}
