import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import type { SkillCategory, UiStrings } from "@/content/types";
import { sectionIds } from "@/lib/site";
import styles from "./SkillsSection.module.css";

interface SkillsSectionProps {
  categories: SkillCategory[];
  ui: UiStrings;
}

/** Skills as an inventory screen: one panel per category, each skill a chip. */
export function SkillsSection({ categories, ui }: SkillsSectionProps) {
  return (
    <section id={sectionIds.skills} aria-labelledby="skills-title" className="container">
      <SectionHeading id="skills-title">{ui.skills.heading}</SectionHeading>

      <ul role="list" className={styles.grid}>
        {categories.map((category) => {
          const titleId = `skills-${category.id}`;
          return (
            <li key={category.id} className={styles.cell}>
              <Panel as="section" className={styles.card} aria-labelledby={titleId}>
                <div className={styles.strip}>
                  <h3 id={titleId} className={styles.title}>
                    {category.title}
                  </h3>
                </div>
                <ul role="list" className={styles.tags}>
                  {category.skills.map((skill) => (
                    <li key={skill.id}>
                      <Tag label={skill.label} />
                    </li>
                  ))}
                </ul>
              </Panel>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
