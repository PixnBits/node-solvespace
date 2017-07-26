/* eslint-disable no-bitwise */
const HRequest = require('./HRequest');
const HGroup = require('./HGroup');
const HEquation = require('./HEquation');

/**
 * definition from src/sketch.h:72
 * @member Number v (bits 15-0 entity index, 31-16 request index)
 */
function HEntity(v) {
  this.v = Number(v);
}

/**
 * definition from src/sketch:78
 * implementation from src/sketch:870
 * @returns Boolean
 */
HEntity.prototype.isFromRequest = function isFromRequest() {
  if (this.v & 0x80000000) {
    return false;
  }
  return true;
};

/**
 * definition from src/sketch:79
 * implementation from src/sketch:872
 * @returns hRequest
 */
HEntity.prototype.request = function request() {
  return new HRequest(this.v >> 16);
};

/**
 * definition from src/sketch:80
 * implementation from src/sketch:874
 * @returns hGroup
 */
HEntity.prototype.group = function group() {
  return new HGroup((this.v >> 16) & 0x3fff);
};

/**
 * definition from src/sketch:81
 * implementation from src/sketch:876
 * @param Number i
 * @returns hEquation
 */
HEntity.prototype.equation = function equation(i) {
  return new HEquation(this.v | 0x40000000 | i);
};

module.exports = HEntity;
