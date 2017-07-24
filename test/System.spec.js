// const expect = require('chai').expect;

const System = require('../lib/System');

const Expression = require('../lib/Expression');
const Equation = require('../lib/Equation');

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
  it('solveBySubstitution');
  it('isDragged');
  it('newtonSolve');
  it('markParamsFree');
  describe('solve', () => {
    it('one simple equations', () => {
      // const system = new System({
      //   equations: [
      //     new Equation({
      //       tag: 0,
      //       expression: new Expression('2 + 2'),
      //     }),
      //   ],
      // });
      const system = new System();
      system.equations.set(
        'idk',
        new Equation({
          tag: 0,
          expression: new Expression('a - b'),
        })
      );

      system.solveBySubstitution();
      console.log(system);
      console.log(system.mat.A);
      // system.solve();
    });
  });
  it('solveRank');
  it('clear');
});
