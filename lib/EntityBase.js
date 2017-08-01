const Expression = require('./Expression');
const Vector = require('./Vector');
const HEntity = require('./HEntity');
const HGroup = require('./HGroup');

/**
 * definition from src/sketch.h:335
 * implementation from src/entity.cpp:
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
function EntityBase(arg0) {
  const opts = arg0 || {};

  this.tag = opts.tag || 0;
  this.h = opts.h || new HEntity();
  this.type = opts.type;
  this.param = opts.param || []; // [HParam]
  this.group = opts.group || new HGroup();

  if ('workplane' in opts) { this.workplane = opts.workplane; }
  this.point = opts.point || [];
  if ('extraPoints' in opts) { this.extraPoints = opts.extraPoints; }
  if ('normal' in opts) { this.normal = opts.normal; }
  if ('distance' in opts) { this.distance = opts.distance; }
  if ('numPoint' in opts) { this.numPoint = opts.numPoint; }
  if ('numNormal' in opts) { this.numNormal = opts.numNormal; }
  if ('numDistance' in opts) { this.numDistance = opts.numDistance; }
  if ('str' in opts) { this.str = opts.str; }
  if ('font' in opts) { this.font = opts.font; }
  if ('aspectRatio' in opts) { this.aspectRatio = opts.aspectRatio; }
  if ('timesApplied' in opts) { this.timesApplied = opts.timesApplied; }

  if (!this.type || typeof this.type !== 'string') {
    console.warn('new EntityBase created without a valid type');
    // throw new Error('EntityBase requires a type');
  }
}

// definition from src/sketch.h:340
// Entity.FREE_IN_3D = ;
// definition from src/sketch.h:341
// Entity.NO_ENTITY = ;

/**
 * definition from src/sketch.h:403
 * implementation from src/entity.cpp:
 * @param Number param0
 * @returns Quaternion
 */
EntityBase.prototype.getAxisAngleQuaternion = function getAxisAngleQuaternion() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:404
 * implementation from src/entity.cpp:
 * @param Number param0
 * @returns ExprQuaternion
 */
EntityBase.prototype.getAxisAngleQuaternionExprs = function getAxisAngleQuaternionExprs() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:406
 * implementation from src/entity.cpp:
 * @returns Boolean
 */
EntityBase.prototype.isCircle = function isCircle() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:407
 * implementation from src/entity.cpp:118
 * @returns Expr
 */
EntityBase.prototype.circleGetRadiusExpr = function circleGetRadiusExpr() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:408
 * implementation from src/entity.cpp:126
 * @returns Number
 */
EntityBase.prototype.circleGetRadiusNum = function circleGetRadiusNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:409
 * implementation from src/entity.cpp:
 * @param Number thetaa
 * @param Number thetab
 * @param Number dtheta
 */
EntityBase.prototype.arcGetAngles = function arcGetAngles() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:411
 * implementation from src/entity.cpp:
 * @returns Boolean
 */
EntityBase.prototype.hasVector = function hasVector() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:412
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.vectorGetExprs = function vectorGetExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:413
 * implementation from src/entity.cpp:
 * @param hEntity wrkpl
 * @returns ExprVector
 */
EntityBase.prototype.vectorGetExprsInWorkplane = function vectorGetExprsInWorkplane() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:414
 * implementation from src/entity.cpp:64
 * @returns Vector
 */
EntityBase.prototype.vectorGetNum = function vectorGetNum(sketch) {
  const { type, point } = this;
  switch (type) {
    case 'line-segment':
      console.log('point[0]', point[0]);
      console.log('sketch.getEntity(point[0])', sketch.getEntity(point[0]));
      return (sketch.getEntity(point[0]).pointGetNum())
        .minus(sketch.getEntity(point[1]).pointGetNum());

    case 'normal-in-3d':
    case 'normal-in-2d':
    case 'normal-n-copy':
    case 'normal-n-rot':
    case 'normal-n-rot-aa':
      return this.normalN();

    default:
      throw new Error(`Unexpected EntityBase type ${type}`);
  }
};

/**
 * definition from src/sketch.h:415
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.vectorGetRefPoint = function vectorGetRefPoint() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:416
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.vectorGetStartPoint = function vectorGetStartPoint() {
  throw new Error('unimplemented');
};


// For distances
/**
 * definition from src/sketch.h:419
 * implementation from src/entity.cpp:
 * @returns Boolean
 */
EntityBase.prototype.isDistance = function isDistance() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:420
 * implementation from src/entity.cpp:
 * @returns Number
 */
EntityBase.prototype.distanceGetNum = function distanceGetNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:421
 * implementation from src/entity.cpp:221
 * @returns Expression
 */
EntityBase.prototype.distanceGetExpr = function distanceGetExpr() {
  if (this.type === 'distance') {
    return new Expression(this.param[0]);
  } else if (this.type === 'distance-n-copy') {
    return new Expression(this.numDistance);
  }
  throw new Error(`Unexpected entity type ${this.type}`);
};

/**
 * definition from src/sketch.h:422
 * implementation from src/entity.cpp:
 * @param Number v
 */
EntityBase.prototype.distanceForceTo = function distanceForceTo() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:424
 * implementation from src/entity.cpp:
 * @returns Boolean
 */
EntityBase.prototype.isWorkplane = function isWorkplane() {
  throw new Error('unimplemented');
};

// The plane is points P such that P dot (xn, yn, zn) - d = 0
/**
 * definition from src/sketch.h:426
 * implementation from src/entity.cpp:
 * @param ExprVector n
 * @param Expr d
 */
EntityBase.prototype.workplaneGetPlaneExprs = function workplaneGetPlaneExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:427
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.workplaneGetOffsetExprs = function workplaneGetOffsetExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:428
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.workplaneGetOffset = function workplaneGetOffset() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:429
 * implementation from src/entity.cpp:
 * @returns EntityBase
 */
EntityBase.prototype.normal = function normal() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:431
 * implementation from src/entity.cpp:
 * @returns Boolean
 */
EntityBase.prototype.isFace = function isFace() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:432
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.faceGetNormalExprs = function faceGetNormalExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:433
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.faceGetNormalNum = function faceGetNormalNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:434
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.faceGetPointExprs = function faceGetPointExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:435
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.faceGetPointNum = function faceGetPointNum() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:437
 * implementation from src/entity.cpp:
 * @returns Boolean
 */
EntityBase.prototype.isPoint = function isPoint() {
  throw new Error('unimplemented');
};

// Applies for any of the point types
/**
 * definition from src/sketch.h:439
 * implementation from src/entity.cpp:469
 * @returns Vector
 */
EntityBase.prototype.pointGetNum = function pointGetNum(sketch) {
  const {
    type,
    param,
    workplane,
    numPoint,
    timesApplied
  } = this;

  switch (type) {
    case 'point-in-3d':
      return new Vector(param[0], param[1], param[2]);

    case 'point-in-2d': {
      const c = sketch.getEntity(workplane);
      const u = c.normal().normalU();
      const v = c.normal().normalV();
      return u
        .scaledBy(sketch.getParam(param[0]).val)
        .plus(v.scaledBy(sketch.getParam(param[1]).val))
        .plus(c.workplaneGetOffset());
    }

    case 'point-n-trans':
      return numPoint.plus(
        new Vector(param[0], param[1], param[2]).scaledBy(timesApplied)
      );

    case 'point-n-rot-trans': {
      throw new Error('unimplemented');
      // Vector offset = Vector::From(param[0], param[1], param[2]);
      // Quaternion q = PointGetQuaternion();
      // p = q.Rotate(numPoint);
      // p = p.Plus(offset);
      // break;
    }

    case 'point-n-rot-aa': {
      throw new Error('unimplemented');
      // Vector offset = Vector::From(param[0], param[1], param[2]);
      // Quaternion q = PointGetQuaternion();
      // p = numPoint.Minus(offset);
      // p = q.Rotate(p);
      // p = p.Plus(offset);
      // break;
    }

    case 'point-n-copy':
      return numPoint;

    default:
      throw new Error(`Unexpected entity type ${type}`);
  }
};

/**
 * definition from src/sketch.h:440
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.pointGetExprs = function pointGetExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:441
 * implementation from src/entity.cpp:
 * @param hEntity wrkpl
 * @param Expr u
 * @param Expr v
 */
EntityBase.prototype.pointGetExprsInWorkplane = function pointGetExprsInWorkplane() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:442
 * implementation from src/entity.cpp:
 * @param hEntity wrkpl
 * @returns ExprVector
 */
EntityBase.prototype.pointGetExprsInWorkplane = function pointGetExprsInWorkplane() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:443
 * implementation from src/entity.cpp:
 * @param Vector v
 */
EntityBase.prototype.pointForceTo = function pointForceTo() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:444
 * implementation from src/entity.cpp:
 * @param Vector v
 */
EntityBase.prototype.pointForceParamTo = function pointForceParamTo() {
  throw new Error('unimplemented');
};

// These apply only the POINT_N_ROT_TRANS, which has an assoc rotation
/**
 * definition from src/sketch.h:446
 * implementation from src/entity.cpp:
 * @returns Quaternion
 */
EntityBase.prototype.pointGetQuaternion = function pointGetQuaternion() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:447
 * implementation from src/entity.cpp:
 * @param Quaternion q
 */
EntityBase.prototype.pointForceQuaternionTo = function pointForceQuaternionTo() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:449
 * implementation from src/entity.cpp:
 * @returns Boolean
 */
EntityBase.prototype.isNormal = function isNormal() {
  throw new Error('unimplemented');
};

// Applies for any of the normal types
/**
 * definition from src/sketch.h:451
 * implementation from src/entity.cpp:
 * @returns Quaternion
 */
EntityBase.prototype.normalGetNum = function normalGetNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:452
 * implementation from src/entity.cpp:
 * @returns ExprQuaternion
 */
EntityBase.prototype.normalGetExprs = function normalGetExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:453
 * implementation from src/entity.cpp:
 * @param Quaternion q
 */
EntityBase.prototype.normalForceTo = function normalForceTo() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:455
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.normalU = function normalU() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:456
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.normalV = function normalV() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:457
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.normalN = function normalN() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:458
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.normalExprsU = function normalExprsU() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:459
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.normalExprsV = function normalExprsV() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:460
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.normalExprsN = function normalExprsN() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:462
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.cubicGetStartNum = function cubicGetStartNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:463
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.cubicGetFinishNum = function cubicGetFinishNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:464
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.cubicGetStartTangentExprs = function cubicGetStartTangentExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:465
 * implementation from src/entity.cpp:
 * @returns ExprVector
 */
EntityBase.prototype.cubicGetFinishTangentExprs = function cubicGetFinishTangentExprs() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:466
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.cubicGetStartTangentNum = function cubicGetStartTangentNum() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:467
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.cubicGetFinishTangentNum = function cubicGetFinishTangentNum() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:469
 * implementation from src/entity.cpp:
 * @returns Boolean
 */
EntityBase.prototype.hasEndpoints = function hasEndpoints() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:470
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.endpointStart = function endpointStart() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:471
 * implementation from src/entity.cpp:
 * @returns Vector
 */
EntityBase.prototype.endpointFinish = function endpointFinish() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:473
 * implementation from src/entity.cpp:
 * @param ExprVector eap
 * @param ExprVector ebp
 */
EntityBase.prototype.ttfTextGetPointsExprs = function ttfTextGetPointsExprs() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:475
 * implementation from src/entity.cpp:
 * @param IdList<Equation,hEquation> l
 * @param Expr expr
 * @param Number index
 */
EntityBase.prototype.addEq = function addEq() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:476
 * implementation from src/entity.cpp:
 * @param IdList<Equation,hEquation> l
 */
EntityBase.prototype.generateEquations = function generateEquations() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:478
 * implementation from src/entity.cpp:
 */
EntityBase.prototype.clear = function clear() {
  throw new Error('unimplemented');
};

module.exports = EntityBase;
