/**
 * Sketch is `SK` in solvespace and seems to have a single instance
 * which is globaly available
 */
const IdList = require('./utils/IdList');
const BBox = require('./BBox');
const Group = require('./Group');
const HGroup = require('./HGroup');
const Constraint = require('./Constraint');
const HConstraint = require('./HConstraint');
const Request = require('./Request');
const HRequest = require('./HRequest');
const Style = require('./Style');
const HStyle = require('./HStyle');
const Entity = require('./Entity');
const HEntity = require('./HEntity');
const Param = require('./Param');
const HParam = require('./HParam');

/**
 * definition from solvespace.h:590
 */
function Sketch() {
  // These are user-editable, and define the sketch.
  //
  // Solvespace uses the singular, I anticipate plural is more appropriate
  // add both to reference the same data in case I slip up
  this.group = new IdList(Group, HGroup);
  this.groupOrder = [];

  this.constraint = new IdList(Constraint, HConstraint);
  this.constraints = this.constraint;

  this.request = new IdList(Request, HRequest);
  this.requests = this.request;

  this.style = new IdList(Style, HStyle);
  this.styles = this.style;

  // These are generated from the above.
  this.entity = new IdList(Entity, HEntity);
  this.entities = this.entity;

  this.param = new IdList(Param, HParam);
  this.params = this.param;
}

/**
 * definition from solvespace.h:603
 * implementation from solvespace.h:603
 * @param hConstraint
 * @return Constraint
 */
Sketch.prototype.getConstraint = function getConstraint(h) {
  return this.constraints.findById(h);
};

/**
 * definition from solvespace.h:605
 * implementation from solvespace.h:605
 * @param hEntity h
 * @return Entity
 */
Sketch.prototype.getEntity = function getEntity(h) {
  return this.entities.findById(h);
};

/**
 * definition from solvespace.h:611
 * implementation from solvespace.cpp:874
 * @return void
 */
Sketch.prototype.clear = function clear() {
  this.group.clear();
  this.groupOrder = [];
  this.constraints.clear();
  this.requests.clear();
  this.styles.clear();
  this.entities.clear();
  this.params.clear();
};

/**
 * definition from solvespace.h:613
 * implementation from solvespace.cpp:884
 * @param Boolean includingInvisible
 * @return BBox
 */
Sketch.prototype.calculateEntityBBox = function calculateEntityBBox(includingInvisible) {
  const sketch = this;
  var box;
  var first = true;

  // @param Vector point
  function includePoint(point) {
    if (first) {
      box = new BBox(point, point);
      first = false;
    } else {
      box.include(point);
    }
  }

  sketch.entities.forEach((entity) => {
    if (entity.construction) {
      return;
    }

    if (!(includingInvisible || entity.isVisible())) {
      return;
    }

    if (entity.isPoint()) {
      includePoint(entity.pointGetNum());
      return;
    }

    switch (entity.type) {
      // Circles and arcs are special cases. We calculate their bounds
      // based on Bezier curve bounds. This is not exact for arcs,
      // but the implementation is rather simple.
      case 'circle':
        /* intended fall through to 'arc-of-circle' */
      case 'arc-of-circle':
        entity
          .generateBezierCurves()
          .forEach(sb => sb.ctrl.forEach(includePoint))
          .clear();
        break;

      default:
        console.warn(`unknown entity type in Sketch.calculateEntityBBox: "${entity.type}"`);
        break;
    }
  });

  return box;
};

/**
 * definition from solvespace.h:614
 * implementation from solvespace.cpp:933
 * @param hGroup h
 * @return Group
 */
Sketch.prototype.getRunningMeshGroupFor = function getRunningMeshGroupFor(h) {
  var g = this.getGroup(h);
  while (g) {
    if (g.isMeshGroup()) {
      return g;
    }
    g = g.previousGroup();
  }

  return null;
};

module.exports = Sketch;
