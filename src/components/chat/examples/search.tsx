/** Search and pinned messages: the search bar marks every match in the texts and transcripts, counts them and steps between them while the others step back; a pinned message's press jumps to it and blinks the others — `Chat.SearchButton`, `Chat.Search`, `defaultSearch`, `Chat.Pinned`. */
import { Card, Chat, Message, VoicePlayer } from "prime-ui-kit";

import styles from "./examples.module.css";

const AUDIO = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";
const WAVE = [0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.6, 0.35, 0.7, 0.5, 0.3, 0.6, 0.8, 0.45, 0.25, 0.5];

const PINNED = [{ value: "p1", text: "Реквизиты склада для накладных" }];

const LINES = [
  "Счёт INV-3010 выставлен, проверьте реквизиты.",
  "Склад подтвердил отгрузку по заказу №3011.",
  "Бухгалтерия закрыла акт сверки за неделю.",
  "Счёт INV-3013 оплачен, закрываю заказ.",
  "Поставщик прислал новые цены.",
  "Заказ №3015 собран, ждём курьера.",
];

export default function ChatSearchExample() {
  return (
    <Card.Root className={styles.short}>
      <Chat.Root defaultSearch="счёт">
        <Chat.Header>
          <Chat.Title>Склад и бухгалтерия</Chat.Title>
          <Chat.Description>4 участника</Chat.Description>
          <Chat.Actions>
            <Chat.SearchButton />
          </Chat.Actions>
        </Chat.Header>
        <Chat.Search />
        <Chat.Pinned items={PINNED} />
        <Chat.Messages>
          <Message.Root value="p1" time="09:00">
            <Message.Text>
              Реквизиты склада для накладных: ИНН 7701234567, КПП 770101001.
            </Message.Text>
          </Message.Root>
          {LINES.map((line, index) => (
            <Message.Root
              key={line}
              value={`l${index}`}
              direction={index % 3 === 2 ? "outgoing" : "incoming"}
              time={`10:${String(10 + index).padStart(2, "0")}`}
            >
              <Message.Text>{line}</Message.Text>
            </Message.Root>
          ))}
          <Message.Root value="v1" time="11:02">
            <VoicePlayer
              src={AUDIO}
              waveform={WAVE}
              duration={12}
              transcript="Счёт на доставку пришлю после обеда."
            />
          </Message.Root>
        </Chat.Messages>
      </Chat.Root>
    </Card.Root>
  );
}
