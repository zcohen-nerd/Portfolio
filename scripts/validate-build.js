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
check('SURFER program vs role timeline explicit', /\bmy role\b/i.test(surferVisible) && surferVisible.includes('2024–2026'));
check('SURFER has no draft placeholders', !/TBD|TODO/.test(surferVisible));
check('SURFER hero image referenced', surferHtml.includes('/assets/images/projects/surfer-fleet/surfer-on-water.webp'));

// ── SURFER hiring-artifact guards ───────────────────────────────────────
const surferText = surferVisible.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const sliceBetween = (a, b) => {
  const i = surferText.indexOf(a);
  const j = surferText.indexOf(b, i + 1);
  return i !== -1 && j > i ? surferText.slice(i, j) : '';
};

// 1. "At a glance" carries all five framing points, qualifiers intact.
const glance = sliceBetween('At a glance', 'Public evidence and disclosure boundary');
check('SURFER At a glance present before the disclosure note', glance !== '');
check('SURFER At a glance states problem + scale', glance.includes('Problem:') && glance.includes('70%') && glance.includes('20-vessel'));
check('SURFER At a glance states Deployed status', glance.includes('Status: Deployed'));
check('SURFER At a glance separates program vs role timeline',
  glance.includes('Program vs. my role') && glance.includes('since 2020') && glance.includes('2024') && glance.includes('2026'));
check('SURFER At a glance states the ownership boundary',
  glance.includes('Ownership boundary:') && glance.includes('faculty developed the higher-level vessel and research software'));
check('SURFER At a glance keeps the hull-cost outcome with qualifier',
  glance.includes('Measured outcomes:') && glance.includes('~$2,500 to ~$400') && glance.includes('84%'));

// 4. Dedicated public-evidence / disclosure boundary section — honest.
const disc = sliceBetween('Public evidence and disclosure boundary', 'Overview');
check('SURFER has a public-evidence disclosure boundary section', disc !== '');
check('disclosure explains the sanitized/public scope', disc.includes('already public or cleared for public sharing'));
check('disclosure names what is omitted', disc.includes('not mine to publish') && disc.includes('unpublished experiment data'));
check('disclosure separates later employment', disc.includes('draws on nothing from my later employment'));
check('disclosure invents no restriction it does not have', !/\b(classified|ITAR|export[- ]control(?:led)?|CUI|secret)\b/i.test(disc));

// 5. Measured before/after table — supported by the existing narrative.
check('SURFER carries a measured before/after table',
  surferText.includes('measured before and after') && /<table/.test(surferHtml));
check('before/after table keeps the approximate qualifiers',
  surferText.includes('~13 days') && surferText.includes('~14 hours') && surferText.includes('as-printed in Grey Resin'));

// 2. One improved architecture diagram — present once, six required points.
const readProjectSource = (slug) => {
  for (const ext of ['.mdx', '.md']) {
    const fp = path.join(root, 'src', 'pages', 'projects', slug + ext);
    if (fs.existsSync(fp)) return fs.readFileSync(fp, 'utf8');
  }
  throw new Error(`project source not found for ${slug}`);
};
const surferSrc = readProjectSource('surfer-fleet');
const mermaidFences = (surferSrc.match(/```mermaid/g) || []).length;
check('SURFER has exactly one architecture diagram (improved, not duplicated)', mermaidFences === 1, `found ${mermaidFences}`);
check('SURFER diagram was upgraded past the old flat flowchart',
  !surferSrc.includes('STUDENT[Student Raspberry Pi 4] <-->|Ethernet command library|'));
const jsChunks = fs.readdirSync(path.join(build, 'assets', 'js'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => fs.readFileSync(path.join(build, 'assets', 'js', f), 'utf8'));
const diagramSrc = jsChunks.find((c) => c.includes('the only thing an e-stop removes')) || '';
check('SURFER diagram definition present in page chunk', diagramSrc !== '');
for (const concept of [
  'Always-on domain',                          // power domains + observable-after-shutdown
  'Propulsion power domain',                    // power domains
  'validates every command, owns actuation',   // dual-Pi authority boundary
  'request only, no direct actuator access',   // dual-Pi authority boundary
  'CAN motion commands',                        // propulsion / control path
  'enable + heartbeat',                         // safety / e-stop behaviour
  'gated propulsion power',                     // safety cuts propulsion only
  'shore link + e-stops',                       // operator / comms interface
  'stay powered and observable through an e-stop', // what remains observable after shutdown
]) {
  check(`SURFER diagram communicates: ${concept}`, diagramSrc.includes(concept));
}
check('SURFER diagram carries Mermaid accessibility text (accTitle/accDescr)',
  surferSrc.includes('accTitle:') && surferSrc.includes('accDescr:'));

// 3. Caption explains the engineering insight, not the object.
check('SURFER architecture caption explains the insight',
  surferText.includes('Two design choices carry most of the safety argument'));
check('SURFER hull caption explains the reliability insight',
  surferText.includes('Every sealing interface is a leak path'));

// 7. Figures: alt text, explicit dimensions, sane loading (attribute order-agnostic).
const surferImgs = [...surferHtml.matchAll(/<img\b[^>]*>/g)]
  .map((m) => m[0])
  .filter((t) => t.includes('/assets/images/projects/surfer-fleet/'));
check('SURFER figure set present', surferImgs.length >= 5, `found ${surferImgs.length}`);
for (const img of surferImgs) {
  check('SURFER figure has alt + width + height',
    /\balt="[^"]{15,}"/.test(img) && /\bwidth="\d+"/.test(img) && /\bheight="\d+"/.test(img), img.slice(0, 100));
}
const heroImg = surferImgs.find((t) => t.includes('surfer-on-water.webp')) || '';
const hatImg = surferImgs.find((t) => t.includes('can-hat.webp')) || '';
check('SURFER hero loads eager', /loading="eager"/.test(heroImg), heroImg.slice(0, 90));
check('SURFER board renders load lazy', /loading="lazy"/.test(hatImg), hatImg.slice(0, 90));

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
const fusionSrc = readProjectSource('fusion-system-blocks');
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
check('SENTRY V4 avoids achieved-benefit claims', !/significantly improve(s)?/i.test(v4Visible));
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
const ogPages = [
  ['about', 'og-about.png'],
  ['projects', 'og-projects.png'],
  ['projects/surfer-fleet', 'og-surfer.jpg'],
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
    const d = imageDims(fp);
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
check('About avoids awkward proofing phrasing', !/\bproofing\b/i.test(aboutVisible));
check('About has no phone number', !/\(\d{3}\)\s?\d{3}-\d{4}/.test(aboutVisible));
check('About has no home town', !aboutVisible.includes('Edgewater'));
check('homepage links About', indexHtml.includes('href="/about/"'));

// Custom 404.
const notFound = fs.readFileSync(path.join(build, '404.html'), 'utf8');
check('custom 404 content present', notFound.includes('wandered off during integration'));
check('404 links to projects and hub', notFound.includes('href="/projects/"') && notFound.includes('https://zcohen-nerd.com/'));

// ── Recruiter-scan pass: hero qualifier, top actions, orientation ────────
const homeVisible = indexHtml.replace(/<script[\s\S]*?<\/script>/g, '');

// Role retained + compact domain qualifier derived from existing facts.
check('homepage retains the Electromechanical Systems Engineer role', indexHtml.includes('Electromechanical Systems Engineer'));
check('homepage has a domain qualifier line', indexHtml.includes('class="hero-domains"'));
const domainsText = (indexHtml.match(/class="hero-domains"[^>]*>([^<]*)</) || [])[1] || '';
check('domain qualifier covers maritime + robotics + embedded + integration',
  /maritime/i.test(domainsText) && /robotic/i.test(domainsText) && /embedded/i.test(domainsText) && /integration/i.test(domainsText),
  `"${domainsText}"`);
check('domain qualifier stays compact (<=90 chars, <=5 terms — no keyword stuffing)',
  domainsText.length > 0 && domainsText.length <= 90 && domainsText.split('·').length <= 5,
  `"${domainsText}" (${domainsText.length} chars, ${domainsText.split('·').length} terms)`);

// Top-of-page actions: the three required links, correct targets, above the fold
// (before Featured Systems), no phone/address/new personal data.
const actionsIdx = indexHtml.indexOf('class="hero-actions"');
const featuredIdx = indexHtml.indexOf('id="featured-systems"');
check('hero actions block present', actionsIdx !== -1);
check('hero actions sit above Featured Systems', actionsIdx !== -1 && featuredIdx > actionsIdx, `actions@${actionsIdx} featured@${featuredIdx}`);
const actionsBlock = actionsIdx !== -1 ? indexHtml.slice(actionsIdx, indexHtml.indexOf('</div>', actionsIdx) + 6) : '';
check('action "View selected systems" targets #featured-systems',
  actionsBlock.includes('href="#featured-systems"') && actionsBlock.includes('View selected systems'));
check('action "Résumé (PDF)" targets the résumé file',
  actionsBlock.includes('href="/files/zac-cohen-resume.pdf"') && actionsBlock.includes('(PDF)'));
check('action "Email Zac" is a mailto link',
  actionsBlock.includes('href="mailto:zachary@zcohen-nerd.com"') && actionsBlock.includes('Email Zac'));
check('hero actions expose no phone number', !/(\(\d{3}\)|\b\d{3}[.-]\d{3}[.-]\d{4})/.test(actionsBlock));
check('hero actions expose no street address', !/\b\d{1,5}\s+[A-Z][a-z]+\s+(St|Street|Ave|Avenue|Rd|Road|Ln|Lane|Dr|Drive|Blvd|Ct|Court)\b/.test(actionsBlock));

// One H1 + no duplicate ids — homepage.
const homeH1 = (indexHtml.match(/<h1[\s>]/g) || []).length;
check('homepage has exactly one H1', homeH1 === 1, `found ${homeH1}`);
const homeIdList = [...indexHtml.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
check('homepage has no duplicate ids', homeIdList.length === new Set(homeIdList).size,
  homeIdList.filter((v, i, a) => a.indexOf(v) !== i).join(', '));

// Featured Systems order + status integrity (scoped to the section).
const featBlock = featuredIdx !== -1 ? indexHtml.slice(featuredIdx) : '';
const featOrder = ['surfer-fleet', 'sentry-v3', 'fusion-system-blocks', 'stlink-v3mods'].map((s) => featBlock.indexOf(`/projects/${s}/`));
check('Featured Systems order is SURFER, SENTRY, FSB, SPARK',
  featOrder.every((n, i) => n !== -1 && (i === 0 || n > featOrder[i - 1])), featOrder.join(', '));
check('Featured Systems statuses are truthful',
  /SURFER Autonomous Vessel Fleet[\s\S]{0,120}?Deployed/.test(featBlock) &&
  /SENTRY V3[\s\S]{0,120}?Deployed/.test(featBlock) &&
  /Fusion System Blocks[\s\S]{0,160}?Public Beta/.test(featBlock) &&
  /SPARK Programming Board[\s\S]{0,120}?Prototype/.test(featBlock));

// One-click reachability: every flagship case study is a direct link from the homepage.
for (const slug of ['surfer-fleet', 'sentry-v3', 'fusion-system-blocks', 'stlink-v3mods']) {
  check(`homepage links flagship case study /${slug}/`, featBlock.includes(`href="/projects/${slug}/"`));
}

// ── /projects/ orientation + taxonomy separation ───────────────────────
const projHtml = fs.readFileSync(path.join(build, 'projects', 'index.html'), 'utf8');
const projVisible = projHtml.replace(/<script[\s\S]*?<\/script>/g, '');
const startIdx = projHtml.indexOf('Start with these systems');
const flagshipIdx = projHtml.indexOf('Flagship Systems');
const roadmapIdx = projHtml.indexOf('Roadmaps &');
const additionalIdx = projHtml.indexOf('Additional Engineering Work');
check('projects index has a "Start with these systems" orientation', startIdx !== -1);
check('orientation sits above the taxonomy', startIdx !== -1 && flagshipIdx > startIdx);
const orient = startIdx !== -1 && flagshipIdx > startIdx ? projHtml.slice(startIdx, flagshipIdx) : '';
check('orientation hardware path is SURFER -> SENTRY -> SPARK in order',
  ['surfer-fleet', 'sentry-v3', 'stlink-v3mods'].map((s) => orient.indexOf(`/projects/${s}/`)).every((n, i, a) => n !== -1 && (i === 0 || n > a[i - 1])));
check('orientation software path is Fusion System Blocks', orient.includes('/projects/fusion-system-blocks/'));

// Sections stay visibly distinct and ordered.
check('projects index keeps Flagship / Roadmaps & Concepts / Additional Work, in order',
  flagshipIdx !== -1 && roadmapIdx > flagshipIdx && additionalIdx > roadmapIdx,
  `${flagshipIdx}/${roadmapIdx}/${additionalIdx}`);
check('Roadmaps & Concepts intro states these are not deployed', projVisible.includes('not deployed systems'));

// Flagship grid still leads with SURFER.
const gridIdx = projHtml.indexOf('project-grid');
const gridOrder = ['surfer-fleet', 'sentry-v3', 'fusion-system-blocks', 'stlink-v3mods'].map((s) => projHtml.indexOf(`/projects/${s}/`, gridIdx));
check('Flagship grid lists SURFER first',
  gridOrder[0] !== -1 && gridOrder.slice(1).every((n) => n === -1 || n > gridOrder[0]), gridOrder.join(', '));

// Concept card must not read as deployed work.
const v4Idx = projHtml.indexOf('SENTRY V4 Roadmap');
const v4CardStart = v4Idx !== -1 ? projHtml.lastIndexOf('<div class="project-card', v4Idx) : -1;
const v4CardEnd = v4Idx !== -1 ? projHtml.indexOf('</div>', projHtml.indexOf('View roadmap', v4Idx)) : -1;
const v4Card = v4CardStart !== -1 && v4CardEnd > v4CardStart ? projHtml.slice(v4CardStart, v4CardEnd) : '';
check('SENTRY V4 uses the concept-card treatment', v4Card.includes('concept-card'));
check('SENTRY V4 card carries a Concept status', v4Card.includes('Concept'));
check('SENTRY V4 card is never labelled Deployed', v4Card !== '' && !/\bDeployed\b/.test(v4Card));

// Semantic category labels present; page is not a filter application.
check('semantic category labels present on projects index', (projHtml.match(/class="project-tag"/g) || []).length >= 5);
check('projects index is not a filter UI',
  !/data-filter|aria-controls="[^"]*filter/i.test(projHtml) && !/<(select|input)\b[^>]*\bfilter/i.test(projHtml));

// One H1 + no duplicate ids — projects index.
const projH1 = (projHtml.match(/<h1[\s>]/g) || []).length;
check('projects index has exactly one H1', projH1 === 1, `found ${projH1}`);
const projIdList = [...projHtml.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
check('projects index has no duplicate ids', projIdList.length === new Set(projIdList).size,
  projIdList.filter((v, i, a) => a.indexOf(v) !== i).join(', '));

// ── Status vocabulary: no drift across visible surfaces ─────────────────
// Approved visible status LABELS (checked only where a status label actually
// renders — status-badge / project-status — never against prose, so
// "live-water test" etc. can't trip it). "Published" covers the Connector
// Guide (owner-confirmed additional state, shown as "Published (v1.0)");
// "Published occasionally" is the essays page's cadence, a different axis.
const APPROVED_STATUS = ['Deployed', 'Prototype', 'Public Beta', 'Concept', 'Published', 'Published occasionally'];
const statusApproved = (tok) => APPROVED_STATUS.some((s) => tok === s || tok.startsWith(s + ' '));
const CANONICAL_PAGE_STATUS = {
  'surfer-fleet': 'Deployed',
  'sentry-v3': 'Deployed',
  'stlink-v3mods': 'Prototype',
  'fusion-system-blocks': 'Public Beta',
  'sentry-v4': 'Concept',
};
const stripScripts = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '');
// Collect every rendered status-label token on a page (badge pills + the
// projects-index "<p class=project-status><strong>…</strong>" pattern).
const statusTokensIn = (html) => [
  ...stripScripts(html).matchAll(/class="[^"]*(?:status-badge|project-status)[^"]*"[^>]*>\s*(?:<strong>)?([^<]+)/g),
].map((m) => m[1].trim()).filter(Boolean);

for (const [slug, status] of Object.entries(CANONICAL_PAGE_STATUS)) {
  const pgHtml = fs.readFileSync(path.join(build, 'projects', slug, 'index.html'), 'utf8');
  const toks = statusTokensIn(pgHtml);
  check(`${slug} page surfaces its canonical status "${status}"`,
    toks.some((t) => t === status || t.startsWith(status)), `tokens: ${toks.join(' | ') || 'none'}`);
  for (const t of toks) {
    check(`${slug} page status label "${t}" is approved vocabulary`, statusApproved(t));
  }
}
// Every rendered status label on /projects/ is approved vocabulary.
for (const tok of statusTokensIn(projHtml)) {
  check(`projects index status label "${tok}" is approved vocabulary`, statusApproved(tok));
}
// The project cards on /projects/ agree with each project's canonical status.
// Anchor after the "Flagship Systems" heading so the orientation-section links
// at the top of the page are not mistaken for a card.
const gridAnchor = projHtml.indexOf('Flagship Systems');
for (const [slug, status] of Object.entries(CANONICAL_PAGE_STATUS)) {
  const at = projHtml.indexOf(`/projects/${slug}/`, gridAnchor);
  const cardStart = at === -1 ? -1 : projHtml.lastIndexOf('class="project-card', at);
  const psAt = cardStart === -1 ? -1 : projHtml.indexOf('class="project-status"', cardStart);
  const card = psAt === -1 ? '' : projHtml.slice(psAt, psAt + 300);
  check(`projects index card for ${slug} shows "${status}" (no drift)`,
    card.includes(`<strong>${status}</strong>`), card.replace(/<[^>]+>/g, ' ').trim().slice(0, 90));
}

// ── Related work: every major page offers a contextual next path ─────────
const RELATED_EXTERNAL_HOSTS = [
  'github.com', 'zcohen-nerd.github.io', 'www.autodesk.com',
  'zcohennerd.substack.com', 'doi.org', 'www.linkedin.com', 'www.st.com',
];
const MAJOR_PAGES = [
  'projects/surfer-fleet', 'projects/sentry-v3', 'projects/stlink-v3mods',
  'projects/fusion-system-blocks', 'projects/sentry-v4',
  'teaching', 'documentation/scholarship', 'documentation/selected-essays',
];
for (const route of MAJOR_PAGES) {
  const pg = fs.readFileSync(path.join(build, route, 'index.html'), 'utf8');
  const rwAt = pg.search(/(aria-label="Related work"|id="related-work"|>Related work<)/i);
  check(`${route}: has a Related work section`, rwAt !== -1);
  if (rwAt === -1) continue;
  // Bound the region to the end of the related-work list (</nav> for the
  // component, </ul> for the markdown form) so footer links aren't counted.
  const ends = [pg.indexOf('</nav>', rwAt), pg.indexOf('</ul>', rwAt)]
    .filter((i) => i !== -1);
  const rwEnd = ends.length ? Math.min(...ends) + 6 : rwAt + 1600;
  const region = pg.slice(rwAt, rwEnd);
  const links = [...region.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map((m) => ({href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim()}))
    .filter((l) => !l.href.startsWith('#') && l.text.length > 0);
  check(`${route}: Related work has 2–3 contextual links`, links.length >= 2 && links.length <= 3, `found ${links.length}`);
  for (const {href} of links) {
    if (/^https?:\/\//i.test(href)) {
      const host = href.replace(/^https?:\/\//i, '').split('/')[0];
      check(`${route}: related-work external link host allowed (${host})`, RELATED_EXTERNAL_HOSTS.includes(host), href);
    } else {
      const clean = href.replace(/#.*$/, '').replace(/\/$/, '');
      const ok = clean === '' || fs.existsSync(path.join(build, clean, 'index.html')) || fs.existsSync(path.join(build, clean));
      check(`${route}: related-work internal link resolves (${href})`, ok);
    }
  }
  // No page links to itself in Related work (that is boilerplate, not a next path).
  check(`${route}: Related work does not link back to itself`,
    !links.some((l) => l.href.replace(/\/$/, '').endsWith(`/${route.split('/').pop()}`)));
}

if (failures.length) {
  console.error(`\n${failures.length} validation failure(s).`);
  process.exit(1);
}
console.log('\nAll build validations passed.');
