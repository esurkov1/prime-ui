import { Package } from "lucide-react";

import { Banner } from "@/components/banner/Banner";
import { Button } from "@/components/button/Button";
import { LinkButton } from "@/components/link-button/LinkButton";

/** Слоты: иконка через `as`, заголовок, описание, действия (кнопка и ссылка-кнопка). */
export default function BannerCompositionSnippet() {
  return (
    <Banner.Root status="information" variant="stroke" size="l">
      <Banner.Content>
        <Banner.Icon as={Package} aria-hidden />
        <Banner.Title>Отправление готово к выдаче</Banner.Title>
        <Banner.Description>
          Заказ № 4821 упакован. Курьер приедет в выбранный интервал; изменить адрес можно до 18:00.
        </Banner.Description>
        <Banner.Actions>
          <LinkButton.Root href="#" size="s">
            Отследить
          </LinkButton.Root>
          <Button.Root mode="ghost" size="s" type="button" variant="neutral">
            Изменить доставку
          </Button.Root>
        </Banner.Actions>
      </Banner.Content>
    </Banner.Root>
  );
}
