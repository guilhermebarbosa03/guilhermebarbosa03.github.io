export const locales = ["pt", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

/** Value of the `lang` attribute and Open Graph locale for each route locale. */
export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

export const ogLocale: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "pt" ? "en" : "pt";
}
