/**
 * The kit's motion techniques, each shown by a component's own example file (the same file its
 * page loads) with a line on what moves and a link to the page. Only techniques, not every
 * component that moves: overlays, tabs, toggles show their motion on their own pages.
 */
import { useNavigate } from "react-router-dom";

import { LinkButton } from "@/components/link-button/LinkButton";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { DocBlock } from "../components/Doc";
import { renderInlineCode } from "../components/PlaygroundApiTable";
import { DemoApiTitle, DemoDescription } from "../components/PlaygroundDemoTypography";
import { PlaygroundSourceFrame } from "../components/PlaygroundExampleFrame";
import { getExample } from "../exampleRegistry";
import { slotLayout } from "../pageStandard";
import s from "./foundation.module.css";

const SECTIONS = Object.values(
  import.meta.glob<{ page: ComponentPageConfig }>("../sections/*Section.tsx", { eager: true }),
).map((module) => module.page);

type MotionItem = {
  /** Component folder and example file. */
  dir: string;
  file: string;
  title: string;
  /** What moves and on which tokens. */
  text: string;
};

type MotionGroup = { title: string; description: string; items: MotionItem[] };

const GROUPS: MotionGroup[] = [
  {
    title: "Действия",
    description: "Кнопка отвечает на нажатие и показывает, что происходит с действием.",
    items: [
      {
        dir: "button",
        file: "label-morph",
        title: "Смена подписи",
        text: "Новая подпись перетекает по буквам: старые уходят вверх, новые поднимаются снизу, ширина плывёт за `base` · `emphasized`. Смена одних цифр — на месте. На «Оплачено» заливка перетекает в зелёный `success` за `fast`.",
      },
      {
        dir: "button",
        file: "download",
        title: "Прогресс в кнопке",
        text: "Заливка цвета текста растёт от начала кнопки на каждом шаге за `fast` · `standard`; по завершении гаснет и сворачивается.",
      },
      {
        dir: "button",
        file: "hold-to-confirm",
        title: "Удержание",
        text: "Заливка — часы жеста: 1,2 с линейно, при reduced motion остаётся. Отпустили раньше — откат за `fast` · `exit`.",
      },
    ],
  },
  {
    title: "Ввод и выбор",
    description:
      "Поле подтверждает ввод без рывков: счётчики катятся, уровни заполняются, отметка рисуется штрихом.",
    items: [
      {
        dir: "input",
        file: "validation",
        title: "Ошибка в поле",
        text: "Поле, которое стало ошибочным, резко встряхивается влево-вправо и затихает за `base`: сдвиг `space-2`, потом `space-1`. Подпись стоит, сообщение выезжает сверху. Так у всех полей, Checkbox и Switch; с ошибкой при открытии — без тряски.",
      },
      {
        dir: "input",
        file: "password-strength",
        title: "Надёжность пароля",
        text: "Ячейки шкалы заполняются друг за другом через полшага `stagger`, слово уровня перетекает по буквам, цвет меняется за `base`.",
      },
      {
        dir: "digit-input",
        file: "on-complete",
        title: "Код по ячейкам",
        text: "Одно кольцо фокуса едет к следующей ячейке за `fast` · `emphasized`, цифра проявляется; принятый код прокатывает успех по ячейкам.",
      },
      {
        dir: "textarea",
        file: "controlled",
        title: "Счётчик символов",
        text: "Цифры счётчика прокручиваются по разрядам, как одометр, за `base` · `emphasized`.",
      },
      {
        dir: "checkbox",
        file: "overview",
        title: "Галочка",
        text: "Штрих прорисовывается и вырастает за `base`; снятие уходит быстрее, на `exit`. Тот же штрих — у выбранного цвета в ColorSwatches.",
      },
    ],
  },
  {
    title: "Данные и статус",
    description:
      "Область перетекает между состояниями, числа докручиваются, редкое событие отмечается.",
    items: [
      {
        dir: "crossfade",
        file: "overview",
        title: "Смена состояний области",
        text: "Загрузка, данные, пусто и ошибка растворяются друг в друге, высота плывёт; загрузка — Skeleton в форме данных.",
      },
      {
        dir: "progress-bar",
        file: "steps",
        title: "Ступени",
        text: "Ячейки заполняются от начала при росте и опустошаются с конца при убывании, через полшага `stagger`.",
      },
      {
        dir: "sparkline",
        file: "overview",
        title: "Скраббинг графика",
        text: "Курсор идёт под пальцем без сглаживания, а после — плавно возвращается к последней точке; стрелка тренда поворачивается.",
      },
      {
        dir: "sparkline",
        file: "period",
        title: "Новый ряд",
        text: "Линия проявляется заново, цифры заголовка докручиваются до новой суммы.",
      },
      {
        dir: "progress-bar",
        file: "milestone",
        title: "Редкое событие",
        text: "Полоса дозаполняется, тон становится успехом, `celebrate()` даёт секунду конфетти. При reduced motion конфетти нет.",
      },
    ],
  },
];

function MotionExample({ item }: { item: MotionItem }) {
  const navigate = useNavigate();
  const page = SECTIONS.find((p) => p.dir === item.dir);
  if (!page) throw new Error(`No playground section for "${item.dir}"`);
  const example = page.examples.find((e) => ("slot" in e ? e.slot : e.scenario) === item.file);
  if (!example) throw new Error(`"${item.dir}/${item.file}" is not on the ${page.title} page`);
  if (!page.nav) throw new Error(`The ${page.title} page has no route`);
  const href = `/${page.nav.segment}`;

  return (
    <section className={s.motionItem} aria-label={item.title}>
      <DemoApiTitle>{item.title}</DemoApiTitle>
      <DemoDescription>{renderInlineCode(item.text)}</DemoDescription>
      <PlaygroundSourceFrame
        entry={getExample(page.base ?? "components", page.dir, item.file)}
        previewLayout={slotLayout(page.kind, "slot" in example ? example.slot : null)}
      />
      <LinkButton
        href={href}
        size="s"
        onClick={(event) => {
          event.preventDefault();
          navigate(href);
        }}
      >
        {`Страница ${page.title}`}
      </LinkButton>
    </section>
  );
}

/** Every group: its lead, then each component example that shows the motion. */
export function MotionCatalog() {
  return GROUPS.map((group) => (
    <DocBlock key={group.title} title={group.title} description={group.description}>
      <div className={s.motionItems}>
        {group.items.map((item) => (
          <MotionExample key={`${item.dir}/${item.file}`} item={item} />
        ))}
      </div>
    </DocBlock>
  ));
}
