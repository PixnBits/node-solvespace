/**
 * definition from request.cpp:15
 * definition from request.cpp:23
 */
entityRequestMap = [
  {
    reqType: 'workplane',
    entType: 'workplane',
    points: 1,
    useExtraPoints: false,
    hasNormal: true,
    hasDistance: false
  },
  {
    reqType: 'datum-point',
    entType: null,
    points: 1,
    useExtraPoints: false,
    hasNormal: false,
    hasDistance: false
  },
  {
    reqType: 'line-segment',
    entType: 'line-segment',
    points: 2,
    useExtraPoints: false,
    hasNormal: false,
    hasDistance: false
  },
  {
    reqType: 'cubic',
    entType: 'cubic',
    points: 4,
    useExtraPoints: true,
    hasNormal: false,
    hasDistance: false
  },
  {
    reqType: 'cubic-periodic',
    entType: 'cubic-periodic',
    points: 3,
    useExtraPoints: true,
    hasNormal: false,
    hasDistance: false
  },
  {
    reqType: 'circle',
    entType: 'circle',
    points: 1,
    useExtraPoints: false,
    hasNormal: true,
    hasDistance: true
  },
  {
    reqType: 'arc-of-circle',
    entType: 'arc-of-circle',
    points: 3,
    useExtraPoints: false,
    hasNormal: true,
    hasDistance: false
  },
  {
    reqType: 'ttf-text',
    entType: 'ttf-text',
    points: 4,
    useExtraPoints: false,
    hasNormal: true,
    hasDistance: false
  },
];


/**
 * definition from sketch.h:542
 */
function EntityRequestTable() {}

/**
 * definition from sketch.h:544
 * implementation from request.cpp:49
 * @ param Request::Type req
 * @ param Number extraPoints
 * @ param EntityBase::Type *ent
 * @ param Number *pts
 * @ param Boolean *hasNormal
 * @ param Boolean *hasDistance
 * @ returns Boolean
 *
 * for JS:
 * @param String requestType
 * @returns Object { type, points, extraPoints, hasNormal, hasDistance }
 */
EntityRequestTable.getRequestInfo = function getRequestInfo(requestType) {
  const f = entityRequestMap.filter(({ reqType }) => reqType === requestType);
  if (!f.length) {
    throw new Error(`unrecognized request type ${requestType}`);
  }
  return Object.assign({}, f[0]);
};

/**
 * definition from sketch.h:546
 * implementation from request.cpp:61
 * @ param EntityBase::Type ent
 * @ param Number extraPoints
 * @ param Request::Type *req
 * @ param Number *pts
 * @ param Boolean *hasNormal
 * @ param Boolean *hasDistance
 * @ returns Boolean
 *
 * for JS:
 * @param String entityType
 * @returns Object { type, points, extraPoints, hasNormal, hasDistance }
 */
EntityRequestTable.getEntityInfo = function getEntityInfo(entityType) {
  const f = entityRequestMap.filter(({ entType }) => entType === entityType);
  if (!f.length) {
    throw new Error(`unrecognized entity type ${entityType}`);
  }
  return Object.assign({}, f[0]);
};

/**
 * definition from sketch.h:548
 * implementation from request.cpp:73
 * @param String ent
 * @returns String
 */
EntityRequestTable.getRequestForEntity = function getRequestForEntity(entityType) {
  const { reqType } = this.getRequestInfo(entityType);
  // original error message is
  // throw new Error('No entity for request');
  return reqType;
};

module.exports = EntityRequestTable;
