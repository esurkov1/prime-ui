import * as React from "react";
import { Button } from "@/components/button/Button";
import { Tag } from "@/components/tag/Tag";

export default function TagRemovableSnippet() {
  const [withRemove, setWithRemove] = React.useState(true);

  return (
    <>
      {withRemove ? (
        <Tag.Root onRemove={() => setWithRemove(false)}>Dismiss me</Tag.Root>
      ) : (
        <Button.Root variant="neutral" mode="stroke" size="m" onClick={() => setWithRemove(true)}>
          Show tag again
        </Button.Root>
      )}
      <Tag.Root onRemove={() => undefined}>Static remove UI</Tag.Root>
    </>
  );
}
