const expect = require('chai').expect;

const Vector = require('../lib/Vector');

describe('Vector', () => {
  describe('constructor/from', () => {
    it('accepts three numbers', () => {
      const v = new Vector(1, 3, 5);
      expect(v.x).to.equal(1);
      expect(v.y).to.equal(3);
      expect(v.z).to.equal(5);
    });
    it('accepts a vector', () => {
      const vOrig = new Vector(2, 4, 6);
      vOrig.x = 1;
      vOrig.y = 3;
      vOrig.z = 5;
      const v = new Vector(vOrig);
      expect(v.x).to.equal(1);
      expect(v.y).to.equal(3);
      expect(v.z).to.equal(5);
    });
    it('throws if not given a vector xor numbers', () => {
      expect(() => new Vector(1, 2, 'three')).to.throw();
      expect(() => new Vector(1, 2, NaN)).to.throw();
      expect(() => new Vector(1, 2)).to.throw();
      expect(() => new Vector()).to.throw();
      expect(() => new Vector({})).to.throw();
    });
  });
  it('atIntersectionOfPlanes');
  it('atIntersectionOfLines');
  it('atIntersectionOfPlaneAndLine');
  it('atIntersectionOfPlanes');
  it('closestPointBetweenLines');
  describe('element', () => {
    const v = new Vector(1, 3, 5);
    it('gets components from the index', () => {
      expect(v.element(0)).to.equal(1);
      expect(v.element(1)).to.equal(3);
      expect(v.element(2)).to.equal(5);
    });
    it('throws if index is out of bounds', () => {
      expect(() => v.element(-1)).to.throw('Unexpected vector element index "-1"');
      expect(() => v.element(4)).to.throw('Unexpected vector element index "4"');
      expect(() => v.element()).to.throw('Unexpected vector element index "undefined"');
    });
  });
  describe('equals', () => {
    it('same values are within JS mantissa', () => {
      const v1 = new Vector(1, 3, 5);
      const v2 = new Vector(1, 3, 5);
      expect(v1.equals(v2, 1e-12)).to.equal(true);
    });
    it('values in tolerance are the same', () => {
      const tol = 1e-4;
      const diff = tol / 10;
      const control = new Vector(1, 3, 5);
      const high = new Vector(1 + diff, 3 + diff, 5 + diff);
      expect(control.equals(high, tol)).to.equal(true);
      const low = new Vector(1 - diff, 3 - diff, 5 - diff);
      expect(control.equals(low, tol)).to.equal(true);
    });
    it('values out of tolerance are different', () => {
      const tol = 1e-4;
      const diff = tol * 10;
      const control = new Vector(1, 3, 5);
      const high = new Vector(1 + diff, 3 + diff, 5 + diff);
      expect(control.equals(high, tol)).to.equal(false);
      const low = new Vector(1 - diff, 3 - diff, 5 - diff);
      expect(control.equals(low, tol)).to.equal(false);
    });
  });
  describe('equalsExactly', () => {
    it('same values are the same', () => {
      const v1 = new Vector(1, 3, 5);
      const v2 = new Vector(1, 3, 5);
      expect(v1.equalsExactly(v2)).to.equal(true);
    });
  });
  describe('plus', () => {
    it('adds a vector', () => {
      const v1 = new Vector(1, 3, 5);
      const v2 = new Vector(7, 11, 13);
      const plused = v1.plus(v2);
      expect(plused.x).to.equal(1 + 7);
      expect(plused.y).to.equal(3 + 11);
      expect(plused.z).to.equal(5 + 13);
    });
    it('throws if no vector given');
  });
  describe('minus', () => {
    it('subtracts a vector', () => {
      const v1 = new Vector(1, 3, 5);
      const v2 = new Vector(7, 11, 13);
      const minused = v1.minus(v2);
      expect(minused.x).to.equal(1 - 7);
      expect(minused.y).to.equal(3 - 11);
      expect(minused.z).to.equal(5 - 13);
    });
    it('throws if no vector given');
  });
  describe('negated', () => {
    it('negates component values', () => {
      const v1 = new Vector(1, -3, 5);
      const negated = v1.negated();
      expect(negated.x).to.equal(-1);
      expect(negated.y).to.equal(3);
      expect(negated.z).to.equal(-5);
    });
  });
  describe('cross', () => {
    it('returns a vector of the cross product', () => {
      const v1 = new Vector(3, 5, 7);
      const v2 = new Vector(11, 13, 17);
      const crossed = v1.cross(v2);

      expect(crossed.x).to.equal((5 * 17) - (7 * 13));
      expect(crossed.y).to.equal((7 * 11) - (3 * 17));
      expect(crossed.z).to.equal((3 * 13) - (5 * 11));
    });
  });
  it('directionCosineWith', () => {
    expect((new Vector(1, 0, 0)).directionCosineWith(new Vector(1, 0, 0))).to.equal(1);
    expect((new Vector(0, 1, 0)).directionCosineWith(new Vector(0, 1, 0))).to.equal(1);
    expect((new Vector(0, 0, 1)).directionCosineWith(new Vector(0, 0, 1))).to.equal(1);
    expect((new Vector(5, 0, 0)).directionCosineWith(new Vector(3, 0, 0))).to.equal(1);
  });
  describe('dot', () => {
    it('returns the number of the dot product', () => {
      const v1 = new Vector(3, 5, 7);
      const v2 = new Vector(11, 13, 17);
      expect(v1.dot(v2)).to.equal(
        (3 * 11) +
        (5 * 13) +
        (7 * 17)
      );
    });
  });
  describe('normal', () => {
    it('returns a normal vector', () => {
      const xNormal = (new Vector(3, 0, 0)).normal();
      expect(xNormal.x).to.equal(0);
      expect(xNormal.y).to.equal(-1);
      expect(xNormal.z).to.equal(0);
    });
    it('gives the other possible vector', () => {
      const xNormal = (new Vector(3, 0, 0)).normal(true);
      expect(xNormal.x).to.equal(0);
      expect(xNormal.y).to.equal(0);
      expect(xNormal.z).to.equal(-1);
    });
  });
  describe('rotatedAbout', () => {
    it('rotates', () => {
      const axis = new Vector(0, 0, 2);
      const theta = Math.PI / 2;
      const rotated = new Vector(1, 0, 0).rotatedAbout(axis, theta);
      // expect(rotated.x).to.equal(0);
      expect(rotated.x).to.be.lessThan(1e-16);
      expect(rotated.y).to.equal(1);
      expect(rotated.z).to.equal(0);
    });
    it('rotates with an offset', () => {
      const orig = new Vector(2, 0, 0);
      const axis = new Vector(0, 0, 2);
      const theta = Math.PI / 2;
      const rotated = new Vector(3, 0, 0).rotatedAbout(orig, axis, theta);
      expect(rotated.x).to.equal(2);
      expect(rotated.y).to.equal(1);
      expect(rotated.z).to.equal(0);
    });
  });
  describe('dotInToCsys', () => {
    const a = new Vector(3, 5, 7);
    const u = new Vector(11, 13, 17);
    const v = new Vector(19, 23, 29);
    const n = new Vector(31, 37, 41);
    const dotted = a.dotInToCsys(u, v, n);
    expect(dotted.x).to.equal((3 * 11) + (5 * 13) + (7 * 17));
    expect(dotted.y).to.equal((3 * 19) + (5 * 23) + (7 * 29));
    expect(dotted.z).to.equal((3 * 31) + (5 * 37) + (7 * 41));
  });
  it('scaleOutOfCsys');
  it('dotInToCsys');
  it('distanceToPlane');
  it('onLineSegment');
  it('closestPointOnLine');
  describe('magnitude', () => {
    it('returns the number of the magnitude', () => {
      expect(new Vector(3, 5, 7).magnitude()).to.equal(
        Math.sqrt(Math.pow(3, 2) + Math.pow(5, 2) + Math.pow(7, 2))
      );
    });
  });
  describe('magSquared', () => {
    it('returns the number of the square magnitude', () => {
      expect(new Vector(3, 5, 7).magSquared()).to.equal(
        Math.pow(3, 2) + Math.pow(5, 2) + Math.pow(7, 2)
      );
    });
  });
  describe('withMagnitude', () => {
    it('returns a new vector of specified magnitude', () => {
      const v1 = new Vector(3, 5, 7);
      const wMagd = v1.withMagnitude(83);
      expect(wMagd).to.not.equal(v1);
      expect(83).to.equal(
        Math.sqrt(
          Math.pow(wMagd.x, 2) +
          Math.pow(wMagd.y, 2) +
          Math.pow(wMagd.z, 2)
        )
      );
    });
    it('returns a zero vector if original is zero and scale is 0-ish', () => {
      const v1 = new Vector(0, 0, 0);
      const wMagd = v1.withMagnitude(0);
      expect(wMagd.x).to.equal(0);
      expect(wMagd.y).to.equal(0);
      expect(wMagd.z).to.equal(0);
    });
    it('throws when trying to scale a zero vector by more than 0-ish', () => {
      const v1 = new Vector(0, 0, 0);
      expect(() => v1.withMagnitude(1e-10)).to.throw('attempt to scale a zero vector by 1e-10');
    });
  });
  describe('scaledBy', () => {
    it('gets a new vector of different magnitude', () => {
      const v1 = new Vector(3, 5, 7);
      const scaled = v1.scaledBy(4);
      expect(scaled).to.not.equal(v1);
      expect(scaled.x).to.equal(3 * 4);
      expect(scaled.y).to.equal(5 * 4);
      expect(scaled.z).to.equal(7 * 4);
    });
  });
  it('projectInto');
  it('projectVectorInto');
  it('divPivoting');
  it('closestOrtho');
  it('clampWithin');
  it('boundingBoxesDisjoint');
  it('boundingBoxIntersectsLine');
  it('outsideAndNotOn');
  it('inPerspective');
  it('project2d');
  it('projectXY');
  it('project4D');
});
