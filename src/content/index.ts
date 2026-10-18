import type { Locale } from "@/i18n/config";
import { fill, formatMonthYear, formatPeriod } from "@/lib/format";
import { experience } from "./experience";
import {
  certificates,
  contacts,
  coreStack,
  education,
  meta,
  person,
  role,
  statLabels,
  summary,
  tagline,
  yearsOfExperience,
} from "./profile";
import { projects } from "./projects";
import { skillCategories, skills, type SkillId } from "./skills";
import type { PortfolioContent, SkillRef } from "./types";
import { ui } from "./ui";

function skillLabel(id: SkillId, locale: Locale): string {
  const label: string | Record<Locale, string> = skills[id];
  return typeof label === "string" ? label : label[locale];
}

function skillRefs(ids: SkillId[], locale: Locale): SkillRef[] {
  return ids.map((id) => ({ id, label: skillLabel(id, locale) }));
}

const projectTitles = new Map(projects.map((p) => [p.id, p.title]));

/** Resolves every localized field so components receive plain strings for one locale. */
export function getContent(locale: Locale): PortfolioContent {
  const strings = ui[locale];

  return {
    locale,
    meta: meta[locale],
    ui: strings,
    profile: {
      name: person.name,
      role: role[locale],
      tagline: tagline[locale],
      summary: summary[locale],
      coreStack: skillRefs(coreStack, locale),
      stats: [
        { value: yearsOfExperience, label: statLabels.experience[locale] },
        { value: String(projects.length), label: statLabels.projects[locale] },
        {
          value: education.expectedEnd.slice(0, 4),
          label: statLabels.graduation[locale],
        },
      ],
      contacts: contacts.map((c) => ({
        kind: c.kind,
        label: c.label[locale],
        value: c.value[locale],
        href: c.href,
      })),
    },
    projects: projects.map((p) => ({
      id: p.id,
      title: p.title[locale],
      context: p.context[locale],
      summary: p.summary[locale],
      details: p.details[locale],
      skills: skillRefs(p.skills, locale),
      images: p.images.map((img) => ({ src: img.src, alt: img.alt[locale] })),
    })),
    skillCategories: skillCategories.map((category) => ({
      id: category.id,
      title: category.title[locale],
      skills: category.skills.map((id) => ({
        id,
        label: skillLabel(id, locale),
      })),
    })),
    experience: experience.map((job) => ({
      id: job.id,
      role: job.role[locale],
      organization: job.organization[locale],
      location: job.location[locale],
      start: job.start,
      end: job.end,
      period: formatPeriod(
        job.start,
        job.end,
        locale,
        strings.experience.current,
      ),
      isCurrent: job.end === null,
      bullets: job.bullets[locale],
      skills: skillRefs(job.skills, locale),
      projects: job.projectIds.map((id) => {
        const title = projectTitles.get(id);
        if (!title)
          throw new Error(
            `Experience "${job.id}" links to unknown project "${id}"`,
          );
        return { id, title: title[locale] };
      }),
    })),
    education: {
      degree: education.degree[locale],
      school: education.school[locale],
      start: education.start,
      expectedEnd: education.expectedEnd,
      period: `${formatMonthYear(education.start, locale)} – ${strings.experience.current}`,
      expectedLabel: fill(strings.education.expected, {
        date: formatMonthYear(education.expectedEnd, locale),
      }),
      coursework: education.coursework[locale],
    },
    certificates: certificates.map((c) => ({
      issuer: c.issuer,
      title: c.title[locale],
      href: `/certificates/${c.file}`,
    })),
  };
}

export type { PortfolioContent } from "./types";
