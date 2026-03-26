import { Divider } from "@/components/divider/Divider";

import s from "./divider-demos.module.css";

/** Вертикальные разделители в реальных UI-паттернах: тулбар, навигация, панель действий. */
export default function DividerOrientationSnippet() {
  return (
    <div className={`${s.rootStack} ${s.rootStackLoose} ${s.maxW480}`}>
      {/* Тулбар редактора */}
      <div className={s.toolbar}>
        <button className={s.toolbarButton} type="button">
          Жирный
        </button>
        <Divider.Root orientation="vertical" size="m" />
        <button className={s.toolbarButton} type="button">
          Курсив
        </button>
        <Divider.Root orientation="vertical" size="m" />
        <button className={s.toolbarButton} type="button">
          Ссылка
        </button>
      </div>

      {/* Панель действий таблицы */}
      <div className={s.toolbarWide}>
        <button className={s.toolbarButtonPlain} type="button">
          Фильтр
        </button>
        <Divider.Root orientation="vertical" size="m" />
        <button className={s.toolbarButtonPlain} type="button">
          Сортировка
        </button>
        <Divider.Root orientation="vertical" size="m" />
        <button className={s.toolbarButtonPlain} type="button">
          Экспорт
        </button>
      </div>

      {/* Горизонтальная навигация */}
      <div className={s.toolbarNav}>
        <a className={s.navLinkBrand} href="#overview">
          Обзор
        </a>
        <Divider.Root orientation="vertical" size="s" />
        <a className={s.navLink} href="#details">
          Детали
        </a>
        <Divider.Root orientation="vertical" size="s" />
        <a className={s.navLink} href="#settings">
          Настройки
        </a>
      </div>
    </div>
  );
}
