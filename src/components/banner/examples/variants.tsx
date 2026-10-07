/** Three variants (`soft`, `solid`, `outline`) × all tones; with a description the title and text stack, without it the banner reads as one line. Use `soft` by default, `solid` for urgent, `outline` for calm notices. */
import { Bell, CircleAlert, CircleCheck, Info, Sparkles, TriangleAlert } from "lucide-react";
import { Banner, type BannerRootProps, LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const variants: { variant: NonNullable<BannerRootProps["variant"]>; note: string }[] = [
  { variant: "soft", note: "мягкая заливка тона, нейтральный текст (по умолчанию)" },
  { variant: "solid", note: "насыщенная заливка тона — срочное" },
  { variant: "outline", note: "заливка карточки с тонкой обводкой тона — спокойное" },
];

const tones: {
  tone: NonNullable<BannerRootProps["tone"]>;
  icon: typeof Info;
  title: string;
  description?: string;
}[] = [
  {
    tone: "info",
    icon: Info,
    title: "Плановые работы в ночь на субботу",
    description: "С 02:00 до 04:00 по Москве отчёты будут доступны только для чтения.",
  },
  { tone: "success", icon: CircleCheck, title: "Оплата прошла" },
  {
    tone: "warning",
    icon: TriangleAlert,
    title: "Пробный период закончится через 3 дня",
    description: "После этого создание новых отчётов будет недоступно.",
  },
  { tone: "danger", icon: CircleAlert, title: "Не удалось синхронизировать склад" },
  { tone: "accent", icon: Sparkles, title: "Новое: экспорт отчётов в XLSX" },
  { tone: "neutral", icon: Bell, title: "Уведомления по почте отключены" },
];

export default function BannerVariantsExample() {
  return (
    <div className={styles.sections}>
      {variants.map(({ variant, note }) => (
        <div key={variant} className={styles.group}>
          <Typography.Root variant="caption" tone="muted">
            <Typography.Root as="span" variant="code" tone="muted">
              variant="{variant}"
            </Typography.Root>{" "}
            — {note}
          </Typography.Root>
          <div className={styles.stack}>
            {tones.map(({ tone, icon, title, description }) => (
              <Banner.Root key={tone} variant={variant} tone={tone}>
                <Banner.Content>
                  <Banner.Icon as={icon} aria-hidden />
                  <Banner.Title>{title}</Banner.Title>
                  {description ? <Banner.Description>{description}</Banner.Description> : null}
                  {tone === "accent" && variant !== "solid" ? (
                    <Banner.Actions>
                      <LinkButton.Root href="#" size="s">
                        Подробнее
                      </LinkButton.Root>
                    </Banner.Actions>
                  ) : null}
                </Banner.Content>
              </Banner.Root>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
