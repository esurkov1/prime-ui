import { Checkbox } from "@/components/checkbox/Checkbox";

export default function CheckboxCompositionSnippet() {
  return (
    <>
      <Checkbox.Root>
        <Checkbox.Label>Подпись и подсказка ниже</Checkbox.Label>
        <Checkbox.Hint>
          Текст подсказки смещён под колонку подписи, как у полей ввода.
        </Checkbox.Hint>
      </Checkbox.Root>
      <Checkbox.Root>
        <Checkbox.Label>Сообщение об ошибке без variant на корне</Checkbox.Label>
        <Checkbox.Error>Укажите согласие, чтобы продолжить.</Checkbox.Error>
      </Checkbox.Root>
      <Checkbox.Root variant="error">
        <Checkbox.Label>Согласие на обработку персональных данных</Checkbox.Label>
        <Checkbox.Hint>Нужно для оформления заказа и доставки.</Checkbox.Hint>
        <Checkbox.Error>Отметьте пункт, иначе отправить форму нельзя.</Checkbox.Error>
      </Checkbox.Root>
    </>
  );
}
