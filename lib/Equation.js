const isNumber = require('is-number');

const Expression = require('./Expression');

/**
 * definition from sketch.h:734
 */
function Equation(opts) {
  if (!(this instanceof Equation)) {
    return new Equation(opts);
  }

  if (!opts) {
    throw new Error('Equation requires opts');
  }

  this.tag = opts.tag; // int
  // this.h = opts.hEquation; // ???? sketch.h:737, 726-732
  this.e = this.expression = opts.expression;

  if (!isNumber(this.tag)) {
    throw new Error('Equation opts tag must be a Number');
  }

  if (!(this.expression instanceof Expression)) {
    throw new Error('Equation opts express must be an Expression');
  }
}

/**
 * definition from sketch.h:741
 * @returns undefined
 */
Equation.prototype.clear = function clear() {
  throw new Error('unimplemented');
};

module.exports = Equation;
