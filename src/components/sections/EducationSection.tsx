import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import type { Certificate, Education, UiStrings } from "@/content/types";
import { sectionIds } from "@/lib/site";
import styles from "./EducationSection.module.css";

interface EducationSectionProps {
  education: Education;
  certificates: Certificate[];
  ui: UiStrings;
}

/** Degree with relevant coursework, next to the list of certificates. */
export function EducationSection({ education, certificates, ui }: EducationSectionProps) {
  return (
    <section id={sectionIds.education} aria-labelledby="education-title" className="container">
      <SectionHeading id="education-title">{ui.education.heading}</SectionHeading>

      <div className={styles.grid}>
        <Panel as="article" aria-labelledby="education-degree">
          <h3 id="education-degree" className={styles.title}>
            {education.degree}
          </h3>
          <p className={styles.school}>{education.school}</p>
          <p className={styles.dates}>
            <span>{education.period}</span>
            <span>{education.expectedLabel}</span>
          </p>

          <h4 className={styles.subtitle}>{ui.education.coursework}</h4>
          <ul role="list" className={styles.tags}>
            {education.coursework.map((course) => (
              <li key={course}>
                <Tag size="sm" label={course} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel as="article" aria-labelledby="education-certificates">
          <h3 id="education-certificates" className={styles.title}>
            {ui.education.certificates}
          </h3>
          <ul role="list" className={styles.certificates}>
            {certificates.map((certificate) => (
              <li key={`${certificate.issuer}-${certificate.title}`} className={styles.certificate}>
                <span className={styles.issuer}>{certificate.issuer}</span>
                <span>{certificate.title}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </section>
  );
}
