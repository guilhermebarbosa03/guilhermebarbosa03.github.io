import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { IntroPanel } from "@/components/sections/IntroPanel";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { buildProfileJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site";
import styles from "./page.module.css";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const content = getContent(lang);
  const { profile, ui } = content;
  const jsonLd = buildProfileJsonLd(content, `${siteUrl}/${lang}`);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <a className="skip-link" href="#main">
        {ui.skipToContent}
      </a>

      <SiteHeader locale={lang} profile={profile} ui={ui} />

      <main id="main" className={styles.main}>
        {/* First screen: intro on the left, projects on the right */}
        <div className={`container ${styles.hero}`}>
          <IntroPanel profile={profile} ui={ui} />
          <ProjectShowcase projects={content.projects} labels={ui.projects} />
        </div>

        <SkillsSection categories={content.skillCategories} ui={ui} />
        <ExperienceSection items={content.experience} ui={ui} />
        <EducationSection education={content.education} certificates={content.certificates} ui={ui} />
      </main>

      <SiteFooter profile={profile} ui={ui} />
    </>
  );
}
