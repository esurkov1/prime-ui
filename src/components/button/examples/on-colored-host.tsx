/** Actions on a solid banner take its text color: a soft action and a ghost one beside it — `tone="inherit"`. */
import { Banner, Button } from "prime-ui-kit";

const HOSTS = [
  { tone: "accent", text: "Доступна новая версия редактора", action: "Обновить", later: "Позже" },
  { tone: "neutral", text: "Режим только для чтения", action: "Запросить доступ", later: "Скрыть" },
] as const;

export default function ButtonOnColoredHostExample() {
  return (
    <>
      {HOSTS.map(({ tone, text, action, later }) => (
        <Banner.Root key={text} variant="solid" tone={tone}>
          <Banner.Content>
            <Banner.Title>{text}</Banner.Title>
            <Banner.Actions>
              <Button.Root variant="soft" tone="inherit">
                {action}
              </Button.Root>
              <Button.Root variant="ghost" tone="inherit">
                {later}
              </Button.Root>
            </Banner.Actions>
          </Banner.Content>
        </Banner.Root>
      ))}
    </>
  );
}
