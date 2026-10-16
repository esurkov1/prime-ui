/** Selected text gets a toolbar of bold, italic, underline, strikethrough, code, spoiler, link and quote, each with its shortcut, written as Markdown around the selection — `formatting`. */
import { Composer } from "prime-ui-kit";

import styles from "./examples.module.css";

const DRAFT =
  "Итог по заказу № 4821: доставка до пятницы, оплата по счёту. Выделите текст, чтобы оформить его.";

export default function ComposerFormattingExample() {
  return (
    <div className={styles.chat}>
      <Composer.Root defaultValue={DRAFT} formatting onSend={() => {}} />
    </div>
  );
}
