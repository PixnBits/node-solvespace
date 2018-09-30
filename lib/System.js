const debug = require('debug')('solvespace:System');

const LENGTH_EPS = require('./utils/constants').LENGTH_EPS;
const Expression = require('./Expression');
const Equation = require('./Equation');

const MAX_UNKNOWNS = 10;
const CONVERGE_TOLERANCE = LENGTH_EPS / 1e2;

function SolvespaceSystem() {
  this.equations = [];
  this.params = [];
  this.maxUnknowns = MAX_UNKNOWNS;
  this.convergenceTolerance = CONVERGE_TOLERANCE;
}

SolvespaceSystem.prototype.addExpression = function addExpression(expression) {
  const system = this;
  system.equations.push(new Equation({ expression }));
  expression.getAllParams().forEach((param) => {
    if (system.params.indexOf(param) !== -1) {
      return;
    }
    system.params.push(param);
  });
  debug(system);
};

SolvespaceSystem.prototype.writeJacobian = function writeJacobian(
  selectedEquations,
  selectedParams
) {
  const system = this;
  const { maxUnknowns } = this;
  const jacobian = {
    params: selectedParams,
    equations: selectedEquations,
    A: {
      sym: [], // TODO: figure out what `sym` stands for (symbolic?)
    },
    B: {
      sym: [],
    },
  };

  if (jacobian.params.length >= maxUnknowns) {
    throw Error('max unknown params exceeded');
  }

  if (jacobian.equations.length >= maxUnknowns) {
    throw Error('max unknown equations exceeded');
  }

  debug('writeJacobian: jacobian', jacobian);

  jacobian.equations.forEach((equation, equationIndex) => {
    jacobian.A.sym[equationIndex] = [];
    const f = equation.foldConstants();
    jacobian.B.sym[equationIndex] = f;
    system.params.forEach((param, paramIndex) => {
      var pd;
      if (f.dependsOn(param)) {
        pd = f.partialWrt(param).foldConstants();
      } else {
        pd = new Expression(0.0);
      }
      jacobian.A.sym[equationIndex][paramIndex] = pd;
    });
  });

  return jacobian;
};

SolvespaceSystem.prototype.evalJacobian = function evalJacobian(jacobian) {
  const { A } = jacobian;
  debug('evalJacobian: A.sym', A.sym);
  A.num = A.sym.map(symRow => symRow.map(sym => sym.eval()));
  debug('evalJacobian: A.num', A.num);
  return jacobian;
};


function swapRows(mat, rowIndexA, rowIndexB) {
  const origRowA = mat[rowIndexA];
  mat[rowIndexA] = mat[rowIndexB];
  mat[rowIndexB] = origRowA;
  return mat;
}
/**
 * A*X = B
 * https://en.wikipedia.org/wiki/LU_decomposition#Solving_linear_equations
 *
 * @param double X[]
 * @param double A[][MAX_UNKNOWNS]
 * @param double B[]
 * @param Number n
 * @returns Boolean
 */
SolvespaceSystem.prototype.solveLinearSystem = function solveLinearSystem(A, B) {
  const X = [];

  // Gaussian elimination, with partial pivoting. It's an error if the
  // matrix is singular, because that means two constraints are
  // equivalent.
  var imax = 0;
  const n = A.length;
  debug('solveLinearSystem: A*x = B', A, X, B);

  // might switch out some rows so array methods aren't the best approach
  for (let i = 0; i < n; i += 1) {
    // We are trying eliminate the term in column i, for rows i+1 and
    // greater. First, find a pivot (between rows i and N-1).
    let max = 0;
    for (let ip = i; ip < n; ip += 1) {
      const absVal = Math.abs(A[ip][i]);
      if (absVal > max) {
        imax = ip;
        max = absVal;
      }
    }
    debug(`solveLinearSystem: max ${max}, imax ${imax}`, Math.abs(max) < 1e-20);

    // Previously:
    // Don't give up on a singular matrix unless it's really bad; the
    // assumption code is responsible for identifying that condition,
    // so we're not responsible for reporting that error.
    // TODO: ensure that's still true
    if (Math.abs(max) < 1e-20) {
      debug(`solveLinearSystem: really bad singular matrix? ${max}`);
      return null;
    }

    debug('solveLinearSystem: A & B before row swapping', A, B);
    // swap row imax with row i
    swapRows(A, i, imax);
    swapRows(B, i, imax);
    debug('solveLinearSystem: A & B after row swapping', A, B);

    // For rows i+1 and greater, eliminate the term in column i.
    for (let ip = i + 1; ip < n; ip += 1) {
      const temp = A[ip][i] / A[i][i];

      for (let jp = i; jp < n; jp += 1) {
        A[ip][jp] -= temp * A[i][jp];
      }
      B[ip] -= temp * B[i];
    }
  }

  debug('solveLinearSystem: A should be in upper triangular form', A, B);


  // We've put the matrix in upper triangular form, so at this point we
  // can solve by back-substitution.
  for (let i = n - 1; i >= 0; i -= 1) {
    if (Math.abs(A[i][i]) >= 1e-20) {
      let temp = B[i];
      for (let j = n - 1; j > i; j -= 1) {
        temp -= X[j] * A[i][j];
      }
      X[i] = temp / A[i][i];
    }
  }
  debug('solveLinearSystem: X after back-substitution', X);
  return X;
};

SolvespaceSystem.prototype.solveLeastSquares = function solveLeastSquares(jacobian) {
  const { params, A, B } = jacobian;
  debug('solveLeastSquares: params', params);
  // TODO: change the scale to 1/20 when dragging is involved
  const scales = params.map(() => 1);
  debug('solveLeastSquares: scales', scales);
  debug('solveLeastSquares: A.num pre-scaled', A.num);
  A.num.forEach((row, rowIndex) => {
    A.num[rowIndex] = row.map((num, numIndex) => num * scales[numIndex]);
  });
  debug('solveLeastSquares: A.num scaled', A.num);

  // write A*A'
  const AAt = [];
  for (let r = 0; r < A.num.length; r += 1) {
    AAt[r] = [];
    for (let c = 0; c < A.num.length; c += 1) {
      let sum = 0;
      for (let i = 0; i < B.sym.length; i += 1) {
        sum += A.num[r][i] * A.num[c][i];
      }
      debug(`solveLeastSquares: AAt[${r}][${c}] = ${sum};`);
      AAt[r][c] = sum;
    }
  }
  debug('solveLeastSquares: AAt', AAt);

  const Z = this.solveLinearSystem(AAt, B.num);
  debug('solveLeastSquares: Z from solveLinearSystem', Z);
  // multiply X by A' to get our solution
  const X = [];
  debug(`mat.n ${'?'} vs scales.length ${scales.length} vs A.num[0].length ${A.num[0].length}`);
  // for (let c = 0; c < scales.length; c += 1) {
  for (let c = 0; c < A.num[0].length; c += 1) {
    let sum = 0;
    for (let i = 0; i < A.num.length; i += 1) {
      debug(`solveLeastSquares: ${sum} += A.num[${i}][${c}] * Z[${i}];`);
      debug(`solveLeastSquares: ${sum} += ${A.num[i][c]} * ${Z[i]};`);
      debug(`solveLeastSquares: ${sum} += ${A.num[i][c] * Z[i]};`);
      sum += A.num[i][c] * Z[i];
      debug(`solveLeastSquares: ${sum}`);
    }
    debug(`X[${c}] = ${sum} * scales[${c}]; --> ${sum * scales[c]}`);
    X[c] = sum * scales[c];
  }

  debug('solveLeastSquares: result', X);
  return X;
};

SolvespaceSystem.prototype.newtonSolve = function newtonSolve(jacobian) {
  const { convergenceTolerance } = this;
  const { B } = jacobian;
  var iter = 0;
  var converged = false;

  // debug('newtonSolve: B.sym', B.sym);
  // evaluate the functions at our operating point
  B.num = B.sym.map(sym => sym.eval());
  debug('newtonSolve: B.num', B.num);

  // line 606
  // evaluate the Jacobian at our initial operating point
  iter = 0;
  converged = false;
  const checkForConvergence = (num) => {
    if (isNaN(num)) {
      debug('newtonSolve: B has a NaN', B);
      throw new Error('got a NaN in B');
    }
    if (Math.abs(num) > convergenceTolerance) {
      converged = false;
    }
    return converged;
  };
  do {
    this.evalJacobian(jacobian);
    debug('evalJacobian results', jacobian.A.num);
    const X = this.solveLeastSquares(jacobian);

    // Take the Newton step;
    //      J(x_n) (x_{n+1} - x_n) = 0 - F(x_n)
    if (X.length < jacobian.params.length) {
      throw new Error(`solveLeastSquares result not appropriate for the params list (${X.length} vs ${jacobian.params.length})`);
    }
    debug(`newtonSolve, step with X=${X}`);
    jacobian.params.forEach((param, i) => {
      debug(`newtonSolve, step ${param.value} -= ${X[i]} (i=${i})`);
      param.value -= X[i];
    });
    if (!jacobian.params.every(param => !isNaN(param.value))) {
      // very bad, and clearly not convergent
      return false;
    }

    // Re-evalute the functions, since the params have just changed
    B.num = B.sym.map(sym => sym.eval());

    // check for convergence
    converged = true;
    B.num.every(checkForConvergence);

    iter += 1;
  } while (iter < 50 && !converged);

  if (iter >= 50) {
    debug('newtonSolve: too many iterations');
  }

  return converged;
};

SolvespaceSystem.prototype.solve = function solve() {
  const system = this;
  // TODO: solveBySubstitution speedup here

  const expressionsToSolve = [];
  const paramsToSolve = [];
  system.equations.forEach((equation) => {
    const { expression } = equation;
    debug(`adding expression ${expression}`);
    const params = expression.getAllParams();
    if (params.length < 1) {
      debug(`params.length (${params.length}) < 1`);
      return;
    }
    expressionsToSolve.push(expression);
    params.forEach((param) => {
      if (!paramsToSolve.includes(param)) {
        paramsToSolve.push(param);
      }
    });
    const jacobian = system.writeJacobian(expressionsToSolve, paramsToSolve);
    debug('solve: jacobian', jacobian);
    debug('solve: jacobian A.sym', jacobian.A.sym);
    debug('solve: jacobian B.sym', jacobian.B.sym);
    system.newtonSolve(jacobian);
  });
};

module.exports = SolvespaceSystem;
