import { Badge } from "@/components/badge/Badge";

export default function BadgeDisabledSnippet() {
  return (
    <div className="row rowGapTight">
      <Badge.Root disabled color="red" variant="filled">
        filled
      </Badge.Root>
      <Badge.Root disabled color="gray" variant="stroke">
        stroke
      </Badge.Root>
      <Badge.Root disabled variant="status" status="online" label="Статус выключен">
        status
      </Badge.Root>
    </div>
  );
}
