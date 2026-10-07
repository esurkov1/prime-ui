/** Every treatment on every tone: soft by default, solid for urgent, outline for calm — `variant`, `tone`. */
import { Banner, Icon, type IconName, Typography } from "prime-ui-kit";

const TONES: {
  tone: "info" | "success" | "warning" | "danger" | "accent" | "neutral";
  icon: IconName;
  title: string;
}[] = [
  { tone: "info", icon: "status.info", title: "Плановые работы" },
  { tone: "success", icon: "status.success", title: "Оплата прошла" },
  { tone: "warning", icon: "status.warning", title: "Квота почти исчерпана" },
  { tone: "danger", icon: "status.danger", title: "Склад не синхронизирован" },
  { tone: "accent", icon: "status.info", title: "Новое: экспорт в XLSX" },
  { tone: "neutral", icon: "status.info", title: "Рассылка отключена" },
];

const VARIANTS = ["soft", "solid", "outline"] as const;

export default function BannerVariantsExample() {
  return (
    <>
      {TONES.map(({ tone, icon, title }) => (
        <div key={tone}>
          {VARIANTS.map((variant) => (
            <div key={variant}>
              <Banner.Root variant={variant} tone={tone}>
                <Banner.Content>
                  <Banner.Icon>
                    <Icon name={icon} />
                  </Banner.Icon>
                  <Banner.Title>{title}</Banner.Title>
                </Banner.Content>
              </Banner.Root>
              <Typography as="span" variant="caption" tone="muted">
                {variant} · {tone}
              </Typography>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
