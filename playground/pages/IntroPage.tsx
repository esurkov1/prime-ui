import { PlaygroundDocPage } from "../components/PlaygroundDocPage";

export default function IntroPage() {
  return (
    <PlaygroundDocPage
      title="prime-ui-kit playground"
      description={
        <>
          У каждого компонента — своя страница. В меню слева категории упорядочены от примитивов к
          составным; в конце — «Вспомогательные компоненты» (layout и документация без отдельных
          превью в примерах). Заголовки категорий раскрываются. В свёрнутом сайдбаре список плоский.
          Внизу сайдбара доступны глобальные настройки: переключатель light/dark и селектор из 10
          премиальных цветовых тем (через <code>data-theme</code> и <code>data-theme-preset</code>{" "}
          на <code>document.documentElement</code>).
        </>
      }
    />
  );
}
