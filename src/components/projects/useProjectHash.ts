import { useEffect } from "react";
import type { Project } from "@/content/types";
import { projectAnchor } from "@/lib/site";

/**
 * Lets links such as "#project-oil-spill-app" (from the experience section) select that project.
 * Covers the initial URL, hash changes, and clicks on a link to the hash that is already in the URL,
 * which the browser does not report as a hashchange.
 */
export function useProjectHash(projects: Project[], onSelect: (index: number) => void) {
  useEffect(() => {
    const anchors = projects.map((project) => `#${projectAnchor(project.id)}`);

    const selectFromHash = (hash: string) => {
      const index = anchors.indexOf(hash);
      if (index !== -1) onSelect(index);
    };

    const handleHashChange = () => selectFromHash(window.location.hash);

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      selectFromHash(url.hash);
    };

    selectFromHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleClick);
    };
  }, [projects, onSelect]);
}
