// no-continue because that's how the original code was written and this needs
//   to work before doing it "the JS way"
/* eslint-disable no-continue */
const Expression = require('./Expression');
const IdList = require('./utils/IdList');

const Sketch = require('./Sketch');
const Entity = require('./Entity');
const HEntity = require('./HEntity');
const Param = require('./Param');
const HParam = require('./HParam');
const Equation = require('./Equation');
const HEquation = require('./HEquation');
const Constraint = require('./Constraint');

const LENGTH_EPS = require('./utils/constants').LENGTH_EPS;

const MAX_UNKNOWNS = 1024;

function tagsAreSimilar(a, b) {
  if (!a) {
    // undefined == 0 is okay
    return !!a === !!b;
  }
  return a === b;
}

/**
 * definition from solvespace.h:332
 * implementation from system.cpp:11-20
 */
function SolvespaceSystem(arg0) {
  const opts = arg0 || {};

  this.sketch = opts.sketch || new Sketch();

  // Solvespace uses the singular, I anticipate plural is more appropriate
  // add both to reference the same data in case I slip up
  this.entity = new IdList(Entity, HEntity);
  this.entities = this.entity;

  this.param = new IdList(Param, HParam);
  this.params = this.param;

  this.eq = new IdList(Equation, HEquation); // Equation, hEquation
  this.equation = this.eq;
  this.equations = this.equation;

  // A list of parameters that are being dragged; these are the ones that
  // we should put as close as possible to their initial positions.
  this.dragged = []; // hParam

  /**
  * definition from solvespace.h:332
  */
  // The system Jacobian matrix
  this.mat = {
    // The corresponding equation for each row
    eq: [/* hEquation */],

    // The corresponding parameter for each column
    param: [/* hParam */],

    // We're solving AX = B
    // m: Number,
    // n: Number,
    A: {
      sym: [[/* Expr */]],
      num: [[/* Number */]],
    },

    scale: [/* Number */],

    // Some helpers for the least squares solve
    AAt: [[/* Number */]],
    Z: [/* Number */],

    X: [/* Number */],

    B: {
      sym: [/* Expr */],
      num: [/* Number */],
    },
  };

  // This tolerance is used to determine whether two (linearized) constraints
  // are linearly dependent. If this is too small, then we will attempt to
  // solve truly inconsistent systems and fail. But if it's too large, then
  // we will give up on legitimate systems like a skinny right angle triangle by
  // its hypotenuse and long side.
  this.RANK_MAG_TOLERANCE = opts.RANK_MAG_TOLERANCE || 1e-4;

  // The solver will converge all unknowns to within this tolerance. This must
  // always be much less than LENGTH_EPS, and in practice should be much less.
  this.CONVERGE_TOLERANCE = opts.CONVERGE_TOLERANCE || (LENGTH_EPS / 1e2);
}

/**
 * definition from solvespace.h:409
 * implementation from system.cpp:554
 * @returns undefined
 */
SolvespaceSystem.prototype.clear = function clear() {
  this.entities.clear();
  this.param.clear();
  this.eq.clear();
  this.dragged = []; // FIXME: or keep the same array, just remove all entries?
};

/**
 * definition from solvespace.h:383
 * implementation from system.cpp:138
 * @returns Number (int)
 */
SolvespaceSystem.prototype.calculateRank = function calculateRank() {
  const { mat } = this;
  // Actually work with magnitudes squared, not the magnitudes
  const rowMag = [];
  const tol = this.RANK_MAG_TOLERANCE * this.RANK_MAG_TOLERANCE;
  var rank = 0;

  console.log('mat.m', mat.m);
  for (let i = 0; i < mat.m; i += 1) {
    // Subtract off this row's component in the direction of any
    // previous rows
    for (let iprev = 0; iprev < i; iprev += 1) {
      if (rowMag[iprev] <= tol) {
        // ignore zero rows
        continue;
      }

      let dot = 0;
      for (let j = 0; j < mat.n; j += 1) {
        dot += mat.A.num[iprev][j] * mat.A.num[i][j];
      }
      for (let j = 0; j < mat.n; j += 1) {
        mat.A.num[i][j] -= (dot / rowMag[iprev]) * mat.A.num[iprev][j];
      }
    }
    // Our row is now normal to all previous rows; calculate the
    // magnitude of what's left
    let mag = 0;
    for (let j = 0; j < mat.n; j += 1) {
      mag += mat.A.num[i][j] * mat.A.num[i][j];
    }
    if (mag > tol) {
      rank += 1;
    }
    rowMag[i] = mag;
  }

  return rank;
};

/**
 * definition from solvespace.h:384
 * implementation from system.cpp:175
 * @returns Boolean
 */
SolvespaceSystem.prototype.testRank = function testRank() {
  this.evalJacobian();
  return this.calculateRank() === this.mat.m;
};

/**
 * definition from solvespace.h:385
 * implementation from src/system.cpp:180
 * @param double X[]
 * @param double A[][MAX_UNKNOWNS]
 * @param double B[]
 * @param Number n
 * @returns Boolean
 */
SolvespaceSystem.prototype.solveLinearSystem = function solveLinearSystem(arg0, arg1, arg2, arg3) {
  const X = arg0;
  const A = arg1;
  const B = arg2;
  const n = arg3;
  // Gaussian elimination, with partial pivoting. It's an error if the
  // matrix is singular, because that means two constraints are
  // equivalent.
  var imax = 0;

  for (let i = 0; i < n; i += 1) {
    // We are trying eliminate the term in column i, for rows i+1 and
    // greater. First, find a pivot (between rows i and N-1).
    let max = 0;
    for (let ip = i; ip < n; ip += 1) {
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
    for (let jp = 0; jp < n; jp += 1) {
      // swap(A[i][jp], A[imax][jp]);
      const t = A[i][jp];
      A[i][jp] = A[imax][jp];
      A[imax][jp] = t;
    }
    // swap(B[i], B[imax]);
    const swapTemp = B[i];
    B[i] = B[imax];
    B[imax] = swapTemp;
    console.log(`B[${i}] ${B[i]}, B[${imax}] ${B[imax]}`, B);

    // For rows i+1 and greater, eliminate the term in column i.
    for (let ip = i + 1; ip < n; ip += 1) {
      const temp = A[ip][i] / A[i][i];

      for (let jp = i; jp < n; jp += 1) {
        A[ip][jp] -= temp * (A[i][jp]);
      }
      console.log(`B[${ip}] -= ${temp} * B[${i}];`);
      B[ip] -= temp * B[i];
    }
  }

  // We've put the matrix in upper triangular form, so at this point we
  // can solve by back-substitution.
  for (let i = n - 1; i >= 0; i -= 1) {
    if (Math.abs(A[i][i]) < 1e-20) {
    // if (Math.abs(A[i][i] || 0) < 1e-20) {
      continue;
    }

    let temp = B[i];
    console.log(`temp = B[${i}] is ${temp}`, B);
    for (let j = n - 1; j > i; j -= 1) {
      temp -= X[j] * A[i][j];
    }
    console.log(`setting X[${i}] = ${temp} / ${A[i][i]}`, A);
    X[i] = temp / A[i][i];
  }

  return true;
};

/**
 * definition from solvespace.h:387
 * implementation from src/system.cpp:236
 * @returns Boolean
 */
SolvespaceSystem.prototype.solveLeastSquares = function solveLeastSquares() {
  const { mat } = this;
  // Scale the columns; this scale weights the parameters for the least
  // squares solve, so that we can encourage the solver to make bigger
  // changes in some parameters, and smaller in others.
  for (let c = 0; c < mat.n; c += 1) {
    if (this.isDragged(mat.param[c])) {
      // It's least squares, so this parameter doesn't need to be all
      // that big to get a large effect.
      mat.scale[c] = 1 / 20;
    } else {
      mat.scale[c] = 1;
    }

    for (let r = 0; r < mat.m; r += 1) {
      mat.A.num[r][c] = mat.scale[c];
    }
  }

  // Write A*A'
  console.log('mat.m', mat.m);
  for (let r = 0; r < mat.m; r += 1) {
    for (let c = 0; c < mat.m; c += 1) { // yes, AAt is square
      let sum = 0;
      for (let i = 0; i < mat.n; i += 1) {
        sum += mat.A.num[r][i] * mat.A.num[c][i];
      }
      console.log(`mat.AAt[${r}][${c}] = ${sum};`);
      mat.AAt[r][c] = sum;
    }
  }

  console.log('mat.Z, mat.AAt, mat.B.num, mat.m', mat.Z, mat.AAt, mat.B.num, mat.m);
  if (!this.solveLinearSystem(mat.Z, mat.AAt, mat.B.num, mat.m)) {
    return false;
  }

  // And multiply that by A' to get our solution.
  for (let c = 0; c < mat.n; c += 1) {
    let sum = 0;
    for (let i = 0; i < mat.m; i += 1) {
      console.log(`${sum} += mat.A.num[${i}][${c}] * mat.Z[${i}]; ${sum} += ${mat.A.num[i][c]} * ${mat.Z[i]}; ${sum + (mat.A.num[i][c] * mat.Z[i])}`, mat.Z);
      sum += mat.A.num[i][c] * mat.Z[i];
    }
    console.log(`mat.X[${c}] = ${sum} * mat.scale[${c}]; ${sum * mat.scale[c]}`);
    mat.X[c] = sum * mat.scale[c];
  }

  return true;
};

/**
 * definition from solvespace.h:389
 * implementation from system.cpp:22
 * @param Number tag
 * @returns Boolean
 */
SolvespaceSystem.prototype.writeJacobian = function writeJacobian(tag) {
  const system = this;
  const mat = system.mat;

  var maxUnknownsReached;

  var j = 0;
  var i = 0;
  mat.param = [];

  maxUnknownsReached = system.params.every((p) => {
    if (j >= MAX_UNKNOWNS) {
      return false;
    }

    if (p.tag !== tag) {
      return true;
    }

    mat.param[j] = p.h;
    j += 1;

    return true;
  });

  if (!maxUnknownsReached) {
    return false;
  }

  console.log(`mat.n = ${j}`, mat.param);
  mat.n = j;

  i = 0;
  // mat.eq = [];
  maxUnknownsReached = system.equations.every((e) => {
    if (i >= MAX_UNKNOWNS) {
      return false;
    }

    // consider 0 and undefined equivalent
    if (!tagsAreSimilar(tag, e.tag)) {
      return true;
    }

    // console.log(`mat.eq[${i}] = `, e.h);
    mat.eq[i] = e.h;
    const f = e.e
      .deepCopyWithParamsAsPointers(system.param, system.sketch.param)
      .foldConstants();

    // Hash table (61 bits) to accelerate generation of zero partials.
    const scoreboard = f.paramsUsed();
    system.param.forEach((param, jj) => {
      var pd;
      if (
        scoreboard & (1 << (param.v % 61)) && // eslint-disable-line no-bitwise
        f.dependsOn(param)
      ) {
        pd = f.partialWrt(param);
        pd = pd.foldConstants();
        pd = pd.deepCopyWithParamsAsPointers(system.param, system.sketch.param);
      } else {
        pd = new Expression(0.0);
      }

      mat.A.sym[i] = mat.A.sym[i] || [];
      mat.A.sym[i][jj] = pd;
      // IdList entries start at 1, not 0
      // mat.A.sym[i][jj - 1] = pd;
    });
    mat.B.sym[i] = f;
    i += 1;
    return true;
  });

  if (!maxUnknownsReached) {
    return false;
  }

  mat.m = i;

  return true;
};

/**
 * definition from solvespace.h:390
 * implementation from system.cpp:70
 * @returns undefined
 */
SolvespaceSystem.prototype.evalJacobian = function evalJacobian() {
  // TODO: re-implement with [].forEach
  // this will require changes to the data structure of this.mat
  // (it's designed with pre-allocated arrays)
  const { mat } = this;
  // console.log('evalJacobian', mat.m, mat.n, mat.A.sym);
  for (let i = 0; i < mat.m; i += 1) {
    for (let j = 0; j < mat.n; j += 1) {
      // console.log(`i: ${i}, j: ${j}, mat.A.sym: `, mat.A.sym);
      // console.log(`mat.A.sym[${i}]:`, mat.A.sym[i]);
      // console.log(`mat.A.sym[${i}][${j}]:`, mat.A.sym[i][j]);
      mat.A.num[i][j] = (mat.A.sym[i][j]).eval();
    }
  }
};

/**
 * definition from solvespace.h:392
 * implementation from system.cpp:326
 * @param hConstraint hc
 * @param Group g
 */
SolvespaceSystem.prototype.writeEquationsExceptFor = function writeEquationsExceptFor(hc, g) {
  // Generate all the equations from constraints in this group
  this.sketch.constraints.forEach((c) => {
    if (c.group.v !== g.h.v) {
      return;
    }
    if (c.h.v === hc.v) {
      return;
    }

    if (c.hasLabel() && c.type !== 'comment' && g.allDimsReference) {
      // When all dimensions are reference, we adjust them to display
      // the correct value, and then don't generate any equations.
      c.modifyToSatisfy();
      return;
    }
    if (g.relaxConstraints && c.type !== 'points-coincident') {
      // When the constraints are relaxed, we keep only the point-
      // coincident constraints, and the constraints generated by
      // the entities and groups.
      return;
    }

    c.generateEquations(this.eq);
  });

  // And the equations from entities
  this.sketch.entity.forEach((e) => {
    if (e.group.v !== g.h.v) {
      return;
    }

    e.generateEquations(this.eq);
  });
  // And from the groups themselves
  g.generateEquations(this.eq);
};

/**
 * definition from solvespace.h:393
 * implementation from system.cpp:362
 * @param Group g
 * @param List<hConstraint> bad
 * @param Boolean forceDofCheck
 */
SolvespaceSystem.prototype.findWhichToRemoveToFixJacobian =
  function findWhichToRemoveToFixJacobian(g, bad, forceDofCheck) {
    for (let a = 0; a < 2; a += 1) {
      for (let i = 0; i < this.sketch.constraints.n; i += 1) {
        const c = this.sketch.constraints.elem[i];
        if (c.group.v !== g.h.v) {
          continue;
        }
        if (
          (c.type === 'points-coincident' && a === 0) ||
          (c.type !== 'points-coincident' && a === 1)
        ) {
          // Do the constraints in two passes: first everything but
          // the point-coincident constraints, then only those
          // constraints (so they appear last in the list).
          continue;
        }

        this.param.clearTags();
        this.eq.clear();
        this.writeEquationsExceptFor(c.h, g);
        this.eq.clearTags();

        // It's a major speedup to solve the easy ones by substitution here,
        // and that doesn't break anything.
        if (!forceDofCheck) {
          this.solveBySubstitution();
        }

        this.writeJacobian(0);
        this.evalJacobian();

        const rank = this.calculateRank();
        if (rank === this.mat.m) {
          // We fixed it by removing this constraint
          bad.add(c.h);
        }
      }
    }
  };

/**
 * definition from solvespace.h:394
 * implementation from system.cpp:87
 * @returns undefined
 */
SolvespaceSystem.prototype.solveBySubstitution = function solveBySubstitution() {
  const system = this;

  system.equations.forEach((teq) => {
    const tex = teq.e;
    if (
      tex.operator === 'minus' &&
      tex.a.operator === 'param' &&
      tex.b.operator === 'param'
    ) {
      let a = tex.a.parh;
      let b = tex.b.parh;
      if (!(system.params.findByIdNoOops(a) && system.params.findByIdNoOops(b))) {
        // Don't substitute unless they're both solver params;
        // otherwise it's an equation that can be solved immediately,
        // or an error to flag later.
        return;
      }

      if (this.isDragged(a)) {
        // A is being dragged, so A should stay, and B should go
        const t = a;
        a = b;
        b = t;
      }

      system.eq.forEach((req) => {
        req.e.substitute(a, b); // A becomes B, B unchanged
      });

      system.param.forEach((rp) => {
        if (rp.substd.v === a.v) {
          // TODO: use a setter?
          rp.substd = b; // eslint-disable-line no-param-reassign
        }
      });

      const ptr = system.param.findById(a);
      ptr.tag = 'var-substituted';
      ptr.substd = b;

      // TODO: use a setter?
      teq.tag = 'eq-substituted'; // eslint-disable-line no-param-reassign
    }
  });
};

/**
 * definition from solvespace.h:396
 * implementation from system.cpp:79
 * @param hParam p
 * @returns Boolean
 */
SolvespaceSystem.prototype.isDragged = function isDragged(p) {
  return this.dragged.some((pp) => {
    if (p.v === pp.v) {
      return true;
    }
    return false;
  });
};

/**
 * definition from solvespace.h:398
 * implementation from system.cpp:279
 * @param Number tag original code this is unused
 * @returns Boolean
 */
SolvespaceSystem.prototype.newtonSolve = function newtonSolve() {
  const { mat } = this;
  var iter = 0;
  var converged = false;

  // Evaluate the functions at our operating point.
  for (let i = 0; i < mat.m; i += 1) {
    mat.B.num[i] = mat.B.sym[i].eval();
    console.log(`mat.B.num[${i}] = ${mat.B.num[i]}`, mat.B.sym[i]);
  }
  do {
    // And evaluate the Jacobian at our initial operating point.
    this.evalJacobian();

    if (!this.solveLeastSquares()) {
      break;
    }

    // Take the Newton step;
    //      J(x_n) (x_{n+1} - x_n) = 0 - F(x_n)
    for (let i = 0; i < mat.n; i += 1) {
      const p = this.param.findById(mat.param[i]);
      p.val -= mat.X[i];
      if (isNaN(p.val)) {
        // Very bad, and clearly not convergent
        return false;
      }
    }

    // Re-evalute the functions, since the params have just changed.
    for (let i = 0; i < mat.m; i += 1) {
      mat.B.num[i] = mat.B.sym[i].eval();
    }

    // Check for convergence
    converged = true;
    for (let i = 0; i < mat.m; i += 1) {
      if (isNaN(mat.B.num[i])) {
        return false;
      }
      if (Math.abs(mat.B.num[i]) > this.CONVERGE_TOLERANCE) {
        converged = false;
        break;
      }
    }
    iter += 1;
  } while (iter < 50 && !converged);

  return converged;
};

/**
 * definition from solvespace.h:400
 * implementation from system.cpp:561
 * @param Boolean findFree
 * @returns undefined
 */
SolvespaceSystem.prototype.markParamsFree = function markParamsFree(find) {
  const system = this;

  this.params.forEach((p) => {
    // TODO: use a setter?
    p.free = false; // eslint-disable-line no-param-reassign

    if (find) {
      if (!p.tag) {
        // TODO: use a setter?
        p.tag = 'var-dof-test'; // eslint-disable-line no-param-reassign
        system.writeJacobian(0);
        system.evalJacobian();
        const rank = system.calculateRank();
        if (rank === system.mat.m) {
          // TODO: use a setter?
          p.free = true; // eslint-disable-line no-param-reassign
        }
        // TODO: use a setter/method like `.clearTag`
        p.tag = null; // eslint-disable-line no-param-reassign
      }
    }
  });
  throw new Error('unimplemented');
};

/**
 * definition from solvespace.h:403
 * implementation from system.cpp:401
 * @param Group g
 * @param Number dof
 * @param List<hConstraint> bad
 * @param Boolean andFindBad
 * @param Boolean andFindFree
 * @param Boolean forceDofCheck false
 * @returns SolveResult
 */
SolvespaceSystem.prototype.solve = function solve(
  g, dof, bad, andFindBad, andFindFree, forceDofCheck
) {
  const system = this;
  var rankOk;
  var alone;

  function didntConverge() {
    console.log('didntConverge');
    system.sketch.constraint.clearTags();

    console.log('forEach vs for', system.eq.maximumId(), system.mat.n);
    system.eq.forEach((eq, eqKey) => {
      console.log(`eqKey: ${eqKey}`);
      if (
        Math.abs(system.mat.B.num[eqKey]) > system.CONVERGE_TOLERANCE ||
        isNaN(system.mat.B.num[eqKey])
      ) {
        // This constraint is unsatisfied.
        if (!system.mat.eq[eqKey].isFromConstraint()) {
          return;
        }
        const hc = system.mat.eq[eqKey].constraint();

        const c = system.sketch.constraint.findByIdNoOops(hc);

        if (!c) {
          return;
        }
        // Don't double-show constraints that generated multiple
        // unsatisfied equations
        if (!c.tag) {
          bad.add(c.h);
          c.tag = 1;
        }
      }
    });

    return rankOk ? 'didnt-converge' : 'redundant-didnt-converge';
  }

  this.writeEquationsExceptFor('no-constraint', g);

  // All params and equations are assigned to group zero.
  this.param.clearTags();
  this.eq.clearTags();

  if (!forceDofCheck) {
    this.solveBySubstitution();
  }

  // Before solving the big system, see if we can find any equations that
  // are solvable alone. This can be a huge speedup. We don't know whether
  // the system is consistent yet, but if it isn't then we'll catch that
  // later.
  alone = 1;
  this.eq.forEach((e) => {
    // TODO: 0 or undefined? (so juse `!e.tag` ?)
    // if (e.tag !== 0) {
    if (!tagsAreSimilar(0, e.tag)) {
      return;
    }
    const hp = e.e.referencedParams(this.param);
    if (hp.v === Expression.NO_PARAMS.v) {
      return;
    }
    if (hp.v === Expression.MULTIPLE_PARAMS.v) {
      return;
    }

    const p = this.param.findById(hp);
    // TODO: 0 or undefined? (so juse `!p.tag` ?)
    if (p.tag !== 0) {
      return;
    }

    e.tag = alone;
    p.tag = alone;
    this.writeJacobian(alone);
    if (!this.newtonSolve(alone)) {
      // We don't do the rank test, so let's arbitrarily return
      // the DIDNT_CONVERGE result here.
      rankOk = true;
      // Failed to converge, bail out early
      console.warn('Failed to converge, bail out early');
      didntConverge();
      return;
    }
    alone += 1;
  });

  // Now write the Jacobian for what's left, and do a rank test; that
  // tells us if the system is inconsistently constrained.
  if (!this.writeJacobian(0)) {
    return 'too-many-unknowns';
  }

  rankOk = this.testRank();

  // And do the leftovers as one big system
  if (!this.newtonSolve(0)) {
    console.warn('newtonSolve(0) "failed"');
    return didntConverge();
  }

  rankOk = this.testRank();
  if (!rankOk) {
    if (!g.allowRedundant) {
      if (andFindBad) {
        this.findWhichToRemoveToFixJacobian(g, bad, forceDofCheck);
      }
    }
  } else {
    // This is not the full Jacobian, but any substitutions or single-eq
    // solves removed one equation and one unknown, therefore no effect
    // on the number of DOF.
    if (dof !== undefined) {
      // TODO: original was `*dof = CalculateDof();` which might change the
      // value of the param externally? pass by value vs pass by reference
      // dof = this.calculateDof();
      console.warn(`solve saw "dof" supplied, instead call .calculateDof() (${this.calculateDof()})`);
    }
    this.markParamsFree(andFindFree);
  }
  // System solved correctly, so write the new values back in to the
  // main parameter table.
  this.param.forEach((p) => {
    var val;
    if (p.tag === 'var-substituted') {
      val = system.param.findById(p.substd).val;
    } else {
      val = p.val;
    }
    const pp = this.sketch.getParam(p.h);
    pp.val = val;
    pp.known = true;
    pp.free = p.free;
  });
  return rankOk ? 'okay' : 'redundant-okay';
};

/**
 * definition from solvespace.h:406
 * implementation from system.cpp:520
 * @param Group g
 * @param Number dof
 * @param List<hConstraint> bad
 * @param Boolean andFindBad
 * @param Boolean andFindFree
 * @param Boolean forceDofCheck false
 * @returns SolveResult
 */
SolvespaceSystem.prototype.solveRank = function solveRank(
  g, dof, bad, andFindBad, andFindFree, forceDofCheck
) {
  this.writeEquationsExceptFor(Constraint.NO_CONSTRAINT, g);
  // this.writeEquationsExceptFor('no-constraint', g);

  this.param.clearTags();
  this.eq.clearTags();

  if (!forceDofCheck) {
    this.solveBySubstitution();
  }

  // Now write the Jacobian, and do a rank test; that
  // tells us if the system is inconsistently constrained.
  if (!this.writeJacobian(0)) {
    return 'too-many-unknowns';
  }

  const rankOk = this.testRank();
  if (!rankOk) {
    if (!g.allowRedundant) {
      if (andFindBad) {
        this.findWhichToRemoveToFixJacobian(g, bad, forceDofCheck);
      }
    }
  } else {
    // This is not the full Jacobian, but any substitutions or single-eq
    // solves removed one equation and one unknown, therefore no effect
    // on the number of DOF.
    if (dof) {
      // TODO: original was `*dof = CalculateDof();` which might change the
      // value of the param externally? pass by value vs pass by reference
      // dof = this.calculateDof();
      console.warn(`solveRank saw "dof" supplied, instead call .calculateDof() (${this.calculateDof()})`);
    }
    this.markParamsFree(andFindFree);
  }
  return rankOk ? 'okay' : 'redundant-okay';
};

// private methods?
/**
 * definition from system.cpp:584
 * @returns int
 */
SolvespaceSystem.prototype.calculateDof = function calculateDof() {
  return this.mat.n - this.mat.m;
};

module.exports = SolvespaceSystem;
