const Vector = require('./Vector');

/**
 * definition from dsc.h:563
 * definition from dsc.h:568
 * @param Vector p0
 * @param Vector p1
 */
function BBox(p0, p1) {
  this.minp = new Vector(
    Math.min(p0.x, p1.x),
    Math.min(p0.y, p1.y),
    Math.min(p0.z, p1.z)
  );

  this.maxp = new Vector(
    Math.max(p0.x, p1.x),
    Math.max(p0.y, p1.y),
    Math.max(p0.z, p1.z)
  );
}

/**
 * definition from dsc.h:570
 * implementation from util.cpp:1161
 * @return Vector
 */
BBox.prototype.getOrigin = function getOrigin() {
  return this.minp.plus(this.maxp.minus(this.minp).scaledBy(0.5));
};

/**
 * definition from dsc.h:571
 * implementation from util.cpp:1162
 * @return Vector
 */
BBox.prototype.getExtents = function getExtents() {
  return this.maxp.minus(this.minp).scaledBy(0.5);
};

/**
 * definition from dsc.h:573
 * implementation from util.cpp:1164
 * @param Vector v
 * @param Number r @default 0.0
 * @return undefined
 */
BBox.prototype.include = function include(v, r = 0) {
  // TODO: probable perf improvement if this sort of operation
  // was added as a method to Vectors (instead of creating new ones
  // every time)
  // manipulating the values of the vector externally doens't feel right?
  this.minp = new Vector(
    Math.min(this.minp.x, v.x - r),
    Math.min(this.minp.y, v.y - r),
    Math.min(this.minp.z, v.z - r)
  );

  this.maxp = new Vector(
    Math.max(this.maxp.x, v.x - r),
    Math.max(this.maxp.y, v.y - r),
    Math.max(this.maxp.z, v.z - r)
  );
};

/**
 * definition from dsc.h:574
 * implementation from util.cpp:1174
 * @param BBox b1
 * @return Boolean
 */
BBox.prototype.overlaps = function overlaps(b1) {
  const t = b1.getOrigin().minus(this.getOrigin());
  const e = b1.getExtents().plus(this.getExtents());

  return Math.abs(t.x) < e.x &&
         Math.abs(t.y) < e.y &&
         Math.abs(t.z) < e.z;
};

/**
 * definition from dsc.h:575
 * implementation from util.cpp:1181
 * @param Point2d p
 * @param Number r @default 0.0
 * @return Boolean
 */
BBox.prototype.contains = function contains(p, r = 0) {
  return p.x >= (this.minp.x - r) &&
         p.y >= (this.minp.y - r) &&
         p.x <= (this.maxp.x + r) &&
         p.y <= (this.maxp.y + r);
};

module.exports = BBox;
