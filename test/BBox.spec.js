const expect = require('chai').expect;

const BBox = require('../lib/BBox');
const Vector = require('../lib/Vector');

describe('BBox', () => {
  it('constructor');
  describe('getOrigin', () => {
    it('get origin for positive min & max', () => {
      const bb = new BBox(
        new Vector(1, 1, 1),
        new Vector(3, 3, 3)
      );

      const origin = bb.getOrigin();

      expect(origin.x).to.equal(2);
      expect(origin.y).to.equal(2);
      expect(origin.z).to.equal(2);
    });
    it('get origin for negative min & max', () => {
      const bb = new BBox(
        new Vector(-3, -3, -3),
        new Vector(-1, -1, -1)
      );

      const origin = bb.getOrigin();

      expect(origin.x).to.equal(-2);
      expect(origin.y).to.equal(-2);
      expect(origin.z).to.equal(-2);
    });
    it('get origin for negative min & positive max', () => {
      const bb = new BBox(
        new Vector(-1, -1, -1),
        new Vector(3, 3, 3)
      );

      const origin = bb.getOrigin();

      expect(origin.x).to.equal(1);
      expect(origin.y).to.equal(1);
      expect(origin.z).to.equal(1);
    });
  });
  describe('getExtents', () => {
    it('get extents for positive min & max', () => {
      const bb = new BBox(
        new Vector(1, 1, 1),
        new Vector(3, 3, 3)
      );

      const extents = bb.getExtents();

      expect(extents.x).to.equal(1);
      expect(extents.y).to.equal(1);
      expect(extents.z).to.equal(1);
    });
    it('get extents for negative min & max', () => {
      const bb = new BBox(
        new Vector(-3, -3, -3),
        new Vector(-1, -1, -1)
      );

      const extents = bb.getExtents();

      expect(extents.x).to.equal(1);
      expect(extents.y).to.equal(1);
      expect(extents.z).to.equal(1);
    });
    it('get extents for negative min & positive max', () => {
      const bb = new BBox(
        new Vector(-1, -1, -1),
        new Vector(3, 3, 3)
      );

      const extents = bb.getExtents();

      expect(extents.x).to.equal(2);
      expect(extents.y).to.equal(2);
      expect(extents.z).to.equal(2);
    });
  });
  describe('include', () => {
    it('adds a lower point', () => {
      const bb = new BBox(
        new Vector(0, 0, 0),
        new Vector(1, 1, 1)
      );

      bb.include(new Vector(-1, -1, -1));

      expect(bb.minp.x).to.equal(-1);
      expect(bb.minp.y).to.equal(-1);
      expect(bb.minp.z).to.equal(-1);

      expect(bb.maxp.x).to.equal(1);
      expect(bb.maxp.y).to.equal(1);
      expect(bb.maxp.z).to.equal(1);
    });
    it('adds a higher point', () => {
      const bb = new BBox(
        new Vector(0, 0, 0),
        new Vector(1, 1, 1)
      );

      bb.include(new Vector(2, 2, 2));

      expect(bb.minp.x).to.equal(0);
      expect(bb.minp.y).to.equal(0);
      expect(bb.minp.z).to.equal(0);

      expect(bb.maxp.x).to.equal(2);
      expect(bb.maxp.y).to.equal(2);
      expect(bb.maxp.z).to.equal(2);
    });
    it('adds a mixed point', () => {
      const bb = new BBox(
        new Vector(0, 0, 0),
        new Vector(1, 1, 1)
      );

      bb.include(new Vector(-1, 2, 0.5));

      expect(bb.minp.x).to.equal(-1);
      expect(bb.minp.y).to.equal(0);
      expect(bb.minp.z).to.equal(0);

      expect(bb.maxp.x).to.equal(1);
      expect(bb.maxp.y).to.equal(2);
      expect(bb.maxp.z).to.equal(1);
    });
    it('adds a lower point with offset');
    it('adds a higher point with offset');
    it('adds a mixed point with offset');
  });
  describe('overlaps', () => {
    it('partially', () => {
      const bb1 = new BBox(
        new Vector(-1, -1, -1),
        new Vector(1, 1, 1)
      );
      const bb2 = new BBox(
        new Vector(0, 0, 0),
        new Vector(2, 2, 2)
      );

      expect(bb1.overlaps(bb2)).to.equal(true);
    });
    it('fully does', () => {
      const bb1 = new BBox(
        new Vector(-1, -1, -1),
        new Vector(2, 2, 2)
      );
      const bb2 = new BBox(
        new Vector(0, 0, 0),
        new Vector(1, 1, 1)
      );

      expect(bb1.overlaps(bb2)).to.equal(true);
    });
    it('fully does not', () => {
      const bb1 = new BBox(
        new Vector(-1, -1, -1),
        new Vector(1, 1, 1)
      );
      const bb2 = new BBox(
        new Vector(2, 2, 2),
        new Vector(3, 3, 3)
      );

      expect(bb1.overlaps(bb2)).to.equal(false);
    });
  });
  describe('contains', () => {
    it('knows if it contains a point', () => {
      const bb = new BBox(
        new Vector(-1, -1, -1),
        new Vector(1, 1, 1)
      );
      expect(bb.contains(new Vector(0, 0, 0))).to.equal(true);
      expect(bb.contains(new Vector(0.5, 0.5, 0.5))).to.equal(true);
      expect(bb.contains(new Vector(-0.5, -0.5, -0.5))).to.equal(true);
      expect(bb.contains(new Vector(2, 2, 2))).to.equal(false);
      expect(bb.contains(new Vector(-2, -2, -2))).to.equal(false);
    });
    it('knows if a point is contained with an extension', () => {
      const bb = new BBox(
        new Vector(-1, -1, -1),
        new Vector(1, 1, 1)
      );
      expect(bb.contains(new Vector(0, 0, 0), 1)).to.equal(true);
      expect(bb.contains(new Vector(0.5, 0.5, 0.5), 1)).to.equal(true);
      expect(bb.contains(new Vector(-0.5, -0.5, -0.5), 1)).to.equal(true);
      expect(bb.contains(new Vector(2, 2, 2), 1)).to.equal(true);
      expect(bb.contains(new Vector(-2, -2, -2), 1)).to.equal(true);
      expect(bb.contains(new Vector(3, 3, 3))).to.equal(false);
      expect(bb.contains(new Vector(-3, -3, -3))).to.equal(false);
    });
  });
});
