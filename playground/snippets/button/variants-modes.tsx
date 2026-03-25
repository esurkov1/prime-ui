import { Button } from "@/components/button/Button";

export default function ButtonVariantsModesSnippet() {
  return (
    <>
      <div className="row">
        <Button.Root variant="primary" mode="filled" size="m">
          Button primary filled
        </Button.Root>
        <Button.Root variant="primary" mode="stroke" size="m">
          Button primary stroke
        </Button.Root>
        <Button.Root variant="primary" mode="lighter" size="m">
          Button primary lighter
        </Button.Root>
        <Button.Root variant="primary" mode="ghost" size="m">
          Button primary ghost
        </Button.Root>
      </div>
      <div className="row">
        <Button.Root variant="neutral" mode="filled" size="m">
          Button neutral filled
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke" size="m">
          Button neutral stroke
        </Button.Root>
        <Button.Root variant="neutral" mode="lighter" size="m">
          Button neutral lighter
        </Button.Root>
        <Button.Root variant="neutral" mode="ghost" size="m">
          Button neutral ghost
        </Button.Root>
      </div>
      <div className="row">
        <Button.Root variant="error" mode="filled" size="m">
          Button error filled
        </Button.Root>
        <Button.Root variant="error" mode="stroke" size="m">
          Button error stroke
        </Button.Root>
        <Button.Root variant="error" mode="lighter" size="m">
          Button error lighter
        </Button.Root>
        <Button.Root variant="error" mode="ghost" size="m">
          Button error ghost
        </Button.Root>
      </div>
      <div className="row">
        <Button.Root variant="neutral" mode="fancy" size="m">
          Fancy neutral
        </Button.Root>
        <Button.Root variant="primary" mode="fancy" size="m">
          Fancy primary
        </Button.Root>
        <Button.Root variant="error" mode="fancy" size="m">
          Fancy error
        </Button.Root>
      </div>
    </>
  );
}
