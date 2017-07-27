const isNumber = require('is-number');

const ExpressionParser = require('./ExpressionParser');
const HParam = require('./HParam');

/**
 * definition from src/expr.h:10
 * implementation from src/expr.cpp:
 * definition from src/expr.h:48
 * implementation from src/expr.cpp:
 * definition from src/expr.h:49
 * implementation from src/expr.cpp:
 * definition from src/expr.h:100
 * implementation from src/expr.cpp:
 *
 * definition from src/expr.h:55
 * implementation from src/expr.cpp:221
 */
function Expression(arg) {
  if (arg instanceof Object) {
    this.operator = arg.operator || arg.op;
    if ('value' in arg) {
      this.value = arg.value;
    }
    if ('a' in arg) {
      this.a = arg.a;
    }
    if ('b' in arg) {
      this.b = arg.b;
    }
    if ('parh' in arg) {
      this.parh = arg.parh;
    }
    if ('parp' in arg) {
      this.parp = arg.parp;
    }
  }

  /*
   * definition from src/expr.h:54
   * implementation from src/expr.cpp:
   * implementation from src/expr.cpp:214
   */
  if (arg instanceof HParam) {
    this.operator = 'param';
    this.parh = arg;
  }

  if (typeof arg === 'number' && isNumber(arg)) {
    this.operator = 'constant';
    this.value = arg;
  }

  if (arg && typeof arg.operator === 'string') {
    this.operator = arg.operator;
    if (isNumber(arg.value)) {
      this.value = arg.value;
    }
  }

  if (typeof arg === 'string') {
    return (new ExpressionParser(arg)).parse();
  }

  // used by Token
  if (arg === null) {
    // TODO: ensure this is accurate
    // we're just a holding spot, for storage
    return this;
  }

  if (!this.operator || typeof this.operator !== 'string') {
    throw new Error(`Expression requires an operator (${typeof this.operator})`);
  }

  // TODO: understand hParam, implement as Parameter
  // if (arg instanceof Parameter) {
  //   this.operator = 'parameter';
  //   this.parameter = arg;
  // }

  // throw new Error(`Expression creator: unhandled input "${arg}"`);
}

/**
 * definition from src/expr.h:57
 * implementation from src/expr.cpp:257
 * @param String newOp
 * @param Expression b
 * @returns Expression
 */
Expression.prototype.anyOp = function anyOp(newOp, b) {
  const r = new Expression({ op: newOp });
  r.a = new Expression(this);
  if (b !== undefined) {
    r.b = new Expression(b);
  }
  return r;
};

/**
 * definition from src/expr.h:58-69
 * implementation from src/expr.cpp:
 * implementation from src/expr.h:58-69
 * @param Expression b
 * @returns Expression
 */
[
  'plus',
  'minus',
  'times',
  'div',

  'negate',
  'sqrt',
  'square',
  'sin',
  'cos',
  'asin',
  'acos',
]
  .forEach((n) => {
    Expression.prototype[n] = function invokeAnyOp(b) {
      return this.anyOp(n, b);
    };
  });

/**
 * definition from src/expr.h:71
 * implementation from src/expr.cpp:
 * @param hParam p
 * @returns Expr
 */
Expression.prototype.partialWrt = function partialWrt() {
  throw new Error('unimplemented');
};

/**
 * definition from src/expr.h:72
 * implementation from src/expr.cpp:336
 * @returns Number
 */
Expression.prototype.eval = function evaluate() {
  const { operator, value, a, b } = this;
  switch (operator) {
    case 'param':
      // return SK.GetParam(parh)->val;
      throw new Error('eval param unimplemented');
    case 'param-pointer':
      return this.parp.val;
    case 'constant':
      return value;
    case 'variable':
      throw new Error('unimplemented, but not supported yet');

    case 'plus':
      return a.eval() + b.eval();
    case 'minus':
      return a.eval() - b.eval();
    case 'times':
      return a.eval() * b.eval();
    case 'div':
    // expected fall through to 'divide'
    case 'divide':
      return a.eval() / b.eval();

    case 'negate':
      return -1 * a.eval();
    case 'sqrt':
      return Math.sqrt(a.eval());
    case 'square':
      // node doesn't comprehend ** yet, use Math.pow()
      return Math.pow(a.eval(), 2); // eslint-disable-line no-restricted-properties
    case 'sin':
      return Math.sin(a.eval());
    case 'cos':
      return Math.cos(a.eval());
    case 'asin':
      return Math.asin(a.eval());
    case 'acos':
      return Math.acos(a.eval());

    default:
      // drop down to the error
      break;
  }

  throw new Error(`Unexpected operator "${operator}"`);
};

/**
 * definition from src/expr.h:73
 * implementation from src/expr.cpp:403
 * @returns Number
 */
Expression.prototype.paramsUsed = function paramsUsed() {
  // original C code stores all values in v */
  /* eslint-disable no-bitwise */
  var r = 0;
  if (this.operator === 'param') {
    r |= 1 << (this.parh.v % 61);
  }
  if (this.operator === 'param-pointer') {
    r |= 1 << (this.parp.h.v % 61);
  }

  const c = this.children();
  if (c >= 1) {
    r |= this.a.paramsUsed();
  }
  if (c >= 2) {
    r |= this.b.paramsUsed();
  }
  /* eslint-enable no-bitwise */

  return r;
};

/**
 * definition from src/expr.h:74
 * implementation from src/expr.cpp:414
 * @param hParam p
 * @returns Boolean
 */
Expression.prototype.dependsOn = function dependsOn(p) {
  if (this.operator === 'param') {
    return this.parh.v === p.v;
  }
  if (this.operator === 'param-pointer') {
    return this.parp.h.v === p.v;
  }

  const c = this.children();
  if (c === 1) {
    return this.a.dependsOn(p);
  }
  if (c === 2) {
    return this.a.dependsOn(p) || this.b.dependsOn(p);
  }
  return false;
};

/**
 * definition from src/expr.h:75
 * implementation from src/expr.cpp:
 * @param Number a
 * @param Number b
 * @returns Boolean
 */
Expression.tol = function tol() {
  throw new Error('unimplemented');
};

/**
 * definition from src/expr.h:76
 * implementation from src/expr.cpp:427
 * @returns Expr
 */
Expression.prototype.foldConstants = function foldConstants() {
  var n = new Expression(this);

  const c = this.children();
  if (c >= 1) {
    n.a = this.a.foldConstants();
  }
  if (c >= 2) {
    n.b = this.b.foldConstants();
  }

  switch (this.operator) {
    case 'param-pointer':
    case 'param':
    case 'constant':
    case 'variable':
      break;

    case 'minus':
    case 'times':
    case 'div':
    case 'plus':
      // If both ops are known, then we can evaluate immediately
      if (n.a.operator === 'constant' && n.b.operator === 'constant') {
        n.v = n.eval();
        n.operator = 'constant';
        break;
      }
      // x + 0 = 0 + x = x
      if (this.op === 'plus' && n.b.operator === 'constant' && this.tol(n.b.v, 0)) {
        n = n.a;
        break;
      }
      if (this.op === 'plus' && n.a.operator === 'constant' && this.tol(n.a.v, 0)) {
        n = n.b;
        break;
      }
      // 1*x = x*1 = x
      if (this.op === 'times' && n.b.operator === 'constant' && this.tol(n.b.v, 1)) {
        n = n.a;
        break;
      }
      if (this.op === 'times' && n.a.operator === 'constant' && this.tol(n.a.v, 1)) {
        n = n.b;
        break;
      }
      // 0*x = x*0 = 0
      if (this.op === 'times' && n.b.operator === 'constant' && this.tol(n.b.v, 0)) {
        n.operator = 'constant';
        n.v = 0;
        break;
      }
      if (this.op === 'times' && n.a.operator === 'constant' && this.tol(n.a.v, 0)) {
        n.operator = 'constant';
        n.v = 0;
        break;
      }

      break;

    case 'sqrt':
    case 'square':
    case 'negate':
    case 'sin':
    case 'cos':
    case 'asin':
    case 'acos':
      if (n.a.operator === 'constant') {
        n.v = n.eval();
        n.operator = 'constant';
      }
      break;

    default:
      throw new Error(`unexpected operator "${this.operator}"`);
  }

  return n;
};

/**
 * definition from src/expr.h:77
 * implementation from src/expr.cpp:494
 * @param hParam oldh
 * @param hParam newh
 * @returns void
 */
Expression.prototype.substitute = function substitute(oldh, newh) {
  if (this.operator === 'param-pointer') {
    throw new Error('Expected an expression that refer to params via handles');
  }

  if (this.operator === 'param' && this.parh.v === oldh.v) {
    this.parh = newh;
  }

  const c = this.children();
  if (c >= 1) {
    this.a.substitute(oldh, newh);
  }
  if (c >= 2) {
    this.b.substitute(oldh, newh);
  }
};

//-----------------------------------------------------------------------------
// If the expression references only one parameter that appears in pl, then
// return that parameter. If no param is referenced, then return NO_PARAMS.
// If multiple params are referenced, then return MULTIPLE_PARAMS.
//-----------------------------------------------------------------------------
/**
 * definition from src/expr.h:79
 * implementation from src/expr.cpp:510
 */
Expression.NO_PARAMS = new Expression(0);
/**
 * definition from src/expr.h:79
 * implementation from src/expr.cpp:511
*/
Expression.MULTIPLE_PARAMS = new Expression(1);

/**
 * If the expression references only one parameter that appears in pl, then
 * return that parameter. If no param is referenced, then return NO_PARAMS.
 * If multiple params are referenced, then return MULTIPLE_PARAMS.
 *
 * definition from src/expr.h:80
 * implementation from src/expr.cpp:512
 * @param ParamList pl
 * @returns hParam
 */
Expression.prototype.referencedParams = function referencedParams(pl) {
  if (this.operator === 'param') {
    if (pl.findByIdNoOops(this.parh)) {
      return this.parh;
    }
    return 'no-params';
  }

  if (this.operator === 'param-pointer') {
    throw new Error('Expected an expression that refer to params via handles');
  }

  const c = this.children();
  if (c === 0) {
    return 'no-params';
  } else if (c === 1) {
    return this.a.referencedParams(pl);
  } else if (c === 2) {
    const pa = this.a.referencedParams(pl);
    const pb = this.b.referencedParams(pl);
    if (pa.value === Expression.NO_PARAMS.value) {
      return pb;
    } else if (pb.v === Expression.NO_PARAMS.v) {
      return pa;
    } else if (pa.v === pb.v) {
      return pa; // either, doesn't matter
    }
    return 'multiple-params';
  }
  throw new Error(`Unexpected children count (${c})`);
};

/**
 * definition from src/expr.h:82
 * implementation from src/expr.cpp:
 * @returns void
 */
Expression.prototype.paramsToPointers = function paramsToPointers() {
  throw new Error('unimplemented');
};

/**
 * definition from src/expr.h:84
 * implementation from src/expr.cpp:
 * @returns String
 */
Expression.prototype.print = function print() {
  throw new Error('unimplemented');
};

// number of child nodes: 0 (e.g. constant), 1 (sqrt), or 2 (+)
/**
 * definition from src/expr.h:87
 * implementation from src/expr.cpp:265
 * @returns Number
 */
Expression.prototype.children = function children() {
  switch (this.operator) {
    case 'param':
    case 'param-pointer':
    case 'constant':
    case 'variable':
      return 0;

    case 'plus':
    case 'minus':
    case 'times':
    case 'div':
      return 2;

    case 'negate':
    case 'sqrt':
    case 'square':
    case 'sin':
    case 'cos':
    case 'asin':
    case 'acos':
      return 1;

    default:
      throw new Error(`Unexpected operator (${this.operator})`);
  }
};

// total number of nodes in the tree
/**
 * definition from src/expr.h:89
 * implementation from src/expr.cpp:
 * @returns Number
 */
Expression.prototype.nodes = function nodes() {
  throw new Error('unimplemented');
};

// Make a simple copy
/**
 * definition from src/expr.h:92
 * implementation from src/expr.cpp:
 * @returns Expr
 */
Expression.prototype.deepCopy = function deepCopy() {
  throw new Error('unimplemented');
};

// Make a copy, with the parameters (usually referenced by hParam)
// resolved to pointers to the actual value. This speeds things up
// considerably.
/**
 * definition from src/expr.h:86
 * implementation from src/expr.cpp:309
 * implementation from src/expr.cpp:
 * @param IdList<Param,hParam> firstTry
 * @param IdList<Param,hParam> thenTry
 * @returns Expr
 */
Expression.prototype.deepCopyWithParamsAsPointers =
  function deepCopyWithParamsAsPointers(firstTry, thenTry) {
    var n;
    if (this.operator === 'param') {
      // A param that is referenced by its hParam gets rewritten to go
      // straight in to the parameter table with a pointer, or simply
      // into a constant if it's already known.
      const p = firstTry.findByIdNoOops(this.parh) || thenTry.findById(this.parh);
      if (p.known) {
        n = new Expression({
          operator: 'constant',
          value: p.val,
        });
      } else {
        n = new Expression({
          operator: 'param-pointer',
          parp: p,
        });
      }
      return n;
    }

    n = this;
    const c = n.children();
    if (c > 0) {
      n.a = this.a.deepCopyWithParamsAsPointers(firstTry, thenTry);
    }
    if (c > 1) {
      n.b = this.b.deepCopyWithParamsAsPointers(firstTry, thenTry);
    }
    return n;
  };

/**
 * definition from src/expr.h:99
 * implementation from src/expr.cpp:
 * @param String input
 * @param String error
 * @returns Expr
 */
Expression.parse = function parse() {
  throw new Error('unimplemented');
};


module.exports = Expression;
