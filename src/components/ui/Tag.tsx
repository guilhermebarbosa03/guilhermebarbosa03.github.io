import styles from "./Tag.module.css";

interface TagProps {
  label: string;
  size?: "sm" | "md";
}

/** Skill chip. Render inside a <li> of a list with role="list". */
export function Tag({ label, size = "md" }: TagProps) {
  return (
    <span className={`${styles.tag} ${styles[size]}`}>
      <span>{label}</span>
    </span>
  );
}
