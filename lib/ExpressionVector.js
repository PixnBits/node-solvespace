const Vector = require('./Vector');
const isExpression = require('./Expression').is;

function ExpressionVector(xOrVector, y, z) {
  if (isExpression(xOrVector)) {
    this.x = xOrVector;
    this.y = y;
    this.z = z;
  } else {
    this.x = xOrVector.x;
    this.y = xOrVector.y;
    this.z = xOrVector.z;
  }

  if (!isExpression(this.x) || !isExpression(this.y) || !isExpression(this.z)) {
    throw new Error('ExpressionVector needs three Expressions');
  }

  return this;
}

ExpressionVector.prototype.minus = function minus(v) {
  return new ExpressionVector({
    x: this.x - v.x,
    y: this.y - v.y,
    z: this.z - v.z,
  });
};

ExpressionVector.prototype.plus = function plus(v) {
  return new ExpressionVector({
    x: this.x + v.x,
    y: this.y + v.y,
    z: this.z + v.z,
  });
};

ExpressionVector.prototype.dot = function dot(v) {
  return this
    .x.times(v.x)
    .plus(this.y.times(v.y))
    .plus(this.z.times(v.z));
};

ExpressionVector.prototype.cross = function cross(v) {
  const { x, y, z } = this;
  return new ExpressionVector({
    x: (y.times(v.z)).minus(z.times(v.y)),
    y: (z.times(v.x)).minus(x.times(v.z)),
    z: (x.times(v.y)).minus(y.times(v.x)),
  });
};


ExpressionVector.prototype.scaledBy = function scaledBy(s) {
  return new ExpressionVector({
    x: this.x.times(s),
    y: this.y.times(s),
    z: this.z.times(s),
  });
};

ExpressionVector.prototype.withMagnitude = function withMagnitude(s) {
  throw new Error('ExpressionVector.withMagnitude unimplemented', s);
};

ExpressionVector.prototype.magnitude = function magnitude() {
  const { x, y, z } = this;
  return x.square()
    .plus(y.square())
    .plus(z.square())
    .sqrt();
};

ExpressionVector.prototype.eval = function evaluate() {
  return new Vector({
    x: this.x.eval(),
    y: this.y.eval(),
    z: this.z.eval(),
  });
};

module.exports = ExpressionVector;
