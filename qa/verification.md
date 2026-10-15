# Build verification — October 15, 2026

Desktop delivery, following the user's final scope update. The app is implemented and the local server is ready.

## Completed

- All four categories captured in single-tool and two-tool states at 1920×1080 and 1366×768: 16 desktop screenshots. No document overflow at either size. Tool lists and expanded profile details use intentional internal scrolling.
- Reviewed the typography, axes, quadrant labels, textures, comparison outlines, and shape contrast. The final laptop composition is `final-desktop.jpg`.
- Confirmed category selection by number keys and arrow keys; tool selection by arrow keys and Enter; Tab movement into the tool list; Escape clearing selection.
- Confirmed two-tool comparison, third-tool replacement, category outlines, expanded scores and source links, and the scoring dialog. Escape closes the dialog without clearing the underlying selection.
- Confirmed explicit no-cloud states for the unresolved DeepSeek profile and discontinued Sora entry.
- Confirmed settled morph states and no warning/error console entries in the fresh test tab.
- `node --check app.js`, `node --check geometry.js`, and `node --check server.cjs` pass.
- `node check.cjs` passes for all 44 roster entries, source records, scoring bounds, editorial adjustment limits, independent coordinate fixture, polygon/curve containment, data parity, local assets, and the five-line README.
- Ran the actual Windows BAT files against the finished page. Serving, repeated start/reuse, shutdown, state cleanup, repeated shutdown, and restart passed from the project path containing spaces. Ran the normal start branch that invokes the default browser.
- Server remains bound to loopback. Shutdown authenticates against this project's private state; it does not terminate unrelated Node processes.

## Verification limits

- Direct `file://` navigation was blocked by the testing browser's protocol policy. No workaround was attempted. The offline architecture was checked statically: classic scripts with embedded local data, relative asset paths, local fonts/logos, and no runtime fetch or CDN dependency. Direct file opening still needs a manual check in the user's ordinary browser.
- Node.js was already installed, so the first-time Winget installation branch was reviewed but not executed.
- Reduced-motion handling is implemented in both animation JavaScript and CSS and was inspected in code; OS preference emulation was not available in the browser test surface.
- Supplementary 390px screenshots were captured before the desktop-only scope change. They are retained as working evidence and are not part of desktop acceptance.

## Evidence

`layout-results.json` records desktop dimensions and selection/profile counts. Screenshot filenames follow `{width}-{category}-{single|comparison}.jpg`. Research, scope qualifications, and the independent calibration review are preserved in `../research/` and `../calibration-log.md`.

## Expansion verification — October 15, 2026

This update supersedes the earlier no-cloud states and four-category count.

- 58 profiles across five categories; all have a local brand mark and a cloud. The additional 14 platform profiles have independent workflow scopes. Three shared brands intentionally appear in both Design and Multi-Model Platforms.
- The diagram now has a continuous purple-to-blue gradient. The middle axis remains visible, but no hard color boundary remains.
- ResearchRabbit's zero-area retraced edge is removed before curve rounding. Its evidence scores are unchanged. The checker includes a regression assertion that no westward dangling spur remains.
- DeepSeek now has an editorial estimate with low-confidence inferred evidence. Sora has a historical cloud and still displays its discontinued status.
- All 14 new platform profiles were selected and verified to produce nonempty SVG paths. All 14 platform icons loaded successfully.
- Five-category keyboard wraparound and the 5 shortcut passed. All five categories fit 1366×768 without document overflow. The new platform comparison was also checked at 1920×1080.
- Official website icons were downloaded where available. Scite, Gamma, NewArc, Leonardo and LTX use drawn typographic brand treatments; provenance is recorded in logos/SOURCES.md.
- The local server was restarted after adding ICO/WebP MIME support. Syntax and expanded data/geometry checks pass.

Screenshots: v2-platforms-1366.jpg, v2-platforms-1920.jpg, v2-researchrabbit-1366.jpg, v2-deepseek-1366.jpg. The earlier screenshot set remains as historical QA evidence.
