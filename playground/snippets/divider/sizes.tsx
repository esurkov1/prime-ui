import { Divider } from "@/components/divider/Divider";

import s from "./divider-demos.module.css";

/** Размеры разделителя в реальном контексте: секции настроек с разными уровнями иерархии. */
export default function DividerSizesSnippet() {
  return (
    <div className={s.settingsPanel}>
      <Divider.Root variant="text" size="xl">
        Настройки профиля
      </Divider.Root>
      <div className={s.inset}>
        <p className={s.paragraphSecondary}>Имя: Иван Петров</p>
        <p className={s.paragraphSecondaryTight}>Email: ivan@example.com</p>
      </div>

      <Divider.Root variant="text" size="l" className={s.sectionTop}>
        Уведомления
      </Divider.Root>
      <div className={s.inset}>
        <label className={s.checkboxRow}>
          <input type="checkbox" defaultChecked />
          Новости продукта
        </label>
      </div>

      <Divider.Root variant="text" size="m" className={s.sectionTop}>
        Дополнительно
      </Divider.Root>
      <div className={s.inset}>
        <p className={s.paragraphTertiary}>Версия: 2.1.0</p>
      </div>

      <Divider.Root variant="text" size="s" className={s.sectionTop}>
        Метаданные
      </Divider.Root>
      <div className={s.inset}>
        <p className={s.paragraphTertiaryXs}>ID: 12345</p>
      </div>
    </div>
  );
}
