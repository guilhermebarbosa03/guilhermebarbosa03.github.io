import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Panel.module.css";

type PanelProps<T extends ElementType> = {
  as?: T;
  /** "paper" for regular content, "ink" for dark highlight boxes. */
  tone?: "paper" | "ink";
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/** Opaque retro window: flat fill, ink border and an inner pixel line. */
export function Panel<T extends ElementType = "div">({
  as,
  tone = "paper",
  className,
  children,
  ...rest
}: PanelProps<T>) {
  const Component: ElementType = as ?? "div";
  const classes = [styles.panel, styles[tone], className].filter(Boolean).join(" ");
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
