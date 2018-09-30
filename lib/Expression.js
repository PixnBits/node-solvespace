const debug = require('debug')('solvespace:Expression');

const isNumber = require('is-number');

const ExpressionParser = require('./ExpressionParser');
const Param = require('./Param');

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
    if ('param' in arg) {
      this.param = arg.param;
    }
  }

  // my guess
  if (arg instanceof Param) {
    // this.operator = 'constant';
    // this.value = arg;
    this.param = arg;
    this.operator = 'param';
  }

  /*
   * definition from src/expr.h:54
   * implementation from src/expr.cpp:
   * implementation from src/expr.cpp:214
   */

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
 * implementation from src/expr.cpp:360
 * @param Param p
 * @returns Expr
 */
Expression.prototype.partialWrt = function partialWrt(p) {
  const { operator, param, a, b } = this;

  switch (operator) {
    case 'param-pointer':
      throw new Error('param-pointer not ported');
    case 'param':
      return new Expression(param === p ? 1 : 0);

    case 'constant':
      return new Expression(0.0);
    case 'variable':
      throw new Error('variable unimplemented');

    case 'plus':
      return (a.partialWrt(p)).plus(b.partialWrt(p));
    case 'minus':
      return (a.partialWrt(p)).minus(b.partialWrt(p));

    case 'times':
      return a.times(b.partialWrt(p)).plus(b.times(a.partialWrt(p)));
    case 'div':
      return ((a.partialWrt(p).times(b)).minus(a.times(b.partialWrt(p)))).div(b.square());

    case 'sqrt':
      return (new Expression(0.5).div(a.sqrt())).times(a.partialWrt(p));
    case 'square':
      return (new Expression(2.0).times(a)).times(a.partialWrt(p));

    case 'negate':
      return (a.partialWrt(p)).negate();
    case 'sin':
      return (a.cos()).times(a.partialWrt(p));
    case 'cos':
      return ((a.sin()).times(a.partialWrt(p))).negate();

    case 'asin':
      return (new Expression(1).div((new Expression(1).minus(a.square())).sqrt()))
          .times(a.partialWrt(p));
    case 'acos':
      return (new Expression(-1).div((new Expression(1).minus(a.square())).sqrt()))
        .times(a.partialWrt(p));

    default:
      throw new Error(`unexpected operation "${operator}"`);
  }
};

/**
 * definition from src/expr.h:72
 * implementation from src/expr.cpp:336
 * @returns Number
 */
Expression.prototype.eval = function evaluate() {
  const { operator, value, a, b, param } = this;
  switch (operator) {
    case 'param':
      // return SK.GetParam(parh)->val;
      // throw new Error('eval param unimplemented');
      if (param.substd) {
        debug(`eval, param, substd value: ${param.substd.value}`);
        return param.substd.value;
      }
      debug(`eval, param value: ${param.value}`);
      return param.value;
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
    return this.param === p;
  }
  if (this.operator === 'param-pointer') {
    throw Error('unimplemented param-pointer');
    // return this.parp.h.v === p.v;
  }

  return (this.a && this.a.dependsOn(p)) || (this.b && this.b.dependsOn(p));
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

  if (this.a) {
    n.a = this.a.foldConstants();
  }
  if (this.b) {
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
        n.value = n.eval();
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
        n.value = 0;
        break;
      }
      if (this.op === 'times' && n.a.operator === 'constant' && this.tol(n.a.v, 0)) {
        n.operator = 'constant';
        n.value = 0;
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
        n.value = n.eval();
        n.operator = 'constant';
      }
      break;

    default:
      throw new Error(`unexpected operator "${this.operator}"`);
  }

  if (n.operator === 'constant') {
    // no longer needed
    delete n.a;
    delete n.b;
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
Expression.prototype.substitute = function substitute(oldParam, newParam) {
  if (this.operator === 'param-pointer') {
    throw new Error('Expected an expression that refer to params via handles');
  }

  if (this.operator === 'param' && this.param === oldParam) {
    this.param = newParam;
  }

  if (this.a) {
    this.a.substitute(oldParam, newParam);
  }
  if (this.b) {
    this.b.substitute(oldParam, newParam);
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
 * implementation from src/expr.cpp:548
 * @returns String
 */
Expression.prototype.print = function print() {
  const { operator, a, b } = this;
  switch (operator) {
    case 'param-pointer':
      throw new Error('param-pointer unimplemented');
    case 'param':
      return `param(${this.param.value})`;
    case 'constant':
      // return `const(${this.value})`;
      return `${this.value}`;
    case 'variable':
      throw new Error('variable unimplemented');
      // return '(var)';
    case 'minus':
      return `(${a.print()} - ${b.print()})`;
    case 'times':
      return `(${a.print()} * ${b.print()})`;
    case 'div':
      return `(${a.print()} / ${b.print()})`;
    case 'plus':
      return `(${a.print()} + ${b.print()})`;
    case 'sqrt':
      return `(sqrt ${a.print()})`;
    case 'square':
      return `(square ${a.print()})`;
    case 'negate':
      return `(- ${a.print()})`;
    case 'sin':
      return `(sin ${a.print()})`;
    case 'cos':
      return `(cos ${a.print()})`;
    case 'asin':
      return `(asin ${a.print()})`;
    case 'acos':
      return `(acos ${a.print()})`;
    default:
      throw new Error(`unexpected operator "${operator}"`);
  }
};

Expression.prototype.toString = function toString() {
  try {
    return this.print();
  } catch (err) {
    return err.message;
  }
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
  function deepCopyWithParamsAsPointers(paramList) {
    var n;
    if (this.operator === 'param') {
      // A param that is referenced by its hParam gets rewritten to go
      // straight in to the parameter table with a pointer, or simply
      // into a constant if it's already known.
      const p = this.param;
      if (p.known) {
        n = new Expression({
          operator: 'constant',
          value: p.val,
        });
      } else {
        n = new Expression({
          operator: 'param-pointer',
          param: p,
        });
      }
      return n;
    }

    n = this;
    const c = n.children();
    if (c > 0) {
      n.a = this.a.deepCopyWithParamsAsPointers(paramList);
    }
    if (c > 1) {
      n.b = this.b.deepCopyWithParamsAsPointers(paramList);
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

// my additions
Expression.prototype.getAllParams = function getAllParams() {
  var params = [];
  if (this.operator === 'param') {
    params.push(this.param);
  }
  if (this.a) {
    params = params.concat(this.a.getAllParams());
  }
  if (this.b) {
    params = params.concat(this.b.getAllParams());
  }
  return params;
};


module.exports = Expression;
