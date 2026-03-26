import { Divider } from "@/components/divider/Divider";

import s from "./divider-demos.module.css";

/** Три варианта в реальных сценариях: карточка заказа, список настроек, форма регистрации. */
export default function DividerVariantsSnippet() {
  return (
    <div className={`${s.rootStack} ${s.rootStackLooser} ${s.maxW420}`}>
      {/* variant="default": разделение секций в карточке заказа */}
      <div className={s.card}>
        <h3 className={s.cardHeading}>Заказ №12345</h3>
        <p className={s.cardLead}>3 товара • Доставка завтра</p>
        <Divider.Root size="m" className={s.dividerVerticalMargin} />
        <p className={s.cardLead}>Адрес: ул. Ленина, д. 10, кв. 5</p>
        <Divider.Root size="m" className={s.dividerVerticalMargin}>
          Итого
        </Divider.Root>
        <p className={s.totalLine}>12 400 ₽</p>
      </div>

      {/* variant="line-spacing": компактный список с визуальными маркерами */}
      <div className={s.card}>
        <h3 className={s.cardHeadingSpaced}>Уведомления</h3>
        <div className={s.lineSpacingColumn}>
          <label className={s.checkboxRow}>
            <input type="checkbox" defaultChecked />
            Email-рассылка
          </label>
          <Divider.Root variant="line-spacing" size="m" />
          <label className={s.checkboxRow}>
            <input type="checkbox" defaultChecked />
            Push-уведомления
          </label>
          <Divider.Root variant="line-spacing" size="m" />
          <label className={s.checkboxRow}>
            <input type="checkbox" />
            SMS-оповещения
          </label>
        </div>
      </div>

      {/* variant="text": заголовки секций формы */}
      <div className={s.card}>
        <Divider.Root variant="text" size="m">
          Личные данные
        </Divider.Root>
        <div className={s.formFields}>
          <input className={s.textInput} type="text" placeholder="Имя" />
          <input className={s.textInput} type="email" placeholder="Email" />
        </div>
        <Divider.Root variant="text" size="m" className={s.formFieldsTopLoose}>
          Безопасность
        </Divider.Root>
        <div className={s.timelineBlockSimple}>
          <input className={s.textInputFull} type="password" placeholder="Пароль" />
        </div>
      </div>
    </div>
  );
}
