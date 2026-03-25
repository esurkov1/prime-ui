import * as React from "react";

export type ResponsiveMonthsBreakpoints = {
  /** Минимальная ширина для двух колонок месяцев */
  twoColumns: number;
};

const DEFAULT_BREAKPOINTS: ResponsiveMonthsBreakpoints = {
  twoColumns: 520,
};

/**
 * Число колонок календаря (1 или 2) по ширине DOM-элемента-контейнера.
 *
 * Принимает `HTMLElement | null` напрямую (не RefObject), поэтому правильно
 * реагирует на монтирование через callback-ref + state в компоненте-потребителе:
 *
 * ```tsx
 * const [el, setEl] = useState<HTMLElement | null>(null);
 * const months = useResponsiveMonths(breakpoints, el);
 * // <div ref={setEl}>...</div>
 * ```
 */
export function useResponsiveMonths(
  breakpoints: ResponsiveMonthsBreakpoints = DEFAULT_BREAKPOINTS,
  container: HTMLElement | null = null,
): 1 | 2 {
  const { twoColumns } = breakpoints;
  const [count, setCount] = React.useState<1 | 2>(1);

  React.useEffect(() => {
    if (!container) return;

    let rafId: number | null = null;

    const syncByWidth = (width: number) => {
      setCount(width >= twoColumns ? 2 : 1);
    };

    const measure = () => {
      // getBoundingClientRect учитывает CSS-трансформы и более надёжен чем clientWidth
      const width =
        container.getBoundingClientRect().width || container.offsetWidth || container.clientWidth;

      if (width > 0) {
        syncByWidth(width);
      } else {
        // Элемент ещё не отрисован — повторить на следующем кадре
        rafId = requestAnimationFrame(measure);
      }
    };

    // Первоначальное измерение
    measure();

    if (typeof ResizeObserver === "undefined")
      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
      };

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      // contentRect.width может быть 0 при скрытом элементе; fallback на BoundingRect
      const w =
        entry.contentRect.width || (entry.target as HTMLElement).getBoundingClientRect().width;
      syncByWidth(w);
    });

    ro.observe(container);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [container, twoColumns]);

  return count;
}
