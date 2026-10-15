import { api } from "@/components/login-form/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { LogIn } from "../icons";

export const page: ComponentPageConfig = {
  category: "page",
  nav: {
    segment: "login-form",
    label: "Login Form",
    summary: "Карточка входа: логотип, провайдеры, поля, ссылки",
    keywords: ["вход", "логин", "авторизация", "регистрация", "пароль", "sign in", "login", "auth"],
    icon: LogIn,
    order: 7,
  },
  dir: "login-form",
  title: "LoginForm",
  kind: "composite",
  description:
    "Карточка входа: логотип, заголовок, кнопки провайдеров и форма из обычных полей и кнопок кита. LoginForm отвечает только за раскладку и ритм.",
  examples: [
    {
      slot: "overview",
      description:
        "Вход через провайдера или по почте и паролю, ссылка «Забыли пароль?» и регистрация под центрированной шапкой с названным знаком продукта — `align`, `LoginForm.Logo`, `LoginForm.Actions`, `LoginForm.Form`, `LoginForm.Footer`.",
    },
    {
      slot: "sizes",
      description:
        "Отступы, зазоры и роли текста карточки берут ярус; поля и кнопки получают тот же — `size`.",
    },
    {
      slot: "structure",
      description:
        "Минимальная форма: без логотипа, описания и подвала, без тени для хоста-поверхности и с заголовком второго уровня под заголовком страницы хоста — `flat`, `as`.",
    },
    {
      scenario: "register",
      title: "Регистрация",
      description:
        "Регистрация: четыре поля в колонку, шкала надёжности у нового пароля и несовпадение — ошибкой поля — `strength`, `error`, `LoginForm.Form`.",
    },
    {
      scenario: "forgot-password",
      title: "Сброс пароля",
      description:
        "Запрос сброса пароля: одно поле, главное действие и тихий путь назад — `LoginForm.Actions`.",
    },
    {
      scenario: "reset-password",
      title: "Новый пароль",
      description:
        "Новый пароль по ссылке из письма: шкала надёжности у первого поля и ошибка несовпадения под вторым — `strength`, `error`.",
    },
    {
      scenario: "verification-code",
      title: "Код подтверждения",
      description:
        "Второй шаг с одноразовым кодом: ошибка неверного кода под ячейками, повторная отправка — тихое действие — `DigitInput`, `LoginForm.Actions`.",
    },
    {
      slot: "states",
      description:
        "Цикл отправки: кнопка занята, пока идёт запрос, отказ во входе отмечает оба поля, они вздрагивают, а скрытая live-область называет причину — `loading`, `invalid`, `VisuallyHidden`.",
    },
    {
      slot: "narrow",
      description:
        "На экране шириной с телефон карточка сохраняет отступы, шапка переносится, кнопки остаются на всю ширину — `LoginForm.Form`.",
    },
  ],
  api,
};
