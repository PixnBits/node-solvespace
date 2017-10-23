const expect = require('chai').expect;

const System = require('../lib/System');

const Expression = require('../lib/Expression');
const Param = require('../lib/Param');

describe('MySystem', () => {
  var system;

  beforeEach(() => {
    system = new System();
  });

  describe('solve', () => {
    it('can solve a simple subtraction', () => {
      const param = new Param({ value: 3 });
      system.addExpression(new Expression(param).minus(new Expression(5)));
      expect(system.params).to.have.property('length', 1);
      expect(system.equations).to.have.property('length', 1);
      system.solve();
      expect(system.params[0]).to.equal(param);
      expect(system.params[0].value).to.equal(5);
    });
    it('can solve two subtraction expressions', () => {
      const paramA = new Param({ value: 3 });
      system.addExpression(new Expression(paramA).minus(new Expression(5)));
      const paramB = new Param({ value: 1 });
      system.addExpression(new Expression(paramB).minus(new Expression(7)));
      expect(system.params).to.have.property('length', 2);
      expect(system.equations).to.have.property('length', 2);
      system.solve();
      expect(system.params[0]).to.equal(paramA);
      expect(system.params[1]).to.equal(paramB);
      expect(system.params[0].value).to.equal(5);
      expect(system.params[1].value).to.equal(7);
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
      expect(system.params).to.have.property('length', 4);
      expect(system.equations).to.have.property('length', 4);
      system.solve();
      expect(system.params[0]).to.equal(paramPlus);
      expect(system.params[0].value).to.equal(3);
      expect(system.params[1]).to.equal(paramMinus);
      expect(system.params[1].value).to.equal(5);
      expect(system.params[2]).to.equal(paramTimes);
      expect(system.params[2].value).to.equal(0);
      expect(system.params[3]).to.equal(paramDiv);
      expect(system.params[3].value).to.equal(0);
    });
    it('can solve a square expression', () => {
      const param = new Param({ value: 1 });
      system.addExpression(new Expression(param).square().minus(new Expression(49)));
      expect(system.equations).to.have.property('length', 1);
      expect(system.params).to.have.property('length', 1);
      system.solve();
      expect(system.params[0]).to.equal(param);
      expect(system.params[0].value).to.be.closeTo(7, 1e-15);
    });
  });
});
