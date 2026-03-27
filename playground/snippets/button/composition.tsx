import { Button } from "@/components/button/Button";
import { Icon } from "@/icons";

/** Первый ряд — primary; второй — neutral stroke. Иконка слева, справа, только иконка. */
export default function ButtonCompositionSnippet() {
  return (
    <>
      <div className="row">
        <Button.Root variant="primary" mode="filled">
          <Button.Icon>
            <Icon surface="none" name="field.email" size="s" />
          </Button.Icon>
          Button primary icon left
        </Button.Root>
        <Button.Root variant="primary" mode="filled">
          Button primary icon right
          <Button.Icon>
            <Icon surface="none" name="action.close" size="s" />
          </Button.Icon>
        </Button.Root>
        <Button.Root variant="primary" mode="filled" aria-label="Button primary icon only">
          <Button.Icon>
            <Icon surface="none" name="action.close" size="s" />
          </Button.Icon>
        </Button.Root>
      </div>
      <div className="row">
        <Button.Root variant="neutral" mode="stroke">
          <Button.Icon>
            <Icon surface="none" name="field.email" size="s" tone="subtle" />
          </Button.Icon>
          Button icon left
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke">
          Button icon right
          <Button.Icon>
            <Icon surface="none" name="action.close" size="s" tone="subtle" />
          </Button.Icon>
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke" aria-label="Button icon only">
          <Button.Icon>
            <Icon surface="none" name="action.close" size="s" tone="subtle" />
          </Button.Icon>
        </Button.Root>
      </div>
    </>
  );
}
