/** A fixed prefix and suffix flush with the edges and a unit next to the value, heard as a word by a screen reader — `Input.Affix`, `Input.InlineAffix`, `aria-label`. */
import { Input } from "prime-ui-kit";

export default function InputAffixesExample() {
  return (
    <>
      <Input.Root label="Адрес магазина" hint="Латиница, цифры и дефис">
        <Input.Wrapper>
          <Input.Affix side="start">https://</Input.Affix>
          <Input.Field placeholder="moy-magazin" />
          <Input.Affix side="end">.shop.ru</Input.Affix>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Сумма платежа">
        <Input.Wrapper>
          <Input.Field placeholder="0,00" inputMode="decimal" />
          <Input.InlineAffix side="end" aria-label="рублей">
            ₽
          </Input.InlineAffix>
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
