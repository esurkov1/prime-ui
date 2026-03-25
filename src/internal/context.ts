import * as React from "react";

/**
 * Factory for creating typed React Context + a guard hook that throws
 * a descriptive error when used outside the provider.
 * Standardizes the composable-component pattern across prime-ui-kit.
 *
 * @example
 * const [InputProvider, useInputContext] = createComponentContext<InputContextValue>("Input");
 */
export function createComponentContext<T>(displayName: string) {
  const Ctx = React.createContext<T | null>(null);
  Ctx.displayName = `${displayName}Context`;

  function useComponentContext(): T {
    const value = React.useContext(Ctx);
    if (value === null) {
      throw new Error(
        `[prime-ui-kit] \`${displayName}\` sub-component must be used inside \`${displayName}.Root\`.`,
      );
    }
    return value;
  }

  return [Ctx.Provider, useComponentContext] as const;
}
