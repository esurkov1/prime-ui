/** A place on a map picture from your map service with a pin, the place and its address, and a live location of a courier on its way — `Message.Location`, `href`, `live`. */
import { Message } from "prime-ui-kit";

const MAP = "https://tile.openstreetmap.org/15/19808/10244.png";

export default function MessageLocationExample() {
  return (
    <Message.Group aria-label="Чат доставки">
      <Message.Root direction="incoming" time="08:55">
        <Message.Location
          src={MAP}
          href="https://www.openstreetmap.org/#map=16/55.7512/37.6184"
          title="Склад «Центральный»"
          address="Москва, ул. Складочная, 1, стр. 6"
        />
      </Message.Root>
      <Message.Root direction="incoming" time="09:30">
        <Message.Location
          src={MAP}
          href="https://www.openstreetmap.org/#map=16/55.7512/37.6184"
          title="Курьер Дмитрий"
          address="Обновлено минуту назад"
          live
        />
      </Message.Root>
    </Message.Group>
  );
}
