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
        <Button.Root asChild variant="primary" mode="filled">
          <a href="/dashboard">Перейти</a>
        </Button.Root>

        <Button.Root asChild variant="neutral" mode="stroke">
          <a href="/next-step">
            <Button.Icon>
              <Icon surface="none" name="nav.chevronRight" size="s" tone="subtle" />
            </Button.Icon>
            Далее
          </a>
        </Button.Root>

        <Button.Root asChild variant="neutral" mode="ghost">
          <a href="/settings">Настройки</a>
        </Button.Root>
      </div>

      <div className="row">
        <Button.Root asChild variant="primary" mode="filled" disabled>
          <a href="/forbidden">Нет доступа</a>
        </Button.Root>

        <Button.Root asChild variant="neutral" mode="stroke" disabled>
          <a href="/disabled">Отключено</a>
        </Button.Root>
      </div>
    </>
  );
}
