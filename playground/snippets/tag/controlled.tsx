import * as React from "react";
import { Button } from "@/components/button/Button";
import { Tag } from "@/components/tag/Tag";

const INITIAL = ["Фото", "Видео", "Документы"] as const;

export default function TagControlledSnippet() {
  const [active, setActive] = React.useState<string[]>([...INITIAL]);

  return (
    <div className="row rowGapTight rowAlignCenter">
      {active.map((label) => (
        <Tag.Root key={label} onRemove={() => setActive((prev) => prev.filter((x) => x !== label))}>
          {label}
        </Tag.Root>
      ))}
      {active.length === 0 ? (
        <Button.Root variant="neutral" mode="stroke" onClick={() => setActive([...INITIAL])}>
          Сбросить фильтры
        </Button.Root>
      ) : null}
    </div>
  );
}
