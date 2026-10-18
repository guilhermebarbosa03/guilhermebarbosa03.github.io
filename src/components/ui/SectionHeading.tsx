import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  id?: string;
  children: ReactNode;
  /** Optional text to the right of the title, such as a counter. */
  aside?: ReactNode;
  level?: 2 | 3;
}

/** Section title in the pixel font, set on a dark label strip like a game menu header. */
export function SectionHeading({ id, children, aside, level = 2 }: SectionHeadingProps) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className={styles.wrapper}>
      <Heading id={id} className={styles.title}>
        <span className={styles.marker} aria-hidden="true" />
        {children}
      </Heading>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
