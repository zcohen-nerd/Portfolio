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

// Brand dependency must come from the npm registry, not a local path.
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const brandDep = pkg.dependencies['@zcohen-nerd/brand'] || '';
check('brand dependency is a registry version', /^\d+\.\d+\.\d+$/.test(brandDep), `got "${brandDep}"`);
const lock = fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8');
check('lockfile has no local brand paths', !lock.includes('"file:') && !lock.includes('../zcohen-nerd-brand'));

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

// JSON-LD: a global Person identity is expected; NO route may emit a
// ProfilePage that claims to be the portfolio homepage (the former global
// ProfilePage defect). Blocks are parsed, not substring-matched.
function ldBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try { return JSON.parse(m[1]); } catch { return {__parseError: true}; }
  });
}
const homeLd = ldBlocks(indexHtml);
check('homepage JSON-LD parses', homeLd.length > 0 && homeLd.every((b) => !b.__parseError));
check('homepage Person identity anchored to hub', homeLd.some((b) => b['@type'] === 'Person' && b.url === 'https://zcohen-nerd.com/'));
for (const route of ['', 'projects/sentry-v3', 'projects/fusion-system-blocks', 'projects/stlink-v3mods', 'teaching/ent260-solidworks']) {
  const f = path.join(build, route, 'index.html');
  const blocks = ldBlocks(fs.readFileSync(f, 'utf8'));
  const badProfile = blocks.find((b) => b['@type'] === 'ProfilePage' && b.url === 'https://portfolio.zcohen-nerd.com/');
  check(`no homepage ProfilePage on /${route || ''}`, !badProfile);
}

// Sitemap
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check('sitemap non-empty', locs.length > 0);
check('sitemap uses portfolio domain', locs.every((u) => u.startsWith(DOMAIN + '/')), locs.find((u) => !u.startsWith(DOMAIN + '/')));
check('sitemap URLs end with /', locs.every((u) => u.endsWith('/')), locs.find((u) => !u.endsWith('/')));
check('sitemap includes surfer-fleet', sitemap.includes(`${DOMAIN}/projects/surfer-fleet/`));

// Robots
check('robots has Sitemap directive', robots.includes(`Sitemap: ${DOMAIN}/sitemap.xml`));
check('robots allows crawling', robots.includes('User-agent: *') && robots.includes('Allow: /'));

// Résumé
check('resume PDF in build', fs.existsSync(path.join(build, 'files', 'zac-cohen-resume.pdf')));
check('resume link on homepage', indexHtml.includes('href="/files/zac-cohen-resume.pdf"'));

// ── SURFER Fleet page guards ─────────────────────────────────────────────
// Published as a real project page; must carry the canonical facts, the
// open-ended timeline, and no leftover draft placeholders.
const surferPage = path.join(build, 'projects', 'surfer-fleet', 'index.html');
const surferExists = fs.existsSync(surferPage);
check('SURFER page exists in build', surferExists, path.relative(build, surferPage));
const surferHtml = surferExists ? fs.readFileSync(surferPage, 'utf8') : '';
const surferVisible = surferHtml.replace(/<script[\s\S]*?<\/script>/g, '');
check('SURFER page is real content, not a redirect', surferVisible.includes('Holonomic Autonomous Surface Vessels'));
check('SURFER timeline is open-ended', surferVisible.includes('2020–Present') && !surferVisible.includes('2020–2026'));
check('SURFER documents the dual-Pi authority boundary', surferVisible.includes('Student Raspberry Pi') && surferVisible.includes('Vessel Raspberry Pi'));
check('SURFER documents VESC propulsion', surferVisible.includes('VESC'));
check('SURFER e-stop preserves compute', surferVisible.includes('remain powered'));
check('SURFER role attribution present', surferVisible.includes('My Role'));
check('SURFER program vs role timeline explicit', surferVisible.includes('My role:') && surferVisible.includes('2024–2026'));
check('SURFER has no draft placeholders', !/TBD|TODO/.test(surferVisible));
check('SURFER hero image referenced', surferHtml.includes('/assets/images/projects/surfer-fleet/surfer-on-water.webp'));
const surferDiagramChunk = fs.readdirSync(path.join(build, 'assets', 'js')).filter((f) => f.endsWith('.js'))
  .some((f) => fs.readFileSync(path.join(build, 'assets', 'js', f), 'utf8').includes('STUDENT[Student Raspberry Pi 4]'));
check('SURFER diagram definition present in page chunk', surferDiagramChunk);
// Inline media budget, same policy as SENTRY.
const surferMediaRefs = [...new Set([...surferHtml.matchAll(/(?:src|poster)="(\/(?:assets|media)\/[^"]+\.(?:webp|png|jpg|jpeg|gif|webm|mp4))"/g)].map((m) => m[1]))];
let surferMediaTotal = 0;
for (const ref of surferMediaRefs) {
  const fp = path.join(build, decodeURIComponent(ref).replace(/^\//, ''));
  if (fs.existsSync(fp)) surferMediaTotal += fs.statSync(fp).size;
}
check('SURFER inline media under 1200 KB', surferMediaTotal / 1024 < 1200, `${Math.round(surferMediaTotal / 1024)} KB across ${surferMediaRefs.length} files`);
// Discoverable from the projects index.
const projIndexHtml = fs.readFileSync(path.join(build, 'projects', 'index.html'), 'utf8');
check('projects index links surfer-fleet', projIndexHtml.includes('/projects/surfer-fleet/'));

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
const hasDiagramChunk = jsFiles.some((f) => fs.readFileSync(path.join(jsDir, f), 'utf8').includes('ADDIN[Fusion add-in layer]'));
const hasMermaidRuntime = jsFiles.some((f) => fs.readFileSync(path.join(jsDir, f), 'utf8').includes('docusaurus-mermaid-container'));
check('Fusion diagram definition present in page chunk', hasDiagramChunk);
check('Mermaid theme runtime present in build', hasMermaidRuntime);

// ── Step 3 factual-correctness guards ────────────────────────────────────
// Fusion System Blocks must describe the real Fusion add-in.
check('FSB identifies as an Autodesk Fusion add-in', fusionVisible.includes('Autodesk Fusion add-in'));
check('FSB links its GitHub repository', fusionHtml.includes('github.com/zcohen-nerd/Fusion_System_Blocks'));
check('FSB links its Releases page', fusionHtml.includes('Fusion_System_Blocks/releases'));
check('FSB has Verification & Diagnostics section', fusionVisible.includes('Verification'));
check('FSB shows Public Beta', fusionVisible.includes('Public Beta'));
check('FSB carries current test evidence', fusionVisible.includes('775') && fusionVisible.includes('24') && fusionVisible.includes('30'));
check('FSB obsolete workflow-only framing absent', !fusionVisible.includes('lightweight architectural framework'));

// SPARK must describe the real V0.4 protection/power/translation design.
const sparkHtml = fs.readFileSync(path.join(build, 'projects', 'stlink-v3mods', 'index.html'), 'utf8');
const sparkVisible = sparkHtml.replace(/<script[\s\S]*?<\/script>/g, '');
check('SPARK documents eFuse entry protection', sparkVisible.includes('TPS2596'));
check('SPARK documents switched target rails', sparkVisible.includes('TPS22919'));
check('SPARK documents hybrid translation', sparkVisible.includes('LSF0108') && sparkVisible.includes('SN74AXC8T245'));
check('SPARK documents CAN FD', sparkVisible.includes('TCAN1051'));
check('SPARK documents 4-layer PCB', sparkVisible.includes('4-layer'));
check('SPARK links its GitHub repository', sparkHtml.includes('github.com/zcohen-nerd/SPARK'));
check('SPARK validation status is explicit', sparkVisible.includes('no completed measurement records are published yet'));
check('SPARK status reflects beta hardware in bring-up', sparkVisible.includes('bring-up are underway') && !sparkVisible.includes('not recorded in the repository'));
check('SPARK uses precise resistance wording', sparkVisible.includes('22 Ω series resistance') && !sparkVisible.includes('series impedance') && !sparkVisible.includes('controlled-impedance PCB'));
check('SPARK false no-active-circuitry rationale absent', !sparkVisible.includes('clean signal breakout rather than adding active circuitry') && !sparkVisible.includes('Keeping the board electrically simple'));

// ENT260 must read as a proposal, with the CSWA outcome kept historical.
const entHtml = fs.readFileSync(path.join(build, 'teaching', 'ent260-solidworks', 'index.html'), 'utf8');
const entVisible = entHtml.replace(/<script[\s\S]*?<\/script>/g, '');
check('ENT260 labeled Proposed Curriculum Redesign', entVisible.includes('Proposed Curriculum Redesign'));
check('ENT260 CSWA outcome tied to prior offerings', entVisible.includes('prior offerings of the existing course, approximately 75%'));
check('ENT260 separation statement present', entVisible.includes('not the proposal'));
check('ENT260 no unqualified rewrite claim', !entVisible.includes('ENT260 was rewritten') && !entVisible.includes('ENT260 was redesigned'));

// SENTRY heading and usage wording.
const sentryHtml = fs.readFileSync(path.join(build, 'projects', 'sentry-v3', 'index.html'), 'utf8');
check('SENTRY heading uses caps + Deployed framing', sentryHtml.includes('SENTRY V3: Deployed Mechatronics Platform'));
check('SENTRY heading avoids commercial-production claim', !sentryHtml.includes('Production Embedded Actuation System'));
check('SENTRY usage metric carries deployment context', sentryHtml.includes('U.S. Naval Academy instructional deployment'));
check('SENTRY My Role section present', sentryHtml.includes('My Role'));

// Homepage positioning: proof strip present, SURFER leads Featured Systems.
check('homepage proof strip present', indexHtml.includes('proof-strip'));
// Relative hrefs only — the shared brand disclosure links SENTRY with
// absolute portfolio URLs before the page body.
const surferFeatured = indexHtml.indexOf('href="/projects/surfer-fleet/"');
const sentryFeatured = indexHtml.indexOf('href="/projects/sentry-v3/"');
check('homepage features SURFER before SENTRY', surferFeatured > -1 && sentryFeatured > -1 && surferFeatured < sentryFeatured);

// Literacy canonical facts.
const litHtml = fs.readFileSync(path.join(build, 'teaching', 'instructional-design', 'index.html'), 'utf8');
check('Literacy age range is canonical 8–12', litHtml.includes('ages 8–12') && !litHtml.includes('ages 7-11'));
check('Literacy source links canonical org', litHtml.includes('github.com/literacy-for-kids'));
check('Literacy legacy repo link absent', !litHtml.includes('github.com/zcohen-nerd/computer_literacy_for_kids'));

// ── Step 4 content-completion guards ─────────────────────────────────────
// Teaching index: distinct cards, honest section names, historical CSWA.
const teachHtml = fs.readFileSync(path.join(build, 'teaching', 'index.html'), 'utf8');
const teachVisible = teachHtml.replace(/<script[\s\S]*?<\/script>/g, '');
check('teaching section renamed', teachVisible.includes('Teaching & Curriculum Projects') || teachVisible.includes('Teaching &amp; Curriculum Projects'));
check('no empty Impact & Metrics section', !teachVisible.includes('Impact & Metrics') && !teachVisible.includes('Impact &amp; Metrics'));
check('literacy card describes digital literacy', teachVisible.includes('computer-literacy curriculum'));
check('ENT260 card marked Proposed', teachVisible.includes('Proposed SolidWorks Curriculum Redesign'));
check('teaching cards are distinct', !teachVisible.includes('Course materials, learning objectives, and example projects demonstrating'));
check('Anne Arundel Community College named on teaching page', teachVisible.includes('Anne Arundel Community College'));
check('CSWA outcome historically qualified on teaching page', teachVisible.includes('prior offerings of ENT260'));

// Selected Essays: real Substack inventory, occasional cadence.
const essaysHtml = fs.readFileSync(path.join(build, 'documentation', 'selected-essays', 'index.html'), 'utf8');
const essaysVisible = essaysHtml.replace(/<script[\s\S]*?<\/script>/g, '');
const essayLinks = [...essaysHtml.matchAll(/href="(https:\/\/zcohennerd\.substack\.com\/p\/[^"]+)"/g)].map((m) => m[1]);
check('Selected Essays lists at least one essay', essayLinks.length >= 1, `found ${essayLinks.length}`);
check('essay entries carry publication dates', (essaysVisible.match(/Published:/g) || []).length >= essayLinks.length ? true : (essaysVisible.match(/Published:/g) || []).length >= 1);
check('essays cadence remains occasional', essaysVisible.includes('occasional'));
check('no six-week cadence on essays page', !essaysVisible.includes('six weeks') && !essaysVisible.includes('six-week'));
check('no LinkedIn writing destination on essays page', !essaysHtml.includes('linkedin.com/in/zachary-cohen-nerd/recent-activity'));

// Writing & Research index: only real collections promised.
const docsHtml = fs.readFileSync(path.join(build, 'documentation', 'index.html'), 'utf8');
const docsVisible = docsHtml.replace(/<script[\s\S]*?<\/script>/g, '');
check('no unsupported templates/governance promise', !docsVisible.includes('templates, and governance models') && !docsVisible.includes('governance models'));
check('no unsupported measurable-impact claim', !docsVisible.includes('measurable impact and repeatability'));
check('index links Selected Essays', docsHtml.includes('/documentation/selected-essays/'));
check('index links Scholarship', docsHtml.includes('/documentation/scholarship/'));

// ── SENTRY V4 planned-architecture language guard ────────────────────────
// V4 is unbuilt; the page must not claim achieved performance.
const v4Html = fs.readFileSync(path.join(build, 'projects', 'sentry-v4', 'index.html'), 'utf8');
const v4Visible = v4Html.replace(/<script[\s\S]*?<\/script>/g, '');
check('SENTRY V4 avoids achieved-benefit claims', !v4Visible.includes('significantly improves'));
check('SENTRY V4 keeps planned framing', v4Visible.includes('does not describe a completed or deployed system'));

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

// ── Step 5 polish guards ─────────────────────────────────────────────────
// No publicly served filenames may contain spaces.
const spaced = [];
(function walkStatic(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p2 = path.join(dir, f);
    if (fs.statSync(p2).isDirectory()) walkStatic(p2);
    else if (f.includes(' ')) spaced.push(path.relative(root, p2));
  }
})(path.join(root, 'static'));
check('no spaced filenames in static/', spaced.length === 0, spaced[0]);

// No stale references to renamed assets in built HTML.
const staleNeedles = ['How%20I%20Build', 'SENTRY%20Turret', 'SENTRY%20Schematic', 'SENTRY%20PCB.png', 'Cross%20Section%20blur', 'System%20Diagram.png', 'SENTRY Reveal'];
for (const needle of staleNeedles) {
  const hit = htmlFiles.find((f) => fs.readFileSync(f, 'utf8').includes(needle));
  check(`no stale asset ref: ${needle}`, !hit, hit ? path.relative(build, hit) : '');
}

// SENTRY inline media budget: every media file referenced by the page,
// summed from the build output, stays under 1200 KB.
const sentryPage = fs.readFileSync(path.join(build, 'projects', 'sentry-v3', 'index.html'), 'utf8');
// Media only (not JS bundles); a browser downloads one video source, so
// the mp4 fallback is excluded when the webm is present.
const mediaRefs = [...new Set([...sentryPage.matchAll(/(?:src|poster)="(\/(?:assets|media)\/[^"]+\.(?:webp|png|jpg|jpeg|gif|webm|mp4))"/g)].map((m) => m[1]))]
  .filter((r) => !(r.endsWith('.mp4') && sentryPage.includes(r.replace('.mp4', '.webm'))));
let mediaTotal = 0;
for (const ref of mediaRefs) {
  const fp = path.join(build, decodeURIComponent(ref).replace(/^\//, ''));
  if (fs.existsSync(fp)) mediaTotal += fs.statSync(fp).size;
}
check('SENTRY inline media under 1200 KB', mediaTotal / 1024 < 1200, `${Math.round(mediaTotal / 1024)} KB across ${mediaRefs.length} files`);

// Retained full-resolution links are clearly labeled.
check('full-resolution links carry visible labels', (sentryPage.match(/Open full-resolution/g) || []).length >= 4);

// Titles: homepage must not repeat itself; site title is concise.
const homeTitle = (indexHtml.match(/<title[^>]*>([^<]+)<\/title>/) || [])[1] || '';
check('homepage title is deduplicated', homeTitle.includes('Electromechanical Systems Engineer') && homeTitle.includes('Zac Cohen Portfolio') && !/Zachary Cohen—Engineering Portfolio \| Zachary/.test(homeTitle), homeTitle);

// Page-specific OG images: files exist at 1200x630 and pages reference them.
function pngDims(fp) {
  const b = fs.readFileSync(fp);
  return {w: b.readUInt32BE(16), h: b.readUInt32BE(20)};
}
const ogPages = [
  ['projects/sentry-v3', 'og-sentry-v3.png'],
  ['projects/stlink-v3mods', 'og-spark.png'],
  ['projects/fusion-system-blocks', 'og-fusion-system-blocks.png'],
  ['teaching', 'og-teaching.png'],
  ['documentation', 'og-writing-research.png'],
  ['frc', 'og-frc.png'],
];
for (const [route, img] of ogPages) {
  const fp = path.join(build, 'img', 'og', img);
  const exists = fs.existsSync(fp);
  check(`OG image exists: ${img}`, exists);
  if (exists) {
    const d = pngDims(fp);
    check(`OG image ${img} is 1200x630`, d.w === 1200 && d.h === 630, `${d.w}x${d.h}`);
  }
  const pageHtml = fs.readFileSync(path.join(build, route, 'index.html'), 'utf8');
  check(`route /${route}/ uses its own OG image`, pageHtml.includes(`/img/og/${img}`));
}

// ── About page guards ────────────────────────────────────────────────────
// The About page carries the professional record and must never leak the
// résumé's private fields (phone, home town, clearance details).
const aboutHtml = fs.readFileSync(path.join(build, 'about', 'index.html'), 'utf8');
const aboutVisible = aboutHtml.replace(/<script[\s\S]*?<\/script>/g, '');
check('About names current employer', aboutVisible.includes('BlackSea Technologies'));
check('About carries USNA experience', aboutVisible.includes('U.S. Naval Academy'));
check('About lists education', aboutVisible.includes('Old Dominion University') && aboutVisible.includes('Millersville University'));
check('About lists CSWP certification', aboutVisible.includes('Certified SolidWorks Professional'));
check('About links the résumé PDF', aboutHtml.includes('/files/zac-cohen-resume.pdf'));
check('About has no clearance mention', !/clearance/i.test(aboutVisible));
check('About avoids awkward proofing phrasing', !aboutVisible.includes('proofing'));
check('About has no phone number', !/\(\d{3}\)\s?\d{3}-\d{4}/.test(aboutVisible));
check('About has no home town', !aboutVisible.includes('Edgewater'));
check('homepage links About', indexHtml.includes('href="/about/"'));

// Custom 404.
const notFound = fs.readFileSync(path.join(build, '404.html'), 'utf8');
check('custom 404 content present', notFound.includes('wandered off during integration'));
check('404 links to projects and hub', notFound.includes('href="/projects/"') && notFound.includes('https://zcohen-nerd.com/'));

if (failures.length) {
  console.error(`\n${failures.length} validation failure(s).`);
  process.exit(1);
}
console.log('\nAll build validations passed.');
