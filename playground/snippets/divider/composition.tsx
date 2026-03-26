import { Divider } from "@/components/divider/Divider";
import { Icon } from "@/icons";

import s from "./divider-demos.module.css";

/** Разделители с иконками в реальном контексте: профиль пользователя, карточка продукта. */
export default function DividerCompositionSnippet() {
  return (
    <div className={`${s.rootStack} ${s.rootStackLoose} ${s.maxW420}`}>
      {/* Профиль пользователя */}
      <div className={s.card}>
        <div className={s.profileHeader}>
          <div className={s.avatar}>ИП</div>
          <div>
            <p className={s.profileName}>Иван Петров</p>
            <p className={s.profileRole}>Разработчик</p>
          </div>
        </div>

        <Divider.Root variant="text" size="m">
          <Icon name="field.email" size="s" />
          Контакты
        </Divider.Root>
        <div className={s.timelineBlock}>
          <p className={s.paragraphSecondaryTight}>ivan.petrov@example.com</p>
          <p className={s.paragraphSecondaryTight}>+7 (999) 123-45-67</p>
        </div>

        <Divider.Root variant="text" size="m" className={s.formFieldsTopLoose}>
          <Icon name="nav.home" size="s" />
          Местоположение
        </Divider.Root>
        <p className={s.locationText}>Москва, Россия</p>
      </div>

      {/* Карточка продукта */}
      <div className={s.card}>
        <h3 className={s.productTitle}>Беспроводные наушники</h3>
        <p className={s.cardLead}>Премиальное качество звука</p>

        <Divider.Root size="m" className={s.dividerVerticalMargin}>
          <Icon name="nav.layoutGrid" size="s" />
          Характеристики
        </Divider.Root>
        <div className={s.columnGap2}>
          <div className={s.specRow}>
            <span className={s.specKey}>Время работы:</span>
            <span className={s.specVal}>24 часа</span>
          </div>
          <div className={s.specRow}>
            <span className={s.specKey}>Bluetooth:</span>
            <span className={s.specVal}>5.0</span>
          </div>
        </div>

        <Divider.Root size="m" className={s.dividerVerticalMargin}>
          Рейтинг
        </Divider.Root>
        <div className={s.ratingRow}>
          <span className={s.ratingScore}>4.8</span>
          <span className={s.ratingCaption}>(342 отзыва)</span>
        </div>
      </div>
    </div>
  );
}
