/** Every kind of message in its shell, both directions, single and in runs: text bubbles, pictures and circles as blocks, a caption bubble, voice, file, contact, place and link cards, reactions inside a bubble and under a picture — `Message.Media`, `VideoNote`, `Message.File`, `Message.Contact`, `Message.Location`, `Message.LinkPreview`, `VoicePlayer`. */
import { Button, Message, type MessageReaction, VideoNote, VoicePlayer } from "prime-ui-kit";

import styles from "./examples.module.css";

const AUDIO = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";
const VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const MAP = "https://tile.openstreetmap.org/15/19808/10244.png";
const WAVE = [0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.6, 0.35, 0.7, 0.5, 0.3, 0.6, 0.8, 0.45, 0.25, 0.5];

const LIKED: MessageReaction[] = [{ emoji: "👍", count: 2, selected: true }];
const FIRE: MessageReaction[] = [{ emoji: "🔥", count: 1 }];

const photo = (seed: string, width: number, height: number, alt: string) => ({
  src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  width,
  height,
  alt,
});

export default function MessageKindsExample() {
  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" position="first" time="09:10">
        <Message.Text>Привет! Пришлю всё по складу одним заходом.</Message.Text>
      </Message.Root>
      <Message.Root direction="incoming" position="middle" time="09:10">
        <Message.Media items={[photo("rack-front", 800, 600, "Стеллажи, вид спереди")]} />
      </Message.Root>
      <Message.Root direction="incoming" position="last" time="09:11">
        <Message.Media
          items={[
            photo("rack-a", 600, 800, "Ряд А"),
            photo("rack-b", 800, 600, "Ряд Б"),
            photo("rack-c", 800, 600, "Ряд В"),
          ]}
        />
        <Message.Reactions items={FIRE} />
      </Message.Root>
      <Message.Root direction="outgoing" position="first" time="09:12" status="read">
        <Message.Media items={[photo("dock-gate", 800, 600, "Ворота рампы")]} />
        <Message.Text>Это ворота рампы после ремонта — подпись под фото.</Message.Text>
      </Message.Root>
      <Message.Root direction="outgoing" position="last" time="09:12" status="read">
        <Message.Text>Ок</Message.Text>
        <Message.Reactions items={LIKED} />
      </Message.Root>
      <Message.Root direction="incoming" time="09:14">
        <VideoNote src={VIDEO} duration={6} />
      </Message.Root>
      <Message.Root direction="outgoing" time="09:15" status="read">
        <VideoNote src={VIDEO} duration={6} />
      </Message.Root>
      <Message.Root direction="incoming" time="09:16">
        <VoicePlayer src={AUDIO} waveform={WAVE} duration={21} unplayed />
      </Message.Root>
      <Message.Root direction="outgoing" time="09:17" status="sent">
        <VoicePlayer src={AUDIO} waveform={WAVE} duration={9} />
      </Message.Root>
      <Message.Root direction="incoming" time="09:18">
        <Message.File
          name="Акт приёмки №52.pdf"
          fileSize={845_000}
          href="https://prime.app/files/act-52.pdf"
        />
      </Message.Root>
      <Message.Root direction="outgoing" time="09:19" status="read">
        <Message.Contact name="Дмитрий Орлов" phone="+7 916 204-18-77" color="teal">
          <Button.Root variant="soft" tone="neutral" size="s">
            Написать
          </Button.Root>
        </Message.Contact>
      </Message.Root>
      <Message.Root direction="incoming" time="09:20">
        <Message.Location
          src={MAP}
          href="https://www.openstreetmap.org/#map=16/55.7512/37.6184"
          title="Склад «Центральный»"
          address="Москва, ул. Складочная, 1, стр. 6"
        />
      </Message.Root>
      <Message.Root direction="outgoing" time="09:21" status="sending">
        <Message.Text>Регламент приёмки: https://prime.app/wiki/warehouse-intake</Message.Text>
        <Message.LinkPreview
          href="https://prime.app/wiki/warehouse-intake"
          site="База знаний"
          title="Регламент приёмки на складе"
          description="Сроки разгрузки, акты расхождений и фотофиксация паллет."
        />
      </Message.Root>
    </div>
  );
}
