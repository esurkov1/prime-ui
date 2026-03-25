import { Button } from "@/components/button/Button";
import { Icon } from "@/icons";

/**
 * asChild передаёт все пропсы Button.Root дочернему элементу.
 * <a> получает className, data-*, aria-*, обработчики — и при этом
 * остаётся настоящей ссылкой для браузера и скринридеров.
 */
export default function ButtonAsChildSnippet() {
  return (
    <>
      <div className="row">
        <Button.Root asChild variant="primary" mode="filled" size="m">
          <a href="/dashboard">Перейти</a>
        </Button.Root>

        <Button.Root asChild variant="neutral" mode="stroke" size="m">
          <a href="/next-step">
            <Button.Icon>
              <Icon name="nav.chevronRight" size="s" tone="subtle" />
            </Button.Icon>
            Далее
          </a>
        </Button.Root>

        <Button.Root asChild variant="neutral" mode="ghost" size="m">
          <a href="/settings">Настройки</a>
        </Button.Root>
      </div>

      <div className="row">
        <Button.Root asChild variant="primary" mode="filled" size="m" disabled>
          <a href="/forbidden">Нет доступа</a>
        </Button.Root>

        <Button.Root asChild variant="neutral" mode="stroke" size="m" disabled>
          <a href="/disabled">Отключено</a>
        </Button.Root>
      </div>
    </>
  );
}
