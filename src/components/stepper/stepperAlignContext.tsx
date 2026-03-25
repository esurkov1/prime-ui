import { createComponentContext } from "@/internal/context";

/** Состояние шага в примитивных степперах: `default` соответствует ожиданию до активации (аналог «pending» у высокоуровневого Stepper). */
export type StepperAlignItemState = "completed" | "active" | "default";

type StepperAlignItemContextValue = {
  state: StepperAlignItemState;
};

export const [StepperAlignItemProvider, useStepperAlignItemState] =
  createComponentContext<StepperAlignItemContextValue>("StepperAlign.Item");

export function StepperAlignCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M15.1 7.453 8.726 13.82 4.9 10l1.275-1.274 2.55 2.548 5.1-5.094L15.1 7.453Z"
      />
    </svg>
  );
}
