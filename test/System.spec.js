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
      // console.log(system.equations.elem[0]);
      // console.log(system.equations.elem[0].e);
      // console.log(system.mat);

      expect(system.equations.elem[0]).to.have.property('tag', 'eq-substituted');
      expect(system.equations.elem[0].e.a).to.have.property('parh', pA.h);
      expect(system.equations.elem[0].e.b).to.have.property('parh', pA.h);
    });
  });
  it('isDragged');
  it('newtonSolve');
  it('markParamsFree');
  describe('solve', () => {
    it('simple subtractions with no unknowns', () => {
      const system = new System();
      const pA = new Param({ val: 7 });
      const pB = new Param({ val: 7 });
      system.params.addAndAssignId(pA);
      system.params.addAndAssignId(pB);

      // TODO: figure out what this params are for and why we have to add them
      // redundant? should they be params from the system?
      // did I get the system and sketch parent-child relationship backwards?
      system.sketch.params.addAndAssignId(new Param());
      // why 2 instead of 1?
      system.sketch.params.addAndAssignId(new Param());

      const expression = new Expression(pB.h).minus(new Expression(pA.h));
      system.equations.addAndAssignId(
        new Equation({
          expression,
        })
      );

      const pC = new Param({ val: 23 });
      const pD = new Param({ val: 41 });
      const pE = new Param({ val: 41 - 23 });
      system.params.addAndAssignId(pC);
      system.params.addAndAssignId(pD);
      system.params.addAndAssignId(pE);
      system.equations.addAndAssignId(
        new Equation({
          expression: new Expression(pD.h)
                        .minus(new Expression(pC.h))
                        .minus(new Expression(pE.h)),
        })
      );
      system.sketch.params.addAndAssignId(new Param());
      system.sketch.params.addAndAssignId(new Param());
      system.sketch.params.addAndAssignId(new Param());

      // TODO: understand these arguments
      const g = new Group();
      const dof = null;
      const bad = [];
      const andFindBad = true;
      const andFindFree = true;
      const forceDofCheck = true;
      const solveReport = system.solve(g, dof, bad, andFindBad, andFindFree, forceDofCheck);
      expect(solveReport).to.equal('redundant-okay');
      expect(system.mat.X).to.have.property('0', 0);
      expect(system.mat.X).to.have.property('1', 0);
    });
  });
  it('solveRank');
  it('clear');
});
