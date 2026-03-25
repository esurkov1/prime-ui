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
      <Input.Root size="m">
        <Input.Wrapper>
          <Input.Field name="query" placeholder="Запрос" />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root type="submit" variant="primary" mode="filled" size="m" fullWidth>
        Найти
      </Button.Root>
      <Button.Root type="reset" variant="neutral" mode="stroke" size="m" fullWidth>
        Очистить
      </Button.Root>
    </form>
  );
}
