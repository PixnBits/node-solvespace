const expect = require('chai').expect;

const System = require('../lib/System');

const Expression = require('../lib/Expression');
const Equation = require('../lib/Equation');
const Param = require('../lib/Param');

describe('System', () => {
  it('constructor');
  it('calculateRank');
  it('testRank');
  it('solveLinearSystem');
  it('solveLeastSquares');
  it('writeJacobian');
  it('evalJacobian');
  it('writeEquationsExceptFor');
  it('findWhichToRemoveToFixJacobian');
  describe('solveBySubstitution', () => {
    it('one simple equation', () => {
      const system = new System();
      const pA = new Param();
      const pB = new Param();
      system.params.addAndAssignId(pA);
      system.params.addAndAssignId(pB);
      const expression = new Expression(pB.h).minus(new Expression(pA.h));
      system.equations.addAndAssignId(
        new Equation({
          expression,
        })
      );

      system.solveBySubstitution();
      // console.log(system.equations.elem[1]);
      // console.log(system.equations.elem[1].e);
      // console.log(system.mat.A);

      expect(system.equations.elem[1]).to.have.property('tag', 'eq-substituted');
      expect(system.equations.elem[1].e.a).to.have.property('parh', pA.h);
      expect(system.equations.elem[1].e.b).to.have.property('parh', pA.h);
    });
  });
  it('isDragged');
  it('newtonSolve');
  it('markParamsFree');
  it('solve');
  it('solveRank');
  it('clear');
});
