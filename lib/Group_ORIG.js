// Implementation of the Group class, which represents a set of entities and
// constraints that are solved together, in some cases followed by another
// operation, like to extrude surfaces from the entities or to step and
// repeat them parametrically.

// const debug = require('debug')('solvespace:Group');

/**
 * definition from sketch.h:114
 * implementation from group.cpp:2
 * @param unknown
 * @member int tag
 * @member hGroup h (HGROUP_REFERENCES???)
 * @member Type type
 * @member int order
 *
 * @member hGroup opA
 * @member hGroup opB
 * @member Boolean visible
 * @member Boolean suppress
 * @member Boolean relaxConstraints
 * @member Boolean allowRedundant
 * @member Boolean allDimsReference
 * @member double scale
 *
 * @member Boolean clean
 * @member Boolean dofCheckOk
 * @member hEntity activeWorkplane
 * @member double valA
 * @member double valB
 * @member double valC
 * @member RgbaColor color
 *
 * (struct solved)
 *
 * (enum Subtype)
 *
 * @member Boolean skipFirst // for step and repeat ops
 * (struct predef)
 *
 * @member SPolygon polyLoops
 * @member SBezierLoopSetSet bezierLoops
 * @member SBezierList bezierOpens
 *
 * (struct polyError)
 *
 * @member Boolean booleanFailed
 *
 * @member SShell thisShell
 * @member SShell runningShell
 *
 * @member SMesh thisMesh
 * @member SMesh runningMesh
 *
 * @member Boolean displayDirty
 * @member SMesh displayMesh
 * @member SOutlineList displayOutlines
 * TODO: add the remaining (start at sketch.h:201)
 */
function Group({ tag, h, type, order }) {
  this.tag = tag;
  this.h = h;
  /*
    type is an enum:
    DRAWING_3D
    DRAWING_WORKPLANE
    EXTRUDE
    LATHE
    ROTATE
    TRANSLATE
    LINKED
  */
  this.type = type;
  this.order = order;
}

// function Group() {
//   throw new Error('unimplemented');
// }
//
// Group.prototype.clear = function clear() {
//   // hoping none of these were globals? :S
//   this.polyLoops.clear();
//   this.bezierLoops.clear();
//   this.bezierOpens.clear();
//   this.mesh.clear();
//   this.runningMesh.clear();
//   this.shell.clear();
//   this.runningShell.clear();
//   this.displayMesh.clear();
//   this.displayOutlines.clear();
//   this.impMesh.clear();
//   this.impShell.clear();
//   this.impEntity.clear();
//   this.remap.clear();
// };
//
// Group.prototype.addParam = function addParam(param) {
//   throw new Error('unimplemented');
// };
//
// Group.prototype.isVisible = function isVisible() {
//   if (!this.visible) {
//     return false;
//   }
//   const activeGroup = this.SK.getGroup(this.SS.GW.activeGroup);
//   if (this.order > activeGroup.order) {
//     return false;
//   }
//   return true;
// };
//
// Group.prototype.getNumConstraints = function getNumConstraints() {
//   var num = 0;
//   for (let i=0; i < this.SK.constraint.n; i++) {
//     const c = this.SK.constraint.elem[i];
//     if (c.group.v != this.h.v) {
//       continue;
//     }
//     num += 1;
//   }
//   return num;
// };
//
// [
//   'clear',
//   'addParam',
//   'isVisible',
//   'getNumConstraints',
//   'extrusionGetVector',
//   'extrusionForceVectorTo',
//   'menuGroup',
//   'transformImportedBy',
//   'descriptionString',
//   'activate',
//   'generate',
//   'isSolvedOkay',
//   'addEq',
//   'generateEquations',
//   'remap',
//   'makeExtrusionLines',
//   'makeLatheCircles',
//   'makeExtrusionTopBottomFaces',
//   'copyEntity',
// ]
//   .forEach((n) => {
//     Group.prototype[n] = function () {
//       debug(`function "${n}" requested`);
//       throw new Error('unimplemented');
//     };
//   });

module.exports = Group;
