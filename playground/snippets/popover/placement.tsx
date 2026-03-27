import { Button } from "@/components/button/Button";
import { Popover } from "@/components/popover/Popover";

import preview from "./preview.module.css";

type Demo = { label: string; side: "top" | "bottom"; align: "start" | "center" | "end" };

const demos: Demo[] = [
  { label: "Снизу · start", side: "bottom", align: "start" },
  { label: "Снизу · center", side: "bottom", align: "center" },
  { label: "Снизу · end", side: "bottom", align: "end" },
  { label: "Сверху · start", side: "top", align: "start" },
];

export default function PopoverPlacementSnippet() {
  return (
    <div className={preview.placementGrid}>
      {demos.map(({ label, side, align }) => (
        <Popover.Root key={label}>
          <Popover.Trigger asChild>
            <Button.Root className={preview.placementTrigger} mode="stroke" variant="neutral">
              {label}
            </Button.Root>
          </Popover.Trigger>
          <Popover.Content align={align} side={side}>
            <p className={preview.panelTextMuted}>
              <code>side=&quot;{side}&quot;</code>, <code>align=&quot;{align}&quot;</code>. У края
              окна позиция может перевернуться (flip).
            </p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
