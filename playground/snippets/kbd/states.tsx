import { Kbd } from "@/components/kbd/Kbd";

/**
 * Отдельных пропов `disabled` / `loading` у Kbd нет: это подпись клавиши.
 * Через разметку можно передать обычные атрибуты элемента, например `title` для нативной подсказки.
 */
export default function KbdStatesSnippet() {
  return (
    <div className="row rowAlignCenter rowGapKbd">
      <Kbd.Root>Enter</Kbd.Root>
      <Kbd.Root title="Сохранить и закрыть">Ctrl+Enter</Kbd.Root>
    </div>
  );
}
