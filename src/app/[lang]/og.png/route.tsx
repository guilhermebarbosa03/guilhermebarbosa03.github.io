import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { defaultLocale, hasLocale, locales } from "@/i18n/config";

/*
 * Link preview card (LinkedIn, WhatsApp, Slack) in the same flat pixel style as the site.
 * A route handler instead of opengraph-image.tsx so the exported file keeps its .png extension,
 * which GitHub Pages needs to serve it as an image. Rendered once per language at build time.
 */
const size = { width: 1200, height: 630 };

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const INK = "#1c1a2e";
const PAPER = "#fff8e8";
const GOLD = "#f4b42a";
const SKY = "#7ab3f0";
const GRASS = "#57b947";
const DIRT = "#b4683a";

export async function GET(_request: Request, { params }: RouteContext<"/[lang]/og.png">) {
  const { lang } = await params;
  const { profile } = getContent(hasLocale(lang) ? lang : defaultLocale);
  const stack = profile.coreStack.slice(0, 6).map((skill) => skill.label);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: SKY }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 72px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              padding: "40px 48px",
              background: PAPER,
              border: `6px solid ${INK}`,
              color: INK,
            }}
          >
            <div style={{ fontSize: 76, fontWeight: 700 }}>{profile.name}</div>
            <div style={{ display: "flex" }}>
              <div style={{ fontSize: 38, background: GOLD, padding: "6px 16px" }}>{profile.role}</div>
            </div>
            <div style={{ fontSize: 28, color: "#55526a" }}>{profile.tagline}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {stack.map((label) => (
                <div key={label} style={{ fontSize: 24, border: `3px solid ${INK}`, padding: "4px 12px" }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 24, background: GRASS, borderTop: `6px solid ${INK}` }} />
        <div style={{ height: 72, background: DIRT }} />
      </div>
    ),
    size,
  );
}
