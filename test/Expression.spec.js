const expect = require('chai').expect;

const Expression = require('../lib/Expression');

describe('Expression', () => {
  describe('constants', () => {
    it('knows pi', () => {
      const expr = new Expression('pi');
      expect(expr.eval()).to.equal(Math.PI);
    });
  });
  describe('literal', () => {
    it('parses and evaluates an integer', () => {
      const expr = new Expression('42');
      expect(expr.eval()).to.equal(42);
    });
    it('parses and evaluates a decimal', () => {
      const expr = new Expression('42.5');
      expect(expr.eval()).to.equal(42.5);
    });
  });
  describe('urnary ops', () => {
    it('negate', () => {
      const expr = new Expression('-10');
      expect(expr.eval()).to.equal(-10);
    });
  });
  describe('binary ops', () => {
    it('addition', () => {
      const expr = new Expression('1 + 2');
      expect(expr.eval()).to.equal(3);
    });
    it('subtraction', () => {
      const expr = new Expression('1 - 2');
      expect(expr.eval()).to.equal(-1);
    });
    it('multiplication', () => {
      const expr = new Expression('3 * 4');
      expect(expr.eval()).to.equal(12);
    });
    it('division', () => {
      const expr = new Expression('3 / 4');
      expect(expr.eval()).to.equal(0.75);
    });
  });
  describe('parentheses', () => {
    it('first', () => {
      const expr = new Expression('(1 + 2) * 3');
      expect(expr.eval()).to.equal(9);
    });
    it('last', () => {
      const expr = new Expression('1 + (2 * 3)');
      expect(expr.eval()).to.equal(7);
    });
  });
  describe('functions', () => {
    it('sqrt', () => {
      const expr = new Expression('sqrt(4)');
      expect(expr.eval()).to.equal(2);
    });
    it('square', () => {
      const expr = new Expression('square(3)');
      expect(expr.eval()).to.equal(9);
    });
    it('sin', () => {
      const expr180 = new Expression('sin(180)');
      expect(expr180.eval()).to.be.closeTo(0, 1e-15);
      const expr90 = new Expression('sin(90)');
      expect(expr90.eval()).to.be.closeTo(1, 1e-15);
    });
    it('cos', () => {
      const expr = new Expression('cos(180)');
      expect(expr.eval()).to.equal(-1);
    });
    it('asin', () => {
      const expr = new Expression('asin(1)');
      expect(expr.eval()).to.equal(90);
    });
    it('acos', () => {
      const expr = new Expression('acos(0)');
      expect(expr.eval()).to.equal(90);
    });
  });
  describe('precedence', () => {
    it('addition and multiplication', () => {
      const expr = new Expression('2 + 3 * 4');
      expect(expr.eval()).to.equal(14);
    });
    it('subtraction and division', () => {
      const expr = new Expression('2 - 3 / 4');
      expect(expr.eval()).to.equal(1.25);
    });
    it('negation and addition', () => {
      const expr = new Expression('-3 + 2');
      expect(expr.eval()).to.equal(-1);
    });
    it('addition and subtraction', () => {
      const expr = new Expression('2 + 3 - 4');
      expect(expr.eval()).to.equal(1);
    });
  });
  describe('variable', () => {
    it('parse', () => {
      const expr = new Expression('Var');
      expect(expr.operator).to.equal('variable');
      // TODO: should Var show up anywhere??
    });
  });
  describe('parse errors', () => {
    it('unexpected character', () => {
      expect(() => new Expression('\x01')).to.throw('Unexpected character');
    });
    it('not a variable', () => {
      expect(() => new Expression('notavar')).to.throw('"notavar" is not a valid variable, function or constant');
    });
    it('invalid operator', () => {
      expect(() => new Expression('_')).to.throw('"_" is not a valid operator');
    });
    it('missing operator', () => {
      expect(() => new Expression('2 2')).to.throw('Expected an operator');
    });
    it('missing operand', () => {
      expect(() => new Expression('2 + +')).to.throw('Expected an operand');
    });
    it('missing parentheses', () => {
      expect(() => new Expression('( 2 + 2')).to.throw('Expected ")"');
    });
  });
  describe('building functions', () => {
    it('plus', () => {
      const expr = new Expression(3).plus(new Expression(5));
      expect(expr).to.deep.equal(new Expression('3 + 5'));
      expect(expr.eval()).to.equal(3 + 5);
    });
    it('minus', () => {
      const expr = new Expression(3).minus(new Expression(5));
      expect(expr).to.deep.equal(new Expression('3 - 5'));
      expect(expr.eval()).to.equal(3 - 5);
    });
    it('times', () => {
      const expr = new Expression(3).times(new Expression(5));
      expect(expr).to.deep.equal(new Expression('3 * 5'));
      expect(expr.eval()).to.equal(3 * 5);
    });
    it('div', () => {
      const expr = new Expression(3).div(new Expression(5));
      // expect(expr).to.deep.equal(new Expression('3 / 5'));
      expect(expr.eval()).to.equal(3 / 5);
    });
    it('negate', () => {
      const expr = new Expression(3).negate();
      expect(expr).to.deep.equal(new Expression('-3'));
      expect(expr.eval()).to.equal(-3);
    });
    it('sqrt', () => {
      const expr = new Expression(3).sqrt();
      expect(expr).to.deep.equal(new Expression('sqrt(3)'));
      expect(expr.eval()).to.equal(Math.sqrt(3));
    });
    it('square', () => {
      const expr = new Expression(3).square();
      // expect(expr).to.deep.equal(new Expression('square(3)'));
      // expect(expr).to.deep.equal(new Expression('3 * 3'));
      expect(expr.eval()).to.equal(3 * 3);
    });
    it('sin', () => {
      const expr = new Expression(Math.PI / 2).sin();
      // expect(expr).to.deep.equal(new Expression(`sin(${Math.PI / 2})`));
      expect(expr.eval()).to.equal(1);
    });
    it('cos', () => {
      const expr = new Expression(Math.PI).cos();
      // expect(expr).to.deep.equal(new Expression(`cos(${Math.PI})`));
      expect(expr.eval()).to.equal(-1);
    });
    it('asin', () => {
      const expr = new Expression(0).asin();
      // expect(expr).to.deep.equal(new Expression('asin(0)'));
      expect(expr.eval()).to.equal(0);
    });
    it('acos', () => {
      const expr = new Expression(-1).acos();
      // expect(expr).to.deep.equal(new Expression('acos(-1)'));
      expect(expr.eval()).to.equal(Math.PI);
    });
  });
});
