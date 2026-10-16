# MyGame+ V2.7 — Encased Pass Artifact

This is the current 1080 × 1440 promo/share composition. The App UI, Pass DNA, state engine and season archive rules remain unchanged. The reusable `PassShareCard` now presents the existing `GamePass` inside `EncasedPass`.

## Three physical materials

- **Environment:** mid-depth warm greige, matte, no texture or reflected object. Its very soft luminance falloff follows the existing top-left light source.
- **Enclosure:** high-transparency hard acrylic, with a 3px optical bevel, a separate rear plane, right/bottom sidewall, fine inner seam, corner light return and a small gap around the paper. There is no face-wide reflection layer or backdrop blur.
- **Pass:** the existing ivory paper, security printing, blind bridge emboss, punched tear line, main/stub and asymmetric cutout drawing. Its face remains unfiltered.

Material colors live exclusively in semantic tokens in `src/styles/color-material.css`; artifact geometry/styles live in `src/styles/encased-pass.css`. Existing App/pass color tokens are not reassigned.

## Fixed enclosure drawing

`src/lib/passEnclosure.ts` owns the casing drawing, independently of `PASS_DNA`:

| Part | Native units |
| --- | --- |
| Original Pass | 728 × 576 |
| Front casing | 760 × 600, outer radius 26 |
| Paper slot | x16, y12; 728 × 576 |
| Visible rear offset | +3 right, +4 bottom |
| Total physical outline | 763 × 604 |

The front casing is 4.40% wider / 4.17% taller than the Pass. Including its visible thickness, the complete physical outline is 4.81% wider / 4.86% taller, within the 3–5% size budget. Shadow is not counted as physical enclosure size.

Presentation uses **option B: front view plus visible sidewall thickness**. There is no perspective distortion. A uniform 1.18 display scale keeps the original master drawing and print sizes in proportion. The acrylic boundaries/sidewall are optically precise; the paper's separate, softer contact depth is limited to its internal air gap. The external shadow stays broad, low-opacity and close to the object.

## Team edge refraction

Two unequal paths catch team tint at the upper-left and lower-right edges. Their combined length is 29.46% of the rounded enclosure perimeter. A directional opacity gradient varies their strength; the remaining rim stays neutral. The strongest team ink is mixed at 14% before the directional gradient further reduces it. There is no luminous blur.

`EncasedPass` receives the same `TeamIdentity` as the ticket. Changing HOU to LAL changes warm-red refraction to violet-grey without changing casing geometry or recoloring paper. All teams use that same data-driven contract.

## Composition

A small inverse-ivory MyGame+ signature uses the exact approved wordmark silhouette. NBA and the city context lead into the single large artifact. Existing city-specific slogans/state text sit quietly below. Navigation, the weekly programme, Beta strip and selector UI belong to the App, and are absent from the visible artifact.

The only close-reading details are the existing PASS ID, GAME/SEASON collection stack, MG+ serial, bridge, spine, security stock and single emotion annotation. No extra authentication claims or grading fields are introduced.

Tokyo/London share the environment, casing, scale, lighting and paper construction. Only city, city-specific copy, GMT and local-time pixels differ.

## Exact ticket preservation and export

`design/promo/export-encased.cjs` renders the reusable React enclosure/frame, then places the approved promo ticket DOM into its slot. It reuses `design/promo/promo.html` as the ticket source, including its original fonts, materials and initialization. The exporter checks ticket DOM equality, identical font/color/print styles, and unchanged normalized internal coordinates against the source composition. It does not generate a new ticket graphic.

```bash
npm test
npm run build
npm run export:promo
```

Current outputs:

- `output/douyin/mygame-plus-douyin-01-tokyo.png`
- `output/douyin/mygame-plus-douyin-02-london.png`

The original `design/promo/export.cjs` remains an internal full-UI reference renderer; running it intentionally replaces these output filenames with the earlier UI composition. `npm run export:promo` is the V2.7 artifact export command.

## Validation

The artifact exporter verifies:

- both PNGs exist, decode fully, are nonempty and exactly 1080 × 1440;
- no viewport overflow, browser chrome or unintended clipping;
- all original Pass DOM, identity, timing, record fields and DNA are retained;
- shell dimensions include the physical sidewall in the 3–5% size budget;
- refraction covers only 20–35% of the perimeter (measured 29.46%);
- no acrylic backdrop blur or full-face filter;
- hiding the casing changes **zero pixels in the paper's interior**;
- HOU/LAL rim swap changes the optical edge ink while the paper remains pixel-identical;
- Tokyo/London casing/placement geometry matches exactly, with **zero static pixel differences** outside permitted city/time/copy regions.

30% thumbnails, greyscale, blur, paper-only material comparisons and a true 50% overlay are written under `/tmp/mygame-v2.7-*`. At 30%, the casing silhouette, HOU/LAL, timing and signature remain visible; collection metadata recedes. Material inspection confirms matte environment, hard clear edges, and printed ivory paper.

The unit suite includes preservation of a complete Pass across lifecycle states inside the enclosure, and an exact byte comparison of the copied brand asset. Existing lifecycle, archive and responsive App regressions remain applicable.

Validated for this revision: 33 unit tests, production build, 8 browser App regression groups, and the artifact export checks all passed. The delivered Tokyo PNG is 408,394 bytes and London is 409,938 bytes; both decode at 1080 × 1440.
