/** A maintenance notice: icon, title and description on a soft info fill. */
import { Banner, Icon } from "prime-ui-kit";

export default function BannerOverviewExample() {
  return (
    <Banner.Root>
      <Banner.Content>
        <Banner.Icon>
          <Icon name="status.info" />
        </Banner.Icon>
        <Banner.Title>Плановые работы в ночь на субботу</Banner.Title>
        <Banner.Description>
          С 02:00 до 04:00 по Москве отчёты будут доступны только для чтения.
        </Banner.Description>
      </Banner.Content>
    </Banner.Root>
  );
}
