import { Avatar } from "@/components/avatar/Avatar";
import { Button } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";

import {
  AvatarRowsDemoActions,
  AvatarRowsDemoHint,
  AvatarRowsDemoRoot,
  AvatarRowsDemoRow,
  AvatarRowsDemoTitle,
  AvatarRowsDemoTitleBlock,
} from "../../components/AvatarRowsDemo/AvatarRowsDemo";

export default function FileUploadAvatarRowsSnippet() {
  return (
    <AvatarRowsDemoRoot>
      <AvatarRowsDemoRow
        avatar={
          <Avatar.Root size="xl">
            <Avatar.Fallback>U</Avatar.Fallback>
          </Avatar.Root>
        }
      >
        <AvatarRowsDemoTitleBlock>
          <AvatarRowsDemoTitle>Upload image</AvatarRowsDemoTitle>
          <AvatarRowsDemoHint>Min 400×400px, PNG or JPEG</AvatarRowsDemoHint>
        </AvatarRowsDemoTitleBlock>
        <AvatarRowsDemoActions>
          <Button.Root size="s" variant="neutral" mode="stroke">
            Upload
          </Button.Root>
        </AvatarRowsDemoActions>
      </AvatarRowsDemoRow>

      <Divider.Root />

      <AvatarRowsDemoRow
        avatar={
          <Avatar.Root size="xl">
            <Avatar.Image
              src="https://picsum.photos/seed/profile-preview/96/96"
              alt="Предпросмотр"
            />
            <Avatar.Fallback>E</Avatar.Fallback>
          </Avatar.Root>
        }
      >
        <AvatarRowsDemoTitleBlock>
          <AvatarRowsDemoTitle>Upload image</AvatarRowsDemoTitle>
          <AvatarRowsDemoHint>Min 400×400px, PNG or JPEG</AvatarRowsDemoHint>
        </AvatarRowsDemoTitleBlock>
        <AvatarRowsDemoActions>
          <Button.Root size="s" variant="error" mode="stroke">
            Remove
          </Button.Root>
          <Button.Root size="s" variant="neutral" mode="stroke">
            Change
          </Button.Root>
        </AvatarRowsDemoActions>
      </AvatarRowsDemoRow>
    </AvatarRowsDemoRoot>
  );
}
