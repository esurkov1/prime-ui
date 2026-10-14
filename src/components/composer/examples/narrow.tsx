/** On a phone-width chat the row keeps the paperclip, the field and the button; Enter makes a new line on touch screens and the button sends — `Composer.Attach`, `onSend`. */
import { Composer, useUploadQueue } from "prime-ui-kit";

import styles from "./examples.module.css";

const DRAFT = "Курьер приедет с 10 до 14, подтвердите, пожалуйста, адрес доставки";

export default function ComposerNarrowExample() {
  const queue = useUploadQueue({ upload: async (file) => file.name });

  return (
    <div className={styles.phone}>
      <Composer.Root defaultValue={DRAFT} queue={queue} onSend={() => {}} onSendVoice={() => {}}>
        <Composer.Context onDismiss={() => {}}>
          <Composer.Title>Ответ Игорю Белову</Composer.Title>
          <Composer.Description>Когда ждать курьера по заказу № 4821?</Composer.Description>
        </Composer.Context>
        <Composer.Attach />
      </Composer.Root>
    </div>
  );
}
