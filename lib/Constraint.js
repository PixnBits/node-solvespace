const ConstraintBase = require('./ConstraintBase');

/**
 * description from  src/sketch.h:
 // These define how the constraint is drawn on-screen.
 struct {
    Vector      offset;
    hStyle      style;
 } disp;
 */
function Constraint(arg0) {
  const opts = arg0 || {};
  // super()
  ConstraintBase.call(this, opts);
  // I think this is the same as
  /*
  // See Entity::Entity().
  Constraint() : ConstraintBase({}), disp() {}
  */
}

Constraint.prototype = Object.create(ConstraintBase.prototype);
Constraint.prototype.constructor = Constraint;


/**
 * definition from src/sketch.h:673
 * @returns Boolean
 */
Constraint.prototype.isVisible = function isVisible() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:674
 * @returns Boolean
 */
Constraint.prototype.isStylable = function isStylable() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:675
 * @returns hStyle
 */
Constraint.prototype.getStyle = function getStyle() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:676
 * @returns Boolean
 */
Constraint.prototype.hasLabel = function hasLabel() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:677
 * @returns String
 */
Constraint.prototype.label = function label() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:680
 * @param String how (DEFAULT, HOVERED, SELECTED)
 * @param Canvas canvas
 */
Constraint.prototype.draw = function draw() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:681
 * @param Camera camera
 * @returns Vector
 */
Constraint.prototype.getLabelPos = function getLabelPos() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:682
 * @param Camera camera
 * @param std::vector<Vector> refs
 */
Constraint.prototype.getReferencePoints = function getReferencePoints() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:684
 * @param String how (DEFAULT, HOVERED, SELECTED)
 * @param Canvas canvas
 * @param Vector labelPos
 * @param std::vector<Vector> refs
 */
Constraint.prototype.doLayout = function doLayout() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:686
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector a
 * @param Vector b
 */
Constraint.prototype.doLine = function doLine() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:687
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector a
 * @param Vector b
 */
Constraint.prototype.doStippledLine = function doStippledLine() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:688
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector p0
 * @param Vector p1
 * @param Vector pt
 * @param Number salient
 * @returns Boolean
 */
Constraint.prototype.doLineExtend = function doLineExtend() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:690
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector a0
 * @param Vector da
 * @param Vector b0
 * @param Vector db
 * @param Vector offset
 * @param Vector ref
 * @param Boolean trim
 */
Constraint.prototype.doArcForAngle = function doArcForAngle() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:693
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector p
 * @param Vector dir
 * @param Vector n
 * @param Number width
 * @param Number angle
 * @param Number da
 */
Constraint.prototype.doArrow = function doArrow() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:695
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector ref
 * @param Vector a
 * @param Vector b
 * @param Boolean onlyOneExt
 */
Constraint.prototype.doLineWithArrows = function doLineWithArrows() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:697
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector ref
 * @param Vector a
 * @param Vector b
 * @param Boolean extend
 * @param Vector gr
 * @param Vector gu
 * @param Number swidth
 * @param Number sheight
 * @returns Number
 *
 * definition from src/sketch.h:700
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector ref
 * @param Vector a
 * @param Vector b
 * @param Boolean extend = true
 * @returns Number
 */
Constraint.prototype.doLineTrimmedAgainstBox = function doLineTrimmedAgainstBox() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:702
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector ref
 * @param Vector labelPos
 * @param Vector gr
 * @param Vector gu
 */
Constraint.prototype.doLabel = function doLabel() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:704
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector p
 *
 * definition from src/sketch.h:705
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector p
 * @param Vector n
 * @param Vector o
 */
Constraint.prototype.doProjectedPoint = function doProjectedPoint() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:707
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param Vector a
 * @param Vector b
 * @param Vector gn
 * @param Vector refp
 */
Constraint.prototype.doEqualLenTicks = function doEqualLenTicks() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:709
 * @param Canvas canvas
 * @param Canvas::hStroke hcs
 * @param hEntity he
 * @param Vector refp
 */
Constraint.prototype.doEqualRadiusTicks = function doEqualRadiusTicks() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:712
 * @returns String
 */
Constraint.prototype.descriptionString = function descriptionString() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:714
 * implementation from src/constraint.cpp:82
 * @param Constraint c
 * @param Boolean rememberForUndo
 * @returns hConstraint
 *
 * definition from src/sketch.h:715
 * implementation from src/constraint.cpp:78
 * @param Constraint c
 * @returns hConstraint
 */
Constraint.addConstraint = function addConstraint() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:716
 * @param Command id
 */
Constraint.menuConstrain = function menuConstrain() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:717
 * @param Constraint::Type type
 * @param hEntity entityA
 * @param hEntity ptA
 */
Constraint.deleteAllConstraintsFor = function deleteAllConstraintsFor() {
  throw new Error('unimplemented');
};


/**
 * definition from src/sketch.h:719
 * @param hEntity ptA
 * @param hEntity ptB
 * @returns hConstraint
 */
Constraint.constrainCoincident = function constrainCoincident() {
  throw new Error('unimplemented');
};

/**
 * definition from src/sketch.h:720
 * @param Constraint::Type type
 * @param hEntity ptA
 * @param hEntity ptB
 * @param hEntity entityA
 * @returns hConstraint
 *
 * definition from src/sketch.h:721
 * @param Constraint::Type type
 * @param hEntity ptA
 * @param hEntity ptB
 * @param hEntity entityA
 * @param hEntity entityB
 * @param Boolean other
 * @param Boolean other2
 * @returns hConstraint
 */
Constraint.constrain = function constrain() {
  throw new Error('unimplemented');
};

/***** Own Functions ******/
// As I think these make more sense in this port

/**
 * @param Sketch sketch The sketch to add the constraint to
 * @returns HConstraint
 */
Constraint.prototype.addToSketch = function addToSketch(sketch) {
  // TODO: undoRemember
  sketch.constraints.addAndAssignId(this);
  this.generate(sketch.params);

  // FIXME: SS.markGroupDirty
  sketch.getGroup(this.group).dofCheckOk = false;
  return this.h;
};

module.exports = Constraint;
