import { ButtonGroup } from "@/components/button-group/ButtonGroup";

/**
 * У корня — `className` с шириной контейнера; сегменты делят место через `flex-1`
 * (отдельного пропа full width у группы нет).
 */
export default function ButtonGroupFullWidthSnippet() {
  return (
    <div className="w-full max-w-md">
      <ButtonGroup.Root aria-label="Тариф" className="w-full">
        <ButtonGroup.Item className="min-w-0 flex-1" type="button">
          Базовый
        </ButtonGroup.Item>
        <ButtonGroup.Item className="min-w-0 flex-1" pressed type="button">
          Про
        </ButtonGroup.Item>
        <ButtonGroup.Item className="min-w-0 flex-1" type="button">
          Бизнес
        </ButtonGroup.Item>
      </ButtonGroup.Root>
    </div>
  );
}
