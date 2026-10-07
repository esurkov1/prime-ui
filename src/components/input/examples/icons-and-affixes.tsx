/** Slots inside the field: a leading icon, a tinted section affix and an inline unit. Use them for e-mail/URL/amount fields that need a visual cue or a fixed prefix/suffix. */
import { Icon, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function InputIconsAndAffixesExample() {
  return (
    <div className={styles.stack}>
      <Input.Root label="Электронная почта">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon name="field.email" tone="secondary" />
          </Input.Icon>
          <Input.Field type="email" placeholder="name@company.ru" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Адрес магазина">
        <Input.Wrapper>
          <Input.Affix side="start">https://</Input.Affix>
          <Input.Field placeholder="moy-magazin" />
          <Input.Affix side="end">.shop.ru</Input.Affix>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Сумма платежа">
        <Input.Wrapper>
          <Input.Field placeholder="0,00" inputMode="decimal" />
          <Input.InlineAffix side="end">₽</Input.InlineAffix>
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
