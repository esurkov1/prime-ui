import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";

/** Нативная форма: отправка через type="submit", сброс полей через type="reset". */
export default function ButtonFormTypesSnippet() {
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Input.Root>
        <Input.Wrapper>
          <Input.Field name="query" placeholder="Запрос" />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root type="submit" variant="primary" mode="filled" fullWidth>
        Найти
      </Button.Root>
      <Button.Root type="reset" variant="neutral" mode="stroke" fullWidth>
        Очистить
      </Button.Root>
    </form>
  );
}
