import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import { PlaygroundDocPage } from "../components/PlaygroundDocPage";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
import FileUploadAvatarRowsSnippet from "../snippets/file-upload/avatar-rows";
import avatarRowsSource from "../snippets/file-upload/avatar-rows.tsx?raw";
import FileUploadCircleModalSnippet from "../snippets/file-upload/circle-modal";
import circleModalSource from "../snippets/file-upload/circle-modal.tsx?raw";
import FileUploadCompositionSnippet from "../snippets/file-upload/composition";
import compositionSource from "../snippets/file-upload/composition.tsx?raw";
import FileUploadControlledSnippet from "../snippets/file-upload/controlled";
import controlledSource from "../snippets/file-upload/controlled.tsx?raw";
import FileUploadCustomChildrenSnippet from "../snippets/file-upload/custom-children";
import customChildrenSource from "../snippets/file-upload/custom-children.tsx?raw";
import FileUploadFullWidthSnippet from "../snippets/file-upload/full-width";
import fullWidthSource from "../snippets/file-upload/full-width.tsx?raw";
import FileUploadSizesSnippet from "../snippets/file-upload/sizes";
import sizesUploadSource from "../snippets/file-upload/sizes.tsx?raw";
import FileUploadStatesSnippet from "../snippets/file-upload/states";
import statesSource from "../snippets/file-upload/states.tsx?raw";
import FileUploadVariantsSnippet from "../snippets/file-upload/variants";
import variantsSource from "../snippets/file-upload/variants.tsx?raw";
import {
  fileUploadActionsRowApiRows,
  fileUploadBrowseLabelApiRows,
  fileUploadBrowseLinkApiRows,
  fileUploadChipApiRows,
  fileUploadChipLabelApiRows,
  fileUploadDropBodyApiRows,
  fileUploadFormatBadgeApiRows,
  fileUploadHintApiRows,
  fileUploadIconApiRows,
  fileUploadItemActionsApiRows,
  fileUploadItemApiRows,
  fileUploadItemFooterApiRows,
  fileUploadItemMainApiRows,
  fileUploadItemMetaApiRows,
  fileUploadItemMetaSepApiRows,
  fileUploadItemNameApiRows,
  fileUploadItemProgressApiRows,
  fileUploadItemRowApiRows,
  fileUploadItemStackApiRows,
  fileUploadItemTextGroupApiRows,
  fileUploadItemTryAgainApiRows,
  fileUploadRootApiRows,
  fileUploadTitleApiRows,
} from "./fileUploadApiRows";

export default function FileUploadSection() {
  return (
    <PlaygroundDocPage
      title="FileUpload"
      description={
        <>
          Набор блоков для выбора файлов: зона перетаскивания с нативным диалогом, карточки уже
          выбранных файлов с прогрессом и статусом, чипы дополнительных источников. Размеры{" "}
          <code>s</code> · <code>m</code> · <code>l</code> · <code>xl</code> согласованы между зоной
          и карточкой; у карточки задавайте тот же <code>size</code>, что у кнопок действий рядом.
        </>
      }
    >
      <div className="demoExamples">
        <div className="demoBlock">
          <h4>Размеры</h4>
          <p className="demoBlockDescription">
            Сетка <code>FileUpload.Root</code> и ряд карточек <code>FileUpload.Item</code> с{" "}
            <code>size</code> <code>s</code> → <code>xl</code>; внутри карточки —{" "}
            <code>FormatBadge</code>, строка имени с индикатором загрузки и{" "}
            <code>ItemProgress</code> с <code>value</code>.
          </p>
          <PlaygroundExampleFrame.Root code={sizesUploadSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Варианты</h4>
          <p className="demoBlockDescription">
            У корня — <code>appearance=&quot;dashed&quot;</code> и <code>&quot;solid&quot;</code>; у
            карточки — <code>variant=&quot;default&quot;</code> и <code>&quot;error&quot;</code>.
          </p>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Состояния</h4>
          <p className="demoBlockDescription">
            Активная и <code>disabled</code> зона; карточки с прогрессом, успехом и ошибкой (
            <code>ItemTryAgain</code>). Подсветка при перетаскивании файла на зону —{" "}
            <code>data-dragover</code> на корне (проверьте в браузере).
          </p>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Контролируемый режим</h4>
          <p className="demoBlockDescription">
            Список выбранных файлов в состоянии React: <code>onFilesChange</code>,{" "}
            <code>multiple</code>, <code>accept</code>; сброс списка отдельной кнопкой.
          </p>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Композиция</h4>
          <p className="demoBlockDescription">
            <code>DropBody</code> с <code>Title tone=&quot;muted&quot;</code> и{" "}
            <code>BrowseLink</code>, ряд <code>Chip</code> / <code>ChipLabel</code>;{" "}
            <code>inputRef</code> для программного открытия диалога с кнопок-источников.
          </p>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Full width</h4>
          <p className="demoBlockDescription">
            Зона растягивается на ширину родителя (<code>width: 100%</code> у <code>Root</code>) —
            типично для формы в колонке.
          </p>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи: свой контент и accept</h4>
          <p className="demoBlockDescription">
            Замена стандартного тела зоны через <code>children</code> и ограничение типов файлов{" "}
            <code>accept=&quot;image/*&quot;</code>.
          </p>
          <PlaygroundExampleFrame.Root code={customChildrenSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadCustomChildrenSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи: круглая зона</h4>
          <p className="demoBlockDescription">
            Круглый контейнер через CSS, <code>DropBody</code>, общий <code>inputRef</code> с
            внешней кнопкой «Загрузить фото».
          </p>
          <PlaygroundExampleFrame.Root code={circleModalSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadCircleModalSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>Специфичные фичи: список с аватаром</h4>
          <p className="demoBlockDescription">
            Строка настроек профиля рядом с <code>Avatar</code> и кнопками — без отдельной зоны
            FileUpload (кнопки можно связать с общим <code>inputRef</code> в продукте).
          </p>
          <PlaygroundExampleFrame.Root code={avatarRowsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadAvatarRowsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <h4>API</h4>
          <h5>FileUpload.Root</h5>
          <p className="demoBlockDescription">
            Интерактивная зона на базе <code>label</code>, скрытый{" "}
            <code>input type=&quot;file&quot;</code>, drag-and-drop и контекст размера для вложенных
            слотов.
          </p>
          <PlaygroundApiTable rows={fileUploadRootApiRows} />
          <h5>FileUpload.Icon</h5>
          <p className="demoBlockDescription">Центрированная обёртка для иконки в зоне.</p>
          <PlaygroundApiTable rows={fileUploadIconApiRows} />
          <h5>FileUpload.Title</h5>
          <p className="demoBlockDescription">Заголовок блока текста в зоне.</p>
          <PlaygroundApiTable rows={fileUploadTitleApiRows} />
          <h5>FileUpload.Hint</h5>
          <p className="demoBlockDescription">
            Вторичная подсказка через <code>Hint.Root</code> с размером из контекста.
          </p>
          <PlaygroundApiTable rows={fileUploadHintApiRows} />
          <h5>FileUpload.BrowseLabel</h5>
          <p className="demoBlockDescription">
            Стилизованная подпись «Browse» (pointer-events: none на зоне).
          </p>
          <PlaygroundApiTable rows={fileUploadBrowseLabelApiRows} />
          <h5>FileUpload.BrowseLink</h5>
          <p className="demoBlockDescription">
            Кнопка-ссылка в тексте; клик не всплывает к <code>label</code>.
          </p>
          <PlaygroundApiTable rows={fileUploadBrowseLinkApiRows} />
          <h5>FileUpload.DropBody</h5>
          <p className="demoBlockDescription">
            Колонка для модальных композиций; ослабляет pointer-events на зоне.
          </p>
          <PlaygroundApiTable rows={fileUploadDropBodyApiRows} />
          <h5>FileUpload.ActionsRow</h5>
          <p className="demoBlockDescription">Горизонтальный ряд чипов-источников.</p>
          <PlaygroundApiTable rows={fileUploadActionsRowApiRows} />
          <h5>FileUpload.Chip</h5>
          <p className="demoBlockDescription">
            Кнопка-источник; останавливает всплытие, не открывает диалог сама по себе.
          </p>
          <PlaygroundApiTable rows={fileUploadChipApiRows} />
          <h5>FileUpload.ChipLabel</h5>
          <p className="demoBlockDescription">Текстовая часть чипа.</p>
          <PlaygroundApiTable rows={fileUploadChipLabelApiRows} />
          <h5>FileUpload.FormatBadge</h5>
          <p className="demoBlockDescription">Бейдж расширения файла на карточке.</p>
          <PlaygroundApiTable rows={fileUploadFormatBadgeApiRows} />
          <h5>FileUpload.Item</h5>
          <p className="demoBlockDescription">Карточка одного файла в списке.</p>
          <PlaygroundApiTable rows={fileUploadItemApiRows} />
          <h5>FileUpload.ItemRow</h5>
          <p className="demoBlockDescription">
            Горизонтальный ряд: бейдж, основной блок, действия.
          </p>
          <PlaygroundApiTable rows={fileUploadItemRowApiRows} />
          <h5>FileUpload.ItemMain</h5>
          <p className="demoBlockDescription">Правая колонка с текстом и метаданными.</p>
          <PlaygroundApiTable rows={fileUploadItemMainApiRows} />
          <h5>FileUpload.ItemStack</h5>
          <p className="demoBlockDescription">Вертикальный стек для ошибки и «Try again».</p>
          <PlaygroundApiTable rows={fileUploadItemStackApiRows} />
          <h5>FileUpload.ItemTextGroup</h5>
          <p className="demoBlockDescription">Группа имени и мета-строки.</p>
          <PlaygroundApiTable rows={fileUploadItemTextGroupApiRows} />
          <h5>FileUpload.ItemTryAgain</h5>
          <p className="demoBlockDescription">Кнопка повторной загрузки.</p>
          <PlaygroundApiTable rows={fileUploadItemTryAgainApiRows} />
          <h5>FileUpload.ItemName</h5>
          <p className="demoBlockDescription">Строка имени файла и статуса.</p>
          <PlaygroundApiTable rows={fileUploadItemNameApiRows} />
          <h5>FileUpload.ItemMeta</h5>
          <p className="demoBlockDescription">Вторичная строка (размер, прогресс в КБ).</p>
          <PlaygroundApiTable rows={fileUploadItemMetaApiRows} />
          <h5>FileUpload.ItemMetaSep</h5>
          <p className="demoBlockDescription">Разделитель «·» между частями меты.</p>
          <PlaygroundApiTable rows={fileUploadItemMetaSepApiRows} />
          <h5>FileUpload.ItemActions</h5>
          <p className="demoBlockDescription">Область кнопок справа в ряду.</p>
          <PlaygroundApiTable rows={fileUploadItemActionsApiRows} />
          <h5>FileUpload.ItemFooter</h5>
          <p className="demoBlockDescription">Нижняя зона под рядом (доп. действия).</p>
          <PlaygroundApiTable rows={fileUploadItemFooterApiRows} />
          <h5>FileUpload.ItemProgress</h5>
          <p className="demoBlockDescription">
            Обёртка прогресса; по умолчанию <code>ProgressBar.Root</code> при переданном{" "}
            <code>value</code>.
          </p>
          <PlaygroundApiTable rows={fileUploadItemProgressApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
