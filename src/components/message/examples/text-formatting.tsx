/** The Markdown the Composer writes, rendered safely: bold, italic, strike, code, a code block, links and a quote; long words and URLs wrap — `Message.Text`, `edited`. */
import { Message } from "prime-ui-kit";

const RELEASE = `**Релиз 2.4** готов к выкатке.
Изменения: _экспорт счетов_, ~~старый отчёт~~ удалён, флаг \`invoices.v2\`.
> Миграцию запускать только после бэкапа.
\`\`\`
bun run migrate --env=prod
\`\`\`
Чеклист: https://prime.app/wiki/release-2-4`;

export default function MessageTextFormattingExample() {
  return (
    <Message.Group aria-label="Чат разработки">
      <Message.Root direction="incoming" time="16:05">
        <Message.Text>{RELEASE}</Message.Text>
      </Message.Root>
      <Message.Root direction="outgoing" time="16:07" edited status="read">
        <Message.Text>
          Принято, запускаю после бэкапа. Отчёт положу в [задачу](https://prime.app/t/PRJ-430).
        </Message.Text>
      </Message.Root>
    </Message.Group>
  );
}
