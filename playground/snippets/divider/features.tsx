import { Divider } from "@/components/divider/Divider";

import s from "./divider-demos.module.css";

/** Выравнивание и декоративные линии в реальных сценариях: временная шкала, форма входа, макет с сеткой. */
export default function DividerFeaturesSnippet() {
  return (
    <div className={`${s.rootStack} ${s.rootStackLooser} ${s.maxW480}`}>
      {/* Временная шкала с align="start" */}
      <div className={s.card}>
        <h3 className={s.cardHeadingSpaced}>История изменений</h3>
        <Divider.Root size="m" align="start">
          Сегодня
        </Divider.Root>
        <div className={s.timelineBlock}>
          <p className={s.paragraphSecondaryTight}>14:30 — Обновлен статус заказа</p>
          <p className={s.paragraphSecondaryTight}>12:15 — Добавлен новый товар</p>
        </div>
        <Divider.Root size="m" align="start" className={s.timelineBlockSimple}>
          Вчера
        </Divider.Root>
        <div className={s.timelineBlockSimple}>
          <p className={s.paragraphSecondaryTight}>18:45 — Создан новый заказ</p>
        </div>
      </div>

      {/* Форма входа с align="center" и текстом "или" */}
      <div className={s.card}>
        <h3 className={s.cardHeadingSpaced}>Вход в систему</h3>
        <button className={s.fullWidthButton} type="button">
          Войти через Google
        </button>
        <Divider.Root size="m" align="center" className={s.dividerVerticalMargin}>
          или
        </Divider.Root>
        <div className={s.columnGap2}>
          <input className={s.textInput} type="email" placeholder="Email" />
          <input className={s.textInput} type="password" placeholder="Пароль" />
        </div>
      </div>

      {/* Макет с декоративными линиями (role="presentation") */}
      <div className={s.card}>
        <h3 className={s.cardHeadingSpaced}>Статистика</h3>
        <div className={s.statsGrid}>
          <div>
            <p className={s.statLabel}>Просмотры</p>
            <p className={s.statValue}>1,234</p>
          </div>
          <div>
            <p className={s.statLabel}>Клики</p>
            <p className={s.statValue}>567</p>
          </div>
        </div>
        <Divider.Root
          size="m"
          role="presentation"
          aria-hidden
          className={s.dividerVerticalMargin}
        />
        <div className={s.statsGrid}>
          <div>
            <p className={s.statLabel}>Конверсия</p>
            <p className={s.statValue}>12.5%</p>
          </div>
          <div>
            <p className={s.statLabel}>Доход</p>
            <p className={s.statValue}>45,000 ₽</p>
          </div>
        </div>
      </div>
    </div>
  );
}
