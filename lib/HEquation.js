/* eslint-disable no-bitwise */
const HConstraint = require('./HConstraint');

/**
 * definition from src/sketch.h:726
 * @member Number v
 */
function HEquation(v) {
  this.v = Number(v);
}

/**
 * definition from src/sketch:730
 * implementation from src/sketch:888
 * @returns Boolean
 */
HEquation.prototype.isFromConstraint = function isFromConstraint() {
  if (this.v & 0xc0000000) {
    return false;
  }
  return true;
};

/**
 * definition from src/sketch:731
 * implementation from src/sketch:890
 * @returns HConstraint
 */
HEquation.prototype.constraint = function constraint() {
  return new HConstraint(this.v >> 16);
};

module.exports = HEquation;
