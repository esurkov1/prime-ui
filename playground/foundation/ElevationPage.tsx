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
            <span className={s.radiusName}>{key}</span>
            <TokenName>{varName}</TokenName>
            <span className={s.groupNote}>{SHADOW_USE[key] ?? ""}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Canvas → card → floating menu → scrim + modal, drawn with plain blocks on tokens. */
function LayerStack() {
  return (
    <div className={s.layerStage} aria-hidden>
      <span className={s.layerTag}>bg.canvas</span>
      <div className={s.layerCard}>
        <span className={s.layerTag}>bg.surface · shadow.raised</span>
        <span className={s.fakeField} />
        <span className={s.fakeField} />
      </div>
      <div className={s.layerMenu}>
        <span className={s.layerTag}>bg.raised · shadow.overlay</span>
        <span className={s.nestedItem} data-active>
          Пункт меню
        </span>
        <span className={s.nestedItem}>Ещё пункт</span>
      </div>
      <div className={s.layerScrim}>
        <div className={s.layerModal}>
          <span className={s.layerTag}>bg.raised · shadow.modal · поверх bg.scrim</span>
          <span className={s.fakeField} />
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

function ZLayers() {
  return (
    <TokenTable head={["Слой", "Токен", "z-index"]}>
      {LAYERS.map((layer) => (
        <tr key={layer.key}>
          <th scope="row">{layer.key}</th>
          <td>
            <TokenName>{layer.varName}</TokenName>
          </td>
          <td className={s.numeric}>{layer.value}</td>
        </tr>
      ))}
    </TokenTable>
  );
}

function FieldOnSurface() {
  return (
    <div className={s.fieldSample}>
      <span className={s.fakeLabel}>Название</span>
      <span className={s.fakeField}>Квартальный отчёт</span>
    </div>
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
        description="Используйте только --prime-z-*. Слои внутри drawer и модалки стоят выше своего хозяина, поэтому вложенные порталы не прячутся под ним."
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
