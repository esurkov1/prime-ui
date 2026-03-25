import { Info } from "lucide-react";

import { Banner } from "@/components/banner/Banner";

/** Четыре размера — по одному баннеру на строку, `variant="light"` и `status="information"`. */
export default function BannerSizesSnippet() {
  return (
    <>
      <Banner.Root size="s" status="information" variant="light">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>Размер s</Banner.Title>
          <Banner.Description>Текст и отступы из яруса control-s.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root size="m" status="information" variant="light">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>Размер m</Banner.Title>
          <Banner.Description>
            Текст и отступы из яруса control-m (значение по умолчанию).
          </Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root size="l" status="information" variant="light">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>Размер l</Banner.Title>
          <Banner.Description>Текст и отступы из яруса control-l.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
      <Banner.Root size="xl" status="information" variant="light">
        <Banner.Content>
          <Banner.Icon as={Info} aria-hidden />
          <Banner.Title>Размер xl</Banner.Title>
          <Banner.Description>Текст и отступы из яруса control-xl.</Banner.Description>
        </Banner.Content>
      </Banner.Root>
    </>
  );
}
