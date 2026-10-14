/** A filter list that stays open while the person looks beside it: only Escape, the trigger or Tab close it — `closeOnOutsideClick`, `closeOnEscape`. */
import { Select } from "prime-ui-kit";

export default function SelectDismissExample() {
  return (
    <Select.Root
      label="Статусы заказов"
      multiple
      defaultValue={["new", "paid"]}
      placeholder="Все статусы"
      closeOnOutsideClick={false}
      closeOnEscape
    >
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="new">Новый</Select.Item>
        <Select.Item value="paid">Оплачен</Select.Item>
        <Select.Item value="shipped">Отгружен</Select.Item>
        <Select.Item value="delivered">Доставлен</Select.Item>
        <Select.Item value="cancelled">Отменён</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
