import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project, UiStrings } from "@/content/types";
import { sectionIds } from "@/lib/site";
import { ProjectCarousel } from "./ProjectCarousel";
import styles from "./ProjectShowcase.module.css";

interface ProjectShowcaseProps {
  projects: Project[];
  labels: UiStrings["projects"];
}

/** Right column of the hero: the "Projects" title and the carousel. */
export function ProjectShowcase({ projects, labels }: ProjectShowcaseProps) {
  return (
    <section id={sectionIds.projects} aria-labelledby="projects-title">
      <div className={styles.heading}>
        <SectionHeading id="projects-title">{labels.heading}</SectionHeading>
      </div>
      <ProjectCarousel projects={projects} labels={labels} />
    </section>
  );
}
