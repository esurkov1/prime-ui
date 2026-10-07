/** A row of segments and a column of related options — `orientation`. */
import { ButtonGroup } from "prime-ui-kit";

export default function ButtonGroupOrientationExample() {
  return (
    <>
      <ButtonGroup.Root aria-label="Сортировка заказов">
        <ButtonGroup.Item pressed>Новые</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>По сумме</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Старые</ButtonGroup.Item>
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Раздел настроек" orientation="vertical">
        <ButtonGroup.Item pressed>Профиль</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Безопасность</ButtonGroup.Item>
        <ButtonGroup.Item pressed={false}>Уведомления</ButtonGroup.Item>
      </ButtonGroup.Root>
    </>
  );
}
