import { Badge } from "@/components/badge/Badge";

/** Явный size: s → xl при variant light и color gray. */
export default function BadgeSizesSnippet() {
  return (
    <>
      <Badge.Root size="s" variant="light" color="gray">
        s
      </Badge.Root>
      <Badge.Root size="m" variant="light" color="gray">
        m
      </Badge.Root>
      <Badge.Root size="l" variant="light" color="gray">
        l
      </Badge.Root>
      <Badge.Root size="xl" variant="light" color="gray">
        xl
      </Badge.Root>
    </>
  );
}
