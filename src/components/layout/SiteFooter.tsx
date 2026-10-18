import { GroundStrip } from "@/components/scene/GroundStrip";
import { Panel } from "@/components/ui/Panel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ContactKind, ContactLink, Profile, UiStrings } from "@/content/types";
import { sectionIds } from "@/lib/site";
import styles from "./SiteFooter.module.css";

interface SiteFooterProps {
  profile: Profile;
  ui: UiStrings;
}

function findContact(contacts: ContactLink[], kind: ContactKind): ContactLink | undefined {
  return contacts.find((contact) => contact.kind === kind);
}

/** Contact panel standing on the pixel ground at the end of the page. */
export function SiteFooter({ profile, ui }: SiteFooterProps) {
  const email = findContact(profile.contacts, "email");
  const github = findContact(profile.contacts, "github");
  const linkedin = findContact(profile.contacts, "linkedin");
  const location = findContact(profile.contacts, "location");

  return (
    <footer className={styles.footer}>
      <div className="container">
        <Panel as="section" id={sectionIds.contact} aria-labelledby="contact-title" className={styles.panel}>
          <SectionHeading id="contact-title">{ui.contact.heading}</SectionHeading>
          <p className={styles.text}>{ui.contact.text}</p>

          <ul role="list" className={styles.actions}>
            {email && (
              <li>
                <PixelButton variant="primary" icon="mail" href={`mailto:${email.value}`} className={styles.button}>
                  {email.value}
                </PixelButton>
              </li>
            )}
            {github?.href && (
              <li>
                <PixelButton
                  variant="secondary"
                  icon="github"
                  href={github.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.button}
                >
                  {github.value}
                </PixelButton>
              </li>
            )}
            {linkedin?.href && (
              <li>
                <PixelButton
                  variant="secondary"
                  icon="linkedin"
                  href={linkedin.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.button}
                >
                  {linkedin.value}
                </PixelButton>
              </li>
            )}
          </ul>

          {location && (
            <p className={styles.location}>
              <PixelIcon name="pin" size={16} />
              <span className="visually-hidden">{location.label}: </span>
              <span>{location.value}</span>
            </p>
          )}
        </Panel>
      </div>

      <GroundStrip />
    </footer>
  );
}
