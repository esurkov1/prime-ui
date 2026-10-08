import { Card } from "@/components/card/Card";
import type { DataTableColumn } from "@/components/data-table/DataTable";
import { Input } from "@/components/input/Input";
import { Typography } from "@/components/typography/Typography";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";

import { DocBlock, DocList, DocPage, DocTable } from "../components/Doc";
import { SurfaceGallery } from "../components/ExampleSurface";
import { Panel, TokenName } from "./FoundationKit";
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
 * Page → card → floating menu → scrim + modal. The card and the fields are kit components; the
 * menu and modal planes are drawn on the same layers (`data-depth="floating"`) because real
 * overlays float in a portal.
 */
function LayerStack() {
  return (
    <div className={s.layerStage} data-depth={0} aria-hidden>
      <SurfaceDepthProvider value={0}>
        <LayerTag>слой 0 · страница</LayerTag>
        <Card.Root variant="cta" className={s.layerCard}>
          <LayerTag>слой 1 · карточка · shadow.raised</LayerTag>
          <StaticField value="Квартальный отчёт" />
          <StaticField value="Маркетинг" />
        </Card.Root>
        <div className={s.layerMenu} data-depth="floating">
          <LayerTag>floating · shadow.overlay</LayerTag>
          <Typography as="span" variant="body-m" className={s.nestedItem} data-active>
            Пункт меню
          </Typography>
          <Typography as="span" variant="body-m" className={s.nestedItem}>
            Ещё пункт
          </Typography>
        </div>
        <div className={s.layerScrim}>
          <div className={s.layerModal} data-depth="floating">
            <LayerTag>floating · shadow.modal · поверх bg.scrim</LayerTag>
            <StaticField value="Новый проект" />
          </div>
        </div>
      </SurfaceDepthProvider>
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
  return <DocTable columns={LAYER_COLUMNS} rows={LAYERS} getRowKey={(layer) => layer.key} />;
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
    <DocPage
      title="Слои и тени"
      description={
        <>
          Глубину создаёт заливка, а не линия. Поверхности стоят на лестнице из страницы и четырёх
          вложенных слоёв (подробно на странице «Цвет»). Тень добавляется только карточке на
          странице и плавающим слоям: меню, поповерам, модалкам.
        </>
      }
    >
      <DocBlock title="Тени">
        <ShadowCards />
      </DocBlock>

      <DocBlock
        title="Стопка слоёв"
        description="Как слои лежат друг на друге: фон, карточка, меню, затемнение и модалка."
      >
        <Panel className={s.layerPanel}>
          <LayerStack />
        </Panel>
      </DocBlock>

      <DocBlock
        title="Поле на разных слоях"
        description={
          <>
            Поверхность ставит <code>data-depth</code>, и <code>--prime-color-field-bg</code> берёт
            заливку своего слоя: на шаг темнее в светлой теме и на шаг светлее в тёмной. Поэтому
            поле заметно без обводки на любом слое. Тот же выбор есть в шапке: кнопка «Фон превью»
            ставит на этот слой все примеры компонентов.
          </>
        }
      >
        <SurfaceGallery>
          <FieldOnSurface />
        </SurfaceGallery>
      </DocBlock>

      <DocBlock
        title="z-index"
        description="Используйте только --prime-z-*. Все оверлеи стоят на одном уровне --prime-z-overlay и попадают в body при открытии, поэтому открытый позже слой всегда выше."
      >
        <ZLayers />
      </DocBlock>

      <DocBlock title="Правила">
        <DocList>
          <li>Не добавляйте рамку карточке, если её и так отделяет заливка.</li>
          <li>Тень показывает, что слой парит над другими. Статичным блокам она не нужна.</li>
          <li>
            Линии <code>--prime-color-border-subtle</code> нужны только как разделители: строки
            таблицы, пункты списка.
          </li>
        </DocList>
      </DocBlock>
    </DocPage>
  );
}
