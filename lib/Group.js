// A set of requests. Every request must have an associated group.
// Implementation of the Group class, which represents a set of entities and
// constraints that are solved together, in some cases followed by another
// operation, like to extrude surfaces from the entities or to step and
// repeat them parametrically.

const Quaternion = require('./Quaternion');
const Expression = require('./Expression');
const ExpressionVector = require('./ExpressionVector');
const ExpressionQuaternion = require('./ExpressionQuaternion');
const Entity = require('./Entity');
const HGroup = require('./HGroup');
const HEntity = require('./HEntity');

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
function Group(arg0) {
  const opts = arg0 || {};

  this.tag = opts.tag || 0;
  this.h = opts.h || new HGroup();

  if ('type' in opts) { this.type = opts.type; }
  if ('order' in opts) { this.order = opts.order; }
  if ('opA' in opts) { this.opA = opts.opA; }
  if ('opB' in opts) { this.opB = opts.opB; }
  if ('visible' in opts) { this.visible = opts.visible; }
  if ('suppress' in opts) { this.suppress = opts.suppress; }
  if ('relaxConstraints' in opts) { this.relaxConstraints = opts.relaxConstraints; }
  if ('allowRedundant' in opts) { this.allowRedundant = opts.allowRedundant; }
  if ('allDimsReference' in opts) { this.allDimsReference = opts.allDimsReference; }
  if ('scale' in opts) { this.scale = opts.scale; }
  if ('clean' in opts) { this.clean = opts.clean; }
  if ('dofCheckOk' in opts) { this.dofCheckOk = opts.dofCheckOk; }
  if ('activeWorkplane' in opts) { this.activeWorkplane = opts.activeWorkplane; }
  if ('valA' in opts) { this.valA = opts.valA; }
  if ('valB' in opts) { this.valB = opts.valB; }
  if ('valC' in opts) { this.valC = opts.valC; }
  if ('color' in opts) { this.color = opts.color; }
  this.solved = opts.solved || {
    how: null,
    dof: null,
    remove: [],
  };
  if ('subtype' in opts) { this.subtype = opts.subtype; }
  if ('skipFirst' in opts) { this.skipFirst = opts.skipFirst; }
  this.predef = opts.predef || {
    q: null, // Quaternion
    origin: new HEntity(),
    entityB: new HEntity(),
    entityC: new HEntity(),
    swapUV: false,
    negateU: false,
    negateV: false,
  };
  if ('polyLoops' in opts) { this.polyLoops = opts.polyLoops; }
  if ('bezierLoops' in opts) { this.bezierLoops = opts.bezierLoops; }
  if ('bezierOpens' in opts) { this.bezierOpens = opts.bezierOpens; }
  if ('polyError' in opts) { this.polyError = opts.polyError; }
  if ('booleanFailed' in opts) { this.booleanFailed = opts.booleanFailed; }
  if ('thisShell' in opts) { this.thisShell = opts.thisShell; }
  if ('runningShell' in opts) { this.runningShell = opts.runningShell; }
  if ('thisMesh' in opts) { this.thisMesh = opts.thisMesh; }
  if ('runningMesh' in opts) { this.runningMesh = opts.runningMesh; }
  if ('displayDirty' in opts) { this.displayDirty = opts.displayDirty; }
  if ('displayMesh' in opts) { this.displayMesh = opts.displayMesh; }
  if ('displayOutlines' in opts) { this.displayOutlines = opts.displayOutlines; }
  if ('meshCombine' in opts) { this.meshCombine = opts.meshCombine; }
  if ('forceToMesh' in opts) { this.forceToMesh = opts.forceToMesh; }
  if ('remap' in opts) { this.remap = opts.remap; }
  if ('remapCache' in opts) { this.remapCache = opts.remapCache; }
  if ('linkFile' in opts) { this.linkFile = opts.linkFile; }
  if ('linkFileRel' in opts) { this.linkFileRel = opts.linkFileRel; }
  if ('impMesh' in opts) { this.impMesh = opts.impMesh; }
  if ('impShell' in opts) { this.impShell = opts.impShell; }
  if ('impEntity' in opts) { this.impEntity = opts.impEntity; }
  if ('name' in opts) { this.name = opts.name; }
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
 * implementation from group.cpp:357
 * @param EntityList entity
 * @param ParamList param
 */
Group.prototype.generate = function generate(sketch, entity, param) {
  const { type, subtype, predef, h } = this;
  // console.warn('Group.prototype.generate unimplemented, skipping'); return;
  // throw new Error('unimplemented');
  //
  // Vector gn = (SS.GW.projRight).Cross(SS.GW.projUp);
  // Vector gp = SS.GW.projRight.Plus(SS.GW.projUp);
  // Vector gc = (SS.GW.offset).ScaledBy(-1);
  // gn = gn.WithMagnitude(200/SS.GW.scale);
  // gp = gp.WithMagnitude(200/SS.GW.scale);
  // int a, i;
  switch (type) {
    case 'drawing-3d':
    return;

    case 'drawing-workplane': {
      let q; // Quaternion
      if(subtype == 'workplane-by-line-segments') {
        let u = sketch.getEntity(predef.entityB).vectorGetNum(sketch);
        let v = sketch.getEntity(predef.entityC).vectorGetNum(sketch);
        u = u.withMagnitude(1);
        const n = u.cross(v);
        v = (n.cross(u)).withMagnitude(1);

        if(predef.swapUV) { swap(u, v); }
        if(predef.negateU) { u = u.ScaledBy(-1); }
        if(predef.negateV) { v = v.ScaledBy(-1); }
        q = new Quaternion(u, v);
      } else if(subtype === 'workplane-by-point-ortho') {
        // Already given, numerically.
        q = predef.q;
      } else {
        throw new Error(`Unexpected workplane subtype ${subtype}`);
      }

      const normal = new Entity({
        type: 'normal-n-copy',
        numNormal: q,
        group: h,
        h: h.entity(1),
      });
      normal.point[0] = h.entity(2);
      entity.add(normal);

      const point = new Entity({
        type: 'point-n-copy',
        numPoint: sketch.getEntity(predef.origin).pointGetNum(),
        construction: true,
        group: h,
        h: h.entity(2),
      });
      entity.add(point);

      const wp = new Entity({
        type: 'workplane',
        normal: normal.h,
        point: [ point.h ],
        group: h,
        h: h.entity(0),
      });
      entity.add(wp);
      return;
    }
  //
  //   case Type::EXTRUDE: {
  //     AddParam(param, h.param(0), gn.x);
  //     AddParam(param, h.param(1), gn.y);
  //     AddParam(param, h.param(2), gn.z);
  //     int ai, af;
  //     if(subtype == Subtype::ONE_SIDED) {
  //       ai = 0; af = 2;
  //     } else if(subtype == Subtype::TWO_SIDED) {
  //       ai = -1; af = 1;
  //     } else ssassert(false, "Unexpected extrusion subtype");
  //
  //     // Get some arbitrary point in the sketch, that will be used
  //     // as a reference when defining top and bottom faces.
  //     hEntity pt = { 0 };
  //     for(i = 0; i < entity->n; i++) {
  //       Entity *e = &(entity->elem[i]);
  //       if(e->group.v != opA.v) continue;
  //
  //       if(e->IsPoint()) pt = e->h;
  //
  //       e->CalculateNumerical(/*forExport=*/false);
  //       hEntity he = e->h; e = NULL;
  //       // As soon as I call CopyEntity, e may become invalid! That
  //       // adds entities, which may cause a realloc.
  //       CopyEntity(entity, SK.GetEntity(he), ai, REMAP_BOTTOM,
  //       h.param(0), h.param(1), h.param(2),
  //       NO_PARAM, NO_PARAM, NO_PARAM, NO_PARAM,
  //       /*asTrans=*/true, /*asAxisAngle=*/false);
  //       CopyEntity(entity, SK.GetEntity(he), af, REMAP_TOP,
  //       h.param(0), h.param(1), h.param(2),
  //       NO_PARAM, NO_PARAM, NO_PARAM, NO_PARAM,
  //       /*asTrans=*/true, /*asAxisAngle=*/false);
  //       MakeExtrusionLines(entity, he);
  //     }
  //     // Remapped versions of that arbitrary point will be used to
  //     // provide points on the plane faces.
  //     MakeExtrusionTopBottomFaces(entity, pt);
  //     return;
  //   }
  //
  //   case Type::LATHE: {
  //     Vector axis_pos = SK.GetEntity(predef.origin)->PointGetNum();
  //     Vector axis_dir = SK.GetEntity(predef.entityB)->VectorGetNum();
  //
  //     AddParam(param, h.param(0), axis_dir.x);
  //     AddParam(param, h.param(1), axis_dir.y);
  //     AddParam(param, h.param(2), axis_dir.z);
  //
  //     // Remapped entity index.
  //     int ai = 1;
  //
  //     for(i = 0; i < entity->n; i++) {
  //       Entity *e = &(entity->elem[i]);
  //       if(e->group.v != opA.v) continue;
  //
  //       e->CalculateNumerical(/*forExport=*/false);
  //       hEntity he = e->h;
  //
  //       // As soon as I call CopyEntity, e may become invalid! That
  //       // adds entities, which may cause a realloc.
  //       CopyEntity(entity, SK.GetEntity(predef.origin), 0, ai,
  //       h.param(0), h.param(1), h.param(2),
  //       NO_PARAM, NO_PARAM, NO_PARAM, NO_PARAM,
  //       /*asTrans=*/true, /*asAxisAngle=*/false);
  //
  //       CopyEntity(entity, SK.GetEntity(he), 0, REMAP_LATHE_START,
  //       h.param(0), h.param(1), h.param(2),
  //       NO_PARAM, NO_PARAM, NO_PARAM, NO_PARAM,
  //       /*asTrans=*/true, /*asAxisAngle=*/false);
  //
  //       CopyEntity(entity, SK.GetEntity(he), 0, REMAP_LATHE_END,
  //       h.param(0), h.param(1), h.param(2),
  //       NO_PARAM, NO_PARAM, NO_PARAM, NO_PARAM,
  //       /*asTrans=*/true, /*asAxisAngle=*/false);
  //
  //       MakeLatheCircles(entity, param, he, axis_pos, axis_dir, ai);
  //       ai++;
  //     }
  //     return;
  //   }
  //
  //   case Type::TRANSLATE: {
  //     // inherit meshCombine from source group
  //     Group *srcg = SK.GetGroup(opA);
  //     meshCombine = srcg->meshCombine;
  //     // The translation vector
  //     AddParam(param, h.param(0), gp.x);
  //     AddParam(param, h.param(1), gp.y);
  //     AddParam(param, h.param(2), gp.z);
  //
  //     int n = (int)valA, a0 = 0;
  //     if(subtype == Subtype::ONE_SIDED && skipFirst) {
  //       a0++; n++;
  //     }
  //
  //     for(a = a0; a < n; a++) {
  //       for(i = 0; i < entity->n; i++) {
  //         Entity *e = &(entity->elem[i]);
  //         if(e->group.v != opA.v) continue;
  //
  //         e->CalculateNumerical(/*forExport=*/false);
  //         CopyEntity(entity, e,
  //           a*2 - (subtype == Subtype::ONE_SIDED ? 0 : (n-1)),
  //           (a == (n - 1)) ? REMAP_LAST : a,
  //           h.param(0), h.param(1), h.param(2),
  //           NO_PARAM, NO_PARAM, NO_PARAM, NO_PARAM,
  //           /*asTrans=*/true, /*asAxisAngle=*/false);
  //         }
  //       }
  //       return;
  //     }
  //     case Type::ROTATE: {
  //       // inherit meshCombine from source group
  //       Group *srcg = SK.GetGroup(opA);
  //       meshCombine = srcg->meshCombine;
  //       // The center of rotation
  //       AddParam(param, h.param(0), gc.x);
  //       AddParam(param, h.param(1), gc.y);
  //       AddParam(param, h.param(2), gc.z);
  //       // The rotation quaternion
  //       AddParam(param, h.param(3), 30*PI/180);
  //       AddParam(param, h.param(4), gn.x);
  //       AddParam(param, h.param(5), gn.y);
  //       AddParam(param, h.param(6), gn.z);
  //
  //       int n = (int)valA, a0 = 0;
  //       if(subtype == Subtype::ONE_SIDED && skipFirst) {
  //         a0++; n++;
  //       }
  //
  //       for(a = a0; a < n; a++) {
  //         for(i = 0; i < entity->n; i++) {
  //           Entity *e = &(entity->elem[i]);
  //           if(e->group.v != opA.v) continue;
  //
  //           e->CalculateNumerical(/*forExport=*/false);
  //           CopyEntity(entity, e,
  //             a*2 - (subtype == Subtype::ONE_SIDED ? 0 : (n-1)),
  //             (a == (n - 1)) ? REMAP_LAST : a,
  //             h.param(0), h.param(1), h.param(2),
  //             h.param(3), h.param(4), h.param(5), h.param(6),
  //             /*asTrans=*/false, /*asAxisAngle=*/true);
  //           }
  //         }
  //         return;
  //       }
  //       case Type::LINKED:
  //       // The translation vector
  //       AddParam(param, h.param(0), gp.x);
  //       AddParam(param, h.param(1), gp.y);
  //       AddParam(param, h.param(2), gp.z);
  //       // The rotation quaternion
  //       AddParam(param, h.param(3), 1);
  //       AddParam(param, h.param(4), 0);
  //       AddParam(param, h.param(5), 0);
  //       AddParam(param, h.param(6), 0);
  //
  //       for(i = 0; i < impEntity.n; i++) {
  //         Entity *ie = &(impEntity.elem[i]);
  //         CopyEntity(entity, ie, 0, 0,
  //           h.param(0), h.param(1), h.param(2),
  //           h.param(3), h.param(4), h.param(5), h.param(6),
  //           /*asTrans=*/false, /*asAxisAngle=*/false);
  //         }
  //         return;
    default:
      throw new Error(`Unexpected group type ${type}`);
  }
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
