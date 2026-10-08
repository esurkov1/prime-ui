import * as React from "react";

type UseControllableStateParams<T> = {
  value?: T;
  defaultValue: T;
  onChange?: (nextValue: T) => void;
};

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>) {
  const [internalValue, setInternalValue] = React.useState<T>(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  // Read synchronously by `setValue`: two functional updates in one handler chain on each other.
  const currentValueRef = React.useRef(currentValue);
  currentValueRef.current = currentValue;

  const setValue = React.useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const previousValue = currentValueRef.current;
      const computedValue =
        typeof nextValue === "function" ? (nextValue as (prev: T) => T)(previousValue) : nextValue;

      if (Object.is(previousValue, computedValue)) {
        return;
      }

      currentValueRef.current = computedValue;
      if (!isControlled) {
        setInternalValue(computedValue);
      }

      onChange?.(computedValue);
    },
    [isControlled, onChange],
  );

  return [currentValue, setValue] as const;
}
