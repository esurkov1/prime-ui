import type * as React from "react";
import LoginFormFlatExample from "@/components/login-form/examples/flat";
import flatSource from "@/components/login-form/examples/flat.tsx?raw";
import LoginFormForgotPasswordExample from "@/components/login-form/examples/forgot-password";
import forgotSource from "@/components/login-form/examples/forgot-password.tsx?raw";
import LoginFormRegisterExample from "@/components/login-form/examples/register";
import registerSource from "@/components/login-form/examples/register.tsx?raw";
import LoginFormResetPasswordExample from "@/components/login-form/examples/reset-password";
import resetSource from "@/components/login-form/examples/reset-password.tsx?raw";
import LoginFormSignInExample from "@/components/login-form/examples/sign-in";
import signSource from "@/components/login-form/examples/sign-in.tsx?raw";
import LoginFormSizesExample from "@/components/login-form/examples/sizes";
import sizesSource from "@/components/login-form/examples/sizes.tsx?raw";
import LoginFormSubmitStatesExample from "@/components/login-form/examples/submit-states";
import statesSource from "@/components/login-form/examples/submit-states.tsx?raw";
import LoginFormVerificationCodeExample from "@/components/login-form/examples/verification-code";
import codeSource from "@/components/login-form/examples/verification-code.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { type PlaygroundApiPropRow, PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";

const rootApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "size",
    type: '"xs" | "s" | "m" | "l" | "xl"',
    defaultValue: '"m"',
    required: "Нет",
    description:
      "Ярус отступов карточки и текстовых ролей заголовка, описания и подвала. Тот же размер передайте полям и кнопкам внутри.",
  },
  {
    prop: "align",
    type: '"start" | "center"',
    defaultValue: '"start"',
    required: "Нет",
    description:
      "`start` — как шапка Modal: скруглённая акцентная плитка слева, заголовок над описанием справа от неё; `center` — круглый логотип над текстом по центру.",
  },
  {
    prop: "flat",
    type: "boolean",
    defaultValue: "false",
    required: "Нет",
    description: "Убирает тень карточки; рамки нет в обоих случаях.",
  },
  {
    prop: "…rest",
    type: "React.HTMLAttributes<HTMLDivElement>",
    defaultValue: "—",
    required: "Нет",
    description: "Нативные атрибуты `<div>`; `ref` пробрасывается.",
  },
];

const partsApiRows: PlaygroundApiPropRow[] = [
  {
    prop: "LoginForm.Header",
    type: "header",
    defaultValue: "—",
    required: "Нет",
    description: "Колонка по центру: логотип, заголовок, описание.",
  },
  {
    prop: "LoginForm.Logo",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Круглая плитка для знака продукта: `<img>`, SVG или иконка.",
  },
  {
    prop: "LoginForm.Title",
    type: 'as?: "h1" | "h2" | "h3"',
    defaultValue: '"h1"',
    required: "Да",
    description: "Заголовок; роль текста задаёт размер формы.",
  },
  {
    prop: "LoginForm.Description",
    type: "p",
    defaultValue: "—",
    required: "Нет",
    description: "Пояснение под заголовком, вторичный цвет.",
  },
  {
    prop: "LoginForm.Body",
    type: "div",
    defaultValue: "—",
    required: "Да",
    description: "Всё под шапкой: соцкнопки, разделитель, форма, подвал.",
  },
  {
    prop: "LoginForm.Social",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Колонка кнопок провайдеров на всю ширину.",
  },
  {
    prop: "LoginForm.Form",
    type: "form",
    defaultValue: "—",
    required: "Да",
    description: "Нативная `<form>`: поля и кнопка отправки в одной колонке; `ref` пробрасывается.",
  },
  {
    prop: "LoginForm.Actions",
    type: "div",
    defaultValue: "—",
    required: "Нет",
    description: "Колонка кнопок: основная, затем `ghost`.",
  },
  {
    prop: "LoginForm.Footer",
    type: "p",
    defaultValue: "—",
    required: "Нет",
    description: "Строка по центру со ссылкой `LinkButton`.",
  },
];

function Demo({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: React.ReactNode;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <div className="demoBlock">
      <DemoSectionTitle>{title}</DemoSectionTitle>
      <DemoDescription>{description}</DemoDescription>
      <PlaygroundExampleFrame.Root code={code.trim()} previewLayout="stack">
        <PlaygroundExampleFrame.Stage>{children}</PlaygroundExampleFrame.Stage>
      </PlaygroundExampleFrame.Root>
    </div>
  );
}

export default function LoginFormSection() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>LoginForm</PageContent.Title>
        <PageContent.Description measure="full">
          Карточка входа и сопутствующих шагов: логотип, заголовок, кнопки провайдеров, поля и
          ссылка на соседний экран. Компонент задаёт раскладку и ритм, а поля, кнопки и ошибки —
          обычные Input, Button и Banner; логика формы остаётся у приложения.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <Demo
            title="Вход по email и паролю"
            description={
              <>
                Отдельный экран с шапкой по центру (<code>align="center"</code>): кнопка Telegram,
                разделитель «или», поля, ссылка «Забыли пароль?» под полем пароля и переход на
                регистрацию в <code>LoginForm.Footer</code>.
              </>
            }
            code={signSource}
          >
            <LoginFormSignInExample />
          </Demo>

          <Demo
            title="Регистрация"
            description={
              <>
                Пять полей в одной колонке; совпадение паролей проверяется на клиенте, ошибка
                показывается под вторым полем и блокирует отправку.
              </>
            }
            code={registerSource}
          >
            <LoginFormRegisterExample />
          </Demo>

          <Demo
            title="Запрос сброса пароля"
            description={
              <>
                Одно поле и <code>LoginForm.Actions</code>: основная кнопка и тихий возврат ко входу
                (<code>ghost</code>).
              </>
            }
            code={forgotSource}
          >
            <LoginFormForgotPasswordExample />
          </Demo>

          <Demo
            title="Новый пароль"
            description={
              <>Последний шаг восстановления: два поля, ошибка несовпадения под вторым.</>
            }
            code={resetSource}
          >
            <LoginFormResetPasswordExample />
          </Demo>

          <Demo
            title="Подтверждение кодом"
            description={
              <>
                <code>DigitInput</code> внутри формы: отклонённый код красит ячейки и подсказку (
                <code>invalid</code> + <code>Hint.Root invalid</code>), повторная отправка и смена
                адреса — тихие действия. Верный код в примере — <code>123456</code>.
              </>
            }
            code={codeSource}
          >
            <LoginFormVerificationCodeExample />
          </Demo>

          <Demo
            title="Отправка и ошибка сервера"
            description={
              <>
                Кнопка в <code>loading</code>, поля <code>disabled</code> на время запроса; ошибка
                возвращается Banner с <code>tone="danger"</code> над полями и красным кольцом на
                пароле.
              </>
            }
            code={statesSource}
          >
            <LoginFormSubmitStatesExample />
          </Demo>

          <Demo
            title="Размеры"
            description={
              <>
                <code>s</code>, <code>m</code>, <code>l</code>: отступы карточки, промежутки и текст
                следуют <code>size</code>; тот же <code>size</code> передайте полям и кнопкам.
              </>
            }
            code={sizesSource}
          >
            <LoginFormSizesExample />
          </Demo>

          <Demo
            title="Без тени"
            description={
              <>
                <code>flat</code> убирает тень — для формы внутри Modal или на обычной странице, где
                поверхность уже есть.
              </>
            }
            code={flatSource}
          >
            <LoginFormFlatExample />
          </Demo>

          <div className="demoBlock">
            <DemoApiTitle>LoginForm.Root</DemoApiTitle>
            <PlaygroundApiTable rows={rootApiRows} />
          </div>

          <div className="demoBlock">
            <DemoApiTitle>Части</DemoApiTitle>
            <PlaygroundApiTable rows={partsApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
