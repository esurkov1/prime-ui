import { Info } from "lucide-react";

import { Banner } from "@/components/banner/Banner";

/** Четыре визуальных варианта при одном статусе `information`. */
export default function BannerVariantsSnippet() {
  return (
    <>
      <Banner.Root status="information" variant="filled">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>filled</Banner.Title>
          <Banner.Description>Плотная заливка и инверсный текст.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root status="information" variant="light">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>light</Banner.Title>
          <Banner.Description>Мягкий фон статуса.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root status="information" variant="lighter">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>lighter</Banner.Title>
          <Banner.Description>Смешение с поверхностью страницы.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root status="information" variant="stroke">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>stroke</Banner.Title>
          <Banner.Description>Подложка и цветная полоска снизу.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
    </>
  );
}
