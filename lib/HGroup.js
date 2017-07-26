/* eslint-disable no-bitwise */
const HEntity = require('./HEntity');
const HParam = require('./HParam');
const HEquation = require('./HEquation');

/**
 * definition from src/sketch.h:53
 * @member Number v (bits 15-0 group index)
 */
function HGroup(v) {
  this.v = Number(v);
}

/**
 * definition from src/sketch:58
 * implementation from src/sketch.h:852
 * @param Number i
 * @returns hEntity
 */
HGroup.prototype.entity = function entity(i) {
  return new HEntity(0x80000000 | (this.v << 16) | i);
};

/**
 * definition from src/sketch:59
 * implementation from src/sketch.h:854
 * @param Number i
 * @returns hParam
 */
HGroup.prototype.param = function param(i) {
  return new HParam(0x80000000 | (this.v << 16) | i);
};

/**
 * definition from src/sketch:60
 * implementation from src/sketch.h:856
 * @param Number i
 * @returns hEquation
 */
HGroup.prototype.equation = function equation(i) {
  return new HEquation((this.v << 16) | 0x80000000 | i);
};

module.exports = HGroup;
