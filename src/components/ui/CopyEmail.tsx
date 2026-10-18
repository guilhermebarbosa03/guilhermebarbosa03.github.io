"use client";

import { useEffect, useRef, useState } from "react";
import { PixelButton } from "./PixelButton";
import styles from "./CopyEmail.module.css";

interface CopyEmailProps {
  email: string;
  /** Message shown after copying, e.g. "E-mail copiado!". */
  copiedMessage: string;
  /** Accessible hint for what the button does, e.g. "Copiar e-mail". */
  actionLabel: string;
  /** "button" is the big contact button; "link" is plain text for lists. */
  variant?: "button" | "link";
  className?: string;
}

const MESSAGE_MS = 2000;

/** Older browsers and insecure contexts have no async clipboard API. */
function legacyCopy(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

/** Copies the address instead of opening a mail app, and says so in a small flat tag beside it. */
export function CopyEmail({ email, copiedMessage, actionLabel, variant = "button", className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      ok = legacyCopy(email);
    }
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), MESSAGE_MS);
  };

  return (
    <span className={styles.wrap}>
      {variant === "button" ? (
        <PixelButton variant="primary" icon="mail" onClick={copy} title={actionLabel} className={className}>
          {email}
        </PixelButton>
      ) : (
        <button type="button" className={styles.link} onClick={copy} title={actionLabel}>
          {email}
        </button>
      )}
      <span className={styles.message} data-visible={copied} role="status">
        {copied ? copiedMessage : ""}
      </span>
    </span>
  );
}
