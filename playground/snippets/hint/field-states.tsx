import { Hint } from "@/components/hint/Hint";
import { Label } from "@/components/label/Label";

import styles from "./snippets.module.css";

/** Подсказки под полями в типичных состояниях экрана: обычное, ошибка, отключённое поле. */
export default function HintFieldStatesSnippet() {
  return (
    <div className="stack">
      <div className={`${styles.fieldRow} ${styles.maxW20}`}>
        <Label.Root htmlFor="hint-demo-ok" size="m">
          Название проекта
        </Label.Root>
        <input id="hint-demo-ok" type="text" defaultValue="Альфа" />
        <Hint.Root size="m" variant="default">
          Виден всем участникам рабочей области.
        </Hint.Root>
      </div>
      <div className={`${styles.fieldRow} ${styles.maxW20}`}>
        <Label.Root htmlFor="hint-demo-err" size="m">
          Код ИНН
        </Label.Root>
        <input id="hint-demo-err" type="text" defaultValue="12" aria-invalid="true" />
        <Hint.Root size="m" variant="error">
          Введите 10 или 12 цифр.
        </Hint.Root>
      </div>
      <div className={`${styles.fieldRow} ${styles.maxW20}`}>
        <Label.Root htmlFor="hint-demo-dis" size="m" disabled>
          Лимит запросов
        </Label.Root>
        <input id="hint-demo-dis" type="text" disabled value="только чтение" />
        <Hint.Root size="m" variant="disabled">
          Значение приходит из тарифа и не редактируется.
        </Hint.Root>
      </div>
    </div>
  );
}
