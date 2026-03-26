import { SegmentedProgressBar } from "@/components/segmented-progress-bar/SegmentedProgressBar";

export default function SegmentedCompositionSnippet() {
  return (
    <SegmentedProgressBar.Root
      label="Распределение по статусам"
      segments={[
        { value: 30, label: "Ошибки", tone: "danger" },
        { value: 25, label: "Ожидание", tone: "pending" },
        { value: 35, label: "Успех", tone: "success" },
        { value: 10, label: "Прочее", tone: "neutral" },
      ]}
    />
  );
}
