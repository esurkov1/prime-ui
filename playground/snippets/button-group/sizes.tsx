import { ButtonGroup } from "@/components/button-group/ButtonGroup";

/**
 * Четыре размера — s, m, l, xl; у каждого размера своя строка.
 * У каждого размера одна настоящая группа из нескольких сегментов, а не одна «кнопка».
 */
export default function ButtonGroupSizesSnippet() {
  return (
    <>
      <ButtonGroup.Root aria-label="Группа, размер s" size="s">
        <ButtonGroup.Item type="button">Сегмент A</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Сегмент B</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Сегмент C</ButtonGroup.Item>
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Группа, размер m" size="m">
        <ButtonGroup.Item type="button">Сегмент A</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Сегмент B</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Сегмент C</ButtonGroup.Item>
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Группа, размер l" size="l">
        <ButtonGroup.Item type="button">Сегмент A</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Сегмент B</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Сегмент C</ButtonGroup.Item>
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Группа, размер xl" size="xl">
        <ButtonGroup.Item type="button">Сегмент A</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Сегмент B</ButtonGroup.Item>
        <ButtonGroup.Item type="button">Сегмент C</ButtonGroup.Item>
      </ButtonGroup.Root>
    </>
  );
}
