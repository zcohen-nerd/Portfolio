/**
 * Source-level content validation for the project case studies.
 * Runs on the Markdown/MDX source (not the built HTML), so failures are fast
 * and point at the exact file + fix. Complements scripts/validate-build.js,
 * which checks the rendered output.
 *
 * Usage:  node scripts/validate-content.js
 *
 * Checks per project page (src/pages/projects/*.md, *.mdx — excluding index):
 *   - required front matter: title, description, status
 *   - status is in the allowed vocabulary
 *   - deployed-class pages (Deployed / Public Beta / Prototype) also require a
 *     timeline (displayDate) and an OG image; Concept / roadmap pages do not
 *   - if an OG image is declared, the file exists and is 1200x630
 *   - every local image referenced in the body exists under static/
 *   - no duplicate headings (they would collide as anchor IDs)
 *   - internal links ( /... ) resolve to a real page route
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pagesDir = path.join(root, 'src', 'pages');
const projectsDir = path.join(pagesDir, 'projects');
const staticDir = path.join(root, 'static');
const SITE_ORIGIN = 'https://portfolio.zcohen-nerd.com';

const STATUS_VOCAB = ['Deployed', 'Public Beta', 'Prototype', 'Concept'];
// Concepts / roadmaps use a smaller required-field set than shipped systems.
const REDUCED_FIELD_STATUS = new Set(['Concept']);

const failures = [];
function fail(file, problem, fix) {
  failures.push({file, problem, fix});
  console.error(`FAIL  ${file}\n      problem: ${problem}\n      fix:     ${fix}\n`);
}
function pass(msg) {
  console.log(`  ok  ${msg}`);
}

// ── helpers ────────────────────────────────────────────────────────────────
function parseFrontMatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const fm = {};
  for (const raw of m[1].split(/\r?\n/)) {
    const mm = raw.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, '');
  }
  return {fm, body: text.slice(m[0].length)};
}

function pngDims(fp) {
  const b = fs.readFileSync(fp);
  return {w: b.readUInt32BE(16), h: b.readUInt32BE(20)};
}
function jpgDims(fp) {
  const b = fs.readFileSync(fp);
  let o = 2;
  while (o < b.length - 1) {
    if (b[o] !== 0xff) { o++; continue; }
    const marker = b[o + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return {h: b.readUInt16BE(o + 5), w: b.readUInt16BE(o + 7)};
    }
    o += 2 + b.readUInt16BE(o + 2);
  }
  return {w: 0, h: 0};
}
const imageDims = (fp) => (/\.jpe?g$/i.test(fp) ? jpgDims(fp) : pngDims(fp));

// Every page route the site serves, so internal links can be resolved.
function collectRoutes() {
  const routes = new Set(['/']);
  (function walk(dir, base) {
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).isDirectory()) { walk(fp, `${base}/${f}`); continue; }
      const m = f.match(/^(.+)\.mdx?$/);
      if (!m) continue;
      routes.add(m[1] === 'index' ? `${base}/` : `${base}/${m[1]}/`);
    }
  })(pagesDir, '');
  return routes;
}
const ROUTES = collectRoutes();

// ── per-file checks ───────────────────────────────────────────────────────
const projectFiles = fs
  .readdirSync(projectsDir)
  .filter((f) => /\.mdx?$/.test(f) && !/^index\.mdx?$/.test(f));

if (projectFiles.length === 0) {
  fail('src/pages/projects/', 'no project pages found', 'this validator expects project case studies under src/pages/projects/');
}

for (const f of projectFiles) {
  const rel = `src/pages/projects/${f}`;
  const text = fs.readFileSync(path.join(projectsDir, f), 'utf8');

  const parsed = parseFrontMatter(text);
  if (!parsed) {
    fail(rel, 'no YAML front-matter block', "add a leading '---' … '---' block with at least: title, description, status");
    continue;
  }
  const {fm, body} = parsed;

  // required fields (all project pages)
  for (const key of ['title', 'description', 'status']) {
    if (!fm[key]) fail(rel, `front matter is missing '${key}'`, `add a '${key}:' line to the front matter`);
  }

  // status vocabulary
  if (fm.status && !STATUS_VOCAB.includes(fm.status)) {
    fail(rel, `status "${fm.status}" is not an allowed value`, `set 'status:' to one of: ${STATUS_VOCAB.join(', ')}`);
  }
  const reduced = REDUCED_FIELD_STATUS.has(fm.status);

  // deployed-class pages must also declare a timeline + OG image
  if (!reduced && fm.status) {
    if (!fm.displayDate) {
      fail(rel, `a "${fm.status}" page has no timeline`, "add 'displayDate: <e.g. 2023–2025>' to the front matter (Concept / roadmap pages are exempt)");
    }
    if (!fm.image) {
      fail(rel, `a "${fm.status}" page has no OG image`, "add 'image: /img/og/og-<slug>.<png|jpg>' and generate it with scripts/generate-og-pages.ps1 (Concept pages are exempt)");
    }
  }

  // OG image, when declared: exists and is 1200x630
  if (fm.image) {
    const ogPath = path.join(staticDir, fm.image.replace(/^\//, ''));
    if (!fs.existsSync(ogPath)) {
      fail(rel, `front-matter image '${fm.image}' does not exist`, `create static${fm.image} or correct the 'image:' path`);
    } else {
      const d = imageDims(ogPath);
      if (d.w !== 1200 || d.h !== 630) {
        fail(rel, `OG image '${fm.image}' is ${d.w}x${d.h}, must be 1200x630`, 'regenerate it (scripts/generate-og-pages.ps1) or replace with a 1200x630 image');
      }
    }
  }

  // local image / asset references in the body must exist under static/
  const assetRefs = new Set();
  for (const m of body.matchAll(/(?:src|href)=["'](\/(?:assets|img|media)\/[^"']+\.(?:webp|png|jpe?g|gif|svg|mp4|webm))["']/g)) {
    assetRefs.add(m[1]);
  }
  // full-resolution links written as absolute site URLs
  for (const m of body.matchAll(new RegExp(`["']${SITE_ORIGIN.replace(/[.]/g, '\\.')}(/(?:assets|img|media)/[^"']+)["']`, 'g'))) {
    assetRefs.add(m[1]);
  }
  for (const ref of assetRefs) {
    const fp = path.join(staticDir, decodeURIComponent(ref).replace(/^\//, ''));
    if (!fs.existsSync(fp)) {
      fail(rel, `references a local asset that does not exist: ${ref}`, `add the file at static${ref} or fix the path`);
    }
  }

  // duplicate headings → duplicate anchor IDs
  const headings = [...body.matchAll(/^#{2,6}[ \t]+(.+?)[ \t]*$/gm)]
    .map((m) => m[1].replace(/\s*\{#[^}]+\}\s*$/, '').trim().toLowerCase())
    .filter(Boolean);
  const seen = new Set();
  const dups = new Set();
  for (const h of headings) {
    if (seen.has(h)) dups.add(h);
    seen.add(h);
  }
  if (dups.size) {
    fail(rel, `duplicate heading text would create duplicate anchor IDs: ${[...dups].join('; ')}`, 'make each heading unique, or give the repeats distinct explicit {#ids}');
  }

  // internal links resolve to a real route
  const linkMatches = [
    ...body.matchAll(/\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g),
    ...body.matchAll(/href=["'](\/[^"'\s#]*)(#[^"']*)?["']/g),
  ];
  for (const m of linkMatches) {
    const target = m[1];
    if (/\.(webp|png|jpe?g|gif|svg|pdf|mp4|webm|txt|md)$/i.test(target)) continue; // asset link
    const withSlash = target.endsWith('/') ? target : `${target}/`;
    if (!ROUTES.has(withSlash) && !ROUTES.has(target)) {
      const near = [...ROUTES].filter((r) => r.startsWith('/projects/')).sort().join(', ');
      fail(rel, `internal link '${target}' does not resolve to a page`, `point it at an existing route (e.g. one of: ${near}) or a static file`);
    }
  }

  // Related work: every project page must give the reader 2–3 contextual next
  // paths, each with a reason, none pointing back at this same page.
  const rwBlock = body.match(/<RelatedWork\b[\s\S]*?\/>/);
  const rwMarkdown = /^##\s+Related work\s*$/m.test(body);
  if (!rwBlock && !rwMarkdown) {
    fail(rel, 'no Related work section', "add a <RelatedWork items={[…]} /> block (or a '## Related work' list) with 2–3 contextual links");
  } else if (rwBlock) {
    const items = [...rwBlock[0].matchAll(/\{\s*href:\s*['"]([^'"]+)['"][\s\S]*?title:\s*['"]([^'"]*)['"][\s\S]*?reason:\s*['"]?/g)]
      .map((m) => ({href: m[1], title: m[2]}));
    const rawHrefs = [...rwBlock[0].matchAll(/href:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
    if (rawHrefs.length < 2 || rawHrefs.length > 3) {
      fail(rel, `Related work has ${rawHrefs.length} link(s); needs 2–3`, 'trim or add entries so each page offers 2–3 contextual next paths');
    }
    if (!/reason:/.test(rwBlock[0])) {
      fail(rel, 'Related work links have no reasons', "give every item a `reason:` that explains the relationship");
    }
    const selfSlug = f.replace(/\.mdx?$/, '');
    for (const href of rawHrefs) {
      if (/^https?:\/\//i.test(href)) {
        if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(href)) {
          fail(rel, `Related work external link is malformed: ${href}`, 'use a full https:// URL');
        }
      } else {
        const targetPath = href.replace(/#.*$/, '');
        const withSlash = targetPath === '' || targetPath === '/' ? '/' : targetPath.endsWith('/') ? targetPath : `${targetPath}/`;
        if (!ROUTES.has(withSlash) && !ROUTES.has(targetPath)) {
          fail(rel, `Related work internal link does not resolve: ${href}`, 'point it at an existing route');
        }
        if (targetPath.replace(/\/$/, '').endsWith(`/${selfSlug}`)) {
          fail(rel, `Related work links back to this same page (${href})`, 'related work is a next path, not a self-reference — remove it');
        }
      }
    }
  }

  if (!failures.some((x) => x.file === rel)) pass(`${rel} (${fm.status})`);
}

if (failures.length) {
  console.error(`\n${failures.length} content validation failure(s). Fix the files above.`);
  process.exit(1);
}
console.log('\nAll content validations passed.');
