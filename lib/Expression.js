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
  if (arg instanceof Expression) {
    this.operator = arg.operator;
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

    return this;
  }

  /*
   * definition from src/expr.h:54
   * implementation from src/expr.cpp:
   * implementation from src/expr.cpp:214
   */
  if (arg instanceof HParam) {
    this.operator = 'param';
    this.parh = arg;
    return this;
  }

  if (typeof arg === 'number' && isNumber(arg)) {
    this.operator = 'constant';
    this.value = arg;
    return this;
  }

  if (arg && typeof arg.operator === 'string') {
    this.operator = arg.operator;
    if (isNumber(arg.value)) {
      this.value = arg.value;
    }
    return this;
  }

  if (typeof arg === 'string') {
    return (new ExpressionParser(arg)).parse();
  }

  if (arg === null) {
    // TODO: ensure this is accurate
    // we're just a holding spot, for storage
    return this;
  }

  // TODO: understand hParam, implement as Parameter
  // if (arg instanceof Parameter) {
  //   this.operator = 'parameter';
  //   this.parameter = arg;
  // }

  throw new Error(`Expression creator: unhandled input "${arg}"`);
}

/**
 * definition from src/expr.h:57
 * implementation from src/expr.cpp:257
 * @param String newOp
 * @param Expression b
 * @returns Expression
 */
Expression.prototype.anyOp = function anyOp(newOp, b) {
  const r = new Expression({ operator: newOp });
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
      throw new Error('unimplemented');
    case 'param-pointer':
      throw new Error('unimplemented');
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
 * implementation from src/expr.cpp:
 * @returns Number
 */
Expression.prototype.paramsUsed = function paramsUsed() {
  throw new Error('unimplemented');
};

/**
 * definition from src/expr.h:74
 * implementation from src/expr.cpp:
 * @param hParam p
 * @returns Boolean
 */
Expression.prototype.dependsOn = function dependsOn() {
  throw new Error('unimplemented');
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
 * implementation from src/expr.cpp:
 * @returns Expr
 */
Expression.prototype.foldConstants = function foldConstants() {
  throw new Error('unimplemented');
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
// Expression.NO_PARAMS =
/**
 * definition from src/expr.h:79
 * implementation from src/expr.cpp:511
*/
// Expression.MULTIPLE_PARAMS =

/**
 * definition from src/expr.h:80
 * implementation from src/expr.cpp:
 * @param ParamList pl
 * @returns hParam
 */
Expression.prototype.referencedParams = function referencedParams() {
  throw new Error('unimplemented');
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
      throw new Error(`Unexpected operation (${this.operator})`);
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
 * implementation from src/expr.cpp:
 * @param IdList<Param,hParam> firstTry
 * @param IdList<Param,hParam> thenTry
 * @returns Expr
 */
Expression.prototype.deepCopyWithParamsAsPointers = function deepCopyWithParamsAsPointers() {
  throw new Error('unimplemented');
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
