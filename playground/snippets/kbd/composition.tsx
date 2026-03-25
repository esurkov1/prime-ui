import { Kbd } from "@/components/kbd/Kbd";
import { Icon } from "@/icons";

/** Сочетание из нескольких `Kbd.Root` и один бейдж с иконкой и подписью внутри. */
export default function KbdCompositionSnippet() {
  return (
    <>
      <div className="row rowAlignCenter rowGapKbd">
        <Kbd.Root>⌘</Kbd.Root>
        <span aria-hidden="true">+</span>
        <Kbd.Root>K</Kbd.Root>
      </div>
      <div className="row rowAlignCenter rowGapKbd">
        <Kbd.Root size="m">
          <Icon name="action.close" aria-hidden />
          <span>Esc</span>
        </Kbd.Root>
      </div>
    </>
  );
}
