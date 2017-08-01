/**
 * Sketch is `SK` in solvespace and seems to have a single instance
 * which is globaly available
 */
const IdList = require('./utils/IdList');
const System = require('./System');
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
  this.groups = this.group;
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

  this.system = new System();
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
 * definition from solvespace.h:606
 * implementation from solvespace.h:606
 * @param hParam h
 * @return Param
 */
Sketch.prototype.getParam = function getParam(h) {
  return this.params.findById(h);
};

/**
 * definition from solvespace.h:607
 * implementation from solvespace.h:607
 * @param hRequest h
 * @return Request
 */
Sketch.prototype.getRequest = function getRequest(h) {
  return this.requests.findById(h);
};

/**
 * definition from solvespace.h:608
 * implementation from solvespace.h:608
 * @param hGroup h
 * @return Group
 */
Sketch.prototype.getGroup = function getGroup(h) {
  return this.groups.findById(h);
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

/********* port code additions ********/

/**
 * taken from generate.cpp:506
 * originally for SolveSpaceUI::WriteEqSystemForGroup
 *
 * @param HGroup hg
 */
Sketch.prototype.writeEqSystemForGroup = function writeEqSystemForGroup(hg) {
  const { system } = this;

  // Clear out the system to be solved.
  system.entity.clear();
  system.param.clear();
  system.eq.clear();

  // And generate all the params for requests in this group
  for (let i = 0; i < this.request.n; i++) {
    const r = this.request.elem[i];
    if(r.group.v !== hg.v) {
      continue;
    }

    r.generate(system.entity, system.param);
  }

  for (let i = 0; i < this.constraint.n; i++) {
    const c = this.constraint.elem[i];
    if (c.group.v !== hg.v) {
      continue;
    }

    c.generate(system.param);
  }

  // And for the group itself
  const g = this.getGroup(hg);
  g.generate(this, system.entity, system.param);
  // Set the initial guesses for all the params
  for (let i = 0; i < system.param.n; i++) {
    const p = system.param.elem[i];
    p.known = false;
    p.val = this.getParam(p.h).val;
  }

  // MarkDraggedParams();
};

/**
 * taken from generate.cpp:538
 * originally for SolveSpaceUI::SolveGroup
 *
 * @param HGroup hg
 * @param Boolean andFindFree
 */
Sketch.prototype.solveGroup = function solveGroup(hg, andFindFree) {
  this.writeEqSystemForGroup(hg);

  const g = this.getGroup(hg);
  // g.solved.remove.clear();
  g.solved.remove.splice(0, g.solved.remove.length);
  const how = this.system.solve(
    this,
    g,
    g.solved.dof,
    g.solved.remove,
    /*andFindBad=*/true,
    /*andFindFree=*/andFindFree,
    /*forceDofCheck=*/!g.dofCheckOk
  );
  g.solved.dof = this.system.calculateDof();

  if (how === 'okay') {
    g.dofCheckOk = true;
  }
  g.solved.how = how;

  // FreeAllTemporary();
};
