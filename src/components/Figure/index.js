import React from 'react';
import styles from './styles.module.css';

/**
 * Figure / EvidenceImage — the one place case-study images are marked up.
 *
 * Replaces the repeated inline `<img style="display:block;width:auto;max-width:
 * 100%;max-height:420px;...">` + `<p style="text-align:center"><em>caption</em>
 * </p>` + hand-written `target="_blank" rel="noopener noreferrer"` full-res link
 * pattern that was copied across the flagship project pages.
 *
 * Props:
 *   src, alt            — required. `alt=""` is allowed for decorative images.
 *   width, height       — intrinsic pixel dimensions (prevents layout shift).
 *   caption             — optional; rendered as an italic <figcaption>.
 *   priority            — 'lazy' (default) or 'eager' for above-the-fold heroes.
 *   maxHeight, maxWidth — optional display caps (number = px, or any CSS length).
 *   fullResolution      — optional { href, label }. Always opens in a new tab
 *                         with rel="noopener noreferrer" enforced here so callers
 *                         cannot forget the safe-new-tab semantics.
 */
export default function Figure({
  src,
  alt,
  width,
  height,
  caption,
  priority = 'lazy',
  maxHeight,
  maxWidth,
  fullResolution,
}) {
  const eager = priority === 'eager';
  const len = (v) => (typeof v === 'number' ? `${v}px` : v);
  const imgStyle = {};
  if (maxHeight != null) imgStyle.maxHeight = len(maxHeight);
  if (maxWidth != null) imgStyle.maxWidth = len(maxWidth);

  return (
    <figure className={styles.figure}>
      <img
        className={styles.image}
        src={src}
        alt={alt ?? ''}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? {fetchpriority: 'high'} : null)}
        style={Object.keys(imgStyle).length ? imgStyle : undefined}
      />
      {fullResolution && (
        <p className={styles.fullRes}>
          <a
            href={fullResolution.href}
            target="_blank"
            rel="noopener noreferrer">
            {`${
              fullResolution.label || 'Open the full-resolution version'
            } in a new tab →`}
          </a>
        </p>
      )}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
