import { memo } from "react";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { Tag } from "@/components/ui/Tag";
import type { Project, UiStrings } from "@/content/types";
import { fill } from "@/lib/format";
import { projectAnchor } from "@/lib/site";
import { cardColumns, cardSizes, MAX_CARD_IMAGES } from "./imageSizes";
import { ImageFrame } from "./ImageFrame";
import { PixelImage } from "./PixelImage";
import styles from "./ProjectSlide.module.css";

interface ProjectSlideProps {
  project: Project;
  index: number;
  total: number;
  active: boolean;
  /** Load this slide's images right away. Only the first slide needs it. */
  eager: boolean;
  labels: UiStrings["projects"];
  /** `trigger` is the element that opened the zoom view, so focus can return to it. */
  onOpen: (projectIndex: number, imageIndex: number, trigger: HTMLElement) => void;
}

function ProjectSlideView({ project, index, total, active, eager, labels, onOpen }: ProjectSlideProps) {
  const anchor = projectAnchor(project.id);
  const summaryId = `${anchor}-summary`;
  const skillsId = `${anchor}-skills`;

  const shown = project.images.slice(0, MAX_CARD_IMAGES);
  const hiddenCount = project.images.length - shown.length;
  const columns = cardColumns(project);
  const sizes = cardSizes(columns);

  return (
    <div
      id={anchor}
      role="group"
      aria-label={`${fill(labels.slideStatus, { n: index + 1, total })}: ${project.title}`}
      aria-hidden={active ? undefined : true}
      inert={!active}
      className={styles.slide}
      data-active={active}
    >
      {columns > 0 && (
        <div className={styles.media} data-cols={columns}>
          {shown.map((image, imageIndex) => {
            const showMore = hiddenCount > 0 && imageIndex === columns - 1;
            return (
              <button
                key={image.src.src}
                type="button"
                className={styles.cell}
                aria-label={`${labels.zoomHint}: ${image.alt}`}
                data-intent={index}
                onClick={(event) => onOpen(index, imageIndex, event.currentTarget)}
              >
                <ImageFrame image={image.src} className={styles.frame}>
                  <PixelImage
                    src={image.src}
                    alt={image.alt}
                    sizes={sizes}
                    loading={eager ? "eager" : "lazy"}
                    fetchPriority={eager ? "high" : "low"}
                    className={styles.image}
                  />
                  <span className={styles.zoomBadge} aria-hidden="true">
                    <PixelIcon name="zoom" size={16} />
                  </span>
                  {showMore && (
                    <span className={styles.moreBadge} aria-hidden="true">
                      {fill(labels.moreImages, { n: hiddenCount })}
                    </span>
                  )}
                </ImageFrame>
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.context}>{project.context}</p>

        <button
          type="button"
          className={styles.summaryButton}
          aria-label={fill(labels.openDetails, { title: project.title })}
          aria-describedby={summaryId}
          data-intent={index}
          onClick={(event) => onOpen(index, 0, event.currentTarget)}
        >
          <span id={summaryId} className={styles.summary}>
            {project.summary}
          </span>
          <span className={styles.hint}>
            <PixelIcon name="zoom" size={16} />
            {labels.zoomHint}
          </span>
        </button>

        <div className={styles.skills}>
          <p id={skillsId} className={styles.skillsLabel}>
            {labels.skillsTitle}
          </p>
          <ul role="list" aria-labelledby={skillsId} className={styles.skillList}>
            {project.skills.map((skill) => (
              <li key={skill.id}>
                <Tag size="sm" label={skill.label} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Memoized: the carousel re-renders on hover and focus changes, but a slide only changes when it (de)activates. */
export const ProjectSlide = memo(ProjectSlideView);
