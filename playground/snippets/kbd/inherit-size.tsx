import { Kbd } from "@/components/kbd/Kbd";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";

/** Без `size` Kbd берёт масштаб из ближайшего `ControlSizeProvider` (как у полей и кнопок); явный `size` перекрывает контекст. Для поверхности `xs` контекста применяется размер `s`. */
export default function KbdInheritSizeSnippet() {
  return (
    <>
      <ControlSizeProvider value="xl">
        <div className="row rowAlignCenter rowGapKbd">
          <Kbd.Root>Ctrl</Kbd.Root>
          <span aria-hidden="true">+</span>
          <Kbd.Root>B</Kbd.Root>
        </div>
      </ControlSizeProvider>
      <ControlSizeProvider value="s">
        <div className="row rowAlignCenter rowGapKbd">
          <Kbd.Root>Tab</Kbd.Root>
        </div>
      </ControlSizeProvider>
      <ControlSizeProvider value="xs">
        <div className="row rowAlignCenter rowGapKbd">
          <Kbd.Root>xs→s</Kbd.Root>
        </div>
      </ControlSizeProvider>
      <ControlSizeProvider value="xl">
        <Kbd.Root size="s">Явный s</Kbd.Root>
      </ControlSizeProvider>
    </>
  );
}
