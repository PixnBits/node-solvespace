const isNumber = require('is-number');

function Vector(xOrVector, y, z) {
  if (isNumber(xOrVector)) {
    this.x = xOrVector;
    this.y = y;
    this.z = z;
  } else {
    this.x = xOrVector.x;
    this.y = xOrVector.y;
    this.z = xOrVector.z;
  }

  if (!isNumber(this.x) || !isNumber(this.y) || !isNumber(this.z)) {
    throw new Error('Vector needs three numbers');
  }

  return this;
}

[
  'atIntersectionOfPlanes',
  'atIntersectionOfLines',
  'atIntersectionOfPlaneAndLine',
  'atIntersectionOfPlanes',
  'closestPointBetweenLines',
  'element',
  'equals',
  'equalsExactly',
  'plus',
  'minus',
  'negated',
  'cross',
  'directionCosineWith',
  'dot',
  'normal',
  'rotatedAbout',
  'rotatedAbout',
  'dotInToCsys',
  'scaleOutOfCsys',
  'distanceToLine',
  'distanceToPlane',
  'onLineSegment',
  'closestPointOnLine',
  'magnitude',
  'magSquared',
  'withMagnitude',
  'scaledBy',
  'projectInto',
  'projectVectorInto',
  'divPivoting',
  'closestOrtho',
  'makeMaxMin',
  'clampWithin',
  'boundingBoxesDisjoint',
  'boundingBoxIntersectsLine',
  'outsideAndNotOn',
  'inPerspective',
  'project2d',
  'projectXy',
  'project4d',
]
  .forEach((n) => {
    Vector.prototype[n] = function () {
      throw new Error(`Vector.${n} unimplemented`);
    };
  });

module.exports = Vector;
