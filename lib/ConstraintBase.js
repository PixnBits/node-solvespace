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
 **/
function ConstraintBase() {
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
 * @param IdList<Param, hParam> param
 */
ConstraintBase.prototype.generate = function generate() {
  throw new Error('unimplemented');
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
