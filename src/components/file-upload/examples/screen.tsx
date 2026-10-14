/** A media library of a catalog object as a work screen: the title, the object and a PageToolbar with sections, search, order and upload in the app header; uploads in FileUpload tiles through a queue; a grid of Thumbnails that open MediaViewer out of the tile or are picked for bulk download and delete; a Skeleton first load and a filtered empty state in a Crossfade — `trigger`, `layout`. */
import {
  AppHeader,
  Button,
  ConfirmDialog,
  Crossfade,
  EmptyPage,
  FileUpload,
  formatFileSize,
  Icon,
  MediaViewer,
  type MediaViewerItem,
  PageContent,
  PageToolbar,
  SegmentedControl,
  Select,
  Skeleton,
  SmartFilter,
  Thumbnail,
  Typography,
  type UploadContext,
  type UploadItem,
  useNotifications,
  useUploadQueue,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./screen.module.css";

type Kind = "photo" | "video" | "document";
type Section = "all" | Kind;
type Order = "new" | "old" | "name";

type Media = {
  id: string;
  kind: Kind;
  name: string;
  /** The full file: the picture, the video or the scan the viewer shows. */
  src: string;
  /** A small copy for the grid; the viewer shows it at once while `src` loads. */
  thumbnail?: string;
  width?: number;
  height?: number;
  size: number;
  added: string;
};

const CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const photo = (seed: string): Pick<Media, "src" | "thumbnail" | "width" | "height"> => ({
  src: `https://picsum.photos/seed/tower-${seed}/1600/1200`,
  thumbnail: `https://picsum.photos/seed/tower-${seed}/480/360`,
  width: 1600,
  height: 1200,
});

const scan = (seed: string): Pick<Media, "src" | "thumbnail" | "width" | "height"> => ({
  src: `https://picsum.photos/seed/tower-${seed}/1240/1754`,
  thumbnail: `https://picsum.photos/seed/tower-${seed}/360/510`,
  width: 1240,
  height: 1754,
});

/** What the server returns for the object's library. */
const LIBRARY: Media[] = [
  {
    id: "m01",
    kind: "photo",
    name: "Фасад с Невского.jpg",
    size: 2_480_000,
    added: "2026-10-09",
    ...photo("facade"),
  },
  {
    id: "m02",
    kind: "photo",
    name: "Входная группа.jpg",
    size: 1_960_000,
    added: "2026-10-09",
    ...photo("entrance"),
  },
  {
    id: "m03",
    kind: "video",
    name: "Обход этажа 7.mp4",
    size: 48_200_000,
    added: "2026-10-08",
    src: CLIP,
    width: 1280,
    height: 720,
  },
  {
    id: "m04",
    kind: "photo",
    name: "Лобби и ресепшен.jpg",
    size: 2_120_000,
    added: "2026-10-07",
    ...photo("lobby"),
  },
  {
    id: "m05",
    kind: "photo",
    name: "Опенспейс, этаж 7.jpg",
    size: 2_730_000,
    added: "2026-10-07",
    ...photo("openspace"),
  },
  {
    id: "m06",
    kind: "document",
    name: "Поэтажный план.jpg",
    size: 860_000,
    added: "2026-10-06",
    ...scan("plan"),
  },
  {
    id: "m07",
    kind: "photo",
    name: "Переговорная «Нева».jpg",
    size: 1_840_000,
    added: "2026-10-05",
    ...photo("meeting"),
  },
  {
    id: "m08",
    kind: "video",
    name: "Подъезд к парковке.mp4",
    size: 31_500_000,
    added: "2026-10-04",
    src: CLIP,
    width: 1280,
    height: 720,
  },
  {
    id: "m09",
    kind: "photo",
    name: "Терраса на крыше.jpg",
    size: 3_050_000,
    added: "2026-10-03",
    ...photo("terrace"),
  },
  {
    id: "m10",
    kind: "document",
    name: "Выписка из ЕГРН.jpg",
    size: 640_000,
    added: "2026-10-02",
    ...scan("egrn"),
  },
  {
    id: "m11",
    kind: "photo",
    name: "Паркинг, уровень −1.jpg",
    size: 1_720_000,
    added: "2026-09-30",
    ...photo("parking"),
  },
  {
    id: "m12",
    kind: "document",
    name: "Техпаспорт, стр. 1.jpg",
    size: 720_000,
    added: "2026-09-28",
    ...scan("passport"),
  },
];

const SECTIONS: { value: Section; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "photo", label: "Фото" },
  { value: "video", label: "Видео" },
  { value: "document", label: "Документы" },
];

const ORDERS: { value: Order; label: string }[] = [
  { value: "new", label: "Сначала новые" },
  { value: "old", label: "Сначала старые" },
  { value: "name", label: "По названию" },
];

const FALLBACK_ICON = {
  photo: "object.image",
  video: "action.video",
  document: "object.document",
} as const;

/** Placeholder tiles of the first load: the grid's own geometry. */
const PLACEHOLDER_TILES = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];

/** How long a finished upload keeps its tile, so its ring fills and the disk fades before it moves. */
const DONE_HOLD_MS = 900;

const DAY = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });

const filesWord = (count: number) => {
  const tens = count % 100;
  const units = count % 10;
  if (tens >= 11 && tens <= 14) return "файлов";
  if (units === 1) return "файл";
  if (units >= 2 && units <= 4) return "файла";
  return "файлов";
};

const today = () => new Date().toISOString().slice(0, 10);

/** Upload attempts per file, and how many files have started: the stand-in drops every third one once. */
const attempts = new WeakMap<File, number>();
let started = 0;

/** A stand-in for the server: sends the file in steps and answers with its address (a local URL here). */
function sendFile(file: File, { signal, onProgress }: UploadContext): Promise<string> {
  const attempt = (attempts.get(file) ?? 0) + 1;
  attempts.set(file, attempt);
  if (attempt === 1) started += 1;
  const flaky = attempt === 1 && started % 3 === 0;
  return new Promise((resolve, reject) => {
    let sent = 0;
    const timer = window.setInterval(() => {
      sent = Math.min(1, sent + 0.08 + Math.random() * 0.1);
      if (flaky && sent > 0.5) {
        window.clearInterval(timer);
        reject(new Error("Нет связи с сервером"));
        return;
      }
      onProgress(sent);
      if (sent < 1) return;
      window.clearInterval(timer);
      resolve(URL.createObjectURL(file));
    }, 350);
    signal.addEventListener("abort", () => {
      window.clearInterval(timer);
      reject(signal.reason);
    });
  });
}

/** A finished upload as a file of the library. */
const toMedia = (item: UploadItem<string>): Media => ({
  id: item.id,
  kind: item.file.type.startsWith("video/") ? "video" : "photo",
  name: item.file.name,
  src: item.result ?? "",
  size: item.file.size,
  added: today(),
});

const toViewerItem = (media: Media): MediaViewerItem => ({
  type: media.kind === "video" ? "video" : "image",
  src: media.src,
  thumbnail: media.thumbnail,
  width: media.width,
  height: media.height,
  alt: media.name,
  caption: `${media.name} · ${formatFileSize(media.size)} · ${DAY.format(new Date(media.added))}`,
});

export default function FileUploadScreenExample() {
  const { notify } = useNotifications();
  const [loading, setLoading] = React.useState(true);
  const [library, setLibrary] = React.useState<Media[]>([]);
  const [section, setSection] = React.useState<Section>("all");
  const [search, setSearch] = React.useState("");
  const [order, setOrder] = React.useState<Order>("new");
  const [selecting, setSelecting] = React.useState(false);
  const [selected, setSelected] = React.useState<ReadonlySet<string>>(new Set());
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const queue = useUploadQueue({ upload: sendFile, concurrency: 2 });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const tiles = React.useRef(new Map<string, HTMLElement>());
  const moving = React.useRef(new Set<string>());

  // First load: the server answers after a moment; the grid holds its shape meanwhile.
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setLibrary(LIBRARY);
      setLoading(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  // A finished upload leaves its tile for the library, first in it.
  const { items: uploads, remove: removeUpload } = queue;
  React.useEffect(() => {
    for (const item of uploads) {
      if (item.status !== "done" || moving.current.has(item.id)) continue;
      moving.current.add(item.id);
      window.setTimeout(() => {
        setLibrary((current) => [toMedia(item), ...current]);
        removeUpload(item.id);
      }, DONE_HOLD_MS);
    }
  }, [uploads, removeUpload]);

  const query = search.trim().toLowerCase();
  const visible = library
    .filter(
      (media) =>
        (section === "all" || media.kind === section) && media.name.toLowerCase().includes(query),
    )
    .sort((a, b) => {
      if (order === "name") return a.name.localeCompare(b.name, "ru");
      const byDate = a.added.localeCompare(b.added);
      return order === "new" ? -byDate : byDate;
    });
  const viewerItems = visible.map(toViewerItem);
  const count = (value: Section) =>
    value === "all" ? library.length : library.filter((media) => media.kind === value).length;

  const state = loading
    ? "loading"
    : visible.length > 0
      ? `ready:${section}:${order}`
      : library.length > 0
        ? "nothing"
        : "empty";

  const toggle = (id: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  const stopSelecting = () => {
    setSelecting(false);
    setSelected(new Set());
  };

  const resetFilters = () => {
    setSection("all");
    setSearch("");
  };

  const download = () => {
    notify({
      tone: "success",
      title: `Скачиваем ${selected.size} ${filesWord(selected.size)}`,
      description: "Архив сохранится в папку загрузок.",
    });
    stopSelecting();
  };

  // A stand-in for the delete request: the dialog stays busy until it answers.
  const removeSelected = () =>
    new Promise<void>((resolve) => window.setTimeout(resolve, 800)).then(() => {
      const removed = selected.size;
      for (const media of library) {
        if (selected.has(media.id) && media.src.startsWith("blob:")) URL.revokeObjectURL(media.src);
      }
      setLibrary((current) => current.filter((media) => !selected.has(media.id)));
      stopSelecting();
      notify({ tone: "success", title: `Удалено: ${removed} ${filesWord(removed)}` });
    });

  const openAt = (at: number) => {
    setIndex(at);
    setOpen(true);
  };

  const totalSize = visible.reduce((sum, media) => sum + media.size, 0);

  return (
    <>
      {/* A work screen: in an app this header fills the shell's `header` slot and carries the page —
          the only h1, the object it belongs to and the page's tools; main has no PageContent.Header. */}
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title>
            Медиатека
            <AppHeader.Description>БЦ «Северная башня», Невский пр., 112</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Tools>
          <SmartFilter.Root
            fields={[]}
            search={search}
            onSearchChange={setSearch}
            labels={{ searchPlaceholder: "Поиск по названию" }}
          >
            <PageToolbar.Root aria-label="Медиатека">
              <PageToolbar.Tools>
                <SmartFilter.Toolbar />
              </PageToolbar.Tools>
              <PageToolbar.Sections>
                <SegmentedControl.Root
                  fullWidth
                  value={section}
                  onValueChange={(value) => setSection(value as Section)}
                  aria-label="Раздел"
                >
                  {SECTIONS.map((item) => (
                    <SegmentedControl.Item key={item.value} value={item.value}>
                      {item.label}
                      {loading ? null : (
                        <SegmentedControl.Count>{count(item.value)}</SegmentedControl.Count>
                      )}
                    </SegmentedControl.Item>
                  ))}
                </SegmentedControl.Root>
              </PageToolbar.Sections>
              <PageToolbar.View>
                <Select.Root value={order} onValueChange={(value) => setOrder(value as Order)}>
                  <Select.Trigger aria-label="Порядок">
                    <Select.TriggerIcon>
                      <Icon name="sort.descending" />
                    </Select.TriggerIcon>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {ORDERS.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </PageToolbar.View>
              <PageToolbar.Actions>
                <Button.Root onClick={() => inputRef.current?.click()}>
                  <Button.Icon>
                    <Icon name="action.upload" />
                  </Button.Icon>
                  Загрузить
                </Button.Root>
              </PageToolbar.Actions>
            </PageToolbar.Root>
          </SmartFilter.Root>
        </AppHeader.Tools>
      </AppHeader.Root>

      <PageContent.Root>
        <PageContent.Body>
          {/* Uploads in flight: the add tile is also the drop zone; a done file moves into the grid. */}
          <FileUpload.Root
            label="Новые файлы"
            hint="Фото и видео до 200 МБ. Загруженные появятся в медиатеке первыми."
            trigger="tile"
            layout="grid"
            accept="image/*,video/*"
            multiple
            queue={queue}
            inputRef={inputRef}
          />

          <PageContent.Section
            label="Файлы"
            description={
              <span aria-live="polite">
                {selecting
                  ? `Выбрано: ${selected.size}`
                  : loading
                    ? "Загружаем…"
                    : `${visible.length} ${filesWord(visible.length)} · ${formatFileSize(totalSize)}`}
              </span>
            }
          >
            <PageContent.Actions>
              <Crossfade state={selecting ? "select" : "browse"}>
                {selecting ? (
                  <div className={styles.bar}>
                    <Button.Root
                      variant="soft"
                      tone="neutral"
                      disabled={selected.size === 0}
                      onClick={download}
                    >
                      <Button.Icon>
                        <Icon name="action.download" />
                      </Button.Icon>
                      Скачать
                    </Button.Root>
                    <ConfirmDialog.Root
                      title={`Удалить ${selected.size} ${filesWord(selected.size)}?`}
                      description="Файлы пропадут из карточки объекта в каталоге. Восстановить их будет нельзя."
                      confirmLabel="Удалить"
                      onConfirm={removeSelected}
                    >
                      <ConfirmDialog.Trigger>
                        <Button.Root variant="outline" tone="danger" disabled={selected.size === 0}>
                          <Button.Icon>
                            <Icon name="action.delete" />
                          </Button.Icon>
                          Удалить
                        </Button.Root>
                      </ConfirmDialog.Trigger>
                    </ConfirmDialog.Root>
                    <Button.Root variant="ghost" tone="neutral" onClick={stopSelecting}>
                      Отмена
                    </Button.Root>
                  </div>
                ) : (
                  <div className={styles.bar}>
                    <Button.Root
                      variant="soft"
                      tone="neutral"
                      disabled={loading || visible.length === 0}
                      onClick={() => setSelecting(true)}
                    >
                      <Button.Icon>
                        <Icon name="action.check" />
                      </Button.Icon>
                      Выбрать
                    </Button.Root>
                  </div>
                )}
              </Crossfade>
            </PageContent.Actions>

            <Crossfade state={state} aria-busy={loading}>
              {loading ? (
                <ul className={styles.grid}>
                  {PLACEHOLDER_TILES.map((key) => (
                    <li key={key} className={styles.tile}>
                      <Skeleton shape="block" className={styles.picture} />
                      <div className={styles.tileText}>
                        <Skeleton size="s" className={styles.nameBar} />
                        <Skeleton size="xs" className={styles.metaBar} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}

              {state.startsWith("ready") ? (
                <ul className={styles.grid}>
                  {visible.map((media, at) => {
                    const picture =
                      media.kind === "video" ? (
                        <Thumbnail.Video src={media.src} aria-label={media.name} />
                      ) : (
                        <Thumbnail.Image
                          src={media.thumbnail ?? media.src}
                          fit={media.kind === "document" ? "contain" : "cover"}
                        />
                      );
                    const fallback = (
                      <Thumbnail.Fallback>
                        <Icon name={FALLBACK_ICON[media.kind]} />
                      </Thumbnail.Fallback>
                    );
                    return (
                      <li key={media.id} className={styles.tile}>
                        {/* Browsing, a press opens the viewer out of the tile; selecting, it picks the file. */}
                        {selecting ? (
                          <Thumbnail.Root
                            fullWidth
                            ratio="4:3"
                            aria-label={media.name}
                            checked={selected.has(media.id)}
                            onCheckedChange={(checked) => toggle(media.id, checked)}
                          >
                            {picture}
                            {fallback}
                          </Thumbnail.Root>
                        ) : (
                          <Thumbnail.Root asChild fullWidth ratio="4:3">
                            <button
                              ref={(node) => {
                                if (node) tiles.current.set(media.id, node);
                                else tiles.current.delete(media.id);
                              }}
                              type="button"
                              aria-label={`Открыть: ${media.name}`}
                              aria-haspopup="dialog"
                              onClick={() => openAt(at)}
                            >
                              {picture}
                              {fallback}
                            </button>
                          </Thumbnail.Root>
                        )}
                        <div className={styles.tileText}>
                          <Typography as="span" variant="body-s" truncate title={media.name}>
                            {media.name}
                          </Typography>
                          <Typography as="span" variant="caption" tone="muted">
                            {formatFileSize(media.size)} · {DAY.format(new Date(media.added))}
                          </Typography>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              {state === "nothing" ? (
                <EmptyPage.Root size="s" role="status" aria-labelledby="media-nothing">
                  <EmptyPage.Icon>
                    <Icon name="action.search" />
                  </EmptyPage.Icon>
                  <EmptyPage.Title as="h3" id="media-nothing">
                    Ничего не найдено
                  </EmptyPage.Title>
                  <EmptyPage.Description>
                    В этом разделе нет файлов с таким названием.
                  </EmptyPage.Description>
                  <EmptyPage.Actions>
                    <Button.Root variant="soft" tone="neutral" onClick={resetFilters}>
                      Показать все файлы
                    </Button.Root>
                  </EmptyPage.Actions>
                </EmptyPage.Root>
              ) : null}

              {state === "empty" ? (
                <EmptyPage.Root size="s" aria-labelledby="media-empty">
                  <EmptyPage.Icon tone="accent">
                    <Icon name="object.image" />
                  </EmptyPage.Icon>
                  <EmptyPage.Title as="h3" id="media-empty">
                    Файлов пока нет
                  </EmptyPage.Title>
                  <EmptyPage.Description>
                    Перетащите фото и видео объекта в поле выше или нажмите «Загрузить».
                  </EmptyPage.Description>
                </EmptyPage.Root>
              ) : null}
            </Crossfade>
          </PageContent.Section>

          <MediaViewer
            items={viewerItems}
            open={open}
            onOpenChange={setOpen}
            index={index}
            onIndexChange={setIndex}
            getOrigin={(at) => tiles.current.get(visible[at]?.id ?? "") ?? null}
            thumbnails
            renderActions={(item) => (
              <Button.Root shape="circle" variant="shade" aria-label="Скачать файл" asChild>
                <a href={item.src} download>
                  <Button.Icon>
                    <Icon name="action.download" />
                  </Button.Icon>
                </a>
              </Button.Root>
            )}
          />
        </PageContent.Body>
      </PageContent.Root>
    </>
  );
}
