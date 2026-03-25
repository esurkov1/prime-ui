import { Badge } from "@/components/badge/Badge";
import { Icon } from "@/icons";

export default function BadgeDotIconSnippet() {
  return (
    <div className="row">
      <Badge.Root color="green" variant="light" size="m">
        <Badge.Dot />
        Live
      </Badge.Root>
      <Badge.Root color="purple" variant="stroke" size="m">
        <Badge.Icon>
          <Icon name="status.locked" />
        </Badge.Icon>
        Secured
      </Badge.Root>
    </div>
  );
}
