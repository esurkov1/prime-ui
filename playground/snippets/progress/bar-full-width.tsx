import { ProgressBar } from "@/components/progress-bar/ProgressBar";

/** Корень полосы на всю ширину родителя: сравнение узкого и широкого контейнера. */
export default function ProgressBarFullWidthSnippet() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
      <div style={{ width: 200, minWidth: 0 }}>
        <ProgressBar.Root value={55} label="Контейнер 200px" size="m" />
      </div>
      <div style={{ flex: "1 1 280px", minWidth: 0, maxWidth: 480 }}>
        <ProgressBar.Root value={55} label="Гибкий контейнер" size="m" />
      </div>
    </div>
  );
}
