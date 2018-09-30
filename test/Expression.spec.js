const Expression = require('../lib/Expression');

describe('Expression', () => {
  describe('constants', () => {
    it('knows pi', () => {
      const expr = new Expression('pi');
      expect(expr.eval()).toEqual(Math.PI);
    });
  });
  describe('literal', () => {
    it('parses and evaluates an integer', () => {
      const expr = new Expression('42');
      expect(expr.eval()).toEqual(42);
    });
    it('parses and evaluates a decimal', () => {
      const expr = new Expression('42.5');
      expect(expr.eval()).toEqual(42.5);
    });
  });
  describe('urnary ops', () => {
    it('negate', () => {
      const expr = new Expression('-10');
      expect(expr.eval()).toEqual(-10);
    });
  });
  describe('binary ops', () => {
    it('addition', () => {
      const expr = new Expression('1 + 2');
      expect(expr.eval()).toEqual(3);
    });
    it('subtraction', () => {
      const expr = new Expression('1 - 2');
      expect(expr.eval()).toEqual(-1);
    });
    it('multiplication', () => {
      const expr = new Expression('3 * 4');
      expect(expr.eval()).toEqual(12);
    });
    it('division', () => {
      const expr = new Expression('3 / 4');
      expect(expr.eval()).toEqual(0.75);
    });
  });
  describe('parentheses', () => {
    it('first', () => {
      const expr = new Expression('(1 + 2) * 3');
      expect(expr.eval()).toEqual(9);
    });
    it('last', () => {
      const expr = new Expression('1 + (2 * 3)');
      expect(expr.eval()).toEqual(7);
    });
  });
  describe('functions', () => {
    it('sqrt', () => {
      const expr = new Expression('sqrt(4)');
      expect(expr.eval()).toEqual(2);
    });
    it('square', () => {
      const expr = new Expression('square(3)');
      expect(expr.eval()).toEqual(9);
    });
    it('sin', () => {
      const expr180 = new Expression('sin(180)');
      expect(expr180.eval()).toBeCloseTo(0, 1e-15);
      const expr90 = new Expression('sin(90)');
      expect(expr90.eval()).toBeCloseTo(1, 1e-15);
    });
    it('cos', () => {
      const expr = new Expression('cos(180)');
      expect(expr.eval()).toEqual(-1);
    });
    it('asin', () => {
      const expr = new Expression('asin(1)');
      expect(expr.eval()).toEqual(90);
    });
    it('acos', () => {
      const expr = new Expression('acos(0)');
      expect(expr.eval()).toEqual(90);
    });
  });
  describe('precedence', () => {
    it('addition and multiplication', () => {
      const expr = new Expression('2 + 3 * 4');
      expect(expr.eval()).toEqual(14);
    });
    it('subtraction and division', () => {
      const expr = new Expression('2 - 3 / 4');
      expect(expr.eval()).toEqual(1.25);
    });
    it('negation and addition', () => {
      const expr = new Expression('-3 + 2');
      expect(expr.eval()).toEqual(-1);
    });
    it('addition and subtraction', () => {
      const expr = new Expression('2 + 3 - 4');
      expect(expr.eval()).toEqual(1);
    });
  });
  describe('variable', () => {
    it('parse', () => {
      const expr = new Expression('Var');
      expect(expr.operator).toEqual('variable');
      // TODO: should Var show up anywhere??
    });
  });
  describe('parse errors', () => {
    it('unexpected character', () => {
      expect(() => new Expression('\x01')).toThrow('Unexpected character');
    });
    it('not a variable', () => {
      expect(() => new Expression('notavar')).toThrow('"notavar" is not a valid variable, function or constant');
    });
    it('invalid operator', () => {
      expect(() => new Expression('_')).toThrow('"_" is not a valid operator');
    });
    it('missing operator', () => {
      expect(() => new Expression('2 2')).toThrow('Expected an operator');
    });
    it('missing operand', () => {
      expect(() => new Expression('2 + +')).toThrow('Expected an operand');
    });
    it('missing parentheses', () => {
      expect(() => new Expression('( 2 + 2')).toThrow('Expected ")"');
    });
  });
  describe('building functions', () => {
    it('plus', () => {
      const expr = new Expression(3).plus(new Expression(5));
      expect(expr).toEqual(new Expression('3 + 5'));
      expect(expr.eval()).toEqual(3 + 5);
    });
    it('minus', () => {
      const expr = new Expression(3).minus(new Expression(5));
      expect(expr).toEqual(new Expression('3 - 5'));
      expect(expr.eval()).toEqual(3 - 5);
    });
    it('times', () => {
      const expr = new Expression(3).times(new Expression(5));
      expect(expr).toEqual(new Expression('3 * 5'));
      expect(expr.eval()).toEqual(3 * 5);
    });
    it('div', () => {
      const expr = new Expression(3).div(new Expression(5));
      // expect(expr).toEqual(new Expression('3 / 5'));
      expect(expr.eval()).toEqual(3 / 5);
    });
    it('negate', () => {
      const expr = new Expression(3).negate();
      expect(expr).toEqual(new Expression('-3'));
      expect(expr.eval()).toEqual(-3);
    });
    it('sqrt', () => {
      const expr = new Expression(3).sqrt();
      expect(expr).toEqual(new Expression('sqrt(3)'));
      expect(expr.eval()).toEqual(Math.sqrt(3));
    });
    it('square', () => {
      const expr = new Expression(3).square();
      // expect(expr).toEqual(new Expression('square(3)'));
      // expect(expr).toEqual(new Expression('3 * 3'));
      expect(expr.eval()).toEqual(3 * 3);
    });
    it('sin', () => {
      const expr = new Expression(Math.PI / 2).sin();
      // expect(expr).toEqual(new Expression(`sin(${Math.PI / 2})`));
      expect(expr.eval()).toEqual(1);
    });
    it('cos', () => {
      const expr = new Expression(Math.PI).cos();
      // expect(expr).toEqual(new Expression(`cos(${Math.PI})`));
      expect(expr.eval()).toEqual(-1);
    });
    it('asin', () => {
      const expr = new Expression(0).asin();
      // expect(expr).toEqual(new Expression('asin(0)'));
      expect(expr.eval()).toEqual(0);
    });
    it('acos', () => {
      const expr = new Expression(-1).acos();
      // expect(expr).toEqual(new Expression('acos(-1)'));
      expect(expr.eval()).toEqual(Math.PI);
    });
  });
  describe('toString', () => {
    it('prints param expressions', () => {
      const Param = require('../lib/Param');
      const expr = new Expression(new Param({ value: 4 }));
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints constant expressions', () => {
      expect(`${new Expression(42)}`).toMatchSnapshot();
    });
    it('prints minus expressions', () => {
      const expr = new Expression(4).minus(2);
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints times expressions', () => {
      const expr = new Expression(4).times(2);
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints div expressions', () => {
      const expr = new Expression(4).div(2);
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints plus expressions', () => {
      const expr = new Expression(4).plus(2);
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints sqrt expressions', () => {
      const expr = new Expression(4).sqrt();
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints square expressions', () => {
      const expr = new Expression(4).square();
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints negate expressions', () => {
      const expr = new Expression(4).negate();
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints sin expressions', () => {
      const expr = new Expression(4).sin();
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints cos expressions', () => {
      const expr = new Expression(4).cos();
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints asin expressions', () => {
      const expr = new Expression(4).asin();
      expect(`${expr}`).toMatchSnapshot();
    });
    it('prints acos expressions', () => {
      const expr = new Expression(4).acos();
      expect(`${expr}`).toMatchSnapshot();
    });
  });
});
