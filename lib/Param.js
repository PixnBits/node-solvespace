// FIXME: NO_PARAM
// src/sketch.h:563
// static const hParam NO_PARAM
// src/group.cpp:11-12
// const hParam   Param::NO_PARAM = { 0 };
// #define NO_PARAM (Param::NO_PARAM)

const isNumber = require('is-number');

/**
 * definition from src/sketch.h:551
 * @member Number tag
 * @member hParam h
 * @member Number val
 * @member Boolean known
 * @member Boolean free
 * @member hParam substd (Used only in the solver)
 */
function Param(arg0) {
  const opts = arg0 || {};
  if (!(this instanceof Param)) {
    return new Param(arg0);
  }

  if (isNumber(opts.tag)) {
    this.tag = opts.tag;
  }

  if (isNumber(opts.val)) {
    this.value = opts.val;
  }
  if (isNumber(opts.value)) {
    this.value = opts.value;
  }

  if (opts.substd instanceof Param) {
    this.substd = opts.substd;
  }

  if (typeof opts.known === 'boolean') {
    this.known = opts.known;
  }

  if (typeof opts.free === 'boolean') {
    this.free = opts.free;
  }
}

module.exports = Param;
