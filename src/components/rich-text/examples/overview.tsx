/** The welcome text of a support bot shown outside the chat: bold, a link, a quote, code and a spoiler from the chat's Markdown — `children`. */
import { Card, RichText } from "prime-ui-kit";

const WELCOME = [
  "**Здравствуйте!** Это бот поддержки «Прайм».",
  "Счета и акты — в [личном кабинете](https://prime.app/billing), номер договора начинается с `PR-`.",
  "> Отвечаем в рабочие дни с 9:00 до 19:00 по Москве.",
  "Код для входа в приложение: ||4821||",
].join("\n");

export default function RichTextOverviewExample() {
  return (
    <Card.Root>
      <Card.Body>
        <RichText>{WELCOME}</RichText>
      </Card.Body>
    </Card.Root>
  );
}
