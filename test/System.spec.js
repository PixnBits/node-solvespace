const System = require('../lib/System');

const Expression = require('../lib/Expression');
const Param = require('../lib/Param');

describe('System', () => {
  var system;

  beforeEach(() => {
    system = new System();
  });

  describe('solve', () => {
    it('can solve a simple subtraction', () => {
      const param = new Param({ value: 3 });
      system.addExpression(new Expression(param).minus(new Expression(5)));
      expect(system.params).toHaveProperty('length', 1);
      expect(system.equations).toHaveProperty('length', 1);
      system.solve();
      expect(system.params[0]).toEqual(param);
      expect(system.params[0].value).toEqual(5);
    });

    it('can solve two subtraction expressions', () => {
      const paramA = new Param({ value: 3 });
      system.addExpression(new Expression(paramA).minus(new Expression(5)));
      const paramB = new Param({ value: 1 });
      system.addExpression(new Expression(paramB).minus(new Expression(7)));
      expect(system.params).toHaveProperty('length', 2);
      expect(system.equations).toHaveProperty('length', 2);
      system.solve();
      expect(system.params[0]).toEqual(paramA);
      expect(system.params[1]).toEqual(paramB);
      expect(system.params[0].value).toEqual(5);
      expect(system.params[1].value).toEqual(7);
    });

    it('can solve four linear arithmetic expressions', () => {
      const paramPlus = new Param({ value: 1 });
      system.addExpression(new Expression(paramPlus).plus(new Expression(-3)));
      const paramMinus = new Param({ value: 1 });
      system.addExpression(new Expression(paramMinus).minus(new Expression(5)));
      const paramTimes = new Param({ value: 1 });
      system.addExpression(new Expression(paramTimes).times(new Expression(7)));
      const paramDiv = new Param({ value: 1 });
      system.addExpression(new Expression(paramDiv).div(new Expression(11)));
      expect(system.params).toHaveProperty('length', 4);
      expect(system.equations).toHaveProperty('length', 4);
      system.solve();
      expect(system.params[0]).toEqual(paramPlus);
      expect(system.params[0].value).toEqual(3);
      expect(system.params[1]).toEqual(paramMinus);
      expect(system.params[1].value).toEqual(5);
      expect(system.params[2]).toEqual(paramTimes);
      expect(system.params[2].value).toEqual(0);
      expect(system.params[3]).toEqual(paramDiv);
      expect(system.params[3].value).toEqual(0);
    });

    it('can solve a square expression', () => {
      const param = new Param({ value: 1 });
      // 0 = p^2 - 7^2
      system.addExpression(new Expression(param).square().minus(new Expression(49)));
      expect(system.equations).toHaveProperty('length', 1);
      expect(system.params).toHaveProperty('length', 1);
      system.solve();
      expect(system.params[0]).toEqual(param);
      expect(system.params[0].value).toBeCloseTo(7, 1e-15);
    });

    it('can solve two intersecting lines', () => {
      const x = new Param({ value: 1 });
      const y = new Param({ value: 1 });

      const m1 = new Expression(2);
      const b1 = new Expression(-2);
      // 2*x - 2 = y (2*4-2=8-2=6)
      system.addExpression(m1.times(x).plus(b1).minus(y));

      const m2 = new Expression(-3);
      const b2 = new Expression(18);
      // -3*x + 18 = y (-3*4+18=-12+18=6)
      system.addExpression(m2.times(x).plus(b2).minus(y));

      system.solve();
      expect(x.value).toBeCloseTo(4, 1e-15);
      expect(y.value).toBeCloseTo(6, 1e-15);
    });

    it('can solve a line intersecting a circle', () => {
      const x = new Param({ value: 1 });
      const y = new Param({ value: 1 });

      // simple circle radius 3 centered at (0, 0)
      system.addExpression(
        new Expression(3).square()
          .minus(new Expression(x).square())
          .minus(new Expression(y).square())
      );

      // simple line y = x
      system.addExpression(new Expression(x).minus(new Expression(y)));

      system.solve();
      expect(x.value).toBeCloseTo(y.value, 1e-15);
      expect(y.value).toBeCloseTo(Math.sqrt(Math.pow(3, 2) / 2), 1e-15);
    });

    it('can solve a rectangle with a pixed point, vert and horiz lines, and width & height', () => {
      /*
      b (3,0)  c(5,3)
      +----------+
      |          |
      |          |
      +----------+
      a (0,0)  d(5,0)
      */
      const ax = new Expression(0);
      const ay = new Expression(0);

      const bx = new Param({ value: -1 });
      const by = new Param({ value: 1 });

      const cx = new Param({ value: 2 });
      const cy = new Param({ value: 2 });

      const dx = new Param({ value: 1 });
      const dy = new Param({ value: -1 });

      const width = new Expression(5);
      const height = new Expression(3);

      // vertical lines
      system.addExpression(ax.minus(bx));
      system.addExpression(new Expression(dx).minus(cx));
      // horizontal lines
      system.addExpression(new Expression(ay).minus(dy));
      system.addExpression(new Expression(by).minus(cy));
      // line widths
      system.addExpression(new Expression(by).minus(ay).minus(height));
      system.addExpression(new Expression(cx).minus(bx).minus(width));

      system.solve();

      expect(bx.value).toBeCloseTo(0, 1e-15);
      expect(by.value).toBeCloseTo(3, 1e-15);

      expect(cx.value).toBeCloseTo(5, 1e-15);
      expect(cy.value).toBeCloseTo(3, 1e-15);

      expect(dx.value).toBeCloseTo(5, 1e-15);
      expect(dy.value).toBeCloseTo(0, 1e-15);
    });
  });
});
