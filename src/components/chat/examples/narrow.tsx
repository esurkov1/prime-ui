/** At phone width the header keeps its actions and lets the title ellipsize, bubbles take up to 85% of the chat, long links wrap and an album keeps its layout — `Chat.Root`, `Chat.Header`, `Chat.Messages`, `Chat.Footer`. */
import { Avatar, Card, Chat, Composer, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

const ALBUM = [
  { src: "https://picsum.photos/seed/pallet-1/600/800", width: 600, height: 800, alt: "Паллета 1" },
  { src: "https://picsum.photos/seed/pallet-2/800/600", width: 800, height: 600, alt: "Паллета 2" },
  { src: "https://picsum.photos/seed/pallet-3/800/600", width: 800, height: 600, alt: "Паллета 3" },
];

export default function ChatNarrowExample() {
  return (
    <Card.Root className={styles.phone}>
      <Chat.Root>
        <Chat.Header>
          <Avatar.Root color="sky">
            <Avatar.Fallback>СЦ</Avatar.Fallback>
          </Avatar.Root>
          <Chat.Title>Склад «Центральный», смена Б</Chat.Title>
          <Chat.Description>в сети</Chat.Description>
          <Chat.Actions>
            <Chat.SearchButton />
          </Chat.Actions>
        </Chat.Header>
        <Chat.Messages>
          <Message.Root value="n1" time="07:58">
            <Message.Text>
              Паллеты для «ТехноСнаб» собраны, накладная
              https://prime.app/warehouse/waybills/2026-10-08/TS-00418 в системе.
            </Message.Text>
          </Message.Root>
          <Message.Root value="n2" time="07:59">
            <Message.Media items={ALBUM} />
          </Message.Root>
          <Message.Root value="n3" direction="outgoing" time="08:03" status="read">
            <Message.Text>Отлично, машина будет к девяти.</Message.Text>
          </Message.Root>
        </Chat.Messages>
        <Chat.Footer>
          <Composer.Root />
        </Chat.Footer>
      </Chat.Root>
    </Card.Root>
  );
}
