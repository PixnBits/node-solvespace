// A set of requests. Every request must have an associated group.
// Implementation of the Group class, which represents a set of entities and
// constraints that are solved together, in some cases followed by another
// operation, like to extrude surfaces from the entities or to step and
// repeat them parametrically.

const Expression = require('./Expression');
const ExpressionVector = require('./ExpressionVector');
const ExpressionQuaternion = require('./ExpressionQuaternion');
const Entity = require('./Entity');

// const debug = require('debug')('solvespace:Group');

/**
 * definition from sketch.h:114
 * implementation from group.cpp:2
 * @member Number tag
 * @member hGroup h
 * @member String type (DRAWING_3D, DRAWING_WORKPLANE, EXTRUDE, LATHE, ROTATE, TRANSLATE, LINKED)
 * @member Number order
 * @member hGroup opA
 * @member hGroup opB
 * @member Boolean visible
 * @member Boolean suppress
 * @member Boolean relaxConstraints
 * @member Boolean allowRedundant
 * @member Boolean allDimsReference
 * @member Number scale
 * @member Boolean clean
 * @member Boolean dofCheckOk
 * @member hEntity activeWorkplane
 * @member Number valA
 * @member Number valB
 * @member Number valC
 * @member RgbaColor color
 *
 * @member Object solved
 * @member SolveResult solved.how
 * @member Number solved.dof
 * @member Array<hConstraint> solved.remove
 *
 * @member String subtype (
 *   WORKPLANE_BY_POINT_ORTHO
 *   WORKPLANE_BY_LINE_SEGMENTS
 *   ONE_SIDED
 *   TWO_SIDED)
 * @member Boolean skipFirst

 * @member Object predef
 * @member Quaternion predef.q
 * @member hEntity predef.origin
 * @member hEntity predef.entityB
 * @member hEntity predef.entityC
 * @member Boolean predef.swapUV
 * @member Boolean predef.negateU
 * @member Boolean predef.negateV

 * @member SPolygon polyLoops
 * @member SBezierLoopSetSet bezierLoops
 * @member SBezierList bezierOpens

 * @member Object polyError
 * @member PolyError polyError.how
 * @member SEdge polyError.notClosedAt
 * @member Vector polyError.errorPointAt

 * @member Boolean booleanFailed
 * @member SShell thisShell
 * @member SShell runningShell
 * @member SMesh thisMesh
 * @member SMesh runningMesh
 * @member Boolean displayDirty
 * @member SMesh displayMesh
 * @member SOutlineList displayOutlines
 * @member String meshCombine ('UNION', 'DIFFERENCE', 'ASSEMBLE')
 * @member Boolean forceToMesh
 * @member IdList<EntityMap, EntityId> remap
 * @member Number remapCache[REMAP_PRIME = 19477]
 * @member String linkFile
 * @member String linkFileRel
 * @member SMesh impMesh
 * @member SShell impShell
 * @member EntityList impEntity
 * @member String name
 */
function Group() {
}

/**
 * definition from sketch.h:223
 */
Group.prototype.activate = function activate() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:224
 * @returns String
 */
Group.prototype.descriptionString = function descriptionString() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:225
 * implementation from group.cpp:20
 */
Group.prototype.clear = function clear() {
  // C requires manual memory management
  // TODO: not sure this method is needed in this JS port
  this.polyLoops.clear();
  this.bezierLoops.clear();
  this.bezierOpens.clear();
  this.thisMesh.clear();
  this.runningMesh.clear();
  this.thisShell.clear();
  this.runningShell.clear();
  this.displayMesh.clear();
  this.displayOutlines.clear();
  this.impMesh.clear();
  this.impShell.clear();
  this.impEntity.clear();
  // remap is the only one that doesn't get recreated when we regen
  this.remap.clear();
};

/**
 * definition from sketch.h:227
 */
Group.addParam = function addParam() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:228
 * @param EntityList entity
 * @param ParamList param
 */
Group.prototype.generate = function generate() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:229
 * @returns Boolean
 */
Group.prototype.isSolvedOkay = function isSolvedOkay() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:230
 * @param Vector t
 * @param Quaternion q
 */
Group.prototype.transformImportedBy = function transformImportedBy() {
  throw new Error('unimplemented');
};

/**
 * When a request generates entities from entities, and the source
 * entities may have come from multiple requests, it's necessary to
 * remap the entity ID so that it's still unique. We do this with a
 * mapping list.
 *
 * definition from sketch.h:246
 * @param hEntity in
 * @param String copyNumber (
 *   REMAP_LAST
 *   REMAP_TOP
 *   REMAP_BOTTOM
 *   REMAP_PT_TO_LINE
 *   REMAP_LINE_TO_FACE
 *   REMAP_LATHE_START
 *   REMAP_LATHE_END
 *   REMAP_PT_TO_ARC
 *   REMAP_PT_TO_NORMAL)
 */
Group.prototype.remap = function remap() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:247
 * @param EntityList el
 * @param hEntity in
 */
Group.prototype.makeExtrusionLines = function makeExtrusionLines() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:248
 * @param IdList<Entity, hEntity> el
 * @param IdList<Param, hParam> param
 * @param hEntity in
 * @param Vector pt
 * @param Vector axis
 * @param Number ai
 */
Group.prototype.makeLatheCircles = function makeLatheCircles() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:249
 * @param EntityList el
 * @param hEntity pt
 */
Group.prototype.makeExtrusionTopBottomFaces = function makeExtrusionTopBottomFaces() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:250
 * @param EntityList el
 * @param Entity ep
 * @param Number timesApplied
 * @param Number remap
 * @param hParam dx
 * @param hParam dy
 * @param hParam dz
 * @param hParam qw
 * @param hParam qvx
 * @param hParam qvy
 * @param hParam qvz
 * @param Boolean asTrans
 * @param Boolean asAxisAngle
 */
Group.prototype.copyEntity = function copyEntity() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:256
 * @param IdList<Equation, hEquation> l
 * @param Expression expr
 * @param Number index
 */
Group.prototype.addEq = function addEq() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:257
 * implementation from src/group.cpp:595
 * @param IdList<Equation, hEquation> l
 */
Group.prototype.generateEquations = function generateEquations(l) {
  if (this.type === 'linked') {
    // Normalize the quaternion
    const q = new ExpressionQuaternion(
      new Expression(this.h.param(3)),
      new Expression(this.h.param(4)),
      new Expression(this.h.param(5)),
      new Expression(this.h.param(6))
    );
    this.addEq(l, q.magnitude().minus(new Expression(1)), 0);
  } else if (this.type === 'rotate') {
    // The axis and center of rotation are specified numerically
    const orig = this.sketch.getEntity(this.predef.origin).pointGetExprs();
    this.addEq(l, orig.x.minus(new Expression(this.h.param(0))), 0);
    this.addEq(l, orig.y.minus(new Expression(this.h.param(1))), 0);
    this.addEq(l, orig.z.minus(new Expression(this.h.param(2))), 0);
    // param 3 is the angle, which is free
    const axis = this.sketch
      .getEntity(this.predef.entityB)
      .vectorGetNum()
      .withMagnitude(1);
    this.addEq(l, new Expression(axis.x).minus(new Expression(this.h.param(4))), 3);
    this.addEq(l, new Expression(axis.y).minus(new Expression(this.h.param(5))), 4);
    this.addEq(l, new Expression(axis.z).minus(new Expression(this.h.param(6))), 5);
  } else if (this.type === 'extrude') {
    if (this.predef.entityB.v !== Entity.FREE_IN_3D.v) {
      // The extrusion path is locked along a line, normal to the
      // specified workplane.
      const w = this.sketch.getEntity(this.predev.entityB);
      const u = w.normal().normalExpresU();
      const v = w.normal().normalExpresV();
      const extruden = new ExpressionVector(
        new Expression(this.h.param(0)),
        new Expression(this.h.param(1)),
        new Expression(this.h.param(2))
      );
      this.addEq(l, u.dot(extruden), 0);
      this.addEq(l, v.dot(extruden), 1);
    }
  } else if (this.type === 'translate') {
    if (this.predef.entityB.v !== Entity.FREE_IN_3D.v) {
      const w = this.sketch.getEntity(this.predef.entityB);
      const n = w.normal().normalExpresN();
      const trans = new ExpressionVector(
        this.h.param(0),
        this.h.param(1),
        this.h.param(2)
      );

      // The translation vector is parallel to the workplane
      this.addEq(l, trans.dot(n), 0);
    }
  }
};

/**
 * definition from sketch.h:258
 */
Group.prototype.isVisible = function isVisible() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:259
 * @ returns Number
 */
Group.prototype.getNumConstraints = function getNumConstraints() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:260
 * @returns Vector
 */
Group.prototype.extrusionGetVector = function extrusionGetVector() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:261
 * @param Vector v
 */
Group.prototype.extrusionForceVectorTo = function extrusionForceVectorTo() {
  throw new Error('unimplemented');
};

// Assembling the curves into loops, and into a piecewise linear polygon
// at the same time.
/**
 * definition from sketch.h:265
 * @param Boolean allClosed
 * @param Boolean allCoplanar
 * @param Boolean allNonZeroLen
 */
Group.prototype.assembleLoops = function assembleLoops() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:266
 */
Group.prototype.generateLoops = function generateLoops() {
  throw new Error('unimplemented');
};

// And the mesh stuff

/**
 * definition from sketch.h:268
 * @returns Group
 */
Group.prototype.previousGroup = function previousGroup() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:269
 * @returns Group
 */
Group.prototype.runningMechGroup = function runningMechGroup() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:270
 * @returns Boolean
 */
Group.prototype.isMeshGroup = function isMeshGroup() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:272
 */
Group.prototype.generateShellAndMesh = function generateShellAndMesh() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:273
 * @param T steps
 * @param T outs
 * @param String  forWhat (UNION, DIFFERENCE, ASSEMBLE)
 * @returns template<class T> ???
 */
Group.prototype.generateForStepAndRepeat = function generateForStepAndRepeat() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:274
 * @param T a
 * @param T b
 * @param T o
 * @param String  forWhat (UNION, DIFFERENCE, ASSEMBLE)
 * @returns template<class T> ???
 */
Group.prototype.generateForBoolean = function generateForBoolean() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:275
 */
Group.prototype.generateDisplayItems = function generateDisplayItems() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:278
 * @param String how (DEFAULT, HOVERED, SELECTED)
 * @param Canvas canvas
 */
Group.prototype.drawMesh = function drawMesh() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:279
 * @param Canvas canvas
 */
Group.prototype.draw = function draw() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:280
 * @param Canvas canvas
 */
Group.prototype.drawPolyError = function drawPolyError() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:281
 * @param Canvas canvas
 */
Group.prototype.drawFilledPaths = function drawFilledPaths() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:283
 * @returns SPolygon
 */
Group.prototype.getPolygon = function getPolygon() {
  throw new Error('unimplemented');
};

/**
 * definition from sketch.h:285
 * @param Command id
 */
Group.menuGroup = function menuGroup() {
  throw new Error('unimplemented');
};

module.exports = Group;
