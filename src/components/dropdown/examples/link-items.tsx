/** Items that navigate are real links: Cmd-click or the context menu opens them in a new tab, a plain pick closes the menu — `asChild`. */
import { Button, Dropdown, Icon } from "prime-ui-kit";

const LINKS = [
  { href: "#deal-1042", label: "Открыть сделку" },
  { href: "#client-nwind", label: "Карточка клиента" },
  { href: "#invoice-318", label: "Счёт №318" },
] as const;

export default function DropdownLinkItemsExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="ghost" tone="neutral" aria-label="Перейти">
          <Button.Icon>
            <Icon name="action.externalLink" />
          </Button.Icon>
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        {LINKS.map(({ href, label }) => (
          <Dropdown.Item key={href} asChild>
            <a href={href}>{label}</a>
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
