import React from 'react';
import styles from './styles.module.css';

/**
 * ProjectAtAGlance — a consistent, evidence-oriented summary block for a
 * case study. It standardises the *frame* (status, timeline, role, scale,
 * outcome, canonical links) without forcing every project into the same prose:
 * every structured field is optional, and `children` carries whatever
 * project-specific bullet facts belong on that page.
 *
 * Replaces the per-page `**Project Status:** <span class="status-badge">…</span>
 * | **Timeline:** …` footer line and the copy-pasted
 * `- [View source on GitHub](…)` at-a-glance bullet.
 *
 * Props (all optional):
 *   status   — e.g. "Deployed", "Public Beta", "Prototype", "Concept"
 *   timeline — e.g. "2023–2025" or "Program 2020–Present · my role 2024–2026"
 *   role     — ownership / boundary, one line
 *   scale    — problem or deployment scale, one line
 *   outcome  — an outcome / evidence signal, one line
 *   links    — [{ href, label }] canonical repo / release / plan links.
 *              External links get target/rel enforced here.
 *   children — freeform project-specific facts (usually a markdown list).
 */
function isExternal(href) {
  return /^https?:\/\//i.test(href);
}

export default function ProjectAtAGlance({
  status,
  timeline,
  role,
  scale,
  outcome,
  links,
  children,
}) {
  const facts = [
    status && ['Status', <span className="status-badge">{status}</span>],
    timeline && ['Timeline', timeline],
    role && ['Role', role],
    scale && ['Scale', scale],
    outcome && ['Evidence', outcome],
  ].filter(Boolean);

  return (
    <div className={styles.atAGlance}>
      {facts.length > 0 && (
        <dl className={styles.facts}>
          {facts.map(([term, value]) => (
            <div className={styles.fact} key={term}>
              <dt className={styles.term}>{term}</dt>
              <dd className={styles.value}>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {children && <div className={styles.detail}>{children}</div>}

      {Array.isArray(links) && links.length > 0 && (
        <p className={styles.links}>
          <span className={styles.linksLabel}>Canonical:</span>{' '}
          {links.map((l, i) => (
            <React.Fragment key={l.href}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              <a
                href={l.href}
                {...(isExternal(l.href)
                  ? {target: '_blank', rel: 'noopener noreferrer'}
                  : null)}>
                {l.label}
              </a>
            </React.Fragment>
          ))}
        </p>
      )}
    </div>
  );
}
