const expect = require('chai').expect;

const System = require('../lib/System');

const Expression = require('../lib/Expression');
const Equation = require('../lib/Equation');
const Param = require('../lib/Param');
const Group = require('../lib/Group');

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
    xit('one simple equation', () => {
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
  describe('solve', () => {
    it('7 - 3', () => {
      const system = new System();
      const pA = new Param({ val: 3 });
      const pB = new Param({ val: 7 });
      system.params.addAndAssignId(pA);
      system.params.addAndAssignId(pB);

      // have to manually add (solution) params to the sketch?
      // (presumably these params hold the values of the solutions to the system)
      system.sketch.params.addAndAssignId(new Param());
      // why 2 solution holders for only one equation? (and one calculated solution)
      system.sketch.params.addAndAssignId(new Param());

      const expression = new Expression(pB.h).minus(new Expression(pA.h));
      system.equations.addAndAssignId(
        new Equation({
          expression,
        })
      );

      const g = new Group();
      const dof = null;
      const bad = [];
      const andFindBad = true;
      const andFindFree = true;
      const forceDofCheck = true;
      const didSolve = system.solve(g, dof, bad, andFindBad, andFindFree, forceDofCheck);
      console.log('didSolve:', didSolve);
      // console.log('system.equations.elem[1]', system.equations.elem[1]);
      // console.log(system.equations.elem[1].e);
      // console.log(system.mat.A);
      // console.log('system.mat', system.mat);
      console.log('system.sketch.params', system.sketch.params);
    });
  });
  it('solveRank');
  it('clear');
});
