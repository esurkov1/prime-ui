/** Every tier on its own frame step: padding, radius, mark and text roles grow with it — `size`. */
import { Banner, Icon, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function BannerSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <Banner.Root size={size}>
              <Banner.Content>
                <Banner.Icon>
                  <Icon name="status.info" />
                </Banner.Icon>
                <Banner.Title>Доступен новый отчёт</Banner.Title>
                <Banner.Description>Описание на ступень мельче заголовка.</Banner.Description>
              </Banner.Content>
            </Banner.Root>
            <Typography as="span" variant="caption" tone="muted">
              {size}
            </Typography>
          </div>
        </div>
      ))}
    </>
  );
}
