import { Divider } from "@/components/divider/Divider";

import s from "./divider-demos.module.css";

/** Full-width разделители в реальных сценариях: карточка статьи, виджет уведомлений. */
export default function DividerFullWidthSnippet() {
  return (
    <div className={`${s.rootStack} ${s.rootStackLoose} ${s.maxW480}`}>
      {/* Карточка статьи */}
      <article className={s.article}>
        <h2 className={s.articleTitle}>Новые возможности в версии 2.0</h2>
        <p className={s.articleBody}>
          Мы добавили поддержку темной темы, улучшили производительность и исправили множество
          ошибок.
        </p>
        <Divider.Root size="m" className={s.dividerVerticalMargin} />
        <div className={s.metaRow}>
          <span className={s.metaMuted}>Обновлено сегодня</span>
          <span className={s.metaMuted}>5 мин чтения</span>
        </div>
      </article>

      {/* Виджет уведомлений */}
      <div className={s.listShell}>
        <div className={s.listHeader}>
          <h3 className={s.cardHeading}>Уведомления</h3>
        </div>
        <Divider.Root size="s" />
        <div className={s.listRow}>
          <p className={s.listItemTitle}>Новый комментарий</p>
          <p className={s.listItemBody}>Иван ответил на ваш вопрос</p>
        </div>
        <Divider.Root size="s" />
        <div className={s.listRow}>
          <p className={s.listItemTitle}>Обновление системы</p>
          <p className={s.listItemBody}>Доступна новая версия 2.1.0</p>
        </div>
        <Divider.Root size="s" />
        <div className={s.listRow}>
          <p className={s.listItemTitle}>Напоминание</p>
          <p className={s.listItemBody}>Встреча через 30 минут</p>
        </div>
      </div>

      {/* Список транзакций */}
      <div className={s.transactionShell}>
        <div className={s.transactionHeader}>
          <h3 className={s.cardHeading}>История операций</h3>
        </div>
        <Divider.Root size="m" />
        <div className={s.transactionRow}>
          <div className={s.transactionLine}>
            <span className={s.transactionLabel}>Пополнение счета</span>
            <span className={s.amountSuccess}>+5 000 ₽</span>
          </div>
          <span className={s.dateMuted}>25 марта, 14:30</span>
        </div>
        <Divider.Root size="s" />
        <div className={s.transactionRow}>
          <div className={s.transactionLine}>
            <span className={s.transactionLabel}>Оплата заказа</span>
            <span className={s.amountDanger}>−1 200 ₽</span>
          </div>
          <span className={s.dateMuted}>24 марта, 18:45</span>
        </div>
        <Divider.Root size="s" />
        <div className={s.transactionRow}>
          <div className={s.transactionLine}>
            <span className={s.transactionLabel}>Возврат средств</span>
            <span className={s.amountSuccess}>+800 ₽</span>
          </div>
          <span className={s.dateMuted}>23 марта, 10:15</span>
        </div>
      </div>
    </div>
  );
}
