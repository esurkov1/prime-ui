import { Badge } from "@/components/badge/Badge";
import { Icon } from "@/icons";

export default function BadgeIconsSnippet() {
  return (
    <div className="column">
      <div className="row">
        <Badge.Root color="blue" variant="light" size="s">
          <Badge.Icon>
            <Icon name="field.email" />
          </Badge.Icon>
          Email
        </Badge.Root>
        <Badge.Root color="blue" variant="light">
          <Badge.Icon>
            <Icon name="field.email" />
          </Badge.Icon>
          Email
        </Badge.Root>
        <Badge.Root color="blue" variant="light" size="l">
          <Badge.Icon>
            <Icon name="field.email" />
          </Badge.Icon>
          Email
        </Badge.Root>
        <Badge.Root color="blue" variant="light" size="xl">
          <Badge.Icon>
            <Icon name="field.email" />
          </Badge.Icon>
          Email
        </Badge.Root>
      </div>

      <div className="row">
        <Badge.Root color="green" variant="filled">
          <Badge.Icon>
            <Icon name="status.locked" />
          </Badge.Icon>
          Secured
        </Badge.Root>
        <Badge.Root color="purple" variant="stroke">
          <Badge.Icon>
            <Icon name="action.upload" />
          </Badge.Icon>
          Upload
        </Badge.Root>
        <Badge.Root color="orange" variant="lighter">
          <Badge.Icon>
            <Icon name="nav.home" />
          </Badge.Icon>
          Home
        </Badge.Root>
      </div>

      <div className="row">
        <Badge.Root color="sky" variant="light">
          <Badge.Icon>
            <Icon name="action.copy" />
          </Badge.Icon>
        </Badge.Root>
        <Badge.Root color="teal" variant="light">
          <Badge.Icon>
            <Icon name="nav.layoutGrid" />
          </Badge.Icon>
        </Badge.Root>
        <Badge.Root color="pink" variant="filled">
          <Badge.Icon>
            <Icon name="theme.light" />
          </Badge.Icon>
        </Badge.Root>
      </div>

      <div className="row">
        <Badge.Root color="red" variant="light">
          New
          <Badge.Icon>
            <Icon name="nav.chevronRight" />
          </Badge.Icon>
        </Badge.Root>
        <Badge.Root color="purple" variant="stroke">
          <Badge.Dot />
          <Badge.Icon>
            <Icon name="status.locked" />
          </Badge.Icon>
          Protected
        </Badge.Root>
      </div>
    </div>
  );
}
