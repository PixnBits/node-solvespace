// FIXME: NO_PARAM
// src/sketch.h:563
// static const hParam NO_PARAM
// src/group.cpp:11-12
// const hParam   Param::NO_PARAM = { 0 };
// #define NO_PARAM (Param::NO_PARAM)

const isNumber = require('is-number');

const HParam = require('./HParam');

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

  // accept both hParam and h, with preference for the former
  if ('h' in opts) {
    this.h = opts.h;
  }
  if ('hParam' in opts) {
    this.h = opts.hParam;
  }
  if (!(this.h instanceof HParam)) {
    this.h = new HParam();
  }

  if (isNumber(opts.val) || isNumber(opts.value)) {
    this.val = opts.val;
  }

  if (typeof opts.known === 'boolean') {
    this.known = opts.known;
  }

  if (typeof opts.free === 'boolean') {
    this.free = opts.free;
  }

  // Used only in the solver
  this.substd = new HParam(opts.substd);
}

/**
 * definition from src/sketch.h:565
 */
Param.prototype.clear = function clear() {
  // noop, no implementation
};

module.exports = Param;
