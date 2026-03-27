import { Button } from "@/components/button/Button";

export default function ButtonVariantsModesSnippet() {
  return (
    <>
      <div className="row">
        <Button.Root variant="primary" mode="filled">
          Button primary filled
        </Button.Root>
        <Button.Root variant="primary" mode="stroke">
          Button primary stroke
        </Button.Root>
        <Button.Root variant="primary" mode="lighter">
          Button primary lighter
        </Button.Root>
        <Button.Root variant="primary" mode="ghost">
          Button primary ghost
        </Button.Root>
      </div>
      <div className="row">
        <Button.Root variant="neutral" mode="filled">
          Button neutral filled
        </Button.Root>
        <Button.Root variant="neutral" mode="stroke">
          Button neutral stroke
        </Button.Root>
        <Button.Root variant="neutral" mode="lighter">
          Button neutral lighter
        </Button.Root>
        <Button.Root variant="neutral" mode="ghost">
          Button neutral ghost
        </Button.Root>
      </div>
      <div className="row">
        <Button.Root variant="error" mode="filled">
          Button error filled
        </Button.Root>
        <Button.Root variant="error" mode="stroke">
          Button error stroke
        </Button.Root>
        <Button.Root variant="error" mode="lighter">
          Button error lighter
        </Button.Root>
        <Button.Root variant="error" mode="ghost">
          Button error ghost
        </Button.Root>
      </div>
      <div className="row">
        <Button.Root variant="neutral" mode="fancy">
          Fancy neutral
        </Button.Root>
        <Button.Root variant="primary" mode="fancy">
          Fancy primary
        </Button.Root>
        <Button.Root variant="error" mode="fancy">
          Fancy error
        </Button.Root>
      </div>
    </>
  );
}
