# License

This repository is released under a split license. Different parts carry
different terms — do not assume one blanket license covers everything.

| Part | License | File |
|---|---|---|
| Source code and build configuration | MIT | [`LICENSE-CODE`](./LICENSE-CODE) |
| Original written portfolio prose | CC BY-NC 4.0 | [`LICENSE-CONTENT.md`](./LICENSE-CONTENT.md) |
| zcohen-nerd name, wordmark, logos, monograms, favicons, trade dress | All rights reserved | [`TRADEMARKS.md`](./TRADEMARKS.md) |
| Photographs, headshot, résumé / CV, personal documents | All rights reserved | [`NOTICE.md`](./NOTICE.md) |
| Project imagery (schematics, PCB, CAD renders, diagrams) | Governed by each project's own repository / license | [`NOTICE.md`](./NOTICE.md) |
| Institutional / employer / third-party material (U.S. Naval Academy, FIRST, …) | Not licensed here; referenced for accuracy only | [`NOTICE.md`](./NOTICE.md) |
| Anything marked "rights status requires owner confirmation" | Excluded from this repo's licenses | [`NOTICE.md`](./NOTICE.md) |

## Summary

- You may reuse the **code** freely, including commercially, under MIT.
- You may reuse the **written prose** with attribution, non-commercially, under
  CC BY-NC 4.0.
- You may **not** reuse the brand identifiers, the photography, the résumé, the
  project imagery (without checking that project's own repository), or anything
  third-party / institutional listed in `NOTICE.md`.

## Why this replaces the old blanket license

Earlier versions licensed "all content in this repository … including text,
images, documentation, and educational materials" under CC BY-NC 4.0. That was
overbroad: it purported to relicense project imagery that belongs under other
open-source licenses, institutional material that is not the author's to
relicense, and personal documents that are not licensed for reuse at all.
[`NOTICE.md`](./NOTICE.md) now inventories every publicly shipped non-code
artifact with its actual rights status.

## `package.json`

`"license"` is set to `"SEE LICENSE IN LICENSE.md"` — npm's single SPDX field
cannot express the split above.
