import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
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
          <DemoSectionTitle>Размеры</DemoSectionTitle>
          <DemoDescription>
            Сетка <code>FileUpload.Root</code> и ряд карточек <code>FileUpload.Item</code> с{" "}
            <code>size</code> <code>s</code> → <code>xl</code>; внутри карточки —{" "}
            <code>FormatBadge</code>, строка имени с индикатором загрузки и{" "}
            <code>ItemProgress</code> с <code>value</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={sizesUploadSource.trim()} previewLayout="stack-center">
            <PlaygroundExampleFrame.Stage>
              <FileUploadSizesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Варианты</DemoSectionTitle>
          <DemoDescription>
            У корня — <code>appearance=&quot;dashed&quot;</code> и <code>&quot;solid&quot;</code>; у
            карточки — <code>variant=&quot;default&quot;</code> и <code>&quot;error&quot;</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={variantsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadVariantsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Состояния</DemoSectionTitle>
          <DemoDescription>
            Активная и <code>disabled</code> зона; карточки с прогрессом, успехом и ошибкой (
            <code>ItemTryAgain</code>). Подсветка при перетаскивании файла на зону —{" "}
            <code>data-dragover</code> на корне (проверьте в браузере).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={statesSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadStatesSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Контролируемый режим</DemoSectionTitle>
          <DemoDescription>
            Список выбранных файлов в состоянии React: <code>onFilesChange</code>,{" "}
            <code>multiple</code>, <code>accept</code>; сброс списка отдельной кнопкой.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={controlledSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadControlledSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Композиция</DemoSectionTitle>
          <DemoDescription>
            <code>DropBody</code> с <code>Title tone=&quot;muted&quot;</code> и{" "}
            <code>BrowseLink</code>, ряд <code>Chip</code> / <code>ChipLabel</code>;{" "}
            <code>inputRef</code> для программного открытия диалога с кнопок-источников.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={compositionSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadCompositionSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Full width</DemoSectionTitle>
          <DemoDescription>
            Зона растягивается на ширину родителя (<code>width: 100%</code> у <code>Root</code>) —
            типично для формы в колонке.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={fullWidthSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadFullWidthSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи: свой контент и accept</DemoSectionTitle>
          <DemoDescription>
            Замена стандартного тела зоны через <code>children</code> и ограничение типов файлов{" "}
            <code>accept=&quot;image/*&quot;</code>.
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={customChildrenSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadCustomChildrenSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи: круглая зона</DemoSectionTitle>
          <DemoDescription>
            Круглый контейнер через CSS, <code>DropBody</code>, общий <code>inputRef</code> с
            внешней кнопкой «Загрузить фото».
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={circleModalSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadCircleModalSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>Специфичные фичи: список с аватаром</DemoSectionTitle>
          <DemoDescription>
            Строка настроек профиля рядом с <code>Avatar</code> и кнопками — без отдельной зоны
            FileUpload (кнопки можно связать с общим <code>inputRef</code> в продукте).
          </DemoDescription>
          <PlaygroundExampleFrame.Root code={avatarRowsSource.trim()} previewLayout="stack">
            <PlaygroundExampleFrame.Stage>
              <FileUploadAvatarRowsSnippet />
            </PlaygroundExampleFrame.Stage>
          </PlaygroundExampleFrame.Root>
        </div>

        <div className="demoBlock">
          <DemoSectionTitle>API</DemoSectionTitle>
          <DemoApiTitle>FileUpload.Root</DemoApiTitle>
          <DemoDescription>
            Интерактивная зона на базе <code>label</code>, скрытый{" "}
            <code>input type=&quot;file&quot;</code>, drag-and-drop и контекст размера для вложенных
            слотов.
          </DemoDescription>
          <PlaygroundApiTable rows={fileUploadRootApiRows} />
          <DemoApiTitle>FileUpload.Icon</DemoApiTitle>
          <DemoDescription>Центрированная обёртка для иконки в зоне.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadIconApiRows} />
          <DemoApiTitle>FileUpload.Title</DemoApiTitle>
          <DemoDescription>Заголовок блока текста в зоне.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadTitleApiRows} />
          <DemoApiTitle>FileUpload.Hint</DemoApiTitle>
          <DemoDescription>
            Вторичная подсказка через <code>Hint.Root</code> с размером из контекста.
          </DemoDescription>
          <PlaygroundApiTable rows={fileUploadHintApiRows} />
          <DemoApiTitle>FileUpload.BrowseLabel</DemoApiTitle>
          <DemoDescription>
            Стилизованная подпись «Browse» (pointer-events: none на зоне).
          </DemoDescription>
          <PlaygroundApiTable rows={fileUploadBrowseLabelApiRows} />
          <DemoApiTitle>FileUpload.BrowseLink</DemoApiTitle>
          <DemoDescription>
            Кнопка-ссылка в тексте; клик не всплывает к <code>label</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={fileUploadBrowseLinkApiRows} />
          <DemoApiTitle>FileUpload.DropBody</DemoApiTitle>
          <DemoDescription>
            Колонка для модальных композиций; ослабляет pointer-events на зоне.
          </DemoDescription>
          <PlaygroundApiTable rows={fileUploadDropBodyApiRows} />
          <DemoApiTitle>FileUpload.ActionsRow</DemoApiTitle>
          <DemoDescription>Горизонтальный ряд чипов-источников.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadActionsRowApiRows} />
          <DemoApiTitle>FileUpload.Chip</DemoApiTitle>
          <DemoDescription>
            Кнопка-источник; останавливает всплытие, не открывает диалог сама по себе.
          </DemoDescription>
          <PlaygroundApiTable rows={fileUploadChipApiRows} />
          <DemoApiTitle>FileUpload.ChipLabel</DemoApiTitle>
          <DemoDescription>Текстовая часть чипа.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadChipLabelApiRows} />
          <DemoApiTitle>FileUpload.FormatBadge</DemoApiTitle>
          <DemoDescription>Бейдж расширения файла на карточке.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadFormatBadgeApiRows} />
          <DemoApiTitle>FileUpload.Item</DemoApiTitle>
          <DemoDescription>Карточка одного файла в списке.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemApiRows} />
          <DemoApiTitle>FileUpload.ItemRow</DemoApiTitle>
          <DemoDescription>Горизонтальный ряд: бейдж, основной блок, действия.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemRowApiRows} />
          <DemoApiTitle>FileUpload.ItemMain</DemoApiTitle>
          <DemoDescription>Правая колонка с текстом и метаданными.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemMainApiRows} />
          <DemoApiTitle>FileUpload.ItemStack</DemoApiTitle>
          <DemoDescription>Вертикальный стек для ошибки и «Try again».</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemStackApiRows} />
          <DemoApiTitle>FileUpload.ItemTextGroup</DemoApiTitle>
          <DemoDescription>Группа имени и мета-строки.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemTextGroupApiRows} />
          <DemoApiTitle>FileUpload.ItemTryAgain</DemoApiTitle>
          <DemoDescription>Кнопка повторной загрузки.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemTryAgainApiRows} />
          <DemoApiTitle>FileUpload.ItemName</DemoApiTitle>
          <DemoDescription>Строка имени файла и статуса.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemNameApiRows} />
          <DemoApiTitle>FileUpload.ItemMeta</DemoApiTitle>
          <DemoDescription>Вторичная строка (размер, прогресс в КБ).</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemMetaApiRows} />
          <DemoApiTitle>FileUpload.ItemMetaSep</DemoApiTitle>
          <DemoDescription>Разделитель «·» между частями меты.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemMetaSepApiRows} />
          <DemoApiTitle>FileUpload.ItemActions</DemoApiTitle>
          <DemoDescription>Область кнопок справа в ряду.</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemActionsApiRows} />
          <DemoApiTitle>FileUpload.ItemFooter</DemoApiTitle>
          <DemoDescription>Нижняя зона под рядом (доп. действия).</DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemFooterApiRows} />
          <DemoApiTitle>FileUpload.ItemProgress</DemoApiTitle>
          <DemoDescription>
            Обёртка прогресса; по умолчанию <code>ProgressBar.Root</code> при переданном{" "}
            <code>value</code>.
          </DemoDescription>
          <PlaygroundApiTable rows={fileUploadItemProgressApiRows} />
        </div>
      </div>
    </PlaygroundDocPage>
  );
}
