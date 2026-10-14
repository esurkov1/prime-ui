/** The label at the start, the center or the end of the line; `start` heads a section — `align`. */
import { Divider } from "prime-ui-kit";

export default function DividerAlignExample() {
  return (
    <>
      <Divider align="start">Уведомления</Divider>
      <Divider>Сегодня</Divider>
      <Divider align="end">Конец истории</Divider>
    </>
  );
}
