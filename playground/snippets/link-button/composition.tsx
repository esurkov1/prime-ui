import { LinkButton } from "@/components/link-button/LinkButton";
import { Icon } from "@/icons";

/** Иконки внутри корня: размер берётся из <code>ControlSizeProvider</code> у <code>LinkButton.Root</code>. */
export default function LinkButtonCompositionSnippet() {
  return (
    <div className="row rowAlignCenter rowGapMedium">
      <LinkButton.Root href="#">
        <Icon surface="none" name="field.email" size="s" />
        Ссылка с иконкой слева
      </LinkButton.Root>
      <LinkButton.Root href="#">
        Иконка справа
        <Icon surface="none" name="action.close" size="s" />
      </LinkButton.Root>
      <LinkButton.Root href="#" aria-label="Открыть профиль">
        <Icon surface="none" name="field.email" size="s" />
      </LinkButton.Root>
    </div>
  );
}
