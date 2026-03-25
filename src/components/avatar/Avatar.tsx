import * as React from "react";

import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";

import styles from "./Avatar.module.css";

export type AvatarSize = "s" | "m" | "l" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";

export type AvatarImageStatus = "idle" | "loading" | "loaded" | "error";

type AvatarContextValue = {
  size: AvatarSize;
  imageStatus: AvatarImageStatus;
  setImageStatus: React.Dispatch<React.SetStateAction<AvatarImageStatus>>;
};

const [AvatarProvider, useAvatarContext] = createComponentContext<AvatarContextValue>("Avatar");

export type AvatarRootProps = {
  size?: AvatarSize;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarRootProps>(
  ({ size = "m", className, children, ...rest }, ref) => {
    const [imageStatus, setImageStatus] = React.useState<AvatarImageStatus>("idle");

    const value = React.useMemo(
      () => ({
        size,
        imageStatus,
        setImageStatus,
      }),
      [size, imageStatus],
    );

    return (
      <AvatarProvider value={value}>
        <div
          ref={ref}
          className={cx(styles.root, className)}
          {...toDataAttributes({ size })}
          {...rest}
        >
          {children}
        </div>
      </AvatarProvider>
    );
  },
);

AvatarRoot.displayName = "AvatarRoot";

export type AvatarImageProps = {
  src: string;
  alt?: string;
  className?: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;

type AvatarImageInnerProps = AvatarImageProps & {
  setImageStatus: React.Dispatch<React.SetStateAction<AvatarImageStatus>>;
};

const AvatarImageInner = React.forwardRef<HTMLImageElement, AvatarImageInnerProps>(
  ({ setImageStatus, src, alt = "", className, onLoad, onError, ...rest }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("loading");

    React.useLayoutEffect(() => {
      setImageStatus("loading");
      return () => {
        setImageStatus("idle");
      };
    }, [setImageStatus]);

    const handleLoad = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        setStatus("loaded");
        setImageStatus("loaded");
        onLoad?.(event);
      },
      [onLoad, setImageStatus],
    );

    const handleError = React.useCallback(
      (event: React.SyntheticEvent<HTMLImageElement>) => {
        setStatus("error");
        setImageStatus("error");
        onError?.(event);
      },
      [onError, setImageStatus],
    );

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cx(styles.image, className)}
        onLoad={handleLoad}
        onError={handleError}
        {...toDataAttributes({ status })}
        {...rest}
      />
    );
  },
);

AvatarImageInner.displayName = "AvatarImageInner";

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>((props, ref) => {
  const { setImageStatus } = useAvatarContext();
  return <AvatarImageInner key={props.src} ref={ref} setImageStatus={setImageStatus} {...props} />;
});

AvatarImage.displayName = "AvatarImage";

export type AvatarFallbackProps = {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

function AvatarFallback({ children, className, ...rest }: AvatarFallbackProps) {
  const { imageStatus } = useAvatarContext();

  return (
    <span
      className={cx(styles.fallback, className)}
      aria-hidden={imageStatus === "loaded" ? true : undefined}
      {...rest}
    >
      {children}
    </span>
  );
}

AvatarFallback.displayName = "AvatarFallback";

const AVATAR_ROOT_DISPLAY = "AvatarRoot";
const AVATAR_GROUP_OVERFLOW_DISPLAY = "AvatarGroupOverflow";

function getComponentDisplayName(type: unknown): string | undefined {
  if (typeof type === "function" || (typeof type === "object" && type !== null)) {
    return (type as { displayName?: string }).displayName;
  }
  return undefined;
}

function isAvatarRootElement(child: React.ReactElement): boolean {
  return child.type === AvatarRoot || getComponentDisplayName(child.type) === AVATAR_ROOT_DISPLAY;
}

export type AvatarGroupOverflowProps = {
  size?: AvatarSize;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const AvatarGroupOverflow = React.forwardRef<HTMLDivElement, AvatarGroupOverflowProps>(
  ({ size = "m", className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx(styles.groupOverflow, className)}
      {...toDataAttributes({ size })}
      {...rest}
    >
      {children}
    </div>
  ),
);

AvatarGroupOverflow.displayName = AVATAR_GROUP_OVERFLOW_DISPLAY;

function isAvatarGroupOverflowElement(child: React.ReactElement): boolean {
  return (
    child.type === AvatarGroupOverflow ||
    getComponentDisplayName(child.type) === AVATAR_GROUP_OVERFLOW_DISPLAY
  );
}

function injectAvatarGroupSize(children: React.ReactNode, size: AvatarSize): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    if (child.type === React.Fragment) {
      return React.cloneElement(
        child,
        {},
        injectAvatarGroupSize((child.props as { children?: React.ReactNode }).children, size),
      );
    }
    if (isAvatarRootElement(child)) {
      const props = child.props as AvatarRootProps;
      if (props.size !== undefined) {
        return child;
      }
      return React.cloneElement(child, { size } as Partial<AvatarRootProps>);
    }
    if (isAvatarGroupOverflowElement(child)) {
      const props = child.props as AvatarGroupOverflowProps;
      if (props.size !== undefined) {
        return child;
      }
      return React.cloneElement(child, { size } as Partial<AvatarGroupOverflowProps>);
    }
    return child;
  });
}

export type AvatarGroupRootProps = {
  size?: AvatarSize;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const AvatarGroupRoot = React.forwardRef<HTMLDivElement, AvatarGroupRootProps>(
  ({ size = "m", className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cx(styles.groupRoot, className)}
      {...toDataAttributes({ size })}
      {...rest}
    >
      {injectAvatarGroupSize(children, size)}
    </div>
  ),
);

AvatarGroupRoot.displayName = "AvatarGroupRoot";

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Group: {
    Root: AvatarGroupRoot,
    Overflow: AvatarGroupOverflow,
  },
};
