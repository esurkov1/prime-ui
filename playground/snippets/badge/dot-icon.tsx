import { Badge } from "@/components/badge/Badge";
import { Icon } from "@/icons";

export default function BadgeDotIconSnippet() {
  return (
    <div className="row">
      <Badge.Root color="green" variant="light">
        <Badge.Dot />
        Live
      </Badge.Root>
      <Badge.Root color="purple" variant="stroke">
        <Badge.Icon>
          <Icon surface="none" name="status.locked" />
        </Badge.Icon>
        Secured
      </Badge.Root>
    </div>
  );
}
