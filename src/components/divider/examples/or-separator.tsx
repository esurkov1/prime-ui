/** An "or" line between two ways to sign in, its label naming the separator — `Divider`. */
import { Button, Divider, Icon } from "prime-ui-kit";

export default function DividerOrSeparatorExample() {
  return (
    <>
      <Button.Root fullWidth>Войти</Button.Root>
      <Divider>или</Divider>
      <Button.Root variant="outline" tone="neutral" fullWidth>
        <Button.Icon>
          <Icon name="field.email" />
        </Button.Icon>
        Получить ссылку на почту
      </Button.Root>
    </>
  );
}
