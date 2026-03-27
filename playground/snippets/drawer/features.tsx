import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";

import styles from "./features.module.css";

export default function DrawerFeaturesSnippet() {
  const [portalHost, setPortalHost] = React.useState<HTMLDivElement | null>(null);

  return (
    <div className="stack">
      <div ref={setPortalHost} className={styles.portalHost}>
        <p className={styles.portalHint}>
          Узел для <code>Drawer.Portal</code> с пропом <code>container</code>: портал монтируется в
          заданный DOM-элемент.
        </p>
        {portalHost ? (
          <Drawer.Root>
            <Drawer.Trigger>
              <Button.Root variant="neutral" mode="stroke">
                Портал в контейнер
              </Button.Root>
            </Drawer.Trigger>
            <Drawer.Portal container={portalHost}>
              <Drawer.Overlay />
              <Drawer.Content aria-label="Служебная панель без видимого заголовка в разметке шапки">
                <Drawer.Header showCloseButton={false} />
                <Drawer.Body>
                  <p>
                    Для доступности задан только <code>aria-label</code> на{" "}
                    <code>Drawer.Content</code>
                    (без связки <code>aria-labelledby</code> с заголовком).
                  </p>
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.Close>
                    <Button.Root variant="primary">Закрыть</Button.Root>
                  </Drawer.Close>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        ) : null}
      </div>

      <Drawer.Root>
        <Drawer.Trigger>
          <Button.Root variant="neutral" mode="stroke">
            Длинное содержимое с прокруткой
          </Button.Root>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content side="right" aria-labelledby="drawer-feat-scroll-title">
            <Drawer.Header>
              <Drawer.Title id="drawer-feat-scroll-title">Прокрутка внутри панели</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className={styles.bodyScroll}>
              {[
                "Пункт A: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт B: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт C: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт D: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт E: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт F: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт G: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт H: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт I: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт J: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт K: текст для проверки прокрутки при заблокированном фоне страницы.",
                "Пункт L: текст для проверки прокрутки при заблокированном фоне страницы.",
              ].map((line) => (
                <p key={line} className={styles.scrollLine}>
                  {line}
                </p>
              ))}
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close>
                <Button.Root variant="primary">Закрыть</Button.Root>
              </Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
