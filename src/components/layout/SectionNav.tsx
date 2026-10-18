"use client";

import { useEffect, useRef, useState } from "react";
import { sectionIds, type SectionKey } from "@/lib/site";
import styles from "./SectionNav.module.css";

/** Document order, used both to render the links and to break ties between visible sections. */
const order: SectionKey[] = ["projects", "skills", "experience", "education", "contact"];

interface SectionNavProps {
  label: string;
  labels: Record<SectionKey, string>;
}

/** In-page navigation. Marks the section being read with aria-current="location". */
export function SectionNav({ label, labels }: SectionNavProps) {
  // Nothing is active on the server render; the observers below fill it in after hydration.
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ids = order.map((key) => sectionIds[key]);
    const contactId = sectionIds.contact;
    const headerHeight = navRef.current?.closest("header")?.offsetHeight ?? 0;
    const inBand = new Set<string>();
    let contactMostlyVisible = false;

    const update = () => {
      let next: string | undefined = contactMostlyVisible ? contactId : undefined;
      // Without a section in the reading band (gaps between sections) keep the previous one.
      for (let i = ids.length - 1; !next && i >= 0; i--) {
        if (inBand.has(ids[i])) next = ids[i];
      }
      if (next) setActiveId(next);
    };

    // Reading band: from under the sticky header to the middle of the viewport.
    const bandObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        update();
      },
      { rootMargin: `-${headerHeight}px 0px -50% 0px` },
    );

    // The last section sits above the footer ground and may never reach the band on tall
    // screens, so it also counts as active once most of it is on screen.
    const contactObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          contactMostlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        }
        update();
      },
      { threshold: [0, 0.5] },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (!element) continue;
      bandObserver.observe(element);
      if (id === contactId) contactObserver.observe(element);
    }

    return () => {
      bandObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  // On phones the links scroll sideways: keep the active one visible.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    const link = nav.querySelector<HTMLElement>('[aria-current="location"]');
    if (!link) return;
    nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: "instant" });
  }, [activeId]);

  return (
    <nav ref={navRef} className={styles.nav} aria-label={label}>
      <ul role="list" className={styles.list}>
        {order.map((key) => {
          const id = sectionIds[key];
          return (
            <li key={key}>
              <a className={styles.link} href={`#${id}`} aria-current={activeId === id ? "location" : undefined}>
                {labels[key]}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
