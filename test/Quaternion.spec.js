const expect = require('chai').expect;

const Quaternion = require('../lib/Quaternion');

describe('Quaternion', () => {
  describe('constructor', () => {
    it('from scalars', () => {
      const q = new Quaternion(3, 5, 7, 11);
      expect(q.w).to.equal(3);
      expect(q.vx).to.equal(5);
      expect(q.vy).to.equal(7);
      expect(q.vz).to.equal(11);
    });
    it('from HParams');
    it('from vectors');
    it('from axis & angle');
  });
  it('IDENTITY', () => {
    expect(Quaternion.IDENTITY).to.be.instanceOf(Quaternion);
    expect(Quaternion.IDENTITY.w).to.equal(1);
    expect(Quaternion.IDENTITY.vx).to.equal(0);
    expect(Quaternion.IDENTITY.vy).to.equal(0);
    expect(Quaternion.IDENTITY.vz).to.equal(0);
  });
  it('plus', () => {
    const a = new Quaternion(3, 5, 7, 11);
    const b = new Quaternion(13, 17, 19, 23);

    const q = a.plus(b);

    expect(q).to.not.equal(a);
    expect(q).to.not.equal(b);

    expect(q.w).to.equal(3 + 13);
    expect(q.vx).to.equal(5 + 17);
    expect(q.vy).to.equal(7 + 19);
    expect(q.vz).to.equal(11 + 23);
  });
  it('minus', () => {
    const a = new Quaternion(3, 5, 7, 11);
    const b = new Quaternion(13, 17, 19, 23);

    const q = a.minus(b);

    expect(q).to.not.equal(a);
    expect(q).to.not.equal(b);

    expect(q.w).to.equal(3 - 13);
    expect(q.vx).to.equal(5 - 17);
    expect(q.vy).to.equal(7 - 19);
    expect(q.vz).to.equal(11 - 23);
  });
  it('scaledBy', () => {
    const a = new Quaternion(3, 5, 7, 11);

    const q = a.scaledBy(13);

    expect(q).to.not.equal(a);

    expect(q.w).to.equal(3 * 13);
    expect(q.vx).to.equal(5 * 13);
    expect(q.vy).to.equal(7 * 13);
    expect(q.vz).to.equal(11 * 13);
  });
  it('magnitude', () => {
    const a = new Quaternion(3, 5, 7, 11);

    expect(a.magnitude()).to.equal(
      Math.sqrt(
        Math.pow(3, 2) +
        Math.pow(5, 2) +
        Math.pow(7, 2) +
        Math.pow(11, 2)
      )
    );
  });
  it('withMagnitude', () => {
    const a = new Quaternion(3, 5, 7, 11);

    const q = a.withMagnitude(13);
    const k = 13 / Math.sqrt(
      Math.pow(3, 2) +
      Math.pow(5, 2) +
      Math.pow(7, 2) +
      Math.pow(11, 2)
    );

    expect(q).to.not.equal(a);

    expect(q.w).to.equal(3 * k);
    expect(q.vx).to.equal(5 * k);
    expect(q.vy).to.equal(7 * k);
    expect(q.vz).to.equal(11 * k);
  });
  it('rotationU', () => {
    const a = new Quaternion(3, 5, 7, 11);

    const v = a.rotationU();

    expect(v.x).to.equal(
      (Math.pow(3, 2) + Math.pow(5, 2)) - Math.pow(7, 2) - Math.pow(11, 2)
    );
    expect(v.y).to.equal((2 * 3 * 11) + (2 * 5 * 7));
    expect(v.z).to.equal((2 * 5 * 11) - (2 * 3 * 7));
  });
  it('rotationV', () => {
    const a = new Quaternion(3, 5, 7, 11);

    const v = a.rotationV();

    expect(v.x).to.equal((2 * 5 * 7) - (2 * 3 * 11));
    expect(v.y).to.equal(
      ((Math.pow(3, 2) - Math.pow(5, 2)) + Math.pow(7, 2)) - Math.pow(11, 2)
    );
    expect(v.z).to.equal((2 * 3 * 5) + (2 * 7 * 11));
  });
  it('rotationN', () => {
    const a = new Quaternion(3, 5, 7, 11);

    const v = a.rotationN();

    expect(v.x).to.equal((2 * 3 * 7) + (2 * 5 * 11));
    expect(v.y).to.equal((2 * 7 * 11) - (2 * 3 * 5));
    expect(v.z).to.equal(
      (Math.pow(3, 2) - Math.pow(5, 2) - Math.pow(7, 2)) + Math.pow(11, 2)
    );
  });
  it('rotate');
  it('toThe');
  it('inverse');
  it('times');
  it('mirror');
});
