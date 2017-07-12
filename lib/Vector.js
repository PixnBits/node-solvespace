const isNumber = require('is-number');

const LENGTH_EPS = require('./utils/constants').LENGTH_EPS;

/**
 * definition from dsc.h:49
 * definition from dsc.h:51
 * implementation from util.cpp:484
 * @param Vector or Number a
 * @param Number b
 * @param Number c
 */
function Vector(x, y, z) {
  if (x instanceof Vector) {
    return Vector.copy(x);
  }

  // FIXME: hParam again? util.cpp:490

  if (!(isNumber(x) && isNumber(y) && isNumber(z))) {
    throw new Error('parameters should be numbers or a vector');
  }

  this.x = x;
  this.y = y;
  this.z = z;
}

Vector.copy = v => new Vector(v.x, v.y, v.z);

/**
 * definition from dsc.h:55
 * @param Vector n1
 * @param Number d1
 * @param Vector n2
 * @param Number d2
 * @returns Vector
 */
Vector.prototype.atIntersectionOfPlanes = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:57
 * @param Vector a0
 * @param Vector a1
 * @param Vector b0
 * @param Vector b1
 * @param Boolean skew (output?)
 * @param Number pa (output?)
 * @param Number pb (output?)
 * @returns Vector
 */
Vector.prototype.atIntersectionOfLines = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:61
 * @param Vector n
 * @param Number d
 * @param Vector p0
 * @param Vector p1
 * @param Boolean parallel (output?)
 * @returns Vector
 */
Vector.prototype.atIntersectionOfPlaneAndLine = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:64
 * @param Vector na
 * @param Number da
 * @param Vector nb
 * @param Number db
 * @param Vector nc
 * @param Number dc
 * @param Boolean parallel (output?)
 * @returns Vector
 */
Vector.prototype.atIntersectionOfPlanes = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:67
 * @param Vector pa
 * @param Vector da
 * @param Vector pb
 * @param Vector db
 * @param Number ta (output?)
 * @param Number tb (output?)
 * @returns Vector
 */
Vector.prototype.closestPointBetweenLines = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:71
 * implementation util.cpp:498
 * @param Number i
 * @returns Number
 */
Vector.prototype.element = function (i) {
  switch (i) {
    case 0: return this.x;
    case 1: return this.y;
    case 2: return this.z;
    default: throw new Error(`Unexpected vector element index "${i}"`);
  }
};

/**
 * definition from dsc.h:72
 * implementation util.cpp:507
 * @param Vector v
 * @param Number tolerance
 * @returns Boolean
 */
Vector.prototype.equals = function (v, tol = LENGTH_EPS) {
  // Quick axis-aligned tests before going further
  const dx = v.x - this.x; if(dx < -tol || dx > tol) return false;
  const dy = v.y - this.y; if(dy < -tol || dy > tol) return false;
  const dz = v.z - this.z; if(dz < -tol || dz > tol) return false;

  return this.minus(v).magSquared() < tol * tol;
};

/**
 * definition from dsc.h:73
 * implementation from util.cpp:516
 * @param Vector v
 * @returns Boolean
 */
Vector.prototype.equalsExactly = function (v) {
  return v.x === this.x && v.y === this.y && v.z === this.z;
};

/**
 * definition from dsc.h:74
 * implementation from util.cpp:522
 * @param Vector b
 * @returns Vector
 */
Vector.prototype.plus = function (b) {
  return new Vector(
    this.x + b.x,
    this.y + b.y,
    this.z + b.z
  );
};

/**
 * definition from dsc.h:75
 * implementation from util.cpp:532
 * @param Vector b
 * @returns Vector
 */
Vector.prototype.minus = function (b) {
  return new Vector(
    this.x - b.x,
    this.y - b.y,
    this.z - b.z
  );
};

/**
 * definition from dsc.h:76
 * implementation from util.cpp:542
 * @returns Vector
 */
Vector.prototype.negated = function () {
  return new Vector(
    -1 * this.x,
    -1 * this.y,
    -1 * this.z
  );
};

/**
 * definition from dsc.h:77
 * implementation from util.cpp:552
 * @param Vector b
 * @returns Vector
 */
Vector.prototype.cross = function (b) {
  return new Vector(
    -(this.z * b.y) + (this.y * b.z),
    (this.z * b.x) - (this.x * b.z),
    -(this.y * b.x) + (this.x * b.y)
  );
};

/**
 * definition from dsc.h:78
 * implementation from util.cpp:566
 * @param Vector b
 * @returns Number
 */
Vector.prototype.directionCosineWith = function (b) {
  return this.withMagnitude(1).dot(b.withMagnitude(1));
};

/**
 * definition from dsc.h:79
 * implementation from util.cpp:563
 * @param Vector b
 * @returns Number
 */
Vector.prototype.dot = function (b) {
  return 0 +
    this.x * b.x +
    this.y * b.y +
    this.z * b.z;
};

/**
 * definition from dsc.h:80
 * implementation from util.cpp:572
 * @param Boolean which
 * @returns Vector
 */
Vector.prototype.normal = function (which) {
  // Arbitrarily choose one vector that's normal to us, pivoting
  // appropriately.
  const xa = Math.abs(this.x);
  const ya = Math.abs(this.y);
  const za = Math.abs(this.z);
  let n;

  if (this.equals(new Vector(0, 0, 1))) {
    // Make DXFs exported in the XY plane work nicely...
    n = new Vector(1, 0, 0);
  } else if (xa < ya && xa < za) {
    n = new Vector(0, this.z, -this.y);
  } else if (ya < za) {
    n = new Vector(-this.z, 0, this.x);
  } else {
    n = new Vector(this.y, -this.x, 0);
  }

  if (which) {
    // the other possible answer
    n = this.cross(n);
  }

  return n.withMagnitude(1);
};

/**
 * definition from dsc.h:81
 * definition from dsc.h:82
 * rotatedAbout([orig, ] axis, theta)
 * @param Vector orig
 * @param Vector axis
 * @param Number theta
 * @returns Vector
 */
Vector.prototype.rotatedAbout = function (orig, axis, theta) {
  if (arguments.length < 3) {
    theta = axis;
    axis = orig;
    orig = undefined;
  }

  let r = this;
  if (orig) {
    r = r.minus(orig);
  }

  const c = Math.cos(theta);
  const s = Math.sin(theta);

  axis = axis.withMagnitude(1);

  r = new Vector(
    (
      (r.x)*(c + (1 - c)*(axis.x)*(axis.x)) +
      (r.y)*((1 - c)*(axis.x)*(axis.y) - s*(axis.z)) +
      (r.z)*((1 - c)*(axis.x)*(axis.z) + s*(axis.y))
    ),
    (
      (r.x)*((1 - c)*(axis.y)*(axis.x) + s*(axis.z)) +
      (r.y)*(c + (1 - c)*(axis.y)*(axis.y)) +
      (r.z)*((1 - c)*(axis.y)*(axis.z) - s*(axis.x))
    ),
    (
      (r.x)*((1 - c)*(axis.z)*(axis.x) - s*(axis.y)) +
      (r.y)*((1 - c)*(axis.z)*(axis.y) + s*(axis.x)) +
      (r.z)*(c + (1 - c)*(axis.z)*(axis.z))
    )
  );

  if (orig) {
    r = r.plus(orig);
  }

  return r;

  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:83
 * implementation from util.cpp:635
 * @param Vector u
 * @param Vector v
 * @param Vector n
 * @returns Vector
 */
Vector.prototype.dotInToCsys = function (u, v, n) {
  return new Vector(
    this.dot(u),
    this.dot(v),
    this.dot(n)
  );
};

/**
 * definition from dsc.h:84
 * @param Vector u
 * @param Vector v
 * @param Vector n
 * @returns Vector
 */
Vector.prototype.scaleOutOfCsys = function (u, v, n) {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:85
 * @param Vector p0
 * @param Vector dp
 * @returns Number
 */
Vector.prototype.distanceToLine = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:86
 * @param Vector normal
 * @param Vector origin
 * @returns Number
 */
Vector.prototype.distanceToPlane = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:87
 * @param Vector a
 * @param Vector b
 * @param Number tol
 * @returns Boolean
 */
Vector.prototype.onLineSegment = function (a, b, tol = LENGTH_EPS) {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:88
 * @param Vector p0
 * @param Vector deltaL
 * @returns Vector
 */
Vector.prototype.closestPointOnLine = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:89
 * implementation from util.cpp:707
 * @returns Number
 */
Vector.prototype.magnitude = function () {
  return Math.sqrt(
    this.x * this.x +
    this.y * this.y +
    this.z * this.z
  );
};

/**
 * definition from dsc.h:90
 * implementation from util.cpp:703
 * @returns Number
 */
Vector.prototype.magSquared = function () {
  return 0 +
    this.x * this.x +
    this.y * this.y +
    this.z * this.z;
};

/**
 * definition from dsc.h:91
 * @param Number s
 * @returns Vector
 */
Vector.prototype.withMagnitude = function (s) {
  const m = this.magnitude();
  if (m === 0) {
    // We can do a zero vector with zero magnitude, but not any other cases.
    if (Math.abs(s) > 1e-100) {
      throw new Error(`attempt to scale a zero vector by ${s}`);
    }
    return new Vector(0, 0, 0);
  } else {
    return this.scaledBy(s / m);
  }
};

/**
 * definition from dsc.h:92
 * implementation from util.cpp:711
 * @param Number s
 * @returns Vector
 */
Vector.prototype.scaledBy = function (s) {
  return new Vector(
    this.x * s,
    this.y * s,
    this.z * s
  );
};

/**
 * definition from dsc.h:93
 * @param hEntity wrkpl
 * @returns Vector
 */
Vector.prototype.projectInto = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:94
 * @param hEntity wrkpl
 * @returns Vector
 */
Vector.prototype.projectVectorInto = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:95
 * @param Vector delta
 * @returns Number
 */
Vector.prototype.divPivoting = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:96
 * @returns Vector
 */
Vector.prototype.closestOrtho = function () {
  throw new Error('unimplemented');
};


/**
 * definition from dsc.h:97
 * @param Vector maxv
 * @param Vector minv
 */
Vector.makeMaxMin = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:98
 * @param Number minV
 * @param Number maxV
 * @returns Vector
 */
Vector.prototype.clampWithin = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:99
 * implementation from util.cpp:826
 * @param Vector aMax
 * @param Vector aMin
 * @param Vector bMax
 * @param Vector bMin
 * @returns Boolean
 */
Vector.prototype.boundingBoxesDisjoint = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:101
 * implementation from util.cpp:837
 * @param Vector aMax
 * @param Vector aMin
 * @param Vector p0
 * @param Vector p1
 * @param Boolean asSegment
 * @returns Boolean
 */
Vector.prototype.boundingBoxIntersectsLine = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:103
 * @param Vector maxV
 * @param Vector minV
 * @returns Boolean
 */
Vector.prototype.outsideAndNotOn = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:104
 * @param Vector u
 * @param Vector v
 * @param Vector n
 * @param Vector origin
 * @param Number cameraTangent
 * @returns Vector
 */
Vector.prototype.inPerspective = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:106
 * @param Vector u
 * @param Vector v
 * @returns Point2D
 */
Vector.prototype.project2d = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:107
 * @returns Point2D
 */
Vector.prototype.projectXY = function () {
  throw new Error('unimplemented');
};

/**
 * definition from dsc.h:108
 * @returns Vector4
 */
Vector.prototype.project4D = function () {
  throw new Error('unimplemented');
};

module.exports = Vector;
