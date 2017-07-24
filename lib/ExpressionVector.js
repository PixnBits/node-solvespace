/**
 * definition from expr.h:103
 * implementations from expr.cpp:11
 */
const Expression = require('./Expression');
const Vector = require('./Vector');

/**
 * definition from expr.h:107
 * implementation from expr.cpp:11
 * @param Expression x
 * @param Expression y
 * @param Expression z
 *
 * definition from expr.h:108
 * implementation from expr.cpp:16
 * @param Vector vn
 *
 * definition from expr.h:109
 * implementation from expr.cpp:24
 * @param hParam x
 * @param hParam y
 * @param hParam z
 *
 * definition from expr.h:110
 * implementation from expr.cpp:32
 * @param Number x
 * @param Number y
 * @param Number z
 */
function ExpressionVector(arg0, arg1, arg2) {
  if (arg0 instanceof ExpressionVector) {
    // copy
    this.x = arg0.x;
    this.y = arg0.y;
    this.z = arg0.z;
  } else if (arg0 instanceof Vector) {
    this.x = new Expression(arg0.x);
    this.y = new Expression(arg0.y);
    this.z = new Expression(arg0.z);
  } else {
    this.x = new Expression(arg0);
    this.y = new Expression(arg1);
    this.z = new Expression(arg2);
  }
}

/**
 * definition from expr.h:112
 * implementation from expr.cpp:48
 * @param ExpressionVector b
 * @returns ExpressionVector
 */
ExpressionVector.prototype.plus = function plus(b) {
  return new ExpressionVector(
    this.x.plus(b.x),
    this.y.plus(b.y),
    this.z.plus(b.z)
  );
};

/**
 * definition from expr.h:113
 * implementation from expr.cpp:40
 * @param ExpressionVector b
 * @returns ExpressionVector
 */
ExpressionVector.prototype.minus = function minus(b) {
  return new ExpressionVector(
    this.x.minus(b.x),
    this.y.minus(b.y),
    this.z.minus(b.z)
  );
};

/**
 * definition from expr.h:114
 * implementation from expr.cpp:56
 * @param ExpressionVector b
 * @returns Expression
 */
ExpressionVector.prototype.dot = function dot(b) {
  return this
    .x.times(b.x)
    .plus(this.y.times(b.y))
    .plus(this.z.times(b.z));
};

/**
 * definition from expr.h:115
 * implementation from expr.cpp:64
 * @param ExpressionVector b
 * @returns ExpressionVector
 */
ExpressionVector.prototype.cross = function cross(b) {
  return new ExpressionVector(
    this.y.times(b.z).minus(this.z.times(b.y)),
    this.z.times(b.x).minus(this.x.times(b.z)),
    this.x.times(b.y).minus(this.y.times(b.x))
  );
};

/**
 * definition from expr.h:116
 * implementation from expr.cpp:72
 * @param Expression s
 * @returns ExpressionVector
 */
ExpressionVector.prototype.scaledBy = function scaledBy(s) {
  return new ExpressionVector(
    this.x.times(s),
    this.y.times(s),
    this.z.times(s)
  );
};

/**
 * definition from expr.h:117
 * implementation from expr.cpp:80
 * @param Expression s
 * @returns ExpressionVector
 */
ExpressionVector.prototype.withMagnitude = function withMagnitude(s) {
  return this.scaledBy(
    new Expression(s).div(this.magnitude())
  );
};

/**
 * definition from expr.h:120
 * implementation from expr.cpp:93
 * @returns Vector
 */
ExpressionVector.prototype.eval = function evaluate() {
  return new Vector(
    this.x.eval(),
    this.y.eval(),
    this.z.eval()
  );
};

// private methods?
/**
 * definition from expr.h:118
 * implementation from expr.cpp:85
 * @returns Expression
 */
ExpressionVector.prototype.magnitude = function magnitude() {
  return this
    .x.square()
    .plus(this.y.square())
    .plus(this.z.square())
    .sqrt();
};

module.exports = ExpressionVector;
