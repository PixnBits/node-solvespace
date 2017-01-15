const isNumber = require('is-number');

const ExpressionParser = require('./ExpressionParser');

function Expression(arg) {
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

Expression.prototype.eval = function evaluate() {
  const { operator, value, a, b } = this;
  switch (operator) {
    case 'parameter':
      // return SK.GetParam(parh)->val;
      throw new Error('unimplemented');
    case 'parameter-pointer':
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

// FIXME: test these methods
Expression.prototype.anyOp = function anyOp(newOp, b) {
  const r = new Expression({ operator: newOp });
  r.a = this;
  r.b = b;
  return r;
};

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
    Expression.prototype[n] = function () {
      return this.anyOp(n);
    };
  });

Expression.is = function isExpression(v) {
  return v instanceof Expression;
};

module.exports = Expression;
