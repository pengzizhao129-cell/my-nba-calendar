"""Build MyGame+ presentation subsets from the bundled OFL-licensed Geist.

Optional authoring dependencies: fonttools[woff] 4.61.1, Brotli 1.1.0.
Exports consume the checked-in WOFF2 files; Python is not a runtime dependency.
"""
from pathlib import Path

from fontTools import subset
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parents[1] / "src/app/fonts/GeistSans.woff2"


def timing_zero(weight):
    # Long, upright flanks and controlled shoulders; solid, continuous strokes.
    # The counter opens at the lighter schedule weight, preserving small-size ink.
    inset = 90 if weight == 500 else 97
    p = TTGlyphPen(None)
    p.moveTo((277, 726))
    p.lineTo((341, 726))
    p.qCurveTo((560, 726), (560, 502))
    p.lineTo((560, 208))
    p.qCurveTo((560, -16), (341, -16))
    p.lineTo((277, -16))
    p.qCurveTo((58, -16), (58, 208))
    p.lineTo((58, 502))
    p.qCurveTo((58, 726), (277, 726))
    p.closePath()
    p.moveTo((277, 726 - inset))
    p.qCurveTo((58 + inset, 726 - inset), (58 + inset, 502))
    p.lineTo((58 + inset, 208))
    p.qCurveTo((58 + inset, -16 + inset), (277, -16 + inset))
    p.lineTo((341, -16 + inset))
    p.qCurveTo((560 - inset, -16 + inset), (560 - inset, 208))
    p.lineTo((560 - inset, 502))
    p.qCurveTo((560 - inset, 726 - inset), (341, 726 - inset))
    p.closePath()
    return p.glyph()


def timing_one(weight):
    # A continuous shoulder and a shorter, balanced timing-device foot.
    stem_left, stem_right, foot = (282, 374, 82) if weight == 500 else (278, 376, 88)
    p = TTGlyphPen(None)
    p.moveTo((124, 0))
    for point in [(124, foot), (stem_left, foot), (stem_left, 583),
                  (165, 517), (165, 618), (302, 710), (stem_right, 710),
                  (stem_right, foot), (504, foot), (504, 0)]:
        p.lineTo(point)
    p.closePath()
    return p.glyph()


def build(family, weight, text, x_scale, destination):
    font = instantiateVariableFont(TTFont(SOURCE), {"wght": weight}, inplace=True)
    cmap = font.getBestCmap()
    if family == "MyGame Timing":
        # Make default and OpenType tnum glyphs identical, with one shared advance.
        source_glyphs = font.getGlyphSet()
        tabular = {}
        for char in "0123456789":
            name = cmap[ord(char)]
            recording = DecomposingRecordingPen(source_glyphs)
            source_glyphs[name + ".tf"].draw(recording)
            pen = TTGlyphPen(None)
            advance, bearing = font["hmtx"][name + ".tf"]
            shift = (618 - advance) / 2
            recording.replay(TransformPen(pen, (1, 0, 0, 1, shift, 0)))
            tabular[name] = (pen.glyph(), (618, round(bearing + shift)))
        for name, (glyph, metrics) in tabular.items():
            font["glyf"][name] = glyph
            font["glyf"][name + ".tf"] = glyph
            font["hmtx"][name] = metrics
            font["hmtx"][name + ".tf"] = metrics
        for name in ["zero", "zero.tf"]:
            font["glyf"][name] = timing_zero(weight)
            font["hmtx"][name] = (618, 58)
        for name in ["one", "one.tf"]:
            font["glyf"][name] = timing_one(weight)
            font["hmtx"][name] = (618, 124)
    options = subset.Options()
    options.layout_features = ["tnum", "kern"]
    sub = subset.Subsetter(options=options)
    sub.populate(text=text)
    sub.subset(font)
    glyphs = font.getGlyphSet()
    replacements = {}
    for name in font.getGlyphOrder():
        p = TTGlyphPen(glyphs)
        glyphs[name].draw(TransformPen(p, (x_scale, 0, 0, 1, 0, 0)))
        replacements[name] = p.glyph()
    for name, glyph in replacements.items():
        font["glyf"][name] = glyph
        advance, side_bearing = font["hmtx"][name]
        font["hmtx"][name] = (round(advance * x_scale), round(side_bearing * x_scale))
    # Modified font families use their own names; retain upstream copyright/OFL.
    for name_id in (1, 2, 3, 4, 6, 16, 17):
        font["name"].removeNames(nameID=name_id)
    version = "2.8.1"
    labels = {1: family, 2: "Regular", 3: family + "-" + str(weight) + "-" + version,
              4: family + " " + str(weight), 6: family.replace(" ", "") + "-" + str(weight),
              16: family, 17: str(weight)}
    for name_id, value in labels.items():
        font["name"].setName(value, name_id, 3, 1, 0x409)
    license_text = SOURCE.with_name("OFL.txt").read_text()
    font["name"].setName(license_text.splitlines()[0], 0, 3, 1, 0x409)
    font["name"].setName(license_text, 13, 3, 1, 0x409)
    font["name"].setName("https://openfontlicense.org/", 14, 3, 1, 0x409)
    font["OS/2"].usWeightClass = weight
    font.recalcTimestamp = False
    font.flavor = "woff2"
    font.save(HERE / destination)


if __name__ == "__main__":
    for weight in (500, 550):
        build("MyGame Timing", weight, "0123456789. ", .875, f"timing-{weight}.woff2")
    build("MyGame Identity", 600, "ABCDEFGHIJKLMNOPQRSTUVWXYZ ", .93, "identity-600.woff2")
