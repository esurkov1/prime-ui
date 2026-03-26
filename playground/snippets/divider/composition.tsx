import { Divider } from "@/components/divider/Divider";
import { Icon } from "@/icons";

import s from "./divider-demos.module.css";

/** Иконка + подпись: отступ между ними задаётся компонентом (gap во внутреннем контенте). */
export default function DividerCompositionSnippet() {
  return (
    <div className={s.compositionCard}>
      <p className={s.demoHint}>Иконка и текст внутри одного разделителя</p>
      <Divider.Root variant="text" size="m">
        <Icon name="field.email" size="s" />
        Контакты
      </Divider.Root>
      <p className={s.compositionBody}>user@example.com</p>

      <Divider.Root size="m" className={s.compositionDividerFollow}>
        <Icon name="nav.layoutGrid" size="s" />
        Параметры
      </Divider.Root>
      <p className={s.compositionBody}>Значение A · Значение B</p>
    </div>
  );
}
