import { PixelButton } from "@/components/ui/PixelButton";
import type { IconName } from "@/components/ui/PixelIcon";
import type { ContactKind, Profile, UiStrings } from "@/content/types";
import { htmlLang, locales, otherLocale, type Locale } from "@/i18n/config";
import { SectionNav } from "./SectionNav";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  locale: Locale;
  profile: Profile;
  ui: UiStrings;
}

/** Contacts that get an icon shortcut in the bar; the full list lives in the intro and footer. */
const shortcuts: { kind: ContactKind; icon: IconName; newTab: boolean }[] = [
  { kind: "email", icon: "mail", newTab: false },
  { kind: "github", icon: "github", newTab: true },
  { kind: "linkedin", icon: "linkedin", newTab: true },
];

/** Sticky HUD bar: name, section navigation, and language switch. */
export function SiteHeader({ locale, profile, ui }: SiteHeaderProps) {
  const switchTo = otherLocale(locale);

  const quickLinks = shortcuts.flatMap(({ kind, icon, newTab }) => {
    const contact = profile.contacts.find((c) => c.kind === kind);
    return contact?.href ? [{ kind, icon, newTab, label: contact.label, href: contact.href }] : [];
  });

  return (
    <header className={`${styles.header} no-print`}>
      <div className={`container ${styles.bar}`}>
        <a className={styles.brand} href="#main">
          {profile.name}
        </a>

        <div className={styles.navSlot}>
          <SectionNav label={ui.navLabel} labels={ui.nav} />
        </div>

        <div className={styles.actions}>
          <div className={styles.lang} role="group" aria-label={ui.language.label}>
            {locales.map((code) =>
              code === locale ? (
                <span key={code} className={styles.langCurrent} aria-current="true">
                  {code.toUpperCase()}
                </span>
              ) : (
                // Plain link on purpose: a full page load keeps <html lang> in sync with the new locale
                <a
                  key={code}
                  className={styles.langLink}
                  href={`/${switchTo}/`}
                  hrefLang={htmlLang[switchTo]}
                  lang={htmlLang[switchTo]}
                  aria-label={ui.language.switchTo}
                >
                  {code.toUpperCase()}
                </a>
              ),
            )}
          </div>

          <ul role="list" className={styles.shortcuts}>
            {quickLinks.map((link) => (
              <li key={link.kind}>
                <PixelButton
                  variant="ghost"
                  size="sm"
                  icon={link.icon}
                  iconOnly
                  href={link.href}
                  target={link.newTab ? "_blank" : undefined}
                  rel={link.newTab ? "noreferrer" : undefined}
                >
                  {link.label}
                </PixelButton>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
