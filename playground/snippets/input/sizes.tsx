import { Input } from "@/components/input/Input";
import { Icon } from "@/icons";

export default function InputSizesSnippet() {
  return (
    <>
      <Input.Root size="s" hint="size=&quot;s&quot;">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon surface="none" name="field.email" size="s" tone="subtle" />
          </Input.Icon>
          <Input.Field placeholder="Почта" type="email" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root size="m" hint="size=&quot;m&quot; (по умолчанию)">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon surface="none" name="field.email" size="s" tone="subtle" />
          </Input.Icon>
          <Input.Field placeholder="Почта" type="email" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root size="l" hint="size=&quot;l&quot;">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon surface="none" name="field.email" size="s" tone="subtle" />
          </Input.Icon>
          <Input.Field placeholder="Почта" type="email" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root size="xl" hint="size=&quot;xl&quot;">
        <Input.Wrapper>
          <Input.Icon side="start">
            <Icon surface="none" name="field.email" size="s" tone="subtle" />
          </Input.Icon>
          <Input.Field placeholder="Почта" type="email" />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
