import { Input } from "prime-ui-kit";

/**
 * Блочные аффиксы для URL и инлайн-символ валюты — как в playground `composition.tsx`.
 */
export default function AffixUrlAndAmountExample() {
  return (
    <>
      <Input.Root label="Сайт" hint="Поддомен без схемы">
        <Input.Wrapper>
          <Input.Affix side="start">https://</Input.Affix>
          <Input.Field placeholder="поддомен" />
          <Input.Affix side="end">.example</Input.Affix>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Сумма" hint="Дробная часть через запятую">
        <Input.Wrapper>
          <Input.InlineAffix side="start">₽</Input.InlineAffix>
          <Input.Field placeholder="0,00" inputMode="decimal" />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
