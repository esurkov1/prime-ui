import * as React from "react";

import { Button } from "@/components/button/Button";
import { Drawer } from "@/components/drawer/Drawer";
import { Icon } from "@/icons";

import styles from "./features.module.css";

export default function DrawerFeaturesSnippet() {
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openScroll, setOpenScroll] = React.useState(false);

  return (
    <div className="stack">
      <div className={styles.portalHost}>
        <p className={styles.portalHint}>
          Шапка Drawer всегда включает иконку, title и optional description.
        </p>
        <Button.Root variant="neutral" mode="stroke" onClick={() => setOpenInfo(true)}>
          Шапка с описанием
        </Button.Root>
        <Drawer
          open={openInfo}
          onOpenChange={setOpenInfo}
          title="Служебная панель"
          description="ARIA-связка между title и description выставляется автоматически"
          icon={<Icon name="nav.layoutGrid" tone="subtle" />}
          footer={
            <Button.Root variant="primary" onClick={() => setOpenInfo(false)}>
              Закрыть
            </Button.Root>
          }
        >
          <p>Текст в body прокручивается независимо от шапки и футера.</p>
        </Drawer>
      </div>

      <Button.Root variant="neutral" mode="stroke" onClick={() => setOpenScroll(true)}>
        Длинное содержимое с прокруткой
      </Button.Root>
      <Drawer
        open={openScroll}
        onOpenChange={setOpenScroll}
        side="right"
        title="Прокрутка внутри панели"
        description="Фон заблокирован, скролл только в области body"
        icon={<Icon name="nav.home" tone="subtle" />}
        footer={
          <Button.Root variant="primary" onClick={() => setOpenScroll(false)}>
            Закрыть
          </Button.Root>
        }
      >
        <div className={styles.bodyScroll}>
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
        </div>
      </Drawer>
    </div>
  );
}
