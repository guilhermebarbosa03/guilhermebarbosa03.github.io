import type { PortfolioContent } from "@/content/types";
import { githubUrl, linkedinUrl, person } from "@/content/profile";
import { htmlLang } from "@/i18n/config";

/**
 * schema.org ProfilePage + Person: role, skills, school, location and contact.
 */
export function buildProfileJsonLd(content: PortfolioContent, pageUrl: string) {
  const knowsAbout = content.skillCategories
    .filter((category) => category.id !== "spoken")
    .flatMap((category) => category.skills.map((skill) => skill.label));

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: pageUrl,
    inLanguage: htmlLang[content.locale],
    mainEntity: {
      "@type": "Person",
      name: person.name,
      givenName: person.givenName,
      familyName: person.familyName,
      jobTitle: content.profile.role,
      description: content.profile.summary.join(" "),
      email: `mailto:${person.email}`,
      url: pageUrl,
      sameAs: [githubUrl, linkedinUrl],
      address: {
        "@type": "PostalAddress",
        addressLocality: person.city,
        addressRegion: person.region,
        addressCountry: person.country,
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Universidade Federal da Bahia (UFBA)",
      },
      knowsAbout,
      knowsLanguage: ["pt-BR", "en"],
      hasCredential: content.certificates.map((certificate) => ({
        "@type": "EducationalOccupationalCredential",
        name: certificate.title,
        recognizedBy: { "@type": "Organization", name: certificate.issuer },
      })),
    },
  };
}

/** Serializes JSON-LD for a <script> tag, escaping "<" so the payload cannot close the tag. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
