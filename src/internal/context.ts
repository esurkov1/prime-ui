import * as React from "react";

type ComponentContextOptions = {
  /**
   * What the parts must be inside, as the error names it. Default: the name itself when it is a
   * part (`"Radio.Group"`, `"Stepper.Item"`), else its root (`"Input"` → `Input.Root`).
   */
  parent?: string;
};

/**
 * Factory for creating typed React Context + a guard hook that throws
 * a descriptive error when used outside the provider.
 * Standardizes the composable-component pattern across prime-ui-kit.
 *
 * @example
 * const [InputProvider, useInputContext] = createComponentContext<InputContextValue>("Input");
 * const [GroupProvider, useGroup] = createComponentContext<GroupValue>("Radio.Group");
 */
export function createComponentContext<T>(
  displayName: string,
  {
    parent = displayName.includes(".") ? displayName : `${displayName}.Root`,
  }: ComponentContextOptions = {},
) {
  const Ctx = React.createContext<T | null>(null);
  Ctx.displayName = `${displayName}Context`;

  /** The context value; `part` names the caller in the error (`"ChartFrame.Legend"`). */
  function useComponentContext(part?: string): T {
    const value = React.useContext(Ctx);
    if (value === null) {
      throw new Error(
        `[prime-ui-kit] \`${part ?? displayName}\` sub-component must be used inside \`${parent}\`.`,
      );
    }
    return value;
  }

  return [Ctx.Provider, useComponentContext] as const;
}
