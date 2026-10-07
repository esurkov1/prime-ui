/** A plain segment, a pressed segment and a disabled segment. Use to see the hover, selected and disabled looks. */
import { ButtonGroup } from "prime-ui-kit";

export default function ButtonGroupStatesExample() {
  return (
    <ButtonGroup.Root aria-label="Статус задачи">
      <ButtonGroup.Item>Открыта</ButtonGroup.Item>
      <ButtonGroup.Item pressed>В работе</ButtonGroup.Item>
      <ButtonGroup.Item disabled>Архив</ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
