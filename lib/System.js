const Expression = require('./Expression');
const IdList = require('./utils/IdList');

/*
 * definition from solvespace.h:272-273
 */
// const EntityList = require('./utils/EntityList');
// const ParamList = require('./utils/ParamList');
const EntityList = IdList;
const ParamList = IdList;
const LENGTH_EPS = require('./utils/constants').LENGTH_EPS;

const MAX_UNKNOWNS = 1024;

/**
 * definition from solvespace.h:332
 * implementation from system.cpp:11-20
 */
function SolvespaceSystem(opts) {
  const optsObj = opts || {};

  // Solvespace uses the singular, I anticipate plural is more appropriate
  // add both to reference the same data in case I slip up
  this.entity = this.entities = new EntityList(optsObj.entities);
  this.param = this.params = new ParamList(optsObj.parameters);
  this.eq = this.equations = new IdList(optsObj.equations); // Equation, hEquation

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
  this.RANK_MAG_TOLERANCE = optsObj.RANK_MAG_TOLERANCE || 1e-4;

  // The solver will converge all unknowns to within this tolerance. This must
  // always be much less than LENGTH_EPS, and in practice should be much less.
  this.CONVERGE_TOLERANCE = optsObj.CONVERGE_TOLERANCE || (LENGTH_EPS / 1e2);
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
  throw new Error('unimplemented');
};

/**
 * definition from solvespace.h:384
 * @returns Boolean
 */
SolvespaceSystem.prototype.testRank = function testRank() {
  throw new Error('unimplemented');
};

/**
 * definition from solvespace.h:385
 * @param double X[]
 * @param double A[][MAX_UNKNOWNS]
 * @param double B[]
 * @param int N
 * @returns Boolean
 */
SolvespaceSystem.prototype.solveLinearSystem = function solveLinearSystem() {
  throw new Error('unimplemented');
};

/**
 * definition from solvespace.h:387
 * @returns Boolean
 */
SolvespaceSystem.prototype.solveLeastSquares = function solveLeastSquares() {
  throw new Error('unimplemented');
};

/**
 * definition from solvespace.h:389
 * implementation from system.cpp:22
 * @param int tag
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

  mat.n = j;

  i = 0;
  mat.eq = [];
  maxUnknownsReached = system.equations.every((e) => {
    if (i >= MAX_UNKNOWNS) {
      return false;
    }

    if (e.tag !== tag) {
      return true;
    }

    mat.eq[i] = e.h;
    const f = e.e
      .deepCopyWithParamsAsPointers(system.param, sketch.param)
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
        pd = pd.deepCopyWithParamsAsPointers(system.param, sketch.param);
      } else {
        pd = new Expression(0.0);
      }

      mat.A.sym[i] = mat.A.sym[i] || [];
      mat.A.sym[i][jj] = pd;
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
  const mat = this.mat;
  for (let i = 0; i < mat.m; i += 1) {
    for (let j = 0; j < mat.n; j += 1) {
      mat.A.num[i][j] = (mat.A.sym[i][j]).eval();
    }
  }
};

/**
 * definition from solvespace.h:392
 * implementation from system.cpp:326
 * @param hConstraint hc
 * @param Group g
 * @returns undefined
 */
SolvespaceSystem.prototype.writeEquationsExceptFor = function writeEquationsExceptFor() {
  throw new Error('unimplemented');
};

/**
 * definition from solvespace.h:393
 * @param Group g
 * @param List<hConstraint> bad
 * @param Boolean forceDofCheck
 * @returns undefined
 */
SolvespaceSystem.prototype.findWhichToRemoveToFixJacobian = function () {
  throw new Error('unimplemented');
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
    console.log('tex', tex);
    if (
      tex.operator === 'minus' &&
      tex.a.operator === 'parameter' &&
      tex.b.operator === 'parameter'
    ) {
      let a = tex.a.parh;
      let b = tex.b.parh;
      if (!(system.parameters.findByIdNoOops(a) && system.parameters.findByIdNoOops(b))) {
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
          rp.substd = b;
        }
      });

      const ptr = system.param.findById(a);
      ptr.tag = 'var-substituted';
      ptr.substd = b;

      teq.tag = 'eq-substituted';
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
 * @param int tag
 * @returns Boolean
 */
SolvespaceSystem.prototype.newtonSolve = function newtonSolve() {
  throw new Error('unimplemented');
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
    p.free = false;

    if (find) {
      if (!p.tag) {
        p.tag = 'var-dof-test';
        system.writeJacobian(0);
        system.evalJacobian();
        const rank = system.calculateRank();
        if (rank === system.mat.m) {
          p.free = true;
        }
        p.tag = null;
      }
    }
  });
  throw new Error('unimplemented');
};

/**
 * definition from solvespace.h:403
 * @param Group g
 * @param int dof
 * @param List<hConstraint> bad
 * @param Boolean andFindBad
 * @param Boolean andFindFree
 * @param Boolean forceDofCheck false
 * @returns SolveResult
 */
SolvespaceSystem.prototype.solve = function solve() {
  throw new Error('unimplemented');
};

/**
 * implementation from system.cpp:498
 */
function didntConverge() {
  throw new Error('unimplemented');
}

/**
 * definition from solvespace.h:406
 * implementation from system.cpp:520
 * @param Group g
 * @param int dof
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
    return SolveResult.TOO_MANY_UNKNOWNS;
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
      dof = this.calculateDof();
    }
    this.markParamsFree(andFindFree);
  }
  return rankOk ? SolveResult.OKAY : SolveResult.REDUNDANT_OKAY;
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
