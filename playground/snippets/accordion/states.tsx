import { Accordion } from "@/components/accordion/Accordion";

import styles from "./accordion-demos.module.css";

export default function AccordionStatesSnippet() {
  return (
    <div className="stack">
      <div>
        <p className={`previewCaption ${styles.captionSpacer}`}>
          Пункт с <code>disabled</code> на <code>Accordion.Item</code> не раскрывается и визуально
          приглушён.
        </p>
        <Accordion.Root type="single" size="m" className="accordionDemo">
          <Accordion.Item value="a">
            <Accordion.Header>
              <Accordion.Trigger>
                Профиль
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Личные данные и аватар.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="b" disabled>
            <Accordion.Header>
              <Accordion.Trigger>
                Корпоративная политика
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Недоступно для текущей роли.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="c">
            <Accordion.Header>
              <Accordion.Trigger>
                Оплата
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Карты и история платежей.</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      <div>
        <p className={`previewCaption ${styles.captionSpacer}`}>
          Стартовое раскрытие через <code>defaultValue</code> (неконтролируемый режим).
        </p>
        <Accordion.Root type="single" size="m" defaultValue="open-first" className="accordionDemo">
          <Accordion.Item value="open-first">
            <Accordion.Header>
              <Accordion.Trigger>
                Безопасность
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Двухфакторная защита включена.</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="closed">
            <Accordion.Header>
              <Accordion.Trigger>
                Уведомления
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Настройте каналы связи.</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      <div>
        <p className={`previewCaption ${styles.captionSpacer}`}>
          <code>collapsible={"{false}"}</code> в режиме <code>single</code> — открытый пункт нельзя
          закрыть повторным нажатием (всегда остаётся один открытый).
        </p>
        <Accordion.Root
          type="single"
          collapsible={false}
          size="m"
          defaultValue="always"
          className="accordionDemo"
        >
          <Accordion.Item value="always">
            <Accordion.Header>
              <Accordion.Trigger>
                Обязательный раздел
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              Пользователь переключается на другие пункты, но не «сворачивает всё».
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="other">
            <Accordion.Header>
              <Accordion.Trigger>
                Дополнительно
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Вторичная информация.</Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}
