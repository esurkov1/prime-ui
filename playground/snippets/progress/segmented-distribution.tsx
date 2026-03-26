import { SegmentedProgressBar } from "@/components/segmented-progress-bar/SegmentedProgressBar";

export default function SegmentedDistributionSnippet() {
  return (
    <SegmentedProgressBar.Root
      label="Результаты проверки"
      segments={[
        { value: 30, label: "Ошибки", tone: "danger" },
        { value: 25, label: "Ожидание", tone: "warning" },
        { value: 35, label: "Успех", tone: "success" },
        { value: 10, label: "Прочее", tone: "neutral" },
      ]}
    />
  );
}
