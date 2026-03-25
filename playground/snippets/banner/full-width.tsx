import { Info } from "lucide-react";

import { Banner } from "@/components/banner/Banner";

/**
 * Корень баннера тянется на ширину родителя (`width: 100%` в стилях).
 * Узкий контейнер показывает заполнение колонки карточки или боковой панели.
 */
export default function BannerFullWidthSnippet() {
  return (
    <div
      style={{
        maxWidth: 420,
        padding: 12,
        borderRadius: 8,
        border: "1px dashed var(--prime-sys-color-border-default, #ccc)",
      }}
    >
      <Banner.Root status="warning" variant="light" size="m">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>Узкая колонка</Banner.Title>
          <Banner.Description>
            Баннер занимает всю доступную ширину этой области.
          </Banner.Description>
        </Banner.Content>
      </Banner.Root>
    </div>
  );
}
