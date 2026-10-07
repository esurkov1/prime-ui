import {
  Typography,
  type TypographyRole,
  type TypographyWeight,
} from "@/components/typography/Typography";

import { FoundationPage, FoundationSection, Panel, RuleList, TokenName } from "./FoundationKit";
import s from "./foundation.module.css";
import { TypographyComponentDocs } from "./TypographyComponentDocs";
import {
  formatPx,
  primitiveTokens,
  resolvePrimitive,
  semanticKeys,
  sourceValue,
  toKebab,
  toPx,
  toVarName,
} from "./tokenModel";

/** Where each role is used (foundation §5). Role names and metrics come from `semanticTokens.text`. */
const ROLE_USE: Record<string, string> = {
  caption: "Подсказки, мета, шапка таблицы",
  "body-s": "Вторичный текст, плотный UI",
  "body-m": "Основной текст интерфейса",
  "body-l": "Текст для чтения",
  "title-s": "Заголовок карточки, группы",
  "title-m": "Заголовок модалки, секции",
  "title-l": "Крупный заголовок блока",
  "heading-s": "Подзаголовок страницы",
  "heading-m": "Заголовок страницы",
  "heading-l": "Крупный заголовок страницы",
  "display-s": "Промо, крупные метрики",
  "display-m": "Герой экрана",
  "display-l": "Герой экрана",
  code: "Код, идентификаторы",
};

const SAMPLE: Record<string, string> = {
  caption: "Обновлено 12 марта в 14:05",
  "body-s": "Счёт будет выставлен после подтверждения заказа.",
  "body-m": "Съешь же ещё этих мягких французских булок да выпей чаю.",
  "body-l": "Съешь же ещё этих мягких французских булок да выпей чаю.",
  code: "const total = items.reduce((sum, x) => sum + x.price, 0);",
};
const HEADING_SAMPLE = "Отчёт по продажам за квартал";

const ROLES = semanticKeys("text").map((key) => {
  const role = toKebab(key);
  const at = (prop: string) => sourceValue(`text.${key}.${prop}`, "light") ?? "";
  return {
    key,
    role,
    sizePx: toPx(resolvePrimitive(at("size"))),
    lineHeightPx: toPx(resolvePrimitive(at("lineHeight"))),
    weight: resolvePrimitive(at("weight")),
    tracking: resolvePrimitive(at("tracking")),
  };
});

function RoleScale() {
  return (
    <Panel className={s.typeScale}>
      {ROLES.map((r) => (
        <div key={r.key} className={s.typeRow}>
          <div className={s.typeMeta}>
            <Typography as="span" variant="body-s" weight="medium">
              {r.role}
            </Typography>
            <Typography as="span" variant="caption" tone="muted" className={s.numeric}>
              {formatPx(r.sizePx)}/{formatPx(r.lineHeightPx)} · {r.weight} ·{" "}
              {r.tracking === "0" ? "0" : r.tracking}
            </Typography>
            <Typography as="span" variant="caption" tone="secondary">
              {ROLE_USE[r.role] ?? ""}
            </Typography>
            <TokenName>{`${toVarName(`text.${r.key}`)}-*`}</TokenName>
          </div>
          <Typography as="p" variant={r.role as TypographyRole} className={s.typeSample}>
            {SAMPLE[r.role] ?? HEADING_SAMPLE}
          </Typography>
        </div>
      ))}
    </Panel>
  );
}

const WEIGHTS = Object.entries(primitiveTokens.font.weight) as [TypographyWeight, string][];

function FontFamilies() {
  return (
    <div className={s.twoCol}>
      <Panel className={s.fontCard}>
        <TokenName>--prime-font-family-sans</TokenName>
        <Typography as="span" variant="display-s">
          Golos Text
        </Typography>
        <div className={s.weightRow}>
          {WEIGHTS.map(([name, value]) => (
            <Typography key={name} as="span" variant="body-m" weight={name}>
              {value} {name}
            </Typography>
          ))}
        </div>
      </Panel>
      <Panel className={s.fontCard}>
        <TokenName>--prime-font-family-mono</TokenName>
        <Typography as="span" variant="code">
          JetBrains Mono
        </Typography>
        <Typography as="span" variant="code" tone="secondary">
          ID 4f2a-91c0 · 0O 1lI
        </Typography>
      </Panel>
    </div>
  );
}

const READING_TEXT =
  "Длина строки влияет на скорость чтения сильнее, чем кажется. Если строка короче 45 знаков, глаз слишком часто прыгает на следующую. Если длиннее 90, трудно найти начало новой строки. Для текста, который читают подряд, держите 60–75 знаков: это ширина --prime-layout-reading-max-width.";

function ReadingWidth() {
  return (
    <Panel className={s.readingDemo}>
      <div className={s.readingMeasure}>
        <Typography as="span" variant="caption" tone="muted">
          <TokenName>--prime-layout-reading-max-width</TokenName> · body-l
        </Typography>
        <Typography as="p" variant="body-l">
          {READING_TEXT}
        </Typography>
      </div>
    </Panel>
  );
}

const NUMBERS = ["1 111,11 ₽", "88 808,00 ₽", "4 170,50 ₽", "17,09 ₽"];

function TabularNums() {
  return (
    <div className={s.twoCol}>
      <Panel className={s.numbersCard}>
        <Typography as="span" variant="caption" tone="muted">
          Пропорциональные цифры
        </Typography>
        {NUMBERS.map((n) => (
          <Typography key={n} as="span" variant="title-m" className={s.numberLine}>
            {n}
          </Typography>
        ))}
      </Panel>
      <Panel className={s.numbersCard}>
        <Typography as="span" variant="caption" tone="muted">
          <code>font-variant-numeric: tabular-nums</code>
        </Typography>
        {NUMBERS.map((n) => (
          <Typography
            key={n}
            as="span"
            variant="title-m"
            className={s.numberLine}
            data-tabular="true"
          >
            {n}
          </Typography>
        ))}
      </Panel>
    </div>
  );
}

export default function TypographyPage() {
  return (
    <FoundationPage
      title="Типографика"
      description={
        <>
          Шрифт Golos Text, у моноширинного — JetBrains Mono. Каждая роль задаёт четыре значения:{" "}
          <code>--prime-text-&lt;role&gt;-&#123;size, line-height, weight, tracking&#125;</code>.
          Используются только начертания 400, 500 и 600.
        </>
      }
    >
      <FoundationSection
        title="Роли"
        description="Размер / межстрочный · начертание · трекинг. Чем крупнее кегль, тем плотнее интерлиньяж и меньше трекинг. Мелкому тексту, наоборот, нужно больше воздуха."
      >
        <RoleScale />
      </FoundationSection>

      <FoundationSection title="Гарнитуры">
        <FontFamilies />
      </FoundationSection>

      <FoundationSection
        title="Ширина строки"
        description="Для сплошного текста нужно 60–75 знаков в строке. Интерфейсные подписи могут быть уже, абзац — нет."
      >
        <ReadingWidth />
      </FoundationSection>

      <FoundationSection
        title="Цифры"
        description="Если числа сравнивают по столбцу (суммы, даты, счётчики, цены в таблицах), включайте табличные цифры: тогда разряды стоят друг под другом."
      >
        <TabularNums />
      </FoundationSection>

      <FoundationSection title="Правила">
        <RuleList>
          <li>Иерархию создают кегль и начертание. Цвет добавляйте в последнюю очередь.</li>
          <li>
            На один экран хватает трёх-четырёх ролей. Если нужна пятая, скорее всего, лишняя одна из
            первых четырёх.
          </li>
          <li>Подсказка и ошибка всегда мельче текста поля.</li>
          <li>
            Не задавайте <code>font-size</code> напрямую, берите роль. Новая роль появляется только
            в <code>tokens/semantic.ts</code>.
          </li>
          <li>
            Длинные строки переносите через <code>overflow-wrap: anywhere</code>. Однострочные
            подписи обрезайте многоточием и показывайте полный текст в <code>title</code>.
          </li>
        </RuleList>
      </FoundationSection>

      <TypographyComponentDocs />
    </FoundationPage>
  );
}
