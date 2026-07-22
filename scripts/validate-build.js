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

// Accessibility statics (shared brand navigation)
check('project disclosure in HTML', indexHtml.includes('id="zc-project-disclosure"'));
check('drawer trigger has aria-controls', indexHtml.includes('aria-controls="zc-mobile-drawer"'));
const discStart = indexHtml.indexOf('id="zc-project-disclosure"');
const discEnd = indexHtml.indexOf('id="zc-mobile-drawer"');
const discBody = discStart !== -1 && discEnd > discStart ? indexHtml.slice(discStart, discEnd) : '';
check('disclosure links server-rendered', (discBody.match(/href="/g) || []).length >= 3);
const ids = [...indexHtml.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
check('no duplicate ids', ids.length === new Set(ids).size);

if (failures.length) {
  console.error(`\n${failures.length} validation failure(s).`);
  process.exit(1);
}
console.log('\nAll build validations passed.');
