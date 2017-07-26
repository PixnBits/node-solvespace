// const HEntity = require('./HEntity');

/**
 * definition from src/sketch.h:335
 * @member Number tag
 * @member HEntity h
 * @member String type (
 *   POINT_IN_3D
 *   POINT_IN_2D
 *   POINT_N_TRANS
 *   POINT_N_ROT_TRANS
 *   POINT_N_COPY
 *   POINT_N_ROT_AA
 *   NORMAL_IN_3D
 *   NORMAL_IN_2D
 *   NORMAL_N_COPY
 *   NORMAL_N_ROT
 *   NORMAL_N_ROT_AA
 *   DISTANCE
 *   DISTANCE_N_COPY
 *   FACE_NORMAL_PT
 *   FACE_XPROD
 *   FACE_N_ROT_TRANS
 *   FACE_N_TRANS
 *   FACE_N_ROT_AA
 *   WORKPLANE
 *   LINE_SEGMENT
 *   CUBIC
 *   CUBIC_PERIODIC
 *   CIRCLE
 *   ARC_OF_CIRCLE
 *   TTF_TEXT)
 * @member hGroup group
 * @member hEntity workplane // or Entity::FREE_IN_3D
 * When it comes time to draw an entity, we look here to get the
 * defining variables.
 * @member [hEntity] point
 * @member Number extraPoints
 * @member HEntity normal
 * @member HEntity distance
 * @member [HParam] param The only types that have their own params are points,
 *   normals, and directions.
 * Transformed points/normals/distances have their numerical base
 * @member Vector numPoint
 * @member Quaternion numNormal
 * @member Number numDistance
 * @member String str (???)
 * @member String font
 * @member Number aspectRatio
 * @member Number timesApplied For entities that are derived by a transformation,
 *   the number of times to apply the transformation.
 */
function EntityBase() {
}

// definition from src/sketch.h:340
// Entity.FREE_IN_3D = ;
// definition from src/sketch.h:341
// Entity.NO_ENTITY = ;

/**
 * definition from src/sketch.h:403
 * @param Number param0
 * @returns Quaternion
 */
EntityBase.prototype.getAxisAngleQuaternion = function getAxisAngleQuaternion() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:404
 * @param Number param0
 * @returns ExprQuaternion
 */
EntityBase.prototype.getAxisAngleQuaternionExprs = function getAxisAngleQuaternionExprs() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:406
 * @returns Boolean
 */
EntityBase.prototype.isCircle = function isCircle() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:407
 * @returns Expr
 */
EntityBase.prototype.circleGetRadiusExpr = function circleGetRadiusExpr() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:408
 * @returns Number
 */
EntityBase.prototype.circleGetRadiusNum = function circleGetRadiusNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:409
 * @param Number thetaa
 * @param Number thetab
 * @param Number dtheta
 */
EntityBase.prototype.arcGetAngles = function arcGetAngles() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:411
 * @returns Boolean
 */
EntityBase.prototype.hasVector = function hasVector() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:412
 * @returns ExprVector
 */
EntityBase.prototype.vectorGetExprs = function vectorGetExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:413
 * @param hEntity wrkpl
 * @returns ExprVector
 */
EntityBase.prototype.vectorGetExprsInWorkplane = function vectorGetExprsInWorkplane() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:414
 * @returns Vector
 */
EntityBase.prototype.vectorGetNum = function vectorGetNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:415
 * @returns Vector
 */
EntityBase.prototype.vectorGetRefPoint = function vectorGetRefPoint() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:416
 * @returns Vector
 */
EntityBase.prototype.vectorGetStartPoint = function vectorGetStartPoint() {
  throw new Error('unimplemented');
};


// For distances
/**
 * definition from src/sketch.h:419
 * @returns Boolean
 */
EntityBase.prototype.isDistance = function isDistance() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:420
 * @returns Number
 */
EntityBase.prototype.distanceGetNum = function distanceGetNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:421
 * @returns Expr
 */
EntityBase.prototype.distanceGetExpr = function distanceGetExpr() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:422
 * @param Number v
 */
EntityBase.prototype.distanceForceTo = function distanceForceTo() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:424
 * @returns Boolean
 */
EntityBase.prototype.isWorkplane = function isWorkplane() {
  throw new Error('unimplemented');
};

// The plane is points P such that P dot (xn, yn, zn) - d = 0
/**
 * definition from src/sketch.h:426
 * @param ExprVector n
 * @param Expr d
 */
EntityBase.prototype.workplaneGetPlaneExprs = function workplaneGetPlaneExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:427
 * @returns ExprVector
 */
EntityBase.prototype.workplaneGetOffsetExprs = function workplaneGetOffsetExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:428
 * @returns Vector
 */
EntityBase.prototype.workplaneGetOffset = function workplaneGetOffset() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:429
 * @returns EntityBase
 */
EntityBase.prototype.normal = function normal() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:431
 * @returns Boolean
 */
EntityBase.prototype.isFace = function isFace() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:432
 * @returns ExprVector
 */
EntityBase.prototype.faceGetNormalExprs = function faceGetNormalExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:433
 * @returns Vector
 */
EntityBase.prototype.faceGetNormalNum = function faceGetNormalNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:434
 * @returns ExprVector
 */
EntityBase.prototype.faceGetPointExprs = function faceGetPointExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:435
 * @returns Vector
 */
EntityBase.prototype.faceGetPointNum = function faceGetPointNum() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:437
 * @returns Boolean
 */
EntityBase.prototype.isPoint = function isPoint() {
  throw new Error('unimplemented');
};

// Applies for any of the point types
/**
 * definition from src/sketch.h:439
 * @returns Vector
 */
EntityBase.prototype.pointGetNum = function pointGetNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:440
 * @returns ExprVector
 */
EntityBase.prototype.pointGetExprs = function pointGetExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:441
 * @param hEntity wrkpl
 * @param Expr u
 * @param Expr v
 */
EntityBase.prototype.pointGetExprsInWorkplane = function pointGetExprsInWorkplane() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:442
 * @param hEntity wrkpl
 * @returns ExprVector
 */
EntityBase.prototype.pointGetExprsInWorkplane = function pointGetExprsInWorkplane() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:443
 * @param Vector v
 */
EntityBase.prototype.pointForceTo = function pointForceTo() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:444
 * @param Vector v
 */
EntityBase.prototype.pointForceParamTo = function pointForceParamTo() {
  throw new Error('unimplemented');
};

// These apply only the POINT_N_ROT_TRANS, which has an assoc rotation
/**
 * definition from src/sketch.h:446
 * @returns Quaternion
 */
EntityBase.prototype.pointGetQuaternion = function pointGetQuaternion() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:447
 * @param Quaternion q
 */
EntityBase.prototype.pointForceQuaternionTo = function pointForceQuaternionTo() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:449
 * @returns Boolean
 */
EntityBase.prototype.isNormal = function isNormal() {
  throw new Error('unimplemented');
};

// Applies for any of the normal types
/**
 * definition from src/sketch.h:451
 * @returns Quaternion
 */
EntityBase.prototype.normalGetNum = function normalGetNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:452
 * @returns ExprQuaternion
 */
EntityBase.prototype.normalGetExprs = function normalGetExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:453
 * @param Quaternion q
 */
EntityBase.prototype.normalForceTo = function normalForceTo() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:455
 * @returns Vector
 */
EntityBase.prototype.normalU = function normalU() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:456
 * @returns Vector
 */
EntityBase.prototype.normalV = function normalV() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:457
 * @returns Vector
 */
EntityBase.prototype.normalN = function normalN() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:458
 * @returns ExprVector
 */
EntityBase.prototype.normalExprsU = function normalExprsU() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:459
 * @returns ExprVector
 */
EntityBase.prototype.normalExprsV = function normalExprsV() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:460
 * @returns ExprVector
 */
EntityBase.prototype.normalExprsN = function normalExprsN() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:462
 * @returns Vector
 */
EntityBase.prototype.cubicGetStartNum = function cubicGetStartNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:463
 * @returns Vector
 */
EntityBase.prototype.cubicGetFinishNum = function cubicGetFinishNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:464
 * @returns ExprVector
 */
EntityBase.prototype.cubicGetStartTangentExprs = function cubicGetStartTangentExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:465
 * @returns ExprVector
 */
EntityBase.prototype.cubicGetFinishTangentExprs = function cubicGetFinishTangentExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:466
 * @returns Vector
 */
EntityBase.prototype.cubicGetStartTangentNum = function cubicGetStartTangentNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:467
 * @returns Vector
 */
EntityBase.prototype.cubicGetFinishTangentNum = function cubicGetFinishTangentNum() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:469
 * @returns Boolean
 */
EntityBase.prototype.hasEndpoints = function hasEndpoints() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:470
 * @returns Vector
 */
EntityBase.prototype.endpointStart = function endpointStart() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:471
 * @returns Vector
 */
EntityBase.prototype.endpointFinish = function endpointFinish() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:473
 * @param ExprVector eap
 * @param ExprVector ebp
 */
EntityBase.prototype.ttfTextGetPointsExprs = function ttfTextGetPointsExprs() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:475
 * @param IdList<Equation,hEquation> l
 * @param Expr expr
 * @param Number index
 */
EntityBase.prototype.addEq = function addEq() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:476
 * @param IdList<Equation,hEquation> l
 */
EntityBase.prototype.generateEquations = function generateEquations() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:478
 */
EntityBase.prototype.clear = function clear() {
  throw new Error('unimplemented');
};

module.exports = EntityBase;
