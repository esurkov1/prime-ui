import { Badge } from "@/components/badge/Badge";

export default function BadgeDisabledSnippet() {
  return (
    <div className="row rowGapTight">
      <Badge.Root disabled color="red" variant="filled" size="m">
        filled
      </Badge.Root>
      <Badge.Root disabled color="gray" variant="stroke" size="m">
        stroke
      </Badge.Root>
      <Badge.Root disabled variant="status" status="online" label="Статус выключен" size="m">
        status
      </Badge.Root>
    </div>
  );
}
