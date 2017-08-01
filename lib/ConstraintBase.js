const HConstraint = require('./HConstraint');

/**
 * description from  src/sketch.h:577
 * @member Number tag
 * @member hConstraint h
 * @member String type (
 *   POINTS_COINCIDENT
 *   PT_PT_DISTANCE
 *   PT_PLANE_DISTANCE
 *   PT_LINE_DISTANCE
 *   PT_FACE_DISTANCE
 *   PROJ_PT_DISTANCE
 *   PT_IN_PLANE
 *   PT_ON_LINE
 *   PT_ON_FACE
 *   EQUAL_LENGTH_LINES
 *   LENGTH_RATIO
 *   EQ_LEN_PT_LINE_D
 *   EQ_PT_LN_DISTANCES
 *   EQUAL_ANGLE
 *   EQUAL_LINE_ARC_LEN
 *   LENGTH_DIFFERENCE
 *   SYMMETRIC
 *   SYMMETRIC_HORIZ
 *   SYMMETRIC_VERT
 *   SYMMETRIC_LINE
 *   AT_MIDPOINT
 *   HORIZONTAL
 *   VERTICAL
 *   DIAMETER
 *   PT_ON_CIRCLE
 *   SAME_ORIENTATION
 *   ANGLE
 *   PARALLEL
 *   PERPENDICULAR
 *   ARC_LINE_TANGENT
 *   CUBIC_LINE_TANGENT
 *   CURVE_CURVE_TANGENT
 *   EQUAL_RADIUS
 *   WHERE_DRAGGED
 *   COMMENT)
 * @member hGroup group
 * @member hEntity workplane
 *
 * These are the parameters for the constraint.
 * @member Number valA
 * @member hEntity ptA
 * @member hEntity ptB
 * @member hEntity entityA
 * @member hEntity entityB
 * @member hEntity entityC
 * @member hEntity entityD
 * @member Boolean other
 * @member Boolean other2
 *
 * @member Boolean reference a ref dimension, that generates no eqs
 * @member String comment since comments are represented as constraints
 */
function ConstraintBase(arg0) {
  const opts = arg0 || {};

  this.tag = opts.tag || 0;
  this.h = opts.h || new HConstraint();

  if ('type' in opts) { this.type = opts.type; }
  if ('group' in opts) { this.group = opts.group; }
  if ('workplane' in opts) { this.workplane = opts.workplane; }
  if ('valA' in opts) { this.valA = opts.valA; }
  if ('ptA' in opts) { this.ptA = opts.ptA; }
  if ('ptB' in opts) { this.ptB = opts.ptB; }
  if ('entityA' in opts) { this.entityA = opts.entityA; }
  if ('entityB' in opts) { this.entityB = opts.entityB; }
  if ('entityC' in opts) { this.entityC = opts.entityC; }
  if ('entityD' in opts) { this.entityD = opts.entityD; }
  if ('other' in opts) { this.other = opts.other; }
  if ('other2' in opts) { this.other2 = opts.other2; }
  if ('reference' in opts) { this.reference = opts.reference; }
  if ('comment' in opts) { this.comment = opts.comment; }
}

// definition from src/sketch.h:582
// ConstraintBase.NO_CONSTRAINT =

/**
 * definition from src/sketch.h:642
 * @returns Boolean
 */
ConstraintBase.prototype.hasLabel = function hasLabel() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:644
 * implementation from src/constrainteq.cpp:188
 * @param IdList<Param, hParam> l
 */
ConstraintBase.prototype.generate = function generate(l) {
  switch (this.type) {
    case 'parallel':
    case 'cubic-line-tangent':
      // Add new parameter only when we operate in 3d space
      if (this.workplane.v !== EntityBase.FREE_IN_3D.v) {
        break;
      }
      // fall through
    case 'same-orientation':
    case 'pt-on-line':
      l.add(new Param({ h: this.param(0) }));
    default:
      break;
  }
};


/**
 * definition from src/sketch.h:646
 * @param IdList<Equation,hEquation> entity
 * @param Boolean forReference = false
 */
ConstraintBase.prototype.generateEquations = function generateEquations() {
  throw new Error('unimplemented');
};

// Some helpers when generating symbolic constraint equations
/**
 * definition from src/sketch.h:649
 */
ConstraintBase.prototype.modifyToSatisfy = function modifyToSatisfy() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:650
 * @param IdList<Equation,hEquation> l
 * @param Expr expr
 * @param Number index
 *
 * definition from src/sketch.h:651
 * @param IdList<Equation,hEquation> l
 * @param ExprVector v
 * @param Number baseIndex = 0
 */
ConstraintBase.prototype.addEq = function addEq() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:652
 * @param hEntity wrkpl
 * @param ExprVector ae
 * @param ExprVector be
 * @returns Expr
 */
ConstraintBase.directionCosine = function directionCosine() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:653
 * @param hEntity workplane
 * @param hEntity pa
 * @param hEntity pb
 * @returns Expr
 */
ConstraintBase.distance = function distance() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:654
 * @param hEntity workplane
 * @param hEntity pt
 * @param hEntity ln
 * @returns Expr
 */
ConstraintBase.pointLineDistance = function pointLineDistance() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:655
 * @param ExprVector p
 * @param hEntity plane
 * @returns Expr
 */
ConstraintBase.pointPlaneDistance = function pointPlaneDistance() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:656
 * @param ExprVector a
 * @param ExprVector b
 * @param hParam p
 * @returns ExprVector
 */
ConstraintBase.vectorsParallel3d = function vectorsParallel3d() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:657
 * @param hEntity workplane
 * @param Expr u
 * @param Expr v
 * @returns ExprVector
 */
ConstraintBase.pointInThreeSpace = function pointInThreeSpace() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:659
 * implementation from src/sketch.cpp:
 */
ConstraintBase.prototype.clear = function clear() {
  throw new Error('unimplemented');
};

module.exports = ConstraintBase;
