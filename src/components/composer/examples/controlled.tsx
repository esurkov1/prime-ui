/** Every conversation keeps its own draft: switching the chat swaps the text, a template button fills it from outside — `value`, `onValueChange`. */
import { Button, Composer, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CHATS = [
  { id: "sokolova", name: "Анна Соколова" },
  { id: "logistics", name: "Логистика" },
] as const;

type ChatId = (typeof CHATS)[number]["id"];

const TEMPLATE = "Здравствуйте! Заказ передан в доставку, трек-номер пришлём сегодня.";

export default function ComposerControlledExample() {
  const [chat, setChat] = React.useState<ChatId>("sokolova");
  const [drafts, setDrafts] = React.useState<Record<ChatId, string>>({
    sokolova: "Акт сверки отправлю до пятницы",
    logistics: "",
  });

  const setDraft = (text: string) => setDrafts((current) => ({ ...current, [chat]: text }));

  return (
    <div className={styles.chat}>
      <SegmentedControl.Root
        aria-label="Разговор"
        value={chat}
        onValueChange={(next) => setChat(next as ChatId)}
      >
        {CHATS.map(({ id, name }) => (
          <SegmentedControl.Item key={id} value={id}>
            {name}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <Composer.Root value={drafts[chat]} onValueChange={setDraft} onSend={() => setDraft("")} />
      <div>
        <Button.Root variant="soft" tone="neutral" onClick={() => setDraft(TEMPLATE)}>
          Вставить шаблон
        </Button.Root>
      </div>
    </div>
  );
}
