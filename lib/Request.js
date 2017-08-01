// A user request for some primitive or derived operation; for example a
// line, or a step and repeat.
const isNumber = require('is-number');

const Param = require('./Param');
const Entity = require('./Entity');
const EntityRequestTable = require('./EntityRequestTable');
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
Request.prototype.generate = function generate(entity, param) {
  // Request-specific generation.
  switch (this.type) {
    case 'ttf-text':
      // TODO: see original code for what to implement
      throw new Error('generate ttf-text unimplemented');
    default: // most requests don't do anything else
      break;
  }

  const reqInfo = EntityRequestTable.getRequestInfo(this.type);
  this.extraPoints = reqInfo.extraPoints;
  const { points, hasNormal, hasDistance } = reqInfo;
  // Generate the entity that's specific to this request.
  const e = new Entity({
    type: reqInfo.entType,
    extraPoints: reqInfo.extraPoints,
    group: this.group,
    style: this.style,
    workplane: this.workplane,
    construction: this.construction,
    str: this.str,
    font: this.font,
    aspectRatio: this.aspectRatio,
    h: this.h,
  });

  // And generate entities for the points
  for (let i = 0; i < points; i += 1) {
    const p = new Entity({
      workplane: this.workplane,
      // points start from entity 1, except for datum point case
      // h: this.h.entity(i + ((e.type != (Entity::Type)0) ? 1 : 0)),
      h: this.h.entity(i + (e.type ? 1 : 0)),
      group: this.group,
      style: this.style,
      // mark arc center point as construction, since it shouldn't be included
      // in bounding box calculation
      construction: (this.type === 'arc-of-circle') && (i === 0)
    });

    if (this.workplane.v == Entity.FREE_IN_3D.v) {
      p.type = 'point-in-3d';
      // params for x y z
      p.param[0] = Request.addParam(param, this.h.param(16 + 3*i + 0));
      p.param[1] = Request.addParam(param, this.h.param(16 + 3*i + 1));
      p.param[2] = Request.addParam(param, this.h.param(16 + 3*i + 2));
    } else {
      p.type = 'point-in-2d';
      // params for u v
      p.param[0] = Request.addParam(param, this.h.param(16 + 3*i + 0));
      p.param[1] = Request.addParam(param, this.h.param(16 + 3*i + 1));
    }

    console.log('p.h', p.h, this.h, e.type);
    entity.add(p);
    e.point[i] = p.h;
  }

  if (hasNormal) {
    const n = new Entity({
      workplane: this.workplane,
      h: this.h.entity(32),
      group: this.group,
      style: this.style,
    });

    if(this.workplane.v == Entity.FREE_IN_3D.v) {
      n.type = 'normal-in-3d';
      n.param[0] = Request.addParam(param, this.h.param(32+0));
      n.param[1] = Request.addParam(param, this.h.param(32+1));
      n.param[2] = Request.addParam(param, this.h.param(32+2));
      n.param[3] = Request.addParam(param, this.h.param(32+3));
    } else {
      n.type = 'normal-in-2d';
      // and this is just a copy of the workplane quaternion,
      // so no params required
    }

    if (points < 1) {
      throw new Error('Positioning a normal requires a point');
    }

    // The point determines where the normal gets displayed on-screen;
    // it's entirely cosmetic.
    n.point[0] = e.point[0];
    entity.add(n);
    e.normal = n.h;
  }

  if(hasDistance) {
    const d = new Entity({
      workplane: this.workplane,
      h: this.h.entity(64),
      group: this.group,
      style: this.style,
      type: 'distance',
      param: [
        Request.addParam(param, this.h.param(64)),
      ],
    });
    entity.add(d);
    e.distance = d.h;
  }

  if(e.type) {
    entity.add(e);
  }
};

/**
 * definition from src/sketch.h:328
 * implementation from src/request.cpp:192
 * @returns String
 */
Request.prototype.descriptionString = function descriptionString() {
  var s;
  if (this.h.v === Request.HREQUEST_REFERENCE_XY.v) {
    s = '#XY';
  } else if(this.h.v === Request.HREQUEST_REFERENCE_YZ.v) {
    s = '#YZ';
  } else if(this.h.v === Request.HREQUEST_REFERENCE_ZX.v) {
    s = '#ZX';
  } else {
    switch(this.type) {
      case 'workplane':
      case 'datum-point':
      case 'line-segment':
      case 'cubic':
      case 'cubic-periodic':
      case 'circle':
      case 'arc-of-circle':
      case 'ttf-text':
        s = this.type;
        break;
      default:
        break;
    }
  }

  if (!s) {
    throw new Error(`Unexpected request type ${this.type}`);
  }
  return `r${this.h.v.toString(16)}-${s}`;
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

Request.HREQUEST_REFERENCE_XY = new HRequest(1);
Request.HREQUEST_REFERENCE_YZ = new HRequest(2);
Request.HREQUEST_REFERENCE_ZX = new HRequest(3);

module.exports = Request;
