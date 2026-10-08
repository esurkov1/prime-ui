import { Card } from "@/components/card/Card";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Input } from "@/components/input/Input";
import { Typography } from "@/components/typography/Typography";

import { SurfaceGallery } from "../components/ExampleSurface";
import {
  FoundationPage,
  FoundationSection,
  Panel,
  RuleList,
  TokenName,
  TokenTable,
} from "./FoundationKit";
import s from "./foundation.module.css";
import { primitiveTokens, semanticKeys, sourceValue, toVarName } from "./tokenModel";

const SHADOW_USE: Record<string, string> = {
  raised: "Карточки на фоне. Тень едва заметна, глубину создаёт заливка.",
  overlay: "Меню, popover, тултип, панель датапикера.",
  modal: "Модалка и drawer.",
};

const SHADOWS = semanticKeys("shadow");

function ShadowCards() {
  return (
    <div className={s.shadowGrid}>
      {SHADOWS.map((key) => {
        const varName = toVarName(`shadow.${key}`);
        return (
          <div key={key} className={s.shadowCard} style={{ boxShadow: `var(${varName})` }}>
            <Typography as="span" variant="title-s">
              {key}
            </Typography>
            <TokenName>{varName}</TokenName>
            <Typography as="span" variant="body-s" tone="muted">
              {SHADOW_USE[key] ?? ""}
            </Typography>
          </div>
        );
      })}
    </div>
  );
}

function LayerTag({ children }: { children: string }) {
  return (
    <Typography as="span" variant="caption" tone="muted" className={s.layerTag}>
      {children}
    </Typography>
  );
}

function StaticField({ value }: { value: string }) {
  return (
    <Input.Root>
      <Input.Wrapper>
        <Input.Field aria-label={value} defaultValue={value} readOnly tabIndex={-1} />
      </Input.Wrapper>
    </Input.Root>
  );
}

/**
 * Canvas → card → floating menu → scrim + modal. The card and the fields are kit components; the
 * menu and modal planes are drawn on the same tokens because real overlays float in a portal.
 */
function LayerStack() {
  return (
    <div className={s.layerStage} aria-hidden>
      <LayerTag>bg.canvas</LayerTag>
      <Card.Root variant="cta" className={s.layerCard}>
        <LayerTag>bg.surface · shadow.raised</LayerTag>
        <StaticField value="Квартальный отчёт" />
        <StaticField value="Маркетинг" />
      </Card.Root>
      <div className={s.layerMenu}>
        <LayerTag>bg.raised · shadow.overlay</LayerTag>
        <Typography as="span" variant="body-m" className={s.nestedItem} data-active>
          Пункт меню
        </Typography>
        <Typography as="span" variant="body-m" className={s.nestedItem}>
          Ещё пункт
        </Typography>
      </div>
      <div className={s.layerScrim}>
        <div className={s.layerModal}>
          <LayerTag>bg.raised · shadow.modal · поверх bg.scrim</LayerTag>
          <StaticField value="Новый проект" />
        </div>
      </div>
    </div>
  );
}

/** z-index layers sorted by value; numbers come from the primitive scale. */
const LAYERS = semanticKeys("z")
  .map((key) => {
    const ref = sourceValue(`z.${key}`, "light") ?? "";
    const refKey = ref.replace(/^\{zIndex\.|\}$/g, "") as keyof typeof primitiveTokens.zIndex;
    return { key, varName: toVarName(`z.${key}`), value: Number(primitiveTokens.zIndex[refKey]) };
  })
  .sort((a, b) => a.value - b.value);

type Layer = (typeof LAYERS)[number];

const LAYER_COLUMNS: DataTableColumn<Layer>[] = [
  { id: "key", header: "Слой", accessor: "key" },
  { id: "token", header: "Токен", cell: (layer) => <TokenName>{layer.varName}</TokenName> },
  { id: "value", header: "z-index", accessor: "value", numeric: true },
];

function ZLayers() {
  return <TokenTable columns={LAYER_COLUMNS} rows={LAYERS} getRowKey={(layer) => layer.key} />;
}

function FieldOnSurface() {
  return (
    <Input.Root label="Название" className={s.fieldSample}>
      <Input.Wrapper>
        <Input.Field defaultValue="Квартальный отчёт" />
      </Input.Wrapper>
    </Input.Root>
  );
}

export default function ElevationPage() {
  return (
    <FoundationPage
      title="Слои и тени"
      description={
        <>
          Глубину создаёт заливка, а не линия. Фон приложения серый, карточки белые, плавающие слои
          выше и с тенью. В тёмной теме каждый следующий слой светлее предыдущего.
        </>
      }
    >
      <FoundationSection title="Тени">
        <ShadowCards />
      </FoundationSection>

      <FoundationSection
        title="Стопка слоёв"
        description="Как слои лежат друг на друге: фон, карточка, меню, затемнение и модалка."
      >
        <Panel className={s.layerPanel}>
          <LayerStack />
        </Panel>
      </FoundationSection>

      <FoundationSection
        title="Поле на разных поверхностях"
        description={
          <>
            Каждая поверхность выше фона переопределяет <code>--prime-color-field-bg</code> на{" "}
            <code>--prime-color-field-bg-surface</code>. Поэтому поле остаётся заметным без обводки.
            Это же переключение есть в сайдбаре: «Фон превью» применяет его ко всем примерам
            компонентов.
          </>
        }
      >
        <SurfaceGallery>
          <FieldOnSurface />
        </SurfaceGallery>
      </FoundationSection>

      <FoundationSection
        title="z-index"
        description="Используйте только --prime-z-*. Все оверлеи стоят на одном уровне --prime-z-overlay и попадают в body при открытии, поэтому открытый позже слой всегда выше."
      >
        <ZLayers />
      </FoundationSection>

      <FoundationSection title="Правила">
        <RuleList>
          <li>Не добавляйте рамку карточке, если её и так отделяет заливка.</li>
          <li>Тень показывает, что слой парит над другими. Статичным блокам она не нужна.</li>
          <li>
            Линии <code>--prime-color-border-subtle</code> нужны только как разделители: строки
            таблицы, пункты списка.
          </li>
        </RuleList>
      </FoundationSection>
    </FoundationPage>
  );
}
