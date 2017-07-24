const expect = require('chai').expect;

const ExpressionVector = require('../lib/ExpressionVector');

const Expression = require('../lib/Expression');
const Vector = require('../lib/Vector');

describe('ExpressionVector', () => {
  describe('constructor', () => {
    it('copies from another ExpressionVector', () => {
      const evOrig = new ExpressionVector(1, 3, 7);
      const ev = new ExpressionVector(evOrig);
      expect(ev).to.not.equal(evOrig);
      expect(ev.x).to.deep.equal(new Expression(1));
      expect(ev.y).to.deep.equal(new Expression(3));
      expect(ev.z).to.deep.equal(new Expression(7));
    });
    it('accepts Expressions', () => {
      const ev = new ExpressionVector(
        new Expression(1),
        new Expression(3),
        new Expression(7)
      );
      expect(ev.x).to.deep.equal(new Expression(1));
      expect(ev.y).to.deep.equal(new Expression(3));
      expect(ev.z).to.deep.equal(new Expression(7));
    });
    it('accepts a Vector', () => {
      const v = new Vector(1, 3, 7);
      const ev = new ExpressionVector(v);
      expect(ev.x).to.deep.equal(new Expression(1));
      expect(ev.y).to.deep.equal(new Expression(3));
      expect(ev.z).to.deep.equal(new Expression(7));
    });
    it('accepts hParams');
    it('accepts numbers', () => {
      const ev = new ExpressionVector(1, 3, 7);
      expect(ev.x).to.deep.equal(new Expression(1));
      expect(ev.y).to.deep.equal(new Expression(3));
      expect(ev.z).to.deep.equal(new Expression(7));
    });
  });
  it('plus', () => {
    const ev = new ExpressionVector(11, 13, 17)
      .plus(new ExpressionVector(1, 3, 7));

    expect(ev.x).to.deep.equal(new Expression('11 + 1'));
    expect(ev.y).to.deep.equal(new Expression('13 + 3'));
    expect(ev.z).to.deep.equal(new Expression('17 + 7'));
  });
  it('minus', () => {
    const ev = new ExpressionVector(11, 13, 17)
      .minus(new ExpressionVector(1, 3, 7));

    expect(ev.x).to.deep.equal(new Expression('11 - 1'));
    expect(ev.y).to.deep.equal(new Expression('13 - 3'));
    expect(ev.z).to.deep.equal(new Expression('17 - 7'));
  });
  it('dot', () => {
    const dot = new ExpressionVector(1, 3, 7)
      .dot(new ExpressionVector(11, 13, 17));

    expect(dot).to.deep.equal(new Expression('1 * 11 + 3 * 13 + 7 * 17'));
  });
  it('cross', () => {
    const ev = new ExpressionVector(1, 3, 7)
      .cross(new ExpressionVector(11, 13, 17));

    expect(ev.x).to.deep.equal(new Expression('3 * 17 - 7 * 13'));
    expect(ev.y).to.deep.equal(new Expression('7 * 11 - 1 * 17'));
    expect(ev.z).to.deep.equal(new Expression('1 * 13 - 3 * 11'));
  });
  it('scaledBy', () => {
    const ev = new ExpressionVector(2, 3, 7)
      .scaledBy(new Expression(11));

    expect(ev.x).to.deep.equal(new Expression('2 * 11'));
    expect(ev.y).to.deep.equal(new Expression('3 * 11'));
    expect(ev.z).to.deep.equal(new Expression('7 * 11'));
  });
  it('withMagnitude', () => {
    const ev = new ExpressionVector(2, 3, 7)
      .withMagnitude(new Expression(11));

    const s = new Expression(11);
    const m = new Expression('sqrt(2*2 + 3*3 + 7*7)');
    const sOverM = s.div(m);

    expect(ev.x.eval()).to.equal(new Expression(2).times(sOverM).eval());
    expect(ev.y.eval()).to.equal(new Expression(3).times(sOverM).eval());
    expect(ev.z.eval()).to.equal(new Expression(7).times(sOverM).eval());
    expect(ev.z.eval()).to.equal(
      new Expression('7 * (11 / sqrt(2*2 + 3*3 + 7*7))')
        .eval()
    );
    expect(ev.x.eval()).to.equal(2 * (11 / Math.sqrt((2 * 2) + (3 * 3) + (7 * 7))));
    expect(ev.y.eval()).to.equal(3 * (11 / Math.sqrt((2 * 2) + (3 * 3) + (7 * 7))));
    expect(ev.z.eval()).to.equal(7 * (11 / Math.sqrt((2 * 2) + (3 * 3) + (7 * 7))));
  });
  it('eval', () => {
    const v = new ExpressionVector(
      '2 + 3',
      '5 + 7',
      '11 + 13'
    )
      .eval();

    expect(v.x).to.equal(2 + 3);
    expect(v.y).to.equal(5 + 7);
    expect(v.z).to.equal(11 + 13);
  });

  // private?
  it('magnitude', () => {
    const m = new ExpressionVector(2, 3, 7).magnitude();

    // expect(m).to.equal(new Expression('sqrt(square(2) + square(3) + square(7))'));
    // expect(m).to.deep.equal(
    //   new Expression(2).square()
    //   .plus(new Expression(3).square)
    //   .plus(new Expression(7).square)
    //   .sqrt()
    // );
    expect(m.eval()).to.equal(
      new Expression('sqrt(square(2) + square(3) + square(7))').eval()
    );
  });
});
