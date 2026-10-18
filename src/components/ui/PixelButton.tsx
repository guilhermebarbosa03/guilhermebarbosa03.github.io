import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { PixelIcon, type IconName } from "./PixelIcon";
import styles from "./PixelButton.module.css";

interface CommonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  icon?: IconName;
  /** Hide the text visually (it stays as the accessible name). */
  iconOnly?: boolean;
  children: ReactNode;
  className?: string;
}

type AnchorProps = Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps>;
type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps>;

type PixelButtonProps = CommonProps & ((AnchorProps & { href: string }) | (ButtonProps & { href?: undefined }));

/**
 * Flat retro button. Renders <a> when `href` is set, otherwise <button>.
 * States switch instantly (no transitions); pressing nudges it down like a game key.
 */
export function PixelButton({
  variant = "primary",
  size = "md",
  icon,
  iconOnly = false,
  children,
  className,
  ...rest
}: PixelButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], iconOnly && styles.iconOnly, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && <PixelIcon name={icon} size={16} />}
      <span className={iconOnly ? "visually-hidden" : undefined}>{children}</span>
    </>
  );

  if (typeof rest.href === "string") {
    return (
      <a className={classes} {...(rest as AnchorProps)}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonProps)}>
      {content}
    </button>
  );
}
