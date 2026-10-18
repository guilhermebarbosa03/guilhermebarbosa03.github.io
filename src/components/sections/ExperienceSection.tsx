import { Panel } from "@/components/ui/Panel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import type { ExperienceItem, UiStrings } from "@/content/types";
import { projectAnchor, sectionIds } from "@/lib/site";
import styles from "./ExperienceSection.module.css";

interface ExperienceSectionProps {
  items: ExperienceItem[];
  ui: UiStrings;
}

/** Work history as a vertical timeline, newest first, with deep links into the projects carousel. */
export function ExperienceSection({ items, ui }: ExperienceSectionProps) {
  return (
    <section id={sectionIds.experience} aria-labelledby="experience-title" className="container">
      <SectionHeading id="experience-title">{ui.experience.heading}</SectionHeading>

      <ol role="list" className={styles.timeline}>
        {items.map((item) => {
          const titleId = `experience-${item.id}`;
          return (
            <li key={item.id} className={styles.item}>
              <span className={styles.node} aria-hidden="true" />
              <Panel as="article" aria-labelledby={titleId}>
                <div className={styles.titleRow}>
                  <h3 id={titleId} className={styles.title}>
                    {item.role}
                  </h3>
                  {item.isCurrent && <span className={styles.badge}>{ui.experience.current}</span>}
                </div>
                <p className={styles.organization}>{item.organization}</p>
                <p className={styles.meta}>
                  <span>{item.period}</span>
                  <span className={styles.location}>
                    <PixelIcon name="pin" size={16} />
                    {item.location}
                  </span>
                </p>

                <ul role="list" className={styles.bullets}>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>

                <ul role="list" className={styles.skills}>
                  {item.skills.map((skill) => (
                    <li key={skill.id}>
                      <Tag size="sm" label={skill.label} />
                    </li>
                  ))}
                </ul>

                {item.projects.length > 0 && (
                  <ul role="list" className={styles.projects}>
                    {item.projects.map((project) => (
                      <li key={project.id}>
                        <PixelButton
                          variant="secondary"
                          size="sm"
                          icon="arrow-right"
                          href={`#${projectAnchor(project.id)}`}
                          className={styles.projectLink}
                        >
                          {`${ui.experience.seeProject}: ${project.title}`}
                        </PixelButton>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
