/**
 * definition from expr.h:123
 * definition from expr.h:127
 * implementation from expr.cpp:110
 * definition from expr.h:128
 * implementation from expr.cpp:120
 * definition from expr.h:129
 * implementation from expr.cpp:101
 * @member Expression w
 * @member Expression vx
 * @member Expression vy
 * @member Expression vz
 */
function ExpressionQuaternion() {
}

/**
 * definition from expr.h:131
 * implementation from expr.cpp:129
 * @returns ExpressionVector
 */
ExpressionQuaternion.prototype.rotationU = function rotationU() {
  throw new Error('unimplemented');
};

/**
 * definition from expr.h:132
 * implementation from expr.cpp:147
 * @returns ExpressionVector
 */
ExpressionQuaternion.prototype.rotationV = function rotationV() {
  throw new Error('unimplemented');
};

/**
 * definition from expr.h:133
 * implementation from expr.cpp:165
 * @returns ExpressionVector
 */
ExpressionQuaternion.prototype.rotationN = function rotationN() {
  throw new Error('unimplemented');
};


/**
 * definition from expr.h:135
 * implementation from expr.cpp:183
 * @param ExpressionVector p
 * @returns ExpressionVector
 */
ExpressionQuaternion.prototype.rotate = function rotate() {
  throw new Error('unimplemented');
};

/**
 * definition from expr.h:136
 * implementation from expr.cpp:190
 * @param ExprQuaternion b
 * @returns ExprQuaternion
 */
ExpressionQuaternion.prototype.times = function times() {
  throw new Error('unimplemented');
};


/**
 * definition from expr.h:138
 * implementation from expr.cpp:206
 * @returns Expr
 */
ExpressionQuaternion.prototype.magnitude = function magnitude() {
  throw new Error('unimplemented');
};

module.exports = ExpressionQuaternion;
