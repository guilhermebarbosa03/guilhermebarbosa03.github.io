import type { Locale } from "@/i18n/config";
import type { PluralForms, YearMonth } from "@/content/types";

const MONTHS: Record<Locale, string[]> = {
  pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/** "2024-08" -> "Ago 2024" / "Aug 2024". Hand-rolled so server and client output never differ. */
export function formatMonthYear(value: YearMonth, locale: Locale): string {
  const [year, month] = value.split("-").map(Number);
  return `${MONTHS[locale][month - 1]} ${year}`;
}

export function formatPeriod(
  start: YearMonth,
  end: YearMonth | null,
  locale: Locale,
  currentLabel: string,
): string {
  const endLabel = end ? formatMonthYear(end, locale) : currentLabel;
  return `${formatMonthYear(start, locale)} – ${endLabel}`;
}

/** Replaces {key} placeholders: fill("Projeto {n} de {total}", { n: 2, total: 7 }). */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function plural(forms: PluralForms, n: number): string {
  return fill(n === 1 ? forms.one : forms.other, { n });
}
