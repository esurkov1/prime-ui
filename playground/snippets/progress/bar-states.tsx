import { ProgressBar } from "@/components/progress-bar/ProgressBar";

/** Типичные этапы задачи: пусто, в процессе, завершено — одинаковый max, разные value. */
export default function ProgressBarStatesSnippet() {
  return (
    <>
      <ProgressBar.Root value={0} max={100} label="Не начато" />
      <ProgressBar.Root value={62} max={100} label="Выполняется" />
      <ProgressBar.Root value={100} max={100} label="Готово" />
    </>
  );
}
