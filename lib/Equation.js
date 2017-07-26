const isNumber = require('is-number');

const Expression = require('./Expression');

const HEquation = require('./HEquation');

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
  this.h = opts.h instanceof HEquation ? opts.h : new HEquation();
  const expression = opts.expression || opts.e || opts;
  this.e = expression instanceof Expression ? expression : null;

  if (!this.e) {
    throw new Error('Equation constructor requires an Expression');
  }

  // more explicit names
  this.handle = this.h;
  this.expression = this.e;
}

/**
 * definition from sketch.h:741
 */
Equation.prototype.clear = function clear() {
  // noop, no implementation
};

module.exports = Equation;
