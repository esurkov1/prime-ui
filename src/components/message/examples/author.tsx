/** A group chat's run of one author: the first message opens with the name in the author's hue, a crown and the member's tag, the last one shows the avatar in the gutter; another author with initials only, a channel's long handle that ellipsizes before the name, a header on a pill over a photo, and your own reply — `Message.Author`, `tag`, `Message.AuthorIcon`, `Message.Avatar`, `position`, `hueOf`. */
import { Avatar, hueOf, Icon, Message } from "prime-ui-kit";

import styles from "./examples.module.css";

const OLEG_PHOTO =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";
const ANNA_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop";

const OLEG_RUN = [
  { position: "first", time: "09:15", text: "Релиз 2.4 переносим на четверг." },
  { position: "middle", time: "09:16", text: "Шаблон письма клиентам уже в базе знаний." },
  { position: "last", time: "09:17", text: "Отправлю до обеда." },
] as const;

export default function MessageAuthorExample() {
  return (
    <div className={styles.thread}>
      {OLEG_RUN.map((message) => (
        <Message.Root key={message.time} position={message.position} time={message.time}>
          <Message.Avatar>
            <Avatar.Root color={hueOf("oleg")}>
              <Avatar.Image src={OLEG_PHOTO} alt="" />
              <Avatar.Fallback>ОС</Avatar.Fallback>
            </Avatar.Root>
          </Message.Avatar>
          <Message.Author color={hueOf("oleg")} tag="Админ">
            Олег Смирнов
            <Message.AuthorIcon>
              <Icon name="object.crown" />
            </Message.AuthorIcon>
          </Message.Author>
          <Message.Text>{message.text}</Message.Text>
        </Message.Root>
      ))}
      <Message.Root time="09:20">
        <Message.Avatar>
          <Avatar.Root color={hueOf("irina")}>
            <Avatar.Fallback>ИБ</Avatar.Fallback>
          </Avatar.Root>
        </Message.Avatar>
        <Message.Author color={hueOf("irina")} tag="@severnyveter_buhgalteriya_otchety_bot">
          Ирина Белова
        </Message.Author>
        <Message.Text>Акты сверки после релиза.</Message.Text>
      </Message.Root>
      <Message.Root time="09:24">
        <Message.Avatar>
          <Avatar.Root color={hueOf("anna")}>
            <Avatar.Image src={ANNA_PHOTO} alt="" />
            <Avatar.Fallback>АК</Avatar.Fallback>
          </Avatar.Root>
        </Message.Avatar>
        <Message.Author color={hueOf("anna")} tag="Логистика">
          Анна Котова
        </Message.Author>
        <Message.Media
          items={[
            {
              src: "https://picsum.photos/seed/dock-gate/800/600",
              width: 800,
              height: 600,
              alt: "Ворота рампы",
            },
          ]}
        />
      </Message.Root>
      <Message.Root direction="outgoing" time="09:30" status="read">
        <Message.Text>Принято, обновлю календарь релизов.</Message.Text>
      </Message.Root>
    </div>
  );
}
