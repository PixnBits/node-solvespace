const isNumber = require('is-number');

const Expression = require('./Expression');

/**
 * definition from sketch.h:734
 * @member Number tag
 * @member hEquation h
 * @member Expr e
 */
function Equation(arg0) {
  if (!(this instanceof Equation)) {
    return new Equation(arg0);
  }

  const opts = arg0 || {};

  this.tag = isNumber(opts.tag) ? opts.tag : undefined;
  const expression = opts.expression || opts;
  this.expression = expression instanceof Expression ? expression : null;

  if (!this.expression) {
    throw new Error('Equation constructor requires an Expression');
  }
}

module.exports = Equation;
