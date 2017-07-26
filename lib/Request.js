// A user request for some primitive or derived operation; for example a
// line, or a step and repeat.
const isNumber = require('is-number');

const Param = require('./Param');
const HRequest = require('./HRequest');
const HEntity = require('./HEntity');
const HGroup = require('./HGroup');
const HStyle = require('./HStyle');

// TODO src/sketch.h:293-295 define some predefined requests
// FIXME export these?

/**
 * definition from src/sketch.h:288
 * @member Number tag
 * @member hRequest h
 * @member String type (
 *   WORKPLANE
 *   DATUM_POINT
 *   LINE_SEGMENT
 *   CUBIC
 *   CUBIC_PERIODIC
 *   CIRCLE
 *   ARC_OF_CIRCLE
 *   TTF_TEXT)
 * @member Number extraPoints
 * @member hEntity workplane
 * @member hGroup group
 * @member hStyle style
 * @member Boolean construction
 * @member String str (???)
 * @member String font
 * @member Number aspectRatio
 */
function Request(arg0) {
  const opts = arg0 || {};
  // my guesstimates
  this.tag = isNumber(opts.tag) ? opts.tag : undefined;
  this.h = opts.h instanceof HRequest ? opts.h : new HRequest();
  this.type = typeof opts.type === 'string' ? opts.type : 'datum-point';
  this.extraPoints = isNumber(opts.extraPoints) ? opts.extraPoints : 0;
  this.workplane = opts.workplane instanceof HEntity ? opts.workplane : new HEntity();
  this.group = opts.group instanceof HGroup ? opts.group : new HGroup();
  this.style = opts.style instanceof HStyle ? opts.style : new HStyle();
  this.construction = Boolean(opts.construction);
  this.str = opts.str instanceof String ? opts.str : 'str???';
  this.font = opts.font instanceof String ? opts.font : 'Arial';
  this.aspectRatio = isNumber(opts.aspectRatio) ? opts.aspectRatio : 1;
}

/**
 * definition from src/sketch.h:325
 * implementation from src/request.cpp:228
 * @param ParamList param
 * @param hParam hp
 * @returns hParam
 */
Request.addParam = function addParam(param, hp) {
  param.add(new Param({ h: hp }));
  return hp;
};

/**
 * definition from src/sketch.h:326
 * implementation from src/request.cpp:80
 * @param EntityList entity
 * @param ParamList param
 */
Request.prototype.generate = function generate() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:328
 * implementation from src/request.cpp:192
 * @returns String
 */
Request.prototype.descriptionString = function descriptionString() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:329
 * implementation from src/request.cpp:216
 * @param hEntity he
 * @returns Number
 */
Request.prototype.indexOfPoint = function indexOfPoint() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:331
 */
Request.prototype.clear = function clear() {
  // noop, not defined anywhere
};

module.exports = Request;
