/** Related actions joined into one bar with a group name — `aria-label`. */
import { ButtonGroup } from "prime-ui-kit";

export default function ButtonGroupOverviewExample() {
  return (
    <ButtonGroup.Root aria-label="Экспорт отчёта">
      <ButtonGroup.Item>CSV</ButtonGroup.Item>
      <ButtonGroup.Item>Excel</ButtonGroup.Item>
      <ButtonGroup.Item>PDF</ButtonGroup.Item>
    </ButtonGroup.Root>
  );
}
