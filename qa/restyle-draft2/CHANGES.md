# Delegation map: restyle to match How Machines Think draft 2

15 October 2026. Audited against `.claude/skills/design-taste-frontend`. Files changed: `index.html`, `style.css` and `app.js` (labels and grid drawing only). Data, scoring, geometry, routing and interaction code are unchanged, and `node check.cjs` passes.

## What changed

- **Type.** Body text went from 9–13px grey to 16px in full ink (18px on screens 1700px wide or more). The smallest text is now 14px, down from 8–9px. Sizes in use are 14 / 16 / 40 / 52px, plus the scaled SVG labels.
- **No tracked caps.** The quadrant names, axis titles and role names are now in sentence case. Each quadrant name is set in its role's ink (58467E for lavender, 3E5C80 for blue), with a halo in the band colour.
- **No index numbers.** The 01–05 category numbers and the zero-padded tool count ("08") are gone; the count now reads "8 tools". The 1–5 number keys still switch category, as the footer says. The 1 and 2 marks on selected tools are kept, because they link each tool to its cloud.
- **No hairlines or grids.** Removed the rules above and below the categories, the footer rule, the rules between profiles and above scores, the dotted plot grid, the plot border, the ticks and the −1 / +0.5 coordinates. The axes are now a 4px white gutter, so the map reads as four flat quadrant fields.
- **No gradient.** The `linearGradient` band is now two flat rectangles, DCD3E8 on top and E0E9F2 below.
- **Tone fields instead of lines.** The open category tab, the selected tools, the score table and the scoring dialog sit on F0EFEB.
- **Role fields.** The working modes are flat lavender and blue fields with a bold heading in the role colour, as on deck slide 42. The thin colour bars and the 2-line VT323 caps headings are gone.
- **Chrome removed.** The "LAU / AI for design · Tool atlas / 2026" micro-meta, the purple full stop in the title, the boxed `Esc` key and the grey `/` separators are gone. The dialog no longer has a 1px border or a blurred backdrop.
- **Fit at 1366×768.** A short-screen rule makes the masthead and role fields tighter, so two compared profiles still fit above the role fields. Neither size scrolls the page.
- **Ink** is now 1F1F1D throughout, including the cloud outlines and dither.

## Gate

- `lint.mjs`: 0 FAIL, 0 WARN. The five Plex/VT323 lines carry `taste-skill-ignore` because the mono signature is waived.
- `inspect.mjs --allow mono,few-pictures,still-page,no-footage`: 0 FAIL, 0 WARN.
  - `mono`: waived signature.
  - `few-pictures` and `no-footage`: this is an interactive teaching tool, not a landing page. The map is the picture.
  - `still-page`: the motion is the cloud trace and morph on selection, which is unchanged.
  - Without these allowances the only results are those three rules.

## Screenshots

`before/` and `after/` cover four states at 1366×768 and 1920×1080 (single tool, two-tool compare, scores open, scoring dialog), plus the inspector frames at 1440, 768 and 390.
