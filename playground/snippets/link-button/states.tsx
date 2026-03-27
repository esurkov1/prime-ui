import { LinkButton } from "@/components/link-button/LinkButton";

/** Обычная ссылка и недоступная: <code>disabled</code> рендерит span без <code>href</code>. */
export default function LinkButtonStatesSnippet() {
  return (
    <div className="row rowAlignCenter rowGapMedium">
      <LinkButton.Root href="#">Активная ссылка</LinkButton.Root>
      <LinkButton.Root href="#" disabled>
        Недоступная ссылка
      </LinkButton.Root>
    </div>
  );
}
