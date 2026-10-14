/** A ring on a colored host takes the host's text color — `tone`. */
import { Banner, ProgressCircle } from "prime-ui-kit";

export default function ProgressCircleOnColorExample() {
  return (
    <Banner.Root variant="solid" tone="info">
      <Banner.Content>
        <Banner.Icon>
          <ProgressCircle size="xs" value={64} tone="inherit" aria-label="Экспорт отчёта" />
        </Banner.Icon>
        <Banner.Title>Экспорт отчёта за квартал</Banner.Title>
        <Banner.Description>Готово 64%, файл придёт на почту.</Banner.Description>
      </Banner.Content>
    </Banner.Root>
  );
}
