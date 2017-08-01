/* eslint-disable no-bitwise */
// dep loop
// const HRequest = require('./HRequest');
var HRequest;

/**
 * definition from src/sketch.h:83
 * @member Number v (bits 15-0 param index, 31-16 request index)
 */
function HParam(v) {
  if (!(this instanceof HParam)) {
    return new HParam(v);
  }

  if (v instanceof HParam) {
    return v;
  }

  this.v = Number(v);
}

/**
 * definition from src/sketch.h:89
 * implementation from src/sketch.h:879
 * @returns HRequest
 */
HParam.prototype.request = function request() {
  HRequest = HRequest || require('./HRequest');

  if (this.v !== 0 && !this.v) {
    throw new Error('no handle value assigned yet');
  }

  return new HRequest(this.v >> 16);
};

module.exports = HParam;
