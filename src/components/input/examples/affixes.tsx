/** A fixed prefix and suffix flush with the edges and a unit next to the value — `Input.Affix`, `Input.InlineAffix`. */
import { Input } from "prime-ui-kit";

export default function InputAffixesExample() {
  return (
    <>
      <Input.Root label="Адрес магазина" hint="Адрес: https://moy-magazin.shop.ru">
        <Input.Wrapper>
          <Input.Affix side="start">https://</Input.Affix>
          <Input.Field placeholder="moy-magazin" />
          <Input.Affix side="end">.shop.ru</Input.Affix>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Сумма платежа, ₽">
        <Input.Wrapper>
          <Input.Field placeholder="0,00" inputMode="decimal" />
          <Input.InlineAffix side="end">₽</Input.InlineAffix>
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
