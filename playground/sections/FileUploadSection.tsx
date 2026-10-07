import FileUploadAvatarUploadExample from "@/components/file-upload/examples/avatar-upload";
import avatarSource from "@/components/file-upload/examples/avatar-upload.tsx?raw";
import FileUploadFileListExample from "@/components/file-upload/examples/file-list";
import controlledSource from "@/components/file-upload/examples/file-list.tsx?raw";
import FileUploadInCardExample from "@/components/file-upload/examples/in-card";
import compositionSource from "@/components/file-upload/examples/in-card.tsx?raw";
import FileUploadSizesExample from "@/components/file-upload/examples/sizes";
import sizesSource from "@/components/file-upload/examples/sizes.tsx?raw";
import FileUploadStatesExample from "@/components/file-upload/examples/states";
import statesSource from "@/components/file-upload/examples/states.tsx?raw";
import FileUploadVariantsExample from "@/components/file-upload/examples/variants";
import variantsSource from "@/components/file-upload/examples/variants.tsx?raw";
import { PageContent } from "@/components/page-content/PageContent";
import { SurfaceGallery } from "../components/ExampleSurface";
import { PlaygroundApiTable } from "../components/PlaygroundApiTable";
import {
  DemoApiTitle,
  DemoDescription,
  DemoSectionTitle,
} from "../components/PlaygroundDemoTypography";
import { PlaygroundExampleFrame } from "../components/PlaygroundExampleFrame";
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
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>FileUpload</PageContent.Title>
        <PageContent.Description measure="full">
          Зона выбора файлов: <code>label</code> со скрытым <code>input type=&quot;file&quot;</code>
          , клик открывает системный диалог, файлы можно перетащить. Результат приходит в{" "}
          <code>onFilesChange(File[])</code>; список, загрузку на сервер и прогресс ведёт
          приложение, а строки файлов собираются из презентационных слотов{" "}
          <code>FileUpload.Item</code>.
        </PageContent.Description>
      </PageContent.Header>
      <PageContent.Body>
        <div className="demoExamples">
          <div className="demoBlock">
            <DemoSectionTitle>Размеры</DemoSectionTitle>
            <DemoDescription>
              <code>size</code> <code>xs</code> · <code>s</code> · <code>m</code> · <code>l</code> ·{" "}
              <code>xl</code> у зоны (поля, радиус, круг иконки и кнопка «Выбрать» высотой контрола)
              и у строки файла (кегль, бейдж формата). Зона и строка всегда тянутся на ширину
              родителя.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={sizesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <FileUploadSizesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Оформление зоны и поверхности</DemoSectionTitle>
            <DemoDescription>
              <code>variant=&quot;dashed&quot;</code> (по умолчанию) — заливка поля и пунктир;{" "}
              <code>&quot;solid&quot;</code> — только заливка, для карточек и модалок. Заливка
              следует контексту поля: белая на холсте, серая внутри карточки и всплывающей панели.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={variantsSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <SurfaceGallery surfaces={["canvas", "surface", "raised"]}>
                  <FileUploadVariantsExample />
                </SurfaceGallery>
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Состояния</DemoSectionTitle>
            <DemoDescription>
              Зона: наведите курсор — заливка темнеет; Tab — кольцо фокуса по внутреннему краю зоны,
              Enter или пробел открывают диалог; перетащите файл из системы — зона получает{" "}
              <code>data-state=&quot;active&quot;</code> и подсвечивается акцентом;{" "}
              <code>disabled</code> — приглушённая заливка, drop игнорируется. Строки файла:
              загрузка с <code>ItemProgress</code>, готовый файл с действием, ошибка —{" "}
              <code>invalid</code> и <code>ItemTryAgain</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={statesSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <FileUploadStatesExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Список выбранных файлов</DemoSectionTitle>
            <DemoDescription>
              <code>multiple</code> + <code>accept</code>; каждый вызов <code>onFilesChange</code>{" "}
              дописывает файлы в состояние, строки удаляются кнопкой. Значение input сбрасывается
              после выбора, поэтому тот же файл можно добавить снова.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={controlledSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <FileUploadFileListExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Композиция: документы к заявке</DemoSectionTitle>
            <DemoDescription>
              Зона <code>solid</code> в карточке со своим телом: <code>DropBody</code>,{" "}
              <code>Title tone=&quot;muted&quot;</code> со ссылкой <code>BrowseLink</code> и чипы
              источников <code>ActionsRow</code> / <code>Chip</code>. Вложенные кнопки не всплывают
              к <code>label</code>, поэтому диалог открывается через общий{" "}
              <code>inputRef.current?.click()</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={compositionSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <FileUploadInCardExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>Загрузка аватара</DemoSectionTitle>
            <DemoDescription>
              Круглая зона вокруг <code>Avatar</code> принимает только изображения (
              <code>accept</code>), превью — через <code>URL.createObjectURL</code>. Кнопки рядом
              открывают тот же input через <code>inputRef</code>.
            </DemoDescription>
            <PlaygroundExampleFrame.Root code={avatarSource.trim()}>
              <PlaygroundExampleFrame.Stage>
                <FileUploadAvatarUploadExample />
              </PlaygroundExampleFrame.Stage>
            </PlaygroundExampleFrame.Root>
          </div>

          <div className="demoBlock">
            <DemoSectionTitle>API</DemoSectionTitle>
            <DemoApiTitle>FileUpload.Root</DemoApiTitle>
            <DemoDescription>
              Интерактивная зона на базе <code>label</code>, скрытый{" "}
              <code>input type=&quot;file&quot;</code>, drag-and-drop и контекст размера для
              вложенных слотов.
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
              Декоративная кнопка «Выбрать» того же яруса; кликабельна вся зона.
            </DemoDescription>
            <PlaygroundApiTable rows={fileUploadBrowseLabelApiRows} />
            <DemoApiTitle>FileUpload.BrowseLink</DemoApiTitle>
            <DemoDescription>
              Кнопка-ссылка в тексте; клик не всплывает к <code>label</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={fileUploadBrowseLinkApiRows} />
            <DemoApiTitle>FileUpload.DropBody</DemoApiTitle>
            <DemoDescription>
              Колонка своего тела зоны с отступами яруса; pointer-events: none, вложенные кнопки
              включают их обратно.
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
            <DemoDescription>
              Строка одного файла: прозрачная подложка <code>fill-subtle</code>, работает на любой
              поверхности. Ширину задаёт контейнер.
            </DemoDescription>
            <PlaygroundApiTable rows={fileUploadItemApiRows} />
            <DemoApiTitle>FileUpload.ItemRow</DemoApiTitle>
            <DemoDescription>Горизонтальный ряд: бейдж, основной блок, действия.</DemoDescription>
            <PlaygroundApiTable rows={fileUploadItemRowApiRows} />
            <DemoApiTitle>FileUpload.ItemMain</DemoApiTitle>
            <DemoDescription>Правая колонка с текстом и метаданными.</DemoDescription>
            <PlaygroundApiTable rows={fileUploadItemMainApiRows} />
            <DemoApiTitle>FileUpload.ItemStack</DemoApiTitle>
            <DemoDescription>Вертикальный стек для ошибки и «Попробовать снова».</DemoDescription>
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
              Обёртка прогресса; по умолчанию <code>ProgressBar</code> при переданном{" "}
              <code>value</code>.
            </DemoDescription>
            <PlaygroundApiTable rows={fileUploadItemProgressApiRows} />
          </div>
        </div>
      </PageContent.Body>
    </PageContent.Section>
  );
}
