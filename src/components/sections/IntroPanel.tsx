import { CopyEmail } from "@/components/ui/CopyEmail";
import { Panel } from "@/components/ui/Panel";
import { PixelIcon, type IconName } from "@/components/ui/PixelIcon";
import { Tag } from "@/components/ui/Tag";
import type { ContactKind, Profile, UiStrings } from "@/content/types";
import styles from "./IntroPanel.module.css";

interface IntroPanelProps {
  profile: Profile;
  ui: UiStrings;
}

const contactIcons: Record<ContactKind, IconName> = {
  email: "mail",
  github: "github",
  linkedin: "linkedin",
  location: "pin",
};

/** Links that leave the site open in a new tab. The email is copied instead of opened. */
const opensInNewTab: ContactKind[] = ["github", "linkedin"];

/**
 * Pixel tail of the speech bubble, built from stacked rects on a 3px grid (the border width).
 * The ink rects form the outline; the paper rects fill the inside and cut through the
 * bubble's top border so the tail opens into the box.
 */
function BubbleTail() {
  return (
    <svg
      className={styles.tail}
      width="24"
      height="15"
      viewBox="0 0 24 15"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <rect className={styles.tailInk} x="9" y="0" width="6" height="3" />
      <rect className={styles.tailInk} x="6" y="3" width="12" height="3" />
      <rect className={styles.tailInk} x="3" y="6" width="18" height="3" />
      <rect className={styles.tailInk} x="0" y="9" width="24" height="3" />
      <rect className={styles.tailPaper} x="9" y="3" width="6" height="3" />
      <rect className={styles.tailPaper} x="6" y="6" width="12" height="3" />
      <rect className={styles.tailPaper} x="3" y="9" width="18" height="6" />
    </svg>
  );
}

/** Left column of the hero: who I am, how to reach me, a short bio and the headline numbers. */
export function IntroPanel({ profile, ui }: IntroPanelProps) {
  return (
    <div className={styles.intro}>
      <Panel className={styles.identity}>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.role}>{profile.role}</p>
        <p className={styles.tagline}>{profile.tagline}</p>

        <ul role="list" className={styles.contacts} aria-label={ui.intro.contactTitle}>
          {profile.contacts.map((contact) => {
            const newTab = opensInNewTab.includes(contact.kind);
            return (
              <li key={contact.kind} className={styles.contact}>
                <PixelIcon name={contactIcons[contact.kind]} size={16} className={styles.contactIcon} />
                <span className="visually-hidden">{contact.label}: </span>
                {contact.kind === "email" ? (
                  <CopyEmail
                    email={contact.value}
                    copiedMessage={ui.contact.emailCopied}
                    actionLabel={ui.contact.copyEmail}
                    variant="link"
                  />
                ) : contact.href ? (
                  <a
                    href={contact.href}
                    target={newTab ? "_blank" : undefined}
                    rel={newTab ? "noreferrer" : undefined}
                  >
                    {contact.value}
                  </a>
                ) : (
                  <span>{contact.value}</span>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel as="section" className={styles.bubble} aria-labelledby="about-title">
        <BubbleTail />
        <h2 id="about-title" className={styles.sectionTitle}>
          {ui.intro.aboutTitle}
        </h2>
        <div className={styles.summary}>
          {profile.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Panel>

      <dl className={styles.stats}>
        {profile.stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <dt className={styles.statLabel}>{stat.label}</dt>
            <dd className={styles.statValue}>{stat.value}</dd>
          </div>
        ))}
      </dl>

      <Panel as="section" className={styles.stack} aria-labelledby="core-stack-title">
        <h2 id="core-stack-title" className={styles.sectionTitle}>
          {ui.intro.coreStackTitle}
        </h2>
        <ul role="list" className={styles.tags}>
          {profile.coreStack.map((skill) => (
            <li key={skill.id}>
              <Tag size="sm" label={skill.label} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
