# Dependency audit

The gate rejects every unapproved root npm advisory at every severity. npm also
reports affected parent packages; these cascades are traced to their root
advisories rather than treated as separate vulnerabilities. Registry failures,
invalid reports, inconsistent counts, and invalid exception files fail closed.

## Dependency fixes

Use compatible lockfile updates first. The October 2026 remediation refreshes
shared Docusaurus and development-tool transitive dependencies, including
shell-quote, follow-redirects, source-map-js, DOMPurify where installed, and
request-body/selector parsers. Existing Dependabot development updates are
included. No Docusaurus or React major migration is required.

KaTeX is overridden to its patched 0.18 series because the old 0.16 requirements
cannot select the fix. Validate math rendering and Markdown linting when updating
this override. Where present, the serializer and UUID overrides use the same
patched major versions already used by the other sites; builds and tests must
verify the consumers.

## Residual exceptions

Three root packages have scoped exceptions: http-cache-semantics 4.2.0 in the local CLI
update checker, tinypool 1.1.1 in trusted Docusaurus build workers, and deepmerge
4.3.1, declared but not imported by the installed SVGR optimizer. These are
risk acceptances, not patched dependencies or a clean raw npm audit. The exception
file records their exact advisories, dependency paths, exposure, upstream evidence,
and a review deadline of November 30, 2026.

An exception matches the package, every root advisory ID, every affected installed
version, and severity. Unknown advisories, changed versions, unreviewed nested
copies, and expired exceptions fail the gate. Expired stale entries also fail
until removed. Re-review the documented path if a consumer or usage changes; the
gate does not infer application reachability from package names or automatically
approve future vulnerabilities on an excepted package.

## November 10, 2026 PR review

The Playwright update moves the test runner and browser packages to 1.65.0.
Joi is refreshed within its supported 17.x range to 17.13.9. Markdownlint pins
re2js to 2.8.6, so a consumer-scoped override selects the patched 2.8.7 release.

Linkinator 6 uses the named, asynchronous `glob()` API. A Linkinator-scoped
override selects glob 14.0.2 or later in that major, which also selects patched
minimatch 11. This avoids replacing the entire link checker; verify its local
file-pattern expansion as well as the normal site checks when updating the
override. No override applies to the older minimatch 3 copies used by ESLint
and the preview server, which are outside this advisory's affected range.

The remaining new advisory, deepmerge GHSA-gcqx-w48m-w2h4, has no patched
release. Its only installed consumer is `@svgr/plugin-svgo@8.1.0`; that
consumer's distributed implementation does not import it. The exact 4.3.1
exception is limited to this build dependency and expires November 30 with
the existing exceptions. It does not authorize merging untrusted objects or
additional consumers. Source: <https://github.com/advisories/GHSA-gcqx-w48m-w2h4>.

## Run locally

Use Node 22 and npm 10, as in CI:

```sh
npm ci --no-audit --no-fund
node --test scripts/test-audit-ci.mjs
node scripts/audit-ci.mjs
npm run build
```

Also run the repository's normal verification checks. The gate accepts npm exit
code 1 only when accompanied by a complete, valid vulnerability report; it then
applies the exception rules itself. Its tests use isolated fixtures and a fake
npm command, and never contact the registry.

CI runs for dependency/audit pull requests and relevant pushes to main, with a
weekly check at 13:23 UTC on Monday. That is after Dependabot's configured 06:00
America/New_York update window in both daylight and standard time. The schedule
does not assume that a proposed Dependabot update has been merged.
