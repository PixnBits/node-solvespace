/* eslint-disable no-bitwise */
const HEntity = require('./HEntity');
const HParam = require('./HParam');

/**
 * definition from src/sketch.h:62
 * @member Number v
 */
function HRequest(v) {
  this.v = Number(v);
}

/**
 * definition from src/sketch.h:67
 * implementation from src/sketch:865
 * @param Number i
 * @returns hEntity
 */
HRequest.prototype.entity = function entity(i) {
  if (this.v !== 0 && !this.v) {
    throw new Error('no handle value assigned yet');
  }

  return new HEntity((this.v << 16) | i);
};

/**
 * definition from src/sketch.h:68
 * implementation from src/sketch:
 * @param Number i
 * @returns hParam
 */
HRequest.prototype.param = function param(i) {
  if (this.v !== 0 && !this.v) {
    throw new Error('no handle value assigned yet');
  }

  return new HParam((this.v << 16) | i);
};

/**
 * definition from src/sketch.h:70
 * implementation from src/sketch:859
 * @returns Boolean
 */
HRequest.prototype.isFromReferences = function isFromReferences() {
  throw new Error('unimplemented');
  // if(v == Request::HREQUEST_REFERENCE_XY.v) return true;
  // if(v == Request::HREQUEST_REFERENCE_YZ.v) return true;
  // if(v == Request::HREQUEST_REFERENCE_ZX.v) return true;
  // return false;
};

module.exports = HRequest;
