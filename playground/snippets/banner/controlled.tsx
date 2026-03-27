import { Info } from "lucide-react";
import { useState } from "react";

import { Banner } from "@/components/banner/Banner";
import { Button } from "@/components/button/Button";

/** Видимость баннера полностью из состояния родителя: снова показать кнопкой снаружи. */
export default function BannerControlledSnippet() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {!visible ? (
        <Button.Root size="s" type="button" variant="neutral" onClick={() => setVisible(true)}>
          Показать объявление
        </Button.Root>
      ) : null}
      {visible ? (
        <Banner.Root status="feature" variant="lighter">
          <Banner.Content>
            <Banner.Icon as={Info} aria-hidden />
            <Banner.Title>Контролируемое отображение</Banner.Title>
            <Banner.Description>
              Закрытие убирает узел из дерева; кнопка выше возвращает блок.
            </Banner.Description>
            <Banner.Actions>
              <Button.Root mode="ghost" size="s" type="button" variant="neutral">
                Подробнее
              </Button.Root>
              <Button.Root
                size="s"
                type="button"
                variant="primary"
                onClick={() => setVisible(false)}
              >
                Скрыть
              </Button.Root>
            </Banner.Actions>
          </Banner.Content>
        </Banner.Root>
      ) : null}
    </>
  );
}
