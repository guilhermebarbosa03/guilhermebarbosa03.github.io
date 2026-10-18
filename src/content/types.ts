import type { StaticImageData } from "next/image";
import type { Locale } from "@/i18n/config";
import type { SkillId } from "./skills";

/** A value written once per locale. Source content uses it; components never see it. */
export type Localized<T = string> = Record<Locale, T>;

/** Year and month in ISO format, e.g. "2024-08". */
export type YearMonth = `${number}-${number}`;

/* ---------- Source shapes (content files) ---------- */

export interface ProjectSource {
  id: string;
  title: Localized;
  context: Localized;
  summary: Localized;
  details: Localized<string[]>;
  skills: SkillId[];
  images: { src: StaticImageData; alt: Localized }[];
}

export interface ExperienceSource {
  id: string;
  role: Localized;
  organization: Localized;
  location: Localized;
  start: YearMonth;
  end: YearMonth | null;
  bullets: Localized<string[]>;
  skills: SkillId[];
  projectIds: string[];
}

/* ---------- Resolved shapes (what components receive) ---------- */

export interface SkillRef {
  id: SkillId;
  label: string;
}

export interface ProjectImage {
  src: StaticImageData;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  context: string;
  summary: string;
  details: string[];
  skills: SkillRef[];
  images: ProjectImage[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  start: YearMonth;
  end: YearMonth | null;
  /** Human readable period, e.g. "Ago 2024 – Atual". */
  period: string;
  isCurrent: boolean;
  bullets: string[];
  skills: SkillRef[];
  projects: { id: string; title: string }[];
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: SkillRef[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  start: YearMonth;
  expectedEnd: YearMonth;
  expectedLabel: string;
  coursework: string[];
}

export interface Certificate {
  issuer: string;
  title: string;
}

export type ContactKind = "email" | "github" | "linkedin" | "location";

export interface ContactLink {
  kind: ContactKind;
  label: string;
  /** Text shown on screen. */
  value: string;
  href?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  summary: string[];
  coreStack: SkillRef[];
  stats: Stat[];
  contacts: ContactLink[];
}

export interface PluralForms {
  one: string;
  other: string;
}

export interface UiStrings {
  skipToContent: string;
  nav: { projects: string; skills: string; experience: string; education: string; contact: string };
  navLabel: string;
  language: { label: string; switchTo: string };
  intro: { aboutTitle: string; coreStackTitle: string; contactTitle: string };
  projects: {
    heading: string;
    previous: string;
    next: string;
    goTo: string;
    pause: string;
    play: string;
    zoomHint: string;
    openDetails: string;
    moreImages: string;
    slideStatus: string;
    detailsTitle: string;
    skillsTitle: string;
    close: string;
    previousImage: string;
    nextImage: string;
    imageCounter: string;
  };
  skills: { heading: string };
  experience: { heading: string; current: string; seeProject: string };
  education: { heading: string; coursework: string; certificates: string; expected: string };
  contact: { heading: string; text: string; copyEmail: string; emailCopied: string };
}

export interface SiteMeta {
  title: string;
  description: string;
  keywords: string[];
}

export interface PortfolioContent {
  locale: Locale;
  meta: SiteMeta;
  profile: Profile;
  projects: Project[];
  skillCategories: SkillCategory[];
  experience: ExperienceItem[];
  education: Education;
  certificates: Certificate[];
  ui: UiStrings;
}
