import { Divider } from "@/components/divider/Divider";

import s from "./divider-demos.module.css";

/** Три размера подряд — сравнение без лишнего текста. */
export default function DividerSizesSnippet() {
  return (
    <div className={s.sizesCard}>
      <p className={s.demoHint}>
        size=&quot;s&quot; / &quot;m&quot; / &quot;xl&quot; — кегль подписи и отступы
      </p>
      <Divider.Root variant="text" size="s">
        Компактно (s)
      </Divider.Root>
      <Divider.Root variant="text" size="m">
        Обычно (m)
      </Divider.Root>
      <Divider.Root variant="text" size="xl">
        Акцент (xl)
      </Divider.Root>
    </div>
  );
}
