import { Input } from "@/components/input/Input";

export default function InputFeaturesSnippet() {
  return (
    <>
      <Input.Root
        id="delivery-phone"
        size="m"
        label="Телефон для курьера"
        optionalLabel="по желанию"
        hint="Стабильный id на Root — удобно для тестов и связки с внешними подсказками."
      >
        <Input.Wrapper>
          <Input.Field type="tel" autoComplete="tel" placeholder="+7 …" name="phone" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root
        size="m"
        label="Промокод"
        hint="Одновременно hint и error: при ошибке визуально включается hasError."
        error="Промокод недействителен или срок истёк"
      >
        <Input.Wrapper>
          <Input.Field placeholder="Введите код" defaultValue="SAVE50" />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
