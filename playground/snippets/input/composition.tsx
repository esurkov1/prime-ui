import { Input } from "@/components/input/Input";
import { Icon } from "@/icons";

export default function InputCompositionSnippet() {
  return (
    <>
      <Input.Root size="m" hint="Иконка слева: Input.Icon side=&quot;start&quot;">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon name="field.email" size="s" tone="subtle" />
          </Input.Icon>
          <Input.Field placeholder="Электронная почта" type="email" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root size="m" hint="Иконка справа: Input.Icon side=&quot;end&quot;">
        <Input.Wrapper>
          <Input.Field placeholder="Пароль" type="password" />
          <Input.Icon side="end">
            <Icon name="status.locked" size="s" tone="subtle" />
          </Input.Icon>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root size="m" hint="Блочные аффиксы: Input.Affix (отдельные секции с фоном)">
        <Input.Wrapper>
          <Input.Affix side="start">https://</Input.Affix>
          <Input.Field placeholder="поддомен" />
          <Input.Affix side="end">.example</Input.Affix>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root size="m" hint="Инлайн-аффикс: Input.InlineAffix в строке с текстом поля">
        <Input.Wrapper>
          <Input.InlineAffix side="start">₽</Input.InlineAffix>
          <Input.Field placeholder="0,00" inputMode="decimal" />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
