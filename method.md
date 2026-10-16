# Decide what you delegate — proposed scoring method

Status: APPROVED via final-brief.md, October 15, 2026. The following amendment supersedes conflicting draft text below.

## Approved amendment

Later October 15 update: 58 profiles across five categories, including the user's 14 Multi-Model Platforms. DeepSeek now has an estimated profile, with low-confidence inferred evidence retained in the data and details. Sora has a historical profile while remaining visibly discontinued. All profiles therefore have geometry. The diagram uses a continuous purple-to-blue background. A zero-area A→B→A boundary excursion is removed before rounding: it adds no area and must not render as a dangling line. This corrects ResearchRabbit without changing scores. `scores.json` is now the canonical editing source; `node prepare-data.cjs` regenerates geometry, roster and browser data without overwriting editorial changes from older research drafts.

The final brief permits quarter-point evidence scores, grounded in the adjacent integer anchors; editorial score changes up to ±0.5 and center shifts up to ±0.10 per coordinate are allowed after whole-category review. Store baseScores, visualScores, baseCenter, center, and adjustment reasons separately. Diagonals remain capped by their adjacent cardinal scores. Score adjustments cannot establish an unsupported capability. The map displays final visual scores without an exaggeration label. Sources and limitations remain accessible in a compact details panel.

The matrix has 42 entries. The approved roster adds Grok and Meta AI under General assistants, for 44 total. No Llama entry. The source mind map was visually cross-checked; its grouped research modes are expanded into the three matrix rows, and the matrix controls membership.

Default ratings may also use quarter points when justified. Center coordinates may be recorded directly as inferred workflow placements on the stated bipolar scale, within cardinal bounds. Record a rationale and source for each center. Geometry uses visualScores and the final center, preserving the cardinal and diagonal construction below. Four cardinal maxima remain absolute; diagonal values control joint reach from the default.

For rounded geometry, cut convex corners inward using a quadratic Bézier at 18% of adjacent edge lengths; retain concave corners unless a containment check permits smoothing. This replaces the draft's 8% constant. Dither does not change the capability boundary. The checker verifies all eight scores, quarter-point evidence increments, adjustment limits, caps, centers, derived vertices, and identical JSON/browser data. A transition between profiles is animation, not an evidence state.

User authorization to build on the approved final brief was received October 15, 2026. Present the five anchor profiles before expanding category scoring; continue within the approved build scope, incorporating any user steering.

## What the map means

This is a teaching judgment based on documented capabilities, not a benchmark of accuracy. A cloud describes a scoped product's supported operating envelope when used well; its dot describes a representative default workflow. Cloud area is not a quality score. Neither the bands nor the quadrants classify types of AI.

Keep the supplied map unchanged: x runs from generative (−1) to grounded (+1); y runs from proposes directions (−1) to executes my decisions (+1). Both axes use the same scale. The upper band is Controlled Collaborator and the lower band is Curator / Director, with the exact descriptions and quadrant names in the brief.

Grounded means preserving supplied evidence, content, structure, or constraints. Executing decisions means carrying out a human-specified design move with inspectable results. It does not mean taking many automated steps. Generating a report is not, by itself, proposing a design direction. Generative reach concerns substantive novelty, not hallucination or paraphrase.

## Scope before scores

Use every tool row in `../../day-1-research/02-tool-landscape-matrix.md` exactly once. Preserve distinct rows for a general assistant and its named research mode. Map its four sections to General assistants; Research and understanding; Design and making; Builders, agents and automation. Cross-check the mind-map image for naming and omissions; the matrix controls membership.

For every row record the product surface, available model/mode, relevant tier, task domain, and any required connector. Do not transfer capabilities from an API to an app, from a partner model to an entire platform, or from manual host-software controls to its AI feature. A connector can support a score only when its actual operations and availability are documented. For an umbrella category, identify the representative product and show that qualification beside its name.

Broadly available paid features may count, with the requirement visible. Announced, restricted-preview, or unverified rollouts do not enlarge the main cloud. Discontinued tools remain listed with status and official evidence, but null scores and no cloud. Unresolved availability or missing evidence also produces nulls, never an invented zero.

## Four cardinal scores: absolute reach, not distance from the dot

Use integer scores 0–4. Each entry needs an official source and a concrete task example. Award the highest fully supported anchor, not a fractional impression. The anchors describe capability within the stated domain, not universal reliability.

| Score | W: generative | E: grounded | N: executes my decisions | S: proposes directions |
|---|---|---|---|---|
| 0 | Retrieval, selection, or extraction only; no substantive new output | No documented supplied-input conditioning/preservation | No documented way to specify a production decision | No documented origination of substantive alternatives |
| 1 | Rephrase, summarize, or vary a narrow supplied template | Text instructions or supplied text condition output; preservation not inspectably enforced | Broad prompt intent with approximate control | Suggest nearby options or discovery candidates within a narrow task |
| 2 | Create a new artifact or substantive variants in one bounded domain | References, style, or supplied content guide output, with partial preservation | Explicit content, format, or local-edit instructions with an inspectable output | Generate multiple meaningfully different approaches to a supplied brief |
| 3 | Create and iteratively vary substantial content, form, or structure across several dimensions in the domain | Documented structural control (sketch/depth/mask/edit regions), or source-grounded output with claim-to-source citations | Addressable edits or structured operations with checkable constraints and retained context | Develop alternatives, critique trade-offs, and revise a proposed direction |
| 4 | Broad compositional invention and controllable recombination across the domain, beyond preset/template variations | Exact preservation is supported and independently verifiable for the scoped operation: e.g. verbatim extraction, deterministic transformation, or documented parametric/CAD operations | Precisely specified operations with explicit parameters and a verification mechanism (diff, schema, test, dimensions, or equivalent) | Originate and compare materially distinct strategies and develop/revise coherent plans under constraints |

Level 4 is not an accuracy guarantee. Code generation alone earns neither E4 nor N4; identify the preservation operation and verification mechanism. A citation supports traceability, not guaranteed truth. A proposed research path is a direction only within the explicitly labeled research domain, not evidence of visual design agency. Explain these domain differences in the readout.

## Default dot: a separate, evidence-backed judgment

Choose one representative ordinary workflow for the scoped product and cite why it is representative. Do not pretend to have telemetry about actual users. Label the dot “illustrative default” and mark its placement as inferred.

Rate its default behavior on two bipolar 0–4 scales:

| Rating | Default x behavior | Default y behavior |
|---|---|---|
| 0 | Primarily invents new possibilities | Primarily originates directions for human selection |
| 1 | New possibilities dominate; supplied material guides them | Proposes alternatives within a human brief |
| 2 | Balanced or genuinely mixed | Mixes proposing with carrying out specified decisions |
| 3 | Supplied material dominates; limited transformation | Mostly carries out specified decisions with local discretion |
| 4 | Preserves/extracts supplied material in the stated workflow | Carries out an explicitly specified operation |

Convert these to provisional coordinates `u=(defaultX−2)/2`, `v=(defaultY−2)/2`. The default cannot exceed the tool's supported envelope: `cx=clamp(u,−W/4,E/4)` and `cy=clamp(v,−S/4,N/4)`. Store both original ratings and final coordinates. Review every clamp and explain it in the calibration log; adjust the representative workflow if clipping would misdescribe it.

## Four diagonal scores: simultaneous operation, not separate feature lists

NE combines grounded + executes; SE grounded + proposes; SW generative + proposes; NW generative + executes. For each, cite one documented workflow in which both behaviors operate together. Separate documentation for each behavior is insufficient to establish their joint reach.

| Score | Joint-operation anchor |
|---|---|
| 0 | No documented joint workflow beyond the illustrative default; no diagonal extension is justified |
| 1 | A narrow joint workflow is documented, with coarse controls or material trade-offs |
| 2 | A substantive joint workflow has explicit controls for both behaviors, with documented limitations |
| 3 | Joint behavior supports iterative, addressable control with inspectable preservation/decision constraints |
| 4 | Both cardinal maxima are attainable together in one scoped, verifiable workflow |

These are ordinal anchors, not measured percentages. For reproducible display only, map them to fractions 0, 0.25, 0.5, 0.75, 1. A diagonal cannot exceed the lower of its two cardinal scores. This conservative cap deliberately keeps weak capabilities from producing a large corner. If a joint feature cannot be verified, use null and withhold the complete cloud pending review; absence of evidence is not a score of zero. A zero needs a source defining the relevant restricted scope and must be labeled as an inference when the limitation is not explicit.

## Reproducible geometry

The four cardinal extrema establish the same absolute bounds for every tool, avoiding the comparability problem of treating a score as a distance from different centers:

```
xmin = −W/4; xmax = E/4
ymin = −S/4; ymax = N/4
C = (cx, cy)
P_N = (cx, ymax); P_E = (xmax, cy)
P_S = (cx, ymin); P_W = (xmin, cy)
Q_NE = (xmax, ymax); Q_SE = (xmax, ymin)
Q_SW = (xmin, ymin); Q_NW = (xmin, ymax)
P_d = C + (score_d/4) * (Q_d − C)  // each diagonal d
vertices = [P_N, P_NE, P_E, P_SE, P_S, P_SW, P_W, P_NW]
```

Connect vertices in that order. This is a conservative, star-shaped visual model. Do not take a convex hull: it would erase the diagonal trade-off indentations. Store the vertices in `scores.json`; regenerate rather than hand-editing geometry.

For a smooth outline with no outward overshoot, round each nondegenerate polygon corner locally. For vertex B with neighbors A and D, set incoming point I=B+0.08(A−B) and outgoing point O=B+0.08(D−B). Replace I→B→O with a quadratic Bézier I→O controlled by B only when the triangle I,B,O lies inside the original polygon. Otherwise retain straight segments through B. Validate each proposed rounded corner against polygon edges and containment; fall back to the original polygon if invalid. Do not use unconstrained splines, outward blur, or minimum radii that imply extra reach. The raw endpoints remain available as small tick markers and in the readout.

Coincident vertices are allowed; deduplicate adjacent points for rendering. A degenerate envelope renders as a line/point, never an artificially inflated cloud. Use the same geometric transformation for every tool. SVG conversion is `screenX=left+(x+1)*size/2`, `screenY=top+(1−y)*size/2`, with equal `size` for both axes.

The filled interior interpolates between evidenced workflows; it does not claim every intermediate operation is documented. Explicitly label this interpolation as a teaching inference. The method cannot represent disconnected capability islands: show an important incompatible mode as a limitation instead of silently merging it into one broad cloud. Dither density is decorative and must not encode confidence or performance.

## Evidence and confidence

Each of the eight scores and both default ratings stores: value; capability claim; concrete workflow; official source URL(s); supporting excerpt or precise section; documented/inferred classification; confidence; and a limitation. Scores are our interpretation of evidence even when the underlying capability is documented.

- High: current official documentation directly describes the scoped capability and controls.
- Medium: an official source establishes the feature but the reach or joint operation needs a bounded inference.
- Low: incomplete, conflicting, or indirect official evidence. Mark provisional and send to calibration review; do not fill gaps from familiarity.

Product announcements and pricing can establish availability; prefer feature documentation for scoring. Check current pages, not only the October 10 matrix. If official information conflicts, record both and prefer the more specific current product documentation; do not resolve uncertainty by silently choosing the larger score.

## Approval, anchors, parallel research, review

1. User approves this method before any scoring or UI work.
2. Score five anchors: Midjourney, NotebookLM / Gemini Notebook, Elicit, Claude Code, and Claude. Show their scope, eight scores, default dot, evidence, and proposed shapes. Wait for feedback on anchor calibration before scoring the remainder.
3. Use parallel research agents, one per category, all using this approved method and anchor calibration. With the available three worker slots, run three categories together and the fourth as a second wave. No category silently changes the rubric.
4. A separate reviewer agent who did not score compares all categories, checks outliers and joint evidence, and records old value, new value, reason, and evidence for every change. Explicitly compare Elicit and Perplexity grounded reach and distinguish execution precision from automation length.
5. Finalize `scores.json`, browser-loadable `data.js`, and `calibration-log.md`; then implement the page. Display scope caveats, confidence, and teaching-judgment notice.

## Required validation

A small checker must compare tool IDs and category order against the matrix inventory, enforce exactly one occurrence, require eight integer scores and their evidence for active scored tools, enforce the diagonal caps, validate default bounds, regenerate every vertex, and compare derived coordinates within 1e−9. It must accept explicitly discontinued/null entries and reject unexplained missing data. Verify that `data.js` and `scores.json` contain the same data. Validate curves for containment and no self-intersections; degenerate shapes need explicit handling.

After implementation, inspect all four categories at 1920×1080, 1366×768, and 390px width in both single-tool and two-tool states; test faint outlines, keyboard behavior, clear, reduced motion, file:// operation, and console errors. No runtime network requests or CDN assets.
