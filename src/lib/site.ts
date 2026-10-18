/** Public origin of the site (GitHub Pages). NEXT_PUBLIC_SITE_URL overrides it, e.g. for a custom domain. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://guilhermebarbosa03.github.io").replace(/\/$/, "");

/** In-page anchors, shared by the header navigation and the sections. */
export const sectionIds = {
  projects: "projects",
  skills: "skills",
  experience: "experience",
  education: "education",
  contact: "contact",
} as const;

export type SectionKey = keyof typeof sectionIds;

/** Anchor of one project slide, e.g. "#project-oil-spill-app". The carousel listens for it. */
export function projectAnchor(projectId: string): string {
  return `project-${projectId}`;
}
