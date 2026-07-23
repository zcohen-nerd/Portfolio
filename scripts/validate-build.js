/**
 * Post-build validation for the portfolio (run after `npm run build`).
 * Fails CI on canonical-URL, metadata, sitemap, robots, or content
 * regressions. Static assertions on built output only.
 *
 * Usage: node scripts/validate-build.js
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const build = path.join(root, 'build');
const DOMAIN = 'https://portfolio.zcohen-nerd.com';
let failures = [];

function check(name, ok, detail = '') {
  if (ok) {
    console.log(`  ok  ${name}`);
  } else {
    failures.push(name + (detail ? ` — ${detail}` : ''));
    console.error(`FAIL  ${name}${detail ? ' — ' + detail : ''}`);
  }
}

const cname = fs.readFileSync(path.join(root, 'static', 'CNAME'), 'utf8').trim();
const indexHtml = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
const sitemap = fs.readFileSync(path.join(build, 'sitemap.xml'), 'utf8');
const robots = fs.readFileSync(path.join(build, 'robots.txt'), 'utf8');

// Canonical
check('CNAME is portfolio subdomain', cname === 'portfolio.zcohen-nerd.com', `got "${cname}"`);
check('canonical link uses portfolio domain', indexHtml.includes(`rel="canonical" href="${DOMAIN}/"`));

// OG image
check('OG image exists', fs.existsSync(path.join(build, 'img', 'og-zac-cohen-portfolio.png')));
check('og:image meta present', indexHtml.includes('og-zac-cohen-portfolio.png'));

// JSON-LD
const jsonLd = [...indexHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
check('one JSON-LD block', jsonLd.length === 1, `found ${jsonLd.length}`);
try {
  const parsed = JSON.parse(jsonLd[0]?.[1] ?? '');
  check('JSON-LD is ProfilePage', parsed['@type'] === 'ProfilePage');
  check('Person identity anchored to hub', parsed.mainEntity?.url === 'https://zcohen-nerd.com/');
} catch (e) {
  check('JSON-LD parses', false, e.message);
}

// Sitemap
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check('sitemap non-empty', locs.length > 0);
check('sitemap uses portfolio domain', locs.every((u) => u.startsWith(DOMAIN + '/')), locs.find((u) => !u.startsWith(DOMAIN + '/')));
check('sitemap URLs end with /', locs.every((u) => u.endsWith('/')), locs.find((u) => !u.endsWith('/')));
check('sitemap excludes surfer-fleet', !sitemap.includes('surfer-fleet'));

// Robots
check('robots has Sitemap directive', robots.includes(`Sitemap: ${DOMAIN}/sitemap.xml`));
check('robots allows crawling', robots.includes('User-agent: *') && robots.includes('Allow: /'));

// Résumé
check('resume PDF in build', fs.existsSync(path.join(build, 'files', 'zac-cohen-resume.pdf')));
check('resume link on homepage', indexHtml.includes('href="/files/zac-cohen-resume.pdf"'));

// Surfer Fleet stays unpublished (redirect page only, no content)
const surferPage = path.join(build, 'projects', 'surfer-fleet', 'index.html');
if (fs.existsSync(surferPage)) {
  const surfer = fs.readFileSync(surferPage, 'utf8');
  check('surfer-fleet is redirect-only', surfer.includes('url=/projects/') && !surfer.includes('Maritime'));
} else {
  check('surfer-fleet route absent or redirect', true);
}
check('Surfer Fleet draft preserved outside published routes', fs.existsSync(path.join(root, 'drafts', 'projects', 'surfer-fleet', 'surfer-fleet.md')));

// Batch B publication facts intact
const scholarship = fs.readFileSync(path.join(build, 'documentation', 'scholarship', 'index.html'), 'utf8');
check('ICUAS title present', scholarship.includes('GNSS Emulator for Test and Evaluation'));
check('IROS presenter credit present', scholarship.includes('Co-author and conference presenter'));
check('Abu Dhabi present', scholarship.includes('Abu Dhabi'));
check('no six-week cadence claim', !scholarship.includes('every six weeks'));

// Legacy URLs must not appear
const htmlFiles = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) htmlFiles.push(p);
  }
})(build);
for (const needle of ['zcohen-nerd.github.io/Portfolio', 'literacy-for-kids.github.io', 'computer_literacy_for_kids/img/']) {
  const hit = htmlFiles.find((f) => fs.readFileSync(f, 'utf8').includes(needle));
  check(`no legacy URL: ${needle}`, !hit, hit ? path.relative(build, hit) : '');
}

// ── Mermaid regression guard ─────────────────────────────────────────────
// The Fusion System Blocks diagram once shipped as a raw <div class="mermaid">
// wrapper that rendered as body text. Guard both the source and the build.

// Source: no raw Mermaid wrappers in any published page; the Fusion page
// must use a fenced ```mermaid block. (drafts/ is private and exempt.)
const srcPages = [];
(function walkSrc(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walkSrc(p);
    else if (/\.(md|mdx|js)$/.test(f)) srcPages.push(p);
  }
})(path.join(root, 'src', 'pages'));
const rawWrapperHit = srcPages.find((f) => fs.readFileSync(f, 'utf8').includes('<div class="mermaid"'));
check('no raw Mermaid wrappers in published source', !rawWrapperHit, rawWrapperHit ? path.relative(root, rawWrapperHit) : '');
const fusionSrc = fs.readFileSync(path.join(root, 'src', 'pages', 'projects', 'fusion-system-blocks.md'), 'utf8');
check('Fusion System Blocks source uses a fenced mermaid block', fusionSrc.includes('```mermaid'));

// Build: the Fusion page's visible HTML (scripts stripped) must not contain
// unprocessed diagram source…
const fusionHtml = fs.readFileSync(path.join(build, 'projects', 'fusion-system-blocks', 'index.html'), 'utf8');
const fusionVisible = fusionHtml.replace(/<script[\s\S]*?<\/script>/g, '');
check('no raw flowchart source in Fusion page HTML', !fusionVisible.includes('flowchart') && !fusionVisible.includes('SYS[System Context]'));
check('no raw mermaid wrapper in Fusion page HTML', !fusionHtml.includes('<div class="mermaid"'));

// …and the Mermaid integration must actually be wired in: the diagram is
// client-hydrated, so the evidence lives in the JS assets — the page chunk
// carries the diagram definition and the theme runtime carries the
// docusaurus-mermaid-container it renders into (structure confirmed from
// real build output).
const jsDir = path.join(build, 'assets', 'js');
const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'));
const hasDiagramChunk = jsFiles.some((f) => fs.readFileSync(path.join(jsDir, f), 'utf8').includes('SYS[System Context]'));
const hasMermaidRuntime = jsFiles.some((f) => fs.readFileSync(path.join(jsDir, f), 'utf8').includes('docusaurus-mermaid-container'));
check('Fusion diagram definition present in page chunk', hasDiagramChunk);
check('Mermaid theme runtime present in build', hasMermaidRuntime);

// ── FIRST history heading guard ──────────────────────────────────────────
const frcHistory = fs.readFileSync(path.join(build, 'frc', 'history', 'index.html'), 'utf8');
const h1Count = (frcHistory.match(/<h1[\s>]/g) || []).length;
check('FIRST history contains exactly one H1', h1Count === 1, `found ${h1Count}`);

// Accessibility statics (shared brand navigation)
check('project disclosure in HTML', indexHtml.includes('id="zc-project-disclosure"'));
check('drawer trigger has aria-controls', indexHtml.includes('aria-controls="zc-mobile-drawer"'));
const discStart = indexHtml.indexOf('id="zc-project-disclosure"');
const discEnd = indexHtml.indexOf('id="zc-mobile-drawer"');
const discBody = discStart !== -1 && discEnd > discStart ? indexHtml.slice(discStart, discEnd) : '';
check('disclosure links server-rendered', (discBody.match(/href="/g) || []).length >= 8, `found ${(discBody.match(/href="/g) || []).length}`);

// ── Distinct Projects / Ecosystem navigation (Step 2) ────────────────────
// The internal Projects link and the shared Ecosystem disclosure must both
// exist and be clearly distinct. Structural checks — no global string bans
// ("Projects" legitimately appears across the site).
check('internal Projects link targets /projects/', /<a[^>]*href="\/projects\/"[^>]*>Projects/.test(indexHtml));
const ecoTriggerMatch = indexHtml.match(/<button[^>]*aria-controls="zc-project-disclosure"[^>]*>([\s\S]*?)<\/button>/);
const ecoTriggerText = (ecoTriggerMatch?.[1] || '').replace(/<[^>]+>/g, '').trim();
check('ecosystem disclosure trigger labeled Ecosystem', ecoTriggerText.startsWith('Ecosystem'), `got "${ecoTriggerText}"`);
check('old shared Projects trigger absent', !ecoTriggerText.startsWith('Projects'));

// Fusion System Blocks page must keep its Public Beta status.
const fsbPage = fs.readFileSync(path.join(build, 'projects', 'fusion-system-blocks', 'index.html'), 'utf8');
check('Fusion System Blocks page shows Public Beta', fsbPage.includes('Public Beta'));
const ids = [...indexHtml.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
check('no duplicate ids', ids.length === new Set(ids).size);

if (failures.length) {
  console.error(`\n${failures.length} validation failure(s).`);
  process.exit(1);
}
console.log('\nAll build validations passed.');
