/* eslint-disable no-bitwise */
const HEquation = require('./HEquation');
const HParam = require('./HParam');

/**
 * definition from src/sketch.h:569
 * @member Number v
 */
function HConstraint(v) {
  this.v = Number(v);
}

/**
 * definition from src/sketch:573
 * implementation from src/sketch:883
 * @param Number i
 * @returns HEquation
 */
HConstraint.prototype.equation = function equation(i) {
  return new HEquation((this.v << 16) | i);
};

/**
 * definition from src/sketch:574
 * implementation from src/sketch:885
 * @param Number i
 * @returns HParam
 */
HConstraint.prototype.param = function param(i) {
  return new HParam(this.v | 0x40000000 | i);
};

module.exports = HConstraint;
