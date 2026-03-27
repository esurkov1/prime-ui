import { Input } from "@/components/input/Input";
import { Icon } from "@/icons";

export default function InputStatesSnippet() {
  return (
    <>
      <Input.Root label="Обычное" hint="Подсказка под полем">
        <Input.Wrapper>
          <Input.Field placeholder="Введите значение" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Отключено">
        <Input.Wrapper>
          <Input.Field placeholder="Недоступно" disabled />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Только чтение">
        <Input.Wrapper>
          <Input.Field defaultValue="Только просмотр" readOnly />
          <Input.Icon side="end">
            <Icon name="status.locked" size="s" tone="subtle" />
          </Input.Icon>
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Обязательное" hint="Атрибут required на Input.Field">
        <Input.Wrapper>
          <Input.Field placeholder="Не оставляйте пустым" required />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root label="Ошибка" error="Исправьте значение и попробуйте снова">
        <Input.Wrapper>
          <Input.Field placeholder="Неверный формат" />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
