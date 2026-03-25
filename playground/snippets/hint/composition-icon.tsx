import { Hint } from "@/components/hint/Hint";
import { Icon } from "@/icons";

/** Слот `Hint.Icon` выравнивает иконку слева от текста; иконка скрыта от вспомогательных технологий. */
export default function HintCompositionIconSnippet() {
  return (
    <Hint.Root size="m">
      <Hint.Icon>
        <Icon name="field.email" tone="subtle" />
      </Hint.Icon>
      На этот адрес придёт код подтверждения.
    </Hint.Root>
  );
}
