import { Kbd } from "@/components/kbd/Kbd";

/** Номинальные размеры `s`–`xl` (ритм как у полей ввода; визуально компактнее кнопки того же имени). */
export default function KbdSizesSnippet() {
  return (
    <div className="row rowAlignCenter rowGapKbd">
      <Kbd.Root size="s">Kbd s</Kbd.Root>
      <Kbd.Root size="m">Kbd m</Kbd.Root>
      <Kbd.Root size="l">Kbd l</Kbd.Root>
      <Kbd.Root size="xl">Kbd xl</Kbd.Root>
    </div>
  );
}
