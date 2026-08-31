import React from 'react';
import styles from './styles.module.css';

/**
 * RelatedWork — 2–3 *contextual* links out of a case study, each with a short
 * reason it is relevant. This is deliberately not linear "previous / next"
 * navigation: the reasons are what make it useful.
 *
 * Props:
 *   items — [{ href, title, reason }], 2–3 entries. External links get
 *           target/rel enforced; internal links stay in-app.
 *   title — optional section heading (default "Related work").
 */
function isExternal(href) {
  return /^https?:\/\//i.test(href);
}

export default function RelatedWork({items = [], title = 'Related work'}) {
  if (!items.length) return null;
  return (
    <nav className={styles.related} aria-label={title}>
      <h2 className={styles.heading}>{title}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li className={styles.item} key={item.href}>
            <a
              className={styles.link}
              href={item.href}
              {...(isExternal(item.href)
                ? {target: '_blank', rel: 'noopener noreferrer'}
                : null)}>
              {item.title}
            </a>
            {item.reason && (
              <span className={styles.reason}> — {item.reason}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
