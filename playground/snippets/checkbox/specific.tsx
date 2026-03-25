import { Checkbox } from "@/components/checkbox/Checkbox";

export default function CheckboxSpecificSnippet() {
  return (
    <>
      <Checkbox.Root size="m" aria-label="Получать дайджест по почте, без видимой подписи">
        <Checkbox.Label />
      </Checkbox.Root>
      <Checkbox.Root
        size="m"
        name="newsletter"
        value="weekly"
        defaultChecked
        aria-label="Подписка на еженедельную рассылку"
      >
        <Checkbox.Label />
      </Checkbox.Root>
    </>
  );
}
