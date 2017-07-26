// const RgbaColor = require('./RgbaColor');
// const hStyle = require('./hStyle');

/**
 * definition from src/sketch.h:745
 * @member Number tag
 * @member hStyle h
 * @member String name
 * @member Number width
 * @member String widthAs (PIXELS, MM)
 * @member Number textHeight
 * @member String textHeightAs (PIXELS, MM)
 * @member String textOrigin (NONE, LEFT, RIGHT, BOT, TOP)
 * @member Number textAngle
 * @member RgbaColor color
 * @member Boolean filled
 * @member RgbaColor fillColor
 * @member Boolean visible
 * @member Boolean exportable
 * @member StipplePattern stippleType
 * @member Number stippleScale
 * @member Number zIndex
 */
function Style() {
}

/*
 * The default styles, for entities that don't have a style assigned yet,
 * and for datums and such.
 * definition from src/sketch.h:805
 * values from src/style.cpp:10
 * @member Object Defaults[]
 * @member hStyle Defaults[].h
 * @member String Defaults[].cnfPrefix
 * @member RgbaColor Defaults[].color
 * @member Number Defaults[].width
 * @member Number Defaults[].zIndex
 */
Style.Defaults = [
  // {
  //   h: HStyle.ACTIVE_GRP,
  //   cnfPrefix: 'ActiveGrp',
  //   color: new RgbaColor(1, 1, 1),
  //   width: 1.5,
  //   zIndex: 4
  // },
  // { { ACTIVE_GRP },   "ActiveGrp",    RGBf(1.0, 1.0, 1.0), 1.5, 4 },
  // { { CONSTRUCTION }, "Construction", RGBf(0.1, 0.7, 0.1), 1.5, 0 },
  // { { INACTIVE_GRP }, "InactiveGrp",  RGBf(0.5, 0.3, 0.0), 1.5, 3 },
  // { { DATUM },        "Datum",        RGBf(0.0, 0.8, 0.0), 1.5, 0 },
  // { { SOLID_EDGE },   "SolidEdge",    RGBf(0.8, 0.8, 0.8), 1.0, 2 },
  // { { CONSTRAINT },   "Constraint",   RGBf(1.0, 0.1, 1.0), 1.0, 0 },
  // { { SELECTED },     "Selected",     RGBf(1.0, 0.0, 0.0), 1.5, 0 },
  // { { HOVERED },      "Hovered",      RGBf(1.0, 1.0, 0.0), 1.5, 0 },
  // { { CONTOUR_FILL }, "ContourFill",  RGBf(0.0, 0.1, 0.1), 1.0, 0 },
  // { { NORMALS },      "Normals",      RGBf(0.0, 0.4, 0.4), 1.0, 0 },
  // { { ANALYZE },      "Analyze",      RGBf(0.0, 1.0, 1.0), 1.0, 0 },
  // { { DRAW_ERROR },   "DrawError",    RGBf(1.0, 0.0, 0.0), 8.0, 0 },
  // { { DIM_SOLID },    "DimSolid",     RGBf(0.1, 0.1, 0.1), 1.0, 0 },
  // { { HIDDEN_EDGE },  "HiddenEdge",   RGBf(0.8, 0.8, 0.8), 1.0, 1 },
  // { { OUTLINE },      "Outline",      RGBf(0.8, 0.8, 0.8), 3.0, 5 },
  // { { 0 },            NULL,           RGBf(0.0, 0.0, 0.0), 0.0, 0 }
];

/**
 * definition from src/sketch.h:814
 * implementation from src/style.cpp:29
 * @param String prefix
 * @returns String
 */
Style.cnfColor = function cnfColor(prefix) {
  return `Style_${prefix}_Color`;
};

/**
 * definition from src/sketch.h:815
 * implementation from src/style.cpp:
 * @param String prefix
 * @returns String
 */
Style.cnfWidth = function cnfWidth() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:816
 * implementation from src/style.cpp:
 * @param String prefix
 * @returns String
 */
Style.cnfTextHeight = function cnfTextHeight() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:817
 * implementation from src/style.cpp:
 * @param String prefix
 * @returns String
 */
Style.cnfPrefixToName = function cnfPrefixToName() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:819
 * implementation from src/style.cpp:
 */
Style.createAllDefaultStyles = function createAllDefaultStyles() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:820
 * implementation from src/style.cpp:
 * @param hStyle h
 */
Style.createDefaultStyle = function createDefaultStyle() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:821
 * implementation from src/style.cpp:
 * @param Style s
 * @param Default d = NULL
 * @param Boolean factory = false
 */
Style.fillDefaultStyle = function fillDefaultStyle() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:822
 * implementation from src/style.cpp:
 */
Style.freezeDefaultStyles = function freezeDefaultStyles() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:823
 * implementation from src/style.cpp:
 */
Style.loadFactoryDefaults = function loadFactoryDefaults() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:825
 * implementation from src/style.cpp:
 * @param Number v
 */
Style.assignSelectionToStyle = function assignSelectionToStyle() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:826
 * implementation from src/style.cpp:
 * @param Boolean rememberForUndo = true
 * @returns Number
 */
Style.createCustomStyle = function createCustomStyle() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:828
 * implementation from src/style.cpp:
 * @param RgbaColor rgb
 * @returns RgbaColor
 */
Style.rewriteColor = function rewriteColor() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:830
 * implementation from src/style.cpp:
 * @param hStyle hs
 * @returns Style
 */
Style.get = function get() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:831
 * implementation from src/style.cpp:
 * @param hStyle hs
 * @param Boolean forExport=false
 * @returns RgbaColor
 *
 * definition from src/sketch.h:832
 * implementation from src/style.cpp:
 * @param Number hs
 * @param Boolean forExport=false
 * @returns RgbaColor
 */
Style.color = function color() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:833
 * implementation from src/style.cpp:
 * @param hStyle hs
 * @param Boolean forExport=false
 * @returns RgbaColor
 */
Style.fillColor = function fillColor() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:834
 * implementation from src/style.cpp:
 * @param hStyle hs
 * @returns Number
 *
 * definition from src/sketch.h:835
 * implementation from src/style.cpp:
 * @param Number hs
 * @returns Number
 */
Style.width = function width() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:836
 * implementation from src/style.cpp:
 * @param Number hs
 * @returns Number
 */
Style.widthMm = function widthMm() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:837
 * implementation from src/style.cpp:
 * @param hStyle hs
 * @returns Number
 */
Style.textHeight = function textHeight() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:838
 * implementation from src/style.cpp:
 * @returns Number
 */
Style.defaultTextHeight = function defaultTextHeight() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:839
 * implementation from src/style.cpp:
 * @param hStyle hs
 * @returns Canvas::Stroke
 *
 * definition from src/sketch.h:840
 * implementation from src/style.cpp:
 * @param Number hs
 * @returns Canvas::Stroke
 */
Style.stroke = function stroke() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:841
 * implementation from src/style.cpp:
 * @param Number hs
 * @returns Boolean
 */
Style.exportable = function exportable() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:842
 * implementation from src/style.cpp:
 * @param hEntity he
 * @returns hStyle
 */
Style.forEntity = function forEntity() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:843
 * implementation from src/style.cpp:
 * @param hStyle hs
 * @returns StipplePattern
 */
Style.patternType = function patternType() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:844
 * implementation from src/style.cpp:
 * @param hStyle hs
 * @returns Number
 */
Style.stippleScaleMm = function stippleScaleMm() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch:846
 * implementation from src/sketch:
 * @returns String
 */
Style.prototype.descriptionString = function descriptionString() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch:848
 * implementation from src/sketch:
 */
Style.prototype.clear = function clear() {
  throw new Error('unimplemented');
};

module.exports = Style;
