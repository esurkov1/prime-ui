/** At phone width bubbles take up to 85% of the chat, long words and links wrap inside, an album keeps its rows — `Message.Root`, `Message.Media`. */
import { Message } from "prime-ui-kit";

import styles from "./examples.module.css";

const ALBUM = [
  { src: "https://picsum.photos/seed/pallet-1/600/600", width: 600, height: 600, alt: "Паллета 1" },
  { src: "https://picsum.photos/seed/pallet-2/600/600", width: 600, height: 600, alt: "Паллета 2" },
  { src: "https://picsum.photos/seed/pallet-3/600/600", width: 600, height: 600, alt: "Паллета 3" },
];

export default function MessageNarrowExample() {
  return (
    <div className={styles.phone}>
      <Message.Group aria-label="Чат склада на телефоне">
        <Message.Root direction="incoming" time="07:58">
          <Message.Text>
            Паллеты для «ТехноСнаб» собраны, накладная
            https://prime.app/warehouse/waybills/2026-10-08/TS-00418 в системе.
          </Message.Text>
        </Message.Root>
        <Message.Root direction="incoming" time="07:59">
          <Message.Media items={ALBUM} />
        </Message.Root>
        <Message.Root direction="outgoing" time="08:03" status="read">
          <Message.Text>Отлично, машина будет к девяти.</Message.Text>
        </Message.Root>
      </Message.Group>
    </div>
  );
}
