import { Divider } from "@/components/divider/Divider";

import s from "./divider-demos.module.css";

/** Один превью-блок: все варианты подписаны, фокус на самом Divider. */
export default function DividerVariantsSnippet() {
  return (
    <div className={s.overviewCard}>
      <section className={s.overviewGroup} aria-label="Пустая линия и линия с подписью">
        <p className={s.demoHint}>Без текста — сплошная линия</p>
        <Divider.Root />
        <p className={s.demoHint}>Подпись по центру между линиями (default)</p>
        <Divider.Root>Итого</Divider.Root>
      </section>

      <section className={s.overviewGroup} aria-label="Заголовок секции">
        <p className={s.demoHint}>variant=&quot;text&quot; — стиль заголовка секции</p>
        <Divider.Root variant="text">Уведомления</Divider.Root>
      </section>

      <section className={s.overviewGroup} aria-label="Между пунктами списка">
        <p className={s.demoHint}>
          variant=&quot;line-spacing&quot; — маркер между строками в колонке
        </p>
        <div className={s.overviewLineSpacingCol}>
          <span className={s.overviewLineItem}>Пункт один</span>
          <Divider.Root variant="line-spacing" />
          <span className={s.overviewLineItem}>Пункт два</span>
        </div>
      </section>

      <section className={s.overviewGroup} aria-label="Вертикальный разделитель">
        <p className={s.demoHint}>orientation=&quot;vertical&quot; — между кнопками в ряду</p>
        <div className={s.overviewToolbar}>
          <button className={s.overviewToolbarBtn} type="button">
            A
          </button>
          <Divider.Root orientation="vertical" />
          <button className={s.overviewToolbarBtn} type="button">
            B
          </button>
        </div>
      </section>

      <section className={s.overviewGroup} aria-label="Линия на ширину списка">
        <p className={s.demoHint}>На всю ширину контейнера — между строками списка</p>
        <div className={s.overviewList}>
          <div className={s.overviewListRow}>Строка 1</div>
          <Divider.Root size="s" />
          <div className={s.overviewListRow}>Строка 2</div>
        </div>
      </section>
    </div>
  );
}
