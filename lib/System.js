// ported from https://github.com/solvespace/solvespace/blob/master/src/system.cpp
//-----------------------------------------------------------------------------
// Once we've written our constraint equations in the symbolic algebra system,
// these routines linearize them, and solve by a modified Newton's method.
// This also contains the routines to detect non-convergence or inconsistency,
// and report diagnostics to the user.
//
// Copyright 2008-2013 Jonathan Westhues.
//-----------------------------------------------------------------------------
const debug = require('debug')('solvespace:System');

const LENGTH_EPS = require('./utils/constants').LENGTH_EPS;
const Expression = require('./Expression');
const Equation = require('./Equation');

// This tolerance is used to determine whether two (linearized) constraints
// are linearly dependent. If this is too small, then we will attempt to
// solve truly inconsistent systems and fail. But if it's too large, then
// we will give up on legitimate systems like a skinny right angle triangle by
// its hypotenuse and long side.
const RANK_MAG_TOLERANCE = 1e-4;

// The solver will converge all unknowns to within this tolerance. This must
// always be much less than LENGTH_EPS, and in practice should be much less.
const CONVERGE_TOLERANCE = (LENGTH_EPS / (1e2));

const MAX_UNKNOWNS = 10;

// https://github.com/solvespace/solvespace/blob/master/src/system.cpp#L22-L68
function writeJacobian({ params, equations, maxUnknowns }) {
  const jacobian = {
    params,
    equations,
    A: {
      symbolic: [],
      numbers: [],
    },
    B: {
      symbolic: [],
      numbers: [],
    },
    AAt: [],
    X: [],
    Z: [],
    scales: [],
  };

  if (jacobian.params.length >= maxUnknowns) {
    throw Error('max unknown params exceeded');
  }

  if (jacobian.equations.length >= maxUnknowns) {
    throw Error('max unknown equations exceeded');
  }

  debug('writeJacobian: initial jacobian', jacobian);

  for (let a = 0; a < equations.length; a += 1) {
    const equation = equations[a];
    const { expression } = equation;

    jacobian.A.symbolic[a] = [];
    for (let j = 0; j < params.length; j += 1) {
      const jacobianParameter = params[j];
      let partialDerivative;
      if (expression.dependsOn(jacobianParameter)) {
        partialDerivative = expression.partialWrt(jacobianParameter).foldConstants();
      } else {
        partialDerivative = new Expression(0);
      }
      jacobian.A.symbolic[a][j] = partialDerivative;
    }
    jacobian.B.symbolic[a] = expression;
  }

  debug('writeJacobian: final jacobian', jacobian);
  return jacobian;
}

// https://github.com/solvespace/solvespace/blob/master/src/system.cpp#L70-L77
function evaluateJacobian(jacobian) {
  const { equations, params, A } = jacobian;
  for (let i = 0; i < equations.length; i += 1) {
    A.numbers[i] = [];
    for (let j = 0; j < params.length; j += 1) {
      A.numbers[i][j] = A.symbolic[i][j].eval();
    }
  }
}

// https://github.com/solvespace/solvespace/blob/master/src/system.cpp#L79-L85
function isDragged(param) {
  // hParam *pp;
  // for (let pp = dragged.First(); pp; pp = dragged.NextAfter(pp)) {
  //   if (p.v == pp->v) return true;
  // }
  return false;
}

// void System::SolveBySubstitution() {
//     int i;
//     for (let i = 0; i < equations.length; i += 1) {
//         Equation *teq = &(equations[i]);
//         Expr *tex = teq->e;
//
//         if (tex->op    == Expr::Op::MINUS &&
//            tex->a->op == Expr::Op::PARAM &&
//            tex->b->op == Expr::Op::PARAM)
//         {
//             hParam a = tex->a->parh;
//             hParam b = tex->b->parh;
//             if (!(params.FindByIdNoOops(a) && params.FindByIdNoOops(b))) {
//                 // Don't substitute unless they're both solver params;
//                 // otherwise it's an equation that can be solved immediately,
//                 // or an error to flag later.
//                 continue;
//             }
//
//             if (IsDragged(a)) {
//                 // A is being dragged, so A should stay, and B should go
//                 hParam t = a;
//                 a = b;
//                 b = t;
//             }
//
//             int j;
//             for (let j = 0; j < equations.length; j += 1) {
//                 Equation *req = &(equations[j]);
//                 (req->e)->Substitute(a, b); // A becomes B, B unchanged
//             }
//             for (let j = 0; j < params.length; j += 1) {
//                 Param *rp = &(params[j]);
//                 if (rp->substd.v == a.v) {
//                     rp->substd = b;
//                 }
//             }
//             Param *ptr = params.FindById(a);
//             ptr->tag = VAR_SUBSTITUTED;
//             ptr->substd = b;
//
//             teq->tag = EQ_SUBSTITUTED;
//         }
//     }
// }

//-----------------------------------------------------------------------------
// Calculate the rank of the Jacobian matrix, by Gram-Schimdt orthogonalization
// in place. A row (~equation) is considered to be all zeros if its magnitude
// is less than the tolerance RANK_MAG_TOLERANCE.
//-----------------------------------------------------------------------------
function calculateRank(jacobian) {
  // Actually work with magnitudes squared, not the magnitudes
  const rowMag = [];
  const tol = RANK_MAG_TOLERANCE * RANK_MAG_TOLERANCE;
  var rank = 0;

  for (let i = 0; i < jacobian.equations.length; i += 1) {
    // Subtract off this row's component in the direction of any
    // previous rows
    for (let iprev = 0; iprev < i; iprev += 1) {
      if (rowMag[iprev] <= tol) continue; // ignore zero rows

      let dot = 0;
      for (let j = 0; j < jacobian.params.length; j += 1) {
        dot += jacobian.A.numbers[iprev][j] * (jacobian.A.numbers[i][j]);
      }
      for (let j = 0; j < jacobian.params.length; j += 1) {
        jacobian.A.numbers[i][j] -= (dot / rowMag[iprev]) * jacobian.A.numbers[iprev][j];
      }
    }
    // Our row is now normal to all previous rows; calculate the
    // magnitude of what's left
    let mag = 0;
    for (let j = 0; j < jacobian.params.length; j += 1) {
      mag += (jacobian.A.numbers[i][j]) * (jacobian.A.numbers[i][j]);
    }
    if (mag > tol) {
      rank += 1;
    }
    rowMag[i] = mag;
  }

  return rank;
}

function testRank(jacobian) {
  evaluateJacobian(jacobian);
  return calculateRank(jacobian) === jacobian.equations.length;
}


function swapRows(mat, rowIndexA, rowIndexB) {
  const origRowA = mat[rowIndexA];
  mat[rowIndexA] = mat[rowIndexB];
  mat[rowIndexB] = origRowA;
  return mat;
}

function solveLinearSystem(X, A, B) {
  // Gaussian elimination, with partial pivoting. It's an error if the
  // matrix is singular, because that means two constraints are
  // equivalent.

  for (let i = 0; i < B.length; i += 1) {
    // We are trying eliminate the term in column i, for rows i+1 and
    // greater. First, find a pivot (between rows i and N-1).
    let max = 0;
    let imax = 0;
    for (let ip = i; ip < B.length; ip += 1) {
      if (Math.abs(A[ip][i]) > max) {
        imax = ip;
        max = Math.abs(A[ip][i]);
      }
    }
    // Don't give up on a singular matrix unless it's really bad; the
    // assumption code is responsible for identifying that condition,
    // so we're not responsible for reporting that error.
    if (Math.abs(max) < 1e-20) continue;

    // Swap row imax with row i
    swapRows(A, i, imax);
    swapRows(B, i, imax);
    // for (let jp = 0; jp < n; jp += 1) {
    //   swap(A[i][jp], A[imax][jp]);
    // }
    // swap(B[i], B[imax]);

    // For rows i+1 and greater, eliminate the term in column i.
    for (let ip = i + 1; ip < B.length; ip += 1) {
      const temp = A[ip][i] / A[i][i];

      for (let jp = i; jp < B.length; jp += 1) {
        A[ip][jp] -= temp * (A[i][jp]);
      }
      B[ip] -= temp * B[i];
    }
  }

  // We've put the matrix in upper triangular form, so at this point we
  // can solve by back-substitution.
  for (let i = B.length - 1; i >= 0; i -= 1) {
    if (Math.abs(A[i][i]) < 1e-20) continue;

    let temp = B[i];
    for (let j = B.length - 1; j > i; j -= 1) {
      temp -= X[j] * A[i][j];
    }
    X[i] = temp / A[i][i];
  }

  return true;
}

function solveLeastSquares(jacobian) {
  const { equations, params, A, B, scales, AAt, Z, X } = jacobian;

  // Scale the columns; this scale weights the parameters for the least
  // squares solve, so that we can encourage the solver to make bigger
  // changes in some parameters, and smaller in others.
  for (let c = 0; c < params.length; c += 1) {
    if (isDragged(params[c])) {
      // It's least squares, so this parameter doesn't need to be all
      // that big to get a large effect.
      scales[c] = 1 / 20.0;
    } else {
      scales[c] = 1;
    }
    for (let r = 0; r < equations.length; r += 1) {
      A.numbers[r][c] *= scales[c];
    }
  }

  // Write A*A'
  for (let r = 0; r < equations.length; r += 1) {
    AAt[r] = [];
    for (let c = 0; c < equations.length; c += 1) {  // yes, AAt is square
      let sum = 0;
      for (let i = 0; i < params.length; i += 1) {
        sum += A.numbers[r][i] * A.numbers[c][i];
      }
      AAt[r][c] = sum;
    }
  }

  debug('solveLeastSquares: attempting to solveLinearSystem');
  if (!solveLinearSystem(Z, AAt, B.numbers)) {
    debug('solveLeastSquares: solveLinearSystem failed');
    return false;
  }

  // And multiply that by A' to get our solution.
  for (let c = 0; c < params.length; c += 1) {
    let sum = 0;
    for (let i = 0; i < equations.length; i += 1) {
      sum += A.numbers[i][c] * Z[i];
    }
    X[c] = sum * scales[c];
  }

  debug('solveLeastSquares: was successful', X);
  return true;
}

function newtonSolve(jacobian) {
  const { equations, params, B, X } = jacobian;
  var converged = false;
  var iter = 0;

  // Evaluate the functions at our operating point.
  for (let i = 0; i < B.symbolic.length; i += 1) {
    B.numbers[i] = B.symbolic[i].eval();
  }
  debug('newtonSolve: B', B);

  do {
    iter += 1;
    debug('newtonSolve: iter %d', iter);
    // And evaluate the Jacobian at our initial operating point.
    evaluateJacobian(jacobian);

    if (!solveLeastSquares(jacobian)) break;

    // Take the Newton step;
    //      J(x_n) (x_{n+1} - x_n) = 0 - F(x_n)
    for (let i = 0; i < jacobian.params.length; i += 1) {
      const p = params[i];
      p.value -= X[i];
      if (isNaN(p.value)) {
        // Very bad, and clearly not convergent
        debug('newtonSolve: very bad, and clearly not convergent');
        return false;
      }
    }

    // Re-evalute the functions, since the params have just changed.
    for (let i = 0; i < equations.length; i += 1) {
      B.numbers[i] = B.symbolic[i].eval();
    }
    // Check for convergence
    converged = true;
    for (let i = 0; i < equations.length; i += 1) {
      if (isNaN(B.numbers[i])) {
        debug(`newtonSolve: B.numbers[${i}] was NaN`);
        return false;
      }
      if (Math.abs(B.numbers[i]) > CONVERGE_TOLERANCE) {
        converged = false;
        break;
      }
    }
  } while (iter < 50 && !converged);

  debug(`newtonSolve: returning converged? ${converged}`);
  return converged;
}

// void System::WriteEquationsExceptFor(hConstraint hc, Group *g) {
//     int i;
//     // Generate all the equations from constraints in this group
//     for (let i = 0; i < SK.constraint.n; i += 1) {
//         ConstraintBase *c = &(SK.constraint.elem[i]);
//         if (c->group.v != g->h.v) continue;
//         if (c->h.v == hc.v) continue;
//
//         if (c->HasLabel() && c->type != Constraint::Type::COMMENT &&
//                 g->allDimsReference)
//         {
//             // When all dimensions are reference, we adjust them to display
//             // the correct value, and then don't generate any equations.
//             c->ModifyToSatisfy();
//             continue;
//         }
//         if (g->relaxConstraints && c->type != Constraint::Type::POINTS_COINCIDENT) {
//             // When the constraints are relaxed, we keep only the point-
//             // coincident constraints, and the constraints generated by
//             // the entities and groups.
//             continue;
//         }
//
//         c->GenerateEquations(&eq);
//     }
//     // And the equations from entities
//     for (let i = 0; i < SK.entity.n; i += 1) {
//         EntityBase *e = &(SK.entity.elem[i]);
//         if (e->group.v != g->h.v) continue;
//
//         e->GenerateEquations(&eq);
//     }
//     // And from the groups themselves
//     g->GenerateEquations(&eq);
// }

// void System::FindWhichToRemoveToFixJacobian(Group *g, List<hConstraint> *bad, bool forceDofCheck) {
//     int a, i;
//
//     for (let a = 0; a < 2; a += 1) {
//         for (let i = 0; i < SK.constraint.n; i += 1) {
//             ConstraintBase *c = &(SK.constraint.elem[i]);
//             if (c->group.v != g->h.v) continue;
//             if ((c->type == Constraint::Type::POINTS_COINCIDENT && a == 0) ||
//                (c->type != Constraint::Type::POINTS_COINCIDENT && a == 1))
//             {
//                 // Do the constraints in two passes: first everything but
//                 // the point-coincident constraints, then only those
//                 // constraints (so they appear last in the list).
//                 continue;
//             }
//
//             params.ClearTags();
//             equations.Clear();
//             WriteEquationsExceptFor(c->h, g);
//             equations.ClearTags();
//
//             // It's a major speedup to solve the easy ones by substitution here,
//             // and that doesn't break anything.
//             if (!forceDofCheck) {
//                 SolveBySubstitution();
//             }
//
//             WriteJacobian(0);
//             evaluateJacobian(jacobian);
//
//             int rank = CalculateRank();
//             if (rank == jacobian.equations.length) {
//                 // We fixed it by removing this constraint
//                 bad->Add(&(c->h));
//             }
//         }
//     }
// }

// SolveResult System::SolveRank(Group *g, int *dof, List<hConstraint> *bad, bool andFindBad, bool andFindFree, bool forceDofCheck) {
//     WriteEquationsExceptFor(Constraint::NO_CONSTRAINT, g);
//
//     // All params and equations are assigned to group zero.
//     params.ClearTags();
//     equations.ClearTags();
//
//     if (!forceDofCheck) {
//         SolveBySubstitution();
//     }
//
//     // Now write the Jacobian, and do a rank test; that
//     // tells us if the system is inconsistently constrained.
//     if (!WriteJacobian(0)) {
//         return SolveResult::TOO_MANY_UNKNOWNS;
//     }
//
//     bool rankOk = TestRank();
//     if (!rankOk) {
//         if (!g->allowRedundant) {
//             if (andFindBad) FindWhichToRemoveToFixJacobian(g, bad, forceDofCheck);
//         }
//     } else {
//         // This is not the full Jacobian, but any substitutions or single-eq
//         // solves removed one equation and one unknown, therefore no effect
//         // on the number of DOF.
//         if (dof) *dof = CalculateDof();
//         MarkParamsFree(andFindFree);
//     }
//     return rankOk ? SolveResult::OKAY : SolveResult::REDUNDANT_OKAY;
// }

// void System::MarkParamsFree(bool find) {
//     // If requested, find all the free (unbound) variables. This might be
//     // more than the number of degrees of freedom. Don't always do this,
//     // because the display would get annoying and it's slow.
//     for (let int i = 0; i < params.length; i += 1) {
//         Param *p = &(params[i]);
//         p->free = false;
//
//         if (find) {
//             if (p->tag == 0) {
//                 p->tag = VAR_DOF_TEST;
//                 WriteJacobian(0);
//                 evaluateJacobian(jacobian);
//                 int rank = CalculateRank();
//                 if (rank == jacobian.equations.length) {
//                     p->free = true;
//                 }
//                 p->tag = 0;
//             }
//         }
//     }
// }

// https://github.com/solvespace/solvespace/blob/master/src/system.cpp#L584-L586
function calculateDoF(jacobian) {
  const { params, equations } = jacobian;
  return params.length - equations.length;
}

function SolvespaceSystem() {
  this.equations = [];
  this.params = [];
  this.maxUnknowns = MAX_UNKNOWNS;
  this.convergenceTolerance = CONVERGE_TOLERANCE;
}

// new method (not ported)
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

// https://github.com/solvespace/solvespace/blob/master/src/system.cpp#L401-L518
SolvespaceSystem.prototype.solve = function solve({ andFindBad, andFindFree, forceDofCheck } = {}) {
  var rankOk;
  const system = this;
  const { equations, params } = system;
  const solveResult = {
    // group: undefined,
    dof: undefined, // degrees of freedom
    badConstraints: undefined,
  };

  // WriteEquationsExceptFor(Constraint::NO_CONSTRAINT, g);

  debug('%d equations', equations.length);
  for (let i = 0; i < equations.length; i += 1) {
    debug('  %d = %s = 0', equations[i].expression.eval(), equations[i].expression.print());
  }
  debug('%d parameters', params.length);
  for (let i = 0; i < params.length; i += 1) {
    debug('   param %d', params[i].value);
  }

  // if (!forceDofCheck) {
  //   SolveBySubstitution();
  // }

  // Before solving the big system, see if we can find any equations that
  // are soluble alone. This can be a huge speedup. We don't know whether
  // the system is consistent yet, but if it isn't then we'll catch that
  // later.
  for (let i = 0; i < equations.length; i += 1) {
    const equation = equations[i];
    const { expression } = equation;
    const expressionParams = expression.getAllParams();
    if (expressionParams.length !== 1) {
      continue;
    }
    if (!params.includes(expressionParams[0])) {
      continue;
    }

    const jacobian = writeJacobian(system);

    if (!newtonSolve(jacobian)) {
      // We don't do the rank test, so let's arbitrarily return
      // the DIDNT_CONVERGE result here.
      rankOk = true;
      // Failed to converge, bail out early
      didntConverge(jacobian);
    }
  }

  // Now write the Jacobian for what's left, and do a rank test; that
  // tells us if the system is inconsistently constrained.
  const jacobian = writeJacobian(system);
  if (!jacobian) {
    throw new Error('too many unknowns');
  }

  rankOk = testRank(jacobian);

  // And do the leftovers as one big system
  if (!newtonSolve(jacobian)) {
    didntConverge(jacobian);
  }

  rankOk = testRank(jacobian);
  // if (!rankOk) {
  //   if (!g->allowRedundant) {
  //     if (andFindBad) FindWhichToRemoveToFixJacobian(g, bad, forceDofCheck);
  //   }
  // } else {
  //   // This is not the full Jacobian, but any substitutions or single-eq
  //   // solves removed one equation and one unknown, therefore no effect
  //   // on the number of DOF.
  //   if (dof) *dof = CalculateDof();
  //   MarkParamsFree(andFindFree);
  // }
  return rankOk ? 'okay' : 'redundant-okay';

  function didntConverge(j) {
    for (let i = 0; i < equations.length; i += 1) {
      if (Math.abs(j.B.numbers[i]) > CONVERGE_TOLERANCE || isNaN(j.B.numbers[i])) {
        // This constraint is unsatisfied.
        // if (!j.equations[i].isFromConstraint()) continue;
        //
        // hConstraint hc = j.equations[i].constraint();
        // ConstraintBase *c = SK.constraint.FindByIdNoOops(hc);
        // if (!c) continue;
        // // Don't double-show constraints that generated multiple
        // // unsatisfied equations
        // if (!c->tag) {
        //   bad->Add(&(c->h));
        //   c->tag = 1;
        // }
      }
    }

    throw new Error(rankOk ? 'didnt converge' : 'redundant didnt converge');
  }
};

module.exports = SolvespaceSystem;
