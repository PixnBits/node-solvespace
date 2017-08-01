const EntityBase = require('./EntityBase');
const HEntity = require('./HEntity');
const HStyle = require('./HStyle');

/**
 * definition from src/sketch.h:481
 * @member Boolean forceHidden A linked entity that was hidden in the source file
 *   ends up hidden here too.
 * All points/normals/distances have their numerical value; this is
 * a convenience, to simplify the link/assembly code, so that the
 * part is entirely described by the entities.
 * @member Vector actPoint
 * @member Quaternion actNormal
 * @member Number actDistance
 * @member Boolean actVisible and the shown state also gets saved here, for later
 *   import
 * @member hStyle style
 * @member Boolean construction
 * @member SBezierList beziers
 * @member SEdgeList edges
 * @member Number edgesChordTol
 * @member BBox screenBBox
 * @member Boolean screenBBoxValid
 */
function Entity(arg0) {
  const opts = arg0 || {};
  // super()
  EntityBase.call(this, opts);

  // Does this handle the concern below?
  /*
  // Necessary for Entity e = {} to zero-initialize, since
  // classes with base classes are not aggregates and
  // the default constructor does not initialize members.
  //
  // Note EntityBase({}); without explicitly value-initializing
  // the base class, MSVC2013 will default-initialize it, leaving
  // POD members with indeterminate value.
  Entity() : EntityBase({}), forceHidden(), actPoint(), actNormal(),
      actDistance(), actVisible(), style(), construction(),
      beziers(), edges(), edgesChordTol(), screenBBox(), screenBBoxValid() {};
  */

  this.forceHidden = !!opts.forceHidden;
  if ('actPoint' in opts) { this.actPoint = opts.actPoint; }
  if ('actNormal' in opts) { this.actNormal = opts.actNormal; }
  if ('actDistance' in opts) { this.actDistance = opts.actDistance; }
  if ('actVisible' in opts) { this.actVisible = opts.actVisible; }
  this.style = opts.style || new HStyle();
  this.construction = !!opts.construction;
  if ('beziers' in opts) { this.beziers = opts.beziers; }
  if ('edges' in opts) { this.edges = opts.edges; }
  if ('edgesChordTol' in opts) { this.edgesChordTol = opts.edgesChordTol; }
  if ('screenBBox' in opts) { this.screenBBox = opts.screenBBox; }
  if ('screenBBoxValid' in opts) { this.screenBBoxValid = opts.screenBBoxValid; }
}

Entity.prototype = Object.create(EntityBase.prototype);
Entity.prototype.constructor = Entity;

/**
 * definition from src/sketch.h:516
 * @returns Boolean
 */
Entity.prototype.isStylable = function isStylable() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:517
 * @returns Boolean
 */
Entity.prototype.isVisible = function isVisible() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:520
 * @param String how (DEFAULT, OVERLAY, HIDDEN, HOVERED, SELECTED)
 * @param Canvas canvas
 */
Entity.prototype.draw = function draw() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:521
 * @param [Vector] refs
 */
Entity.prototype.getReferencePoints = function getReferencePoints() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:522
 * @param const Camera camera
 * @param Point2d p
 * @returns Number
 */
Entity.prototype.getPositionOfPoint = function getPositionOfPoint() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:524
 * @param SBezierList sbl
 * @param Boolean periodic
 */
Entity.prototype.computeInterpolatingSpline = function computeInterpolatingSpline() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:525
 * @param SBezierList sbl
 */
Entity.prototype.generateBezierCurves = function generateBezierCurves() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:526
 * @param SEdgeList el
 */
Entity.prototype.generateEdges = function generateEdges() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:528
 * @returns SBezierList
 */
Entity.prototype.getOrGenerateBezierCurves = function getOrGenerateBezierCurves() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:529
 * @returns SEdgeList
 */
Entity.prototype.getOrGenerateEdges = function getOrGenerateEdges() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:530
 * @param Boolean hasBBox
 * @returns BBox
 */
Entity.prototype.getOrGenerateScreenBBox = function getOrGenerateScreenBBox() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:532
 * @param Boolean forExport
 */
Entity.prototype.calculateNumerical = function calculateNumerical() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:534
 * @returns String
 */
Entity.prototype.descriptionString = function descriptionString() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:536
 * implementation from src/sketch:536
 */
Entity.prototype.clear = function clear() {
  this.beziers.l.clear();
  this.edges.l.clear();
};

// entity.cpp:10
Entity.FREE_IN_3D = new HEntity(0);
Entity.NO_ENTITY = new HEntity(0);

module.exports = Entity;
